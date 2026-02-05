import { gcsStorage } from '@payloadcms/storage-gcs'
import { getGcsClientOptions, isGcsConfigured } from './gcsCredentials'

const bucket = process.env.GOOGLE_CLOUD_BUCKET
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID

/**
 * Google Cloud Storage plugin for Payload.
 * When GOOGLE_CLOUD_BUCKET (and credentials) are set, Media uploads go to GCS.
 * When unset, plugin is disabled and Media uses local staticDir.
 *
 * Credentials:
 * - Local: GOOGLE_CLOUD_KEY_FILE = path to service account JSON file.
 * - Vercel: GCP_KEYFILE_BASE64 = base64-encoded JSON key (Vercel env convention).
 * - Alternative: GOOGLE_APPLICATION_CREDENTIALS_JSON = full JSON key as string.
 */
/**
 * Do not set `acl` when your GCS bucket uses Uniform bucket-level access.
 * Otherwise uploads fail with: "Cannot update access control for an object
 * when uniform bucket-level access is enabled."
 * Use bucket IAM (e.g. allUsers + Storage Object Viewer) for public read.
 */
export const gcsStoragePlugin = gcsStorage({
  enabled: isGcsConfigured(),
  collections: {
    media: true,
  },
  bucket: bucket || '',
  options: getGcsClientOptions(projectId || undefined),
})
