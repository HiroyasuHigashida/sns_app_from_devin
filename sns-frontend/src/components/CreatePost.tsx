import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Alert, AlertDescription } from './ui/alert'

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

interface CreatePostProps {
  onPostCreated: (post: Post) => void
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { token, user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !content.trim()) {
      return
    }

    setError('')
    setLoading(true)

    try {
      const newPost = await api.createPost(token, { content: content.trim() })
      onPostCreated(newPost)
      setContent('')
    } catch (err) {
      console.error('Error creating post:', err)
      setError(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  const remainingChars = 140 - content.length

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <Textarea
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={140}
              rows={3}
              className="resize-none border-none focus:ring-0 text-lg placeholder-gray-500"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pl-13">
          <div className={`text-sm ${remainingChars < 20 ? 'text-red-500' : 'text-gray-500'}`}>
            {remainingChars} characters remaining
          </div>
          <Button
            type="submit"
            disabled={loading || !content.trim() || remainingChars < 0}
            className="rounded-full"
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </div>
  )
}
