import transformCss from '..'

it('transforms box-shadow to boxShadow in web format', () => {
  expect(transformCss([['box-shadow', '10px 20px 30px red']])).toEqual({
    boxShadow: '10px 20px 30px red',
  })
})

it('transforms box-shadow without blur-radius', () => {
  expect(transformCss([['box-shadow', '10px 20px red']])).toEqual({
    boxShadow: '10px 20px red',
  })
})

it('transforms box-shadow without color', () => {
  expect(transformCss([['box-shadow', '10px 20px']])).toEqual({
    boxShadow: '10px 20px',
  })
})

it('transforms box-shadow with spread radius', () => {
  expect(transformCss([['box-shadow', '10px 20px 5px 15px red']])).toEqual({
    boxShadow: '10px 20px 5px 15px red',
  })
})

it('transforms box-shadow with inset', () => {
  expect(transformCss([['box-shadow', 'inset 10px 20px 30px red']])).toEqual({
    boxShadow: 'inset 10px 20px 30px red',
  })
})

it('transforms box-shadow with rgb color', () => {
  expect(
    transformCss([['box-shadow', '10px 20px rgb(100, 100, 100)']])
  ).toEqual({
    boxShadow: '10px 20px rgb(100, 100, 100)',
  })
})

it('transforms box-shadow with rgba color', () => {
  expect(
    transformCss([['box-shadow', '10px 20px rgba(100, 100, 100, 0.5)']])
  ).toEqual({
    boxShadow: '10px 20px rgba(100, 100, 100, 0.5)',
  })
})

it('transforms multiple box-shadows', () => {
  expect(
    transformCss([['box-shadow', '10px 20px red, 5px 10px blue']])
  ).toEqual({
    boxShadow: '10px 20px red, 5px 10px blue',
  })
})

it('transforms box-shadow none', () => {
  expect(transformCss([['box-shadow', 'none']])).toEqual({
    boxShadow: 'none',
  })
})

it('transforms box-shadow with var() for color', () => {
  expect(
    transformCss([['box-shadow', '10px 20px var(--primary-color)']])
  ).toEqual({
    boxShadow: '10px 20px var(--primary-color)',
  })
})

it('transforms box-shadow with var() and blur-radius', () => {
  expect(
    transformCss([['box-shadow', '10px 20px 30px var(--primary-color)']])
  ).toEqual({
    boxShadow: '10px 20px 30px var(--primary-color)',
  })
})

it('transforms box-shadow with var() and named color fallback', () => {
  expect(
    transformCss([['box-shadow', '10px 20px var(--primary-color, red)']])
  ).toEqual({
    boxShadow: '10px 20px var(--primary-color, red)',
  })
})

it('transforms box-shadow with var() and hex color fallback', () => {
  expect(
    transformCss([['box-shadow', '10px 20px var(--primary-color, #f00)']])
  ).toEqual({
    boxShadow: '10px 20px var(--primary-color, #f00)',
  })
})

it('transforms box-shadow with var() and rgb color fallback', () => {
  expect(
    transformCss([
      ['box-shadow', '10px 20px var(--primary-color, rgb(255, 0, 0))'],
    ])
  ).toEqual({
    boxShadow: '10px 20px var(--primary-color, rgb(255, 0, 0))',
  })
})

it('transforms box-shadow with var() and rgba color fallback', () => {
  expect(
    transformCss([
      [
        'box-shadow',
        '10px 20px var(--primary-color, rgba(100, 100, 100, 0.5))',
      ],
    ])
  ).toEqual({
    boxShadow: '10px 20px var(--primary-color, rgba(100, 100, 100, 0.5))',
  })
})

it('transforms box-shadow with var() color before offset', () => {
  expect(
    transformCss([['box-shadow', 'var(--primary-color) 10px 20px 30px']])
  ).toEqual({
    boxShadow: 'var(--primary-color) 10px 20px 30px',
  })
})
