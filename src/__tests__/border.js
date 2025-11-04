import transformCss from '..'

it('transforms border none', () => {
  expect(transformCss([['border', 'none']])).toEqual({
    borderWidth: 0,
    borderColor: 'black',
    borderStyle: 'solid',
  })
})

it('transforms border shorthand', () => {
  expect(transformCss([['border', '2px dashed #f00']])).toEqual({
    borderWidth: 2,
    borderColor: '#f00',
    borderStyle: 'dashed',
  })
})

it('transforms border shorthand in other order', () => {
  expect(transformCss([['border', '#f00 2px dashed']])).toEqual({
    borderWidth: 2,
    borderColor: '#f00',
    borderStyle: 'dashed',
  })
})

it('transforms border shorthand missing color', () => {
  expect(transformCss([['border', '2px dashed']])).toEqual({
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'dashed',
  })
})

it('transforms border shorthand missing style', () => {
  expect(transformCss([['border', '2px #f00']])).toEqual({
    borderWidth: 2,
    borderColor: '#f00',
    borderStyle: 'solid',
  })
})

it('transforms border shorthand missing width', () => {
  expect(transformCss([['border', '#f00 dashed']])).toEqual({
    borderWidth: 1,
    borderColor: '#f00',
    borderStyle: 'dashed',
  })
})

it('transforms border shorthand missing color & width', () => {
  expect(transformCss([['border', 'dashed']])).toEqual({
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'dashed',
  })
})

it('transforms border shorthand missing style & width', () => {
  expect(transformCss([['border', '#f00']])).toEqual({
    borderWidth: 1,
    borderColor: '#f00',
    borderStyle: 'solid',
  })
})

it('transforms border shorthand missing color & style', () => {
  expect(transformCss([['border', '2px']])).toEqual({
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'solid',
  })
})

it('transforms border for unsupported units', () => {
  expect(transformCss([['border', '3em solid black']])).toEqual({
    borderWidth: '3em',
    borderColor: 'black',
    borderStyle: 'solid',
  })
})

it('does not transform border with percentage width', () => {
  expect(() => transformCss([['border', '3% solid black']])).toThrow()
})

it('transforms border with var() for color', () => {
  expect(transformCss([['border', '2px solid var(--primary-color)']])).toEqual({
    borderWidth: 2,
    borderColor: 'var(--primary-color)',
    borderStyle: 'solid',
  })
})

it('transforms border with var() and named color fallback', () => {
  expect(
    transformCss([['border', '2px solid var(--primary-color, red)']])
  ).toEqual({
    borderWidth: 2,
    borderColor: 'var(--primary-color, red)',
    borderStyle: 'solid',
  })
})

it('transforms border with var() and hex color fallback', () => {
  expect(
    transformCss([['border', '2px solid var(--primary-color, #f00)']])
  ).toEqual({
    borderWidth: 2,
    borderColor: 'var(--primary-color, #f00)',
    borderStyle: 'solid',
  })
})

it('transforms border with var() and rgb color fallback', () => {
  expect(
    transformCss([['border', '2px solid var(--primary-color, rgb(255, 0, 0))']])
  ).toEqual({
    borderWidth: 2,
    borderColor: 'var(--primary-color, rgb(255,0,0))',
    borderStyle: 'solid',
  })
})

it('transforms border with var() in different order', () => {
  expect(transformCss([['border', 'var(--primary-color) 2px dashed']])).toEqual(
    {
      borderWidth: 2,
      borderColor: 'var(--primary-color)',
      borderStyle: 'dashed',
    }
  )
})

it('transforms border with only var() color', () => {
  expect(transformCss([['border', 'var(--primary-color)']])).toEqual({
    borderWidth: 1,
    borderColor: 'var(--primary-color)',
    borderStyle: 'solid',
  })
})
