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

export default tokenStream => {
  // Handle 'none'
  if (tokenStream.matches(NONE)) {
    tokenStream.expectEmpty()
    return {
      transitionProperty: ['none'],
      transitionDuration: ['0s'],
      transitionTimingFunction: ['ease'],
      transitionDelay: ['0s'],
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

    // Apply defaults
    properties.push(property || 'all')
    durations.push(duration || '0s')
    timingFunctions.push(timingFunction || 'ease')
    delays.push(delay || '0s')

    parsingFirst = false
  }

  return {
    transitionProperty: properties,
    transitionDuration: durations,
    transitionTimingFunction: timingFunctions,
    transitionDelay: delays,
  }
}
