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
