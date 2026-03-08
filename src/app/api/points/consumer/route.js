import point from './point.json';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page')) || 1;
  const paginate = parseInt(searchParams.get('paginate')) || 5;

  // Get all transactions
  const allTransactions = point.transactions.data;
  const total = allTransactions.length;

  // Calculate pagination
  const startIndex = (page - 1) * paginate;
  const endIndex = startIndex + paginate;
  const paginatedTransactions = allTransactions.slice(startIndex, endIndex);

  // Build paginated response
  const response = {
    ...point,
    transactions: {
      current_page: page,
      per_page: paginate,
      total: total,
      last_page: Math.ceil(total / paginate),
      data: paginatedTransactions
    }
  };

  return NextResponse.json(response);
}
