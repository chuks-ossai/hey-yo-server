const Joi = require('joi');
const Post = require('../models/post')

const PostController = {
    getAll: async (req, res, next) => {
        const posts = await Post.find({}).populate('user').sort({createdAt: -1});

        if (!posts) {
            const error = new Error('Something went wrong while trying to get posts');
            error.status = 200;
            return next(error);
        }

        await res.status(200).json({
            ErrorMessage: null,
            Success: true,
            Results: posts
        })
     },
    
    getById: async (req, res, next) => { },
    
    getByUser: async (req, res, next) => { },

    getAllMyPosts: async (req, res, next) => {
        const posts = await Post.find({user: req.user._id});
        if (!posts) {
            const error = new Error('No user found');
            error.status = 200;
            return next(error);
        }

        await res.status(200).json({
            ErrorMessage: null,
            Success: true,
            Results: posts
        })
    },
    
    createNew: async (req, res, next) => {
        const schema = Joi.object({
            content: Joi.string()
                .required(),
            title: Joi.string()
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
            title: req.body.title,
            content: req.body.content
        })

        const savedPost = await newPost.save();
        if (!savedPost) {
            const err = new Error('Something went wrong while trying to save post');
            err.status = HttpStatusCodes.OK;
            return next(err)
        }
        await res.status(200).json({
            Success: true,
            ErrorMessage: null,
            Results: [{message: 'Post created successfully', post: savedPost.toObject()}]
        })
    },
    
    removeById: async (req, res, next) => { },
    
    removeSingleUserPost: async (req, res, next) => { },
    
    removeAllUserPosts: async (req, res, next) => { },
    
    editById: async (req, res, next) => { },
};

module.exports = PostController;