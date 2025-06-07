import { Text, View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { addStudentRecord } from '../services/POST';
import { doesStudentExist } from '../services/GET';
import * as Crypto from 'expo-crypto';

export default function StudentSignup() {

  const replaceTextInputs = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setError('');
    setSignupSuccess(true);
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const exists = doesStudentExist(email, password);

  const handleSubmit = async () => {
    if (await exists) {
      setError('An account with this email already exists. Please login or use a different email or password.'); 
      return; 
    } else  if (firstName === '' || lastName === '' || email === '' || password === '') {
      setError('All fields are required.');
      return;
    } else {
      try {
        const studentId = await Crypto.randomUUID();
        const freeFollowing = JSON.stringify([]);
        const paidFollowing = JSON.stringify([]);
        const studentData = {
          fields: {
            firstName,
            lastName,
            studentId,
            email,
            password,
            freeFollowing,
            paidFollowing,
          },
        };

        await addStudentRecord(studentData);
        replaceTextInputs();
        setTimeout(() => {
          router.replace('/');
        }, 1000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create account. Please try again.');
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Student Signup</Text>
      
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
