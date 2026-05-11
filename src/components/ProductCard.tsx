import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  price: number;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ image, title, description, price, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden flex flex-col h-full">
      
      {/* Product Image */}
      <div className="w-full h-48 bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
        <img 
          src={image} 
          alt={title} 
          className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{description}</p>
        
        {/* Price and Action Button at the bottom */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-800">${price.toFixed(2)}</span>
          
          <button 
            onClick={onAddToCart}
            className="flex items-center gap-2 bg-gray-50 hover:bg-green-500 text-gray-600 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300"
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;