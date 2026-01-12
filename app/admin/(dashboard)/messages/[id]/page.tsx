import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMessageById, markMessageAsRead, archiveMessage } from '@/lib/actions/admin-messages';
import { ArrowLeft, Mail, Archive, CheckCircle, Circle } from 'lucide-react';

const inquiryTypeLabels: Record<string, string> = {
  general: 'General',
  housing: 'Housing',
  transit: 'Transit',
  energy: 'Energy',
  government: 'Government',
  partnership: 'Partnership',
  media: 'Media',
  volunteer: 'Volunteer',
};

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const message = await getMessageById(parseInt(id));

  if (!message) {
    notFound();
  }

  // Auto-mark as read when viewing
  if (!message.isRead) {
    await markMessageAsRead(message.id, true);
  }

  return (
    <div>
      <Link
        href="/admin/messages"
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Messages
      </Link>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="border-b border-neutral-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-semibold text-neutral-800">
                {message.subject}
              </h1>
              <div className="mt-2 flex items-center gap-4 text-sm text-neutral-600">
                <span>
                  From: <strong>{message.name}</strong> ({message.email})
                </span>
                <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-700 rounded">
                  {inquiryTypeLabels[message.inquiryType] || message.inquiryType}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-500">
                {message.submittedAt.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <form
                action={async () => {
                  'use server';
                  await markMessageAsRead(message.id, !message.isRead);
                }}
              >
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  {message.isRead ? (
                    <>
                      <Circle className="h-4 w-4" />
                      Mark Unread
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Mark Read
                    </>
                  )}
                </button>
              </form>

              {!message.isArchived && (
                <form
                  action={async () => {
                    'use server';
                    await archiveMessage(message.id);
                  }}
                >
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                  >
                    <Archive className="h-4 w-4" />
                    Archive
                  </button>
                </form>
              )}

              <a
                href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                <Mail className="h-4 w-4" />
                Reply
              </a>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-neutral-700">{message.message}</p>
          </div>
        </div>

        {message.isArchived && (
          <div className="border-t border-neutral-200 px-6 py-3 bg-neutral-50">
            <span className="text-sm text-neutral-500">This message has been archived</span>
          </div>
        )}
      </div>
    </div>
  );
}
