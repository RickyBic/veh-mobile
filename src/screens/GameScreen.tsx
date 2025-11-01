import { useMutation, useQuery } from '@apollo/client/react';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { CREATE_PROGRESS, RECORD_PROGRESS } from '../graphql/mutations';
import {
  GET_CHOICES_BY_SCENE,
  GET_SCENES_BY_SCENARIO,
} from '../graphql/queries';
import {
  CreateProgressResponse,
  GetChoicesBySceneResponse,
  GetScenesByScenarioResponse,
  RecordProgressResponse,
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
  const [progressId, setProgressId] = useState<string | null>(null);
  const [isInitializingProgress, setIsInitializingProgress] = useState(false);

  // Charger les scènes du scénario
  const {
    data: scenesData,
    loading: scenarioLoading,
    error: scenarioError,
  } = useQuery<GetScenesByScenarioResponse>(GET_SCENES_BY_SCENARIO, {
    variables: { scenarioId: scenarioId },
    skip: !scenarioId,
  });

  // Charger les choix de la scène actuelle
  const { data: choicesData } = useQuery<GetChoicesBySceneResponse>(
    GET_CHOICES_BY_SCENE,
    {
      variables: { sceneId: currentSceneId },
      skip: !currentSceneId,
    }
  );

  // Mutations pour la gestion de progression
  const [createProgress] = useMutation<CreateProgressResponse>(CREATE_PROGRESS);
  const [recordProgress] = useMutation<RecordProgressResponse>(RECORD_PROGRESS);

  // Créer un objet scenario factice pour compatibilité
  const scenarioData = scenesData
    ? {
        scenarioById: {
          mongoId: scenarioId || '',
          title: 'Scénario',
          description: '',
          scenes: scenesData.scenesByScenario || [],
        },
      }
    : null;

  // Initialiser ou récupérer la progression
  useEffect(() => {
    if (
      user &&
      scenarioId &&
      scenarioData?.scenarioById &&
      !progressId &&
      !isInitializingProgress
    ) {
      initProgress();
    }
  }, [user, scenarioId, scenarioData, progressId, isInitializingProgress]);

  // Fonction pour initialiser la progression
  const initProgress = async () => {
    setIsInitializingProgress(true);
    try {
      const scenario: Scenario = scenarioData!.scenarioById;

      // Trouver la scène de départ
      const startScene = scenario.scenes.find((s) => s.isStartScene);
      if (!startScene) {
        setIsInitializingProgress(false);
        return;
      }

      // Créer ou récupérer la progression
      const { data } = await createProgress({
        variables: {
          input: {
            scenarioId: scenarioId,
            currentSceneId: startScene.mongoId,
          },
        },
      });

      if (data?.createProgress?.success && data?.createProgress?.progress) {
        const progress = data.createProgress.progress;
        setProgressId(progress.mongoId);

        // Si une progression existe déjà, reprendre à la scène actuelle
        if (progress.currentSceneId?.mongoId) {
          setCurrentSceneId(progress.currentSceneId.mongoId);
        } else {
          setCurrentSceneId(startScene.mongoId);
        }
      } else {
        // Si pas de progression, commencer quand même
        setCurrentSceneId(startScene.mongoId);
      }
    } catch (error) {
      // En cas d'erreur, permettre quand même de jouer
      const scenario: Scenario = scenarioData!.scenarioById;
      const startScene = scenario.scenes.find((s) => s.isStartScene);
      if (startScene) {
        setCurrentSceneId(startScene.mongoId);
      }
    } finally {
      setIsInitializingProgress(false);
    }
  };

  // Initialiser la scène de départ (pour les utilisateurs non authentifiés)
  useEffect(() => {
    if (!user && scenarioData?.scenarioById && !currentSceneId) {
      const scenario: Scenario = scenarioData.scenarioById;
      const startScene = scenario.scenes.find((s) => s.isStartScene);
      if (startScene) {
        setCurrentSceneId(startScene.mongoId);
        setCurrentScene(startScene);
      }
    }
  }, [user, scenarioData, currentSceneId]);

  // Mettre à jour la scène courante avec les choix
  useEffect(() => {
    if (currentSceneId && scenarioData?.scenarioById) {
      const scenario: Scenario = scenarioData.scenarioById;
      const scene = scenario.scenes.find((s) => s.mongoId === currentSceneId);
      if (scene) {
        // Ajouter les choix à la scène
        const sceneWithChoices = {
          ...scene,
          choices: choicesData?.choicesByScene || [],
        };
        setCurrentScene(sceneWithChoices);
      }
    }
  }, [currentSceneId, scenarioData, choicesData]);

  const handleChoice = async (choiceId: string, nextSceneId: string) => {
    try {
      // Mettre à jour la scène immédiatement pour une meilleure UX
      setCurrentSceneId(nextSceneId);

      // Enregistrer la progression (si authentifié)
      if (user && progressId) {
        await recordProgress({
          variables: {
            input: {
              progressId: progressId,
              sceneId: nextSceneId,
              choiceId: choiceId,
              metadata: {
                timestamp: new Date().toISOString(),
                scenarioId: scenarioId,
              },
            },
          },
        });
      }
    } catch (error) {
      // On continue quand même le jeu même si la sauvegarde échoue
    }
  };

  const handleStartNewGame = async () => {
    if (scenarioData?.scenarioById) {
      const scenario: Scenario = scenarioData.scenarioById;
      const startScene = scenario.scenes.find((s) => s.isStartScene);
      if (startScene) {
        setCurrentSceneId(startScene.mongoId);
        setCurrentScene(startScene);

        // Réinitialiser la progression si authentifié
        if (user && scenarioId) {
          setProgressId(null);
          setIsInitializingProgress(false);
          // Cela déclenchera initProgress() via useEffect
        }
      }
    }
  };

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
          <MysticalButton
            title="Débuter"
            onPress={handleStartNewGame}
            style={styles.startButton}
          />
        </View>
      </ImageBackground>
    );
  }

  // Trier les choix par ordre
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

        {/* Lecteur audio pour la scène - TTS (narration) */}
        {currentScene.soundId && (
          <SceneAudio
            soundUrl={currentScene.soundId.url}
            autoPlay={true}
            showControls={false}
          />
        )}

        {/* Lecteur audio pour la scène - Musique d'ambiance */}
        {currentScene.musicId && (
          <SceneAudio
            soundUrl={currentScene.musicId.url}
            autoPlay={true}
            showControls={false}
          />
        )}

        {currentScene.isEndScene ? (
          <View style={styles.endContainer}>
            <Text style={styles.endText}>FIN DE L'AVENTURE</Text>
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
  startButton: {
    marginTop: theme.spacing.xl,
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
    marginBottom: theme.spacing.xl,
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
  },
  errorDetail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
