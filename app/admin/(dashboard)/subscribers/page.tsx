import { getSubscribers } from '@/lib/actions/admin-subscribers';
import { ExportButton } from '@/components/admin/ExportButton';
import { Mail, CheckCircle, XCircle } from 'lucide-react';

export default async function SubscribersPage() {
  const subscribers = await getSubscribers();
  const activeCount = subscribers.filter(s => s.isActive).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">
            Newsletter Subscribers
          </h1>
          <p className="text-neutral-600 mt-1">
            {activeCount} active / {subscribers.length} total subscribers
          </p>
        </div>
        <ExportButton endpoint="/api/admin/export-subscribers" />
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Email</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Name</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Zip Code</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-neutral-600">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
                  <p>No subscribers yet</p>
                </td>
              </tr>
            ) : (
              subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <a
                      href={`mailto:${subscriber.email}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {subscriber.email}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-neutral-800">
                    {subscriber.firstName || subscriber.lastName
                      ? `${subscriber.firstName || ''} ${subscriber.lastName || ''}`.trim()
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {subscriber.zipCode || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {subscriber.isActive ? (
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-neutral-500">
                        <XCircle className="h-4 w-4" />
                        Unsubscribed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-neutral-600">
                    {subscriber.subscribedAt.toLocaleDateString('en-US', {
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
