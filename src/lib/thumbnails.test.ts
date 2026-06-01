import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { mkdtempSync, rmSync, existsSync, utimesSync, statSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import sharp from 'sharp'
import { generateThumbnail } from '@/lib/thumbnails'
import { THUMBNAIL_SIZE } from '@/figures/thumbnail-path'

let dir: string
let srcPath: string
let outPath: string

beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), 'thumbnails-test-'))
  srcPath = join(dir, 'source.jpg')
  outPath = join(dir, 'nested', 'out.jpg')
  // A non-square source so we can confirm the output gets center-cropped square.
  await sharp({
    create: { width: 300, height: 200, channels: 3, background: { r: 10, g: 120, b: 200 } },
  }).jpeg().toFile(srcPath)
})

afterAll(() => {
  rmSync(dir, { recursive: true, force: true })
})

describe('generateThumbnail', () => {
  it('produces a square thumbnail at the expected dimensions, creating parent dirs', async () => {
    const generated = await generateThumbnail(srcPath, outPath)
    expect(generated).toBe(true)
    expect(existsSync(outPath)).toBe(true)

    const meta = await sharp(outPath).metadata()
    expect(meta.width).toBe(THUMBNAIL_SIZE)
    expect(meta.height).toBe(THUMBNAIL_SIZE)
    expect(meta.format).toBe('jpeg')
  })

  it('skips regeneration when the output is up to date (idempotent)', async () => {
    const generated = await generateThumbnail(srcPath, outPath)
    expect(generated).toBe(false)
  })

  it('regenerates when the source is newer than the output', async () => {
    const future = new Date(statSync(outPath).mtimeMs + 60_000)
    utimesSync(srcPath, future, future)
    const generated = await generateThumbnail(srcPath, outPath)
    expect(generated).toBe(true)
  })

  it('throws when the source image is missing', async () => {
    await expect(generateThumbnail(join(dir, 'missing.jpg'), outPath)).rejects.toThrow(/not found/)
  })
})
