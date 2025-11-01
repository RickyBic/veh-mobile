import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import { MysticalButton } from '../components/MysticalButton';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../utils/theme';
import backgroundImage from '../../assets/images/background.png';

export function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { register, isLoading, error, user } = useAuth();
  const router = useRouter();

  // Rediriger les utilisateurs déjà connectés
  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/(tabs)/scenarios' as any);
    }
  }, [user, isLoading]);

  const handleRegister = async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return;
    }

    try {
      await register({
        email: email.toLowerCase().trim(),
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        role: 'player', // Par défaut, les nouveaux utilisateurs sont des joueurs
      });
      
      // La connexion automatique est gérée dans la fonction register
      router.replace('/(tabs)/scenarios' as any);
    } catch (err: any) {
      Alert.alert(
        'Erreur d\'inscription',
        err.message || 'Une erreur est survenue lors de l\'inscription'
      );
    }
  };

  const handleGoToLogin = () => {
    router.back();
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>VOUS ÊTES LE HÉROS</Text>
            <Text style={styles.subtitle}>Créer un compte</Text>

            <View style={styles.form}>
              <Text style={styles.label}>
                Email <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isLoading}
                autoComplete="email"
              />

              <Text style={styles.label}>
                Prénom
              </Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Jean"
                placeholderTextColor={theme.colors.textSecondary}
                editable={!isLoading}
                autoComplete="name"
              />

              <Text style={styles.label}>
                Nom
              </Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Dupont"
                placeholderTextColor={theme.colors.textSecondary}
                editable={!isLoading}
                autoComplete="name-family"
              />

              <Text style={styles.label}>
                Mot de passe <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
                autoComplete="password-new"
              />

              <Text style={styles.label}>
                Confirmer le mot de passe <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
                autoComplete="password-new"
              />

              {error && <Text style={styles.error}>{error}</Text>}

              <MysticalButton
                title={isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                onPress={handleRegister}
                disabled={isLoading || !email || !password || !confirmPassword}
                style={styles.button}
              />

              <TouchableOpacity
                onPress={handleGoToLogin}
                disabled={isLoading}
                style={styles.linkContainer}
              >
                <Text style={styles.link}>
                  Vous avez déjà un compte ? Connectez-vous
                </Text>
              </TouchableOpacity>

              <Text style={styles.hint}>
                Les champs marqués d'un <Text style={styles.required}>*</Text> sont obligatoires
              </Text>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxl,
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
  required: {
    color: '#ff6b6b',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 16,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }) as any,
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

