import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, RefreshControl, ScrollView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchExperts } from '../services/api';
import ExpertCard from '../components/ExpertCard';
import { ExpertCardSkeleton } from '../components/LoadingSkeleton';
import ErrorView from '../components/ErrorView';
import { colors, spacing, borderRadius, typography } from '../theme';

const CATEGORIES = ['All', 'Technology', 'Business', 'Health', 'Finance', 'Legal', 'Marketing', 'Design', 'Education'];

export default function ExpertListScreen({ navigation }) {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const searchTimer = useRef(null);

  const loadExperts = useCallback(async (pg = 1, cat = selectedCategory, q = search, append = false) => {
    try {
      if (!append) setLoading(true);
      setError(null);
      const res = await fetchExperts({ page: pg, limit: 10, category: cat, search: q });
      setExperts(prev => append ? [...prev, ...res.data] : res.data);
      setHasMore(res.pagination.hasMore);
      setPage(pg);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadExperts(1, selectedCategory, search); }, []);

  const handleSearch = (text) => {
    setSearch(text);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => loadExperts(1, selectedCategory, text), 350);
  };

  const handleCategory = (cat) => {
    setSelectedCategory(cat);
    loadExperts(1, cat, search);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      setLoadingMore(true);
      loadExperts(page + 1, selectedCategory, search, true);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadExperts(1, selectedCategory, search);
  };

  if (error && experts.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.header}><Text style={styles.headerTitle}>Find Experts</Text></View>
        <ErrorView message={error} onRetry={() => loadExperts(1, selectedCategory, search)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Experts</Text>
        <Text style={styles.headerSub}>Book 1-on-1 sessions with top professionals</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
            onPress={() => handleCategory(cat)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, selectedCategory === cat && styles.filterTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Expert List */}
      {loading ? (
        <FlatList
          data={Array.from({ length: 6 })}
          keyExtractor={(_, i) => `sk-${i}`}
          renderItem={() => <ExpertCardSkeleton />}
          contentContainerStyle={{ paddingTop: spacing.sm, paddingBottom: 100 }}
        />
      ) : (
        <FlatList
          data={experts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ExpertCard
              expert={item}
              onPress={() => navigation.navigate('ExpertDetail', { expertId: item._id })}
            />
          )}
          contentContainerStyle={{ paddingTop: spacing.sm, paddingBottom: 100 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primaryLight} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyText}>No experts found</Text>
              <Text style={styles.emptySubText}>Try adjusting your search or filters</Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <ExpertCardSkeleton />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm },
  headerTitle: { ...typography.h1 },
  headerSub: { ...typography.body, marginTop: 2 },
  searchRow: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  searchBox: {
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
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 15 },
  filterRow: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm, gap: 8, alignItems: 'center' },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: { backgroundColor: colors.primaryGlow, borderColor: colors.primaryLight },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  filterTextActive: { color: colors.primaryLight },
  empty: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyText: { ...typography.h3, color: colors.textSecondary },
  emptySubText: { ...typography.body },
});
