import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
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

const formSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Please enter your new password.')
      .min(7, 'Password must be at least 7 characters long.'),
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export function ResetPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const navigate = useNavigate()
  const { resetPassword, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPasswordReset, setIsPasswordReset] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const result = await resetPassword(data.password)
    if (!result.error) {
      setIsPasswordReset(true)
    }
  }

  if (isPasswordReset) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30'>
            <CheckCircle2 className='size-6 text-green-600 dark:text-green-400' />
          </div>
          <CardTitle className='text-xl'>Password Reset Successful</CardTitle>
        </CardHeader>
        <CardContent className='text-center'>
          <p className='mb-6 text-sm text-muted-foreground'>
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
          <Button
            type='button'
            onClick={() => navigate({ to: '/sign-in' })}
          >
            Go to Sign In
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='********'
                    {...field}
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='size-4' />
                    ) : (
                      <Eye className='size-4' />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='********'
                    {...field}
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='size-4' />
                    ) : (
                      <Eye className='size-4' />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className='mt-2' disabled={isLoading} type='submit'>
          {isLoading ? (
            <>
              <Loader2 className='animate-spin' /> Resetting...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
    </Form>
  )
}
