import { useMutation } from '@apollo/client/react';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { CREATE_USER, LOGIN } from '../graphql/mutations';
import { GET_ME } from '../graphql/queries';
import {
  CreateUserInput,
  CreateUserResponse,
  GetMeResponse,
  LoginResponse,
  User,
} from '../graphql/types';
import { apolloClient } from '../utils/apollo-client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (input: CreateUserInput) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [loginMutation] = useMutation<LoginResponse>(LOGIN);
  const [createUserMutation] = useMutation<CreateUserResponse>(CREATE_USER);

  // Charger le token au démarrage
  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      let storedToken = null;
      if (Platform.OS === 'web') {
        storedToken = localStorage.getItem('jwt_token');
      } else {
        storedToken = await SecureStore.getItemAsync('jwt_token');
      }

      if (storedToken) {
        setToken(storedToken);

        // Récupérer les informations de l'utilisateur
        try {
          const { data } = await apolloClient.query<GetMeResponse>({
            query: GET_ME,
            fetchPolicy: 'network-only', // Force la récupération depuis le serveur
          });

          if (data?.me) {
            setUser({
              mongoId: data.me.mongoId,
              email: data.me.email,
              role: data.me.role,
              firstName: data.me.firstName,
              lastName: data.me.lastName,
            });
          } else {
            // Token invalide, le supprimer
            await logout();
          }
        } catch (err) {
          console.error('Error fetching user info:', err);
          // Token invalide ou expiré, le supprimer
          await logout();
        }
      }
    } catch (err) {
      console.error('Error loading token:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const { data } = await loginMutation({
        variables: { email, password },
      });

      if (data?.login?.success && data?.login?.token) {
        const newToken = data.login.token;
        setToken(newToken);

        // Sauvegarder le token
        if (Platform.OS === 'web') {
          localStorage.setItem('jwt_token', newToken);
        } else {
          await SecureStore.setItemAsync('jwt_token', newToken);
        }

        // Décoder le token pour obtenir les infos utilisateur
        const payload = JSON.parse(atob(newToken.split('.')[1]));
        setUser({
          mongoId: payload.user_id,
          email: payload.email,
          role: payload.role,
        });
      } else {
        throw new Error(data?.login?.message || 'Échec de la connexion');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (input: CreateUserInput) => {
    try {
      setError(null);
      setIsLoading(true);

      const { data } = await createUserMutation({
        variables: { input },
      });

      if (data?.createUser?.success && data?.createUser?.user) {
        // Après l'inscription réussie, connecter automatiquement l'utilisateur
        await login(input.email, input.password);
      } else {
        throw new Error(data?.createUser?.message || "Échec de l'inscription");
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('jwt_token');
      } else {
        await SecureStore.deleteItemAsync('jwt_token');
      }
      setToken(null);
      setUser(null);
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
