import { SPACE, COMMA, IDENT, TIME, NUMBER, NONE } from '../tokenTypes'

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
const directionKeywords = ['normal', 'reverse', 'alternate', 'alternate-reverse']

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

export default tokenStream => {
  // Handle 'none'
  if (tokenStream.matches(NONE)) {
    tokenStream.expectEmpty()
    return {
      animationName: ['none'],
      animationDuration: ['0s'],
      animationTimingFunction: ['ease'],
      animationDelay: ['0s'],
      animationIterationCount: [1],
      animationDirection: ['normal'],
      animationFillMode: ['none'],
      animationPlayState: ['running'],
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

      // Match time
      if (tokenStream.matches(TIME)) {
        const value = tokenStream.lastValue
        if (duration === null) {
          duration = value
        } else {
          delay = value
        }
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
    iterationCounts.push(
      iterationCount !== null ? iterationCount : 1
    )
    directions.push(direction || 'normal')
    fillModes.push(fillMode || 'none')
    playStates.push(playState || 'running')

    parsingFirst = false
  }

  return {
    animationName: names,
    animationDuration: durations,
    animationTimingFunction: timingFunctions,
    animationDelay: delays,
    animationIterationCount: iterationCounts,
    animationDirection: directions,
    animationFillMode: fillModes,
    animationPlayState: playStates,
  }
}
