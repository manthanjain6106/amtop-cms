import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import type { PayloadApiConfig } from './config.js'

const MEDIA_ENDPOINT = '/api/media'

export type UploadMediaOptions = {
  filePath: string
  alt: string
  config: PayloadApiConfig
}

export type UploadMediaResult = { id: string; doc: Record<string, unknown> }

/**
 * Upload an image to Payload media collection.
 * Returns the created document (includes id) for use in posts.
 */
export async function uploadMedia({
  filePath,
  alt,
  config,
}: UploadMediaOptions): Promise<UploadMediaResult> {
  const { baseURL, authHeader } = config
  if (!authHeader) {
    throw new Error('PAYLOAD_API_KEY is required for uploadMedia')
  }
  const form = new FormData()
  form.append('file', fs.createReadStream(filePath))
  form.append('alt', alt)

  const response = await axios.post<{ doc: { id: string } & Record<string, unknown> }>(
    `${baseURL}${MEDIA_ENDPOINT}`,
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization: authHeader,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    },
  )

  const doc = response.data?.doc
  if (!doc?.id) {
    throw new Error('Invalid media response: missing doc.id')
  }
  return { id: String(doc.id), doc }
}
