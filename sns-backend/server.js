const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.warn('WARNING: JWT_SECRET environment variable not set. Using random secret for development.');
  return require('crypto').randomBytes(64).toString('hex');
})();

app.use(cors());
app.use(express.json());

const users = [];
const posts = [];
const follows = [];
const likes = [];

const findUserByUsername = (username) => users.find(u => u.username === username);
const findUserById = (id) => users.find(u => u.id === id);
const findUserByEmail = (email) => users.find(u => u.email === email);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ detail: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ detail: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    if (!username || !email || !password || !name) {
      return res.status(400).json({ detail: 'All fields are required' });
    }

    if (findUserByUsername(username)) {
      return res.status(400).json({ detail: 'Username already exists' });
    }

    if (findUserByEmail(email)) {
      return res.status(400).json({ detail: 'Email already exists' });
    }

    if (password.length < 6) {
      return res.status(400).json({ detail: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      username,
      email,
      name,
      password: hashedPassword,
      bio: '',
      created_at: new Date().toISOString()
    };

    users.push(user);

    const token = jwt.sign({ user_id: user.id, username: user.username }, JWT_SECRET);
    
    res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio
      }
    });
  } catch (error) {
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ detail: 'Username and password are required' });
    }

    const user = findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ detail: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ detail: 'Invalid username or password' });
    }

    const token = jwt.sign({ user_id: user.id, username: user.username }, JWT_SECRET);
    
    res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio
      }
    });
  } catch (error) {
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.get('/users/me', authenticateToken, (req, res) => {
  const user = findUserById(req.user.user_id);
  if (!user) {
    return res.status(404).json({ detail: 'User not found' });
  }

  const followerCount = follows.filter(f => f.followed_id === user.id).length;
  const followingCount = follows.filter(f => f.follower_id === user.id).length;

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    bio: user.bio,
    followers_count: followerCount,
    following_count: followingCount
  });
});

app.put('/users/me', authenticateToken, (req, res) => {
  const { name, bio } = req.body;
  const user = findUserById(req.user.user_id);
  
  if (!user) {
    return res.status(404).json({ detail: 'User not found' });
  }

  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;

  const followerCount = follows.filter(f => f.followed_id === user.id).length;
  const followingCount = follows.filter(f => f.follower_id === user.id).length;

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    bio: user.bio,
    followers_count: followerCount,
    following_count: followingCount
  });
});

app.get('/users/:username', authenticateToken, (req, res) => {
  const user = findUserByUsername(req.params.username);
  if (!user) {
    return res.status(404).json({ detail: 'User not found' });
  }

  const followerCount = follows.filter(f => f.followed_id === user.id).length;
  const followingCount = follows.filter(f => f.follower_id === user.id).length;
  const isFollowing = follows.some(f => f.follower_id === req.user.user_id && f.followed_id === user.id);

  res.json({
    id: user.id,
    username: user.username,
    name: user.name,
    bio: user.bio,
    followers_count: followerCount,
    following_count: followingCount,
    is_following: isFollowing
  });
});

app.get('/users/search', authenticateToken, (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json([]);
  }

  const searchResults = users
    .filter(user => 
      user.username.toLowerCase().includes(q.toLowerCase()) ||
      user.name.toLowerCase().includes(q.toLowerCase())
    )
    .slice(0, 20)
    .map(user => ({
      id: user.id,
      username: user.username,
      name: user.name,
      bio: user.bio
    }));

  res.json(searchResults);
});

app.post('/posts', authenticateToken, (req, res) => {
  const { content } = req.body;
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ detail: 'Content is required' });
  }

  if (content.length > 280) {
    return res.status(400).json({ detail: 'Content must be 280 characters or less' });
  }

  const user = findUserById(req.user.user_id);
  const post = {
    id: uuidv4(),
    user_id: user.id,
    username: user.username,
    name: user.name,
    content: content.trim(),
    created_at: new Date().toISOString(),
    likes_count: 0,
    liked_by_user: false
  };

  posts.unshift(post);
  res.json(post);
});

