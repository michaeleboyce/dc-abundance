import Link from 'next/link';
import { getMessages } from '@/lib/actions/admin-messages';
import { MessageSquare, Circle, CheckCircle } from 'lucide-react';

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

export default async function MessagesPage() {
  const messages = await getMessages();
  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">
            Messages
          </h1>
          <p className="text-neutral-600 mt-1">
            {unreadCount} unread of {messages.length} total
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="w-8 px-4 py-3"></th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">From</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Subject</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Type</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
                  <p>No messages yet</p>
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr
                  key={message.id}
                  className={`hover:bg-neutral-50 ${!message.isRead ? 'bg-blue-50/50' : ''}`}
                >
                  <td className="px-4 py-4">
                    {message.isRead ? (
                      <CheckCircle className="h-4 w-4 text-neutral-300" />
                    ) : (
                      <Circle className="h-4 w-4 text-blue-500 fill-blue-500" />
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/messages/${message.id}`}
                      className="block"
                    >
                      <span className={`${!message.isRead ? 'font-semibold' : ''} text-neutral-800`}>
                        {message.name}
                      </span>
                      <span className="block text-sm text-neutral-500">{message.email}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/messages/${message.id}`}
                      className={`${!message.isRead ? 'font-semibold' : ''} text-neutral-800 hover:text-primary-600`}
                    >
                      {message.subject}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 rounded">
                      {inquiryTypeLabels[message.inquiryType] || message.inquiryType}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-neutral-600 text-sm">
                    {message.submittedAt.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
