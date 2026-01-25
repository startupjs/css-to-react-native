import transformCss from '..'

// =============================================================================
// Transform functions with var()
// =============================================================================

describe('transform with var()', () => {
  it('transforms translateX with var()', () => {
    expect(transformCss([['transform', 'translateX(var(--x))']])).toEqual({
      transform: [{ translateX: 'var(--x)' }],
    })
  })

  it('transforms translateX with var() and fallback', () => {
    expect(transformCss([['transform', 'translateX(var(--x, 10px))']])).toEqual({
      transform: [{ translateX: 'var(--x, 10px)' }],
    })
  })

  it('transforms multiple transform functions with var()', () => {
    expect(
      transformCss([
        ['transform', 'translateX(var(--x, 10px)) translateY(var(--y, 20px))'],
      ])
    ).toEqual({
      transform: [
        { translateY: 'var(--y, 20px)' },
        { translateX: 'var(--x, 10px)' },
      ],
    })
  })

  it('transforms rotate with var()', () => {
    expect(transformCss([['transform', 'rotate(var(--angle, 45deg))']])).toEqual(
      {
        transform: [{ rotate: 'var(--angle, 45deg)' }],
      }
    )
  })

  it('transforms scale with var()', () => {
    expect(transformCss([['transform', 'scale(var(--scale, 1.5))']])).toEqual({
      transform: [{ scale: 'var(--scale, 1.5)' }],
    })
  })

  it('transforms mixed concrete and var() values', () => {
    expect(
      transformCss([['transform', 'translateX(10px) rotate(var(--angle))']])
    ).toEqual({
      transform: [{ rotate: 'var(--angle)' }, { translateX: 10 }],
    })
  })

  it('transforms translate with two var() args', () => {
    expect(
      transformCss([['transform', 'translate(var(--x, 10px), var(--y, 20px))']])
    ).toEqual({
      transform: [
        { translateY: 'var(--y, 20px)' },
        { translateX: 'var(--x, 10px)' },
      ],
    })
  })

  it('transforms scale with two var() args', () => {
    expect(
      transformCss([['transform', 'scale(var(--sx, 1), var(--sy, 2))']])
    ).toEqual({
      transform: [{ scaleY: 'var(--sy, 2)' }, { scaleX: 'var(--sx, 1)' }],
    })
  })

  it('transforms skew with var()', () => {
    expect(
      transformCss([['transform', 'skew(var(--skew-x, 10deg), var(--skew-y, 5deg))']])
    ).toEqual({
      transform: [
        { skewY: 'var(--skew-y, 5deg)' },
        { skewX: 'var(--skew-x, 10deg)' },
      ],
    })
  })
})

// =============================================================================
// Box-shadow with multiple var() values and comma-separated shadows
// =============================================================================

describe('box-shadow with complex var()', () => {
  it('transforms box-shadow with var() for offset-x', () => {
    expect(
      transformCss([['box-shadow', 'var(--x) 10px 5px red']])
    ).toEqual({
      boxShadow: 'var(--x) 10px 5px red',
    })
  })

  it('transforms box-shadow with var() for offset-y', () => {
    expect(
      transformCss([['box-shadow', '10px var(--y) 5px red']])
    ).toEqual({
      boxShadow: '10px var(--y) 5px red',
    })
  })

  it('transforms box-shadow with var() for blur', () => {
    expect(
      transformCss([['box-shadow', '10px 20px var(--blur) red']])
    ).toEqual({
      boxShadow: '10px 20px var(--blur) red',
    })
  })

  it('transforms box-shadow with multiple var() values', () => {
    expect(
      transformCss([['box-shadow', 'var(--x) var(--y) var(--blur) var(--color)']])
    ).toEqual({
      boxShadow: 'var(--x) var(--y) var(--blur) var(--color)',
    })
  })

  it('transforms multiple box-shadows with var()', () => {
    expect(
      transformCss([
        [
          'box-shadow',
          'var(--x) var(--y) var(--color, rgba(0, 0, 0, 0.2)), var(--x-2) var(--y-2) var(--color-2, rgba(0, 0, 0, 0.5))',
        ],
      ])
    ).toEqual({
      boxShadow:
        'var(--x) var(--y) var(--color, rgba(0, 0, 0, 0.2)), var(--x-2) var(--y-2) var(--color-2, rgba(0, 0, 0, 0.5))',
    })
  })

  it('transforms multiple box-shadows with mixed concrete and var() values', () => {
    expect(
      transformCss([
        ['box-shadow', '10px 20px red, var(--x-2) var(--y-2) blue'],
      ])
    ).toEqual({
      boxShadow: '10px 20px red, var(--x-2) var(--y-2) blue',
    })
  })

  it('transforms box-shadow with var() having rgba fallback', () => {
    expect(
      transformCss([
        ['box-shadow', '10px 20px var(--blur, 5px) var(--color, rgba(0, 0, 0, 0.2))'],
      ])
    ).toEqual({
      boxShadow: '10px 20px var(--blur, 5px) var(--color, rgba(0, 0, 0, 0.2))',
    })
  })
})

