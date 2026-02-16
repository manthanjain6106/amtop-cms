/**
 * Payload API automation – reusable for crawlers / AI blog automation.
 * Usage: import { uploadMedia, createPost, getPayloadApiConfig } from './scripts/index.js'
 */
export { getPayloadApiConfig } from './config.js'
export type { PayloadApiConfig } from './config.js'
export { createPost } from './createPost.js'
export type { CreatePostPayload, CreatePostResult } from './createPost.js'
export { uploadMedia } from './uploadMedia.js'
export type { UploadMediaResult } from './uploadMedia.js'
