const bcrypt = require('bcrypt')

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

module.exports = { getHashed, validatePassword }
