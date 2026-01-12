import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletterSubscribers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET handler for one-click unsubscribe (required by CAN-SPAM)
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/unsubscribe?error=missing-token', request.url));
  }

  try {
    const result = await db
      .update(newsletterSubscribers)
      .set({
        isActive: false,
        unsubscribedAt: new Date(),
      })
      .where(eq(newsletterSubscribers.unsubscribeToken, token))
      .returning({ email: newsletterSubscribers.email });

    if (result.length === 0) {
      return NextResponse.redirect(new URL('/unsubscribe?error=invalid-token', request.url));
    }

    return NextResponse.redirect(new URL('/unsubscribe?success=true', request.url));
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.redirect(new URL('/unsubscribe?error=server-error', request.url));
  }
}
