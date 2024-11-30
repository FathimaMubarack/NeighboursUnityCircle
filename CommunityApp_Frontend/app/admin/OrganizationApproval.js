import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import apiClient from "./ApiConfig";

const ApproveOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch Pending Organizations
  const fetchPendingOrganizations = () => {
    apiClient
      .get("/pendingOrganizations")
      .then((res) => {
        if (res.data.status === "ok") {
          setOrganizations(res.data.data);
        } else {
          console.log("Error fetching organizations:", res.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching pending organizations:", error);
      });
  };

  // Approve Organization
  const handleApprove = (userId) => {
    apiClient
      .post("/approveOrganization", {userId} )
      .then((res) => {
        if (res.data.status === "ok") {
          setMessage("Organization approved successfully!");
          fetchPendingOrganizations(); // Refresh the list after approval
        } else {
          setMessage(`Error: ${res.data.data}`);
        }
      })
      .catch((error) => {
        console.error("Error approving organization:", error);
        setMessage("Failed to approve organization. Please try again.");
      });
  };

  // Load Data on Component Mount
  useEffect(() => {
    fetchPendingOrganizations();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Organizations for Approval</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <FlatList
        data={organizations}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>Name: {item.name}</Text>
            <Text style={styles.cardText}>Email: {item.email}</Text>
            <Text style={styles.cardText}>Role: {item.role}</Text>
            <Button
              title="Approve"
              onPress={() => handleApprove(item._id)}
              color="green"
            />
          </View>
        )}
      />
    </View>
  );
};

export default ApproveOrganizations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    marginVertical: 10,
    fontSize: 16,
    color: "green",
  },
  card: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 5,
  },
});
