import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

function SkeletonBlock({ width, height, style }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, borderRadius: borderRadius.sm, opacity },
        style,
      ]}
    />
  );
}

export function ExpertCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.accentBar} />
      <View style={styles.row}>
        <SkeletonBlock width={54} height={54} style={{ borderRadius: 27 }} />
        <View style={{ flex: 1, gap: 8, marginLeft: 10 }}>
          <SkeletonBlock width="70%" height={16} />
          <SkeletonBlock width="40%" height={12} />
          <SkeletonBlock width="60%" height={12} />
        </View>
        <SkeletonBlock width={40} height={40} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { backgroundColor: colors.cardBorder },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  accentBar: { width: 4, backgroundColor: colors.cardBorder },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
});
