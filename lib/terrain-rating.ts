/**
 * https://avalanche.org/avalanche-encyclopedia/terrain/avalanche-terrain-exposure/avalanche-terrain-exposure-scale-ates/
 */

export type ATES = 'non-avalanche' | 'simple' | 'challenging' | 'complex' | 'extreme'

export const ATES_VALUES: ATES[] = [
  'non-avalanche',
  'simple',
  'challenging',
  'complex',
  'extreme',
]

export function atesColor(name: ATES): string {
  // picked the colors from https://avalanche.ca/planning/trip-planner
  if (name === 'non-avalanche') {
    return 'white' // TODO: maybe there is a better option
  } else if (name === 'simple') {
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

export function atesTextColor(name: ATES): string {
  if (name === 'non-avalanche') {
    return 'black'
  } else if (name === 'simple') {
    return 'white'
  } else if (name === 'challenging') {
    return 'white'
  } else if (name === 'complex') {
    return 'white'
  } else if (name === 'extreme') {
    return 'white'
  } else {
    throw Error(`unknown ATES value: ${name}`)
  }
}

export function maxAtes(ratings: ATES[]): ATES {
  if (ratings.length === 0) {
    throw Error('no ratings provided')
  }
  return ratings.reduce((a, b) => {
    if (ATES_VALUES.indexOf(a) > ATES_VALUES.indexOf(b)) {
      return a
    } else {
      return b
    }
  })
}