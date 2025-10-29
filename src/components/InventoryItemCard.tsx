import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

interface InventoryItemCardProps {
  name: string;
  description: string;
  iconUrl?: string;
}

export function InventoryItemCard({ name, description, iconUrl }: InventoryItemCardProps) {
  return (
    <View style={styles.container}>
      {iconUrl ? (
        <Image source={{ uri: iconUrl }} style={styles.icon} />
      ) : (
        <View style={styles.placeholderIcon}>
          <Text style={styles.placeholderText}>?</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
  },
  placeholderIcon: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  placeholderText: {
    color: theme.colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
