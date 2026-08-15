import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { AppText } from './AppText';

interface Option {
  key: string;
  label: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (key: string) => void;
}

export function SegmentedControl({ options, value, onChange }: Props) {
  const { colors, radius } = useTheme();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.neutral[200], borderRadius: radius.pill, padding: 4 }}>
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <TouchableOpacity
            key={opt.key}
            onPress={() => onChange(opt.key)}
            activeOpacity={0.8}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: radius.pill,
              alignItems: 'center',
              backgroundColor: active ? colors.accent : 'transparent',
            }}
          >
            <AppText weight={active ? 'bold' : 'medium'} size={13} color={active ? '#ffffff' : colors.text} opacity={active ? 1 : 0.6}>
              {opt.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
