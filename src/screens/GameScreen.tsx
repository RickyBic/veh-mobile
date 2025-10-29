import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { theme } from '../utils/theme';
import { scenarioService } from '../services/scenarioService';
import { SceneCard } from '../components/SceneCard';
import { MysticalButton } from '../components/MysticalButton';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Scene } from '../models/types';

export function GameScreen() {
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const { data: scene, isLoading, error } = useQuery<Scene>({
    queryKey: ['scene', currentSceneId, selectedChoice],
    queryFn: async () => {
      if (!currentSceneId) {
        return scenarioService.startScenario();
      }
      return scenarioService.getNextScene(currentSceneId, selectedChoice!);
    },
    enabled: currentSceneId === null || (currentSceneId !== null && selectedChoice !== null),
  });

  const handleChoice = (choiceId: string, nextSceneId: string) => {
    setSelectedChoice(choiceId);
    setCurrentSceneId(nextSceneId);
  };

  if (isLoading) {
    return <LoadingSpinner message="Le destin se révèle..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur de connexion à l'API</Text>
        <Text style={styles.errorDetail}>
          Veuillez configurer EXPO_PUBLIC_API_URL dans votre fichier .env
        </Text>
      </View>
    );
  }

  if (!scene) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Prêt à commencer votre aventure ?</Text>
        <MysticalButton
          title="Débuter"
          onPress={() => setCurrentSceneId('start')}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <SceneCard
        title={scene.title}
        text={scene.text}
        imageUrl={scene.imageUrl}
      />

      <View style={styles.choicesContainer}>
        <Text style={styles.choicesTitle}>Que faites-vous ?</Text>
        {scene.choices.map((choice) => (
          <MysticalButton
            key={choice.id}
            title={choice.text}
            onPress={() => handleChoice(choice.id, choice.nextSceneId)}
            variant="secondary"
            style={styles.choiceButton}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.lg,
  },
  welcomeText: {
    fontSize: 20,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  choicesContainer: {
    marginTop: theme.spacing.xl,
  },
  choicesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  choiceButton: {
    marginBottom: theme.spacing.md,
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
    marginBottom: theme.spacing.md,
  },
  errorDetail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
