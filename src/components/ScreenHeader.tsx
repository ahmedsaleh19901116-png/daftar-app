import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { AppText } from './AppText';
import { IconBack } from './Icons';

interface Props {
  title: string;
  onBack?: () => void;
  lang?: 'ar' | 'en';
  right?: React.ReactNode;
  subtitle?: string;
}

export function ScreenHeader({ title, onBack, lang = 'ar', right, subtitle }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14 }}>
      <View style={{ flexDirection: rowDir(lang), alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: rowDir(lang), alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          {onBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <IconBack size={18} color={colors.accentRamp[700]} />
            </TouchableOpacity>
          ) : null}
          <View style={{ flexShrink: 1, minWidth: 0 }}>
            <AppText weight="bold" size={22} numberOfLines={2}>{title}</AppText>
            {subtitle ? <AppText size={12} opacity={0.55} style={{ marginTop: 2 }} numberOfLines={2}>{subtitle}</AppText> : null}
          </View>
        </View>
        {right}
      </View>
    </View>
  );
}
