import camelizeStyleName from 'camelize'
import { SPACE, COMMA, IDENT, TIME, NONE } from '../tokenTypes'

// Timing function keywords
const timingFunctionKeywords = [
  'ease',
  'linear',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'step-start',
  'step-end',
]

const isTimingFunction = value => {
  if (timingFunctionKeywords.includes(value.toLowerCase())) {
    return true
  }
  // cubic-bezier and steps are handled as functions
  return false
}

const isTime = value => /^[+-]?(?:\d*\.)?\d+(?:ms|s)$/i.test(value)

// Helper to parse comma-separated values
// Returns single value if only one, array if multiple
const parseCommaSeparatedValues = (tokenStream, parseValue) => {
  const values = []
  let parsingFirst = true

  while (tokenStream.hasTokens()) {
    if (!parsingFirst) {
      tokenStream.expect(COMMA)
    }

    // Skip leading/trailing spaces
    if (tokenStream.matches(SPACE)) {
      // continue
    }

    const value = parseValue(tokenStream)
    values.push(value)

    // Skip trailing spaces
    if (tokenStream.matches(SPACE)) {
      // continue
    }

    parsingFirst = false
  }

  return values.length === 1 ? values[0] : values
}

// Transform for transition-property
export const transitionProperty = tokenStream => {
  const properties = parseCommaSeparatedValues(tokenStream, ts => {
    const prop = ts.expect(IDENT, NONE)
    // Don't camelize special values like 'all' and 'none'
    return prop === 'all' || prop === 'none' ? prop : camelizeStyleName(prop)
  })
  return { transitionProperty: properties }
}

// Transform for transition-duration
export const transitionDuration = tokenStream => {
  const durations = parseCommaSeparatedValues(tokenStream, ts =>
    ts.expect(TIME)
  )
  return { transitionDuration: durations }
}

// Transform for transition-timing-function
export const transitionTimingFunction = tokenStream => {
  const timingFunctions = parseCommaSeparatedValues(tokenStream, ts => {
    // Check for function (cubic-bezier or steps)
    const funcStream = ts.matchesFunction()
    if (funcStream) {
      const funcName = funcStream.functionName
      const args = []
      while (funcStream.hasTokens()) {
        if (funcStream.matches(SPACE) || funcStream.matches(COMMA)) {
          continue
        }
        const val = funcStream.expect(IDENT, TIME, node => {
          if (node.type === 'word') return node.value
          return null
        })
        args.push(val)
      }
      return `${funcName}(${args.join(', ')})`
    }
    return ts.expect(IDENT)
  })
  return { transitionTimingFunction: timingFunctions }
}

// Transform for transition-delay
export const transitionDelay = tokenStream => {
  const delays = parseCommaSeparatedValues(tokenStream, ts => ts.expect(TIME))
  return { transitionDelay: delays }
}

export default tokenStream => {
  // Handle 'none'
  if (tokenStream.matches(NONE)) {
    tokenStream.expectEmpty()
    return {
      transitionProperty: 'none',
      transitionDuration: '0s',
      transitionTimingFunction: 'ease',
      transitionDelay: '0s',
    }
  }

  const properties = []
  const durations = []
  const timingFunctions = []
  const delays = []

  let parsingFirst = true

  while (tokenStream.hasTokens()) {
    if (!parsingFirst) {
      tokenStream.expect(COMMA)
    }

    // Parse single transition: property duration timing-function delay
    // Order can vary, but typically: property duration [timing-function] [delay]
    let property = null
    let duration = null
    let timingFunction = null
    let delay = null

    // Skip leading space
    if (tokenStream.matches(SPACE)) {
      // continue
    }

    // Parse tokens for this transition
    while (tokenStream.hasTokens()) {
      // Check for comma (next transition)
      tokenStream.saveRewindPoint()
      if (tokenStream.matches(SPACE)) {
        if (tokenStream.matches(COMMA)) {
          tokenStream.rewind()
          break
        }
      }
      if (tokenStream.matches(COMMA)) {
        tokenStream.rewind()
        break
      }
      tokenStream.rewind()

      // Try to match different token types
      if (tokenStream.matches(SPACE)) {
        continue
      }

      // Check for timing function (cubic-bezier or steps)
      const funcStream = tokenStream.matchesFunction()
      if (funcStream) {
        // It's a function like cubic-bezier() or steps()
        const funcName = funcStream.functionName
        const args = []
        while (funcStream.hasTokens()) {
          if (funcStream.matches(SPACE) || funcStream.matches(COMMA)) {
            continue
          }
          const val = funcStream.expect(IDENT, TIME, node => {
            if (node.type === 'word') return node.value
            return null
          })
          args.push(val)
        }
        timingFunction = `${funcName}(${args.join(', ')})`
        continue
      }

      // Match word or time
      if (tokenStream.matches(IDENT)) {
        const value = tokenStream.lastValue
        if (isTimingFunction(value)) {
          timingFunction = value
        } else {
          property = value
        }
        continue
      }

      if (tokenStream.matches(TIME)) {
        const value = tokenStream.lastValue
        if (duration === null) {
          duration = value
        } else {
          delay = value
        }
        continue
      }

      // Try to match as word for property names like 'all', 'opacity', etc.
      const wordMatch = tokenStream.expect(node => {
        if (node.type === 'word') return node.value
        return null
      })
      if (isTime(wordMatch)) {
        if (duration === null) {
          duration = wordMatch
        } else {
          delay = wordMatch
        }
      } else if (isTimingFunction(wordMatch)) {
        timingFunction = wordMatch
      } else {
        property = wordMatch
      }
    }

    // Apply defaults and camelize property name
    const propName = property || 'all'
    properties.push(propName === 'all' ? 'all' : camelizeStyleName(propName))
    durations.push(duration || '0s')
    timingFunctions.push(timingFunction || 'ease')
    delays.push(delay || '0s')

    parsingFirst = false
  }

  // Return single values if only one transition, arrays if multiple
  const isSingle = properties.length === 1
  return {
    transitionProperty: isSingle ? properties[0] : properties,
    transitionDuration: isSingle ? durations[0] : durations,
    transitionTimingFunction: isSingle ? timingFunctions[0] : timingFunctions,
    transitionDelay: isSingle ? delays[0] : delays,
  }
}
