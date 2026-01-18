import transformCss from '..'

it('transforms animation shorthand', () => {
  expect(transformCss([['animation', 'fadeIn 300ms ease']])).toEqual({
    animationName: 'fadeIn',
    animationDuration: '300ms',
    animationTimingFunction: 'ease',
    animationDelay: '0s',
    animationIterationCount: 1,
    animationDirection: 'normal',
    animationFillMode: 'none',
    animationPlayState: 'running',
  })
})

it('transforms animation with all properties', () => {
  expect(
    transformCss([
      [
        'animation',
        'slideIn 500ms ease-in-out 100ms infinite alternate forwards paused',
      ],
    ])
  ).toEqual({
    animationName: 'slideIn',
    animationDuration: '500ms',
    animationTimingFunction: 'ease-in-out',
    animationDelay: '100ms',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
    animationFillMode: 'forwards',
    animationPlayState: 'paused',
  })
})

it('transforms multiple animations', () => {
  expect(
    transformCss([['animation', 'fadeIn 300ms ease, slideIn 500ms linear']])
  ).toEqual({
    animationName: ['fadeIn', 'slideIn'],
    animationDuration: ['300ms', '500ms'],
    animationTimingFunction: ['ease', 'linear'],
    animationDelay: ['0s', '0s'],
    animationIterationCount: [1, 1],
    animationDirection: ['normal', 'normal'],
    animationFillMode: ['none', 'none'],
    animationPlayState: ['running', 'running'],
  })
})

it('transforms animation none', () => {
  expect(transformCss([['animation', 'none']])).toEqual({
    animationName: 'none',
    animationDuration: '0s',
    animationTimingFunction: 'ease',
    animationDelay: '0s',
    animationIterationCount: 1,
    animationDirection: 'normal',
    animationFillMode: 'none',
    animationPlayState: 'running',
  })
})

it('transforms animation-name', () => {
  expect(transformCss([['animation-name', 'fadeIn']])).toEqual({
    animationName: 'fadeIn',
  })
})

it('transforms animation-name with multiple animations', () => {
  expect(transformCss([['animation-name', 'fadeIn, slideIn']])).toEqual({
    animationName: ['fadeIn', 'slideIn'],
  })
})

it('inlines @keyframes into animation-name', () => {
  expect(
    transformCss([
      ['@keyframes fadeIn', 'from { opacity: 0; } to { opacity: 1; }'],
      ['animation-name', 'fadeIn'],
    ])
  ).toEqual({
    animationName: { from: { opacity: 0 }, to: { opacity: 1 } },
  })
})

it('inlines @keyframes for multiple animation-name values', () => {
  expect(
    transformCss([
      ['@keyframes fadeIn', 'from { opacity: 0; } to { opacity: 1; }'],
      [
        '@keyframes slideIn',
        'from { transform: translateX(-100px); } to { transform: translateX(0px); }',
      ],
      ['animation-name', 'fadeIn, slideIn'],
    ])
  ).toEqual({
    animationName: [
      { from: { opacity: 0 }, to: { opacity: 1 } },
      {
        from: { transform: [{ translateX: -100 }] },
        to: { transform: [{ translateX: 0 }] },
      },
    ],
  })
})

it('transforms animation-duration', () => {
  expect(transformCss([['animation-duration', '300ms']])).toEqual({
    animationDuration: '300ms',
  })
})

it('transforms animation-duration with multiple values', () => {
  expect(transformCss([['animation-duration', '300ms, 500ms, 1s']])).toEqual({
    animationDuration: ['300ms', '500ms', '1s'],
  })
})

it('transforms animation-timing-function', () => {
  expect(transformCss([['animation-timing-function', 'ease-in-out']])).toEqual({
    animationTimingFunction: 'ease-in-out',
  })
})

it('transforms animation-timing-function with multiple values', () => {
  expect(
    transformCss([['animation-timing-function', 'ease, linear, ease-in-out']])
  ).toEqual({
    animationTimingFunction: ['ease', 'linear', 'ease-in-out'],
  })
})

