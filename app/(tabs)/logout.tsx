import { useAuth } from '@/src/contexts/AuthContext';
import { theme } from '@/src/utils/theme';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function LogoutScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      console.log('Déconnexion en cours...');
      await new Promise((resolve) => setTimeout(resolve, 800));
      await logout();
      console.log('Déconnexion effectuée, redirection vers login');
      router.replace('/login');
    };

    handleLogout();
  }, [logout, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.text}>Déconnexion…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    marginTop: 12,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontSize: 14,
  },
});
