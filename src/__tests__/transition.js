import transformCss from '..'

it('transforms transition shorthand', () => {
  expect(transformCss([['transition', 'opacity 300ms ease']])).toEqual({
    transitionProperty: 'opacity',
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease',
    transitionDelay: '0s',
  })
})

it('transforms transition with only property and duration', () => {
  expect(transformCss([['transition', 'opacity 300ms']])).toEqual({
    transitionProperty: 'opacity',
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease',
    transitionDelay: '0s',
  })
})

it('transforms transition property names to camelCase', () => {
  expect(transformCss([['transition', 'background-color 300ms']])).toEqual({
    transitionProperty: 'backgroundColor',
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease',
    transitionDelay: '0s',
  })
})

it('transforms multiple transition property names to camelCase', () => {
  expect(
    transformCss([
      ['transition', 'background-color 300ms, border-radius 500ms ease-out'],
    ])
  ).toEqual({
    transitionProperty: ['backgroundColor', 'borderRadius'],
    transitionDuration: ['300ms', '500ms'],
    transitionTimingFunction: ['ease', 'ease-out'],
    transitionDelay: ['0s', '0s'],
  })
})

it('transforms transition with delay', () => {
  expect(transformCss([['transition', 'opacity 300ms ease 100ms']])).toEqual({
    transitionProperty: 'opacity',
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease',
    transitionDelay: '100ms',
  })
})

it('transforms transition with all property', () => {
  expect(transformCss([['transition', 'all 200ms linear']])).toEqual({
    transitionProperty: 'all',
    transitionDuration: '200ms',
    transitionTimingFunction: 'linear',
    transitionDelay: '0s',
  })
})

it('transforms multiple transitions', () => {
  expect(
    transformCss([
      ['transition', 'opacity 300ms ease, transform 500ms ease-in'],
    ])
  ).toEqual({
    transitionProperty: ['opacity', 'transform'],
    transitionDuration: ['300ms', '500ms'],
    transitionTimingFunction: ['ease', 'ease-in'],
    transitionDelay: ['0s', '0s'],
  })
})

it('transforms transition with cubic-bezier', () => {
  expect(
    transformCss([['transition', 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)']])
  ).toEqual({
    transitionProperty: 'opacity',
    transitionDuration: '300ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDelay: '0s',
  })
})

it('transforms transition none', () => {
  expect(transformCss([['transition', 'none']])).toEqual({
    transitionProperty: 'none',
    transitionDuration: '0s',
    transitionTimingFunction: 'ease',
    transitionDelay: '0s',
  })
})

it('transforms transition-property', () => {
  expect(transformCss([['transition-property', 'opacity']])).toEqual({
    transitionProperty: 'opacity',
  })
})

it('transforms transition-property with multiple values', () => {
  expect(
    transformCss([['transition-property', 'opacity, transform, width']])
  ).toEqual({
    transitionProperty: ['opacity', 'transform', 'width'],
  })
})

it('transforms transition-property with camelCase conversion', () => {
  expect(
    transformCss([['transition-property', 'background-color, border-radius']])
  ).toEqual({
    transitionProperty: ['backgroundColor', 'borderRadius'],
  })
})

it('transforms transition-duration', () => {
  expect(transformCss([['transition-duration', '300ms']])).toEqual({
    transitionDuration: '300ms',
  })
})

it('transforms transition-duration with multiple values', () => {
  expect(transformCss([['transition-duration', '300ms, 500ms, 1s']])).toEqual({
    transitionDuration: ['300ms', '500ms', '1s'],
  })
})

it('transforms transition-timing-function', () => {
  expect(transformCss([['transition-timing-function', 'ease-in-out']])).toEqual(
    {
      transitionTimingFunction: 'ease-in-out',
    }
  )
})

it('transforms transition-timing-function with multiple values', () => {
  expect(
    transformCss([['transition-timing-function', 'ease, linear, ease-in-out']])
  ).toEqual({
    transitionTimingFunction: ['ease', 'linear', 'ease-in-out'],
  })
})

it('transforms transition-timing-function with cubic-bezier', () => {
  expect(
    transformCss([
      ['transition-timing-function', 'cubic-bezier(0.4, 0, 0.2, 1)'],
    ])
  ).toEqual({
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  })
})

it('transforms transition-delay', () => {
  expect(transformCss([['transition-delay', '100ms']])).toEqual({
    transitionDelay: '100ms',
  })
})

it('transforms transition-delay with multiple values', () => {
  expect(transformCss([['transition-delay', '100ms, 200ms, 0s']])).toEqual({
    transitionDelay: ['100ms', '200ms', '0s'],
  })
})

it('transforms transition with seconds', () => {
  expect(transformCss([['transition', 'opacity 1s linear 0.5s']])).toEqual({
    transitionProperty: 'opacity',
    transitionDuration: '1s',
    transitionTimingFunction: 'linear',
    transitionDelay: '0.5s',
  })
})

it('transforms multiple transitions with different timing functions', () => {
  expect(
    transformCss([
      ['transition', 'width 200ms ease-in, height 300ms ease-out 100ms'],
    ])
  ).toEqual({
    transitionProperty: ['width', 'height'],
    transitionDuration: ['200ms', '300ms'],
    transitionTimingFunction: ['ease-in', 'ease-out'],
    transitionDelay: ['0s', '100ms'],
  })
})
