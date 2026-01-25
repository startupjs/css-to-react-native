import {
  LENGTH,
  UNSUPPORTED_LENGTH_UNIT,
  PERCENT,
  COLOR,
  SPACE,
  NONE,
  VARIABLE,
} from '../tokenTypes'

export const directionFactory = ({
  types = [LENGTH, UNSUPPORTED_LENGTH_UNIT, PERCENT, VARIABLE],
  directions = ['Top', 'Right', 'Bottom', 'Left'],
  prefix = '',
  suffix = '',
}) => tokenStream => {
  const values = []

  // borderWidth doesn't currently allow a percent value, but may do in the future
  values.push(tokenStream.expect(...types))

  while (values.length < 4 && tokenStream.hasTokens()) {
    tokenStream.expect(SPACE)
    values.push(tokenStream.expect(...types))
  }

  tokenStream.expectEmpty()

  const [top, right = top, bottom = top, left = right] = values

  const keyFor = n => `${prefix}${directions[n]}${suffix}`

  return {
    [keyFor(0)]: top,
    [keyFor(1)]: right,
    [keyFor(2)]: bottom,
    [keyFor(3)]: left,
  }
}

export const parseShadowOffset = tokenStream => {
  const width = tokenStream.expect(LENGTH)
  const height = tokenStream.matches(SPACE) ? tokenStream.expect(LENGTH) : width
  tokenStream.expectEmpty()
  return { width, height }
}

export const parseShadow = tokenStream => {
  let offsetX
  let offsetY
  let radius
  let color

  if (tokenStream.matches(NONE)) {
    tokenStream.expectEmpty()
    return {
      offset: { width: 0, height: 0 },
      radius: 0,
      color: 'black',
    }
  }

  let didParseFirst = false
  while (tokenStream.hasTokens()) {
    if (didParseFirst) tokenStream.expect(SPACE)

    if (
      offsetX === undefined &&
      tokenStream.matches(LENGTH, UNSUPPORTED_LENGTH_UNIT)
    ) {
      // First offset must be a concrete LENGTH to distinguish from color
      offsetX = tokenStream.lastValue
      tokenStream.expect(SPACE)
      // Second offset and radius can be VARIABLE
      offsetY = tokenStream.expect(LENGTH, UNSUPPORTED_LENGTH_UNIT, VARIABLE)

      // Try to match optional blur-radius (concrete LENGTH only here)
      tokenStream.saveRewindPoint()
      if (
        tokenStream.matches(SPACE) &&
        tokenStream.matches(LENGTH, UNSUPPORTED_LENGTH_UNIT)
      ) {
        radius = tokenStream.lastValue
      } else {
        tokenStream.rewind()
      }
    } else if (
      offsetX !== undefined &&
      radius === undefined &&
      color === undefined &&
      tokenStream.matches(VARIABLE)
    ) {
      // VARIABLE after offsets - could be radius or color
      // Peek ahead to determine which
      const potentialValue = tokenStream.lastValue
      tokenStream.saveRewindPoint()
      if (tokenStream.matches(SPACE) && tokenStream.hasTokens()) {
        // There's more content - this VARIABLE is the radius
        tokenStream.rewind()
        radius = potentialValue
      } else {
        // No more content - this VARIABLE is the color
        tokenStream.rewind()
        color = potentialValue
      }
    } else if (
      color === undefined &&
      (tokenStream.matches(COLOR) || tokenStream.matches(VARIABLE))
    ) {
      color = tokenStream.lastValue
    } else {
      tokenStream.throw()
    }

    didParseFirst = true
  }

  if (offsetX === undefined) tokenStream.throw()

  return {
    offset: { width: offsetX, height: offsetY },
    radius: radius !== undefined ? radius : 0,
    color: color !== undefined ? color : 'black',
  }
}
