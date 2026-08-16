import React from 'react';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';

// Chrome/nav icon set: bold rounded-stroke line icons (stroke-width ~2.2, round caps/joins),
// matching the handoff's icon style for navigation, actions, and toggles.

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const base = (size = 20) => ({ width: size, height: size, viewBox: '0 0 24 24' });

export function IconBack({ size = 20, color = '#14142b', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M15 5l-7 7 7 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
export function IconClose({ size = 20, color = '#14142b', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}
export function IconPlus({ size = 20, color = '#14142b', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}
export function IconEdit({ size = 18, color = '#14142b', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
export function IconTrash({ size = 18, color = '#14142b', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0-1 12a1 1 0 01-1 1H9a1 1 0 01-1-1L7 7h10z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
export function IconGear({ size = 20, color = '#14142b', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Circle cx={12} cy={12} r={3.2} stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.6 1.5M17.5 16l1.6 1.5M3.5 12h2.2M18.3 12h2.2M4.9 17.5l1.6-1.5M17.5 8l1.6-1.5"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
    </Svg>
  );
}
export function IconEye({ size = 20, color = '#ffffff', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
      <Circle cx={12} cy={12} r={2.6} stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}
export function IconEyeOff({ size = 20, color = '#ffffff', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M3 3l18 18M10.6 10.7a2.6 2.6 0 003.7 3.6M6.2 6.6C4 8.1 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.5 4.4-1.2M9.9 5.2A9.7 9.7 0 0112 5c6.4 0 10 7 10 7a15.6 15.6 0 01-3 3.9"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
export function IconLightbulb({ size = 18, color = '#4632b0', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.4 1 1.1 1 1.9v.2h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0012 3z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
export function IconCheck({ size = 14, color = '#ffffff', strokeWidth = 2.4 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Polyline points="5 12.5 10 17 19 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}
export function IconRefresh({ size = 16, color = '#4632b0', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M4 4v5h5M20 20v-5h-5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5.5 15a7 7 0 0012.6 1.5M18.5 9A7 7 0 005.9 7.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}
export function IconCompass({ size = 40, color = '#ffffff', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M15 9l-2 5-4 1 2-5 4-1z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" fill={color} fillOpacity={0.2} />
    </Svg>
  );
}
export function IconTrendUp({ size = 12, color = '#1f8a4c', strokeWidth = 2.4 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M4 16l6-6 4 4 6-8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15 6h5v5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
export function IconTrendDown({ size = 12, color = '#c23566', strokeWidth = 2.4 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M4 8l6 6 4-4 6 8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15 18h5v-5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
export function IconHome({ size = 20, color = '#14142b', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M4 11l8-7 8 7M6 9.5V20a1 1 0 001 1h3v-6h4v6h3a1 1 0 001-1V9.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
export function IconChart({ size = 20, color = '#14142b', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
export function IconWallet({ size = 20, color = '#14142b', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M3 7a2 2 0 012-2h13a1 1 0 011 1v2M3 7v11a2 2 0 002 2h14a1 1 0 001-1v-8a1 1 0 00-1-1h-4a2 2 0 100 4h4M3 7l2-3h9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
export function IconList({ size = 20, color = '#14142b', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M8 6h13M8 12h13M8 18h13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx={3.5} cy={6} r={1.4} fill={color} />
      <Circle cx={3.5} cy={12} r={1.4} fill={color} />
      <Circle cx={3.5} cy={18} r={1.4} fill={color} />
    </Svg>
  );
}
export function IconUser({ size = 20, color = '#14142b', strokeWidth = 2.2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Circle cx={12} cy={8} r={3.4} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}
export function IconLock({ size = 12, color = '#8b82b8', strokeWidth = 2 }: IconProps) {
  return (
    <Svg {...base(size)} fill="none">
      <Path d="M6 11V8a6 6 0 1112 0v3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M5 11h14v9a1 1 0 01-1 1H6a1 1 0 01-1-1v-9z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </Svg>
  );
}
