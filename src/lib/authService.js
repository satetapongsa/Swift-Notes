import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const authService = {
  async register(email, password) {
    try {
      // Check if user exists
      const existing = await db.query.users.findFirst({
        where: eq(users.email, email)
      });
      
      if (existing) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const [newUser] = await db.insert(users).values({
        email,
        password: hashedPassword,
        name: email.split('@')[0]
      }).returning();

      return newUser;
    } catch (err) {
      throw err;
    }
  },

  async login(email, password) {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.email, email)
      });

      if (!user) {
        throw new Error('User not found');
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Invalid password');
      }

      return user;
    } catch (err) {
      throw err;
    }
  },

  async updateProfile(userId, name) {
    try {
      const [updated] = await db.update(users)
        .set({ name })
        .where(eq(users.id, parseInt(userId)))
        .returning();
      return updated;
    } catch (err) {
      throw err;
    }
  },

  async setPasscode(userId, passcode) {
    try {
      const [updated] = await db.update(users)
        .set({ passcode })
        .where(eq(users.id, parseInt(userId)))
        .returning();
      return updated;
    } catch (err) {
      throw err;
    }
  }
};
