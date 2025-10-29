import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../utils/theme';
import { MysticalButton } from '../components/MysticalButton';

export function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg' }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>VOUS ÊTES</Text>
            <Text style={styles.title}>LE HÉROS</Text>
          </View>

          <Text style={styles.subtitle}>
            Une aventure mystique vous attend
          </Text>

          <MysticalButton
            title="Commencer l'Aventure"
            onPress={() => router.push('/(tabs)/game')}
            style={styles.button}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  titleContainer: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    letterSpacing: 4,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  button: {
    minWidth: 250,
  },
});
