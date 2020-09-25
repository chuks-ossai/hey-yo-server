const PostController = {
    getAll: async (req, res, next) => { },
    
    getById: async (req, res, next) => { },
    
    getByUser: async (req, res, next) => { },
    
    createNew: async (req, res, next) => { 
        res.status(200).json({
            Success: true,
            ErrorMessage: null,
            Results: [req.body]
        })
    },
    
    removeById: async (req, res, next) => { },
    
    removeSingleUserPost: async (req, res, next) => { },
    
    removeAllUserPosts: async (req, res, next) => { },
    
    editById: async (req, res, next) => { },
};

module.exports = PostController;