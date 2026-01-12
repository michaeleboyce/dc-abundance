"use server";

import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getMessages() {
  return db
    .select()
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.submittedAt));
}

export async function getMessageById(id: number) {
  const result = await db
    .select()
    .from(contactSubmissions)
    .where(eq(contactSubmissions.id, id))
    .limit(1);

  return result[0] || null;
}

export async function markMessageAsRead(id: number, isRead: boolean) {
  await db
    .update(contactSubmissions)
    .set({ isRead })
    .where(eq(contactSubmissions.id, id));

  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
}

export async function archiveMessage(id: number) {
  await db
    .update(contactSubmissions)
    .set({ isArchived: true })
    .where(eq(contactSubmissions.id, id));

  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
}
