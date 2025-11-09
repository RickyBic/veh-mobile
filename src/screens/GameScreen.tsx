import { useQuery } from '@apollo/client/react';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import backgroundImage from '../../assets/images/background.png';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MysticalButton } from '../components/MysticalButton';
import { SceneAudio } from '../components/SceneAudio';
import { SceneCard } from '../components/SceneCard';
import { useAuth } from '../contexts/AuthContext';
import {
  GET_CHOICES_BY_SCENE,
  GET_SCENES_BY_SCENARIO,
} from '../graphql/queries';
import {
  GetChoicesBySceneResponse,
  GetScenesByScenarioResponse,
  Scene,
} from '../graphql/types';
import { theme } from '../utils/theme';

interface Scenario {
  mongoId: string;
  title: string;
  description: string;
  scenes: Scene[];
}

export function GameScreen() {
  const { scenarioId } = useLocalSearchParams<{ scenarioId?: string }>();
  const { user } = useAuth();
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [isSceneLoading, setIsSceneLoading] = useState(false);

  // Charger les scènes du scénario
  const {
    data: scenesData,
    loading: scenarioLoading,
    error: scenarioError,
  } = useQuery<GetScenesByScenarioResponse>(GET_SCENES_BY_SCENARIO, {
    variables: { scenarioId },
    skip: !scenarioId,
  });

  // Charger les choix de la scène actuelle
  const { data: choicesData } = useQuery<GetChoicesBySceneResponse>(
    GET_CHOICES_BY_SCENE,
    {
      variables: { sceneId: currentSceneId },
      skip: !currentSceneId,
    },
  );

  // Construire l'objet scénario
  const scenarioData = useMemo(() => {
    return scenesData
      ? {
          scenarioById: {
            mongoId: scenarioId || '',
            title: 'Scénario',
            description: '',
            scenes: scenesData.scenesByScenario || [],
          },
        }
      : null;
  }, [scenesData, scenarioId]);

  // Initialiser la scène de départ
  useEffect(() => {
    if (scenarioData?.scenarioById && !currentSceneId) {
      const scenario: Scenario = scenarioData.scenarioById;
      const startScene = scenario.scenes.find((s) => s.isStartScene);
      if (startScene) {
        setCurrentSceneId(startScene.mongoId);
        setCurrentScene(startScene);
      }
    }
  }, [scenarioData, currentSceneId]);

  // Mettre à jour la scène courante avec les choix
  useEffect(() => {
    if (currentSceneId && scenarioData?.scenarioById) {
      const scenario: Scenario = scenarioData.scenarioById;
      const scene = scenario.scenes.find((s) => s.mongoId === currentSceneId);
      if (scene) {
        setIsSceneLoading(true);
        setCurrentScene({
          ...scene,
          choices: choicesData?.choicesByScene || undefined,
        });
        setIsSceneLoading(false);
      }
    }
  }, [currentSceneId, scenarioData, choicesData]);

  const handleChoice = (choiceId: string, nextSceneId: string) => {
    setIsSceneLoading(true);
    setCurrentSceneId(nextSceneId);
  };

  const handleStartNewGame = () => {
    if (scenarioData?.scenarioById) {
      const scenario: Scenario = scenarioData.scenarioById;
      const startScene = scenario.scenes.find((s) => s.isStartScene);
      if (startScene) {
        setCurrentSceneId(startScene.mongoId);
        setCurrentScene(startScene);
      }
    }
  };

  // Gestion du chargement global
  if (scenarioLoading) {
    return (
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.background}
      >
        <LoadingSpinner message="Le destin se révèle..." />
      </ImageBackground>
    );
  }

  // Gestion d'erreur : aucun scénario
  if (!scenarioId) {
    return (
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Aucun scénario sélectionné</Text>
          <Text style={styles.errorDetail}>
            Veuillez choisir un scénario depuis la liste
          </Text>
          <MysticalButton
            title="Voir les scénarios"
            onPress={() => {
              const { router } = require('expo-router');
              router.push('/(tabs)/scenarios');
            }}
            style={{ marginTop: 20 }}
          />
        </View>
      </ImageBackground>
    );
  }

  // Erreur : chargement du scénario
  if (scenarioError) {
    return (
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erreur de chargement</Text>
          <Text style={styles.errorDetail}>{scenarioError.message}</Text>
        </View>
      </ImageBackground>
    );
  }

  // Scénario introuvable
  if (!scenarioData?.scenarioById) {
    return (
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Scénario non trouvé</Text>
          <Text style={styles.errorDetail}>ID: {scenarioId}</Text>
        </View>
      </ImageBackground>
    );
  }

  // Attente de la scène initiale
  if (!currentScene) {
    return (
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.welcomeText}>
            Prêt à commencer votre aventure ?
          </Text>
          <Text style={styles.scenarioTitle}>
            {scenarioData.scenarioById.title}
          </Text>
          <Text style={styles.scenarioDescription}>
            {scenarioData.scenarioById.description}
          </Text>
          <LoadingSpinner
            message="Veuillez patienter, préparation de votre aventure..."
            transparent={true}
          />
        </View>
      </ImageBackground>
    );
  }

  // Si les choix de la scène suivante ne sont pas encore chargés
  if (isSceneLoading || !currentScene.choices) {
    return (
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.background}
      >
        <LoadingSpinner message="Chargement de la scène suivante..." />
      </ImageBackground>
    );
  }

  // Déterminer si la scène est une fin
  const isEndScene =
    currentScene.isEndScene ||
    (Array.isArray(currentScene.choices) && currentScene.choices.length === 0);

  // Trier les choix
  const sortedChoices = currentScene.choices
    ? [...currentScene.choices].sort((a, b) => a.order - b.order)
    : [];

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.background}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.container}
      >
        <SceneCard
          title={currentScene.title}
          text={currentScene.text}
          imageUrl={currentScene.imageId?.url}
        />

        {currentScene.soundId && (
          <SceneAudio
            soundUrl={currentScene.soundId.url}
            autoPlay
            showControls={false}
          />
        )}

        {currentScene.musicId && (
          <SceneAudio
            soundUrl={currentScene.musicId.url}
            autoPlay
            showControls={false}
          />
        )}

        {isEndScene ? (
          <View style={styles.endContainer}>
            <Text style={styles.endText}>FIN DE L'AVENTURE</Text>
            <Text style={styles.endSubtext}>
              L'histoire est terminée. Merci d'avoir joué !
            </Text>
            <MysticalButton
              title="Recommencer"
              onPress={handleStartNewGame}
              style={styles.choiceButton}
            />
          </View>
        ) : (
          <View style={styles.choicesContainer}>
            <Text style={styles.choicesTitle}>Que faites-vous ?</Text>
            {sortedChoices.map((choice) => (
              <MysticalButton
                key={choice.mongoId}
                title={choice.text}
                onPress={() =>
                  handleChoice(choice.mongoId, choice.toSceneId.mongoId)
                }
                variant="secondary"
                style={styles.choiceButton}
              />
            ))}
          </View>
        )}
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
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: theme.spacing.lg,
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  scenarioTitle: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: theme.spacing.md,
  },
  scenarioDescription: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  choicesContainer: {
    marginTop: theme.spacing.xl,
  },
  choicesTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  choiceButton: {
    marginBottom: theme.spacing.md,
  },
  endContainer: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  endText: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: theme.spacing.md,
  },
  endSubtext: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontFamily: theme.fonts.bold,
  },
  errorDetail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontFamily: theme.fonts.regular,
  },
});
