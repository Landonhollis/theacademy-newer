import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchCreatorByCreatorId, getRecordIdFromCreatorId } from '../../../services/GET';
import { deleteFreeApp, deletePaidApp } from '../../../services/PATCH';

export default function DeleteAppModal() {

  const { userId } = useLocalSearchParams();
  const navigation = useNavigation();
  const recordId = async() => {return await getRecordIdFromCreatorId(userId as string)};

  const goBack = () => {
    router.back();
  };

  const [freeApps, setFreeApps] = useState<any[]>([]); // Using any[] for now, consider defining an AppItem interface
  const [paidApps, setPaidApps] = useState<any[]>([]); // Using any[] for now, consider defining an AppItem interface

  useEffect(() => {
    const fetchCreatorAndApps = async () => {
      if (!userId) return;
      try {
        const creatorData = await fetchCreatorByCreatorId(userId as string);
        if (creatorData) {
          const parsedFreeApps = creatorData.freeContent;
          setFreeApps(parsedFreeApps);

          const parsedPaidApps = creatorData.paidContent;
          setPaidApps(parsedPaidApps);
        } else {
          // Handle case where creatorData is not found or null
          setFreeApps([]);
          setPaidApps([]);
        }
      } catch (error) {
        console.error("Error fetching creator data and apps:", error);
        // Set to empty arrays on error to prevent crashes
        setFreeApps([]);
        setPaidApps([]);
      }
    };
  
    fetchCreatorAndApps();
  }, [userId]); // Re-fetch if userId changes

  return (
    <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text>Free Apps</Text>
          <FlatList 
            data={freeApps}
            keyExtractor={(app) => app.appId} // Assumes app objects in freeApps have 'appId'
            renderItem = {({item}) => (
              <TouchableOpacity style={styles.appButton} onPress={async() => {
                const recordId = await getRecordIdFromCreatorId(userId as string);
                await deleteFreeApp(userId as string, recordId as string, item.appId as string);
                router.back();
              }}>
                <View style={styles.buttonTextContainer}>
                  <Text>{item.appTitle}</Text> {/* Assumes app objects in freeApps have 'appTitle' */}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text>Paid Apps</Text>
          <FlatList 
            data={paidApps}
            keyExtractor={(app) => app.appId} // Assumes app objects in paidApps have 'appId'
            renderItem = {({item}) => (
              <TouchableOpacity style={styles.appButton} 
                onPress={async() => {
                  const recordId = await getRecordIdFromCreatorId(userId as string);
                  await deletePaidApp(userId as string, recordId as string, item.appId as string);
                  router.back();
                }}>
                <View style={styles.buttonTextContainer}>
                  <Text>{item.appTitle}</Text> {/* Assumes app objects in paidApps have 'appTitle' */}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <TouchableOpacity onPress={goBack} style={{ marginBottom: 20, borderWidth: 2, padding: 10, backgroundColor: '#ddd' }}>
        <Text>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  appButton: {
    width: '80%', 
    height: 50, 
    borderRadius: 5, 
    borderWidth: 2, 
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5, 
  }, 
  buttonTextContainer: {
    alignItems: 'center', 
  }, 
});
