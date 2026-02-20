'use client'

import React from 'react'

type CoverImageProps = {
  /** Primary URL (e.g. from coverImage). */
  src: string
  /** Fallback URL (e.g. from legacy image) when primary returns 404. */
  fallbackSrc?: string | null
  alt: string
  className?: string
  /** Wrapper element class (e.g. blog-list-item-cover, blog-post-cover). */
  wrapperClassName?: string
}

/**
 * Renders a cover image and tries the fallback URL on error (e.g. 404).
 * Handles posts that have both coverImage and image (legacy) so one can replace the other if missing.
 */
export function CoverImage({
  src,
  fallbackSrc,
  alt,
  className,
  wrapperClassName,
}: CoverImageProps) {
  const [currentSrc, setCurrentSrc] = React.useState(src)
  const [triedFallback, setTriedFallback] = React.useState(false)

  const handleError = React.useCallback(() => {
    if (fallbackSrc && !triedFallback) {
      setCurrentSrc(fallbackSrc)
      setTriedFallback(true)
    }
  }, [fallbackSrc, triedFallback])

  // Reset if src prop changes (e.g. different post)
  React.useEffect(() => {
    setCurrentSrc(src)
    setTriedFallback(false)
  }, [src])

  return (
    <span className={wrapperClassName}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        onError={handleError}
      />
    </span>
  )
}
