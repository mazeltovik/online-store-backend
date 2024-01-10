type Color = {
  clr_ff0000: number;
  clr_00ff00: number;
  clr_0000ff: number;
  clr_000: number;
  clr_ffb900: number;
};
export default function filterColors(colors: Color) {
  return Object.fromEntries(
    Object.entries(colors).filter(([_, value]) => {
      return value > 0;
    }),
  );
}
