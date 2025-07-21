import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  pgEnum,
  unique,
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from 'next-auth/adapters';
import { createId } from '@paralleldrive/cuid2';
import { date } from 'drizzle-orm/pg-core';

export const RoleEnum = pgEnum('roles', ['user', 'admin']);

export const TodoStatusEnum = pgEnum('todo_status', [
  'not_started',
  'in_progress',
  'done',
]);

export const users = pgTable('user', {
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  password: text('password'),
  twoFactorEnabled: boolean('twoFactorEnabled').default(false),
  role: RoleEnum('roles').default('user'),
  customerID: text('customerID'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);
export const emailTokens = pgTable(
  'email_tokens',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);

export const twoFactorTokens = pgTable(
  'two_factor_tokens',
  {
    id: text('id')
      .notNull()
      .$defaultFn(() => createId()),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    email: text('email').notNull(),
    userID: text('userID').references(() => users.id, { onDelete: 'cascade' }),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);

export const habits = pgTable('habits', {
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  isArchived: boolean('is_archived').default(false).notNull(),
});

export const habitEntries = pgTable(
  'habit_entries',
  {
    id: text('id')
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    habitId: text('habit_id')
      .notNull()
      .references(() => habits.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    completedAt: timestamp('completed_at', { mode: 'date' }).notNull(),
    isDone: boolean('is_done').default(false).notNull(),

    // unique constraint to avoid duplicates per habit/day
  },
  (table) => ({
    uniqueHabitDate: unique().on(table.habitId, table.date),
  })
);

export const todos = pgTable('todo', {
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),

  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  content: text('content').notNull(),
  isArchived: boolean('is_archived').notNull().default(false),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

export const todoEntries = pgTable('todo_entry', {
  id: text('id')
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),

  todoId: text('todo_id')
    .notNull()
    .references(() => todos.id, { onDelete: 'cascade' }),

  date: date('date').notNull(),

  completedAt: timestamp('completed_at', { mode: 'date' }),

  status: TodoStatusEnum('status').notNull().default('not_started'),
});
