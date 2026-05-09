import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../theme';

export default function SlotBadge({ time, isBooked, isSelected, onPress }) {
  const disabled = !!isBooked; // coerce to boolean — API may return string "false"/"true"

  return (
    <TouchableOpacity
      style={[
        styles.badge,
        isBooked && styles.booked,
        isSelected && styles.selected,
        disabled && styles.disabled,
      ]}
      onPress={disabled ? null : onPress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          isBooked && styles.bookedText,
          isSelected && styles.selectedText,
        ]}
      >
        {time}
      </Text>
      {isBooked && <Text style={styles.bookedLabel}>Booked</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    alignItems: 'center',
    minWidth: 72,
    margin: 4,
  },
  booked: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  selected: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.primaryLight,
  },
  disabled: { opacity: 0.6 },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bookedText: { color: colors.error },
  selectedText: { color: colors.primaryLight },
  bookedLabel: {
    fontSize: 9,
    color: colors.error,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
