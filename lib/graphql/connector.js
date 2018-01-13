const Post = require('./../database/post').Post
const User = require('./../database/user').User

function getAllPostsByUser(id) {
	return Post.findAll(
		{
			userId: id
		},
		0,
		1
	)
}

function getPostAuthor(id) {
	return User.findOne(id)
}

module.exports = {
	getAllPostsByUser,
	getPostAuthor
}
