import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';

export function EmptyState({ text }: { text: string }) {
  return (
    <View style={{ paddingVertical: 32, alignItems: 'center' }}>
      <AppText size={13} opacity={0.5} style={{ textAlign: 'center' }}>{text}</AppText>
    </View>
  );
}
