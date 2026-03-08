import { fetchBlogs, fetchBlogSearch } from '@/api/blog.api';
import { useQuery } from '@tanstack/react-query';

export const useBlogs = (
  {
    page = 1,
    limit = 10,
    category = '',
    tag = '',
    search = '',
  } = {},
  options = {}
) => {
  const hasSearch = typeof search === 'string' && search.trim().length > 0;

  return useQuery({
    queryKey: ['blogs', page, limit, category, tag, search],
    queryFn: () =>
      hasSearch
        ? fetchBlogSearch({ search: search.trim(), page, limit })
        : fetchBlogs({ page, limit, category, tag }),
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });
};

