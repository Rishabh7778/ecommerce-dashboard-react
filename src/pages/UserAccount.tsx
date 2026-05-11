import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyAddressesQuery, useAddAddressMutation } from '../services/addressApi';
import { 
    User, 
    MapPin, 
    Package, 
    LogOut, 
    LayoutDashboard, 
    ChevronRight, 
    Edit, 
    Plus, 
    CheckCircle,
    Loader2, 
    Headset
} from 'lucide-react';
import Swal from 'sweetalert2';
// Aapka naya alag banaya hua Order Component
import MyOrdersTab from '../components/MyOrder';
import { HelpSupportTab } from '../components/HelpSupportTab'; 

const UserAccount = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        } else {
            navigate('/login'); 
        }
    }, [navigate]);

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Aap Dealport se logout ho jayenge!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3BB77E',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                // 1. Storage clear
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // 🔥 2. MAIN FIX: window.location.href se page ko force refresh/redirect karna.
                // Ye purani Redux Cache (RTK Query Memory) ko automatically tabah (destroy) kar dega
                window.location.href = '/login'; 
            }
        });
    };

    if (!userData) return null; 

    return (
        <div className="bg-[#F8F9FA] min-h-screen py-10 px-4 font-sans text-[#253D4E]">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold">My Account</h1>
                    <p className="text-gray-500 mt-1">Dashboard, Orders aur Addresses manage karein.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT SIDEBAR */}
                    <div className="w-full lg:w-1/4">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                                <div className="w-16 h-16 bg-green-100 text-[#3BB77E] rounded-full flex items-center justify-center text-2xl font-bold">
                                    {userData?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{userData?.name}</h3>
                                    <p className="text-sm text-gray-500 truncate max-w-[150px]">{userData?.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} label="Dashboard" />
                                <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<Package size={20} />} label="Orders History" />
                                <TabButton active={activeTab === 'address'} onClick={() => setActiveTab('address')} icon={<MapPin size={20} />} label="My Addresses" />
                                <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')} icon={<User size={20} />} label="Account Details" />
                                <TabButton active={activeTab === 'support'} onClick={() => setActiveTab('support')} icon={<Headset size={20} />} label="Help & Support" />

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-colors text-left mt-4"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* RIGHT CONTENT AREA */}
                    <div className="w-full lg:w-3/4">
                        {activeTab === 'dashboard' && <DashboardTab user={userData} setTab={setActiveTab} />}
                        {activeTab === 'orders' && <MyOrdersTab />}
                        {activeTab === 'address' && <AddressTab />}
                        {activeTab === 'details' && <AccountDetailsTab user={userData} />}
                        {activeTab === 'support' && <HelpSupportTab />}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SUB COMPONENTS FOR TABS ---

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${active ? 'bg-[#3BB77E] text-white shadow-md shadow-green-100' : 'text-gray-600 hover:bg-gray-50'
            }`}
    >
        <div className="flex items-center gap-3">
            {icon}
            <span>{label}</span>
        </div>
        <ChevronRight size={16} className={active ? 'opacity-100' : 'opacity-0'} />
    </button>
);

const DashboardTab = ({ user, setTab }: any) => (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-4">Hello, {user?.name}! 👋</h2>
        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            Apne Account Dashboard se aap aasani se apni <button onClick={() => setTab('orders')} className="text-[#3BB77E] font-bold hover:underline">recent orders</button> check kar sakte hain,
            apne <button onClick={() => setTab('address')} className="text-[#3BB77E] font-bold hover:underline">shipping and billing addresses</button> manage kar sakte hain,
            aur apna password ya account details update kar sakte hain.
        </p>
    </div>
);

const AddressTab = () => {
    // RTK Query Hooks
    const { data, isLoading } = useGetMyAddressesQuery();
    const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '', phone: '', streetAddress: '', city: '', state: '', pincode: '', isDefault: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addAddress(formData).unwrap();
            Swal.fire('Success', 'Address save ho gaya!', 'success');
            setShowForm(false); 
            setFormData({ fullName: '', phone: '', streetAddress: '', city: '', state: '', pincode: '', isDefault: false }); 
        } catch (error: any) {
            Swal.fire('Error', error.data?.message || 'Address add nahi ho paya.', 'error');
        }
    };

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#3BB77E]" size={40} /></div>;

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Addresses</h2>
                {showForm && (
                    <button onClick={() => setShowForm(false)} className="text-red-500 font-bold hover:underline">
                        Cancel
                    </button>
                )}
            </div>

            {showForm ? (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4 max-w-2xl animate-fadeIn">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Full Name</label>
                            <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none focus:border-[#3BB77E]" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Phone Number</label>
                            <input required name="phone" value={formData.phone} onChange={handleInputChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none focus:border-[#3BB77E]" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1">Street Address / Flat No.</label>
                        <input required name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none focus:border-[#3BB77E]" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">City</label>
                            <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none focus:border-[#3BB77E]" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">State</label>
                            <input required name="state" value={formData.state} onChange={handleInputChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none focus:border-[#3BB77E]" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Pincode</label>
                            <input required name="pincode" value={formData.pincode} onChange={handleInputChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none focus:border-[#3BB77E]" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <input type="checkbox" name="isDefault" id="isDefault" checked={formData.isDefault} onChange={handleInputChange} className="w-5 h-5 accent-[#3BB77E]" />
                        <label htmlFor="isDefault" className="font-medium cursor-pointer">Set as Default Address</label>
                    </div>

                    <button type="submit" disabled={isAdding} className="mt-4 px-6 py-3 bg-[#3BB77E] text-white font-bold rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-70">
                        {isAdding ? <Loader2 className="animate-spin" size={20} /> : <MapPin size={20} />}
                        {isAdding ? 'Saving...' : 'Save Address'}
                    </button>
                </form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data?.addresses?.map((address) => (
                        <div key={address.id} className={`bg-white p-6 rounded-3xl shadow-sm border relative overflow-hidden ${address.isDefault ? 'border-green-300 bg-green-50/30' : 'border-gray-200'}`}>
                            {address.isDefault && (
                                <div className="absolute top-0 right-0 bg-[#3BB77E] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                    Primary
                                </div>
                            )}
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                {address.fullName} {address.isDefault && <CheckCircle size={16} className="text-[#3BB77E]" />}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                {address.streetAddress}<br />
                                {address.city}, {address.state} - {address.pincode}<br />
                                Ph: {address.phone}
                            </p>
                            <div className="flex gap-3">
                                <button className="text-[#3BB77E] font-bold text-sm flex items-center gap-1 hover:underline">
                                    <Edit size={14} /> Edit
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-200 hover:border-[#3BB77E] hover:bg-green-50 flex flex-col items-center justify-center text-gray-400 hover:text-[#3BB77E] transition-all min-h-[180px]"
                    >
                        <Plus size={32} className="mb-2" />
                        <span className="font-bold">Add New Address</span>
                        <span className="text-xs mt-1">Delivery locations set karein</span>
                    </button>

                </div>
            )}
        </div>
    );
};

const AccountDetailsTab = ({ user }: any) => {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6">Account Details</h2>
            <form className="space-y-6 max-w-xl">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">First Name *</label>
                        <input type="text" defaultValue={user?.name.split(' ')[0]} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none focus:border-[#3BB77E]" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Last Name *</label>
                        <input type="text" defaultValue={user?.name.split(' ')[1] || ''} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none focus:border-[#3BB77E]" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Email Address *</label>
                    <input type="email" disabled defaultValue={user?.email} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none" />
                    <p className="text-xs text-gray-400 mt-1">Email id change nahi ho sakti.</p>
                </div>

                <h3 className="font-bold text-lg mt-8 mb-4 border-t border-gray-100 pt-6">Password Change (Optional)</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Current Password</label>
                        <input type="password" placeholder="Leave blank to leave unchanged" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none focus:border-[#3BB77E]" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">New Password</label>
                        <input type="password" placeholder="New Password" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none focus:border-[#3BB77E]" />
                    </div>
                </div>

                <button type="button" className="py-4 px-8 bg-[#3BB77E] hover:bg-[#2fa06c] text-white font-bold rounded-xl shadow-lg transition-all">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default UserAccount;