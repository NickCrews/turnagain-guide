import { describe, expect, it } from 'vitest'
import { getAllFigures, figuresWithCoordinates, getNeighboringFigures } from '@/figures'
import { figureThumbnailPath } from '@/figures/thumbnail-path'

describe('figuresWithCoordinates', () => {
  it('includes only figures that have subject_coordinates', () => {
    const withCoords = figuresWithCoordinates()
    expect(withCoords.length).toBeGreaterThan(0)
    expect(withCoords.every(f => f.subject_coordinates != null)).toBe(true)
  })

  it('omits figures without subject_coordinates', () => {
    const all = getAllFigures()
    const withCoords = figuresWithCoordinates()
    const withoutCoords = all.filter(f => f.subject_coordinates == null)
    // There is at least one such figure today (e.g. the goldpan panorama).
    for (const figure of withoutCoords) {
      expect(withCoords).not.toContain(figure)
    }
  })

  it('preserves registry order', () => {
    const all = getAllFigures()
    const withCoords = figuresWithCoordinates()
    const expectedOrder = all.filter(f => f.subject_coordinates != null).map(f => f.id)
    expect(withCoords.map(f => f.id)).toEqual(expectedOrder)
  })
})

describe('getNeighboringFigures', () => {
  it('returns all other geolocated figures, excluding the input', () => {
    const [first] = figuresWithCoordinates()
    const neighbors = getNeighboringFigures(first.id)
    expect(neighbors).not.toContainEqual(expect.objectContaining({ id: first.id }))
    expect(neighbors.length).toBe(figuresWithCoordinates().length - 1)
  })

  it('excludes figures without coordinates', () => {
    const [first] = figuresWithCoordinates()
    const neighbors = getNeighboringFigures(first.id)
    expect(neighbors.every(f => f.subject_coordinates != null)).toBe(true)
  })

  it('returns a stable order matching the geolocated registry order', () => {
    const [first] = figuresWithCoordinates()
    const expected = figuresWithCoordinates().filter(f => f.id !== first.id).map(f => f.id)
    expect(getNeighboringFigures(first.id).map(f => f.id)).toEqual(expected)
  })
})

describe('figureThumbnailPath', () => {
  it('derives a predictable path from the figure id', () => {
    expect(figureThumbnailPath('blue-diamond')).toBe('/img/thumbnails/blue-diamond.jpg')
  })
})
