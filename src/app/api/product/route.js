import product from './product.json';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;

  const queryCategory = searchParams.get('category');
  const querySortBy = searchParams.get('sortBy');
  const querySearch = searchParams.get('search');

  // Always clone data to avoid mutation
  let products = [...(product.data || [])];

  /* -------------------- CATEGORY FILTER -------------------- */
  if (queryCategory) {
    const categories = queryCategory.split(',');

    products = products.filter((item) =>
      item.categories?.some((cat) =>
        categories.includes(cat.slug)
      )
    );
  }

  /* -------------------- SEARCH FILTER -------------------- */
  if (querySearch) {
    const search = querySearch.toLowerCase();

    products = products.filter((item) =>
      item.name.toLowerCase().includes(search)
    );
  }

  /* -------------------- SORTING -------------------- */
  switch (querySortBy) {
    case 'asc':
      products.sort((a, b) => a.id - b.id);
      break;

    case 'desc':
      products.sort((a, b) => b.id - a.id);
      break;

    case 'a-z':
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case 'z-a':
      products.sort((a, b) => b.name.localeCompare(a.name));
      break;

    case 'low-high':
      products.sort((a, b) => a.sale_price - b.sale_price);
      break;

    case 'high-low':
      products.sort((a, b) => b.sale_price - a.sale_price);
      break;

    default:
      break;
  }

  return NextResponse.json({ products, total: product.total, current_page: product.current_page, per_page: product.per_page });
}
