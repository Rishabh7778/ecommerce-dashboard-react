import { Shield, ShieldAlert, Trash2, Mail, Phone, Loader2 } from 'lucide-react';
import { 
  useGetAllUsersQuery, 
  useUpdateUserRoleMutation, 
  useDeleteUserMutation 
} from '../services/userApi';

const UserListTable = () => {
  // 🔥 API Hooks
  const { data, isLoading, isError } = useGetAllUsersQuery();
  const [updateRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = data?.users || [];

  // Handlers
  const handleRoleChange = async (id: number | string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Are you sure you want to make this user an ${newRole}?`)) {
      try {
        await updateRole({ id, role: newRole }).unwrap();
      } catch (error) {
        alert("Failed to update role!");
      }
    }
  };

  const handleDelete = async (id: number | string, name: string) => {
    if (window.confirm(`⚠️ WARNING: Are you sure you want to delete ${name}? This cannot be undone.`)) {
      try {
        await deleteUser(id).unwrap();
      } catch (error) {
        alert("Failed to delete user!");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#253D4E]">Customer Management</h2>
          <p className="text-sm text-gray-400 mt-1">View and manage your registered users</p>
        </div>
        <div className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-sm font-bold">
          Total: {data?.total || 0}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 font-bold uppercase tracking-wider">
              <th className="pb-4 font-semibold px-4">User</th>
              <th className="pb-4 font-semibold px-4">Contact Info</th>
              <th className="pb-4 font-semibold px-4">Role</th>
              <th className="pb-4 font-semibold px-4">Joined Date</th>
              <th className="pb-4 font-semibold px-4 text-right">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-50 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center"><Loader2 className="animate-spin mx-auto w-8 h-8 text-[#3BB77E]" /></td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-red-500 font-medium">Failed to load users.</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400 font-medium">No users found.</td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  {/* User Profile */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3BB77E] to-green-300 flex items-center justify-center text-white font-bold shadow-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{user.name}</p>
                        <p className="text-[11px] text-gray-400">ID: #{user.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Mail size={12} className="text-gray-400" /> 
                        <span className="text-xs">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Phone size={12} className="text-gray-400" /> 
                          <span className="text-xs">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center w-max gap-1
                      ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-100 text-gray-600 border border-gray-200'}
                    `}>
                      {user.role === 'admin' ? <ShieldAlert size={12} /> : <Shield size={12} />}
                      {user.role}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="py-4 px-4 text-gray-500 font-medium">
                    {new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Change Role Button */}
                      <button 
                        onClick={() => handleRoleChange(user.id, user.role)}
                        disabled={isUpdating}
                        title={user.role === 'admin' ? "Demote to User" : "Make Admin"}
                        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <ShieldAlert size={16} />
                      </button>
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDelete(user.id, user.name)}
                        disabled={isDeleting}
                        title="Delete User"
                        className="p-2 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserListTable;