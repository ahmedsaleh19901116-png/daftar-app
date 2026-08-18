import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, ScreenHeader, ToolsModal, ToolsTab, TransferDialog } from '../components';
import { useTheme } from '../theme/ThemeContext';
import { RootScreenProps } from '../navigation/types';

export function TransfersScreen({ navigation }: RootScreenProps<'Transfers'>) {
  const { colors } = useTheme();
  const [showTools, setShowTools] = useState(false);
  const [toolsTab, setToolsTab] = useState<ToolsTab>('currency');
  const [showTransfer, setShowTransfer] = useState(false);

  const openTools = (tab: ToolsTab) => { setToolsTab(tab); setShowTools(true); };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenHeader title="التحويل" onBack={() => navigation.goBack()} />
      <View style={{ padding: 20, gap: 8 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <ToolTile label="محول العملات" bg="#e3ddfb" fg="#5b3fc4" onPress={() => openTools('currency')}>
            <Svg width={26} height={26} viewBox="0 0 20 20" fill="none" stroke="#5b3fc4" strokeWidth={1.8}>
              <Circle cx={7} cy={10} r={5} />
              <Circle cx={13} cy={10} r={5} />
            </Svg>
          </ToolTile>
          <ToolTile label="محول الوحدات" bg="#cdeafc" fg="#1f6fb0" onPress={() => openTools('unit')}>
            <Svg width={26} height={26} viewBox="0 0 20 20" fill="none" stroke="#1f6fb0" strokeWidth={1.8} strokeLinecap="round">
              <Rect x={3} y={7} width={14} height={6} rx={1} />
              <Line x1={6} y1={7} x2={6} y2={4} />
              <Line x1={14} y1={13} x2={14} y2={16} />
            </Svg>
          </ToolTile>
          <ToolTile label="حاسبة" bg="#ffe0d6" fg="#d9542a" onPress={() => openTools('calc')}>
            <Svg width={26} height={26} viewBox="0 0 20 20" fill="none" stroke="#d9542a" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <Rect x={4} y={2} width={12} height={16} rx={1.5} />
              <Line x1={7} y1={6} x2={13} y2={6} />
              <Circle cx={7} cy={10.5} r={0.8} fill="#d9542a" />
              <Circle cx={10} cy={10.5} r={0.8} fill="#d9542a" />
              <Circle cx={13} cy={10.5} r={0.8} fill="#d9542a" />
              <Circle cx={7} cy={13.5} r={0.8} fill="#d9542a" />
              <Circle cx={10} cy={13.5} r={0.8} fill="#d9542a" />
              <Circle cx={13} cy={13.5} r={0.8} fill="#d9542a" />
            </Svg>
          </ToolTile>
        </View>

        <Button label="تحويل بين الحسابات" variant="secondary" block onPress={() => setShowTransfer(true)} style={{ marginTop: 10 }} />
      </View>

      <ToolsModal visible={showTools} initialTab={toolsTab} onClose={() => setShowTools(false)} />
      <TransferDialog visible={showTransfer} onClose={() => setShowTransfer(false)} />
    </SafeAreaView>
  );
}

function ToolTile({ label, bg, fg, onPress, children }: { label: string; bg: string; fg: string; onPress: () => void; children: React.ReactNode }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flex: 1, borderRadius: 18, backgroundColor: bg, paddingVertical: 12, paddingHorizontal: 4, alignItems: 'center', gap: 6 }}
    >
      {children}
      <AppText size={10} weight="semiBold" color={fg} style={{ textAlign: 'center' }}>{label}</AppText>
    </TouchableOpacity>
  );
}
