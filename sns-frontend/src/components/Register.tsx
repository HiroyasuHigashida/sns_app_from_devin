import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">SNS App</h1>
          <p className="text-gray-600">Join the conversation today</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registration Not Available</CardTitle>
            <CardDescription>
              User registration is handled externally
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Registration is managed through AWS Cognito in production. 
                For development, users are automatically created when they first sign in.
              </AlertDescription>
            </Alert>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have access?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