// =============================================================================
// Shorthand properties with multiple var() values
// =============================================================================

describe('shorthand properties with var()', () => {
  it('transforms padding with multiple var() values', () => {
    expect(
      transformCss([
        ['padding', 'var(--top) var(--right) var(--bottom) var(--left)'],
      ])
    ).toEqual({
      paddingTop: 'var(--top)',
      paddingRight: 'var(--right)',
      paddingBottom: 'var(--bottom)',
      paddingLeft: 'var(--left)',
    })
  })

  it('transforms padding with var() and fallbacks', () => {
    expect(
      transformCss([
        ['padding', 'var(--top, 10px) var(--right, 20px) var(--bottom, 10px) var(--left, 20px)'],
      ])
    ).toEqual({
      paddingTop: 'var(--top, 10px)',
      paddingRight: 'var(--right, 20px)',
      paddingBottom: 'var(--bottom, 10px)',
      paddingLeft: 'var(--left, 20px)',
    })
  })

  it('transforms padding with two var() values', () => {
    expect(
      transformCss([['padding', 'var(--vertical) var(--horizontal)']])
    ).toEqual({
      paddingTop: 'var(--vertical)',
      paddingRight: 'var(--horizontal)',
      paddingBottom: 'var(--vertical)',
      paddingLeft: 'var(--horizontal)',
    })
  })

  it('transforms margin with multiple var() values', () => {
    expect(
      transformCss([
        ['margin', 'var(--top) var(--right) var(--bottom) var(--left)'],
      ])
    ).toEqual({
      marginTop: 'var(--top)',
      marginRight: 'var(--right)',
      marginBottom: 'var(--bottom)',
      marginLeft: 'var(--left)',
    })
  })

  it('transforms margin with mixed concrete and var() values', () => {
    expect(
      transformCss([['margin', '10px var(--horizontal) 20px']])
    ).toEqual({
      marginTop: 10,
      marginRight: 'var(--horizontal)',
      marginBottom: 20,
      marginLeft: 'var(--horizontal)',
    })
  })

  it('transforms border-radius with multiple var() values', () => {
    expect(
      transformCss([
        ['border-radius', 'var(--tl) var(--tr) var(--br) var(--bl)'],
      ])
    ).toEqual({
      borderTopLeftRadius: 'var(--tl)',
      borderTopRightRadius: 'var(--tr)',
      borderBottomRightRadius: 'var(--br)',
      borderBottomLeftRadius: 'var(--bl)',
    })
  })

  it('transforms border-width with multiple var() values', () => {
    expect(
      transformCss([
        ['border-width', 'var(--top) var(--right) var(--bottom) var(--left)'],
      ])
    ).toEqual({
      borderTopWidth: 'var(--top)',
      borderRightWidth: 'var(--right)',
      borderBottomWidth: 'var(--bottom)',
      borderLeftWidth: 'var(--left)',
    })
  })
})

