import SingleBlog from '@/components/blogs/singleBlog';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { blogslug } = await params;
  const res = await fetch(
    `https://sdlserver.hyplap.com/api/blog-detail/?slug=${blogslug}`,
    { cache: 'no-store' }
  ).catch(() => null);
  const json = res?.ok ? await res.json() : null;
  const blog = json?.data?.blog || {};
  const title = blog.title || json?.data?.meta_title || 'Blog';
  const description =
    blog.subtitle ||
    json?.data?.meta_description ||
    (blog.description1 ? blog.description1.replace(/<[^>]*>/g, '').slice(0, 160) : '');
  const image = blog.coverImage || json?.data?.blog_meta_image?.original_url;
  return {
    title,
    description: description?.slice?.(0, 160) || description,
    openGraph: {
      title,
      description: description?.slice?.(0, 160) || description,
      images: image ? [image] : [],
    },
  };
}

const BlogDetailPage = async ({ params }) => {
  const { categoryname, blogslug } = await params;
  return <SingleBlog categorySlug={categoryname} blogSlug={blogslug} />;
};

export default BlogDetailPage;
