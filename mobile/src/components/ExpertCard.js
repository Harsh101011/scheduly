import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';

const CATEGORY_COLORS = {
  Technology: '#06B6D4',
  Business: '#F59E0B',
  Health: '#10B981',
  Finance: '#3B82F6',
  Legal: '#8B5CF6',
  Marketing: '#EC4899',
  Design: '#F97316',
  Education: '#14B8A6',
};

export default function ExpertCard({ expert, onPress }) {
  const catColor = CATEGORY_COLORS[expert.category] || colors.primaryLight;

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < full ? 'star' : i < rating ? 'star-half' : 'star-outline'}
        size={12}
        color={colors.star}
        style={{ marginRight: 1 }}
      />
    ));
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: catColor }]} />

      <View style={styles.content}>
        {/* Avatar */}
        <View style={[styles.avatarWrapper, { borderColor: catColor }]}>
          <Image
            source={{ uri: expert.avatar || `https://api.dicebear.com/7.x/avataaars/png?seed=${expert._id}` }}
            style={styles.avatar}
            defaultSource={require('../../assets/favicon.png')}
          />
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{expert.name}</Text>
          <View style={styles.row}>
            <View style={[styles.categoryBadge, { backgroundColor: `${catColor}22` }]}>
              <Text style={[styles.category, { color: catColor }]}>{expert.category}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Ionicons name="briefcase-outline" size={12} color={colors.textMuted} />
            <Text style={styles.meta}>{expert.experience} yrs exp</Text>
            <View style={styles.dot} />
            <View style={styles.starsRow}>{renderStars(expert.rating)}</View>
            <Text style={styles.rating}>{expert.rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* Rate + Arrow */}
        <View style={styles.right}>
          <Text style={styles.rate}>${expert.hourlyRate}</Text>
          <Text style={styles.rateLabel}>/hr</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={{ marginTop: 8 }} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  accentBar: { width: 4 },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  avatarWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  avatar: { width: '100%', height: '100%' },
  info: { flex: 1, gap: 4 },
  name: { ...typography.bodyBold, fontSize: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  category: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  meta: { ...typography.caption, color: colors.textMuted },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    marginHorizontal: 2,
  },
  starsRow: { flexDirection: 'row' },
  rating: { ...typography.caption, color: colors.star, fontWeight: '700', marginLeft: 2 },
  right: { alignItems: 'flex-end' },
  rate: { fontSize: 18, fontWeight: '700', color: colors.primaryLight },
  rateLabel: { ...typography.caption, color: colors.textMuted },
});
