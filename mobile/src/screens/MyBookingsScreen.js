import React, { useState, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ActivityIndicator, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchMyBookings } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import ErrorView from '../components/ErrorView';
import { colors, spacing, borderRadius, typography } from '../theme';

const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatCreatedAt = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function MyBookingsScreen() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = async () => {
    if (!email.trim()) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetchMyBookings(email.trim().toLowerCase());
      setBookings(res.data);
      setSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderBooking = ({ item }) => {
    const exp = item.expertId;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {exp?.avatar ? (
            <Image source={{ uri: exp.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Ionicons name="person" size={22} color={colors.textMuted} />
            </View>
          )}
          <View style={styles.cardHeaderInfo}>
            <Text style={styles.expertName} numberOfLines={1}>
              {item.expertName || exp?.name || 'Expert'}
            </Text>
            <Text style={styles.expertCategory}>{exp?.category}</Text>
          </View>
          <StatusBadge status={item.status} />
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={14} color={colors.primaryLight} />
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color={colors.primaryLight} />
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{item.timeSlot}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={14} color={colors.primaryLight} />
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue} numberOfLines={1}>{item.userName}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="receipt-outline" size={14} color={colors.primaryLight} />
            <Text style={styles.detailLabel}>Booked</Text>
            <Text style={styles.detailValue}>{formatCreatedAt(item.createdAt)}</Text>
          </View>
        </View>

        {item.notes ? (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <Text style={styles.headerSub}>Enter your email to view your sessions</Text>
        </View>

        {/* Email Search */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBox, error && styles.searchBoxError]}>
            <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="your@email.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={(t) => { setEmail(t); setError(null); }}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {email.length > 0 && (
              <TouchableOpacity onPress={() => { setEmail(''); setBookings([]); setSearched(false); }}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.85}>
            <Ionicons name="search" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={14} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Results */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primaryLight} />
            <Text style={styles.loadingText}>Fetching your bookings...</Text>
          </View>
        ) : searched && bookings.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="calendar-outline" size={56} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Bookings Found</Text>
            <Text style={styles.emptySubText}>No sessions found for {email}</Text>
          </View>
        ) : !searched ? (
          <View style={styles.center}>
            <Ionicons name="search-circle-outline" size={64} color={colors.primaryGlow} />
            <Text style={styles.promptText}>Enter your email above</Text>
            <Text style={styles.promptSub}>to view all your booked sessions</Text>
          </View>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item._id}
            renderItem={renderBooking}
            contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}
            ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
            ListHeaderComponent={
              <Text style={styles.resultsCount}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} found</Text>
            }
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: { ...typography.h1 },
  headerSub: { ...typography.body, marginTop: 2 },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: 4,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    gap: 8,
  },
  searchBoxError: { borderColor: colors.error },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 15 },
  searchBtn: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md + 4,
    marginBottom: 6,
  },
  errorText: { color: colors.error, fontSize: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: spacing.xl },
  loadingText: { ...typography.body, marginTop: spacing.sm },
  emptyTitle: { ...typography.h3 },
  emptySubText: { ...typography.body, textAlign: 'center' },
  promptText: { ...typography.h3, color: colors.textSecondary },
  promptSub: { ...typography.body, textAlign: 'center' },
  resultsCount: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.sm },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: { backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  cardHeaderInfo: { flex: 1 },
  expertName: { ...typography.bodyBold, fontSize: 16 },
  expertCategory: { ...typography.caption, color: colors.primaryLight, marginTop: 2 },
  cardDivider: { height: 1, backgroundColor: colors.cardBorder },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.sm,
  },
  detailItem: {
    width: '50%',
    padding: spacing.sm,
    gap: 2,
  },
  detailLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  detailValue: { ...typography.bodyBold, fontSize: 14 },
  notes: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  notesLabel: { ...typography.caption, color: colors.textMuted, marginBottom: 4 },
  notesText: { ...typography.body, fontSize: 14 },
});
