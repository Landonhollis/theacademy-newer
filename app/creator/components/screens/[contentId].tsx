import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getContentContent } from "../../../services/GET";






export default function ContentScreen() {
  const contentData = useLocalSearchParams();
  const contentContents = getContentContent(contentData.contentId as string, contentData.appId as string);

  const goBack = () => {
    router.back();
  }
  
  return (
    <View style={styles.viewContentContentContainer}>
      <View style={styles.titleAndBackButtonContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.contentTitle}>{contentContents?.title}</Text>
        </View>
        <TouchableOpacity style={styles.backButtonContainer} onPress={goBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.contentDescription}>{contentContents?.description}</Text>
      <Text style={styles.contentBody}>{contentContents?.body}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  viewContentContentContainer: {
    flex: 1,
    margin: 10, 
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    height: '100%',
    width: '100%',
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contentDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  contentBody: {
    fontSize: 16,
    marginBottom: 10,
  },
  titleAndBackButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  backButtonContainer: {
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
})
  