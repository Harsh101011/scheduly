import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, SectionList, TouchableOpacity, StyleSheet,
  SafeAreaView, Image, ScrollView, StatusBar, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchExpertById } from '../services/api';
import { useSocket } from '../context/SocketContext';
import SlotBadge from '../components/SlotBadge';
import ErrorView from '../components/ErrorView';
import { colors, spacing, borderRadius, typography, gradients } from '../theme';

const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
};

const groupSlotsByDate = (slots) => {
  const map = {};
  slots.forEach((s) => {
    if (!map[s.date]) map[s.date] = [];
    map[s.date].push(s);
  });
  return Object.keys(map)
    .sort()
    .map((date) => ({ title: formatDate(date), date, data: [map[date]] }));
};

export default function ExpertDetailScreen({ route, navigation }) {
  const { expertId } = route.params;
  const [expert, setExpert] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket, joinExpertRoom, leaveExpertRoom } = useSocket();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchExpertById(expertId);
      setExpert(res.data);
      // Normalize isBooked to a real boolean — JSON may deserialize it as a string
      const normalizedSlots = (res.data.availableSlots || []).map((s) => ({
        ...s,
        isBooked: !!s.isBooked,
      }));
      setSlots(normalizedSlots);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [expertId]);

  useEffect(() => {
    load();
    joinExpertRoom(expertId);
    return () => leaveExpertRoom(expertId);
  }, [expertId]);

  // Real-time slot update via Socket.io
  useEffect(() => {
    if (!socket) return;
    const handler = ({ date, timeSlot }) => {
      setSlots((prev) =>
        prev.map((s) =>
          s.date === date && s.time === timeSlot ? { ...s, isBooked: true } : { ...s, isBooked: !!s.isBooked }
        )
      );
    };
    socket.on('slot_booked', handler);
    return () => socket.off('slot_booked', handler);
  }, [socket]);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Ionicons key={i} name={i < Math.floor(rating) ? 'star' : 'star-outline'} size={14} color={colors.star} />
    ));

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={colors.primaryLight} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (error || !expert) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <ErrorView message={error} onRetry={load} />
      </SafeAreaView>
    );
  }

  const sections = groupSlotsByDate(slots);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <SectionList
        sections={sections}
        keyExtractor={(_, index) => `section-${index}`}
        stickySectionHeadersEnabled={true}
        ListHeaderComponent={
          <View>
            {/* Profile Header */}
            <LinearGradient colors={gradients.header} style={styles.profileHeader}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: expert.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${expert._id}` }}
                  style={styles.avatar}
                />
              </View>
              <Text style={styles.name}>{expert.name}</Text>
              <Text style={styles.category}>{expert.category}</Text>
              <View style={styles.starsRow}>{renderStars(expert.rating)}</View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{expert.experience}+</Text>
                  <Text style={styles.statLabel}>Years</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{expert.rating.toFixed(1)}</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{expert.reviewCount}</Text>
                  <Text style={styles.statLabel}>Reviews</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>${expert.hourlyRate}</Text>
                  <Text style={styles.statLabel}>Per Hour</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Bio */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bio}>{expert.bio}</Text>
            </View>

            <View style={styles.slotsHeader}>
              <Text style={styles.sectionTitle}>Available Time Slots</Text>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Live</Text>
              </View>
            </View>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item: daySlots, section }) => (
          <View style={styles.slotsGrid}>
            {daySlots.map((slot) => (
              <SlotBadge
                key={`${slot.date}-${slot.time}`}
                time={slot.time}
                isBooked={slot.isBooked}
                onPress={() =>
                  navigation.navigate('Booking', {
                    expert,
                    selectedDate: slot.date,
                    selectedTime: slot.time,
                  })
                }
              />
            ))}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptySlots}>
            <Ionicons name="calendar-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptySlotsText}>No available slots</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  backBtn: {
    position: 'absolute',
    top: 54,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primaryLight,
    overflow: 'hidden',
    backgroundColor: colors.card,
    marginBottom: spacing.sm,
  },
  avatar: { width: '100%', height: '100%' },
  name: { ...typography.h2, marginBottom: 4 },
  category: { ...typography.label, color: colors.primaryLight, marginBottom: 8 },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: spacing.md },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    width: '100%',
    marginTop: spacing.sm,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  statLabel: { ...typography.caption, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.cardBorder },
  section: { padding: spacing.md },
  sectionTitle: { ...typography.h3, marginBottom: spacing.sm },
  bio: { ...typography.body, lineHeight: 24 },
  slotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  liveText: { fontSize: 12, color: colors.success, fontWeight: '700' },
  dateHeader: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  dateText: { ...typography.label, color: colors.primaryLight },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  emptySlots: { alignItems: 'center', padding: spacing.xl, gap: 8 },
  emptySlotsText: { ...typography.body },
});
