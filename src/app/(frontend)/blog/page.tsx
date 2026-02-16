import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import '../styles.css'

export const metadata = {
  title: 'Blog',
  description: 'Blog posts',
}

export default async function BlogPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
  })

  return (
    <div className="blog-layout">
      <header className="blog-header">
        <h1>Blog</h1>
        <Link href="/">Home</Link>
      </header>
      <ul className="blog-list">
        {docs.map((post) => (
          <li key={post.id} className="blog-list-item">
            <Link href={`/blog/${post.slug ?? post.id}`}>
              <h2>{post.title}</h2>
              {post.excerpt && <p className="blog-excerpt">{post.excerpt}</p>}
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString()}
                </time>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {docs.length === 0 && <p className="blog-empty">No posts yet.</p>}
    </div>
  )
}
