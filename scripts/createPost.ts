import axios from 'axios'
import type { PayloadApiConfig } from './config.js'
import type { LexicalRoot } from './lexicalContent.js'

const POSTS_ENDPOINT = '/api/posts'

export type CreatePostPayload = {
  title: string
  content?: LexicalRoot
  image?: string
  status: 'draft' | 'published'
}

export type CreatePostOptions = {
  payload: CreatePostPayload
  config: PayloadApiConfig
}

export type CreatePostResult = { id: string; doc: Record<string, unknown> }

/**
 * Create a post via Payload REST API.
 * image must be a media document ID (from uploadMedia).
 */
export async function createPost({
  payload,
  config,
}: CreatePostOptions): Promise<CreatePostResult> {
  const { baseURL, authHeader } = config
  if (!authHeader) {
    throw new Error('PAYLOAD_API_KEY is required for createPost')
  }

  const body: Record<string, unknown> = {
    title: payload.title,
    status: payload.status,
  }
  if (payload.content != null) {
    body.content = payload.content
  }
  if (payload.image != null) {
    body.image = payload.image
  }

  const response = await axios.post<{ doc: { id: string } & Record<string, unknown> }>(
    `${baseURL}${POSTS_ENDPOINT}`,
    body,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    },
  )

  const doc = response.data?.doc
  if (!doc?.id) {
    throw new Error('Invalid post response: missing doc.id')
  }
  return { id: String(doc.id), doc }
}
