import Link from 'next/link'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import config from '@/payload.config'
import { CoverImage } from '@/components/CoverImage'
import { MarkdownContent } from '@/components/MarkdownContent'
import { getPostCoverImageAlt, getPostCoverImageUrls } from '@/utils/getPostCoverImage'
import '../../styles.css'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [{ status: { equals: 'published' } }, { slug: { equals: slug } }],
    },
    limit: 1,
    depth: 1,
  })
  const post = docs[0]
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [{ status: { equals: 'published' } }, { slug: { equals: slug } }],
    },
    limit: 1,
    depth: 1,
  })

  const post = docs[0]
  if (!post) notFound()

  const content = post.content ?? ''
  const { primary: coverUrl, fallback: fallbackUrl } = getPostCoverImageUrls(post)
  const coverAlt = getPostCoverImageAlt(post)

  return (
    <article className="blog-post">
      <header className="blog-post-header">
        <Link href="/blog" className="blog-back">
          ← Blog
        </Link>
        <h1>{post.title}</h1>
        {post.publishedAt && (
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        )}
        {coverUrl && (
          <CoverImage
            src={coverUrl}
            fallbackSrc={fallbackUrl}
            alt={coverAlt}
            wrapperClassName="blog-post-cover"
          />
        )}
      </header>
      <div className="blog-post-body prose">
        <MarkdownContent content={content} />
      </div>
    </article>
  )
}
