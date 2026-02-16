#!/usr/bin/env node
/**
 * CLI: Upload an image to Payload media, then create a published post with that image.
 * Usage: npx tsx scripts/publishPostWithImage.ts <imagePath> [--title="..."] [--content="..."] [--alt="..."]
 * Env: PAYLOAD_API_URL (default http://localhost:3000), PAYLOAD_API_KEY (required)
 */
import 'dotenv/config'
import { createPost } from './createPost.js'
import { getPayloadApiConfig } from './config.js'
import { uploadMedia } from './uploadMedia.js'

const DEFAULT_TITLE = 'New post'
const DEFAULT_ALT = 'Post image'

function parseArgs(argv: string[]) {
  const args = argv.slice(2)
  const imagePath = args.find((a) => !a.startsWith('--'))
  const getOpt = (name: string) => {
    const key = `--${name}=`
    const entry = args.find((a) => a.startsWith(key))
    return entry ? entry.slice(key.length) : undefined
  }
  return {
    imagePath: imagePath ?? '',
    title: getOpt('title') ?? DEFAULT_TITLE,
    content: getOpt('content') ?? '',
    alt: getOpt('alt') ?? DEFAULT_ALT,
  }
}

async function main() {
  const { imagePath, title, content, alt } = parseArgs(process.argv)
  if (!imagePath) {
    console.error('Usage: npx tsx scripts/publishPostWithImage.ts <imagePath> [--title="..."] [--content="..."] [--alt="..."]')
    process.exit(1)
  }

  const config = getPayloadApiConfig()
  if (!config.apiKey) {
    console.error('Set PAYLOAD_API_KEY in env or .env')
    process.exit(1)
  }

  const media = await uploadMedia({
    filePath: imagePath,
    alt,
    config,
  })
  console.log('Uploaded media:', media.id)

  const postPayload = {
    title,
    content: content || undefined,
    image: media.id,
    status: 'published' as const,
  }
  const post = await createPost({ payload: postPayload, config })
  console.log('Created post:', post.id)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
