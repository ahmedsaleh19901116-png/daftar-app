import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { categoryPalette } from '../theme/tokens';

export type IconKey =
  | 'food' | 'transport' | 'bills' | 'shopping' | 'health' | 'salary' | 'laptop' | 'gift' | 'tag' | 'card'
  | 'basket' | 'home' | 'bolt' | 'wrench' | 'pill' | 'star' | 'cap' | 'heart' | 'controller' | 'repeat' | 'fuel' | 'coindown';

// Ported 1:1 from Icon.dc.html's inline SVG paths (viewBox 0 0 20 20).
function Glyph({ icon, fg, bg, size }: { icon: string; fg: string; bg: string; size: number }) {
  switch (icon) {
    case 'food':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Path d="M4 7a1 1 0 011-1h8a1 1 0 011 1v1a4 4 0 01-4 4H9a4 4 0 01-4-4V7z" />
          <Rect x={4} y={14} width={10} height={2} rx={1} />
          <Rect x={14.5} y={7} width={2.5} height={4} rx={1.2} />
        </Svg>
      );
    case 'transport':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Path d="M3 12l1.5-4.5A2 2 0 016.4 6h7.2a2 2 0 011.9 1.5L17 12v3a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H6v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-3z" />
          <Circle cx={6.5} cy={14.5} r={1.4} fill={bg} />
          <Circle cx={13.5} cy={14.5} r={1.4} fill={bg} />
        </Svg>
      );
    case 'bills':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Rect x={4} y={2} width={12} height={16} rx={2} />
          <Rect x={6.5} y={6} width={7} height={1.6} rx={0.8} fill={bg} />
          <Rect x={6.5} y={9.2} width={7} height={1.6} rx={0.8} fill={bg} />
          <Rect x={6.5} y={12.4} width={4} height={1.6} rx={0.8} fill={bg} />
        </Svg>
      );
    case 'shopping':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Path d="M5 6h10l-1 11a1 1 0 01-1 1H7a1 1 0 01-1-1L5 6z" />
          <Path d="M7 6V5a3 3 0 016 0v1" stroke={fg} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </Svg>
      );
    case 'health':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Circle cx={10} cy={10} r={8} />
          <Rect x={8.7} y={5.5} width={2.6} height={9} rx={1} fill={bg} />
          <Rect x={5.5} y={8.7} width={9} height={2.6} rx={1} fill={bg} />
        </Svg>
      );
    case 'salary':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Rect x={2} y={5} width={16} height={10} rx={2} />
          <Circle cx={10} cy={10} r={2.4} fill={bg} />
        </Svg>
      );
    case 'laptop':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Rect x={3} y={4} width={14} height={9} rx={1.5} />
          <Path d="M1.5 15.5h17l-1 1.3a1.5 1.5 0 01-1.2.7H3.7a1.5 1.5 0 01-1.2-.7l-1-1.3z" />
        </Svg>
      );
    case 'card':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Rect x={2} y={5} width={16} height={11} rx={2} />
          <Rect x={2} y={7.8} width={16} height={2.4} fill={bg} />
          <Rect x={4} y={12.8} width={5} height={1.6} rx={0.8} fill={bg} />
        </Svg>
      );
    case 'gift':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Rect x={3} y={8} width={14} height={9} rx={1.5} />
          <Rect x={2.5} y={6} width={15} height={3} rx={1} />
          <Rect x={9} y={6} width={2} height={11} />
          <Path d="M6.5 6c-1.4 0-2.5-1-2.5-2s1.1-1.7 2.5-1c1.1.6 2 1.8 3 3z" />
          <Path d="M13.5 6c1.4 0 2.5-1 2.5-2s-1.1-1.7-2.5-1c-1.1.6-2 1.8-3 3z" />
        </Svg>
      );
    case 'basket':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Path d="M3.5 8h13l-1.3 8.2a1.5 1.5 0 01-1.5 1.3H6.3a1.5 1.5 0 01-1.5-1.3L3.5 8z" />
          <Path d="M6.5 8L8 3.5M13.5 8L12 3.5" stroke={fg} strokeWidth={1.6} fill="none" strokeLinecap="round" />
          <Rect x={6} y={10.5} width={8} height={1.8} rx={0.9} fill={bg} />
        </Svg>
      );
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Path d="M2.5 10.5L10 3.5l7.5 7" stroke={fg} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M4.5 9v7a1 1 0 001 1h9a1 1 0 001-1V9" />
          <Rect x={8.3} y={12.5} width={3.4} height={4.5} fill={bg} />
        </Svg>
      );
    case 'bolt':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Path d="M11 2L4 12h5l-1 6 8-11h-5l1-5z" />
        </Svg>
      );
    case 'wrench':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <Path d="M13.5 3.5a4 4 0 00-5 5L3 14l3 3 5.5-5.5a4 4 0 005-5l-2.8 2.8-2-2 2.8-2.8z" fill={fg} />
        </Svg>
      );
    case 'pill':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <Rect x={2.5} y={7.5} width={15} height={6} rx={3} fill={bg} stroke={fg} strokeWidth={1.6} />
          <Line x1={10} y1={7.5} x2={10} y2={13.5} stroke={fg} strokeWidth={1.6} />
          <Rect x={10} y={7.5} width={7.5} height={6} rx={3} fill={fg} />
        </Svg>
      );
    case 'star':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Path d="M10 2.3l2.3 5 5.4.6-4 3.8 1 5.4-4.7-2.6-4.7 2.6 1-5.4-4-3.8 5.4-.6z" />
        </Svg>
      );
    case 'cap':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Path d="M10 3.5L18 7l-8 3.5L2 7l8-3.5z" />
          <Path d="M5.5 9v3.5c0 1.4 2 2.5 4.5 2.5s4.5-1.1 4.5-2.5V9" stroke={fg} strokeWidth={1.6} fill="none" strokeLinecap="round" />
          <Line x1={17.5} y1={7.5} x2={17.5} y2={13} stroke={fg} strokeWidth={1.6} strokeLinecap="round" />
        </Svg>
      );
    case 'heart':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Path d="M10 17s-6.5-4-6.5-8.8A3.7 3.7 0 0110 5.7a3.7 3.7 0 016.5 2.5C16.5 13 10 17 10 17z" />
        </Svg>
      );
    case 'controller':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <Path d="M5.5 7h9a3.3 3.3 0 013.2 4.1l-.5 2a2 2 0 01-3.4 1L12 12H8l-1.8 2.1a2 2 0 01-3.4-1l-.5-2A3.3 3.3 0 015.5 7z" fill={fg} />
          <Line x1={6.5} y1={10} x2={6.5} y2={11.5} stroke={bg} strokeWidth={1.4} strokeLinecap="round" />
          <Line x1={5.8} y1={10.8} x2={7.3} y2={10.8} stroke={bg} strokeWidth={1.4} strokeLinecap="round" />
          <Circle cx={13.5} cy={10.3} r={0.9} fill={bg} />
          <Circle cx={11.8} cy={11.6} r={0.9} fill={bg} />
        </Svg>
      );
    case 'repeat':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={fg} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M4 9a6 6 0 019.5-4.8M16 4v4h-4" />
          <Path d="M16 11a6 6 0 01-9.5 4.8M4 16v-4h4" />
        </Svg>
      );
    case 'fuel':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <Rect x={3} y={4} width={8} height={13} rx={1} fill={fg} />
          <Rect x={5} y={6} width={4} height={4} fill={bg} />
          <Path d="M11 8h1.5a1.5 1.5 0 011.5 1.5V13a1.2 1.2 0 002.4 0V8.2a1.2 1.2 0 00-.35-.85L14.5 5.7" stroke={fg} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'coindown':
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <Circle cx={10} cy={8} r={6} fill={fg} />
          <Path d="M10 5v6M7.3 8.5L10 11l2.7-2.5" stroke={bg} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill={fg}>
          <Path d="M3 3h6.5a1 1 0 01.7.3l6.5 6.5a1 1 0 010 1.4l-6.5 6.5a1 1 0 01-1.4 0L2.3 11.2a1 1 0 01-.3-.7V4a1 1 0 011-1z" />
          <Circle cx={6.5} cy={6.5} r={1.3} fill={bg} />
        </Svg>
      );
  }
}

export function CategoryIcon({ icon, size = 18, tile = true }: { icon: string; size?: number; tile?: boolean }) {
  const p = categoryPalette[icon] || categoryPalette.tag;
  const glyphSize = tile ? Math.round(size * 0.58) : size;
  if (!tile) return <Glyph icon={icon} fg={p.fg} bg={p.bg} size={glyphSize} />;
  return (
    <View
      style={{
        width: size, height: size, borderRadius: Math.round(size * 0.32), backgroundColor: p.bg,
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Glyph icon={icon} fg={p.fg} bg={p.bg} size={glyphSize} />
    </View>
  );
}
