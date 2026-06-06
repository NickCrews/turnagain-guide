import { describe, expect, it } from 'vitest'
import { framingFor } from '@/figures/framing'

const at = (overrides: Partial<Parameters<typeof framingFor>[0]>) => ({
  subject_coordinates: { lat: 60.75, long: -149.18 },
  subject_elevation: 1000,
  direction: 0,
  ...overrides,
})

describe('framingFor', () => {
  it('returns null for a figure with no subject coordinates', () => {
    expect(framingFor({ subject_coordinates: undefined, subject_elevation: 1000, direction: 90 })).toBeNull()
  })

  it('targets the subject location and elevation', () => {
    const framing = framingFor(at({}))!
    expect(framing.target).toEqual({ longitude: -149.18, latitude: 60.75, height: 1000 })
  })

  it('places the camera above the subject', () => {
    const framing = framingFor(at({}))!
    expect(framing.cameraOffsetEnu.up).toBeGreaterThan(0)
  })

  it('looks down at the subject (negative Cesium pitch)', () => {
    const framing = framingFor(at({}))!
    expect(framing.pitchRadians).toBeLessThan(0)
  })

  it('frames a north-facing photo from the south', () => {
    // direction 0 = looking north, so the camera stands to the south of the subject.
    const framing = framingFor(at({ direction: 0 }))!
    expect(framing.cameraOffsetEnu.north).toBeLessThan(0)
    expect(framing.cameraOffsetEnu.east).toBeCloseTo(0, 6)
    expect(framing.headingRadians).toBeCloseTo(0, 6)
  })

  it('frames an east-facing photo from the west', () => {
    // direction 90 = looking east, so the camera stands to the west of the subject.
    const framing = framingFor(at({ direction: 90 }))!
    expect(framing.cameraOffsetEnu.east).toBeLessThan(0)
    expect(framing.cameraOffsetEnu.north).toBeCloseTo(0, 6)
    expect(framing.headingRadians).toBeCloseTo(Math.PI / 2, 6)
  })

  it('frames a south-facing photo from the north', () => {
    const framing = framingFor(at({ direction: 180 }))!
    expect(framing.cameraOffsetEnu.north).toBeGreaterThan(0)
    expect(framing.cameraOffsetEnu.east).toBeCloseTo(0, 6)
  })

  it('defaults a missing heading to north', () => {
    const framing = framingFor(at({ direction: undefined }))!
    expect(framing.headingRadians).toBe(0)
    expect(framing.cameraOffsetEnu.north).toBeLessThan(0)
  })

  it('uses a sea-level target when subject elevation is missing', () => {
    const framing = framingFor(at({ subject_elevation: undefined }))!
    expect(framing.target.height).toBe(0)
    // The placement geometry is otherwise unaffected.
    expect(framing.cameraOffsetEnu.up).toBeGreaterThan(0)
  })

  it('keeps the camera at the framing range from the subject', () => {
    const framing = framingFor(at({ direction: 35 }))!
    const { east, north, up } = framing.cameraOffsetEnu
    const distance = Math.sqrt(east * east + north * north + up * up)
    expect(distance).toBeCloseTo(framing.rangeMeters, 3)
  })
})
