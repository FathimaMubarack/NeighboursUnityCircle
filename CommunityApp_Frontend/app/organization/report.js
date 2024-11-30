import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import axios from "axios";
import NewComplaint from "./newComplaint";
import apiClient from "../ApiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Report = () => {
  const { width } = useWindowDimensions();

  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await apiClient.post("/getAllComplaints", { token });
      setComplaints(response.data);
    } catch (error) {
      console.log("Error fetching complaints:", error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const renderComplaintItem = ({ item }) => {
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <Text style={styles.location}>{item.content}</Text>
          </View>
        </View>

        <View>
          {item.image && (
            <Image
              source={{ uri: item.image }}
              style={{
                width: width - 20,
                height: width - 20,
                alignSelf: "center",
                marginTop: 5,
                paddingHorizontal: 20,
              }}
            ></Image>
          )}
        </View>
      </View>
    );
  };

  return (
    <View>
      <View>
        <NewComplaint />
      </View>

      <View>
        <FlatList
          data={complaints}
          keyExtractor={(item) => item._id}
          renderItem={renderComplaintItem}
          horizontal={false}
        />
      </View>

      {/* <TouchableOpacity>
         <View style={styles.addIssueWrapper}>
           <Link href="/newComplaint">
             <AntDesign
               name="plussquare"
               size={24}
               color="black"
               style={styles.addIcon}
             />
             <Text style={styles.addText}> Report Issue </Text>
           </Link>
         </View>
       </TouchableOpacity> */}
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileContainer: {
    marginLeft: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  location: {
    fontSize: 14,
    marginTop: 10,
  },
  addIssueWrapper: {
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignSelf: "center",
    width: "50%",
    padding: 5,
    borderRadius: 10,
    zIndex: 1,
    paddingTop: 10,
    marginTop: 10,
    height: 50,
  },
  addIcon: {
    justifyContent: "flex-end",
    alignSelf: "center",
    color: "white",
  },
  addText: {
    color: "white",
    fontSize: 24,
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
