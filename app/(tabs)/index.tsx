import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { useFetch } from '@/hooks/useFetch';
import { tmdbApi } from '@/services/tmdbApi';
import { appwriteService } from '@/services/appwriteConfig';
import MovieCard from '@/components/MovieCard';
import TrendingCard from '@/components/TrendingCard';
import { Movie, MovieResponse, TrendingMovie } from '@/types/movie';

export default function HomeScreen() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const {
    data: moviesData,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useFetch<MovieResponse>(() => tmdbApi.getPopularMovies());

  const {
    data: trendingData,
    loading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
  } = useFetch<TrendingMovie[]>(() => appwriteService.getTrendingMovies());

  const handleRefresh = () => {
    refetchMovies();
    refetchTrending();
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  const renderMovieCard = ({ item }: { item: Movie }) => (
    <MovieCard movie={item} />
  );

  const renderTrendingCard = ({ item }: { item: TrendingMovie }) => (
    <TrendingCard movie={item} />
  );

  const ListEmptyComponent = ({ title }: { title: string }) => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={moviesLoading && trendingLoading}
            onRefresh={handleRefresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={[Colors.dark[200], Colors.primary]}
          style={styles.header}
        >
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(3, 0, 20, 0.9)']}
            style={styles.headerGradient}
          />
          <View style={styles.headerContent}>
            <Text style={styles.appTitle}>Movie Flex</Text>
            <Text style={styles.headerSubtitle}>Discover trending movies</Text>
          </View>
        </LinearGradient>

        {/* Trending Movies Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          {trendingLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.accent} />
            </View>
          ) : trendingError ? (
            <Text style={styles.errorText}>Failed to load trending movies</Text>
          ) : (
            <FlatList
              data={trendingData || []}
              renderItem={renderTrendingCard}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingList}
              ListEmptyComponent={() => <ListEmptyComponent title="No trending movies available" />}
            />
          )}
        </View>

        {/* Latest Movies Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Movies</Text>
          {moviesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.accent} />
            </View>
          ) : moviesError ? (
            <Text style={styles.errorText}>Failed to load movies</Text>
          ) : (
            <View style={styles.moviesGrid}>
              {moviesData?.results?.slice(0, 12).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </View>
          )}
        </View>

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  header: {
    height: 300,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  headerContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.white,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light[200],
    fontFamily: 'Inter_400Regular',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 20,
    fontFamily: 'Inter_700Bold',
  },
  trendingList: {
    paddingLeft: 0,
  },
  moviesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: Colors.gray,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  bottomPadding: {
    height: 120,
  },
});