it('transforms animation-timing-function with cubic-bezier', () => {
  expect(
    transformCss([
      ['animation-timing-function', 'cubic-bezier(0.4, 0, 0.2, 1)'],
    ])
  ).toEqual({
    animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  })
})

it('transforms animation-delay', () => {
  expect(transformCss([['animation-delay', '100ms']])).toEqual({
    animationDelay: '100ms',
  })
})

it('transforms animation-delay with multiple values', () => {
  expect(transformCss([['animation-delay', '100ms, 200ms, 0s']])).toEqual({
    animationDelay: ['100ms', '200ms', '0s'],
  })
})

it('transforms animation-iteration-count', () => {
  expect(transformCss([['animation-iteration-count', 'infinite']])).toEqual({
    animationIterationCount: 'infinite',
  })
})

it('transforms animation-iteration-count with multiple values', () => {
  expect(
    transformCss([['animation-iteration-count', 'infinite, 2, 3']])
  ).toEqual({
    animationIterationCount: ['infinite', 2, 3],
  })
})

it('transforms animation-direction', () => {
  expect(transformCss([['animation-direction', 'alternate']])).toEqual({
    animationDirection: 'alternate',
  })
})

it('transforms animation-direction with multiple values', () => {
  expect(
    transformCss([['animation-direction', 'alternate, reverse, normal']])
  ).toEqual({
    animationDirection: ['alternate', 'reverse', 'normal'],
  })
})

it('transforms animation-fill-mode', () => {
  expect(transformCss([['animation-fill-mode', 'forwards']])).toEqual({
    animationFillMode: 'forwards',
  })
})

it('transforms animation-fill-mode with multiple values', () => {
  expect(
    transformCss([['animation-fill-mode', 'forwards, backwards, both']])
  ).toEqual({
    animationFillMode: ['forwards', 'backwards', 'both'],
  })
})

it('transforms animation-play-state', () => {
  expect(transformCss([['animation-play-state', 'paused']])).toEqual({
    animationPlayState: 'paused',
  })
})

it('transforms animation-play-state with multiple values', () => {
  expect(
    transformCss([['animation-play-state', 'paused, running, paused']])
  ).toEqual({
    animationPlayState: ['paused', 'running', 'paused'],
  })
})

it('inlines @keyframes into animationName', () => {
  expect(
    transformCss([
      ['@keyframes fadeIn', 'from { opacity: 0; } to { opacity: 1; }'],
      ['animation', 'fadeIn 300ms ease'],
    ])
  ).toEqual({
    animationName: { from: { opacity: 0 }, to: { opacity: 1 } },
    animationDuration: '300ms',
    animationTimingFunction: 'ease',
    animationDelay: '0s',
    animationIterationCount: 1,
    animationDirection: 'normal',
    animationFillMode: 'none',
    animationPlayState: 'running',
  })
})

it('inlines @keyframes with percentages', () => {
  expect(
    transformCss([
      [
        '@keyframes pulse',
        '0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; }',
      ],
      ['animation', 'pulse 1s infinite'],
    ])
  ).toEqual({
    animationName: {
      '0%': { opacity: 1 },
      '50%': { opacity: 0.5 },
      '100%': { opacity: 1 },
    },
    animationDuration: '1s',
    animationTimingFunction: 'ease',
    animationDelay: '0s',
    animationIterationCount: 'infinite',
    animationDirection: 'normal',
    animationFillMode: 'none',
    animationPlayState: 'running',
  })
})

it('inlines @keyframes with transform', () => {
  expect(
    transformCss([
      [
        '@keyframes slideIn',
        'from { transform: translateX(-100px); } to { transform: translateX(0px); }',
      ],
      ['animation', 'slideIn 500ms ease-out'],
    ])
  ).toEqual({
    animationName: {
      from: { transform: [{ translateX: -100 }] },
      to: { transform: [{ translateX: 0 }] },
    },
    animationDuration: '500ms',
    animationTimingFunction: 'ease-out',
    animationDelay: '0s',
    animationIterationCount: 1,
    animationDirection: 'normal',
    animationFillMode: 'none',
    animationPlayState: 'running',
  })
})

