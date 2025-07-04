'use server';

import { RegisterSchema } from '@/types/register-schema';
import { createSafeActionClient } from 'next-safe-action';
import bcrpty from 'bcryptjs';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import { generateEmailVerificationToken } from './tokens';
import { sendVerificationEmail } from './email';

const action = createSafeActionClient();

export const emailRegister = action(
  RegisterSchema,
  async ({ email, name, password }) => {
    const hashedPassword = await bcrpty.hash(password, 10);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    //Check if email is already in the database then say it's used, if it's not register the user but also send the verification

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: 'Email Confirmation resent' };
      }

      return { error: 'Email already in use' };
    }

    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });

    const verificationToken = await generateEmailVerificationToken(email);

    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token
    );

    return { success: 'Confirmation Email Sent!' };
  }
);
