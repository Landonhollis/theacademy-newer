import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, FlatList, TouchableOpacity, View, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import AppContent from "./components/screens/appContent";
import ProfilePage from "./components/screens/profile";
import { fetchCreatorByCreatorId } from "../services/GET";
import * as Crypto from 'expo-crypto';

export default function Creator() {
  const params = useLocalSearchParams();
  const userId = params.userId as string;

  if (!userId) return null;
  const { width } = useWindowDimensions();

  const goToAddApp = () => {
      router.push(`/creator/addDeleteApps/addAppModal/${userId}`);
    };
  const goToDeleteApp = () => {
    router.push(`/creator/addDeleteApps/deleteAppModal/${userId}`);
  };

  const isBigScreen = width > 500;
  const [ menuShown, setMenuShown ] = useState(width > 500);

  useEffect(() => {
    setMenuShown(width > 500);
  }, [width]);

  const [appShown, setAppShown] = useState<string | undefined>(undefined);
  const [freeApps, setFreeApps] = useState<any[]>([]); // Using any[] for now, consider defining an AppItem interface
  const [paidApps, setPaidApps] = useState<any[]>([]); // Using any[] for now, consider defining an AppItem interface

  useEffect(() => {
    const fetchCreatorAndApps = async () => {
      if (!userId) return;
      try {
        const creatorData = await fetchCreatorByCreatorId(userId);
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

  const [currentAppIsPaid, setCurrentAppIsPaid] = useState(false);


  



  return (
    <View style={{ flex: 1, flexDirection: "row"}}>


      
      { menuShown ? (
        <View style={isBigScreen ? styles.bigScreenMenuShown : styles.smallScreenMenuShown}>
          <View style={styles.toggle}>
            <Text style={styles.menuText}>{userId.toString().slice(0, 8)+'...'}</Text>
            <TouchableOpacity style={styles.toggleButton} onPress={() => setMenuShown(!menuShown)}>
              <Text style={styles.menuText}>toggle button</Text>
            </TouchableOpacity>
          </View>
    
          <View style={styles.profileButton}>
            <TouchableOpacity onPress={() => setAppShown(undefined)}>
            <Text style={styles.menuText}>My Profile</Text>
            </TouchableOpacity>
          </View>
    


          <View style={styles.appsContainer}>
            <Text style={styles.menuText}>Free Apps</Text>
            <FlatList 
              data={freeApps}
              keyExtractor={(app) => app.appId} // Assumes app objects in freeApps have 'appId'
              renderItem = {({item}) => (
                <TouchableOpacity style={styles.appButton} onPress={() => {setAppShown(item.appId); setCurrentAppIsPaid(false);}}>
                  <View style={styles.buttonTextContainer}>
                    <Text>{item.appTitle}</Text> {/* Assumes app objects in freeApps have 'appTitle' */}
                  </View>
                </TouchableOpacity>
              )}
            />
            <View style={styles.menuDividerBar} />
            <Text style={styles.menuText}>Paid Apps</Text>
            <FlatList 
              data={paidApps}
              keyExtractor={(app) => app.appId} // Assumes app objects in paidApps have 'appId'
              renderItem = {({item}) => (
                <TouchableOpacity style={styles.appButton} onPress={() => {setAppShown(item.appId); setCurrentAppIsPaid(true);}}>
                  <View style={styles.buttonTextContainer}>
                    <Text>{item.appTitle}</Text> {/* Assumes app objects in paidApps have 'appTitle' */}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>


    
          <View style={styles.addDeleteAppContainer}>
            <TouchableOpacity onPress={goToAddApp}>
              <Text style={styles.menuText}>Add App</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToDeleteApp}>
              <Text style={styles.menuText}>Delete App</Text>
            </TouchableOpacity>
          </View>
        </View>

      ) : (
 
        <View style={isBigScreen ? styles.bigScreenMenuHidden : styles.smallScreenMenuHidden}>
          <TouchableOpacity onPress={() => setMenuShown(!menuShown)}>
            <Text style={styles.menuText}>Menu</Text>
          </TouchableOpacity>
        </View>
      )}



      <View style={isBigScreen ? menuShown ? styles.bigScreenContentMenuShown : styles.bigScreenContentMenuHidden : styles.smallScreenContent}>
        {appShown ? <AppContent appId={appShown.toString()} userId={userId as string} appIsPaid={currentAppIsPaid} crypto={Crypto} /> : <ProfilePage userId={userId} />}
      </View>



    </View>
  );
}


const styles = StyleSheet.create({
  buttonTextContainer: {
    alignItems: 'center', 
  }, 
  menuDividerBar: {
    width: '100%',
    height: 2,
    backgroundColor: 'black',
  }, 
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
  smallScreenContent: {
    backgroundColor: 'lightgrey',
    flex: 1,
  }, 
  bigScreenContentMenuShown: {
    backgroundColor: 'white',
    flex: 6,
    padding: 10,
    flexDirection: 'column',
  }, 
  bigScreenContentMenuHidden: {
    backgroundColor: 'lightgrey',
    flex: 1,
  }, 
  smallScreenMenuShown: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: "30%",
    backgroundColor: 'lightgrey',
    alignItems: 'flex-start',
    flexDirection: 'column',
    zIndex: 10, 
  }, 
  smallScreenMenuHidden: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 70, 
    width: 70, 
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20, 
    borderWidth: 1,
    borderColor: 'black',
    zIndex: 10,
  }, 
  bigScreenMenuShown: {
    height: "100%",
    width: "20%",
    flex: 1, 
    backgroundColor: 'lightgrey',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  bigScreenMenuHidden: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 70, 
    width: 70, 
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20, 
    borderWidth: 1,
    borderColor: 'black',
    zIndex: 10,
  }, 
  menuText: {
    fontSize: 14,
    color: 'black',
    padding: 10,
    fontWeight: 'bold',
  },
  toggle: {
    width: '100%',
    flex: 1, 
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: 'black',  
  }, 
  toggleButton: {
    width: '80%', 
    height: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  profileButton: {
    width: '100%',
    flex: 1,
  }, 
  appsContainer: {
    width: '100%',
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    flexDirection: 'column',
    alignSelf: 'center', 
  }, 
  addDeleteAppContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: 'lightgrey',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
  },
});
