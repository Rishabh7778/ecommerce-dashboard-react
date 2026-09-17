import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
    ArrowRight, CheckCircle, ChevronRight, CircleUserRound, Edit, Headset, Heart,
    LayoutDashboard, Loader2, LogOut, MapPin, Package, Plus, ShieldCheck,
    ShoppingBag, User, Eye, EyeOff,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useAddAddressMutation, useGetMyAddressesQuery } from '../services/addressApi';
import MyOrdersTab from '../components/MyOrder';
import { HelpSupportTab } from '../components/HelpSupportTab';

type AccountPage = 'dashboard' | 'orders' | 'addresses' | 'details' | 'support';

interface UserAccountProps { page?: AccountPage }

const readStoredUser = () => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
};

const accountLinks = [
    { to: '/account', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/account/orders', label: 'My Orders', icon: Package },
    { to: '/wishlist', label: 'Wishlist', icon: Heart },
    { to: '/account/addresses', label: 'Saved Addresses', icon: MapPin },
    { to: '/account/details', label: 'Profile Details', icon: User },
    { to: '/account/support', label: 'Help & Support', icon: Headset },
];

const handleLogout = () => {
    Swal.fire({
        title: 'Logout from Freshq?', text: 'You can log back in whenever you want.', icon: 'question',
        showCancelButton: true, confirmButtonColor: '#31b875', cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, logout',
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/account';
        }
    });
};

