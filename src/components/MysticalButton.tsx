import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../utils/theme';

interface MysticalButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: ViewStyle;
}

export function MysticalButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: MysticalButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text
        style={[styles.text, variant === 'secondary' && styles.secondaryText]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.mystical,
  },
  primary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: theme.colors.background,
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  secondaryText: {
    color: theme.colors.primary,
  },
});
