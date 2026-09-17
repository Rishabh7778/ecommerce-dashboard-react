import { BadgeCheck, CalendarDays, KeyRound, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react';

type AdminProfile = {
  id?: number | string;
  name?: string;
  email?: string;
  role?: string;
  created_at?: string;
};

const getAdminProfile = (): AdminProfile => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
};

const formatDate = (date?: string) => {
  if (!date) return 'Not available';
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? 'Not available'
    : parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
};

const AdminSettings = () => {
  const admin = getAdminProfile();
  const displayName = admin.name || 'Freshq Admin';
  const initials = displayName.split(' ').map((part) => part.charAt(0)).join('').slice(0, 2).toUpperCase();

  const details = [
    { label: 'Full name', value: displayName, icon: UserRound },
    { label: 'Email address', value: admin.email || 'Not available', icon: Mail },
    { label: 'Account role', value: admin.role === 'admin' ? 'Administrator' : admin.role || 'Administrator', icon: ShieldCheck },
    { label: 'Admin ID', value: admin.id ? `#${admin.id}` : 'Not available', icon: KeyRound },
    { label: 'Member since', value: formatDate(admin.created_at), icon: CalendarDays },
  ];

  return (
    <main className="min-h-full bg-[#f6f8f7] p-5 text-[#19364d] sm:p-8 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#31b875]">Admin settings</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Account & Settings</h1>
          <p className="mt-2 text-slate-500">View the administrator account currently signed in to Freshq.</p>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_18px_55px_-35px_rgba(15,23,42,0.35)]">
          <div className="relative overflow-hidden bg-[#19364d] px-6 py-8 text-white sm:px-9 sm:py-10">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#31b875]/20 blur-3xl" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-[#31b875] text-2xl font-black shadow-xl shadow-emerald-950/20">{initials || 'A'}</span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-2xl font-black sm:text-3xl">{displayName}</h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-black text-emerald-300"><BadgeCheck size={14} /> Admin</span>
                </div>
                <p className="mt-2 truncate text-slate-300">{admin.email || 'Administrator account'}</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-9">
            <div className="mb-6">
              <h3 className="text-xl font-black">Administrator details</h3>
              <p className="mt-1 text-sm text-slate-500">These details come from the authenticated account record.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {details.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#31b875] shadow-sm"><Icon size={20} /></span>
                  <div className="min-w-0"><p className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 truncate font-black text-[#19364d]">{value}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#31b875]"><LockKeyhole size={21} /></span>
            <h3 className="mt-5 text-lg font-black">Account security</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">Your password is securely encrypted and is never displayed in the dashboard.</p>
          </article>
          <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><ShieldCheck size={21} /></span>
            <h3 className="mt-5 text-lg font-black">Administrator access</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">This account can manage products, orders, customers, offers, transactions, and support messages.</p>
          </article>
        </section>
      </div>
    </main>
  );
};

export default AdminSettings;
