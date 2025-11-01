import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { getFullAssetUrl } from '../utils/asset-url';
import { theme } from '../utils/theme';

interface SceneCardProps {
  title: string;
  text: string;
  imageUrl?: string;
}

export function SceneCard({ title, text, imageUrl }: SceneCardProps) {
  const fullImageUrl = imageUrl ? getFullAssetUrl(imageUrl) : null;

  return (
    <View style={styles.container}>
      {fullImageUrl ? (
        <Image
          source={{ uri: fullImageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadows.mystical,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  text: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    lineHeight: 24,
    textAlign: 'justify',
  },
});
