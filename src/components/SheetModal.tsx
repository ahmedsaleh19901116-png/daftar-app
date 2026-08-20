import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Pressable, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorBoundary } from './ErrorBoundary';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: string | number;
}

const DISMISS_GUARD_MS = 1000;

/**
 * Guards the backdrop against the Android race where the SAME physical touch that opened the
 * sheet (finger down on a FAB, held briefly, then lifted) gets its "up" event redelivered to the
 * freshly-mounted backdrop once it appears underneath the finger, reading as an instant dismiss.
 * `interactive` drives pointerEvents on the backdrop so it structurally can't receive ANY touch
 * during the window (children -- the sheet's own content -- still can), and `guardedClose` is a
 * belt-and-suspenders timestamp check for callers that don't use pointerEvents.
 */
function useDismissGuard(visible: boolean, onClose: () => void) {
  const openedAtRef = useRef(0);
  const prevVisibleRef = useRef(false);
  const [interactive, setInteractive] = useState(false);

  if (visible && !prevVisibleRef.current) {
    openedAtRef.current = Date.now();
  }
  prevVisibleRef.current = visible;

  useEffect(() => {
    if (!visible) {
      setInteractive(false);
      return;
    }
    const t = setTimeout(() => setInteractive(true), DISMISS_GUARD_MS);
    return () => clearTimeout(t);
  }, [visible]);

  const guardedClose = () => {
    if (Date.now() - openedAtRef.current < DISMISS_GUARD_MS) return;
    onClose();
  };

  return { interactive, guardedClose };
}

/** Not backed by native <Modal> any more, so the Android hardware/gesture back action needs its own handler. */
function useBackHandler(visible: boolean, onClose: () => void) {
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);
}

function resolveMaxHeight(maxHeight: string | number, windowHeight: number): number {
  if (typeof maxHeight === 'number') return maxHeight;
  const pct = parseFloat(maxHeight);
  const resolved = Number.isFinite(pct) && windowHeight > 0 ? windowHeight * (pct / 100) : 0;
  return resolved > 150 ? resolved : 600;
}

/**
 * Bottom sheet: rounded top corners (28px), tap backdrop to close. A diagnostic build with an
 * unrelated, dead-simple red box (state-driven, no sizing logic at all) proved this overlay
 * mechanism itself renders fine -- so the remaining bug had to be inside the card's own sizing.
 * Confirmed from that screenshot: only the card's drag-handle sliver was visible, pinned at the
 * very bottom -- the card WAS rendering, just collapsed to near-zero height. The cause is a classic
 * RN sizing deadlock: the card wrapper only had `maxHeight` (a cap, not a real size), and the
 * sheet content's <ScrollView style={{flex:1}}> needs a genuinely definite ancestor height to
 * resolve "fill available space" against -- under the old native <Modal> that height came for
 * free from Modal's own layout; this custom overlay never provided one, so the whole chain
 * resolved to content-based sizing with nothing to anchor it, collapsing to ~0.
 *
 * Fix: give the wrapper a real `height` (not maxHeight) and `flex: 1` on the inner Pressable, so
 * every descendant down to the ScrollView has a definite height to fill. Trade-off: sheets shorter
 * than their cap now show trailing blank space instead of shrinking to fit -- an acceptable cost
 * to actually render at all; can be revisited once confirmed working.
 */
export function SheetModal({ visible, onClose, children, maxHeight = '88%' }: Props) {
  const { colors, radius } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { interactive, guardedClose } = useDismissGuard(visible, onClose);
  const resolvedMaxHeight = resolveMaxHeight(maxHeight, windowHeight);
  useBackHandler(visible, guardedClose);

  if (!visible) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(20,20,43,0.45)', justifyContent: 'flex-end', paddingBottom: insets.bottom }}
        onPress={guardedClose}
        pointerEvents={interactive ? 'auto' : 'box-none'}
      >
        <View style={{ height: resolvedMaxHeight }}>
          <ErrorBoundary>
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{
                flex: 1, backgroundColor: colors.bg, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingTop: 10,
              }}
            >
              <View style={{ alignItems: 'center', paddingBottom: 8 }}>
                <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: colors.neutral[300] }} />
              </View>
              {children}
            </Pressable>
          </ErrorBoundary>
        </View>
      </Pressable>
    </View>
  );
}

interface CenterProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/** Centered modal dialog, e.g. the payout-order lottery. Same plain, non-animated approach as SheetModal. */
export function CenterModal({ visible, onClose, children }: CenterProps) {
  const { colors, radius } = useTheme();
  const { interactive, guardedClose } = useDismissGuard(visible, onClose);
  useBackHandler(visible, guardedClose);

  if (!visible) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(20,20,43,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        onPress={guardedClose}
        pointerEvents={interactive ? 'auto' : 'box-none'}
      >
        <ErrorBoundary>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ backgroundColor: colors.surface, borderRadius: radius.card, padding: 24, width: '100%', maxWidth: 340 }}>
            {children}
          </Pressable>
        </ErrorBoundary>
      </Pressable>
    </View>
  );
}
