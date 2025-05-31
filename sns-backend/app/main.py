from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import hashlib
import jwt
import uuid
from collections import defaultdict
import re

app = FastAPI()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

users_db: Dict[str, Dict[str, Any]] = {}
posts_db: Dict[str, Dict[str, Any]] = {}
follows_db: Dict[str, set] = defaultdict(set)  # user_id -> set of followed user_ids
likes_db: Dict[str, set] = defaultdict(set)  # post_id -> set of user_ids who liked

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: str
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=1, max_length=50)

class UserLogin(BaseModel):
    username: str
    password: str

class UserProfile(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    bio: str = Field(default="", max_length=160)

class PostCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=280)

class User(BaseModel):
    id: str
    username: str
    email: str
    name: str
    bio: str
    created_at: datetime
    followers_count: int
    following_count: int

class Post(BaseModel):
    id: str
    user_id: str
    username: str
    name: str
    content: str
    created_at: datetime
    likes_count: int
    liked_by_user: bool = False

class Token(BaseModel):
    access_token: str
    token_type: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        if user_id not in users_db:
            raise HTTPException(status_code=401, detail="User not found")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_user_counts(user_id: str):
    followers_count = sum(1 for followed_set in follows_db.values() if user_id in followed_set)
    following_count = len(follows_db[user_id])
    return followers_count, following_count

@app.post("/auth/register", response_model=Token)
async def register(user: UserCreate):
    for existing_user in users_db.values():
        if existing_user["username"] == user.username:
            raise HTTPException(status_code=400, detail="Username already exists")
        if existing_user["email"] == user.email:
            raise HTTPException(status_code=400, detail="Email already exists")
    
    if not re.match(r'^[a-zA-Z0-9_]+$', user.username):
        raise HTTPException(status_code=400, detail="Username can only contain letters, numbers, and underscores")
    
    user_id = str(uuid.uuid4())
    users_db[user_id] = {
        "id": user_id,
        "username": user.username,
        "email": user.email,
        "password": hash_password(user.password),
        "name": user.name,
        "bio": "",
        "created_at": datetime.utcnow()
    }
    
    access_token = create_access_token(data={"sub": user_id})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=Token)
