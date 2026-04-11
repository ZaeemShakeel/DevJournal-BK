import Post from '../models/Post.js';
import User from '../models/User.js';

export const getPosts = async (req, res) => {
  try {
    let query = {};
    if (req.query.author === 'me' && req.user) {
      query.author = req.user.id;
    } else if (req.query.username) {
      const user = await User.findOne({ username: req.query.username });
      if (user) {
        query.author = user._id;
      } else {
        return res.json({ success: true, count: 0, data: [] });
      }
    }

    const posts = await Post.find(query)
      .populate('author', 'name email username profilePic bio designation')
      .sort('-createdAt');
    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email username profilePic bio designation');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    req.body.author = req.user.id;
    const post = await Post.create(req.body);
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name email username profilePic bio designation');
    
    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      // { returnDocument: 'after', runValidators: true }
      { new: true, runValidators: true }
      
    ).populate('author', 'name email username profilePic bio designation');

    res.json({ success: true, data: post });
    console.log("BODY:", req.body);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};