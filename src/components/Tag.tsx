import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AppText } from './AppText';

interface Props {
  label: string;
  variant?: 'accent' | 'outline' | 'neutral';
  onPress?: () => void;
  icon?: React.ReactNode;
}

export function Tag({ label, variant = 'outline', onPress, icon }: Props) {
  const { colors, radius } = useTheme();
  const bg = variant === 'accent' ? colors.accentTint : variant === 'neutral' ? colors.neutral[200] : 'transparent';
  const textColor = variant === 'accent' ? colors.accentRamp[700] : colors.text;
  const borderColor = variant === 'outline' ? colors.divider : 'transparent';

  const Comp: any = onPress ? TouchableOpacity : (props: any) => <>{props.children}</>;
  return (
    <Comp
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: bg, borderColor, borderWidth: variant === 'outline' ? 1 : 0,
        paddingVertical: 7, paddingHorizontal: 13, borderRadius: radius.pill,
      }}
    >
      {icon}
      <AppText weight="semiBold" size={12} color={textColor}>{label}</AppText>
    </Comp>
  );
}
