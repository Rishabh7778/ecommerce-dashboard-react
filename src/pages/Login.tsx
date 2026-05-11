import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Redirection ke liye zaroori hai
import { Mail, Lock, User, KeyRound, ShoppingBag, ArrowRight, Loader2, FastForward, EyeOff, Eye } from 'lucide-react';
import { useRegisterMutation, useLoginMutation } from '../services/authApi';
import Swal from 'sweetalert2';

const Login = () => {
    const navigate = useNavigate();
    
    // State to toggle between Login (true) and Register (false)
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // RTK Query Mutations
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [register, { isLoading: isRegLoading }] = useRegisterMutation();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Client-side Validation
        if (!isLogin && formData.password !== formData.confirmPassword) {
            return Swal.fire('Error', 'Bhai, dono password same hone chahiye!', 'error');
        }

        try {
            if (isLogin) {
                // --- LOGIN LOGIC ---
                const res = await login({ 
                    email: formData.email, 
                    password: formData.password 
                }).unwrap();

                // Token aur User Info save karein
                localStorage.setItem('user', JSON.stringify(res.user));

                Swal.fire({
                    icon: 'success',
                    title: `Welcome back, ${res.user.name}!`,
                    timer: 1500,
                    showConfirmButton: false
                });

                // Redirection Logic
                setTimeout(() => {
                    if (res.user.role === 'admin') navigate('/admin');
                    else navigate('/');
                }, 1500);

            } else {
                // --- REGISTER LOGIC ---
                await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'user' // Default role as per SQL schema
                }).unwrap();

                Swal.fire('Success', 'Account ban gaya! Ab login kar lo.', 'success');
                setIsLogin(true); // Switch to login mode
            }
        } catch (err: any) {
            console.error("Auth Error:", err);
            Swal.fire('Oops!', err.data?.message || 'Email ya Password galat hai!', 'error');
        }
    };

    const foodImages = [
        "https://images.unsplash.com/photo-1540420828642-fca2c5918401?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1576402187878-974f70c890a5?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=300&auto=format&fit=crop"
    ];

    // Hum loading check kar rahe hain login aur register dono ke liye
    const isAuthenticating = isLoginLoading || isRegLoading;

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center font-sans text-[#253D4E] p-4 lg:p-0">
            <div className="bg-white w-full max-w-7xl h-[90vh] lg:h-[80vh] rounded-3xl shadow-2xl border border-gray-100 flex overflow-hidden">
                
                {/* --- LEFT SIDE: Food Visuals --- */}
                <div className="hidden lg:flex w-1/2 bg-green-50/50 p-12 flex-col justify-between border-r border-gray-100 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-[#3BB77E] p-3 rounded-2xl shadow-lg shadow-green-100">
                                <ShoppingBag className="text-white" size={28} />
                            </div>
                            <h1 className="text-3xl font-extrabold text-[#253D4E]">
                                Deal<span className="text-[#3BB77E]">port</span> <span className="text-xs font-medium text-gray-400">Foods</span>
                            </h1>
                        </div>
                        <p className="text-gray-500 text-lg max-w-sm">
                            Bhai, Fresh Grocery aur Food seedha aapke darwaaze par.
                        </p>
                    </div>

                    <div className="absolute inset-0 pt-32 px-10 grid grid-cols-2 gap-4 opacity-70 scale-105 rotate-[-5deg]">
                        {foodImages.map((img, index) => (
                            <div key={index} className={`rounded-3xl overflow-hidden border-4 border-white shadow-xl ${index % 2 !== 0 ? 'mt-10' : ''}`}>
                                <img src={img} alt="food" className="w-full h-full object-cover aspect-square" />
                            </div>
                        ))}
                    </div>

                    <div className="relative z-10 bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white flex items-center gap-4 shadow-lg">
                        <FastForward className="text-[#3BB77E]" size={40} />
                        <div>
                            <h4 className="font-bold text-lg text-[#253D4E]">Express Delivery</h4>
                            <p className="text-sm text-gray-500">10 minute mein delivery ka vaada!</p>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT SIDE: FORM --- */}
                <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative bg-white overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="mb-8">
                            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#253D4E]">
                                {isLogin ? "Welcome Back, Bhai!" : "Create Account"}
                            </h2>
                            <p className="text-gray-500 mt-2 text-lg">
                                {isLogin ? "Apna details daalo aur shopping shuru karo." : "Join Dealport Foods today!"}
                            </p>
                        </div>

                        <div className="space-y-5">
                            {!isLogin && (
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3BB77E]" size={20} />
                                    <input name="name" onChange={handleInputChange} type="text" placeholder="Full Name" required className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none transition-all focus:border-[#3BB77E] focus:bg-white focus:ring-2 focus:ring-green-100" />
                                </div>
                            )}

                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3BB77E]" size={20} />
                                <input name="email" onChange={handleInputChange} type="email" placeholder="Email Address" required className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none transition-all focus:border-[#3BB77E] focus:bg-white focus:ring-2 focus:ring-green-100" />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3BB77E]" size={20} />
                                <input name="password" onChange={handleInputChange} type={showPassword ? "text" : "password"} placeholder="Password" required className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none transition-all focus:border-[#3BB77E] focus:bg-white focus:ring-2 focus:ring-green-100" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3BB77E]">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {!isLogin && (
                                <div className="relative group">
                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3BB77E]" size={20} />
                                    <input name="confirmPassword" onChange={handleInputChange} type={showPassword ? "text" : "password"} placeholder="Confirm Password" required className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none transition-all focus:border-[#3BB77E] focus:bg-white focus:ring-2 focus:ring-green-100" />
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={isAuthenticating}
                            className="w-full py-4 bg-[#3BB77E] hover:bg-[#2fa06c] text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 group"
                        >
                            {isAuthenticating ? <Loader2 className="animate-spin" /> : null}
                            {isAuthenticating ? (isLogin ? 'Checking...' : 'Creating...') : (isLogin ? 'Login Now' : 'Sign Up')}
                            {!isAuthenticating && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-500 text-lg">
                            {isLogin ? "Naye ho kya bhai?" : "Pehle se account hai?"}
                            <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-[#3BB77E] hover:text-[#2fa06c] ml-2">
                                {isLogin ? "Sign Up Karo" : "Login Karo"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;