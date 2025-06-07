import ContentThumbnail from "../components";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { getRecordIdFromCreatorId, fetchCreatorApp } from "../../../services/GET";
import { addContentToApp } from "../../../services/PATCH";

interface ContentItemThumbnail {
  contentId: string;
  title: string;
  description: string;
}

interface ContentThumbnailProps extends ContentItemThumbnail {
  appIsPaid: boolean;
  appId: string;
  recordId: string;
  onDeleteSuccess: () => void;
}

interface AppContentProps {
  appId: string;
  userId: string;
  appIsPaid: boolean;
}

interface AppContentProps {
  appId: string;
  userId: string;
  appIsPaid: boolean;
  crypto: typeof import('expo-crypto');
}

export default function AppContent({ appId, userId, appIsPaid, crypto }: AppContentProps) {
  const [appContent, setAppContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [recordId, setRecordId] = useState<string | null>(null);

  useEffect(() => {
    const loadRecordId = async () => {
      try {
        const id = await getRecordIdFromCreatorId(userId);
        setRecordId(id);
        if (id) {
          loadAppContent(id);
        }
      } catch (error) {
        console.error('Error loading record ID:', error);
      }
    };
    loadRecordId();
  }, [userId]);

  const loadAppContent = async (recordId: string) => {
    try {
      if (!recordId) return;
      const content = await fetchCreatorApp(appId, recordId, appIsPaid);
      setAppContent(content);
    } catch (error) {
      console.error('Error loading app content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recordId) {
      loadAppContent(recordId);
    }
  }, [appId, appIsPaid, recordId]);

  const [addingContent, setAddingContent] = useState(false);
  const navigateToContent = (contentId: string) => {
    const contentInfo = {contentId, appId}
    router.push(`./${contentInfo}`)
  }

  const clearInputs = () => {
    setTitle('');
    setDescription('');
    setBody('');
  }


  return (
      <View style={styles.appContainer}>
        {!addingContent && (
          <View style={styles.appContentContainer}>
            <Text style={styles.appTitle}>{appContent?.appTitle}</Text>
            <TouchableOpacity style={styles.addContentButtonContainer} onPress={() => setAddingContent(true)}>
              <Text style={styles.addContentButtonText}>Add Content</Text>
            </TouchableOpacity>
            <FlatList 
              style={styles.flatList}
              data={appContent?.content}
              renderItem={({item}) => (
                <ContentThumbnail 
                  contentTitle={item.title} 
                  contentDescription={item.description} 
                  contentId={item.contentId} 
                  appIsPaid={appIsPaid}
                  appId={appId}
                  recordId={recordId || ''} // Provide empty string if recordId is null
                  onDeleteSuccess={() => {
                    // Refresh the app content after deletion
                    if (recordId) {
                      loadAppContent(recordId);
                    }
                  }}
                />
              )}
              keyExtractor={(item: ContentItemThumbnail) => item.contentId}  
            />
          </View>
        )}
        {addingContent && (
          <ScrollView style={styles.addContentContainer}>
            <TextInput style={styles.titleInput} placeholderTextColor='black' placeholder="Content Title" onChangeText={setTitle} value={title}/>
            <TextInput style={styles.descriptionInput} placeholderTextColor='black' placeholder="Content Description" onChangeText={setDescription} value={description}/>
            <TextInput style={styles.bodyInput} placeholderTextColor='black' placeholder="Content Body" onChangeText={setBody} value={body}/>
            <TouchableOpacity style={styles.addContentButtonContainer} onPress={async() => {
              const newContentId = await crypto.digestStringAsync(crypto.CryptoDigestAlgorithm.SHA256, `${Date.now()}-${Math.random()}`);
              await addContentToApp(appIsPaid, appId, recordId, newContentId, title, description, body);
              clearInputs();
              setAddingContent(false);
            }}>
              <Text style={styles.addContentButtonText}>Add Content</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButtonContainer} onPress={() => setAddingContent(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
  )
}

const styles = StyleSheet.create({
  titleInput: {
    width: '80%', 
    flex: 1, 
    backgroundColor: 'lightgrey', 
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2, 
    padding: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: 'black', 
    textAlignVertical: 'top',
  }, 
  descriptionInput: {
    width: '80%', 
    flex: 2, 
    backgroundColor: 'lightgrey', 
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2, 
    padding: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: 'black', 
    textAlignVertical: 'top',
  }, 
  bodyInput: {
    width: '80%', 
    flex: 8, 
    backgroundColor: 'lightgrey', 
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2, 
    padding: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: 'black', 
    textAlignVertical: 'top',
  }, 
  addContentButtonContainer: {
    width: '60%', 
    height: 40, 
    backgroundColor: 'grey',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addContentButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    height: '100%',
    width: '100%',
  },
  appContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  flatList: {
    width: '100%',
    height: '80%',
  },
  addContentContainer: {
    width: '100%',
    backgroundColor: 'grey',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  addContentButtonContainer: {
    width: '80%',
    height: 40,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonContainer: {
    width: '80%',
    height: 40,
    backgroundColor: '#f44336',
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleInput: {
    width: '80%',
    height: 40,
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
  },
  descriptionInput: {
    width: '80%',
    height: 40,
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
  },
  bodyInput: {
    width: '80%',
    height: 120,
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
})