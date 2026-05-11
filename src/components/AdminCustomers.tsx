import React from 'react';
import { useGetAllComplaintsQuery, useResolveComplaintMutation } from '../services/complaintApi';
import { Loader2, Users, Mail, Phone, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminCustomers = () => {
  const { data, isLoading } = useGetAllComplaintsQuery();
  const [resolveComplaint, { isLoading: isResolving }] = useResolveComplaintMutation();

  const handleResolve = async (id: number) => {
    try {
      await resolveComplaint(id).unwrap();
      Swal.fire({
        title: 'Resolved!',
        text: 'Customer ki problem solve ho gayi hai.',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (err) {
      Swal.fire('Error', 'Status update nahi ho paya', 'error');
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  const complaints = data?.complaints || [];

  return (
    <div className="p-6 bg-[#F8F9FA] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Users className="text-blue-600" size={32} />
          <h1 className="text-2xl font-bold">Customer Complaints & Queries</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="p-4 font-semibold">Customer Info</th>
                <th className="p-4 font-semibold">Contact Details</th>
                <th className="p-4 font-semibold w-1/3">Message / Complaint</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {complaints.length === 0 ? (
                 <tr>
                     <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">Koi complaints nahi hain! 🎉</td>
                 </tr>
              ) : complaints.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Name & Date */}
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{item.userName || 'Unknown User'}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleString()}</div>
                  </td>
                  
                  {/* Email & Phone */}
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Mail size={14} className="text-gray-400" /> {item.userEmail}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} className="text-gray-400" /> {item.userPhone || 'N/A'}
                    </div>
                  </td>
                  
                  {/* Complaint Message */}
                  <td className="p-4">
                    <div className="font-bold text-sm text-gray-800 mb-1">{item.subject || 'General Query'}</div>
                    <p className="text-sm text-gray-600 line-clamp-2" title={item.message}>
                      {item.message}
                    </p>
                  </td>
                  
                  {/* Status Badge */}
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      item.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status || 'Pending'}
                    </span>
                  </td>
                  
                  {/* Resolve Button */}
                  <td className="p-4 text-center">
                    {item.status !== 'resolved' ? (
                      <button 
                        onClick={() => handleResolve(item.id)}
                        disabled={isResolving}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 w-full mx-auto"
                      >
                        <CheckCircle size={16} /> Resolve
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm font-bold flex items-center justify-center gap-1">
                        <CheckCircle size={16} /> Done
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;