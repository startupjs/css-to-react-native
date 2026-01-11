import transformCss from '..'

it('textShadow with all values', () => {
  expect(transformCss([['text-shadow', '10px 20px 30px red']])).toEqual({
    textShadowOffset: { width: 10, height: 20 },
    textShadowRadius: 30,
    textShadowColor: 'red',
  })
})

it('textShadow omitting blur', () => {
  expect(transformCss([['text-shadow', '10px 20px red']])).toEqual({
    textShadowOffset: { width: 10, height: 20 },
    textShadowRadius: 0,
    textShadowColor: 'red',
  })
})

it('textShadow omitting color', () => {
  expect(transformCss([['text-shadow', '10px 20px']])).toEqual({
    textShadowOffset: { width: 10, height: 20 },
    textShadowRadius: 0,
    textShadowColor: 'black',
  })
})

it('textShadow enforces offset-x and offset-y', () => {
  expect(() => transformCss([['text-shadow', 'red']])).toThrow()
  expect(() => transformCss([['text-shadow', '10px red']])).toThrow()
})

it('textShadow with var() for color', () => {
  expect(
    transformCss([['text-shadow', '10px 20px var(--primary-color)']])
  ).toEqual({
    textShadowOffset: { width: 10, height: 20 },
    textShadowRadius: 0,
    textShadowColor: 'var(--primary-color)',
  })
})

it('textShadow with var() and blur-radius', () => {
  expect(
    transformCss([['text-shadow', '10px 20px 30px var(--primary-color)']])
  ).toEqual({
    textShadowOffset: { width: 10, height: 20 },
    textShadowRadius: 30,
    textShadowColor: 'var(--primary-color)',
  })
})

it('textShadow with var() and named color fallback', () => {
  expect(
    transformCss([['text-shadow', '10px 20px var(--primary-color, red)']])
  ).toEqual({
    textShadowOffset: { width: 10, height: 20 },
    textShadowRadius: 0,
    textShadowColor: 'var(--primary-color, red)',
  })
})

it('textShadow with var() and hex color fallback', () => {
  expect(
    transformCss([['text-shadow', '10px 20px var(--primary-color, #f00)']])
  ).toEqual({
    textShadowOffset: { width: 10, height: 20 },
    textShadowRadius: 0,
    textShadowColor: 'var(--primary-color, #f00)',
  })
})

it('textShadow with var() and rgb color fallback', () => {
  expect(
    transformCss([
      ['text-shadow', '10px 20px var(--primary-color, rgb(255, 0, 0))'],
    ])
  ).toEqual({
    textShadowOffset: { width: 10, height: 20 },
    textShadowRadius: 0,
    textShadowColor: 'var(--primary-color, rgb(255,0,0))',
  })
})

it('textShadow with var() and rgba color fallback', () => {
  expect(
    transformCss([
      [
        'text-shadow',
        '10px 20px var(--primary-color, rgba(100, 100, 100, 0.5))',
      ],
    ])
  ).toEqual({
    textShadowOffset: { width: 10, height: 20 },
    textShadowRadius: 0,
    textShadowColor: 'var(--primary-color, rgba(100,100,100,0.5))',
  })
})

it('textShadow with var() color before offset', () => {
  expect(
    transformCss([['text-shadow', 'var(--primary-color) 10px 20px 30px']])
  ).toEqual({
    textShadowOffset: { width: 10, height: 20 },
    textShadowRadius: 30,
    textShadowColor: 'var(--primary-color)',
  })
})
