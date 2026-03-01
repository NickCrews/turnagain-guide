import { describe, it, expect, vi } from 'vitest';
import { getImageAltText, getId, type GuideImage } from '@/lib/image';

// Mock the downstream dependency on @/routes so we don't load all route files.
vi.mock('@/routes', () => ({ allGeoItems: [] }));
// Mock geo-item since it also transitively imports @/routes.
vi.mock('@/lib/geo-item', () => ({
  addChildrenField: vi.fn((items: unknown[]) => items),
  loadGeoItems: vi.fn(async () => []),
}));

describe('getImageAltText', () => {
  it('returns altText when provided', () => {
    const img: GuideImage = {
      imagePath: '/img/foo.jpg',
      altText: 'A snowy peak',
      title: 'Snowy Peak',
      description: 'Description here',
    };
    expect(getImageAltText(img)).toBe('A snowy peak');
  });

  it('falls back to title when altText is absent', () => {
    const img: GuideImage = {
      imagePath: '/img/foo.jpg',
      title: 'Snowy Peak',
      description: 'Description here',
    };
    expect(getImageAltText(img)).toBe('Snowy Peak');
  });

  it('falls back to string description when altText and title are absent', () => {
    const img: GuideImage = {
      imagePath: '/img/foo.jpg',
      description: 'A nice description',
    };
    expect(getImageAltText(img)).toBe('A nice description');
  });

  it('returns undefined when all alt-text sources are absent', () => {
    const img: GuideImage = {
      imagePath: '/img/foo.jpg',
    };
    expect(getImageAltText(img)).toBeUndefined();
  });

  it('returns undefined when description is a ReactElement (not a string)', () => {
    const img: GuideImage = {
      imagePath: '/img/foo.jpg',
      description: { type: 'div', props: {}, key: null } as any,
    };
    expect(getImageAltText(img)).toBeUndefined();
  });

  it('prefers altText over title and description', () => {
    const img: GuideImage = {
      imagePath: '/img/foo.jpg',
      altText: 'alt',
      title: 'title',
      description: 'desc',
    };
    expect(getImageAltText(img)).toBe('alt');
  });

  it('prefers title over description', () => {
    const img: GuideImage = {
      imagePath: '/img/foo.jpg',
      title: 'title',
      description: 'desc',
    };
    expect(getImageAltText(img)).toBe('title');
  });

  it('handles an empty altText string as falsy (falls back)', () => {
    const img: GuideImage = {
      imagePath: '/img/foo.jpg',
      altText: '',
      title: 'The Title',
    };
    // Empty string is falsy, so should fall back to title
    expect(getImageAltText(img)).toBe('The Title');
  });
});

describe('getId', () => {
  it('returns the explicit id when provided', () => {
    const img: GuideImage = {
      imagePath: '/img/foo.jpg',
      id: 'my-custom-id',
    };
    expect(getId(img)).toBe('my-custom-id');
  });

  it('extracts the filename stem from the image path', () => {
    const img: GuideImage = { imagePath: '/img/sunburst-peak.jpg' };
    expect(getId(img)).toBe('sunburst-peak');
  });

  it('handles image paths with multiple dots (uses first dot split)', () => {
    const img: GuideImage = { imagePath: '/img/foo.bar.jpg' };
    // split('.')[0] returns the part before the first dot
    expect(getId(img)).toBe('foo');
  });

  it('handles deeply nested paths', () => {
    const img: GuideImage = { imagePath: '/a/b/c/photo.png' };
    expect(getId(img)).toBe('photo');
  });

  it('handles a bare filename with no directory', () => {
    const img: GuideImage = { imagePath: 'image.webp' };
    expect(getId(img)).toBe('image');
  });

  it('prefers id over the path-derived value', () => {
    const img: GuideImage = { imagePath: '/img/ignored.jpg', id: 'chosen' };
    expect(getId(img)).toBe('chosen');
  });

  it('handles a path ending with a slash (empty filename)', () => {
    // Somewhat edge case — splitting '' on '.' gives ['']
    const img: GuideImage = { imagePath: '/img/' };
    expect(getId(img)).toBe('');
  });
});