async def login(user: UserLogin):
    user_data = None
    for uid, data in users_db.items():
        if data["username"] == user.username:
            user_data = data
            break
    
    if not user_data or not verify_password(user.password, user_data["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user_data["id"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def get_current_user_profile(current_user: str = Depends(get_current_user)):
    user_data = users_db[current_user]
    followers_count, following_count = get_user_counts(current_user)
    
    return User(
        id=user_data["id"],
        username=user_data["username"],
        email=user_data["email"],
        name=user_data["name"],
        bio=user_data["bio"],
        created_at=user_data["created_at"],
        followers_count=followers_count,
        following_count=following_count
    )

@app.put("/users/me", response_model=User)
async def update_profile(profile: UserProfile, current_user: str = Depends(get_current_user)):
    users_db[current_user]["name"] = profile.name
    users_db[current_user]["bio"] = profile.bio
    
    user_data = users_db[current_user]
    followers_count, following_count = get_user_counts(current_user)
    
    return User(
        id=user_data["id"],
        username=user_data["username"],
        email=user_data["email"],
        name=user_data["name"],
        bio=user_data["bio"],
        created_at=user_data["created_at"],
        followers_count=followers_count,
        following_count=following_count
    )

@app.get("/users/{username}", response_model=User)
async def get_user_by_username(username: str, current_user: str = Depends(get_current_user)):
    user_data = None
    for uid, data in users_db.items():
        if data["username"] == username:
            user_data = data
            break
    
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    followers_count, following_count = get_user_counts(user_data["id"])
    
    return User(
        id=user_data["id"],
        username=user_data["username"],
        email=user_data["email"],
        name=user_data["name"],
        bio=user_data["bio"],
        created_at=user_data["created_at"],
        followers_count=followers_count,
        following_count=following_count
    )

@app.post("/posts", response_model=Post)
async def create_post(post: PostCreate, current_user: str = Depends(get_current_user)):
    post_id = str(uuid.uuid4())
    user_data = users_db[current_user]
    
    posts_db[post_id] = {
        "id": post_id,
        "user_id": current_user,
        "username": user_data["username"],
        "name": user_data["name"],
        "content": post.content,
        "created_at": datetime.utcnow()
    }
    
    return Post(
        id=post_id,
        user_id=current_user,
        username=user_data["username"],
        name=user_data["name"],
        content=post.content,
        created_at=posts_db[post_id]["created_at"],
        likes_count=0,
        liked_by_user=False
    )

@app.get("/posts/timeline", response_model=List[Post])
async def get_timeline(current_user: str = Depends(get_current_user)):
    followed_users = follows_db[current_user]
    relevant_users = followed_users | {current_user}
    
    timeline_posts = []
    for post_id, post_data in posts_db.items():
        if post_data["user_id"] in relevant_users:
            likes_count = len(likes_db[post_id])
            liked_by_user = current_user in likes_db[post_id]
            
            timeline_posts.append(Post(
                id=post_data["id"],
                user_id=post_data["user_id"],
                username=post_data["username"],
                name=post_data["name"],
                content=post_data["content"],
                created_at=post_data["created_at"],
                likes_count=likes_count,
                liked_by_user=liked_by_user
            ))
    
    timeline_posts.sort(key=lambda x: x.created_at, reverse=True)
    return timeline_posts

@app.get("/posts/{post_id}", response_model=Post)
async def get_post(post_id: str, current_user: str = Depends(get_current_user)):
    if post_id not in posts_db:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post_data = posts_db[post_id]
    likes_count = len(likes_db[post_id])
    liked_by_user = current_user in likes_db[post_id]
    
    return Post(
        id=post_data["id"],
        user_id=post_data["user_id"],
        username=post_data["username"],
        name=post_data["name"],
        content=post_data["content"],
        created_at=post_data["created_at"],
        likes_count=likes_count,
        liked_by_user=liked_by_user
    )

@app.delete("/posts/{post_id}")
async def delete_post(post_id: str, current_user: str = Depends(get_current_user)):
    if post_id not in posts_db:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post_data = posts_db[post_id]
    if post_data["user_id"] != current_user:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    
    del posts_db[post_id]
    if post_id in likes_db:
        del likes_db[post_id]
    
    return {"message": "Post deleted successfully"}

@app.post("/users/{username}/follow")
async def follow_user(username: str, current_user: str = Depends(get_current_user)):
    target_user_id = None
    for uid, data in users_db.items():
        if data["username"] == username:
            target_user_id = uid
            break
    
    if not target_user_id:
        raise HTTPException(status_code=404, detail="User not found")
    
    if target_user_id == current_user:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")
    
    follows_db[current_user].add(target_user_id)
    return {"message": "User followed successfully"}

@app.delete("/users/{username}/follow")
async def unfollow_user(username: str, current_user: str = Depends(get_current_user)):
    target_user_id = None
    for uid, data in users_db.items():
        if data["username"] == username:
            target_user_id = uid
            break
    
    if not target_user_id:
        raise HTTPException(status_code=404, detail="User not found")
    
    follows_db[current_user].discard(target_user_id)
    return {"message": "User unfollowed successfully"}

@app.get("/users/{username}/following", response_model=bool)
async def is_following(username: str, current_user: str = Depends(get_current_user)):
    target_user_id = None
    for uid, data in users_db.items():
        if data["username"] == username:
            target_user_id = uid
            break
    
    if not target_user_id:
        raise HTTPException(status_code=404, detail="User not found")
    
    return target_user_id in follows_db[current_user]

@app.post("/posts/{post_id}/like")
async def like_post(post_id: str, current_user: str = Depends(get_current_user)):
    if post_id not in posts_db:
        raise HTTPException(status_code=404, detail="Post not found")
    
    likes_db[post_id].add(current_user)
    return {"message": "Post liked successfully"}

@app.delete("/posts/{post_id}/like")
async def unlike_post(post_id: str, current_user: str = Depends(get_current_user)):
    if post_id not in posts_db:
        raise HTTPException(status_code=404, detail="Post not found")
    
    likes_db[post_id].discard(current_user)
    return {"message": "Post unliked successfully"}

@app.get("/search/users", response_model=List[User])
async def search_users(q: str, current_user: str = Depends(get_current_user)):
    if not q or len(q.strip()) < 2:
        return []
    
    query = q.lower().strip()
    results = []
    
    for user_id, user_data in users_db.items():
        if (query in user_data["username"].lower() or 
            query in user_data["name"].lower()):
            followers_count, following_count = get_user_counts(user_id)
            results.append(User(
                id=user_data["id"],
                username=user_data["username"],
                email=user_data["email"],
                name=user_data["name"],
                bio=user_data["bio"],
                created_at=user_data["created_at"],
                followers_count=followers_count,
                following_count=following_count
            ))
    
    return results[:20]  # Limit to 20 results

@app.get("/search/posts", response_model=List[Post])
async def search_posts(q: str, current_user: str = Depends(get_current_user)):
    if not q or len(q.strip()) < 2:
        return []
    
    query = q.lower().strip()
    results = []
    
    for post_id, post_data in posts_db.items():
        if query in post_data["content"].lower():
            likes_count = len(likes_db[post_id])
            liked_by_user = current_user in likes_db[post_id]
            
            results.append(Post(
                id=post_data["id"],
                user_id=post_data["user_id"],
                username=post_data["username"],
                name=post_data["name"],
                content=post_data["content"],
                created_at=post_data["created_at"],
                likes_count=likes_count,
                liked_by_user=liked_by_user
            ))
    
    results.sort(key=lambda x: x.created_at, reverse=True)
    return results[:20]  # Limit to 20 results

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
