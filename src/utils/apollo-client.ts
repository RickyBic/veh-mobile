import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const httpLink = createHttpLink({
  uri:
    (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000') + '/graphql/',
});

const authLink = setContext(async (_, { headers }) => {
  try {
    // Sur web, utiliser localStorage, sur mobile utiliser SecureStore
    let token = null;
    if (Platform.OS === 'web') {
      token = localStorage.getItem('jwt_token');
    } else {
      token = await SecureStore.getItemAsync('jwt_token');
    }

    return {
      headers: {
        ...headers,
        authorization: token ? `JWT ${token}` : '',
      },
    };
  } catch (error) {
    console.error('Error getting token:', error);
    return { headers };
  }
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
