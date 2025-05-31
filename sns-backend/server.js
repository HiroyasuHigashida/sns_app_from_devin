const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.warn('WARNING: JWT_SECRET environment variable not set. Using random secret for development.');
  return require('crypto').randomBytes(64).toString('hex');
})();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: 'text/plain' }));

const users = [];
const posts = [];
const follows = [];
const likes = [];

function findUserById(id) {
  return users.find(user => user.id === id);
}

function findUserByUsername(username) {
  return users.find(user => user.username === username);
}

function findUserByEmail(email) {
  return users.find(user => user.email === email);
}

function authenticateToken(req, res, next) {
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
}

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
      bio: '',
      created_at: new Date().toISOString(),
      hashed_password: hashedPassword,
      followers_count: 0,
      following_count: 0
    };

    users.push(user);

    const token = jwt.sign(
      { user_id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        created_at: user.created_at,
        followers_count: user.followers_count,
        following_count: user.following_count
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
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

    const isValidPassword = await bcrypt.compare(password, user.hashed_password);
    if (!isValidPassword) {
      return res.status(401).json({ detail: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { user_id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        created_at: user.created_at,
        followers_count: user.followers_count,
        following_count: user.following_count
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.get('/users/me', authenticateToken, (req, res) => {
  const user = findUserById(req.user.user_id);
  if (!user) {
    return res.status(404).json({ detail: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    bio: user.bio,
    created_at: user.created_at,
    followers_count: user.followers_count,
    following_count: user.following_count
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

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    bio: user.bio,
    created_at: user.created_at,
    followers_count: user.followers_count,
    following_count: user.following_count
  });
});

app.get('/users/:username', authenticateToken, (req, res) => {
  const { username } = req.params;
  const user = findUserByUsername(username);
  
  if (!user) {
    return res.status(404).json({ detail: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    name: user.name,
    bio: user.bio,
    created_at: user.created_at,
    followers_count: user.followers_count,
    following_count: user.following_count
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
    .map(user => ({
      id: user.id,
      username: user.username,
      name: user.name,
      bio: user.bio,
      created_at: user.created_at,
      followers_count: user.followers_count,
      following_count: user.following_count
    }));

  res.json(searchResults);
});

app.post('/posts', authenticateToken, (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    if (!req.body) {
      return res.status(400).json({ detail: 'Request body is missing' });
    }
    
    let parsedBody;
    try {
      parsedBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (error) {
      return res.status(400).json({ detail: 'Invalid JSON in request body' });
    }
    
    const { content } = parsedBody;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ detail: 'Content is required' });
    }

    if (content.length > 280) {
      return res.status(400).json({ detail: 'Content must be 280 characters or less' });
    }

    const user = findUserById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ detail: 'User not found' });
    }

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
    console.log(`Post created: ${post.id} by ${user.username}`);
    res.json(post);
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

app.get('/posts/timeline', authenticateToken, (req, res) => {
  const user = findUserById(req.user.user_id);
  if (!user) {
    return res.status(404).json({ detail: 'User not found' });
  }

  const followedUserIds = follows
    .filter(follow => follow.follower_id === user.id)
    .map(follow => follow.following_id);

  followedUserIds.push(user.id);

  const timelinePosts = posts
    .filter(post => followedUserIds.includes(post.user_id))
    .map(post => {
      const isLiked = likes.some(like => 
        like.post_id === post.id && like.user_id === user.id
      );
      const likesCount = likes.filter(like => like.post_id === post.id).length;
      
      return {
        ...post,
        likes_count: likesCount,
        liked_by_user: isLiked
      };
    });

  res.json(timelinePosts);
});

app.delete('/posts/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex(post => 
    post.id === id && post.user_id === req.user.user_id
  );

  if (postIndex === -1) {
    return res.status(404).json({ detail: 'Post not found or not authorized' });
  }

  posts.splice(postIndex, 1);
  res.json({ message: 'Post deleted successfully' });
});

app.get('/posts/search', authenticateToken, (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.json([]);
  }

  const user = findUserById(req.user.user_id);
  if (!user) {
    return res.status(404).json({ detail: 'User not found' });
  }

  const searchResults = posts
    .filter(post => 
      post.content.toLowerCase().includes(q.toLowerCase())
    )
    .map(post => {
      const isLiked = likes.some(like => 
        like.post_id === post.id && like.user_id === user.id
      );
      const likesCount = likes.filter(like => like.post_id === post.id).length;
      
      return {
        ...post,
        likes_count: likesCount,
        liked_by_user: isLiked
      };
    });

  res.json(searchResults);
});

app.post('/follow/:userId', authenticateToken, (req, res) => {
  const { userId } = req.params;
  const followerId = req.user.user_id;

  if (followerId === userId) {
    return res.status(400).json({ detail: 'Cannot follow yourself' });
  }

  const existingFollow = follows.find(f => 
    f.follower_id === followerId && f.following_id === userId
  );

  if (existingFollow) {
    return res.status(400).json({ detail: 'Already following this user' });
  }

  const targetUser = findUserById(userId);
  const followerUser = findUserById(followerId);

  if (!targetUser || !followerUser) {
    return res.status(404).json({ detail: 'User not found' });
  }

  follows.push({
    id: uuidv4(),
    follower_id: followerId,
    following_id: userId,
    created_at: new Date().toISOString()
  });

  targetUser.followers_count++;
  followerUser.following_count++;

  res.json({ message: 'Successfully followed user' });
});

app.delete('/follow/:userId', authenticateToken, (req, res) => {
  const { userId } = req.params;
  const followerId = req.user.user_id;

  const followIndex = follows.findIndex(f => 
    f.follower_id === followerId && f.following_id === userId
  );

  if (followIndex === -1) {
    return res.status(404).json({ detail: 'Not following this user' });
  }

  follows.splice(followIndex, 1);

  const targetUser = findUserById(userId);
  const followerUser = findUserById(followerId);

  if (targetUser) targetUser.followers_count--;
  if (followerUser) followerUser.following_count--;

  res.json({ message: 'Successfully unfollowed user' });
});

app.post('/posts/:id/like', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.user_id;

  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ detail: 'Post not found' });
  }

  const existingLike = likes.find(like => 
    like.post_id === id && like.user_id === userId
  );

  if (existingLike) {
    return res.status(400).json({ detail: 'Already liked this post' });
  }

  likes.push({
    id: uuidv4(),
    post_id: id,
    user_id: userId,
    created_at: new Date().toISOString()
  });

  const likesCount = likes.filter(like => like.post_id === id).length;
  res.json({ message: 'Post liked successfully', likes_count: likesCount });
});

app.delete('/posts/:id/like', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.user_id;

  const likeIndex = likes.findIndex(like => 
    like.post_id === id && like.user_id === userId
  );

  if (likeIndex === -1) {
    return res.status(404).json({ detail: 'Like not found' });
  }

  likes.splice(likeIndex, 1);

  const likesCount = likes.filter(like => like.post_id === id).length;
  res.json({ message: 'Post unliked successfully', likes_count: likesCount });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`SNS API server running on port ${PORT}`);
});
