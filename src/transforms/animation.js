import { SPACE, COMMA, IDENT, TIME, NUMBER, NONE, VARIABLE } from '../tokenTypes'

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

// Direction keywords
const directionKeywords = [
  'normal',
  'reverse',
  'alternate',
  'alternate-reverse',
]

// Fill mode keywords
const fillModeKeywords = ['none', 'forwards', 'backwards', 'both']

// Play state keywords
const playStateKeywords = ['running', 'paused']

const isTimingFunction = value =>
  timingFunctionKeywords.includes(value.toLowerCase())
const isDirection = value => directionKeywords.includes(value.toLowerCase())
const isFillMode = value => fillModeKeywords.includes(value.toLowerCase())
const isPlayState = value => playStateKeywords.includes(value.toLowerCase())
const isTime = value => /^[+-]?(?:\d*\.)?\d+(?:ms|s)$/i.test(value)
const isIterationCount = value =>
  value.toLowerCase() === 'infinite' || /^[+-]?(?:\d*\.)?\d+$/.test(value)

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

// Transform for animation-name property
export const animationName = tokenStream => {
  const names = parseCommaSeparatedValues(tokenStream, ts =>
    ts.expect(IDENT, NONE, VARIABLE)
  )
  return { animationName: names }
}

// Transform for animation-duration property
export const animationDuration = tokenStream => {
  const durations = parseCommaSeparatedValues(tokenStream, ts =>
    ts.expect(TIME, VARIABLE)
  )
  return { animationDuration: durations }
}

// Transform for animation-timing-function property
export const animationTimingFunction = tokenStream => {
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
        const val = funcStream.expect(IDENT, TIME, NUMBER, node => {
          if (node.type === 'word') return node.value
          return null
        })
        args.push(val)
      }
      return `${funcName}(${args.join(', ')})`
    }
    return ts.expect(IDENT)
  })
  return { animationTimingFunction: timingFunctions }
}

// Transform for animation-delay property
export const animationDelay = tokenStream => {
  const delays = parseCommaSeparatedValues(tokenStream, ts =>
    ts.expect(TIME, VARIABLE)
  )
  return { animationDelay: delays }
}

// Transform for animation-iteration-count property
export const animationIterationCount = tokenStream => {
  const counts = parseCommaSeparatedValues(tokenStream, ts => {
    if (ts.matches(IDENT)) {
      const value = ts.lastValue
      return value.toLowerCase() === 'infinite' ? 'infinite' : Number(value)
    }
    if (ts.matches(NUMBER)) {
      return ts.lastValue
    }
    const word = ts.expect(node => {
      if (node.type === 'word') return node.value
      return null
    })
    return word.toLowerCase() === 'infinite' ? 'infinite' : Number(word)
  })
  return { animationIterationCount: counts }
}

// Transform for animation-direction property
export const animationDirection = tokenStream => {
  const directions = parseCommaSeparatedValues(tokenStream, ts =>
    ts.expect(IDENT)
  )
  return { animationDirection: directions }
}

// Transform for animation-fill-mode property
export const animationFillMode = tokenStream => {
  const fillModes = parseCommaSeparatedValues(tokenStream, ts =>
    ts.expect(IDENT)
  )
  return { animationFillMode: fillModes }
}

// Transform for animation-play-state property
export const animationPlayState = tokenStream => {
  const playStates = parseCommaSeparatedValues(tokenStream, ts =>
    ts.expect(IDENT)
  )
  return { animationPlayState: playStates }
}

