import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import React from 'react';

import { deleteContent } from '../../services/PATCH';

interface ContentThumbnailProps {
  contentTitle: string;
  contentDescription: string;
  contentId: string;
  appIsPaid: boolean;
  appId: string;
  recordId: string;
  onDeleteSuccess: () => void;
}

export default function ContentThumbnail({
  contentTitle,
  contentDescription,
  contentId,
  appIsPaid,
  appId,
  recordId,
  onDeleteSuccess
}: ContentThumbnailProps) {
  const handleDelete = async () => {
    try {
      await deleteContent(appIsPaid, appId, recordId, contentId);
      onDeleteSuccess();
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const handleEdit = () => {
    console.log('edit content', contentId);
  }
    
  return (
    <View style={styles.container}>
      <Text style={styles.contentTitle}>{contentTitle}</Text>
      <Text style={styles.contentDescription}>{contentDescription}</Text>
      <View style={styles.addAndDeleteContainer}>
        <TouchableOpacity style={styles.deleteContentContainer} onPress={handleDelete}>
          <Text style={styles.deleteContentText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editContentContainer} onPress={handleEdit}>
          <Text style={styles.editContentText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 175,
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contentDescription: {
    fontSize: 16,
    color: 'grey',
  },
  addAndDeleteContainer: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteContentContainer: {
    width: '40%',
    height: 35,
    backgroundColor: 'grey',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteContentText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
  },
  editContentContainer: {
    width: '40%',
    height: 35,
    backgroundColor: 'grey',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editContentText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'blue',
  },
})