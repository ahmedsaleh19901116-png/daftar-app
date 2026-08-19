import React from 'react';
import { ScrollView, View } from 'react-native';
import { AppText } from './AppText';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render crashes inside a sheet/modal and shows the actual error instead of leaving a
 * dim backdrop with nothing on it -- turns an invisible on-device-only failure into something
 * that can be screenshotted and diagnosed.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <View style={{ padding: 20, gap: 10, backgroundColor: '#fff', borderRadius: 20 }}>
          <AppText weight="bold" size={15} color="#c23566" style={{ textAlign: 'right' }}>⚠ صار خطأ بهذا الجزء</AppText>
          <ScrollView style={{ maxHeight: 300 }}>
            <AppText size={11} style={{ textAlign: 'left' }} selectable>
              {String(this.state.error.message)}
              {'\n\n'}
              {String(this.state.error.stack || '')}
            </AppText>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}
