const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000'

interface LoginResponse {
  access_token: string
  token_type: string
}

interface User {
  id: string
  username: string
  email: string
  name: string
  bio: string
  created_at: string
  followers_count: number
  following_count: number
}

interface Post {
  id: string
  user_id: string
  username: string
  name: string
  content: string
  created_at: string
  likes_count: number
  liked_by_user: boolean
}

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
      throw new Error(error.detail || 'An error occurred')
    }

    return response.json()
  }

  private getAuthHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    }
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

  async register(username: string, email: string, password: string, name: string): Promise<LoginResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, name }),
    })
  }

  async getCurrentUser(token: string): Promise<User> {
    return this.request('/users/me', {
      headers: this.getAuthHeaders(token),
    })
  }

  async updateProfile(token: string, name: string, bio: string): Promise<User> {
    return this.request('/users/me', {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ name, bio }),
    })
  }

  async getUserByUsername(token: string, username: string): Promise<User> {
    return this.request(`/users/${username}`, {
      headers: this.getAuthHeaders(token),
    })
  }

  async createPost(token: string, content: string): Promise<Post> {
    return this.request('/posts', {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ content }),
    })
  }

  async getTimeline(token: string): Promise<Post[]> {
    return this.request('/posts/timeline', {
      headers: this.getAuthHeaders(token),
    })
  }

  async getPost(token: string, postId: string): Promise<Post> {
    return this.request(`/posts/${postId}`, {
      headers: this.getAuthHeaders(token),
    })
  }

  async deletePost(token: string, postId: string): Promise<void> {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token),
    })
  }

  async followUser(token: string, username: string): Promise<void> {
    return this.request(`/users/${username}/follow`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
    })
  }

  async unfollowUser(token: string, username: string): Promise<void> {
    return this.request(`/users/${username}/follow`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token),
    })
  }

  async isFollowing(token: string, username: string): Promise<boolean> {
    return this.request(`/users/${username}/following`, {
      headers: this.getAuthHeaders(token),
    })
  }

  async likePost(token: string, postId: string): Promise<void> {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
    })
  }

  async unlikePost(token: string, postId: string): Promise<void> {
    return this.request(`/posts/${postId}/like`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token),
    })
  }

  async searchUsers(token: string, query: string): Promise<User[]> {
    return this.request(`/search/users?q=${encodeURIComponent(query)}`, {
      headers: this.getAuthHeaders(token),
    })
  }

  async searchPosts(token: string, query: string): Promise<Post[]> {
    return this.request(`/search/posts?q=${encodeURIComponent(query)}`, {
      headers: this.getAuthHeaders(token),
    })
  }
}

export const api = new ApiService()
