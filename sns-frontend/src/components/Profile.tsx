import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import PostCard from './PostCard'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { Edit, Save, X } from 'lucide-react'

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

export default function Profile() {
  const { username } = useParams<{ username: string }>()
  const [profile, setProfile] = useState<string>('')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState('')
  const [updating, setUpdating] = useState(false)
  const { token, user } = useAuth()

  useEffect(() => {
    if (username && token) {
      fetchProfile()
      fetchUserPosts()
    }
  }, [username, token])

  const fetchProfile = async () => {
    if (!username || !token) return

    try {
      const profileData = await api.getUserProfile(token, username)
      setProfile(profileData.profile)
      setEditedProfile(profileData.profile)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  const fetchUserPosts = async () => {
    if (!username || !token) return

    try {
      const userPosts = await api.getUserPosts(token, username)
      setPosts(userPosts)
    } catch (error) {
      console.error('Failed to fetch user posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!token) return

    setUpdating(true)
    try {
      const updatedProfile = await api.updateProfile(token, {
        profile: editedProfile
      })
      setProfile(updatedProfile.profile)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedProfile(profile)
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
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    )
  }

  if (!username) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-red-500">Profile not found</div>
        </div>
      </div>
    )
  }

  const isOwnProfile = user?.username === username

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-2xl">@{username}</CardTitle>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {isOwnProfile && (
                isEditing ? (
                  <>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={updating}
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {updating ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Button>
                )
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isEditing ? (
            <Textarea
              value={editedProfile}
              onChange={(e) => setEditedProfile(e.target.value)}
              placeholder="Tell us about yourself..."
              className="mb-4"
            />
          ) : (
            <p className="text-gray-700 mb-4">{profile || 'No profile information available'}</p>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center text-gray-500">
                No posts yet
              </div>
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
    </div>
  )
}
