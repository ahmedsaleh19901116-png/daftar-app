import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Button, Card, EmptyState, ProgressBar, ScreenHeader, SegmentedControl, Tag } from '../components';
import { IconCheck } from '../components/Icons';
import { allTasksMerged, MergedTask, taskProgress } from '../data/selectors';
import { useDispatch, useStoreState } from '../data/store';
import { dateWithMonth, today } from '../data/helpers';
import { useTheme } from '../theme/ThemeContext';
import { rowDir } from '../theme/rtl';
import { RootStackParamList } from '../navigation/types';
import { TaskPriority } from '../data/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PRIORITY_LABEL: Record<TaskPriority, string> = { high: 'أولوية عالية', medium: 'أولوية متوسطة', low: 'أولوية منخفضة' };
const PRIORITY_VARIANT: Record<TaskPriority, 'outline' | 'accent' | 'neutral'> = { high: 'outline', medium: 'accent', low: 'neutral' };

export function TasksScreen() {
  const navigation = useNavigation<Nav>();
  const state = useStoreState();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(today());
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const merged = allTasksMerged(state);
  const TODAY = today();
  const todayTasks = merged.filter((t) => t.date === TODAY);
  const upcomingTasks = merged.filter((t) => t.date !== TODAY).sort((a, b) => a.date.localeCompare(b.date));
  const progress = taskProgress(state);

  const onToggle = (task: MergedTask) => {
    if (task.source && !task.done) {
      if (task.source === 'installment' && task.linkedEntityId) { navigation.navigate('InstallmentDetail', { planId: task.linkedEntityId }); return; }
      if (task.source === 'debt') { navigation.navigate('Debts'); return; }
      if (task.source === 'goal') { navigation.navigate('Goals'); return; }
      if (task.source === 'commitment') { dispatch({ type: 'OPEN_QUICK_LOG', task }); return; }
    }
    if (task.source) { dispatch({ type: 'TOGGLE_AUTO_TASK', id: String(task.id) }); return; }
    dispatch({ type: 'TOGGLE_MANUAL_TASK', id: task.id });
  };

  const submit = () => {
    if (!title) return;
    dispatch({ type: 'ADD_TASK', title, date: date || TODAY, priority });
    setTitle('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScreenHeader title="تخطيط اليوم" subtitle={dateWithMonth(TODAY)} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 40, gap: 16 }}>
        <Card>
          <AppText weight="semiBold" size={13} style={{ textAlign: 'right', marginBottom: 8 }}>
            {progress.done} من {progress.total} مهام اليوم منتهية
          </AppText>
          <ProgressBar pct={progress.pct} />
        </Card>

        <Card style={{ gap: 10 }}>
          <TextInput value={title} onChangeText={setTitle} placeholder="عنوان المهمة" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors)} />
          <TextInput value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor={colors.neutral[500]} style={inputStyle(colors)} />
          <SegmentedControl
            options={[{ key: 'low', label: 'منخفضة' }, { key: 'medium', label: 'متوسطة' }, { key: 'high', label: 'عالية' }]}
            value={priority}
            onChange={(p) => setPriority(p as TaskPriority)}
          />
          <Button label="إضافة مهمة" onPress={submit} />
        </Card>

        <TaskList title="اليوم" tasks={todayTasks} onToggle={onToggle} showDate={false} />
        <TaskList title="قادم" tasks={upcomingTasks} onToggle={onToggle} showDate />
      </ScrollView>
    </SafeAreaView>
  );
}

function TaskList({ title, tasks, onToggle, showDate }: { title: string; tasks: MergedTask[]; onToggle: (t: MergedTask) => void; showDate: boolean }) {
  const { colors, radius, shadow } = useTheme();
  return (
    <View>
      <AppText weight="bold" size={14} style={{ textAlign: 'right', marginBottom: 10 }}>{title}</AppText>
      {tasks.length === 0 ? <EmptyState text="لا توجد مهام" /> : (
        <View style={{ gap: 8 }}>
          {tasks.map((t) => (
            <View key={String(t.id)} style={[{ flexDirection: rowDir('ar'), alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: radius.card, padding: 12 }, shadow.sm]}>
              <TouchableOpacity
                onPress={() => onToggle(t)}
                style={{
                  width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: t.done ? colors.accent : 'transparent', borderWidth: t.done ? 0 : 1.5, borderColor: colors.neutral[400],
                }}
              >
                {t.done ? <IconCheck size={13} /> : null}
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <AppText
                  size={13} weight="medium"
                  style={{ textAlign: 'right', textDecorationLine: t.done ? 'line-through' : 'none', opacity: t.done ? 0.5 : 1 }}
                >
                  {t.sourceEmoji ? t.sourceEmoji + ' ' : ''}{t.title}
                </AppText>
                {showDate ? <AppText size={10.5} opacity={0.5} style={{ textAlign: 'right', marginTop: 2 }}>{dateWithMonth(t.date)}</AppText> : null}
              </View>
              <Tag label={PRIORITY_LABEL[t.priority]} variant={PRIORITY_VARIANT[t.priority]} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function inputStyle(colors: any) {
  return { backgroundColor: colors.neutral[200], borderRadius: 12, padding: 12, textAlign: 'right' as const };
}
