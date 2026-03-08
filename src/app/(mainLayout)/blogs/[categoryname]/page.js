import BlogListing from '@/components/blogs/Details';

const BlogListingPage = async ({ params }) => {
  const { categoryname } = await params;
  return <BlogListing categorySlug={categoryname} />;
};

export default BlogListingPage;
