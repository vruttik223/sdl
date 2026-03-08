import { NextResponse } from 'next/server';
import data from './search.json';

export async function GET() {
  return NextResponse.json(data);
}
