import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { TrendingMovie } from '@/types/movie';
import { tmdbApi } from '@/services/tmdbApi';

interface TrendingCardProps {
  movie: TrendingMovie;
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.6;

export default function TrendingCard({ movie }: TrendingCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/(tabs)/movie/${movie.id}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: tmdbApi.getImageUrl(movie.poster_path, 'w500') || 'https://via.placeholder.com/400x600/333/fff?text=No+Image'
          }}
          style={styles.poster}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        {movie.rank && (
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>{movie.rank}</Text>
          </View>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {movie.title}
          </Text>
          {movie.search_count && (
            <Text style={styles.searchCount}>
              {movie.search_count} searches
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginRight: 16,
  },
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: cardWidth * 1.4,
    backgroundColor: Colors.dark[100],
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  rankBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: Colors.accent,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  title: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  searchCount: {
    color: Colors.light[200],
    fontSize: 12,
  },
});