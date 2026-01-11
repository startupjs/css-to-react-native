import { stringify } from 'postcss-value-parser'

export default tokenStream => {
  // React Native now supports web-style box-shadow format directly
  // Pass through the original CSS value as boxShadow
  const value = stringify(tokenStream.nodes)
  return {
    boxShadow: value,
  }
}
