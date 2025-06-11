import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { getFreeFollowing, getPaidFollowing, getStudentInformation, searchCreators } from "../services/GET";
import { follow, unfollow } from "../services/PATCH";

export default function Student() {
  const { studentId } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isBigScreen = width > 500;
  const [mainContent, setMainContent] = useState('profile');
  const [menuShown, setMenuShown] = useState(width > 500);
  const [paidFollowing, setPaidFollowing] = useState<any[]>([]);
  const [freeFollowing, setFreeFollowing] = useState<any[]>([]);
  const [studentInformation, setStudentInformation] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  console.log(studentInformation);


  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) return;
      try {
        const searchResultsData = await searchCreators(searchQuery);
        setSearchResults(searchResultsData);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };
    fetchSearchResults();
  }, [searchQuery]);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!studentId) return;
      try {
        console.log(studentId);
        const paidFollowingData = await getPaidFollowing(studentId as string);
        const freeFollowingData = await getFreeFollowing(studentId as string);
        setPaidFollowing(paidFollowingData);
        setFreeFollowing(freeFollowingData);
      } catch (error) {
        console.error('Error fetching following:', error);
      }
    };
    fetchFollowing();
  }, [studentId]);

  useEffect(() => {
    const fetchStudentInformation = async () => {
      if (!studentId) return;
      try {
        console.log(studentId);
        const studentInformationData = await getStudentInformation(studentId as string);
        setStudentInformation(studentInformationData);
      } catch (error) {
        console.error('Error fetching student information:', error);
      }
    };
    fetchStudentInformation();
  }, [studentId]);

  const alreadyFreeFollowing = (creatorId: string) => {
    return freeFollowing.some((creator) => creator.fields.creatorId === creatorId);
  }

  const alreadyPaidFollowing = (creatorId: string) => {
    return paidFollowing.some((creator) => creator.fields.creatorId === creatorId);
  }

  return (
    <View style={styles.container}>
      {menuShown ? (
        <View style={isBigScreen ? styles.bigScreenMenu : styles.smallScreenMenu}>
          <View style={styles.toggle}>
            <Text style={styles.menuText}>{studentInformation?.fields.firstName + ' ' + studentInformation?.fields.lastName}</Text>
            <TouchableOpacity style={styles.toggleButton} onPress={() => setMenuShown(false)}>
              <Text style={styles.menuText}>Close Menu</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.profileAndSearchText} onPress={() => setMainContent('profile')}>Profile</Text>
            <Text style={styles.profileAndSearchText} onPress={() => setMainContent('search')}>Search</Text>
          </View>
          <View style={styles.channelsContainer}>
            <Text style={styles.channelsText}>Free channels</Text>
            <FlatList 
              style={styles.channelsList} 
              contentContainerStyle={styles.channelsContent}
              data={freeFollowing} 
              renderItem={({item}) => <TouchableOpacity style={styles.creatorContainer} onPress={() => setMainContent(item.fields.creatorId)}><Text>{item.fields.firstName}</Text></TouchableOpacity>}/>
          </View>
          <View style={styles.channelsContainer}>
            <Text style={styles.channelsText}>Paid channels</Text>
            <FlatList 
              style={styles.channelsList} 
              contentContainerStyle={styles.channelsContent}
              data={paidFollowing} 
              renderItem={({item}) => <TouchableOpacity style={styles.creatorContainer} onPress={() => setMainContent(item.fields.creatorId)}><Text>{item.fields.firstName}</Text></TouchableOpacity>}/>
          </View>
        </View>
      ) : (
        <View style={styles.menuButtonContainer}>
          <TouchableOpacity onPress={() => setMenuShown(true)}>
            <Text style={styles.menuText}>Menu</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={isBigScreen ? styles.bigScreenContent : styles.smallScreenContent}>
        {mainContent === 'profile' && 
          <ScrollView>
            <View style={styles.profilePageContainer}>
              <View style={styles.nameAndEmailContainer}>
                <Text>{studentInformation?.fields.firstName} {studentInformation?.fields.lastName}</Text>
                <Text>{studentInformation?.fields.email}</Text>
              </View>
              <Text>{studentInformation?.fields.studentId}</Text>
              <View style={styles.followingContainer}>
                <FlatList horizontal={true} data={freeFollowing} renderItem={({item}) => (     
                  <View style={styles.followingItem}>
                    <View style={styles.followingItemNameContainer}>
                      <Text>{item.fields.firstName}</Text>
                      <Text>{item.fields.lastName}</Text>
                    </View>
                    <TouchableOpacity style={styles.followingItemButtonContainer} onPress={() => unfollow(studentId as string, item.fields.creatorId)}>
                      <Text>Unfollow</Text>
                    </TouchableOpacity>
                  </View>
                )}/>
              </View>
              <View style={styles.followingContainer}>
                <FlatList horizontal={true} data={paidFollowing} renderItem={({item}) =>   (
                  <View style={styles.followingItem}>
                    <View style={styles.followingItemNameContainer}>
                      <Text>{item.fields.firstName}</Text>
                      <Text>{item.fields.lastName}</Text>
                    </View>
                    <TouchableOpacity style={styles.followingItemButtonContainer} onPress={() => unfollow(studentId as string, item.fields.creatorId)}>
                      <Text>Unfollow</Text>
                    </TouchableOpacity>
                  </View>
                )}/>
              </View>
            </View>
          </ScrollView>}
        {mainContent === 'search' && 
          <View style={styles.searchContentContainer}>
            <TextInput style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery}/>
            <View style={styles.searchResultsContainer}>
              <FlatList style={{width: '100%'}} contentContainerStyle={{ flexGrow: 1 }} data={searchResults} renderItem={({item}) => (
                <View style={styles.searchResultItem}>
                <View style={styles.searchResultItemNameContainer}>
                    <Text style={styles.searchResultItemText}>{item.fields.firstName}</Text>
                    <Text style={styles.searchResultItemText}>{item.fields.lastName}</Text>
                </View>
            
                <View style={styles.searchResultItemButtonContainer}>
                    <TouchableOpacity onPress={() => follow(studentId as string, item.fields.creatorId)}>
                        <View style={styles.followButtonContainer}>
                            <Text style={alreadyFreeFollowing(item.fields.creatorId) || alreadyPaidFollowing(item.fields.creatorId) ? styles.alreadyFollowingText : styles.followButtonText}>Subscribe for Free</Text>
                        </View>
                    </TouchableOpacity>
                            
                    <TouchableOpacity onPress={() => follow(studentId as string, item.fields.creatorId)}>
                        <View style={styles.followButtonContainer}>
                            <Text style={alreadyPaidFollowing(item.fields.creatorId) ? styles.alreadyFollowingText : styles.followButtonText}>Subscribe for Paid</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
              )}
              keyExtractor={(item) => item.fields.creatorId}
              />
            </View>
          </View>
        }
        {mainContent !== 'profile' && mainContent !== 'search' && 
          <View style={styles.creatorContainer}>
            <Text>Creator Content</Text>
          </View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alreadyFollowingText: {
    color: 'darkred',
    margin: 2, // Reduced margin
    fontSize: 12, // Increased font size
    textAlign: 'center',
  },
  followButtonText: {
    color: 'darkgreen',
    margin: 2, // Reduced margin
    fontSize: 12, // Increased font size
    textAlign: 'center',
  },
  searchResultItemNameContainer: {
    flexDirection: 'column',
    flex: 2, 
    alignItems: 'flex-start',
    paddingRight: 10, // Add some spacing
  },
  searchResultItemText: {
    fontSize: 20,
  },
  searchResultItemButtonContainer: {
    flexDirection: 'row', // Changed from 'column' to 'row'
    alignItems: 'center',
    flex: 2, // Increased from 1 to 2 for more space
    justifyContent: 'space-around', // Distribute buttons evenly
  },
  followButtonContainer: {
    backgroundColor: 'lightgrey',
    padding: 8, // Increased padding
    borderRadius: 10,
    margin: 3, // Reduced margin
    minWidth: 80, // Add minimum width
    alignItems: 'center',
  },
  searchResultItem: {
    flexDirection: 'row', 
    backgroundColor: 'white', 
    padding: 10, 
    borderWidth: 2, 
    borderColor: 'black', 
    borderRadius: 10, 
    margin: 15,
    minHeight: 80, // Add minimum height
    alignItems: 'center', // Center items vertically
  },
  searchContentContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%', 
  },
  searchResultsContainer: {
    backgroundColor: '#C0C0C0',
    padding: 10,
    flexDirection: 'column',
    alignItems: 'stretch',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    margin: 5,
    width: '100%', // Changed from 90% to 100%
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: '100%', // Changed from 65% to 100%
  },
  creatorContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  followingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    margin: 15,
    width: '100%',
    flex: 1,
  },
  followingItemButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    margin: 15,
    width: '100%',
    flex: 1,
  },
  followingItemNameContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    margin: 15,
    width: '100%',
    flex: 1,
  },
  nameAndEmailContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    margin: 15,
    width: '100%',
    flex: 1,
  },
  followingContainer: {
    height: 150,
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    margin: 15,
    width: '100%',
  },
  profilePageContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  channelsList: {
    width: '100%',
    flex: 1,
  },
  channelsContent: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  channelsText: {
    fontSize: 14,
    color: 'black',
    padding: 10,
    fontWeight: 'bold',
    backgroundColor: 'lightgrey', 
    borderRadius: 10,
    margin: 4,
  },
  container: {
    flex: 1,
  },
  bigScreenMenu: {
    height: "100%",
    width: "20%",
    backgroundColor: 'lightgrey',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  smallScreenMenu: {
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
  menuButtonContainer: {
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
  toggle: {
    width: '100%',
    height: 100, 
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
  menuText: {
    fontSize: 14,
    color: 'black',
    padding: 10,
    fontWeight: 'bold',
    backgroundColor: '#818589', 
  },
  bigScreenContent: {
    backgroundColor: 'white',
    flex: 6,
    padding: 10,
    flexDirection: 'column',
  },
  smallScreenContent: {
    backgroundColor: 'lightgrey',
    flex: 1,
  },
  menuTextContainer: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
    flexDirection: 'column',
    alignSelf: 'center', 
  },
  profileAndSearchText: {
    fontSize: 14,
    color: 'black',
    padding: 10,
    fontWeight: 'bold',
    backgroundColor: '#818589', 
    borderRadius: 10,
    margin: 4,
  },
  channelsContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#708090',
    flexDirection: 'column',
    alignSelf: 'center', 
  },
});
