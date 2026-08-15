import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  value: boolean;
  onChange: (v: boolean) => void;
}

/** Pill switch, 42x24, thumb slides between left/right, track fills accent when on. */
export function ToggleSwitch({ value, onChange }: Props) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: value ? 1 : 0, duration: 160, useNativeDriver: false }).start();
  }, [value, anim]);

  const trackColor = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.neutral[300], colors.accent] });
  const thumbLeft = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 20] });

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => onChange(!value)}>
      <Animated.View style={{ width: 42, height: 24, borderRadius: 12, backgroundColor: trackColor, justifyContent: 'center' }}>
        <Animated.View
          style={{
            position: 'absolute', left: thumbLeft, top: 2, width: 20, height: 20, borderRadius: 10,
            backgroundColor: '#ffffff', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 2,
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
