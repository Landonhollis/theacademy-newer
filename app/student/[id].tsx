import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";


export default function Student() {
  const { id } = useLocalSearchParams();
  const [ mainContent, setMainContent ] =  useState(profile);

  return (
    if (mainContent === profile) {
      <Text>Profile</Text>
    } else if (mainContent === search){
      <Text>Search</Text>
    } else if (mainContent === pageNotFound){
      <Text>Page Not Found</Text>
    } else {
      
    }
    
  );
}