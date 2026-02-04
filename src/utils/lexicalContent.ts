/**
 * Build minimal Lexical JSON (Payload richText) from plain text or markdown string.
 * Used to normalize content when the CMS receives a string instead of a Lexical object.
 */

export type LexicalRoot = {
  root: {
    children: Array<{
      type: string
      version: number
      children?: Array<{ type: string; version: number; text: string; [k: string]: unknown }>
      [k: string]: unknown
    }>
    type: 'root'
    version: number
    direction: string
    format: string
    indent: number
  }
}

/**
 * Converts a string (plain text or markdown) into a valid Lexical root object.
 * Lexical editor requires an object; passing a string causes "value is not an object" error.
 * This wraps the entire string in a single paragraph so the editor can load without crashing.
 */
export function stringToLexicalRoot(plainText: string): LexicalRoot {
  const text = plainText ?? ''
  return {
    root: {
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [{ type: 'text', version: 1, text }],
          direction: 'ltr',
          format: '',
          indent: 0,
        },
      ],
      type: 'root',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
    },
  }
}

/**
 * Returns true if the value looks like a Lexical root object (has root.children).
 */
export function isLexicalRoot(value: unknown): value is LexicalRoot {
  return (
    value !== null &&
    typeof value === 'object' &&
    'root' in value &&
    typeof (value as LexicalRoot).root === 'object' &&
    Array.isArray((value as LexicalRoot).root?.children)
  )
}
