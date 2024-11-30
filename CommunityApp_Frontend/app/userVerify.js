import { View, Text, Image, Button, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./ApiConfig";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import colors from "../assets/colors";

const UserVerify = () => {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const picksImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediatypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const base64image = `data:image/png;base64,${result.assets[0].base64}`;
      setImageUrl(base64image);
    }
  };

  if (hasGalleryPermission === false) {
    return <Text>No Access to Internal Storage</Text>;
  }

  async function handleSubmit() {
    const token = await AsyncStorage.getItem("token");
    const verificationData = {
      token,
      address,
      imageUrl,
    };
    apiClient.post("/VerificationDetails", verificationData).then((res) => {
      console.log(res.data);
    });
  }

  function handleAddress(e) {
    const addressVar = e.nativeEvent.text;
    setAddress(addressVar);
  }

return (
  <SafeAreaView>
    <View style={styles.inputWrapper}>
    <TextInput placeholder="Type your Address" style={styles.addressWrapper} onChange={(e) => handleAddress(e)} />
    <TouchableOpacity onPress={() => picksImage()}>
            <MaterialCommunityIcons
              name="image-plus"
              size={24}
              color="black"
              style={styles.imageIcon}
            />
          </TouchableOpacity>
          </View>
          {imageUrl && (
          <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100 }} />
        )}
          <View style={styles.postButtonContainer}>
          <TouchableOpacity onPress={() => handleSubmit()}>
            <Text style={styles.postButton}>Post </Text>
          </TouchableOpacity>
        </View>
  </SafeAreaView>
);
};

export default UserVerify;

const styles = StyleSheet.create({
  addressWrapper: {
    width: "70%",
    marginTop: 50,
    backgroundColor: colors.lightGrey,
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingBottom: 10,
    paddingTop: 10,
    paddingVertical: 5,
    marginVertical: 5,
    alignItems: "left",
    justifyContent: "center",
    height: 35,
  },
  inputWrapper:{
    flexDirection: "row",
  },
  imageIcon: {
    
  },
  postButtonContainer: {},
  postButton: {},
});
