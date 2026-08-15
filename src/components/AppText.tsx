import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontFamily } from '../theme/tokens';

type Weight = 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold';

interface Props extends TextProps {
  weight?: Weight;
  size?: number;
  color?: string;
  opacity?: number;
}

/** Cairo-family text component. Falls back gracefully if fonts haven't finished loading. */
export function AppText({ weight = 'regular', size = 14, color, opacity, style, children, ...rest }: Props) {
  const { colors } = useTheme();
  return (
    <Text
      style={[
        { fontFamily: fontFamily[weight], fontSize: size, color: color ?? colors.text, opacity: opacity ?? 1 },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
