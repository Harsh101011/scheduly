import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, StatusBar, Modal, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { createBooking } from '../services/api';
import { colors, spacing, borderRadius, typography, gradients } from '../theme';

const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

const validate = ({ userName, email, phone }) => {
  const errors = {};
  if (!userName.trim()) errors.userName = 'Full name is required';
  if (!email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email';
  if (!phone.trim()) errors.phone = 'Phone number is required';
  else if (!/^\+?[\d\s\-().]{7,20}$/.test(phone)) errors.phone = 'Enter a valid phone number';
  return errors;
};

export default function BookingScreen({ route, navigation }) {
  const { expert, selectedDate, selectedTime } = route.params;

  const [form, setForm] = useState({
    userName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [serverError, setServerError] = useState(null);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    setServerError(null);
  };

  const handleSubmit = async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      setServerError(null);
      await createBooking({
        expertId: expert._id,
        userName: form.userName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        date: selectedDate,
        timeSlot: selectedTime,
        notes: form.notes.trim(),
      });
      setShowSuccess(true);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const FormField = ({ label, field, placeholder, keyboardType = 'default', multiline = false }) => (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline, errors[field] && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={form[field]}
        onChangeText={(t) => update(field, t)}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
        autoCapitalize={field === 'email' ? 'none' : 'words'}
      />
      {errors[field] && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={colors.error} />
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Session</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Session Summary Card */}
          <LinearGradient colors={gradients.primary} style={styles.summaryCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.summaryRow}>
              <Ionicons name="person-circle-outline" size={20} color="rgba(255,255,255,0.8)" />
              <Text style={styles.summaryValue}>{expert.name}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Ionicons name="calendar-outline" size={20} color="rgba(255,255,255,0.8)" />
              <Text style={styles.summaryValue}>{formatDate(selectedDate)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="time-outline" size={20} color="rgba(255,255,255,0.8)" />
              <Text style={styles.summaryValue}>{selectedTime} — 1 hour session</Text>
            </View>
            <View style={styles.summaryRow}>
              <Ionicons name="cash-outline" size={20} color="rgba(255,255,255,0.8)" />
              <Text style={styles.summaryValue}>${expert.hourlyRate} total</Text>
            </View>
          </LinearGradient>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Your Details</Text>

            <FormField label="Full Name *" field="userName" placeholder="e.g. John Smith" />
            <FormField label="Email Address *" field="email" placeholder="you@example.com" keyboardType="email-address" />
            <FormField label="Phone Number *" field="phone" placeholder="+1 234 567 8901" keyboardType="phone-pad" />
            <FormField label="Notes (optional)" field="notes" placeholder="What would you like to discuss?" multiline />

            {serverError && (
              <View style={styles.serverError}>
                <Ionicons name="warning-outline" size={18} color={colors.error} />
                <Text style={styles.serverErrorText}>{serverError}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.85}
            >
              <LinearGradient colors={gradients.primary} style={styles.submitGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {submitting ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={20} color={colors.white} />
                    <Text style={styles.submitText}>Confirm Booking</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <LinearGradient colors={[colors.success, '#059669']} style={styles.successIcon}>
              <Ionicons name="checkmark" size={40} color={colors.white} />
            </LinearGradient>
            <Text style={styles.successTitle}>Booking Confirmed! 🎉</Text>
            <Text style={styles.successMsg}>
              Your session with {expert.name} on {formatDate(selectedDate)} at {selectedTime} has been booked.
            </Text>
            <Text style={styles.successSub}>
              A confirmation has been saved to your bookings.
            </Text>
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate('ExpertList');
              }}
            >
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.h3 },
  scroll: { padding: spacing.md, paddingBottom: 100 },
  summaryCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  summaryValue: { color: colors.white, fontWeight: '600', fontSize: 15, flex: 1 },
  summaryDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 4 },
  form: { gap: spacing.sm },
  formTitle: { ...typography.h3, marginBottom: spacing.sm },
  fieldWrapper: { gap: 6 },
  fieldLabel: { ...typography.label },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 15,
  },
  inputMultiline: { height: 100, paddingTop: 12 },
  inputError: { borderColor: colors.error },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  errorText: { color: colors.error, fontSize: 12 },
  serverError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.errorBg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  serverErrorText: { color: colors.error, flex: 1, fontSize: 14 },
  submitBtn: { marginTop: spacing.md, borderRadius: borderRadius.xl, overflow: 'hidden' },
  submitBtnDisabled: { opacity: 0.7 },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitText: { color: colors.white, fontSize: 17, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  successModal: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: spacing.sm,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  successTitle: { ...typography.h2, textAlign: 'center' },
  successMsg: { ...typography.body, textAlign: 'center', lineHeight: 22 },
  successSub: { ...typography.caption, textAlign: 'center', color: colors.textMuted },
  doneBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  doneBtnText: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
