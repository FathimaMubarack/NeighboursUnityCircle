import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import apiClient from "../ApiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(""); 
  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      return Alert.alert("Error", "You need to be logged in to create an event.");
    }

    try {
     
      const eventDate = new Date(date);
      if (isNaN(eventDate.getTime())) {
        return Alert.alert("Error", "Please enter a valid date.");
      }

      const response = await apiClient.post("/createEvent", {
        title,
        description,
        date: eventDate.toISOString(), 
        token,
      });

      if (response.status === 201) {
        Alert.alert("Success", "Event created successfully!");
      } else {
        Alert.alert("Error", "Failed to create event.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while creating the event.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />
      <Button title="Create Event" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default CreateEvent;
