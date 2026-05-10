import { db } from './db';
import { notes, folders, users, collaborators } from './schema';
import { eq, and, or } from 'drizzle-orm';

export const noteService = {
  // --- Notes ---
  async getNotes(userEmail) {
    return await db.query.notes.findMany({
      where: and(
        eq(notes.isDeleted, false),
      ),
      orderBy: (notes, { desc }) => [desc(notes.isFavorite), desc(notes.updatedAt)],
    });
  },

  async toggleFavorite(id, isFavorite) {
    return await db.update(notes)
      .set({ isFavorite })
      .where(eq(notes.id, parseInt(id)));
  },

  async updateNoteColor(id, color) {
    return await db.update(notes)
      .set({ color })
      .where(eq(notes.id, parseInt(id)));
  },

  async updateNoteType(id, type) {
    return await db.update(notes)
      .set({ type })
      .where(eq(notes.id, parseInt(id)));
  },

  async searchNotes(query) {
    // In a real app, use ilike for searching
    const all = await db.query.notes.findMany({
      where: eq(notes.isDeleted, false),
    });
    return all.filter(n => 
      n.title.toLowerCase().includes(query.toLowerCase()) || 
      n.content.toLowerCase().includes(query.toLowerCase())
    );
  },

  async getTrashNotes() {
    return await db.query.notes.findMany({
      where: eq(notes.isDeleted, true),
      orderBy: (notes, { desc }) => [desc(notes.updatedAt)],
    });
  },

  async softDeleteNote(id) {
    return await db.update(notes)
      .set({ isDeleted: true })
      .where(eq(notes.id, parseInt(id)));
  },

  async restoreNote(id) {
    return await db.update(notes)
      .set({ isDeleted: false })
      .where(eq(notes.id, parseInt(id)));
  },

  async lockNote(id, isLocked) {
    return await db.update(notes)
      .set({ isLocked })
      .where(eq(notes.id, parseInt(id)));
  },

  async moveNoteToFolder(id, folderId) {
    return await db.update(notes)
      .set({ folderId: folderId?.toString() })
      .where(eq(notes.id, parseInt(id)));
  },

  // --- Workspaces ---
  async getWorkspaces() {
    return await db.query.workspaces.findMany({
      orderBy: (workspaces, { desc }) => [desc(workspaces.createdAt)],
    });
  },

  async createWorkspace(name, description) {
    return await db.insert(workspaces)
      .values({ name, description })
      .returning();
  },

  async addNoteToWorkspace(workspaceId, noteId) {
    return await db.insert(workspaceItems)
      .values({ workspaceId: parseInt(workspaceId), noteId: parseInt(noteId) })
      .returning();
  },

  async addFolderToWorkspace(workspaceId, folderId) {
    return await db.insert(workspaceItems)
      .values({ workspaceId: parseInt(workspaceId), folderId: parseInt(folderId) })
      .returning();
  },

  async getWorkspaceItems(workspaceId) {
    return await db.query.workspaceItems.findMany({
      where: eq(workspaceItems.workspaceId, parseInt(workspaceId)),
      with: {
        note: true,
        folder: true
      }
    });
  },

  async getNoteById(id) {
    return await db.query.notes.findFirst({
      where: eq(notes.id, parseInt(id)),
    });
  },

  async saveNote(noteData) {
    const { id, title, content, folderId } = noteData;
    const now = new Date();

    if (id && !isNaN(id)) {
      // Update
      return await db.update(notes)
        .set({ title, content, folderId, updatedAt: now })
        .where(eq(notes.id, parseInt(id)))
        .returning();
    } else {
      // Create
      return await db.insert(notes)
        .values({ 
          title: title || 'Untitled Note', 
          content, 
          folderId: folderId?.toString(),
          updatedAt: now 
        })
        .returning();
    }
  },

  async deleteNote(id) {
    return await db.delete(notes).where(eq(notes.id, parseInt(id)));
  },

  // --- Folders ---
  async getFolders() {
    return await db.query.folders.findMany();
  },

  async createFolder(name, color) {
    return await db.insert(folders)
      .values({ name, color })
      .returning();
  },

  // --- Sharing ---
  async shareNote(noteId, email) {
    // Find or create user by email
    let user = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user) {
      [user] = await db.insert(users).values({ email }).returning();
    }

    return await db.insert(collaborators)
      .values({ noteId: parseInt(noteId), userId: user.id })
      .returning();
  },

  async getSharedNotes(userEmail) {
    const user = await db.query.users.findFirst({ where: eq(users.email, userEmail) });
    if (!user) return [];

    const shared = await db.query.collaborators.findMany({
      where: eq(collaborators.userId, user.id),
      with: {
        note: true
      }
    });
    
    return shared.map(s => s.note).filter(Boolean);
  }
};