// =============================================================================
// Animation with var()
// =============================================================================

describe('animation with var()', () => {
  it('transforms animation-duration with var()', () => {
    expect(
      transformCss([['animation-duration', 'var(--duration, 300ms)']])
    ).toEqual({
      animationDuration: 'var(--duration, 300ms)',
    })
  })

  it('transforms animation-delay with var()', () => {
    expect(
      transformCss([['animation-delay', 'var(--delay, 100ms)']])
    ).toEqual({
      animationDelay: 'var(--delay, 100ms)',
    })
  })

  it('transforms animation-name with var()', () => {
    expect(transformCss([['animation-name', 'var(--animation)']])).toEqual({
      animationName: 'var(--animation)',
    })
  })

  it('transforms animation shorthand with var() for duration', () => {
    expect(
      transformCss([['animation', 'fadeIn var(--duration, 300ms) ease']])
    ).toEqual({
      animationName: 'fadeIn',
      animationDuration: 'var(--duration, 300ms)',
      animationTimingFunction: 'ease',
      animationDelay: '0s',
      animationIterationCount: 1,
      animationDirection: 'normal',
      animationFillMode: 'none',
      animationPlayState: 'running',
    })
  })

  it('transforms multiple animation values with var()', () => {
    expect(
      transformCss([
        ['animation-duration', 'var(--dur1), var(--dur2)'],
      ])
    ).toEqual({
      animationDuration: ['var(--dur1)', 'var(--dur2)'],
    })
  })
})

// =============================================================================
// Transition with var()
// =============================================================================

describe('transition with var()', () => {
  it('transforms transition-duration with var()', () => {
    expect(
      transformCss([['transition-duration', 'var(--duration, 300ms)']])
    ).toEqual({
      transitionDuration: 'var(--duration, 300ms)',
    })
  })

  it('transforms transition-delay with var()', () => {
    expect(
      transformCss([['transition-delay', 'var(--delay, 100ms)']])
    ).toEqual({
      transitionDelay: 'var(--delay, 100ms)',
    })
  })

  it('transforms transition shorthand with var() for duration', () => {
    expect(
      transformCss([['transition', 'opacity var(--duration, 300ms) ease']])
    ).toEqual({
      transitionProperty: 'opacity',
      transitionDuration: 'var(--duration, 300ms)',
      transitionTimingFunction: 'ease',
      transitionDelay: '0s',
    })
  })

  it('transforms multiple transition values with var()', () => {
    expect(
      transformCss([['transition-duration', 'var(--dur1), var(--dur2)']])
    ).toEqual({
      transitionDuration: ['var(--dur1)', 'var(--dur2)'],
    })
  })

  it('transforms transition with var() for delay', () => {
    expect(
      transformCss([['transition', 'opacity 300ms ease var(--delay)']])
    ).toEqual({
      transitionProperty: 'opacity',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease',
      transitionDelay: 'var(--delay)',
    })
  })
})

// =============================================================================
// Edge cases with var() fallbacks containing commas
// =============================================================================

describe('var() with complex fallbacks', () => {
  it('handles var() with rgba fallback containing commas', () => {
    expect(
      transformCss([['color', 'var(--color, rgba(100, 100, 100, 0.5))']])
    ).toEqual({
      color: 'var(--color, rgba(100, 100, 100, 0.5))',
    })
  })

  it('handles var() with rgb fallback containing commas', () => {
    expect(
      transformCss([['color', 'var(--color, rgb(100, 100, 100))']])
    ).toEqual({
      color: 'var(--color, rgb(100, 100, 100))',
    })
  })

  it('handles nested var() fallbacks', () => {
    // This might not work but let's test it
    expect(
      transformCss([['color', 'var(--primary, var(--fallback, red))']])
    ).toEqual({
      color: 'var(--primary, var(--fallback, red))',
    })
  })
})
