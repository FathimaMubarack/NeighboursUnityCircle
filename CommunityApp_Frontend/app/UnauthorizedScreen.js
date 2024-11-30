import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "expo-router";

const UnauthorizedScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Access Denied</Text>
            <Button title="Go Back" onPress={() => navigation.navigate("login")} />
        </View>
    );
};

export default UnauthorizedScreen;
