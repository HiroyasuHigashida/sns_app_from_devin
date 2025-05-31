import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Alert, AlertDescription } from './ui/alert'

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
    console.log('Form submitted, token:', !!token, 'content:', content.trim())
    if (!token || !content.trim()) {
      console.log('Early return - no token or content')
      return
    }

    setError('')
    setLoading(true)
    console.log('About to call api.createPost')

    try {
      const newPost = await api.createPost(token, content.trim())
      console.log('Post created successfully:', newPost)
      onPostCreated(newPost)
      setContent('')
    } catch (err) {
      console.error('Error creating post:', err)
      setError(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  const remainingChars = 280 - content.length

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
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <Textarea
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={280}
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
