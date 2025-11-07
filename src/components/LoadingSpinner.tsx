import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { theme } from '../utils/theme';

interface LoadingSpinnerProps {
  message?: string;
  transparent?: boolean;
  containerStyle?: ViewStyle;
}

export function LoadingSpinner({
  message = 'Chargement...',
  transparent = false,
  containerStyle,
}: LoadingSpinnerProps) {
  return (
    <View
      style={[
        styles.container,
        transparent && { backgroundColor: 'transparent', flex: 0 },
        containerStyle,
      ]}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  message: {
    marginTop: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
  },
});
