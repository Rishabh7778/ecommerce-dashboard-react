import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useGetAllProductsQuery, 
  useDeleteProductMutation, 
  useGetCategoriesQuery 
} from '../services/productApi'; 
import { Search, Edit, Trash2, Loader2, Package, Filter, ChevronLeft, ChevronRight } from 'lucide-react'; // 🔥 Chevron icons add kiye
import Swal from 'sweetalert2';

const AdminProducts = () => {
  const navigate = useNavigate(); 
  
  // 🔥 PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Admin table mein ek page pe 10 products theek rahenge

  // RTK Query Hooks (Ab page aur limit bhej rahe hain)
  const { data: responseData, isLoading: isLoadingProducts } = useGetAllProductsQuery({ 
      page: currentPage, 
      limit: productsPerPage 
  });
  const { data: categoriesData } = useGetCategoriesQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // States for Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Backend se aaya hua data nikal rahe hain
  const products = responseData?.products || [];
  const paginationData = responseData?.pagination;
  const categories = categoriesData || [];

  // Filter Logic (Search + Category) - Dhyan dein: Ye sirf current page ke data ko filter karega
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category_id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Delete Handler
  const handleDelete = async (id: number, title: string) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Aap "${title}" ko delete karna chahte hain?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        await deleteProduct(id).unwrap();
        Swal.fire('Deleted!', 'Product delete ho gaya hai.', 'success');
      } catch (error: any) {
        Swal.fire('Error!', error.data?.message || 'Delete nahi ho paya.', 'error');
      }
    }
  };

  if (isLoadingProducts) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-green-500 w-12 h-12" /></div>;
  }

  return (
    <div className="p-6 bg-[#F8F9FA] min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER & FILTERS */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Package className="text-[#3BB77E]" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                placeholder="Search current page..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3BB77E]" 
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none appearance-none cursor-pointer focus:border-[#3BB77E]"
              >
                <option value="All">All Categories</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>

        {/* PRODUCTS TABLE */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-green-50/50 text-gray-500 text-sm uppercase border-b border-gray-100">
                <tr>
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400 font-medium">No products found on this page.</td>
                  </tr>
                ) : (
                  filteredProducts.map((product: any) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 flex items-center gap-4">
                        <img 
                            src={product.img?.split(',')[0] || 'https://placehold.co/150x150'} 
                            alt={product.title} 
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200" 
                        />
                        <div className="font-bold text-gray-800 line-clamp-2 max-w-[250px]">{product.title}</div>
                      </td>
                      <td className="p-4 text-gray-600 text-sm">{product.category_name || `Cat ID: ${product.category_id}`}</td>
                      <td className="p-4 font-bold text-[#3BB77E]">₹{product.price}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.stockCount > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {product.stockCount} left
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${(product.status === 'published' || product.status === 'active') 
                            ? 'border-gray-200 text-gray-700 bg-gray-50' 
                            : 'border-red-200 text-red-600 bg-red-50'
                          }`}>
                          {product.status === 'active' ? 'PUBLISHED' : product.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => navigate('/admin/add-product', { state: { editData: product } })} 
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>

                          <button 
                            onClick={() => handleDelete(product.id, product.title)} 
                            disabled={isDeleting}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Product"
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

        {/* 🔥 PAGINATION CONTROLS */}
        {paginationData && paginationData.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-sm text-gray-500 font-medium">
              Showing Page <strong className="text-gray-800">{paginationData.page}</strong> of <strong className="text-gray-800">{paginationData.totalPages}</strong> ({paginationData.total} Total Products)
            </span>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-[#3BB77E] hover:text-white hover:border-[#3BB77E] disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              
              {[...Array(paginationData.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Sirf aas-paas ke pages dikhane ke liye condition laga sakte hain, par abhi simple rakha hai
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                      currentPage === pageNum 
                        ? 'bg-[#3BB77E] text-white shadow-md shadow-green-100 border-[#3BB77E]' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationData.totalPages))}
                disabled={currentPage === paginationData.totalPages}
                className="p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-[#3BB77E] hover:text-white hover:border-[#3BB77E] disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminProducts;