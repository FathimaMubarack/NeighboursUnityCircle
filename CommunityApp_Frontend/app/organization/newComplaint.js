import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import apiClient from "../ApiConfig";

const NewComplaint = () => {

  const [userData, setUserData] = useState('');

  async function getData() {
    const token= await AsyncStorage.getItem('token');
    console.log(token);
    apiClient
      .post('/userdata',{token:token})
      .then((res) => {
        console.log(res.data);
        setUserData(res.data.data);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

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
      setImage(base64Image);
    }
  };

  if (hasGalleryPermission === false) {
    return <Text>No Access to internal Storage</Text>;
  }

  async function handleSubmit() {
    const token = await AsyncStorage.getItem("token");
    // const userId = userData._id;
    console.log(content, image);
    const complaintData = {
      token,
      content,
      image,
    };
    apiClient
      .post('/create-complaint', complaintData)
      .then((res) => {
        console.log(res.data);
      });
  }

  function handleContent(e) {
    const contentVar = e.nativeEvent.text;
    setContent(contentVar);
  }

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 10,
        }}
      >
        <Image
          style={{ width: 50, height: 50, borderRadius: 25 }}
          source={require("../../assets/images/samplePic.png")}
        />

        <Text>{userData.name}</Text>
      </View>
      <View>
        <View style={styles.complaintWrapper}>
          <TextInput
            placeholder="Type your complaint"
            style={styles.complaintInput}
            onChange={(e) => handleContent(e)}
          />
          <TouchableOpacity onPress={() => pickImage()}>
            <MaterialCommunityIcons
              name="image-plus"
              size={24}
              color="black"
              style={styles.imageIcon}
            />
          </TouchableOpacity>
        </View>
        {image && (
          <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
        )}
        <View style={styles.postButtonContainer}>
          <TouchableOpacity onPress={() => handleSubmit()}>
            <Text style={styles.postButton}>Post </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewComplaint;

const styles = StyleSheet.create({
  complaintWrapper: {
    flexDirection: "row",
  },
  complaintInput: {
    width: "80%",
  },
  imageIcon: {
    padding: 30,
  },
  postButtonContainer: {
    backgroundColor: "#007bff",
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: "center",
  },
  postButtonText: {
    color: "black",
    fontSize: 18,
    flex: 3,
  },
});
