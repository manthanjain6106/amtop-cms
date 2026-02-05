/**
 * Builds options for @google-cloud/storage compatible with both local (key file)
 * and serverless (e.g. Vercel) where credentials are provided via env var.
 *
 * - Local: GOOGLE_CLOUD_KEY_FILE = path to JSON key file.
 * - Vercel: GCP_KEYFILE_BASE64 = base64-encoded JSON key (Vercel convention).
 * - Alternative: GOOGLE_APPLICATION_CREDENTIALS_JSON = full JSON key as string.
 */

export type GcsClientOptions = {
  projectId?: string
  keyFilename?: string
  credentials?: {
    client_email: string
    private_key: string
    [key: string]: unknown
  }
}

const CREDENTIALS_JSON_ENV = 'GOOGLE_APPLICATION_CREDENTIALS_JSON'
const GCP_KEYFILE_BASE64_ENV = 'GCP_KEYFILE_BASE64'

function parseJsonCredentials(json: string): GcsClientOptions['credentials'] | undefined {
  try {
    const parsed = JSON.parse(json) as Record<string, unknown>
    if (
      typeof parsed.client_email === 'string' &&
      typeof parsed.private_key === 'string'
    ) {
      return parsed as GcsClientOptions['credentials']
    }
  } catch {
    // invalid JSON or shape
  }
  return undefined
}

function getCredentialsFromEnv(): GcsClientOptions['credentials'] | undefined {
  // Vercel: base64-encoded key file (decode → JSON string → parse)
  const base64 = process.env[GCP_KEYFILE_BASE64_ENV]
  if (base64 && typeof base64 === 'string') {
    try {
      const json = Buffer.from(base64, 'base64').toString('utf8')
      const creds = parseJsonCredentials(json)
      if (creds) return creds
    } catch {
      // invalid base64 or JSON
    }
  }

  // Alternative: raw JSON string
  const raw = process.env[CREDENTIALS_JSON_ENV]
  if (raw && typeof raw === 'string') {
    return parseJsonCredentials(raw)
  }

  return undefined
}

/**
 * Returns options suitable for `new Storage(options)`.
 * Prefers credentials from env (GCP_KEYFILE_BASE64 or GOOGLE_APPLICATION_CREDENTIALS_JSON); falls back to keyFilename (local).
 */
export function getGcsClientOptions(projectId?: string): GcsClientOptions {
  const credentials = getCredentialsFromEnv()
  const keyFilename = process.env.GOOGLE_CLOUD_KEY_FILE

  const options: GcsClientOptions = {
    projectId: projectId || undefined,
  }

  if (credentials) {
    options.credentials = credentials
  } else if (keyFilename) {
    options.keyFilename = keyFilename
  }

  return options
}

/**
 * True when GCS can be used (bucket, project, and either env credentials or key file).
 */
export function isGcsConfigured(): boolean {
  const bucket = process.env.GOOGLE_CLOUD_BUCKET
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID
  if (!bucket || !projectId) return false
  const credentials = getCredentialsFromEnv()
  const keyFilename = process.env.GOOGLE_CLOUD_KEY_FILE
  return Boolean(credentials || keyFilename)
}
