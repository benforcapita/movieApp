import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Bookmark, Heart, Star } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function SavedScreen() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved Movies</Text>
          <Text style={styles.subtitle}>Your favorite films in one place</Text>
        </View>

        <View style={styles.emptyContainer}>
          <View style={styles.iconContainer}>
            <Bookmark color={Colors.accent} size={48} />
            <Heart color={Colors.error} size={24} style={styles.heartIcon} />
          </View>
          
          <Text style={styles.emptyTitle}>No Saved Movies Yet</Text>
          <Text style={styles.emptyDescription}>
            Start exploring and save your favorite movies to build your personal collection. 
            Your saved films will appear here for easy access.
          </Text>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Star color={Colors.accent} size={20} />
              <Text style={styles.featureText}>Save movies for later viewing</Text>
            </View>
            <View style={styles.featureItem}>
              <Bookmark color={Colors.accent} size={20} />
              <Text style={styles.featureText}>Create your personal watchlist</Text>
            </View>
            <View style={styles.featureItem}>
              <Heart color={Colors.accent} size={20} />
              <Text style={styles.featureText}>Mark your all-time favorites</Text>
            </View>
          </View>

          <Text style={styles.comingSoon}>
            💫 Coming Soon: Full bookmark functionality with Appwrite integration
          </Text>
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
  content: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light[200],
    fontFamily: 'Inter_400Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  heartIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    fontFamily: 'Inter_400Regular',
  },
  featureList: {
    alignSelf: 'stretch',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark[100],
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureText: {
    color: Colors.white,
    fontSize: 16,
    marginLeft: 16,
    fontFamily: 'Inter_400Regular',
  },
  comingSoon: {
    fontSize: 14,
    color: Colors.light[200],
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Inter_400Regular',
  },
  bottomPadding: {
    height: 120,
  },
});