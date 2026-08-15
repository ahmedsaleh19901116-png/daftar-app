// Design tokens ported from the "دفتر" (Daftar) design handoff README.
// Violet fintech palette. Colors/typography/spacing/radii/shadows are final per the handoff.

export const accentRamp = {
  100: '#eeecfb',
  200: '#d8d3f5',
  300: '#b7aeec',
  400: '#9285e0',
  500: '#6c5ce7',
  600: '#5943d3',
  700: '#4632b0',
  800: '#33248a',
  900: '#211862',
};

export const neutralRamp = {
  100: '#fbfbfe',
  200: '#f0eef9',
  300: '#e2dff2',
  400: '#c9c4e3',
  500: '#a9a2cf',
  600: '#8b82b8',
  700: '#6b6291',
  800: '#2f2b4d',
  900: '#1c1a33',
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 28,
  card: 22,
  hero: 24,
  pill: 999,
};

export const shadow = {
  sm: {
    shadowColor: '#1f1850',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#1f1850',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 6,
  },
  lg: {
    shadowColor: '#1f1850',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.18,
    shadowRadius: 44,
    elevation: 12,
  },
} as const;

export const fontFamily = {
  regular: 'Cairo_400Regular',
  medium: 'Cairo_500Medium',
  semiBold: 'Cairo_600SemiBold',
  bold: 'Cairo_700Bold',
  extraBold: 'Cairo_800ExtraBold',
};

export const fontFallback = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
  extraBold: 'System',
};

export type ThemeColors = {
  bg: string;
  surface: string;
  text: string;
  divider: string;
  accent: string;
  accentTint: string;
  positive: string; // income text
  negative: string; // expense text (deliberately not red)
  neutral: typeof neutralRamp;
  accentRamp: typeof accentRamp;
};

export const lightColors: ThemeColors = {
  bg: '#f6f5fb',
  surface: '#ffffff',
  text: '#14142b',
  divider: 'rgba(20,20,43,0.1)',
  accent: accentRamp[500],
  accentTint: accentRamp[100],
  positive: accentRamp[700],
  negative: '#14142b',
  neutral: neutralRamp,
  accentRamp,
};

export const darkColors: ThemeColors = {
  bg: '#1c1a33',
  surface: '#211f38',
  text: '#f0eefb',
  divider: 'rgba(240,238,251,0.14)',
  accent: accentRamp[500],
  accentTint: accentRamp[100],
  positive: '#b7aeec',
  negative: '#f0eefb',
  neutral: { ...neutralRamp, 200: '#2b2847' },
  accentRamp,
};

// Expense category *group* colors (تكلفة معيشة يومية، سكن، صحة، عائلة، التزامات، تسوق، أخرى) — each
// group has one unified duotone color used everywhere a category in it appears (add-sheet
// accordion, analytics filters/bars, budget rows). Kept as its own export because a handful of
// UI spots (the accordion header pills) need the group's color independent of any one icon.
export const expenseGroups: Record<string, { name: string; bg: string; fg: string }> = {
  daily: { name: 'المعيشة اليومية', bg: '#d7f5df', fg: '#1f8a4c' },
  housing: { name: 'السكن والخدمات', bg: '#cdeafc', fg: '#1f6fb0' },
  health: { name: 'الصحة', bg: '#ffe0d6', fg: '#d9542a' },
  family: { name: 'العائلة والمناسبات', bg: '#e3ddfb', fg: '#5b3fc4' },
  commitments: { name: 'الالتزامات المالية', bg: '#ffe8b3', fg: '#b5790a' },
  shopping: { name: 'التسوق والترفيه', bg: '#fff3b0', fg: '#a67c00' },
  other: { name: 'أخرى', bg: '#ececf2', fg: '#5b5b66' },
};

// Category tile colors (duotone: pastel bg + darker icon of same hue), keyed by icon glyph.
// Expense-category icons are colored to match their EXPENSE_GROUPS theme (each icon key maps to
// exactly one group in practice); income-category and chrome icons keep their own flat color.
export const categoryPalette: Record<string, { bg: string; fg: string }> = {
  // daily
  basket: expenseGroups.daily, food: expenseGroups.daily, transport: expenseGroups.daily,
  fuel: expenseGroups.daily, laptop: expenseGroups.daily,
  // housing
  home: expenseGroups.housing, bills: expenseGroups.housing, bolt: expenseGroups.housing, wrench: expenseGroups.housing,
  // health
  pill: expenseGroups.health, health: expenseGroups.health,
  // family
  star: expenseGroups.family, cap: expenseGroups.family, gift: expenseGroups.family,
  // commitments
  card: expenseGroups.commitments, heart: expenseGroups.commitments,
  // shopping
  shopping: expenseGroups.shopping, controller: expenseGroups.shopping, repeat: expenseGroups.shopping,
  // other / chrome
  tag: expenseGroups.other,
  // income-only icons (no group system)
  salary: { bg: '#e3ddfb', fg: '#5b3fc4' },
  coindown: { bg: '#d7f5df', fg: '#1f8a4c' },
};

export const gradients = {
  balanceHero: ['#c9c2f0', '#6c5ce7'],
  brand: ['#9285e0', '#6c5ce7'],
  charity: ['#d7f5df', '#bfe8ce'],
};
