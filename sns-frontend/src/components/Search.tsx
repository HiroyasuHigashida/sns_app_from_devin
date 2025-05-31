import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Search as SearchIcon, Users, FileText } from 'lucide-react'
import PostCard from './PostCard'
import { Link } from 'react-router-dom'

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

export default function Search() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('users')
  const { token } = useAuth()

  const handleSearch = async (searchQuery: string) => {
    if (!token || !searchQuery.trim()) {
      setUsers([])
      setPosts([])
      return
    }

    setLoading(true)
    try {
      const [usersResult, postsResult] = await Promise.all([
        api.searchUsers(token, searchQuery.trim()),
        api.searchPosts(token, searchQuery.trim())
      ])
      
      setUsers(usersResult)
      setPosts(postsResult)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, token])

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId))
  }

  const handlePostLiked = (postId: string, liked: boolean, newLikesCount: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked_by_user: liked, likes_count: newLikesCount }
        : post
    ))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SearchIcon className="h-5 w-5" />
            <span>Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for users or posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {query.trim() && (
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-gray-200">
                <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
                  <TabsTrigger 
                    value="users" 
                    className="flex items-center space-x-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
                  >
                    <Users className="h-4 w-4" />
                    <span>Users ({users.length})</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="posts"
                    className="flex items-center space-x-2 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Posts ({posts.length})</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="users" className="mt-0">
                <div className="p-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500">Searching...</div>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500">No users found</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/profile/${user.username}`}
                              className="block hover:underline"
                            >
                              <div className="font-semibold text-gray-900">{user.name}</div>
                              <div className="text-gray-500">@{user.username}</div>
                              {user.bio && (
                                <div className="text-sm text-gray-600 mt-1 truncate">
                                  {user.bio}
                                </div>
                              )}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.followers_count} followers
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="posts" className="mt-0">
                <div className="p-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500">Searching...</div>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-500">No posts found</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onDeleted={handlePostDeleted}
                          onLiked={handlePostLiked}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
