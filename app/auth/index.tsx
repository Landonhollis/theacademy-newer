import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView } from 'react-native';
import { fetchCreatorRecord, fetchStudentRecord } from '../services/GET';
import { doesCreatorExist, doesStudentExist } from '../services/GET';

export default function Auth() {

  const [incorrectLogin, setIncorrectLogin] = useState(false);

  const goToStudentSignup = () => {
    router.push('/auth/studentSignup');
  };

  const goToCreatorSignup = () => {
    router.push('/auth/creatorSignup');
  };

  const goToStudentHomePage = (StudentId: string) => {
    router.push(`/student/${StudentId}`);
  };

  const goToCreatorHomePage = (CreatorId: string) => {
    router.push(`/creator/${CreatorId}`);
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleStudentSubmit = () => {
    fetchStudentRecord(email, password).then((data) => {
      if (data) {
        goToStudentHomePage(data.studentId);
      } else {
        setIncorrectLogin(true);
      }
    });
  }

  const handleCreatorSubmit = () => {
    fetchCreatorRecord(email, password).then((data) => {
      if (data) {
        goToCreatorHomePage(data.creatorId);
      } else {
        setIncorrectLogin(true);
      }
    });
  }



  return (
    <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>

      <Text style={{fontSize: 30, marginBottom: 10, fontWeight: 'bold'}}>hello</Text>
      {incorrectLogin && <Text style={{color: 'red', marginBottom: 20, textAlign: 'center'}}>Incorrect login credentials</Text>}


      <View style={{marginBottom: 20, flexDirection: 'column', justifyContent: 'space-around', width: '100%', alignItems: 'center'}}>

      <TextInput style={{marginBottom: 20, borderWidth: 2, width: '80%', alignItems: 'center', height: 40}} placeholder="Email" placeholderTextColor='black' value={email} onChangeText={setEmail}/>
      <TextInput style={{marginBottom: 20, borderWidth: 2, width: '80%', alignItems: 'center', height: 40}} placeholder="Password" placeholderTextColor='black' value={password} onChangeText={setPassword}/>

      <TouchableOpacity style={{marginBottom: 20, borderWidth: 2, width: '80%', alignItems: 'center'}} onPress={handleStudentSubmit}>
        <Text style={{fontSize: 20, margin: 10}}>Student Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{marginBottom: 20, borderWidth: 2, width: '80%', alignItems: 'center'}} onPress={handleCreatorSubmit}>
        <Text style={{fontSize: 20, margin: 10}}>Creator Sign In</Text>
      </TouchableOpacity>

      </View>






      <TouchableOpacity style={{marginBottom: 20, borderWidth: 2}} onPress={goToStudentSignup}>
        <Text style={{color: 'black', fontSize: 20, padding: 10}}>Student Signup</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{marginBottom: 20, borderWidth: 2}} onPress={goToCreatorSignup}>
        <Text style={{color: 'black', fontSize: 20, padding: 10}}>Creator Signup</Text>
      </TouchableOpacity>

    </KeyboardAvoidingView>
  );
}
