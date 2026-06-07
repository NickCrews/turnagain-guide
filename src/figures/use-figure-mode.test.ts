import { describe, expect, it } from 'vitest'
import { figureParamUrl, figurePageUrl, figureIdFromPath, neighborFigureId } from '@/figures/use-figure-mode'

const figs = (...ids: string[]) => ids.map(id => ({ id }))

describe('figurePageUrl', () => {
  it('builds the first-class figure page path', () => {
    expect(figurePageUrl('seattle-ridge-uptrack' as never)).toBe('/img/seattle-ridge-uptrack')
  })
})

describe('figureIdFromPath', () => {
  it('reads the id from an /img path (with or without a trailing slash)', () => {
    expect(figureIdFromPath('/img/seattle-ridge-uptrack')).toBe('seattle-ridge-uptrack')
    expect(figureIdFromPath('/img/blue-diamond/')).toBe('blue-diamond')
  })

  it('round-trips with figurePageUrl', () => {
    expect(figureIdFromPath(figurePageUrl('blue-diamond' as never))).toBe('blue-diamond')
  })

  it('returns null off the figure-page path', () => {
    expect(figureIdFromPath('/routes/tincan-proper')).toBeNull()
    expect(figureIdFromPath('/img')).toBeNull()
  })
})

describe('figureParamUrl', () => {
  it('sets the figure param while preserving other params', () => {
    const url = figureParamUrl(new URLSearchParams('areas=tincan-area'), '/routes', 'blue-diamond')
    expect(url).toBe('/routes?areas=tincan-area&lightbox=blue-diamond')
  })

  it('drops the figure param on close, keeping the rest', () => {
    const url = figureParamUrl(new URLSearchParams('areas=tincan-area&lightbox=blue-diamond'), '/routes', null)
    expect(url).toBe('/routes?areas=tincan-area')
  })

  it('returns a bare path when no params remain', () => {
    const url = figureParamUrl(new URLSearchParams('lightbox=blue-diamond'), '/routes', null)
    expect(url).toBe('/routes')
  })

  it('replaces an existing figure param when arrowing', () => {
    const url = figureParamUrl(new URLSearchParams('lightbox=a'), '/routes', 'b')
    expect(url).toBe('/routes?lightbox=b')
  })
})

describe('neighborFigureId', () => {
  const set = figs('a', 'b', 'c')

  it('advances to the next figure', () => {
    expect(neighborFigureId(set, 'a', 1)).toBe('b')
  })

  it('goes back to the previous figure', () => {
    expect(neighborFigureId(set, 'b', -1)).toBe('a')
  })

  it('wraps forward off the end', () => {
    expect(neighborFigureId(set, 'c', 1)).toBe('a')
  })

  it('wraps backward off the front', () => {
    expect(neighborFigureId(set, 'a', -1)).toBe('c')
  })

  it('starts from the first figure when the current one is not in the set', () => {
    expect(neighborFigureId(set, 'not-in-set', 1)).toBe('a')
    expect(neighborFigureId(set, null, -1)).toBe('a')
  })

  it('returns null for an empty set', () => {
    expect(neighborFigureId(figs(), 'a', 1)).toBeNull()
  })
})
