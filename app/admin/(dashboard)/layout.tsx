import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin_auth');

  // Redirect to login if not authenticated
  if (!authCookie?.value) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/admin" className="text-xl font-display font-bold text-primary-700">
            DC Abundance <span className="text-neutral-400 font-normal">Admin</span>
          </Link>
          <Link href="/" className="text-sm text-neutral-600 hover:text-primary-600">
            View Site
          </Link>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
