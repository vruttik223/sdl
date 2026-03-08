/**
 * API Route: POST /api/orders/return
 * 
 * Handles return order requests with file uploads (images and videos)
 * 
 * Tech Stack: Next.js App Router (13+)
 * Features:
 * - Handle FormData with nested arrays
 * - File validation (type, size)
 * - Save files to storage (filesystem or cloud)
 * - Store return request in database
 */

import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Configuration
const MAX_FILES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'returns');

/**
 * Validate uploaded file
 */
function validateFile(file, type) {
  const fileSize = file.size;
  const fileType = file.type;

  // Check file type
  if (type === 'image' && !ALLOWED_IMAGE_TYPES.includes(fileType)) {
    return { valid: false, error: 'Invalid image type' };
  }
  if (type === 'video' && !ALLOWED_VIDEO_TYPES.includes(fileType)) {
    return { valid: false, error: 'Invalid video type' };
  }

  // Check file size
  if (type === 'image' && fileSize > MAX_IMAGE_SIZE) {
    return { valid: false, error: 'Image size exceeds 5MB' };
  }
  if (type === 'video' && fileSize > MAX_VIDEO_SIZE) {
    return { valid: false, error: 'Video size exceeds 20MB' };
  }

  return { valid: true };
}

/**
 * Save file to storage
 */
async function saveFile(file, orderId, productId, index) {
  try {
    // Create directory if it doesn't exist
    const orderDir = path.join(UPLOAD_DIR, orderId, productId);
    if (!existsSync(orderDir)) {
      await mkdir(orderDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${index}-${timestamp}.${extension}`;
    const filepath = path.join(orderDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return relative path for storing in database
    return `/uploads/returns/${orderId}/${productId}/${filename}`;
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Failed to save file');
  }
}

/**
 * Parse FormData into structured object
 */
async function parseFormData(formData) {
  const orderId = formData.get('orderId');
  const totalRefundAmount = parseFloat(formData.get('totalRefundAmount'));
  
  const products = [];
  const productKeys = new Set();
  
  // Find all unique product indexes
  for (const key of formData.keys()) {
    const match = key.match(/^products\[(\d+)\]/);
    if (match) {
      productKeys.add(parseInt(match[1]));
    }
  }

  // Parse each product
  for (const index of productKeys) {
    const product = {
      id: formData.get(`products[${index}][id]`),
      name: formData.get(`products[${index}][name]`),
      returnQty: parseInt(formData.get(`products[${index}][returnQty]`)),
      price: parseFloat(formData.get(`products[${index}][price]`)),
      reason: formData.get(`products[${index}][reason]`),
      notes: formData.get(`products[${index}][notes]`) || '',
      files: [],
    };

    // Get all files for this product
    const fileKeys = new Set();
    for (const key of formData.keys()) {
      const match = key.match(new RegExp(`^products\\[${index}\\]\\[files\\]\\[(\\d+)\\]$`));
      if (match) {
        fileKeys.add(parseInt(match[1]));
      }
    }

    // Process each file
    for (const fileIndex of fileKeys) {
      const file = formData.get(`products[${index}][files][${fileIndex}]`);
      const type = formData.get(`products[${index}][files][${fileIndex}][type]`);
      
      if (file && file.size > 0) {
        product.files.push({ file, type });
      }
    }

    products.push(product);
  }

  return { orderId, totalRefundAmount, products };
}

/**
 * POST handler
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Parse the form data
    const { orderId, totalRefundAmount, products } = await parseFormData(formData);

    // Validate basic data
    if (!orderId || !products || products.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Validate each product
    const processedProducts = [];
    for (const product of products) {
      // Check minimum file requirement
      if (product.files.length < 2) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Product "${product.name}" requires at least 2 files` 
          },
          { status: 400 }
        );
      }

      // Check maximum file count
      if (product.files.length > MAX_FILES) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Product "${product.name}" exceeds maximum ${MAX_FILES} files` 
          },
          { status: 400 }
        );
      }

      // Validate and save each file
      const savedFiles = [];
      for (let i = 0; i < product.files.length; i++) {
        const { file, type } = product.files[i];
        
        // Validate file
        const validation = validateFile(file, type);
        if (!validation.valid) {
          return NextResponse.json(
            { 
              success: false, 
              message: `File validation failed for "${file.name}": ${validation.error}` 
            },
            { status: 400 }
          );
        }

        // Save file
        const filePath = await saveFile(file, orderId, product.id, i);
        savedFiles.push({
          path: filePath,
          type: type,
          name: file.name,
          size: file.size,
        });
      }

      processedProducts.push({
        ...product,
        files: savedFiles,
      });
    }

    // TODO: Save to database
    // Example:
    // const returnRequest = await db.returnOrders.create({
    //   data: {
    //     orderId,
    //     status: 'REQUESTED',
    //     totalRefundAmount,
    //     products: processedProducts,
    //     createdAt: new Date(),
    //   }
    // });

    // Mock response for now
    const returnRequest = {
      id: `RET-${Date.now().toString(36).toUpperCase()}`,
      orderId,
      status: 'REQUESTED',
      totalRefundAmount,
      products: processedProducts.map(p => ({
        id: p.id,
        name: p.name,
        returnQty: p.returnQty,
        price: p.price,
        reason: p.reason,
        notes: p.notes,
        filesCount: p.files.length,
      })),
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Return request submitted successfully',
      data: returnRequest,
    });

  } catch (error) {
    console.error('Error processing return request:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process return request',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - Retrieve return requests
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // TODO: Fetch from database
    // const returnRequests = await db.returnOrders.findMany({
    //   where: { orderId },
    //   orderBy: { createdAt: 'desc' }
    // });

    // Mock response
    const returnRequests = [];

    return NextResponse.json({
      success: true,
      data: returnRequests,
    });

  } catch (error) {
    console.error('Error fetching return requests:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch return requests',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
