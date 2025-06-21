import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import PostCard from './PostCard'
import CreatePost from './CreatePost'
import { Button } from './ui/button'
import { RefreshCw } from 'lucide-react'

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

export default function Timeline() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { token } = useAuth()

  const fetchTimeline = async (showRefreshing = false) => {
    if (!token) return
    
    if (showRefreshing) setRefreshing(true)
    else setLoading(true)

    try {
      const timelinePosts = await api.getPosts(token)
      setPosts(timelinePosts)
    } catch (error) {
      console.error('Failed to fetch timeline:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTimeline()
  }, [token])

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts])
  }

  const handlePostDeleted = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId))
  }

  const handlePostLiked = (postId: number, liked: boolean, newLikesCount: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: liked, likeCount: newLikesCount }
        : post
    ))
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">Loading timeline...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Home</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchTimeline(true)}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
        
        <CreatePost onPostCreated={handlePostCreated} />
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 mb-4">No posts in your timeline yet.</p>
            <p className="text-sm text-gray-400">
              Follow some users or create your first post to get started!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDeleted={handlePostDeleted}
              onLiked={handlePostLiked}
            />
          ))
        )}
      </div>
    </div>
  )
}
