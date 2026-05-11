
import HeroBanner from './HeroBanner';
import FeaturedSection from './FeaturedSection';
import PopularProducts from './PopularProducts';
import DailyBestSells from './DailyBestSells';
import DealsOfTheDay from './DealsOfTheDay';
import TopProductsLists from './TopProductsLists';


const ProductsPage = () => {

    return (
        <div className="flex flex-col gap-8">
            {/* Hero Banner */}
            <HeroBanner />
            {/* Featured Categories Section */}
            <FeaturedSection />
            <PopularProducts />
            <DailyBestSells />  
            <DealsOfTheDay /> 
            <TopProductsLists/>         
        </div>
    );
};

export default ProductsPage;