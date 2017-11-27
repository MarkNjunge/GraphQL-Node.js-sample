const Mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const lodash = require('lodash')

const JWT_SECRET = process.env.JWT_SECRET

const UserSchema = Mongoose.Schema({
	id: String,
	fullname: String,
	email: {
		type: String,
		unique: true
	},
	photoUrl: {
		type: String,
		default: 'http://via.placeholder.com/500x500'
	},
	password: String,
	role: String
})

const UserModel = Mongoose.model('user', UserSchema)

const User = {
	findAll(filter) {
		return UserModel.find(filter)
	},
	findOne(id) {
		const filter = {
			id
		}
		return new Promise((resolve, reject) => {
			UserModel.findOne(filter, (err, res) => {
				if (err) {
					reject(err)
				} else if (res === null) {
					reject('The user does not exist.')
				} else {
					resolve(res)
				}
			})
		})
	},
	register(fullname, email, photoUrl, password) {
		return new Promise((resolve, reject) => {
			// Check that a user with the same email does not exist
			checkExistence(email, false)
				.then(() => getHashed(password))
				.then(hashed => {
					const user = new UserModel({
						id: Mongoose.Types.ObjectId(),
						fullname,
						email: email.toLowerCase(),
						photoUrl,
						password: hashed
					})
					// Save the created user
					user.save(err => {
						if (err) reject(err.message)

						resolve(createAuthenticationReturn(user))
					})
				})
				.catch(reason => reject(reason))
		})
	},
	login(email, password) {
		return new Promise((resolve, reject) => {
			checkExistence(email, true)
				.then(user => validatePassword(password, user))
				.then(user => resolve(createAuthenticationReturn(user)))
				.catch(reason => reject(reason))
		})
	},
	update(id, fullname, email, photoUrl) {
		return new Promise((resolve, reject) => {
			User.findOne(id).then(user => {
				fullname ? (user.fullname = fullname) : false
				email ? (user.email = email) : false
				photoUrl ? (user.photoUrl = photoUrl) : false

				const filter = {
					id
				}

				UserModel.update(filter, user, err => {
					if (err) reject(err)

					resolve('The user has been updated.')
				})
			})
		})
	},
	changePassword(id, currentPassword, newPassword) {
		return new Promise((resolve, reject) => {
			User.findOne(id)
				.then(user => validatePassword(currentPassword, user))
				.then(user => {
					getHashed(newPassword)
						.then(hashed => {
							user.password = hashed

							const filter = {
								id
							}

							UserModel.update(filter, user, err => {
								if (err) reject(err)

								resolve('The password has been changed.')
							})
						})
						.catch(reason => reject(reason))
				})
				.catch(reason => reject(reason))
		})
	}
}

function createAuthenticationReturn(user) {
	// Generate a token with the userId and role
	const token = jwt.sign(
		{
			user: lodash.pick(user, ['id', 'role'])
		},
		JWT_SECRET,
		{
			expiresIn: '1y'
		}
	)

	const decoded = jwt.decode(token)

	// Get the userId, created time and expiration time from the token and add it to the return
	return {
		userId: user.id,
		token,
		created: decoded.iat,
		expires: decoded.exp
	}
}

function checkExistence(email, shouldExist) {
	let filter = {
		email
	}

	return new Promise((resolve, reject) => {
		UserModel.findOne(filter, (err, res) => {
			if (err) {
				reject(err)
			}
			if (shouldExist && res === null) {
				reject('The user does not exist')
			} else if (!shouldExist && res !== null) {
				reject('There is already a user with that email')
			}
			resolve(res)
		})
	})
}

function getHashed(password) {
	const salt = bcrypt.genSaltSync(12)

	return new Promise((resolve, reject) => {
		bcrypt.hash(password, salt, (err, encrypted) => {
			if (err) {
				reject(err.message)
			} else {
				resolve(encrypted)
			}
		})
	})
}

function validatePassword(password, user) {
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, user.password, (err, same) => {
			if (err) {
				reject(err.message)
			} else if (!same) {
				reject('The email or password is incorrect')
			} else {
				resolve(user)
			}
		})
	})
}

module.exports = {
	User
}
