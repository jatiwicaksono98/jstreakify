'use server';

import { LoginSchema } from '@/types/login-schema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { twoFactorTokens, users } from '../schema';
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from './tokens';
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from './email';
import { signIn } from '../auth';
import { AuthError } from 'next-auth';

const action = createSafeActionClient();

export const emailSignIn = action(
  LoginSchema,
  async ({ email, password, code }) => {
    //Check if the user is in the database

    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!existingUser) {
        return { error: 'user not found' };
      }

      if (existingUser?.email !== email) {
        return { error: 'Email not found' };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );

        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );

        return { success: 'Confirmation email sent' };
      }

      if (existingUser.twoFactorEnabled && existingUser.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );

          if (!twoFactorToken) {
            return { error: 'Invalid token' };
          }

          if (twoFactorToken.token !== code) {
            return { error: 'Invalid token' };
          }

          const hasExpired = new Date(twoFactorToken.expires) < new Date();

          if (hasExpired) {
            return { error: 'Token has expired' };
          }

          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));

          const existingConfirmation = await getTwoFactorTokenByEmail(
            existingUser.email
          );

          if (existingConfirmation) {
            await db
              .delete(twoFactorTokens)
              .where(eq(twoFactorTokens.email, existingUser.email));
          }
        } else {
          const token = await generateTwoFactorToken(existingUser.email);

          if (!token) {
            return { error: 'Token not generated!' };
          }

          await sendTwoFactorTokenByEmail(token[0].email, token[0].token);
          return { twoFactor: 'Two Factor Token sent!' };
        }
      }

      await signIn('credentials', {
        email,
        password,
        redirectTo: '/',
      });

      return { success: email };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return { error: 'Email or password incorrect' };
          case 'AccessDenied':
            return { error: error.message };
          case 'OAuthSignInError':
            return { error: error.message };
          default:
            return { error: 'Something went wrong' };
        }
      }

      throw error;
    }
  }
);
