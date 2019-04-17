import { THEMES } from '..';

export default (palette) => {
  return (
    {
      name: THEMES.medium,

      colors: {
        base: palette.productBlue,
        primary: palette.productBlueShade(3),
        secondary: palette.productBlueShade(23),
        tertiary: palette.productBlueShade(43),
        whiteMix: 'rgba(0, 119, 200, 0.1)' /* ToDo: Shouldn't be opaque */
      }
    }
  );
};
