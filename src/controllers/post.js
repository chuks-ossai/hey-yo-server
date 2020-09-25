const Joi = require('joi');
const Post = require('../models/post')

const PostController = {
    getAll: async (req, res, next) => { },
    
    getById: async (req, res, next) => { },
    
    getByUser: async (req, res, next) => { },
    
    createNew: async (req, res, next) => {
        const schema = Joi.object({
            content: Joi.string()
                .required(),
        });

        const { error, value } = schema.validate(req.body);
        if (error) {
            const err = new Error(error.message);
            err.status = HttpStatusCodes.OK;
            return next(err)
        };
        const newPost = new Post({
            user: req.user._id,
            username: req.user.username,
            content: req.body.content
        })

        const post = await newPost.save();
        if (!post) {
            const err = new Error('Something went wrong while trying to save post');
            err.status = HttpStatusCodes.OK;
            return next(err)
        }
        await res.status(200).json({
            Success: true,
            ErrorMessage: null,
            Results: [{message: 'Post created successfully', post: post.toObject()}]
        })
    },
    
    removeById: async (req, res, next) => { },
    
    removeSingleUserPost: async (req, res, next) => { },
    
    removeAllUserPosts: async (req, res, next) => { },
    
    editById: async (req, res, next) => { },
};

module.exports = PostController;