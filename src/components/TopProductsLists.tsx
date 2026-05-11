import { Star } from 'lucide-react';
import trending from '../assets/images/trending.png';

// --- MOCK DATA ---
// Dummy data generated to match the 4 columns
const generateProducts = (prefix: string) => [
  { id: 1, title: `${prefix} Haagen Caramel Cone Ice Cream Boxed`, price: 22.85, oldPrice: 24.80, rating: 5, reviews: 1, img: trending },
  { id: 2, title: `${prefix} Seeds of Change Organic Red Rice`, price: 28.85, oldPrice: 32.80, rating: 4, reviews: 2, img: trending },
  { id: 3, title: `${prefix} Blue Almonds Lightly Salted Vegetables`, price: 23.85, oldPrice: 25.80, rating: 4, reviews: 0, img: trending },
];

const columnsData = [
  { id: 'col1', title: "Top Selling", products: generateProducts("Top") },
  { id: 'col2', title: "Trending Products", products: generateProducts("Trend") },
  { id: 'col3', title: "Recently added", products: generateProducts("New") },
  { id: 'col4', title: "Top Rated", products: generateProducts("Best") },
];

// --- MINI PRODUCT CARD COMPONENT ---
// Yeh component ek single list item banayega (Image left, text right)
const MiniProductCard = ({ product }: { product: any }) => (
  <div className="flex items-center gap-4 group cursor-pointer hover:-translate-y-1 transition-transform duration-300 bg-white p-2 rounded-xl hover:shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-transparent hover:border-gray-50">
    
    {/* Product Image */}
    <div className="w-20 h-20 bg-[#f4f6fa] rounded-lg flex items-center justify-center p-2 flex-shrink-0 overflow-hidden">
      <img 
        src={product.img} 
        alt={product.title} 
        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
      />
    </div>

    {/* Product Details */}
    <div className="flex flex-col">
      <h4 className="text-sm font-bold text-[#253D4E] group-hover:text-[#3BB77E] transition-colors line-clamp-2 leading-snug mb-1">
        {product.title}
      </h4>
      
      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-1">
        <div className="flex text-[#fdc040]">
          {[...Array(5)].map((_, i) => (
             <Star 
               key={i} 
               size={12} 
               fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
               strokeWidth={i < Math.floor(product.rating) ? 0 : 2} 
               className={i >= Math.floor(product.rating) ? "text-gray-300" : ""} 
             />
          ))}
        </div>
        {product.reviews > 0 && <span className="text-xs text-gray-400 ml-1">{product.reviews}</span>}
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        <span className="text-[#3BB77E] font-bold text-sm">${product.price.toFixed(2)}</span>
        <span className="text-gray-400 text-xs line-through font-medium">${product.oldPrice.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const TopProductsLists = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      
      {/* Responsive Grid: 1 col (Mobile), 2 cols (Tablet), 4 cols (Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {columnsData.map((column) => (
          <div key={column.id} className="flex flex-col">
            
            {/* Column Header with Green Underline */}
            <div className="relative pb-3 mb-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-[#253D4E]">{column.title}</h3>
              {/* Green Line Overlay */}
              <div className="absolute -bottom-[1px] left-0 w-20 h-[2px] bg-[#3BB77E]"></div>
            </div>

            {/* List of 3 Products */}
            <div className="flex flex-col gap-4">
              {column.products.map((product) => (
                <MiniProductCard key={product.id} product={product} />
              ))}
            </div>

          </div>
        ))}

      </div>

    </section>
  );
};

export default TopProductsLists;