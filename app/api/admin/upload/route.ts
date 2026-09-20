import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminRequest } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  // 1. Verify admin authorization
  if (!verifyAdminRequest(req)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin session required to upload files.' },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });
    }

    // 2. Validate file size (max 5MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum 5MB limit.' },
        { status: 400 }
      );
    }

    // 3. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: `Invalid file type (${file.type}). Allowed: JPG, PNG, WEBP.` },
        { status: 400 }
      );
    }

    // 4. Validate extension
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { success: false, error: `Invalid file extension (${ext}). Allowed: .jpg, .jpeg, .png, .webp.` },
        { status: 400 }
      );
    }

    // Determine target upload directory (local public/assets/uploads)
    const uploadsDir = path.join(process.cwd(), 'public', 'assets', 'uploads');

    if (process.env.VERCEL) {
      // In Vercel serverless environment, local filesystem is read-only
      // Writing to /tmp produces 404s because Next.js does not serve static files from /tmp
      try {
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: 'Serverless deployment detected. Local file upload is unavailable on read-only serverless filesystems. Please configure cloud storage (e.g. Vercel Blob or Cloudinary) or specify an image URL.',
          },
          { status: 501 }
        );
      }
    }

    if (!fs.existsSync(uploadsDir)) {
      try {
        fs.mkdirSync(uploadsDir, { recursive: true });
      } catch (err) {
        return NextResponse.json(
          {
            success: false,
            error: 'Cannot create upload directory. Cloud storage configuration required.',
          },
          { status: 500 }
        );
      }
    }

    // Sanitize filename strictly: alphanumeric, hyphens, and dots only
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
    const safeName = `${Date.now()}_${baseName || 'specimen'}${ext}`;
    const filePath = path.join(uploadsDir, safeName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/assets/uploads/${safeName}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: safeName,
      size: file.size,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
