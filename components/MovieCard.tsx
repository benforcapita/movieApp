import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Movie } from '@/types/movie';
import { tmdbApi } from '@/services/tmdbApi';

interface MovieCardProps {
  movie: Movie;
  showRating?: boolean;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 3 - 10;

export default function MovieCard({ movie, showRating = true }: MovieCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/(tabs)/movie/${movie.id}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: tmdbApi.getImageUrl(movie.poster_path) || 'https://via.placeholder.com/300x450/333/fff?text=No+Image'
          }}
          style={styles.poster}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {movie.title}
      </Text>
      {showRating && (
        <View style={styles.ratingContainer}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.rating}>
            {movie.vote_average.toFixed(1)}/10
          </Text>
        </View>
      )}
      <Text style={styles.year}>
        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 20,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  poster: {
    width: '100%',
    height: cardWidth * 1.5,
    backgroundColor: Colors.dark[100],
  },
  title: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  star: {
    fontSize: 12,
    marginRight: 4,
  },
  rating: {
    color: Colors.light[200],
    fontSize: 12,
    fontWeight: '500',
  },
  year: {
    color: Colors.gray,
    fontSize: 12,
  },
});