import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { theme } from '../utils/theme';
import { scenarioService } from '../services/scenarioService';
import { InventoryItemCard } from '../components/InventoryItemCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { InventoryItem } from '../models/types';

export function InventoryScreen() {
  const { data: items, isLoading, error } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: scenarioService.getInventory,
  });

  if (isLoading) {
    return <LoadingSpinner message="Inspection de votre inventaire..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur de connexion à l'API</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>INVENTAIRE</Text>
        <Text style={styles.subtitle}>Vos possessions mystiques</Text>
      </View>

      <View style={styles.content}>
        {items && items.length > 0 ? (
          items.map((item) => (
            <InventoryItemCard
              key={item.id}
              name={item.name}
              description={item.description}
              iconUrl={item.iconUrl}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Votre inventaire est vide</Text>
            <Text style={styles.emptySubtext}>
              Explorez le monde pour collecter des objets
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    letterSpacing: 3,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  content: {
    padding: theme.spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.primary,
    textAlign: 'center',
  },
});
