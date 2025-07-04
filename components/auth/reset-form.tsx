'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCard } from './auth-card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { emailSignIn } from '@/server/actions/email-signin';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';
import { NewPasswordSchema } from '@/types/new-password-schema';
import { newPassword } from '@/server/actions/new-password';
import { ResetSchema } from '@/types/reset-schema';
import { reset } from '@/server/actions/password-reset';

export const ResetForm = () => {
  const form = useForm({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { execute, status } = useAction(reset, {
    onSuccess(data) {
      if (data?.error) setError(data?.error);
      if (data?.success) setSuccess(data?.success);
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Forgot your password?"
      backButtonHref="/auth/login"
      backButtonLabel="Create a new password"
      showSocials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="developedbyed@gmail.com"
                        type="email"
                        disabled={status === 'executing'}
                        autoComplete="email"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button size={'sm'} variant={'link'} asChild>
                <Link href="/auth/reset">Forgot your password</Link>
              </Button>
            </div>
            <Button
              type="submit"
              className={cn(
                'w-full my-4',
                status === 'executing' ? 'animate-pulse' : ''
              )}
            >
              Reset password
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};
