import { gcsStorage } from '@payloadcms/storage-gcs'

const bucket = process.env.GOOGLE_CLOUD_BUCKET
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
const keyFilename = process.env.GOOGLE_CLOUD_KEY_FILE

/**
 * Google Cloud Storage plugin for Payload.
 * When GOOGLE_CLOUD_BUCKET (and credentials) are set, Media uploads go to GCS.
 * When unset, plugin is disabled and Media uses local staticDir.
 */
export const gcsStoragePlugin = gcsStorage({
  enabled: Boolean(bucket && projectId && keyFilename),
  collections: {
    media: true,
  },
  bucket: bucket || '',
  acl: 'Public',
  options: {
    projectId: projectId || undefined,
    keyFilename: keyFilename || undefined,
  },
})
