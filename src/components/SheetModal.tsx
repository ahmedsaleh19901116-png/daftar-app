import React, { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Pressable, useWindowDimensions, View } from 'react-native';
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
 * Screen-recording evidence on this app showed the dismiss landing 300-650ms after open -- close
 * enough to a normal tap's down-to-up duration to confirm this is the same gesture, not a new one.
 *
 * Two layers, not one: `interactive` drives pointerEvents on the backdrop so it structurally can't
 * receive ANY touch during the window (not just filter one in a callback -- avoids any additional
 * race between when React commits this state and when the native touch responder is wired up),
 * and `guardedClose` is a belt-and-suspenders timestamp check for callers that don't use it.
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
 * Built as a plain absolutely-positioned overlay instead of React Native's native <Modal> --
 * Modal opens a separate OS-level window on Android, and its built-in slide animation has known
 * OEM-specific bugs where the transition never completes (the window stays translated off-screen
 * forever: dim backdrop paints immediately, but the card that was supposed to slide up never
 * arrives). This reuses the same absolute-overlay pattern App.tsx's PIN lock screen already uses
 * successfully, driving the slide with a plain Animated.Value instead of relying on the native
 * Modal window's own transition.
 */
function useSlideIn(visible: boolean) {
  const translateY = useRef(new Animated.Value(1)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(translateY, { toValue: 0, duration: 240, useNativeDriver: true }).start();
    } else {
      Animated.timing(translateY, { toValue: 1, duration: 200, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible]);

  return { mounted, translateY };
}

/** Bottom sheet: slides up from the bottom, rounded top corners (28px), tap backdrop to close. */
export function SheetModal({ visible, onClose, children, maxHeight = '88%' }: Props) {
  const { colors, radius } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const { interactive, guardedClose } = useDismissGuard(visible, onClose);
  const resolvedMaxHeight = resolveMaxHeight(maxHeight, windowHeight);
  const { mounted, translateY } = useSlideIn(visible);
  useBackHandler(visible, guardedClose);

  if (!mounted) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(20,20,43,0.45)', justifyContent: 'flex-end' }}
        onPress={guardedClose}
        pointerEvents={interactive ? 'auto' : 'box-none'}
      >
        <Animated.View
          style={{
            maxHeight: resolvedMaxHeight,
            transform: [{ translateY: translateY.interpolate({ inputRange: [0, 1], outputRange: [0, resolvedMaxHeight] }) }],
          }}
        >
          <ErrorBoundary>
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{
                backgroundColor: colors.bg, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingTop: 10,
              }}
            >
              <View style={{ alignItems: 'center', paddingBottom: 8 }}>
                <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: colors.neutral[300] }} />
              </View>
              {children}
            </Pressable>
          </ErrorBoundary>
        </Animated.View>
      </Pressable>
    </View>
  );
}

interface CenterProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/** Centered modal dialog, e.g. the payout-order lottery. Same absolute-overlay approach as SheetModal. */
export function CenterModal({ visible, onClose, children }: CenterProps) {
  const { colors, radius } = useTheme();
  const { interactive, guardedClose } = useDismissGuard(visible, onClose);
  useBackHandler(visible, guardedClose);
  const opacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Animated.View style={{ flex: 1, opacity }}>
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
      </Animated.View>
    </View>
  );
}
