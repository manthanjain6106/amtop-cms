/**
 * Build minimal Lexical JSON (Payload richText) from plain text.
 * Reusable for crawler/AI blog automation.
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

export function textToLexicalRoot(plainText: string): LexicalRoot {
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
