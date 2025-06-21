import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Heart, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

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

interface PostCardProps {
  post: Post
  onDeleted: (postId: number) => void
  onLiked: (postId: number, liked: boolean, newLikesCount: number) => void
}

export default function PostCard({ post, onDeleted, onLiked }: PostCardProps) {
  const [loading, setLoading] = useState(false)
  const { token, user } = useAuth()

  const handleLike = async () => {
    if (!token || loading) return

    setLoading(true)
    try {
      if (post.isLiked) {
        const result = await api.unlikePost(token, post.id)
        onLiked(post.id, result.isLiked, result.likeCount)
      } else {
        const result = await api.likePost(token, post.id)
        onLiked(post.id, result.isLiked, result.likeCount)
      }
    } catch (error) {
      console.error('Failed to toggle like:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!token || loading) return
    if (!confirm('Are you sure you want to delete this post?')) return

    setLoading(true)
    try {
      await api.deletePost(token, post.id)
      onDeleted(post.id)
    } catch (error) {
      console.error('Failed to delete post:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Unknown time'
    }
  }

  const isOwnPost = user?.username === post.user.username

  return (
    <Card className="hover:bg-gray-50 transition-colors">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            {post.user.iconImage ? (
              <img src={post.user.iconImage} alt={post.user.username} className="w-full h-full rounded-full object-cover" />
            ) : (
              post.user.username.charAt(0).toUpperCase()
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">@{post.user.username}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500 text-sm">{formatDate(post.postedAt)}</span>
              
              {isOwnPost && (
                <div className="ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={loading}
                    className="text-gray-500 hover:text-red-500 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mt-2">
              <p className="text-gray-900 whitespace-pre-wrap break-words">{post.content}</p>
            </div>
            
            <div className="mt-3 flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={loading}
                className={`flex items-center space-x-2 p-2 rounded-full hover:bg-red-50 ${
                  post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart 
                  className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} 
                />
                <span className="text-sm">{post.likeCount}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
