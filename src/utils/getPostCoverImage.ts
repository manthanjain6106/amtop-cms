import type { Post } from '@/payload-types'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ''

function resolveUrl(url: string | null | undefined): string | null {
  if (!url) return null
  return url.startsWith('http') ? url : `${BASE_URL}${url}`
}

/**
 * Prefer media.url when it's already absolute (e.g. GCS or CDN), so we don't hit the serve route.
 * Otherwise use serve-by-ID URL when we have a populated media doc (avoids filename 404s).
 */
function getMediaUrl(media: unknown): string | null {
  if (!media || typeof media !== 'object') return null
  const m = media as { id?: string; url?: string | null }
  const url = m.url ?? null
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    return url
  }
  if (m.id) {
    return `${BASE_URL}/api/media/serve/${m.id}`
  }
  return resolveUrl(url)
}

/**
 * Returns the primary URL for the post's cover image (coverImage preferred, then image).
 * Returns null if no image or relation not populated.
 */
export function getPostCoverImageUrl(post: Post): string | null {
  const media = post.coverImage ?? post.image ?? null
  if (!media) return null
  return getMediaUrl(media)
}

/**
 * Returns [primaryUrl, fallbackUrl] for the two cover image types (coverImage and image).
 * Use when you want to try the second if the first returns 404.
 * - primary: coverImage if set, else image
 * - fallback: the other one (only if different from primary)
 */
export function getPostCoverImageUrls(post: Post): { primary: string | null; fallback: string | null } {
  const primaryMedia = post.coverImage ?? post.image ?? null
  const fallbackMedia = post.coverImage && post.image ? post.image : null
  const primary = primaryMedia ? getMediaUrl(primaryMedia) : null
  const fallback = fallbackMedia ? getMediaUrl(fallbackMedia) : null
  return { primary, fallback: fallback && fallback !== primary ? fallback : null }
}

/**
 * Returns the alt text for the post's cover image, or a fallback.
 */
export function getPostCoverImageAlt(post: Post): string {
  const media = (post.coverImage ?? post.image) ?? null
  if (!media || typeof media !== 'object') return post.title
  const alt = 'alt' in media && typeof media.alt === 'string' ? media.alt : post.title
  return alt
}
