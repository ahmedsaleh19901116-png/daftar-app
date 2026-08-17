import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { formatDate, today } from '../data/helpers';
import { useTheme } from '../theme/ThemeContext';
import { AppText } from './AppText';

function toYMD(d: Date): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function parseYMD(v: string): Date {
  const [y, m, d] = v.split('-').map(Number);
  if (y && m && d) return new Date(y, m - 1, d);
  return new Date();
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minimumDate?: string;
}

/** Tap-to-open native date picker, replacing free-text YYYY-MM-DD entry. */
export function DateField({ value, onChange, placeholder = 'اختر التاريخ', minimumDate }: Props) {
  const { colors, radius } = useTheme();
  const [show, setShow] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{ backgroundColor: colors.neutral[200], borderRadius: radius.sm, padding: 12 }}
      >
        <AppText size={14} style={{ textAlign: 'right' }} opacity={value ? 1 : 0.5}>
          {value ? formatDate(value) : placeholder}
        </AppText>
      </TouchableOpacity>
      {show ? (
        <DateTimePicker
          value={value ? parseYMD(value) : parseYMD(today())}
          mode="date"
          display="default"
          minimumDate={minimumDate ? parseYMD(minimumDate) : undefined}
          onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
            setShow(false);
            if (event.type === 'set' && selectedDate) {
              onChange(toYMD(selectedDate));
            }
          }}
        />
      ) : null}
    </View>
  );
}
