import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: false,
      admin: {
        description: 'URL-friendly identifier (e.g. my-blog-post). Used in blog URLs on the landing page.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Short summary shown in blog listing and SEO.',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      admin: {
        description: 'Post body in Markdown. Rendered on the blog frontend.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Featured/cover image shown on the landing page blog.',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: false,
      hasMany: false,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      required: false,
      hasMany: true,
      admin: {
        description: 'Post categories (e.g. Product, Engineering).',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      required: false,
      hasMany: true,
    },
    {
      name: 'readTime',
      type: 'text',
      required: false,
      admin: {
        description: 'e.g. "5 min read". Shown on the landing page.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: false,
      admin: {
        description: 'When the post was or will be published. Used for sorting on the landing page.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
}
