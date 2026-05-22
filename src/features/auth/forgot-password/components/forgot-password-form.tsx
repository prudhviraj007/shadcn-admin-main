import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email.' : undefined),
  }),
})

export function ForgotPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const navigate = useNavigate()
  const { forgotPassword, isLoading } = useAuth()
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const result = await forgotPassword(data.email)
    if (!result.error) {
      setSentEmail(data.email)
      setIsEmailSent(true)
    }
  }

  if (isEmailSent) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30'>
            <CheckCircle2 className='size-6 text-green-600 dark:text-green-400' />
          </div>
          <CardTitle className='text-xl'>Check your email</CardTitle>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='mb-6 text-sm text-muted-foreground'>
            We've sent a password reset link to:
          </p>
          <p className='mb-6 font-medium'>{sentEmail}</p>
          <p className='mb-6 text-sm text-muted-foreground'>
            Click the link in the email to reset your password. The link will expire in 24 hours.
          </p>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate({ to: '/sign-in' })}
          >
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading} type='submit'>
          {isLoading ? (
            <>
              <Loader2 className='animate-spin' /> Sending...
            </>
          ) : (
            <>
              Continue <ArrowRight className='size-4' />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
