import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { getFullAssetUrl } from '../utils/asset-url';
import { theme } from '../utils/theme';

interface SceneAudioProps {
  soundUrl?: string | null;
  autoPlay?: boolean;
  showControls?: boolean;
}

/**
 * Composant pour lire les sons associés aux scènes
 * Utilise expo-av pour la lecture audio
 */
export function SceneAudio({ soundUrl, autoPlay = false, showControls = true }: SceneAudioProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!soundUrl) {
      return;
    }

    const loadSound = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const fullUrl = getFullAssetUrl(soundUrl);
        
        if (!fullUrl) {
          setError('URL du son invalide');
          setIsLoading(false);
          return;
        }
        
        // Vérifier que l'URL est bien formée
        if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
          setError(`URL invalide (doit commencer par http:// ou https://): ${fullUrl}`);
          setIsLoading(false);
          return;
        }

        // Configurer le mode audio
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        // Charger le son
        const { sound: loadedSound } = await Audio.Sound.createAsync(
          { uri: fullUrl },
          { 
            shouldPlay: autoPlay,
            volume: 1.0,
          }
        );

        setSound(loadedSound);
        setIsPlaying(autoPlay);

        // Écouter les événements de lecture
        loadedSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
            if (status.error) {
              setError(`Erreur de lecture: ${status.error}`);
            }
          } else {
            if (status.error) {
              setError(`Erreur: ${status.error}`);
            }
          }
        });
      } catch (error: any) {
        // Messages d'erreur explicites
        let errorMessage = 'Impossible de charger le son';
        if (error.message?.includes('Format error') || error.code === 'MEDIA_ELEMENT_ERROR') {
          errorMessage = 'Format audio non supporté. Le fichier peut être corrompu ou dans un format incompatible.';
        } else if (error.message?.includes('Network')) {
          errorMessage = 'Erreur réseau. Vérifiez votre connexion et que le serveur est accessible.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadSound();

    // Nettoyer à la destruction du composant
    return () => {
      if (sound) {
        sound.unloadAsync().catch(() => {
          // Erreur silencieuse lors du déchargement
        });
      }
    };
  }, [soundUrl, autoPlay]);

  const togglePlayPause = async () => {
    if (!sound) {
      return;
    }

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
      }
    } catch (error: any) {
      setError(error.message || 'Erreur de lecture');
    }
  };

  const stopSound = async () => {
    if (!sound) {
      return;
    }

    try {
      await sound.stopAsync();
      setIsPlaying(false);
    } catch (error: any) {
      // Erreur silencieuse lors de l'arrêt
    }
  };

  // Ne rien afficher si pas de son
  if (!soundUrl) {
    return null;
  }

  // Afficher les contrôles si demandé
  if (!showControls) {
    return null;
  }

  return (
    <View style={styles.container}>
      {error && (
        <Text style={styles.errorText}>⚠️ {error}</Text>
      )}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement du son...</Text>
        </View>
      ) : (
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={togglePlayPause}
            disabled={!sound}
            style={[styles.button, !sound && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>
              {isPlaying ? '⏸ Pause' : '▶ Lecture'}
            </Text>
          </TouchableOpacity>
          
          {isPlaying && (
            <TouchableOpacity
              onPress={stopSound}
              style={[styles.button, styles.buttonSecondary]}
            >
              <Text style={styles.buttonText}>⏹ Arrêter</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  loadingText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  controls: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  button: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.border,
    opacity: 0.6,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.secondary || '#6B7280',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
});

