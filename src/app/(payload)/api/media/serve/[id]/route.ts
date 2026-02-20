import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { NextResponse } from 'next/server'

import config from '@payload-config'
import { getPayload } from 'payload'

const MEDIA_SLUG = 'media'

/** Mime type by extension for common images (avoids extra dependency). */
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase().slice(1)
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  }
  return map[ext] ?? 'application/octet-stream'
}

/**
 * GET /api/media/serve/[id]
 * Serves a media file by document ID instead of filename.
 * Use this for cover images to avoid 404s from filename encoding or mismatches.
 */
/** Build absolute URL for redirects (NextResponse.redirect requires absolute URLs). */
function toAbsoluteUrl(url: string, request: Request): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ message: 'Missing id' }, { status: 400 })
  }

  const resolvedConfig = await (typeof (config as Promise<unknown>).then === 'function' ? config : Promise.resolve(config))
  const payload = await getPayload({ config: resolvedConfig })

  const doc = await payload.findByID({
    collection: MEDIA_SLUG,
    id,
    disableErrors: true,
    overrideAccess: true,
  })

  if (!doc) {
    return NextResponse.json({ message: 'Media document not found' }, { status: 404 })
  }

  const filename = (doc as { filename?: string | null }).filename
  if (!filename || typeof filename !== 'string') {
    return NextResponse.json({ message: 'Media has no filename' }, { status: 404 })
  }

  const docUrl = (doc as { url?: string | null }).url
  if (docUrl && (docUrl.startsWith('http://') || docUrl.startsWith('https://'))) {
    return NextResponse.redirect(docUrl, 302)
  }

  // Local file: resolve path and stream
  const collection = payload.config.collections?.find(
    (c) => 'slug' in c && c.slug === MEDIA_SLUG,
  ) as { upload?: { staticDir?: string }; slug?: string } | undefined
  const staticDir = collection?.upload?.staticDir ?? MEDIA_SLUG
  const filePath = path.resolve(process.cwd(), staticDir, filename)

  let stat: fs.Stats
  try {
    stat = fs.statSync(filePath)
  } catch (err) {
    const code = err && typeof err === 'object' && 'code' in err ? (err as NodeJS.ErrnoException).code : ''
    if (code === 'ENOENT') {
      // File not on disk; redirect to doc.url (relative paths must be absolute for redirect)
      if (docUrl) {
        return NextResponse.redirect(toAbsoluteUrl(docUrl, request), 302)
      }
      return NextResponse.json(
        { message: 'File not found on disk', path: staticDir + '/' + filename },
        { status: 404 },
      )
    }
    throw err
  }

  const nodeStream = fs.createReadStream(filePath)
  const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>
  const mimeType = getMimeType(filename)

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      'Content-Type': mimeType,
      'Content-Length': String(stat.size),
    },
  })
}
