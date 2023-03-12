import Post from '../models/Post.js'
import User from '../models/User.js';

export const createPost = async (req, res) => {
    try {
        const {
            userId,
            description,
            picturePath,
        } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            description,
            location: user.location,
            picturePath,
            userPicturePath: user.picturePath,
            likes: {},
            comments: [],
        });
        await newPost.save();

        const posts = await Post.find();


        res.status(200).json(posts.sort((a, b) => {
            return b.createdAt - a.createdAt
        }));
    } catch (err) {
        res.status(409).json({ msg: err.error });
    }
}

export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        res.status(200).json(posts.sort((a, b) => {
            return b.createdAt - a.createdAt
        }));
    } catch (err) {
        res.status(409).json({ msg: err.error });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId: userId });

        res.status(200).json(posts.sort((a, b) => {
            return b.createdAt - a.createdAt
        }));
    } catch (err) {
        res.status(409).json({ msg: err.error });
    }
}

export const likePosts = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updataedPost = await Post.findByIdAndUpdate(id,
            { likes: post.likes },
            { new: true });

        res.status(200).json(updataedPost);

    } catch (err) {
        res.status(409).json({ msg: err.error });
    }
}