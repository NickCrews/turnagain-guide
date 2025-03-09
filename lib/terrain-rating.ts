/**
 * The Canadian Avalanche Center uses the "Avalanche Terrain Exposure Scale (ATES)"
 * to rate terrain, classifying it as
 * "Simple" (least dangerous) "Challenging", and "Complex" (most dangerous),
 * with "Simple" terrain generally having lower angled slopes, more tree cover,
 * and minimal terrain traps, while "Complex" terrain features steep open slopes,
 * multiple avalanche starting zones, and significant terrain traps. 
 */

export type ATES = 'simple' | 'challenging' | 'complex' | 'extreme'

export function atesColor(name: ATES): string {
  // picked the colors from https://avalanche.ca/planning/trip-planner
  if (name === 'simple') {
    return '#3ea031' // green
  } else if (name === 'challenging') {
    return '#4248c2' // blue
  } else if (name === 'complex') {
    return 'black'
  } else if (name === 'extreme') {
    return '#FF0138' // red
  } else {
    throw Error(`unknown ATES value: ${name}`)
  }
}