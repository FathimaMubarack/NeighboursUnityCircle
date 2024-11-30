import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../ApiConfig";

const DonateToCampaign = () => {
  const [goods, setGoods] = useState([{ name: "", quantity: 0 }]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const width = useWindowDimensions();

  // Function to fetch active campaigns
  const handleFetchActiveCampaigns = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        alert("Authorization token is missing.");
        return;
      }

      const response = await apiClient.post("/getActiveCampaigns", { token });

      if (response.status === 200) {
        console.log("Active Campaigns:", response.data);
        setCampaigns(response.data);
      } else {
        console.error(response.data.error);
        alert(response.data.error || "Failed to fetch active campaigns.");
      }
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    handleFetchActiveCampaigns();
  }, []);

  const handleInputChange = (index, field, value) => {
    const newGoods = [...goods];
    newGoods[index][field] = value;
    setGoods(newGoods);
  };

  const addGoodField = () => {
    setGoods([...goods, { name: "", quantity: 0 }]);
  };

  // Handle donation submission
  const handleSubmit = () => {
    if (!selectedCampaign) {
      alert("Please select a campaign first.");
      return;
    }

    AsyncStorage.getItem("token")
      .then((token) => {
        if (!token) {
          alert("You need to be logged in to donate.");
          return;
        }

        const id = selectedCampaign._id;
        const donateData = { token, goods, id };

        apiClient
          .post("/DonateToCampaign", donateData)
          .then((res) => {
            if (res.status === 200) {
              alert("Donation successful!");
            } else {
              alert(res.data.error || "Donation failed.");
            }
          })
          .catch((err) => {
            console.error("Error submitting donation:", err);
            alert("An error occurred while processing your donation.");
          });
      })
      .catch((err) => {
        console.error("Error retrieving token from AsyncStorage:", err);
        alert("An error occurred while retrieving the token.");
      });
  };

  const renderGoods = (requestedGoods) => {
    return requestedGoods.map((good, index) => (
      <View key={index} style={styles.goodContainer}>
        <Text style={styles.goodText}>Good: {good.name}</Text>
        <Text style={styles.goodText}>Quantity: {good.quantity}</Text>
      </View>
    ));
  };

  // Render the campaign list
  const renderCampaignItem = ({ item }) => (
    <TouchableOpacity
      style={styles.campaignItem}
      onPress={() => setSelectedCampaign(item)}
    >
      <Text style={styles.campaignTitle}>{item.title}</Text>
      <Text style={styles.campaignDescription}>{item.description}</Text>

      {item.imageURL ? (
        <Image source={{ uri: item.imageURL }} style={styles.campaignImage} />
      ) : (
        <Text>No image available</Text>
      )}

      {/* Render requested goods */}
      {renderGoods(item.requestedGoods)}
    </TouchableOpacity>
  );

  return (
    <View contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Donate to Campaign</Text>

      <FlatList
        data={campaigns}
        renderItem={renderCampaignItem}
        keyExtractor={(item) => item._id}
        style={styles.campaignList}
      />

      {selectedCampaign && (
        <View>
          <Text style={styles.heading}>Donate to {selectedCampaign.title}</Text>
          <Text style={styles.description}>{selectedCampaign.description}</Text>

          {goods.map((good, index) => (
            <View key={index} style={styles.goodContainer}>
              <TextInput
                style={styles.input}
                placeholder="Good Name"
                value={good.name}
                onChangeText={(value) =>
                  handleInputChange(index, "name", value)
                }
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
          <TouchableOpacity style={styles.addButton} onPress={addGoodField}>
            <Text style={styles.addButtonText}>+ Add More Goods</Text>
          </TouchableOpacity>
          <Button
            title="Submit Donation"
            color="#4CAF50"
            onPress={handleSubmit}
          />
        </View>
      )}
    </View>
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
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
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
  campaignList: {
    marginBottom: 20,
  },
  campaignItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  campaignDescription: {
    fontSize: 15,
    color: "#777",
    fontWeight: "600",
  },
  campaignImage: {
    width: 350,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  goodText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
  },
  goodContainer: {
    marginBottom: 10,
  },
});

export default DonateToCampaign;
