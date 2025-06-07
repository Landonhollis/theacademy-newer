import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addCreatorRecord } from '../services/POST';
import { doesCreatorExist } from '../services/GET';



export default function CreatorSignup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const exists = async () => await doesCreatorExist(email, password);

  const handleSubmit = async () => {
    if (firstName === '' || lastName === '' || email === '' || password === '') {
      setError('All fields are required.');
      return;
    } else if (await exists()) {
      setError('An account with this email already exists. Please login or use a different email or password.'); 
      return; 
    } else {
      try {
        const creatorId = await Crypto.randomUUID();
        const creatorData = {
          fields: {
            firstName,
            lastName,
            creatorId,
            email,
            password,
            freeContent: JSON.stringify([]), 
            paidContent: JSON.stringify([]), 
          },
        };

        await addCreatorRecord(creatorData);
        setSignupSuccess(true);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setError('');

        setTimeout(() => {
          router.replace('/');
        }, 1000);
      } catch (err) {
        console.error('Error during account creation:', err);
        setError(err instanceof Error ? err.message : 'Failed to create account. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Creator Signup</Text>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      {signupSuccess && <Text style={styles.successText}>Account created successfully!</Text>}

      <TextInput 
        placeholder="First Name" 
        placeholderTextColor='black' 
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />
      
      <TextInput 
        placeholder="Last Name" 
        placeholderTextColor='black' 
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />
      
      <TextInput 
        placeholder="Email" 
        placeholderTextColor='black' 
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput 
        placeholder="Password" 
        placeholderTextColor='black' 
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Form</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  button: {
    marginBottom: 20,
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'lightgrey', 
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  titleText: {
    fontSize: 30,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    marginBottom: 20,
    textAlign: 'center',
  },
});
