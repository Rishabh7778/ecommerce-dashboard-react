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
                localStorage.setItem('token', res.token);

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
        <div className="min-h-screen bg-[#f5faf7] bg-[radial-gradient(circle_at_top_left,_#d9f7e8_0,_transparent_33%),radial-gradient(circle_at_bottom_right,_#dff3ff_0,_transparent_30%)] flex items-center justify-center font-sans text-[#19364d] p-4 lg:p-8">
            <div className="bg-white/95 w-full max-w-6xl min-h-[720px] lg:h-[82vh] rounded-[32px] shadow-[0_24px_70px_-28px_rgba(29,78,65,0.32)] border border-white flex overflow-hidden">
                
                {/* --- LEFT SIDE: Food Visuals --- */}
                <div className="hidden lg:flex w-[46%] bg-[#effbf5] p-10 xl:p-12 flex-col justify-between border-r border-emerald-100/70 relative overflow-hidden">
                    <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-emerald-200/45 blur-3xl" />
                    <div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-teal-100/70 blur-3xl" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-7">
                            <div className="bg-[#31b875] p-3 rounded-2xl shadow-lg shadow-emerald-200/80">
                                <ShoppingBag className="text-white" size={28} />
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-[#19364d]">
                                Fresh<span className="text-[#31b875]">q</span>
                            </h1>
                        </div>
                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white/75 px-3 py-1 text-xs font-bold tracking-wide text-emerald-700">
                            FRESH GROCERIES, DELIVERED
                        </span>
                        <p className="mt-4 text-lg leading-8 text-slate-600 max-w-sm">
                            Fresh groceries aur everyday essentials, seedha aapke darwaaze par.
                        </p>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 pt-40 px-10 grid grid-cols-2 gap-4 opacity-80 scale-105 rotate-[-5deg]">
                        {foodImages.map((img, index) => (
                            <div key={index} className={`rounded-3xl overflow-hidden border-4 border-white shadow-xl shadow-emerald-950/10 bg-emerald-100 ${index % 2 !== 0 ? 'mt-10' : ''}`}>
                                <img src={img} alt="food" className="w-full h-full object-cover aspect-square" />
                            </div>
                        ))}
                    </div>

                    <div className="relative z-10 bg-white/85 backdrop-blur-md p-5 rounded-2xl border border-white/90 flex items-center gap-4 shadow-xl shadow-emerald-950/10">
                        <div className="rounded-xl bg-emerald-100 p-2.5"><FastForward className="text-[#31b875]" size={30} /></div>
                        <div>
                            <h4 className="font-bold text-base text-[#19364d]">Express Delivery</h4>
                            <p className="text-sm text-slate-500">Fresh essentials, right when you need them.</p>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT SIDE: FORM --- */}
                <div className="w-full lg:w-[54%] p-8 sm:p-12 lg:p-14 xl:p-16 flex flex-col justify-center relative bg-white overflow-y-auto">
                    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
                        <div className="mb-10">
                            <div className="lg:hidden flex items-center gap-2 mb-8">
                                <div className="bg-[#31b875] p-2 rounded-xl"><ShoppingBag className="text-white" size={20} /></div>
                                <span className="text-xl font-extrabold tracking-tight text-[#19364d]">Fresh<span className="text-[#31b875]">q</span></span>
                            </div>
                            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#31b875] mb-3">{isLogin ? 'Good to see you' : 'Start shopping smarter'}</p>
                            <h2 className="text-3xl lg:text-[2.5rem] leading-tight font-extrabold text-[#19364d]">
                                {isLogin ? "Welcome back!" : "Create your account"}
                            </h2>
                            <p className="text-slate-500 mt-3 text-base leading-7">
                                {isLogin ? "Log in to manage your orders and continue shopping." : "Join Freshq for a simpler way to shop fresh."}
                            </p>
                        </div>

                        <div className="space-y-5">
                            {!isLogin && (
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3BB77E]" size={20} />
                                    <input name="name" onChange={handleInputChange} type="text" placeholder="Full Name" required className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none transition-all focus:border-[#31b875] focus:bg-white focus:ring-4 focus:ring-emerald-100" />
                                </div>
                            )}

                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3BB77E]" size={20} />
                                <input name="email" onChange={handleInputChange} type="email" placeholder="Email Address" required className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none transition-all focus:border-[#31b875] focus:bg-white focus:ring-4 focus:ring-emerald-100" />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3BB77E]" size={20} />
                                <input name="password" onChange={handleInputChange} type={showPassword ? "text" : "password"} placeholder="Password" required className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none transition-all focus:border-[#31b875] focus:bg-white focus:ring-4 focus:ring-emerald-100" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3BB77E]">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {!isLogin && (
                                <div className="relative group">
                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3BB77E]" size={20} />
                                    <input name="confirmPassword" onChange={handleInputChange} type={showPassword ? "text" : "password"} placeholder="Confirm Password" required className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none transition-all focus:border-[#31b875] focus:bg-white focus:ring-4 focus:ring-emerald-100" />
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={isAuthenticating}
                            className="w-full py-4 bg-[#31b875] hover:bg-[#279b61] text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base disabled:opacity-70 group"
                        >
                            {isAuthenticating ? <Loader2 className="animate-spin" /> : null}
                            {isAuthenticating ? (isLogin ? 'Checking...' : 'Creating...') : (isLogin ? 'Login Now' : 'Sign Up')}
                            {!isAuthenticating && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />}
                        </button>
                    </form>

                    <div className="mt-10 text-center w-full max-w-md mx-auto border-t border-slate-100 pt-7">
                        <p className="text-slate-500 text-sm">
                            {isLogin ? "New to Freshq?" : "Already have an account?"}
                            <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-[#31b875] hover:text-[#279b61] ml-2">
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
