import ActiveTheme from '@/components/activeTheme';
import { BestSellerProducts, HeroCarousel, Reviews, ShopByDepartment, ShopByIngredients, CTABanner, ShopByHealthConcerns, UGCContent, HomeBlogs } from '@/components/home';

export default function Home({ params }) {
  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Shop by Health Concerns */}
      <ShopByHealthConcerns />

      {/* Best seller Products */}
      <BestSellerProducts />

      {/* Shop by department */}
      <ShopByDepartment />

      {/* Shop by ingredients */}
      <ShopByIngredients />

      {/* CTA Banner */}
      <CTABanner />

      {/* Reviews */}
      <Reviews />

      {/* Videos / UGC Content */}
      <UGCContent />

      {/* Blogs */}
      <HomeBlogs />
      {/* <ActiveTheme /> */}
    </>
  );
}
