import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createPost, updatePost, getPost } from '@/lib/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required')
})

export default function AdminPostForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const slug = router.query.slug as string
    if (slug) {
      setIsEditing(true)
      getPost(slug).then(data => {
        setValue('title', data.title)
        setValue('slug', data.slug)
        setValue('content', data.content)
      })
    }
  }, [router.query.slug])

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true)
    try {
      if (isEditing) {
        await updatePost(data)
        toast({ title: 'Post updated' })
      } else {
        await createPost(data)
        toast({ title: 'Post created' })
      }
      router.push('/admin')
    } catch (error) {
      toast({ title: 'Error', description: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Post' : 'Create Post'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input {...register('title')} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Slug</label>
              <Input {...register('slug')} />
              {errors.slug && <p class="text-red-500 text-sm">{errors.slug.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea rows={10} {...register('content')} />
              {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isEditing ? 'Update Post' : 'Create Post'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}