import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Search as SearchIcon, X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useDebounce } from '@/hooks/useDebounce';
import { useFetch } from '@/hooks/useFetch';
import { tmdbApi } from '@/services/tmdbApi';
import { appwriteService } from '@/services/appwriteConfig';
import MovieCard from '@/components/MovieCard';
import { Movie, MovieResponse } from '@/types/movie';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 500);

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  const {
    data: searchResults,
    loading: searchLoading,
    error: searchError,
  } = useFetch<MovieResponse>(
    () => {
      if (!debouncedQuery.trim()) {
        return Promise.resolve({ results: [], page: 1, total_pages: 0, total_results: 0 });
      }
      return tmdbApi.searchMovies(debouncedQuery);
    },
    [debouncedQuery]
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    // Track search term for trending algorithm
    if (text.trim()) {
      appwriteService.trackSearchTerm(text.trim(), null);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <View style={styles.movieItem}>
      <MovieCard movie={item} />
    </View>
  );

  const renderEmptyState = () => {
    if (searchLoading) return null;
    
    if (!debouncedQuery.trim()) {
      return (
        <View style={styles.emptyContainer}>
          <SearchIcon color={Colors.gray} size={64} />
          <Text style={styles.emptyTitle}>Search for Movies</Text>
          <Text style={styles.emptySubtitle}>
            Find your favorite films, discover new releases, and explore trending content
          </Text>
        </View>
      );
    }

    if (searchResults?.results?.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your search terms or browse popular movies instead
          </Text>
        </View>
      );
    }

    return null;
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Movies</Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <SearchIcon color={Colors.accent} size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for movies..."
              placeholderTextColor={Colors.gray}
              value={searchQuery}
              onChangeText={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <X color={Colors.gray} size={20} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {searchLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : searchError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Search failed. Please try again.</Text>
          </View>
        ) : (
          <FlatList
            data={searchResults?.results || []}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyState}
            columnWrapperStyle={searchResults?.results?.length ? styles.row : undefined}
          />
        )}
      </View>

      {debouncedQuery.trim() && searchResults?.results && searchResults.results.length > 0 && (
        <View style={styles.resultsCount}>
          <Text style={styles.resultsText}>
            {searchResults.total_results} results found
          </Text>
        </View>
      )}
      <View style={styles.bottomPadding} />
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
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark[100],
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.white,
    fontFamily: 'Inter_400Regular',
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  movieItem: {
    flex: 1,
    maxWidth: '33.33%',
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Inter_400Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  loadingText: {
    color: Colors.white,
    fontSize: 16,
    marginTop: 12,
    fontFamily: 'Inter_400Regular',
  },
  resultsCount: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.dark[200],
  },
  resultsText: {
    color: Colors.light[200],
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  bottomPadding: {
    height: 100,
  },
});