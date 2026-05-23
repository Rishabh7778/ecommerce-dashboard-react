import { useState } from 'react';
import { useGetAllMessagesQuery } from '../services/contactApi';
import { Mail, User, MessageSquare, Calendar, ChevronLeft, ChevronRight, Loader2, Inbox, ShieldAlert } from 'lucide-react';

const ContactAdminDashboard = () => {
  const [page, setPage] = useState(1);
  const limit = 8; // Ek page par kitne messages dikhane hain

  // 🔥 RTK Query hook se messages fetch karna
  const { data, isLoading, isError, error } = useGetAllMessagesQuery({ page, limit });
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  // Loading State UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fcf9] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-[#3BB77E]" size={40} />
        <p className="text-gray-500 font-medium">Bhai, messages load ho rahe hain...</p>
      </div>
    );
  }

  // Error State UI
  if (isError) {
    return (
      <div className="min-h-screen bg-[#f8fcf9] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center border border-red-100 flex flex-col items-center gap-4">
          <div className="p-4 bg-red-50 text-red-500 rounded-full"><ShieldAlert size={36}/></div>
          <h3 className="text-xl font-bold text-[#253D4E]">Access Denied / Error</h3>
          <p className="text-gray-500 text-sm">{(error as any)?.data?.error || "Messages fetch karne me dikkat aayi. Kripya check karein ki aap admin account se logged in hain ya nahi."}</p>
        </div>
      </div>
    );
  }

  const messages = data?.data || [];
  const pagination = data?.pagination || { total_pages: 1, total_records: 0 };

  return (
    <div className="bg-[#f8fcf9] min-h-screen font-sans text-[#253D4E] pb-12">
      
      {/* HEADER BAR */}
      <header className="bg-[#253D4E] text-white py-12 rounded-b-[2.5rem] px-6 md:px-12 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#3BB77E] text-xs font-bold uppercase tracking-wider mb-2">
              Admin Panel
            </div>
            <h1 className="text-3xl font-black">Contact Messages Portal</h1>
            <p className="text-gray-400 text-sm mt-1">Bitezone users ke aane wale saare queries aur feedbacks yahan manage karein.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center min-w-[140px]">
            <p className="text-xs text-gray-400 font-bold uppercase">Total Messages</p>
            <p className="text-3xl font-black text-[#3BB77E] mt-1">{pagination.total_records}</p>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: MESSAGE LIST (Takes 7 cols if message selected, else full 12) */}
          <div className={`${selectedMessage ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all duration-300 space-y-4`}>
            
            {messages.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4">
                <div className="p-4 bg-gray-50 text-gray-400 rounded-full"><Inbox size={40}/></div>
                <h3 className="text-xl font-bold">Koi message nahi mila!</h3>
                <p className="text-gray-400 max-w-sm">Abhi tak kisi bhi user ne contact form submit nahi kiya hai.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center px-2">
                  <h2 className="text-lg font-bold text-gray-500">Inbox List (Page {page})</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {messages.map((msg: any) => (
                    <div 
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white
                        ${selectedMessage?.id === msg.id 
                          ? 'border-[#3BB77E] ring-2 ring-[#3BB77E]/10 shadow-md translate-x-1' 
                          : 'border-gray-100 hover:border-gray-300 shadow-sm'}`}
                    >
                      <div className="space-y-1.5 max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#253D4E] text-base">{msg.name}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                            <Mail size={12}/> {msg.email}
                          </span>
                        </div>
                        <h4 className="font-bold text-[#3BB77E] text-sm tracking-wide truncate">{msg.subject}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{msg.message}</p>
                      </div>

                      <div className="flex items-center gap-3 text-right shrink-0">
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                          <Calendar size={12}/> {msg.created_at ? new Date(msg.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' }) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINATION PANEL */}
                {pagination.total_pages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-6">
                    <button 
                      onClick={() => setPage(p => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="p-3 bg-white border border-gray-100 text-[#253D4E] rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-bold bg-white border border-gray-100 px-5 py-3 rounded-xl shadow-sm text-gray-600">
                      Page <span className="text-[#253D4E] font-black">{page}</span> of {pagination.total_pages}
                    </span>
                    <button 
                      onClick={() => setPage(p => Math.min(p + 1, pagination.total_pages))}
                      disabled={page === pagination.total_pages}
                      className="p-3 bg-white border border-gray-100 text-[#253D4E] rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT COLUMN: DETAILED VIEW PANEL */}
          {selectedMessage && (
            <div className="lg:col-span-5 lg:sticky lg:top-6 h-fit">
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden relative">
                {/* Decorative Accent Strip */}
                <div className="h-2 bg-[#3BB77E] w-full"></div>
                
                <div className="p-8 space-y-6">
                  {/* Sender Profile Overview */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-green-50 text-[#3BB77E] rounded-2xl"><User size={24}/></div>
                      <div>
                        <h3 className="text-xl font-bold text-[#253D4E]">{selectedMessage.name}</h3>
                        <p className="text-sm font-medium text-gray-400 break-all">{selectedMessage.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedMessage(null)}
                      className="text-xs font-bold text-gray-400 hover:text-red-500 border border-gray-100 px-2.5 py-1.5 rounded-xl bg-gray-50 hover:bg-red-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Message Metadata */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Subject</span>
                      <div className="p-4 bg-[#f8fcf9] rounded-xl border border-green-50/50 flex items-start gap-2">
                        <MessageSquare size={16} className="text-[#3BB77E] shrink-0 mt-0.5" />
                        <h4 className="font-bold text-sm text-[#253D4E]">{selectedMessage.subject}</h4>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Message Content</span>
                      <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100/60 min-h-[150px]">
                        <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mailbox Redirection / Quick Actions */}
                  <a 
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                    className="w-full py-4 bg-[#253D4E] hover:bg-[#3BB77E] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:-translate-y-0.5"
                  >
                    <Mail size={18} />
                    <span>User Ko Reply Bhejein</span>
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ContactAdminDashboard;