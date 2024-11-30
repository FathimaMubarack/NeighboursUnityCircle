import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { useNavigation } from "expo-router";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import apiClient from "../ApiConfig";

const CreateCampaign = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requestedGoods, setRequestedGoods] = useState([
    { name: "", quantity: 0 },
  ]);

  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const base64Image = `data:image/png;base64,${result.assets[0].base64}`;
      setImageURL(base64Image);
    }
  };

  if (hasGalleryPermission === false) {
    return <Text>No Access to internal Storage</Text>;
  }

  const addGoodField = () => {
    setRequestedGoods([...requestedGoods, { name: "", quantity: 0 }]);
  };

  const handleInputChange = (index, field, value) => {
    const newGoods = [...requestedGoods];
    newGoods[index][field] = value;
    setRequestedGoods(newGoods);
  };

  const handleSubmitCreateCampaign = async () => {
    const token = await AsyncStorage.getItem("token");
    const campaignData = {
      token,
      title,
      description,
      requestedGoods,
      imageURL,
    };

    apiClient
      .post("/createCampaign", campaignData)
      .then((res) => {
        if (res.data.message === "Campaign created successfully") {
          console.log(res.data);
          alert("Campaign created successfully!");
          navigation.navigate("Campaigns");
        } else {
          console.error(res.data.error);
          alert(res.data.error || "Failed to create campaign.");
        }
      })
      .catch((err) => {
        console.error("Error creating campaign:", err);
        alert("An error occurred. Please try again.");
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create New Campaign</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      {requestedGoods.map((good, index) => (
        <View key={index} style={styles.goodContainer}>
          <TextInput
            style={styles.input}
            placeholder="Good Name"
            value={good.name}
            onChangeText={(value) => handleInputChange(index, "name", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            keyboardType="numeric"
            value={good.quantity.toString()}
            onChangeText={(value) =>
              handleInputChange(index, "quantity", parseInt(value) || 0)
            }
          />
        </View>
      ))}
      <TouchableOpacity onPress={() => pickImage()} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={addGoodField}>
        <Text style={styles.addButtonText}>+ Add More Goods</Text>
      </TouchableOpacity>
      <Button title="Create Campaign" onPress={handleSubmitCreateCampaign} />
      <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  goodContainer: {
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 15,
  },
  addButtonText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 15,
    alignItems: "center",
  },
  cancelText: {
    color: "#FF6347",
    fontWeight: "bold",
  },
});

export default CreateCampaign;
