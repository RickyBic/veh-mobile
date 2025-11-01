/**
 * Utilitaire pour construire les URLs complètes des assets
 * Les URLs retournées par GraphQL sont relatives (ex: /media/assets/image.png)
 * Cette fonction les transforme en URLs complètes utilisables dans l'app mobile
 */

import { Platform } from 'react-native';

/**
 * Obtient l'URL de base de l'API en tenant compte de la plateforme
 * - Web : utilise localhost
 * - Android Emulator : utilise 10.0.2.2 (alias pour localhost)
 * - iOS Simulator : utilise localhost
 * - Appareil physique : utilise l'IP locale du serveur
 */
function getApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

  // Si l'URL de l'env ne contient pas localhost, l'utiliser telle quelle
  if (!envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }

  // Sur Android Emulator, localhost doit être remplacé par 10.0.2.2
  if (Platform.OS === 'android' && __DEV__) {
    // En développement sur émulateur Android
    return envUrl
      .replace('localhost', '10.0.2.2')
      .replace('127.0.0.1', '10.0.2.2');
  }

  return envUrl;
}

const API_BASE_URL = getApiBaseUrl();

/**
 * Construit une URL complète à partir d'une URL relative retournée par l'API
 * @param relativeUrl URL relative depuis le serveur (ex: /media/assets/image.png)
 * @returns URL complète (ex: http://localhost:8000/media/assets/image.png) ou null si l'URL est invalide
 */
export function getFullAssetUrl(relativeUrl?: string | null): string | null {
  if (!relativeUrl) {
    return null;
  }

  // Détecter les URLs factices (example.com) et les ignorer
  if (relativeUrl.includes('example.com')) {
    return null; // Ne pas utiliser les URLs factices
  }

  // Si l'URL est déjà complète (commence par http), la retourner telle quelle
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    // Seulement si ce n'est pas example.com
    return relativeUrl;
  }

  // Construire l'URL complète
  const baseUrl = API_BASE_URL.replace(/\/$/, ''); // Enlever le slash final si présent
  const assetPath = relativeUrl.startsWith('/')
    ? relativeUrl
    : `/${relativeUrl}`;

  const fullUrl = `${baseUrl}${assetPath}`;

  return fullUrl;
}

/**
 * Vérifie si une URL d'asset est valide
 * @param url URL à vérifier
 * @returns true si l'URL semble valide, false sinon
 */
export function isValidAssetUrl(url: string | null | undefined): boolean {
  if (!url) {
    return false;
  }

  // Vérifier que l'URL se termine par une extension de fichier valide
  const validExtensions = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.webp',
    '.mp3',
    '.wav',
    '.ogg',
    '.mp4',
    '.mov',
  ];
  return validExtensions.some((ext) => url.toLowerCase().endsWith(ext));
}