const UserAccount = ({ page = 'dashboard' }: UserAccountProps) => {
    const user = readStoredUser();
    const isLoggedIn = Boolean(localStorage.getItem('token') && user);

    if (!isLoggedIn) return <GuestAccount />;

    return (
        <section className="min-h-[70vh] bg-[#f7faf8] px-4 py-8 text-[#253D4E] sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#31b875]">Your Freshq space</p>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">My Account</h1>
                        <p className="mt-2 text-slate-500">Manage your orders, profile, and delivery details in one place.</p>
                    </div>
                    <Link to="/shop" className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#31b875] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition hover:-translate-y-0.5 hover:bg-[#299f66]">
                        Continue shopping <ArrowRight size={17} />
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-8">
                    <aside className="h-fit overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_12px_35px_-24px_rgba(15,23,42,0.35)] lg:sticky lg:top-24">
                        <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 to-white p-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#31b875] text-xl font-black text-white shadow-lg shadow-emerald-100">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-lg font-black">{user?.name || 'Freshq User'}</p>
                                    <p className="truncate text-sm text-slate-500">{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <nav className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-1" aria-label="Account pages">
                            {accountLinks.map(({ to, label, icon: Icon, end }) => (
                                <NavLink key={to} to={to} end={end}
                                    className={({ isActive }) => `flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold transition ${isActive ? 'bg-[#31b875] text-white shadow-md shadow-emerald-100' : 'text-slate-600 hover:bg-emerald-50 hover:text-[#279b61]'}`}>
                                    <span className="flex items-center gap-2.5"><Icon size={18} />{label}</span>
                                    <ChevronRight size={15} className="hidden lg:block" />
                                </NavLink>
                            ))}
                            <button type="button" onClick={handleLogout} className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-left text-sm font-bold text-rose-500 transition hover:bg-rose-50">
                                <LogOut size={18} /> Logout
                            </button>
                        </nav>
                    </aside>

                    <main className="min-w-0">
                        {page === 'dashboard' && <DashboardPage user={user} />}
                        {page === 'orders' && <MyOrdersTab />}
                        {page === 'addresses' && <AddressPage />}
                        {page === 'details' && <AccountDetailsPage user={user} />}
                        {page === 'support' && <HelpSupportTab />}
                    </main>
                </div>
            </div>
        </section>
    );
};

const GuestAccount = () => (
    <section className="min-h-[68vh] bg-[#f7faf8] px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_24px_70px_-35px_rgba(15,23,42,0.35)] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-gradient-to-br from-[#effbf5] via-white to-emerald-50 p-7 sm:p-10 lg:p-12">
                <span className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#31b875] text-white shadow-lg shadow-emerald-200"><CircleUserRound size={30} /></span>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#31b875]">Welcome to Freshq</p>
                <h1 className="mt-3 text-3xl font-black leading-tight text-[#19364d] sm:text-4xl">Your account, your shopping hub.</h1>
                <p className="mt-4 max-w-md leading-7 text-slate-500">Sign in to track orders, save your wishlist, and manage delivery addresses.</p>
                <Link to="/login" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#31b875] px-6 py-3.5 font-black text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-[#299f66]">
                    Login / Sign up <ArrowRight size={18} />
                </Link>
                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-slate-500"><ShieldCheck size={18} className="text-[#31b875]" /> Secure account and protected checkout</div>
            </div>

            <div className="p-5 sm:p-8 lg:p-10">
                <p className="mb-4 px-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">Explore account</p>
                <nav className="divide-y divide-slate-100" aria-label="Guest account menu">
                    {accountLinks.slice(1).map(({ to, label, icon: Icon }) => (
                        <Link key={to} to={to} className="group flex items-center justify-between rounded-xl px-2 py-4 text-slate-600 transition hover:bg-emerald-50 hover:px-4 hover:text-[#279b61]">
                            <span className="flex items-center gap-3 font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-[#31b875]"><Icon size={18} /></span>{label}</span>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-[#31b875]" />
                        </Link>
                    ))}
                    <Link to="/contact" className="group flex items-center justify-between rounded-xl px-2 py-4 text-slate-600 transition hover:bg-emerald-50 hover:px-4 hover:text-[#279b61]">
                        <span className="flex items-center gap-3 font-bold"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-[#31b875]"><Headset size={18} /></span>Contact Us</span>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-[#31b875]" />
                    </Link>
                </nav>
            </div>
        </div>
    </section>
);

const DashboardPage = ({ user }: { user: any }) => {
    const quickLinks = [
        { to: '/account/orders', label: 'My Orders', text: 'Track current and past orders', icon: ShoppingBag, tone: 'bg-blue-50 text-blue-600' },
        { to: '/wishlist', label: 'Wishlist', text: 'See products you saved', icon: Heart, tone: 'bg-rose-50 text-rose-500' },
        { to: '/account/addresses', label: 'Addresses', text: 'Manage delivery locations', icon: MapPin, tone: 'bg-amber-50 text-amber-600' },
        { to: '/account/details', label: 'Profile Details', text: 'View your personal information', icon: User, tone: 'bg-emerald-50 text-emerald-600' },
    ];

    return <div className="space-y-6">
        <div className="overflow-hidden rounded-3xl bg-[#19364d] p-7 text-white shadow-xl shadow-slate-200 sm:p-9">
            <p className="text-sm font-bold text-emerald-300">Account overview</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Hello, {user?.name?.split(' ')[0] || 'there'}!</h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-300">Quickly access your orders, saved items, addresses, and profile information.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
            {quickLinks.map(({ to, label, text, icon: Icon, tone }) => <Link key={to} to={to} className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone}`}><Icon size={23} /></span>
                <span className="min-w-0 flex-1"><span className="block font-black text-[#253D4E]">{label}</span><span className="mt-0.5 block text-sm text-slate-500">{text}</span></span>
                <ChevronRight size={18} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#31b875]" />
            </Link>)}
        </div>
    </div>;
};

const AddressPage = () => {
    const { data, isLoading } = useGetMyAddressesQuery();
    const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', phone: '', streetAddress: '', city: '', state: '', pincode: '', isDefault: false });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setFormData((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await addAddress(formData).unwrap();
            Swal.fire('Saved!', 'Your delivery address has been added.', 'success');
            setShowForm(false);
            setFormData({ fullName: '', phone: '', streetAddress: '', city: '', state: '', pincode: '', isDefault: false });
        } catch (error: any) {
            Swal.fire('Error', error.data?.message || 'Address could not be added.', 'error');
        }
    };

    if (isLoading) return <div className="flex min-h-72 items-center justify-center rounded-3xl bg-white"><Loader2 className="animate-spin text-[#31b875]" size={40} /></div>;

    return <div>
        <div className="mb-6 flex items-end justify-between gap-4"><div><h2 className="text-2xl font-black sm:text-3xl">Saved Addresses</h2><p className="mt-1 text-sm text-slate-500">Choose where you want your Freshq orders delivered.</p></div>{showForm && <button type="button" onClick={() => setShowForm(false)} className="font-bold text-rose-500">Cancel</button>}</div>
        {showForm ? <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} /><Field label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} /></div>
            <Field label="Street Address / Flat No." name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} />
            <div className="grid gap-5 sm:grid-cols-3"><Field label="City" name="city" value={formData.city} onChange={handleInputChange} /><Field label="State" name="state" value={formData.state} onChange={handleInputChange} /><Field label="Pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} /></div>
            <label className="flex cursor-pointer items-center gap-3 text-sm font-bold text-slate-600"><input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} className="h-5 w-5 accent-[#31b875]" /> Make this my default address</label>
            <button disabled={isAdding} className="flex items-center gap-2 rounded-xl bg-[#31b875] px-6 py-3 font-bold text-white disabled:opacity-60">{isAdding ? <Loader2 className="animate-spin" size={18} /> : <MapPin size={18} />} Save address</button>
        </form> : <div className="grid gap-5 sm:grid-cols-2">
            {data?.addresses?.map((address) => <article key={address.id} className={`relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm ${address.isDefault ? 'border-emerald-300' : 'border-slate-100'}`}>
                {address.isDefault && <span className="absolute right-0 top-0 rounded-bl-xl bg-[#31b875] px-3 py-1 text-xs font-black text-white">Primary</span>}
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#31b875]"><MapPin size={20} /></div>
                <h3 className="flex items-center gap-2 text-lg font-black">{address.fullName}{address.isDefault && <CheckCircle size={16} className="text-[#31b875]" />}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{address.streetAddress}<br />{address.city}, {address.state} - {address.pincode}<br />Phone: {address.phone}</p>
                <button type="button" className="mt-4 flex items-center gap-1.5 text-sm font-black text-[#31b875]"><Edit size={15} /> Edit address</button>
            </article>)}
            <button type="button" onClick={() => setShowForm(true)} className="flex min-h-52 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-6 text-slate-400 transition hover:border-[#31b875] hover:bg-emerald-50 hover:text-[#31b875]"><Plus size={32} /><span className="mt-3 font-black">Add New Address</span><span className="mt-1 text-xs">Set a new delivery location</span></button>
        </div>}
    </div>;
};

const Field = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => <label className="block"><span className="mb-2 block text-sm font-black text-slate-700">{label}</span><input required {...props} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#31b875] focus:bg-white focus:ring-4 focus:ring-emerald-100" /></label>;

const PasswordField = ({ label, placeholder }: { label: string; placeholder: string }) => {
    const [isVisible, setIsVisible] = useState(false);

    return <label className="block">
        <span className="mb-2 block text-sm font-black text-slate-700">{label}</span>
        <span className="relative block">
            <input type={isVisible ? 'text' : 'password'} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 outline-none transition focus:border-[#31b875] focus:bg-white focus:ring-4 focus:ring-emerald-100" />
            <button type="button" onClick={() => setIsVisible((visible) => !visible)} aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-emerald-50 hover:text-[#31b875]">
                {isVisible ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
        </span>
    </label>;
};

const AccountDetailsPage = ({ user }: { user: any }) => (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7 flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#31b875]"><User size={24} /></span><div><h2 className="text-2xl font-black">Profile Details</h2><p className="text-sm text-slate-500">Your personal and login information.</p></div></div>
        <form className="max-w-2xl space-y-6">
            <div className="grid gap-5 sm:grid-cols-2"><Field label="First Name" defaultValue={user?.name?.split(' ')[0] || ''} /><Field label="Last Name" defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''} /></div>
            <label className="block"><span className="mb-2 block text-sm font-black text-slate-700">Email Address</span><input type="email" disabled defaultValue={user?.email} className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500" /><span className="mt-1.5 block text-xs text-slate-400">Your email is used for login and order updates.</span></label>
            <div className="border-t border-slate-100 pt-6"><h3 className="mb-4 font-black">Password change</h3><div className="grid gap-5 sm:grid-cols-2"><PasswordField label="Current Password" placeholder="Enter current password" /><PasswordField label="New Password" placeholder="Enter new password" /></div></div>
            <button type="button" className="rounded-xl bg-[#31b875] px-7 py-3.5 font-black text-white shadow-lg shadow-emerald-100">Save Changes</button>
        </form>
    </div>
);

export default UserAccount;
