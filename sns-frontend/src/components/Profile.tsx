import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Alert, AlertDescription } from './ui/alert'
import { Calendar, Users, UserPlus, UserMinus, Edit } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

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

export default function Profile() {
  const { username } = useParams<{ username: string }>()
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [error, setError] = useState('')
  const { token, user, updateUser } = useAuth()

  const isOwnProfile = user?.username === username

  useEffect(() => {
    if (!username || !token) return

    const fetchProfile = async () => {
      setLoading(true)
      try {
        if (isOwnProfile) {
          setProfileUser(user)
        } else {
          const userData = await api.getUserByUsername(token, username)
          setProfileUser(userData)
          
          const isFollowingUser = await api.isFollowing(token, username)
          setFollowing(isFollowingUser)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username, token, user, isOwnProfile])

  const handleFollow = async () => {
    if (!token || !username || followLoading) return

    setFollowLoading(true)
    try {
      if (following) {
        await api.unfollowUser(token, username)
        setFollowing(false)
        if (profileUser) {
          setProfileUser({
            ...profileUser,
            followers_count: profileUser.followers_count - 1
          })
        }
      } else {
        await api.followUser(token, username)
        setFollowing(true)
        if (profileUser) {
          setProfileUser({
            ...profileUser,
            followers_count: profileUser.followers_count + 1
          })
        }
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    } finally {
      setFollowLoading(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || editLoading) return

    setEditLoading(true)
    setError('')

    try {
      const updatedUser = await api.updateProfile(token, editName, editBio)
      setProfileUser(updatedUser)
      updateUser(updatedUser)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setEditLoading(false)
    }
  }

  const startEditing = () => {
    if (profileUser) {
      setEditName(profileUser.name)
      setEditBio(profileUser.bio)
      setEditing(true)
      setError('')
    }
  }

  const formatJoinDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Unknown'
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading profile...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              {error || 'Profile not found'}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                {profileUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-xl">{profileUser.name}</CardTitle>
                <p className="text-gray-500">@{profileUser.username}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {isOwnProfile ? (
                <Button
                  variant="outline"
                  onClick={startEditing}
                  className="flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </Button>
              ) : (
                <Button
                  onClick={handleFollow}
                  disabled={followLoading}
                  variant={following ? "outline" : "default"}
                  className="flex items-center space-x-2"
                >
                  {following ? (
                    <>
                      <UserMinus className="h-4 w-4" />
                      <span>Unfollow</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      <span>Follow</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {editing ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={50}
                  required
                  disabled={editLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <Textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  maxLength={160}
                  rows={3}
                  placeholder="Tell us about yourself..."
                  disabled={editLoading}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(false)}
                  disabled={editLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {profileUser.bio && (
                <p className="text-gray-900">{profileUser.bio}</p>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatJoinDate(profileUser.created_at)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-900">
                    {profileUser.following_count}
                  </span>
                  <span className="text-gray-500">Following</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-900">
                    {profileUser.followers_count}
                  </span>
                  <span className="text-gray-500">Followers</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
