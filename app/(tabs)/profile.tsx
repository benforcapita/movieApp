import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, TrendingUp as Trending, Star, Film, Award } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function ProfileScreen() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  const StatCard = ({ icon, label, value, color = Colors.accent }: any) => (
    <View style={styles.statCard}>
      {React.createElement(icon, { color, size: 24 })}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuButton = ({ icon, label, onPress }: any) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <View style={styles.menuIcon}>
        {React.createElement(icon, { color: Colors.accent, size: 20 })}
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.accent + '20', Colors.primary]}
          style={styles.header}
        >
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[Colors.accent, Colors.light[100]]}
                style={styles.avatar}
              >
                <User color={Colors.white} size={32} />
              </LinearGradient>
            </View>
            <Text style={styles.userName}>Movie Enthusiast</Text>
            <Text style={styles.userEmail}>movieflex@example.com</Text>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard icon={Film} label="Movies Watched" value="127" />
          <StatCard icon={Star} label="Avg Rating" value="8.2" />
          <StatCard icon={Award} label="Top Genre" value="Action" />
          <StatCard icon={Trending} label="This Month" value="23" />
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <MenuButton
            icon={Settings}
            label="Settings & Preferences"
            onPress={() => console.log('Settings pressed')}
          />
          
          <MenuButton
            icon={Star}
            label="My Reviews & Ratings"
            onPress={() => console.log('Reviews pressed')}
          />
          
          <MenuButton
            icon={Trending}
            label="Watch History"
            onPress={() => console.log('History pressed')}
          />
          
          <MenuButton
            icon={Film}
            label="Recommended for You"
            onPress={() => console.log('Recommendations pressed')}
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Movie Flex</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            Your gateway to the world of cinema. Discover trending movies, 
            search your favorites, and build your personal collection.
          </Text>
        </View>

        {/* Coming Soon Notice */}
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>
            🚀 Coming Soon: User authentication, personalized recommendations, 
            and social features powered by Appwrite
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
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
  },
  userEmail: {
    fontSize: 14,
    color: Colors.light[200],
    fontFamily: 'Inter_400Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: Colors.dark[100],
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 8,
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light[200],
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark[100],
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.accent + '20',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: Colors.white,
    fontFamily: 'Inter_400Regular',
  },
  menuArrow: {
    fontSize: 20,
    color: Colors.gray,
    fontWeight: 'bold',
  },
  appInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  appVersion: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 12,
    fontFamily: 'Inter_400Regular',
  },
  appDescription: {
    fontSize: 14,
    color: Colors.light[200],
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  comingSoon: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  comingSoonText: {
    fontSize: 12,
    color: Colors.light[200],
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
  },
  bottomPadding: {
    height: 120,
  },
});