import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getRecordIdFromCreatorId } from '../../../services/GET';
import { useState } from 'react';
import * as Crypto from 'expo-crypto';
import { addPaidApp } from '../../../services/PATCH';
import { addFreeApp } from '../../../services/PATCH';




export default function addAppModal() {

  const { userId } = useLocalSearchParams();
  const recordId = async() => {return await getRecordIdFromCreatorId(userId as string)};

  const goBack = () => {
    router.back();
  };


  const [isPaidApp, setIsPaidApp] = useState(false);
  const toggleSwitch = () => setIsPaidApp((previousState) => !previousState);
  const [appTitle, setAppTitle] = useState('');
  const [description, setDescription] = useState('');
  const content: any[] = [];

  const getAppId = async () => {return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${Date.now()}-${Math.random()}`)};

  const newAppData = async() => {
    const appId = (await getAppId()).toString();

    return {
      appTitle,
      description,
      content,
      appId, 
      isPaidApp, 
    }
  }
  
  const initiateSubmitApp = async(userId: string, recordId: string, newAppData: any) => {
    console.log(recordId);
    console.log(newAppData);

    if (isPaidApp) {
      try {
        await addPaidApp(userId as string, recordId as string, newAppData);
        router.back();
      } catch (error) {
        console.log("error in initiateSubmitApp function", error);
      }
    } else {
      try {
        await addFreeApp(userId as string, recordId, newAppData);
        router.back();
      } catch (error) {
        console.log("error in initiateSubmitApp function", error);
      }
    }
  }
  


  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>




      <View style={styles.container}>
        <Text style={[styles.label, !isPaidApp && styles.activeLabel]}>
          Free App
        </Text>

        <Switch
          trackColor={{ false: '#ccc', true: '#C9A227' }} // Light gray for off, gold for on
          thumbColor={isPaidApp ? '#fff' : '#fff'}
          ios_backgroundColor="#ccc"
          onValueChange={toggleSwitch}
          value={isPaidApp}
          style={styles.switch}
        />

        <Text style={[styles.label, isPaidApp && styles.activeLabel]}>
          Paid App
        </Text>
      </View>


      
      <TextInput placeholder="Title" value={appTitle} onChangeText={setAppTitle} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />

      

      <TouchableOpacity onPress={async() => {try {await initiateSubmitApp(userId as string, await recordId(), await newAppData())} catch (error) {console.log(error)}}} style={{ marginBottom: 20, borderWidth: 2, padding: 10, backgroundColor: '#ddd' }}>
        <Text>Submit App Form</Text>
      </TouchableOpacity>




      <TouchableOpacity onPress={goBack} style={{ marginBottom: 20, borderWidth: 2, padding: 10, backgroundColor: '#ddd' }}>
        <Text>Back</Text>
      </TouchableOpacity>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  label: {
    fontSize: 16,
    color: '#9A9A9A', // inactive
  },
  activeLabel: {
    color: '#000', // active text color
    fontWeight: '600',
  },
  switch: {
    marginHorizontal: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '70%', 
    alignSelf: 'center',
  },
});