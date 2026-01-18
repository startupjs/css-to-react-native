/* eslint-disable no-param-reassign */
import parse from 'postcss-value-parser'
import camelizeStyleName from 'camelize'
import transforms from './transforms/index'
import devPropertiesWithoutUnitsRegExp from './devPropertiesWithoutUnitsRegExp'
import TokenStream from './TokenStream'

// Note if this is wrong, you'll need to change tokenTypes.js too
const numberOrLengthRe = /^([+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?)(?:px)?$/i
const numberOnlyRe = /^[+-]?(?:\d*\.\d*|[1-9]\d*)(?:e[+-]?\d+)?$/i
const boolRe = /^true|false$/i
const nullRe = /^null$/i
const undefinedRe = /^undefined$/i

// Undocumented export
export const transformRawValue = (propName, value) => {
  if (process.env.NODE_ENV !== 'production') {
    const needsUnit = !devPropertiesWithoutUnitsRegExp.test(propName)
    const isNumberWithoutUnit = numberOnlyRe.test(value)
    if (needsUnit && isNumberWithoutUnit) {
      // eslint-disable-next-line no-console
      console.warn(`Expected style "${propName}: ${value}" to contain units`)
    }
    if (!needsUnit && value !== '0' && !isNumberWithoutUnit) {
      // eslint-disable-next-line no-console
      console.warn(`Expected style "${propName}: ${value}" to be unitless`)
    }
  }

  const numberMatch = value.match(numberOrLengthRe)
  if (numberMatch !== null) return Number(numberMatch[1])

  const boolMatch = value.match(boolRe)
  if (boolMatch !== null) return boolMatch[0].toLowerCase() === 'true'

  const nullMatch = value.match(nullRe)
  if (nullMatch !== null) return null

  const undefinedMatch = value.match(undefinedRe)
  if (undefinedMatch !== null) return undefined

  return value
}

const baseTransformShorthandValue = (propName, value) => {
  const ast = parse(value)
  const tokenStream = new TokenStream(ast.nodes)
  return transforms[propName](tokenStream)
}

const transformShorthandValue =
  process.env.NODE_ENV === 'production'
    ? baseTransformShorthandValue
    : (propName, value) => {
        try {
          return baseTransformShorthandValue(propName, value)
        } catch (e) {
          throw new Error(`Failed to parse declaration "${propName}: ${value}"`)
        }
      }

export const getStylesForProperty = (propName, inputValue, allowShorthand) => {
  const isRawValue = allowShorthand === false || !(propName in transforms)
  const value = inputValue.trim()

  const propValues = isRawValue
    ? { [propName]: transformRawValue(propName, value) }
    : transformShorthandValue(propName, value)

  return propValues
}

export const getPropertyName = propName => {
  const isCustomProp = /^--\w+/.test(propName)
  if (isCustomProp) {
    return propName
  }
  return camelizeStyleName(propName)
}

/**
 * Strip CSS comments from a string
 * Handles both single-line and multi-line comments
 */
const stripCssComments = css => css.replace(/\/\*[\s\S]*?\*\//g, '')

/**
 * Parse CSS declarations into React Native styles (for keyframes)
 */
const parseKeyframeDeclarations = declarationsStr => {
  const declarations = []
  const parts = declarationsStr.split(';')

  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue

    const colonIndex = trimmed.indexOf(':')
    if (colonIndex === -1) continue

    const property = trimmed.substring(0, colonIndex).trim()
    const value = trimmed.substring(colonIndex + 1).trim()

    if (property && value) {
      declarations.push([property, value])
    }
  }

  if (declarations.length === 0) {
    return {}
  }

  // Transform each declaration
  return declarations.reduce((accum, rule) => {
    const propertyName = getPropertyName(rule[0])
    const value = rule[1]
    return Object.assign(accum, getStylesForProperty(propertyName, value, true))
  }, {})
}

/**
 * Parse keyframe body CSS into a keyframe object
 * @param {string} body - CSS keyframe body
 * @returns {Object} Keyframe object with selectors as keys
 */
const parseKeyframeBody = body => {
  // Strip CSS comments before parsing
  const cleanBody = stripCssComments(body)

  const keyframeObject = {}
  const selectorRegex = /([a-zA-Z0-9%,\s]+)\s*\{\s*([^}]*)\s*\}/g
  let selectorMatch

  // eslint-disable-next-line no-cond-assign
  while ((selectorMatch = selectorRegex.exec(cleanBody)) !== null) {
    const selectors = selectorMatch[1]
      .split(',')
      .map(s => s.trim())
      .filter(s => s)
    const declarations = selectorMatch[2]

    // Parse CSS declarations into style object
    const styles = parseKeyframeDeclarations(declarations)

    for (const selector of selectors) {
      keyframeObject[selector] = styles
    }
  }

  return keyframeObject
}

/**
 * Check if a property name is a @keyframes rule
 */
const isKeyframesRule = propName =>
  propName.startsWith('@keyframes ') || propName.startsWith('@keyframes\t')

/**
 * Extract keyframe name from @keyframes rule
 */
const getKeyframeName = propName =>
  propName.replace(/^@keyframes\s+/, '').trim()

export default (rules, shorthandBlacklist = []) => {
  // First pass: collect @keyframes definitions
  const keyframesMap = {}

  for (const rule of rules) {
    const propName = rule[0]
    if (isKeyframesRule(propName)) {
      const keyframeName = getKeyframeName(propName)
      const keyframeBody = rule[1]
      keyframesMap[keyframeName] = parseKeyframeBody(keyframeBody)
    }
  }

  // Second pass: transform all non-keyframes rules
  const result = {}

  for (const rule of rules) {
    const propName = rule[0]

    // Skip @keyframes rules in the output
    if (isKeyframesRule(propName)) {
      continue
    }

    const propertyName = getPropertyName(propName)
    const value = rule[1]
    const allowShorthand = shorthandBlacklist.indexOf(propertyName) === -1
    const propValues = getStylesForProperty(propertyName, value, allowShorthand)

    Object.assign(result, propValues)
  }

  // Third pass: replace animationName strings with actual keyframe objects
  if (result.animationName) {
    if (Array.isArray(result.animationName)) {
      result.animationName = result.animationName.map(name => {
        if (typeof name === 'string' && name !== 'none' && keyframesMap[name]) {
          return keyframesMap[name]
        }
        return name
      })
    } else if (typeof result.animationName === 'string') {
      // Handle single value case
      if (
        result.animationName !== 'none' &&
        keyframesMap[result.animationName]
      ) {
        result.animationName = keyframesMap[result.animationName]
      }
    }
  }

  return result
}
