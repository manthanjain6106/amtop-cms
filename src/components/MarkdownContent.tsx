'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'

const BLOG_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog.amtop.in'

export type MarkdownContentProps = {
  content: string
  /** Resolve relative image URLs with this base (e.g. https://blog.amtop.in). */
  imageBaseUrl?: string
  className?: string
}

/**
 * Renders Markdown as HTML. Use for post body content from Payload.
 * Optionally resolves relative image src to imageBaseUrl.
 */
export function MarkdownContent({
  content,
  imageBaseUrl = BLOG_BASE_URL,
  className,
}: MarkdownContentProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          img: ({ src, alt }) => {
            const srcStr = typeof src === 'string' ? src : ''
            const resolvedSrc =
              srcStr.startsWith('http') ? srcStr : `${imageBaseUrl}${srcStr}`
            return (
              // eslint-disable-next-line @next/next/no-img-element -- Markdown image src is dynamic
              <img
                src={resolvedSrc}
                alt={alt ?? ''}
                className="blog-content-img"
              />
            )
          },
        }}
      >
        {content ?? ''}
      </ReactMarkdown>
    </div>
  )
}
