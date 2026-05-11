// Isko lucide-react wale import mein add kar lena: Headset, Send, MessageSquare

import React, { useState } from 'react';
import { useAddComplaintMutation } from '../services/complaintApi';
import { Headset, Send, Loader2, MessageSquare } from 'lucide-react';
import Swal from 'sweetalert2';

export const HelpSupportTab = () => {
    const [addComplaint, { isLoading }] = useAddComplaintMutation();
    const [formData, setFormData] = useState({ subject: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addComplaint(formData).unwrap();
            Swal.fire({
                title: 'Sent!',
                text: 'Aapki query admin ko bhej di gayi hai. Hum jald hi aapse sampark karenge.',
                icon: 'success',
                confirmButtonColor: '#3BB77E'
            });
            setFormData({ subject: '', message: '' }); // Form clear kar do
        } catch (error: any) {
            Swal.fire('Error', error.data?.message || 'Message nahi gaya. Phir se try karein.', 'error');
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-fadeIn max-w-3xl">
            <div className="flex items-center gap-3 mb-2">
                <Headset className="text-[#3BB77E]" size={28} />
                <h2 className="text-2xl font-bold">Help & Support</h2>
            </div>
            <p className="text-gray-500 mb-8">Koi dikkat hai ya koi sawaal? Humein message karein, humari team jaldi reply karegi.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Subject / Sawaal kis baare mein hai?</label>
                    <input 
                        required 
                        type="text" 
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Eg: Payment issue, Wrong product delivered, etc." 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none focus:border-[#3BB77E] focus:bg-white transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Message Detail</label>
                    <textarea 
                        required 
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Apni problem yahan detail mein likhein..." 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#F8F9FA] outline-none focus:border-[#3BB77E] focus:bg-white transition-colors resize-none"
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="py-4 px-8 bg-[#3BB77E] hover:bg-[#2fa06c] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-70"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    {isLoading ? 'Sending...' : 'Send Message'}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3 bg-blue-50/50 p-4 rounded-2xl text-blue-800">
                <MessageSquare size={20} className="text-blue-500" />
                <p className="text-sm font-medium">Aapka phone number aur email aapke account se automatically fetch kar liya jayega taaki hum aapse contact kar sakein.</p>
            </div>
        </div>
    );
};