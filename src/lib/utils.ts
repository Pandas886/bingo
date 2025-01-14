import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string

export function createChunkDecoder() {
  const decoder = new TextDecoder()
  return function (chunk: Uint8Array | undefined): string {
    if (!chunk) return ''
    return decoder.decode(chunk, { stream: true })
  }
}

export function random (start: number, end: number) {
  return start + Math.ceil(Math.random() * (end - start))
}

export function randomIP() {
  return `11.${random(104, 107)}.${random(1, 255)}.${random(1, 255)}`
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export function parseCookie(cookie: string, cookieName: string) {
  const targetCookie = new RegExp(`(?:[; ]|^)${cookieName}=([^;]*)`).test(cookie) ? RegExp.$1 : cookie
  return targetCookie ? decodeURIComponent(targetCookie).trim() : cookie.indexOf('=') === -1 ? cookie.trim() : ''
}

export const DEFAULT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.0.0'
export const DEFAULT_IP = process.env.BING_IP || randomIP()

export function parseUA(ua?: string, default_ua = DEFAULT_UA) {
  return / EDGE?/i.test(decodeURIComponent(ua || '')) ? decodeURIComponent(ua!.trim()) : default_ua
}

export function createHeaders(cookies: Partial<{ [key: string]: string }>) {
  const {
    BING_COOKIE = process.env.BING_COOKIE,
    BING_UA = process.env.BING_UA,
    BING_IP = process.env.BING_IP
  } = cookies

  const ua = parseUA(BING_UA)

  if (!BING_COOKIE) {
    throw new Error('No Cookie')
  }

  const parsedCookie = parseCookie(BING_COOKIE, '_U')
  if (!parsedCookie) {
    throw new Error('Invalid Cookie')
  }
  return {
    'x-forwarded-for': BING_IP || DEFAULT_IP,
    'Accept-Encoding': 'gzip, deflate, br, zsdch',
    'User-Agent': ua!,
    'x-ms-useragent': 'azsdk-js-api-client-factory/1.0.0-beta.1 core-rest-pipeline/1.10.0 OS/Win32',
    cookie: `_U=${parsedCookie}` || '',
  }
}
