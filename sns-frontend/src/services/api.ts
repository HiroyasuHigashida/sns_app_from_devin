const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:15001'

interface User {
  username: string
  profile?: string
  iconImage?: string
}

interface Post {
  id: number
  type: string
  content: string
  user: {
    username: string
    iconImage: string
  }
  postedAt: string
  likeCount: number
  isLiked: boolean
}

interface CreatePostRequest {
  content: string
}

interface UpdateProfileRequest {
  profile: string
}

interface UpdateIconRequest {
  iconImage: string
}

class ApiService {
  private baseURL: string

  constructor() {
    this.baseURL = API_URL
  }

  private async request(endpoint: string, options: RequestInit = {}, token?: string): Promise<any> {
    const url = `${this.baseURL}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }

    if (token) {
      headers.authorization = token
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async login(username: string): Promise<{ access_token: string }> {
    return { access_token: `mock-token-${username}-${Date.now()}` }
  }

  async getCurrentUser(token: string): Promise<User> {
    const username = token.split('-')[2] || 'user'
    return {
      username,
      profile: '',
      iconImage: ''
    }
  }

  async getPosts(token: string): Promise<Post[]> {
    return this.request('/api/posts', { method: 'GET' }, token)
  }

  async getUserPosts(token: string, username: string): Promise<Post[]> {
    return this.request(`/api/posts/${username}`, { method: 'GET' }, token)
  }

  async createPost(token: string, data: CreatePostRequest): Promise<Post> {
    return this.request('/api/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token)
  }

  async updatePost(token: string, postId: number, content: string): Promise<Post> {
    return this.request(`/api/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }, token)
  }

  async deletePost(token: string, postId: number): Promise<void> {
    await this.request(`/api/posts/${postId}`, { method: 'DELETE' }, token)
  }

  async likePost(token: string, postId: number): Promise<{ likeCount: number; isLiked: boolean }> {
    return this.request('/api/likes', {
      method: 'POST',
      body: JSON.stringify({ postid: postId }),
    }, token)
  }

  async unlikePost(token: string, postId: number): Promise<{ likeCount: number; isLiked: boolean }> {
    return this.request(`/api/likes/${postId}`, { method: 'DELETE' }, token)
  }

  async getUserProfile(token: string, username: string): Promise<{ profile: string }> {
    return this.request(`/api/profiles/${username}`, { method: 'GET' }, token)
  }

  async updateProfile(token: string, data: UpdateProfileRequest): Promise<{ profile: string }> {
    return this.request('/api/profiles', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token)
  }

  async getUserIcon(token: string, username: string): Promise<{ iconImage: string }> {
    return this.request(`/api/icons/${username}`, { method: 'GET' }, token)
  }

  async updateIcon(token: string, data: UpdateIconRequest): Promise<{ iconImage: string }> {
    return this.request('/api/icons', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token)
  }
}

export const api = new ApiService()
