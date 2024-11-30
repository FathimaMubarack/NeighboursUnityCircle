import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "expo-router";
import apiClient from "../ApiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditCampaignGoods = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [goods, setGoods] = useState([]);
  const navigation = useNavigation();

  const fetchCampaigns = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return Alert.alert("Error", "No token found, please log in.");
      }

      const response = await apiClient.post("/getOrgCampaigns", { token });
      if (response.status === 200) {
        setCampaigns(response.data);
      } else {
        Alert.alert("Error", response.data.error || "Failed to fetch campaigns.");
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      Alert.alert("Error", "An error occurred while fetching campaigns.");
    }
  };


  const fetchGoodsForCampaign = async (campaignId) => {
    try {
      const response = await apiClient.post("/getCampaignGoods", { campaignId });
      if (response.status === 200) {
        setGoods(response.data.requestedGoods);
      } else {
        Alert.alert("Error", response.data.error || "Failed to fetch campaign goods.");
      }
    } catch (error) {
      console.error("Error fetching goods:", error);
      Alert.alert("Error", "An error occurred while fetching goods.");
    }
  };


  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    fetchGoodsForCampaign(campaign._id);
  };


  const handleInputChange = (index, field, value) => {
    const updatedGoods = [...goods];
    updatedGoods[index][field] = value;
    setGoods(updatedGoods);
  };


  const addGood = () => {
    setGoods([...goods, { name: "", quantity: 0, fulfilledQuantity: 0 }]);
  };


  const handleSubmit = async () => {
    try {
      const response = await apiClient.post("/updateCampaignGoods", {
        campaignId: selectedCampaign._id,
        requestedGoods: goods,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Campaign goods updated successfully!");
        navigation.navigate("donations");
      } else {
        Alert.alert("Error", response.data.error || "Failed to update campaign goods.");
      }
    } catch (error) {
      console.error("Error updating goods:", error);
      Alert.alert("Error", "An error occurred while updating goods.");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select a Campaign to Edit</Text>

      {/* List of campaigns */}
      <FlatList
        data={campaigns}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.campaignItem,
              selectedCampaign && selectedCampaign._id === item._id
                ? styles.selectedCampaign
                : null,
            ]}
            onPress={() => handleCampaignSelect(item)}
          >
            <Text style={styles.campaignText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Goods editor */}
      {selectedCampaign && (
        <View>
          <Text style={styles.subheading}>Edit Goods for {selectedCampaign.title}</Text>
          <FlatList
            data={goods}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.goodItem}>
                <TextInput
                  style={styles.input}
                  placeholder="Good Name"
                  value={item.name}
                  onChangeText={(value) => handleInputChange(index, "name", value)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Quantity"
                  keyboardType="numeric"
                  value={item.quantity.toString()}
                  onChangeText={(value) =>
                    handleInputChange(index, "quantity", parseInt(value) || 0)
                  }
                />
              </View>
            )}
          />
          <Button title="+ Add Good" onPress={addGood} />
          <Button title="Submit Updates" onPress={handleSubmit} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  campaignItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
  },
  selectedCampaign: {
    backgroundColor: "#d1f7d1",
  },
  campaignText: {
    fontSize: 16,
  },
  goodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#f9f9f9",
  },
});

export default EditCampaignGoods;
