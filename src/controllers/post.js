const Joi = require('joi');
const Post = require('../models/post')

const PostController = {
    getAll: async (req, res, next) => {
        const posts = await Post.find({}).populate('user').sort({createdAt: -1});
        const topPosts = await Post.find({ $and: [{ totalLikes: { $gte: 2 } }, {'comments.2': {$exists: true}}]}).populate('user').sort({createdAt: -1});

        if (!posts) {
            const error = new Error('Something went wrong while trying to get posts');
            error.status = 200;
            return next(error);
        }

        await res.status(200).json({
            ErrorMessage: null,
            Success: true,
            Results: [{ posts, topPosts}]
        })
     },
    
    getById: async (req, res, next) => { 
        const post = await Post.findById(req.params.id).populate('user').populate('comments.user');

        if (!post) {
            const error = new Error('Something went wrong while trying to get posts');
            error.status = 200;
            return next(error);
        }

        const postObj = await post.toObject()
        delete postObj.user.password;

        await res.status(200).json({
            ErrorMessage: null,
            Success: true,
            Results: [{post: postObj, message: 'Post found'}]
        })
    },
    
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

    like: async (req, res, next) => {

        const postId = await req.body._id

        const updatedPost = await Post.updateOne({
            _id: postId,
            'likes.username': { $ne: req.user.username }
        }, {
            $push: {
                likes: { username: req.user.username }
                },
            $inc: {totalLikes: 1 }
        });

        if (!updatedPost) {
            const error = new Error('Unable like post');
            error.status = 200;
            return next(error);
        }

        await res.status(200).json({
            Success: true,
            ErrorMessage: null,
            Results: [{ message: 'Post liked successfully' }]
        })

    },

    unlike: async (req, res, next) => {

        const postId = await req.body._id

        const updatedPost = await Post.updateOne({
            _id: postId,
            'likes.username': { $eq: req.user.username }
        }, {
            $pull: {
                likes: { username: req.user.username }
                },
            $inc: {totalLikes: -1 }
        });

        if (!updatedPost.nModified) {
            const error = new Error('Unable like post');
            error.status = 200;
            return next(error);
        }

        await res.status(200).json({
            Success: true,
            ErrorMessage: null,
            Results: [{ message: 'Post unliked successfully' }]
        })

    },

    comment: async (req, res, next) => {

        const postId = await req.body.postId

        const updatedPost = await Post.updateOne({
            _id: postId
        }, {
            $push: {
                comments: {
                    user: req.user._id,
                    username: req.user.username,
                    comment: req.body.content,
                    createAt: Date.now()
                }
            }
        });

        if (!updatedPost) {
            const error = new Error('Unable to make comment on post');
            error.status = 200;
            return next(error);
        }

        await res.status(200).json({
            Success: true,
            ErrorMessage: null,
            Results: [{ message: 'Successfully commented on post' }]
        })

    },
    
    removeById: async (req, res, next) => { },
    
    removeSingleUserPost: async (req, res, next) => { },
    
    removeAllUserPosts: async (req, res, next) => { },
    
    editById: async (req, res, next) => { },
};

module.exports = PostController;