import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: string | number;
}

/** Bottom sheet: slides up from the bottom, rounded top corners (28px), tap backdrop to close. */
export function SheetModal({ visible, onClose, children, maxHeight = '88%' }: Props) {
  const { colors, radius } = useTheme();
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(20,20,43,0.45)', justifyContent: 'flex-end' }} onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: colors.bg, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg,
            paddingTop: 10, maxHeight: maxHeight as any,
          }}
        >
          <View style={{ alignItems: 'center', paddingBottom: 8 }}>
            <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: colors.neutral[300] }} />
          </View>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface CenterProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/** Centered modal dialog, e.g. the payout-order lottery. */
export function CenterModal({ visible, onClose, children }: CenterProps) {
  const { colors, radius } = useTheme();
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(20,20,43,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 }} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: colors.surface, borderRadius: radius.card, padding: 24, width: '100%', maxWidth: 340 }}>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
