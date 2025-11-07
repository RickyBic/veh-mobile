import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import backgroundImage from '../../assets/images/background.png';
import { MysticalButton } from '../components/MysticalButton';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../utils/theme';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, user } = useAuth();
  const router = useRouter();

  // Rediriger les utilisateurs déjà connectés
  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/(tabs)/scenarios' as any);
    }
  }, [user, isLoading]);

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace('/(tabs)/scenarios' as any);
    } catch (err: any) {
      Alert.alert(
        'Erreur de connexion',
        err.message || 'Identifiants invalides',
      );
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <Text style={styles.title}>VOUS ÊTES LE HÉROS</Text>
          <Text style={styles.subtitle}>Connexion</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              placeholderTextColor="#7a5a3a"
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />

            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#7a5a3a"
              secureTextEntry
              autoCapitalize="none"
              editable={!isLoading}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <MysticalButton
              title={isLoading ? 'Connexion...' : 'Se connecter'}
              onPress={handleLogin}
              disabled={isLoading || !email || !password}
              style={styles.button}
            />

            <TouchableOpacity
              onPress={() => router.push('/register' as any)}
              disabled={isLoading}
              style={styles.linkContainer}
            >
              <Text style={styles.link}>
                Pas encore de compte ? Inscrivez-vous
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 16,
    fontFamily: theme.fonts.bodyRegular,
  },
  error: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  button: {
    marginTop: theme.spacing.xl,
  },
  linkContainer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  link: {
    fontSize: 14,
    color: theme.colors.primary,
    fontFamily: theme.fonts.regular,
    textDecorationLine: 'underline',
  },
  hint: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    lineHeight: 18,
  },
});