it('inlines multiple @keyframes for multiple animations', () => {
  expect(
    transformCss([
      ['@keyframes fadeIn', 'from { opacity: 0; } to { opacity: 1; }'],
      [
        '@keyframes slideIn',
        'from { transform: translateX(-100px); } to { transform: translateX(0px); }',
      ],
      ['animation', 'fadeIn 300ms ease, slideIn 500ms linear'],
    ])
  ).toEqual({
    animationName: [
      { from: { opacity: 0 }, to: { opacity: 1 } },
      {
        from: { transform: [{ translateX: -100 }] },
        to: { transform: [{ translateX: 0 }] },
      },
    ],
    animationDuration: ['300ms', '500ms'],
    animationTimingFunction: ['ease', 'linear'],
    animationDelay: ['0s', '0s'],
    animationIterationCount: [1, 1],
    animationDirection: ['normal', 'normal'],
    animationFillMode: ['none', 'none'],
    animationPlayState: ['running', 'running'],
  })
})

it('keeps animation name as string if no matching @keyframes', () => {
  expect(transformCss([['animation', 'unknownAnimation 300ms ease']])).toEqual({
    animationName: 'unknownAnimation',
    animationDuration: '300ms',
    animationTimingFunction: 'ease',
    animationDelay: '0s',
    animationIterationCount: 1,
    animationDirection: 'normal',
    animationFillMode: 'none',
    animationPlayState: 'running',
  })
})

it('handles animation with numeric iteration count', () => {
  expect(transformCss([['animation', 'bounce 1s ease 3']])).toEqual({
    animationName: 'bounce',
    animationDuration: '1s',
    animationTimingFunction: 'ease',
    animationDelay: '0s',
    animationIterationCount: 3,
    animationDirection: 'normal',
    animationFillMode: 'none',
    animationPlayState: 'running',
  })
})

it('handles @keyframes with multiple selectors', () => {
  expect(
    transformCss([
      [
        '@keyframes bounce',
        '0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); }',
      ],
      ['animation', 'bounce 1s infinite'],
    ])
  ).toEqual({
    animationName: {
      '0%': { transform: [{ translateY: 0 }] },
      '100%': { transform: [{ translateY: 0 }] },
      '50%': { transform: [{ translateY: -20 }] },
    },
    animationDuration: '1s',
    animationTimingFunction: 'ease',
    animationDelay: '0s',
    animationIterationCount: 'infinite',
    animationDirection: 'normal',
    animationFillMode: 'none',
    animationPlayState: 'running',
  })
})

it('handles @keyframes with CSS comments', () => {
  expect(
    transformCss([
      [
        '@keyframes fadeIn',
        `
          /* Start state */
          from {
            opacity: 0; /* fully transparent */
          }
          /* End state */
          to {
            opacity: 1; /* fully visible */
          }
        `,
      ],
      ['animation', 'fadeIn 300ms ease'],
    ])
  ).toEqual({
    animationName: { from: { opacity: 0 }, to: { opacity: 1 } },
    animationDuration: '300ms',
    animationTimingFunction: 'ease',
    animationDelay: '0s',
    animationIterationCount: 1,
    animationDirection: 'normal',
    animationFillMode: 'none',
    animationPlayState: 'running',
  })
})

it('handles @keyframes with multi-line comments', () => {
  expect(
    transformCss([
      [
        '@keyframes slide',
        `
          /*
           * This is a multi-line comment
           * describing the animation
           */
          0% { transform: translateX(0px); }
          100% { transform: translateX(100px); }
        `,
      ],
      ['animation', 'slide 500ms linear'],
    ])
  ).toEqual({
    animationName: {
      '0%': { transform: [{ translateX: 0 }] },
      '100%': { transform: [{ translateX: 100 }] },
    },
    animationDuration: '500ms',
    animationTimingFunction: 'linear',
    animationDelay: '0s',
    animationIterationCount: 1,
    animationDirection: 'normal',
    animationFillMode: 'none',
    animationPlayState: 'running',
  })
})
