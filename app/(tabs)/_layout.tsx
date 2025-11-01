import { useAuth } from '@/src/contexts/AuthContext';
import { theme } from '@/src/utils/theme';
import { Tabs, useRouter } from 'expo-router';
import { List, LogOut } from 'lucide-react-native';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function TabLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Rediriger si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  // Afficher un écran de chargement pendant la vérification
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Ne rien afficher si l'utilisateur n'est pas connecté (en cours de redirection)
  if (!user) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          letterSpacing: 1,
        },
      }}
    >
      <Tabs.Screen
        name="scenarios"
        options={{
          title: 'Scénarios',
          tabBarIcon: ({ size, color }) => <List size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: 'Déconnexion',
          tabBarIcon: ({ size, color }) => <LogOut size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
