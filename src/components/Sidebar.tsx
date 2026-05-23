import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Users, Ticket, 
  Grid, CreditCard, Star, LogOut, Settings, PlusSquare, 
  MessageSquare
} from 'lucide-react';

const Sidebar = () => {
  // Yahan humne saare paths ke aage '/admin' prefix add kar diya hai
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Add Product', icon: PlusSquare, path: '/admin/add-product' },
    { name: 'Add Daily Deal', icon: PlusSquare, path: '/admin/daily-deals' },
    { name: 'Order Management', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Customers', icon: Users, path: '/admin/customers' },
    { name: 'Discount', icon: Ticket, path: '/admin/discount' },
    { name: 'Products', icon: Grid, path: '/admin/products' },
    { name: 'Deals', icon: Grid, path: '/admin/Deals' },
    { name: 'Transaction', icon: CreditCard, path: '/admin/transactions' },
    { name: 'Bulk Upload', icon: Star, path: '/admin/bulk-upload' },
    { name: 'Contact', icon: MessageSquare, path: '/admin/contact' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col justify-between hidden md:flex sticky top-0">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-green-500 text-white p-1 rounded">
             <LayoutDashboard size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-wider">DEALPORT</h1>
        </div>

        {/* Menu Items */}
        <p className="text-xs text-gray-400 font-semibold mb-4 uppercase">Main menu</p>
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                // 'end' property Dashboard link ke liye zaroori hai taaki jab aap 
                // /admin/add-product par hon, toh Dashboard green na dikhe.
                end={item.path === '/admin'}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium
                  ${isActive 
                    ? 'bg-green-500 text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}
                `}
              >
                <item.icon size={18} />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="w-10 h-10 rounded-full" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-800 truncate">Dealport</p>
            <p className="text-xs text-gray-400 truncate">Mark@thedesigner...</p>
          </div>
          <LogOut size={16} className="text-gray-400 ml-auto cursor-pointer hover:text-red-500" />
        </div>
        <button className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-all">
          <Settings size={16} /> Your Shop
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;