app.get('/posts/timeline', authenticateToken, (req, res) => {
  const followedUserIds = follows
    .filter(f => f.follower_id === req.user.user_id)
    .map(f => f.followed_id);
  
  followedUserIds.push(req.user.user_id);

  const timelinePosts = posts
    .filter(post => followedUserIds.includes(post.user_id))
    .map(post => {
      const likesCount = likes.filter(l => l.post_id === post.id).length;
      const likedByUser = likes.some(l => l.post_id === post.id && l.user_id === req.user.user_id);
      
      return {
        ...post,
        likes_count: likesCount,
        liked_by_user: likedByUser
      };
    });

  res.json(timelinePosts);
});

app.delete('/posts/:post_id', authenticateToken, (req, res) => {
  const postIndex = posts.findIndex(p => p.id === req.params.post_id);
  
  if (postIndex === -1) {
    return res.status(404).json({ detail: 'Post not found' });
  }

  if (posts[postIndex].user_id !== req.user.user_id) {
    return res.status(403).json({ detail: 'Not authorized to delete this post' });
  }

  posts.splice(postIndex, 1);
  
  const likeIndices = [];
  likes.forEach((like, index) => {
    if (like.post_id === req.params.post_id) {
      likeIndices.push(index);
    }
  });
  likeIndices.reverse().forEach(index => likes.splice(index, 1));

  res.json({ message: 'Post deleted successfully' });
});

app.get('/posts/search', authenticateToken, (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json([]);
  }

  const searchResults = posts
    .filter(post => post.content.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 20)
    .map(post => {
      const likesCount = likes.filter(l => l.post_id === post.id).length;
      const likedByUser = likes.some(l => l.post_id === post.id && l.user_id === req.user.user_id);
      
      return {
        ...post,
        likes_count: likesCount,
        liked_by_user: likedByUser
      };
    });

  res.json(searchResults);
});

app.post('/follow/:user_id', authenticateToken, (req, res) => {
  const targetUserId = req.params.user_id;
  const currentUserId = req.user.user_id;

  if (targetUserId === currentUserId) {
    return res.status(400).json({ detail: 'Cannot follow yourself' });
  }

  const targetUser = findUserById(targetUserId);
  if (!targetUser) {
    return res.status(404).json({ detail: 'User not found' });
  }

  const existingFollow = follows.find(f => 
    f.follower_id === currentUserId && f.followed_id === targetUserId
  );

  if (existingFollow) {
    return res.status(400).json({ detail: 'Already following this user' });
  }

  follows.push({
    id: uuidv4(),
    follower_id: currentUserId,
    followed_id: targetUserId,
    created_at: new Date().toISOString()
  });

  res.json({ message: 'Successfully followed user' });
});

app.delete('/follow/:user_id', authenticateToken, (req, res) => {
  const targetUserId = req.params.user_id;
  const currentUserId = req.user.user_id;

  const followIndex = follows.findIndex(f => 
    f.follower_id === currentUserId && f.followed_id === targetUserId
  );

  if (followIndex === -1) {
    return res.status(404).json({ detail: 'Not following this user' });
  }

  follows.splice(followIndex, 1);
  res.json({ message: 'Successfully unfollowed user' });
});

app.post('/posts/:post_id/like', authenticateToken, (req, res) => {
  const postId = req.params.post_id;
  const userId = req.user.user_id;

  const post = posts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ detail: 'Post not found' });
  }

  const existingLike = likes.find(l => l.post_id === postId && l.user_id === userId);
  if (existingLike) {
    return res.status(400).json({ detail: 'Already liked this post' });
  }

  likes.push({
    id: uuidv4(),
    post_id: postId,
    user_id: userId,
    created_at: new Date().toISOString()
  });

  res.json({ message: 'Post liked successfully' });
});

app.delete('/posts/:post_id/like', authenticateToken, (req, res) => {
  const postId = req.params.post_id;
  const userId = req.user.user_id;

  const likeIndex = likes.findIndex(l => l.post_id === postId && l.user_id === userId);
  if (likeIndex === -1) {
    return res.status(404).json({ detail: 'Like not found' });
  }

  likes.splice(likeIndex, 1);
  res.json({ message: 'Post unliked successfully' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'SNS API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ detail: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ detail: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`SNS API server running on port ${PORT}`);
});

module.exports = app;
