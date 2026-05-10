import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  passcode: text('passcode'), // 6-digit pin
  name: text('name'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  type: text('type').default('general'), // general, idea, task, meeting
  color: text('color'), // hex color
  isFavorite: boolean('is_favorite').default(false),
  isLocked: boolean('is_locked').default(false),
  isDeleted: boolean('is_deleted').default(false),
  folderId: text('folder_id'),
  ownerId: integer('owner_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const folders = pgTable('folders', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color'),
  ownerId: integer('owner_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const collaborators = pgTable('collaborators', {
  id: serial('id').primaryKey(),
  noteId: integer('note_id').references(() => notes.id),
  userId: integer('user_id').references(() => users.id),
  role: text('role').default('viewer'), // viewer, editor
  createdAt: timestamp('created_at').defaultNow(),
});

export const workspaces = pgTable('workspaces', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  ownerId: integer('owner_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const workspaceItems = pgTable('workspace_items', {
  id: serial('id').primaryKey(),
  workspaceId: integer('workspace_id').references(() => workspaces.id),
  noteId: integer('note_id').references(() => notes.id),
  folderId: integer('folder_id').references(() => folders.id),
  createdAt: timestamp('created_at').defaultNow(),
});
