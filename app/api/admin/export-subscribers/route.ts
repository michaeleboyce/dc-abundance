import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { newsletterSubscribers } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import * as XLSX from 'xlsx';

export async function GET() {
  // Verify admin auth
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin_auth');

  if (!authCookie?.value || !verifySessionToken(authCookie.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all subscribers
    const subscribers = await db
      .select()
      .from(newsletterSubscribers)
      .orderBy(asc(newsletterSubscribers.subscribedAt));

    // Transform data for Excel
    const excelData = subscribers.map((sub) => ({
      Email: sub.email,
      'First Name': sub.firstName || '',
      'Last Name': sub.lastName || '',
      'ZIP Code': sub.zipCode || '',
      Residence: sub.residence || '',
      Interests: Array.isArray(sub.interests) ? sub.interests.join(', ') : '',
      'Other Interest': sub.otherInterest || '',
      'Help Preferences': Array.isArray(sub.helpPreferences) ? sub.helpPreferences.join(', ') : '',
      'Other Help': sub.otherHelp || '',
      Source: sub.source || 'website',
      Status: sub.isActive ? 'Active' : 'Unsubscribed',
      'Subscribed At': sub.subscribedAt.toISOString().split('T')[0],
      'Unsubscribed At': sub.unsubscribedAt ? sub.unsubscribedAt.toISOString().split('T')[0] : '',
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    ws['!cols'] = [
      { wch: 30 }, // Email
      { wch: 15 }, // First Name
      { wch: 15 }, // Last Name
      { wch: 10 }, // ZIP Code
      { wch: 25 }, // Residence
      { wch: 40 }, // Interests
      { wch: 25 }, // Other Interest
      { wch: 50 }, // Help Preferences
      { wch: 25 }, // Other Help
      { wch: 20 }, // Source
      { wch: 12 }, // Status
      { wch: 12 }, // Subscribed At
      { wch: 12 }, // Unsubscribed At
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Subscribers');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `dc-abundance-subscribers-${date}.xlsx`;

    // Return the file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
