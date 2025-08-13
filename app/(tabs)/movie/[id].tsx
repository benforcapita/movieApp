import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Star, Clock, DollarSign, Calendar, Users } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useFetch } from '@/hooks/useFetch';
import { tmdbApi } from '@/services/tmdbApi';
import { Movie } from '@/types/movie';

const { width, height } = Dimensions.get('window');

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const {
    data: movie,
    loading,
    error,
  } = useFetch<Movie>(() => tmdbApi.getMovieDetails(parseInt(id!)), [id]);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load movie details</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const MovieInfoCard = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <View style={styles.infoCard}>
      <View style={styles.infoIcon}>
        {React.createElement(icon, { color: Colors.accent, size: 20 })}
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with backdrop image */}
        <View style={styles.header}>
          <Image
            source={{
              uri: tmdbApi.getImageUrl(movie.backdrop_path || movie.poster_path, 'original') || 
                   'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            }}
            style={styles.backdropImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(3, 0, 20, 0.9)']}
            style={styles.backdropGradient}
          />
          
          {/* Back button */}
          <TouchableOpacity style={styles.backButtonContainer} onPress={() => router.back()}>
            <View style={styles.backButtonBackground}>
              <ArrowLeft color={Colors.white} size={24} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Movie Info */}
        <View style={styles.content}>
          <View style={styles.movieHeader}>
            <View style={styles.posterContainer}>
              <Image
                source={{
                  uri: tmdbApi.getImageUrl(movie.poster_path) || 'https://via.placeholder.com/300x450/333/fff?text=No+Image'
                }}
                style={styles.poster}
                resizeMode="cover"
              />
            </View>
            
            <View style={styles.movieInfo}>
              <Text style={styles.title}>{movie.title}</Text>
              <View style={styles.basicInfo}>
                <Text style={styles.year}>
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </Text>
                <View style={styles.rating}>
                  <Star color={Colors.accent} size={16} fill={Colors.accent} />
                  <Text style={styles.ratingText}>
                    {(movie.vote_average ?? 0).toFixed(1)}
                  </Text>
                  <Text style={styles.voteCount}>
                    ({movie.vote_count.toLocaleString()} votes)
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <View style={styles.genresContainer}>
              {movie.genres.map((genre) => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>
              {movie.overview || 'No overview available.'}
            </Text>
          </View>

          {/* Movie Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailsGrid}>
              <MovieInfoCard
                icon={Clock}
                label="Runtime"
                value={formatRuntime(movie.runtime || 0)}
              />
              <MovieInfoCard
                icon={Calendar}
                label="Release Date"
                value={movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}
              />
              <MovieInfoCard
                icon={DollarSign}
                label="Budget"
                value={formatCurrency(movie.budget || 0)}
              />
              <MovieInfoCard
                icon={DollarSign}
                label="Revenue"
                value={formatCurrency(movie.revenue || 0)}
              />
            </View>
          </View>

          {/* Production Companies */}
          {movie.production_companies && movie.production_companies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Production Companies</Text>
              <View style={styles.companiesContainer}>
                {movie.production_companies.slice(0, 6).map((company) => (
                  <View key={company.id} style={styles.companyCard}>
                    <Users color={Colors.accent} size={16} />
                    <Text style={styles.companyName}>{company.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Bottom padding */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: Colors.error,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: height * 0.5,
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.dark[100],
  },
  backdropGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  backButtonBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    backgroundColor: Colors.primary,
    marginTop: -80,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  movieHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  posterContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  poster: {
    width: 120,
    height: 180,
    backgroundColor: Colors.dark[100],
  },
  movieInfo: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 12,
    fontFamily: 'Inter_700Bold',
  },
  basicInfo: {
    marginBottom: 16,
  },
  year: {
    fontSize: 16,
    color: Colors.light[200],
    marginBottom: 8,
    fontFamily: 'Inter_400Regular',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginLeft: 6,
    fontFamily: 'Inter_700Bold',
  },
  voteCount: {
    fontSize: 14,
    color: Colors.gray,
    marginLeft: 8,
    fontFamily: 'Inter_400Regular',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  genreTag: {
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 16,
    fontFamily: 'Inter_700Bold',
  },
  overview: {
    fontSize: 16,
    color: Colors.light[200],
    lineHeight: 24,
    fontFamily: 'Inter_400Regular',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoCard: {
    backgroundColor: Colors.dark[100],
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  infoIcon: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
  },
  companiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  companyCard: {
    backgroundColor: Colors.dark[100],
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  companyName: {
    color: Colors.white,
    fontSize: 12,
    marginLeft: 6,
    fontFamily: 'Inter_400Regular',
  },
  bottomPadding: {
    height: 40,
  },
});