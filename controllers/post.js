const Post = require("../models/Post");

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).sort('-created');

        res.status(200).json({
            ok: true,
            posts
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error getting posts',
            error
        });
    };
};

const newPost = async (req, res) => {
    const post = new Post( req.body );

    try {
        post.user = req.uid;        

        const postCreated = await post.save();

        res.status(201).json({
            ok: true,
            post: postCreated
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error creating post',
            error
        });
    };
};

const deletePost = async (req, res) => {
    const { id } = req.params;
    const { uid } = req;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                ok: false,
                msg: 'Post not found'
            });
        };

        if (post.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'Not authorized'
            });
        };

        await Post.findByIdAndDelete(id);

        res.status(200).json({
            ok: true,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error deleting post',
            error
        });
    };
};

module.exports = {
    getPosts,
    newPost,
    deletePost
};