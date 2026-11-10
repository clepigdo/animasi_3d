export const PALETTE = {
  // Primer
  teal: "#72BDB7",
  cream: "#F2DEBB",
  coral: "#EB977C",
  mustard: "#E5BA67",
  navy: "#52617D",
  // Sekunder
  softBlue: "#A9C7E0",
  warmGrey: "#B9AFA3",
  paleMint: "#CFE8DC",
  mutedLavender: "#B9A9D0",
  // Status (pakai seperlunya)
  statusGreen: "#6FBF8B",
  statusRed: "#D9695F",
  // Turunan untuk dunia clay (tetap dalam keluarga warna pastel hangat)
  street: "#8E97AB",
  skin: "#F0C4A0",
  hair: "#5A4A44",
  trunk: "#A9805F",
  base: "#D9C29A",
} as const;

export type PaletteKey = keyof typeof PALETTE;
