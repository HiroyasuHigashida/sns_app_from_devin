import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Search as SearchIcon } from 'lucide-react'

export default function Search() {
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
          <Alert>
            <AlertDescription>
              Search functionality is not available in this version. 
              The backend does not support search operations for users or posts.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
