import transformCss from '..'

it('transforms border color with multiple values', () => {
  expect(transformCss([['border-color', 'red yellow green blue']])).toEqual({
    borderTopColor: 'red',
    borderRightColor: 'yellow',
    borderBottomColor: 'green',
    borderLeftColor: 'blue',
  })
})

it('transforms border color with hex color', () => {
  expect(transformCss([['border-color', '#f00']])).toEqual({
    borderBottomColor: '#f00',
    borderLeftColor: '#f00',
    borderRightColor: '#f00',
    borderTopColor: '#f00',
  })
})

it('transforms border color with rgb color', () => {
  expect(transformCss([['border-color', 'rgb(255, 0, 0)']])).toEqual({
    borderBottomColor: 'rgb(255, 0, 0)',
    borderLeftColor: 'rgb(255, 0, 0)',
    borderRightColor: 'rgb(255, 0, 0)',
    borderTopColor: 'rgb(255, 0, 0)',
  })
})

it('transforms border color with rgba color', () => {
  expect(transformCss([['border-color', 'rgba(255, 0, 0, 0.1)']])).toEqual({
    borderBottomColor: 'rgba(255, 0, 0, 0.1)',
    borderLeftColor: 'rgba(255, 0, 0, 0.1)',
    borderRightColor: 'rgba(255, 0, 0, 0.1)',
    borderTopColor: 'rgba(255, 0, 0, 0.1)',
  })
})

it('transforms border color with var()', () => {
  expect(transformCss([['border-color', 'var(--primary-color)']])).toEqual({
    borderBottomColor: 'var(--primary-color)',
    borderLeftColor: 'var(--primary-color)',
    borderRightColor: 'var(--primary-color)',
    borderTopColor: 'var(--primary-color)',
  })
})

it('transforms border color with var() and fallback', () => {
  expect(transformCss([['border-color', 'var(--primary-color, red)']])).toEqual(
    {
      borderBottomColor: 'var(--primary-color, red)',
      borderLeftColor: 'var(--primary-color, red)',
      borderRightColor: 'var(--primary-color, red)',
      borderTopColor: 'var(--primary-color, red)',
    }
  )
})

it('transforms border color with multiple var() values', () => {
  expect(
    transformCss([
      ['border-color', 'var(--top) var(--right) var(--bottom) var(--left)'],
    ])
  ).toEqual({
    borderTopColor: 'var(--top)',
    borderRightColor: 'var(--right)',
    borderBottomColor: 'var(--bottom)',
    borderLeftColor: 'var(--left)',
  })
})

it('transforms border color with var() and hex fallback', () => {
  expect(
    transformCss([['border-color', 'var(--primary-color, #f00)']])
  ).toEqual({
    borderBottomColor: 'var(--primary-color, #f00)',
    borderLeftColor: 'var(--primary-color, #f00)',
    borderRightColor: 'var(--primary-color, #f00)',
    borderTopColor: 'var(--primary-color, #f00)',
  })
})

it('transforms border color with var() and rgb fallback', () => {
  expect(
    transformCss([['border-color', 'var(--primary-color, rgb(255, 0, 0))']])
  ).toEqual({
    borderBottomColor: 'var(--primary-color, rgb(255,0,0))',
    borderLeftColor: 'var(--primary-color, rgb(255,0,0))',
    borderRightColor: 'var(--primary-color, rgb(255,0,0))',
    borderTopColor: 'var(--primary-color, rgb(255,0,0))',
  })
})
