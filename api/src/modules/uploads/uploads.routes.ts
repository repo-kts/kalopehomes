import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import { Router, type Request } from 'express';
import multer from 'multer';

import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { asyncHandler } from '../../middleware/async-handler';
import { PERMISSIONS } from '../../lib/permissions';
import { HttpError } from '../../utils/http-error';

/**
 * Filesystem directory where uploaded media is written, and the public URL
 * path it is served from (see `createApp` in `app.ts`). Kept here so the
 * static-file middleware and the upload handler agree on a single location.
 *
 * NOTE: this writes to the local disk. On ephemeral/read-only serverless
 * hosts (e.g. Vercel functions) this does not persist between invocations —
 * a durable object store (S3/R2/Blob) should back `storage` there.
 */
export const UPLOAD_ROUTE = '/uploads';

// Pick a writable location. On Vercel (and most serverless hosts) the project
// filesystem is read-only except for `/tmp`, so default there; anywhere else
// use a repo-local `uploads/` dir. `UPLOAD_DIR` env var overrides both.
export const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : process.env.VERCEL
    ? '/tmp/uploads'
    : path.resolve(process.cwd(), 'uploads');

// Best-effort create at boot so multer never fails on a missing folder. Must
// not throw here: a read-only FS would otherwise crash every invocation.
try {
  if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
  }
} catch {
  // Directory couldn't be created (e.g. read-only FS). Upload requests will
  // surface the real error; the app itself still boots.
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 12;
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new HttpError(400, `Unsupported file type: ${file.mimetype}`));
    }
  },
});

/** Builds the absolute, publicly reachable URL for a stored file. */
function publicUrl(req: Request, filename: string): string {
  const base = process.env.PUBLIC_BASE_URL?.replace(/\/$/, '') ?? `${req.protocol}://${req.get('host')}`;
  return `${base}${UPLOAD_ROUTE}/${filename}`;
}

export const uploadsRouter = Router();

/**
 * POST /uploads — accepts one or more image files under the `files` field and
 * returns their public URLs. Guarded by the same permission used to edit CMS
 * content, since uploads are only ever performed while authoring it.
 */
uploadsRouter.post(
  '/',
  authenticate,
  authorize(PERMISSIONS.CONTENT_WRITE),
  upload.array('files', MAX_FILES),
  asyncHandler(async (req, res) => {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    if (files.length === 0) {
      throw new HttpError(400, 'No files provided (expected multipart field "files")');
    }

    const urls = files.map((file) => publicUrl(req, file.filename));
    res.status(201).json({ data: { urls } });
  }),
);
