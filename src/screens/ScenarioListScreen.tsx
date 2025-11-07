import { useQuery } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import { GET_ALL_SCENARIOS } from '../graphql/queries';
import { GetAllScenariosResponse, Scenario } from '../graphql/types';
import { theme } from '../utils/theme';
import backgroundImage from '../../assets/images/background.png';

export function ScenarioListScreen() {
  const router = useRouter();
  const { data, loading, error } = useQuery<GetAllScenariosResponse>(
    GET_ALL_SCENARIOS,
    {
      variables: { publishedOnly: true },
    },
  );

  if (loading) {
    return (
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement des scénarios...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (error) {
    return (
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Erreur : {error.message}</Text>
          <Text style={styles.errorHint}>
            Vérifiez que le backend est démarré sur{' '}
            {process.env.EXPO_PUBLIC_API_URL}
          </Text>
        </View>
      </ImageBackground>
    );
  }

  const scenarios: Scenario[] = data?.allScenarios || [];

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.background}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>SCÉNARIOS DISPONIBLES</Text>
          <Text style={styles.subtitle}>Choisissez votre aventure</Text>
        </View>

        <View style={styles.content}>
          {scenarios.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun scénario disponible</Text>
              <Text style={styles.emptySubtext}>
                Les scénarios publiés apparaîtront ici
              </Text>
            </View>
          ) : (
            scenarios.map((scenario) => (
              <TouchableOpacity
                key={scenario.mongoId}
                style={styles.card}
                onPress={() =>
                  router.push(`/(tabs)/game?scenarioId=${scenario.mongoId}`)
                }
                activeOpacity={0.8}
              >
                <Text style={styles.cardTitle}>{scenario.title}</Text>
                <Text style={styles.cardDescription}>
                  {scenario.description}
                </Text>
                <Text style={styles.cardAction}>Commencer l'aventure →</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontFamily: theme.fonts.bold,
  },
  errorHint: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontFamily: theme.fonts.regular,
  },
  header: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    letterSpacing: 3,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    fontFamily: theme.fonts.regular,
  },
  content: {
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.mystical,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  cardAction: {
    fontSize: 14,
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    textAlign: 'right',
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
    fontFamily: theme.fonts.regular,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontFamily: theme.fonts.regular,
  },
});