export default tokenStream => {
  // Handle 'none'
  if (tokenStream.matches(NONE)) {
    tokenStream.expectEmpty()
    return {
      animationName: 'none',
      animationDuration: '0s',
      animationTimingFunction: 'ease',
      animationDelay: '0s',
      animationIterationCount: 1,
      animationDirection: 'normal',
      animationFillMode: 'none',
      animationPlayState: 'running',
    }
  }

  const names = []
  const durations = []
  const timingFunctions = []
  const delays = []
  const iterationCounts = []
  const directions = []
  const fillModes = []
  const playStates = []

  let parsingFirst = true

  while (tokenStream.hasTokens()) {
    if (!parsingFirst) {
      tokenStream.expect(COMMA)
    }

    // Parse single animation
    let name = null
    let duration = null
    let timingFunction = null
    let delay = null
    let iterationCount = null
    let direction = null
    let fillMode = null
    let playState = null

    // Skip leading space
    if (tokenStream.matches(SPACE)) {
      // continue
    }

    // Parse tokens for this animation
    while (tokenStream.hasTokens()) {
      // Check for comma (next animation)
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

      // Skip spaces
      if (tokenStream.matches(SPACE)) {
        continue
      }

      // Match time or variable (for duration/delay) - check before functions
      if (tokenStream.matches(TIME) || tokenStream.matches(VARIABLE)) {
        const value = tokenStream.lastValue
        if (duration === null) {
          duration = value
        } else {
          delay = value
        }
        continue
      }

      // Check for timing function (cubic-bezier or steps)
      const funcStream = tokenStream.matchesFunction()
      if (funcStream) {
        const funcName = funcStream.functionName
        const args = []
        while (funcStream.hasTokens()) {
          if (funcStream.matches(SPACE) || funcStream.matches(COMMA)) {
            continue
          }
          const val = funcStream.expect(IDENT, TIME, NUMBER, node => {
            if (node.type === 'word') return node.value
            return null
          })
          args.push(val)
        }
        timingFunction = `${funcName}(${args.join(', ')})`
        continue
      }

      // Match number (iteration count)
      if (tokenStream.matches(NUMBER)) {
        iterationCount = tokenStream.lastValue
        continue
      }

      // Match identifier
      if (tokenStream.matches(IDENT)) {
        const value = tokenStream.lastValue
        if (isTimingFunction(value)) {
          timingFunction = value
        } else if (isDirection(value)) {
          direction = value
        } else if (isFillMode(value)) {
          fillMode = value
        } else if (isPlayState(value)) {
          playState = value
        } else if (value.toLowerCase() === 'infinite') {
          iterationCount = 'infinite'
        } else {
          // It's the animation name
          name = value
        }
        continue
      }

      // Try to match as generic word
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
      } else if (isDirection(wordMatch)) {
        direction = wordMatch
      } else if (isFillMode(wordMatch)) {
        fillMode = wordMatch
      } else if (isPlayState(wordMatch)) {
        playState = wordMatch
      } else if (isIterationCount(wordMatch)) {
        iterationCount =
          wordMatch.toLowerCase() === 'infinite'
            ? 'infinite'
            : Number(wordMatch)
      } else {
        name = wordMatch
      }
    }

    // Apply defaults and push
    names.push(name || 'none')
    durations.push(duration || '0s')
    timingFunctions.push(timingFunction || 'ease')
    delays.push(delay || '0s')
    iterationCounts.push(iterationCount !== null ? iterationCount : 1)
    directions.push(direction || 'normal')
    fillModes.push(fillMode || 'none')
    playStates.push(playState || 'running')

    parsingFirst = false
  }

  // Return single values if only one animation, arrays if multiple
  const isSingle = names.length === 1
  return {
    animationName: isSingle ? names[0] : names,
    animationDuration: isSingle ? durations[0] : durations,
    animationTimingFunction: isSingle ? timingFunctions[0] : timingFunctions,
    animationDelay: isSingle ? delays[0] : delays,
    animationIterationCount: isSingle ? iterationCounts[0] : iterationCounts,
    animationDirection: isSingle ? directions[0] : directions,
    animationFillMode: isSingle ? fillModes[0] : fillModes,
    animationPlayState: isSingle ? playStates[0] : playStates,
  }
}
