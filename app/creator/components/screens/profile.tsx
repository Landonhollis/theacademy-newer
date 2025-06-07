import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fetchCreatorByCreatorId } from "../../../services/GET";



interface ProfilePageProps {
  userId: string;
}

export default function ProfilePage({ userId }: ProfilePageProps) {
  const [user, setUser] = useState<any>(null); // Consider defining a User type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError('User ID is missing.');
      return;
    }

    const loadUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedUser = await fetchCreatorByCreatorId(userId);
        setUser(fetchedUser);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Error fetching user data');
      }
      setLoading(false);
    };

    loadUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.name}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.name}>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.name}>{user.firstName + ' ' + user.lastName}</Text>
      <Text style={styles.email}>{user.email}</Text>
      {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    height: '100%',
    width: '100%',
    paddingHorizontal: 20, 
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16, 
    textAlign: 'center',
  },
  bio: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20, 
  },
})



