import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'تذكيرات دفتر',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

type ReminderType = 'debt' | 'installment' | 'task' | 'sadaqah';

interface ScheduleReminderParams {
  id: string;
  type: ReminderType;
  title: string;
  body: string;
  dueDate: Date;
  reminderOffsetHours?: number;
}

export async function scheduleReminder({
  id,
  type,
  title,
  body,
  dueDate,
  reminderOffsetHours = 0,
}: ScheduleReminderParams): Promise<string | null> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return null;

  const triggerDate = new Date(dueDate);
  if (reminderOffsetHours > 0) {
    triggerDate.setHours(triggerDate.getHours() - reminderOffsetHours);
  } else {
    triggerDate.setHours(9, 0, 0, 0);
  }
  if (triggerDate.getTime() <= Date.now()) return null;

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: { title, body, data: { itemId: id, type } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
  });

  return notificationId;
}

export async function cancelReminder(notificationId: string | null | undefined) {
  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}
