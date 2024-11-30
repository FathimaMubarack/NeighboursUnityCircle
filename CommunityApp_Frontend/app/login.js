import {
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React from "react";
import { Link, useNavigation } from "expo-router";
import {
  GestureHandlerRootView,
  ScrollView,
  TextInput,
} from "react-native-gesture-handler";
import colors from "../assets/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./ApiConfig";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./context/AuthContext";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin } = useAuth();

  const navigation = useNavigation();
  function handleSubmit() {
    console.log(email, password);
    const userData = {
      email: email,
      password,
    };
    apiClient
      .post("/login-user", userData)
      .then(async (res) => {
        console.log(res.data);
        if (res.data.status == "ok") {
          const token = res.data.data;
          const isVerified = res.data.verifyStatus;
          const role = res.data.role;

          if (token) {
            await AsyncStorage.setItem("token", token)
              .then(() => {
                console.log("Token saved to AsyncStorage:", token);
              })
              .catch((error) => {
                console.log("Error saving token:", error);
              }); 
            await AsyncStorage.setItem("userRole", role);
            await AsyncStorage.setItem("username", email);
          } else {
            console.log("Token is Invalid");
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("userRole");
            await AsyncStorage.removeItem("username");
          }

          if (isVerified === false) {
            if (role === "individual") {
              Alert.alert("Please Verify your Details!!");
              navigation.navigate("userVerify");
            } else if (role === "organization") {
              Alert.alert("Please Verify your account");
              navigation.navigate("organizationVerify");
            }
          } else {
            console.log("Triggering On Login...");
            onLogin(email, role, token);

            switch (role) {
              case "organization":
                Alert.alert("Welcome Organization");
                navigation.navigate("organization"); 
                break;
              case "user":
                Alert.alert("Welcome User");
                navigation.navigate("user"); 
                break;
              case "admin":
                Alert.alert("Welcome Admin");
                navigation.navigate("admin");
                break;
              default:
                break;
            }

          }
        } else {
          Alert.alert("Login Failed! Please Enter Correct Details");
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Something Went Wrong, Please Try Again!!");
      });
  }

  return (
    <GestureHandlerRootView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../assets/images/Logo.png")}
          />
        </View>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={styles.inputContainer}>
            <View style={styles.nameContainer}>
              <Ionicons
                name="mail"
                color={colors.black}
                size={20}
                style={styles.nameIcon}
              />
              <TextInput
                placeholder="Email"
                style={styles.input}
                onChange={(e) => setEmail(e.nativeEvent.text)}
              />
            </View>
            <View style={styles.nameContainer}>
              <FontAwesome5
                name="lock"
                color={colors.black}
                size={20}
                style={styles.nameIcon}
              />
              <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.input}
                onChange={(e) => setPassword(e.nativeEvent.text)}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => {}} style={styles.button}>
              <Text style={styles.buttonText} onPress={() => handleSubmit()}>
                {" "}
                Login{" "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={[styles.button, styles.buttonOutline]}
            >
              <Link href="/signup" style={styles.buttonOutlineText}>
                {" "}
                Register{" "}
              </Link>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 180,
    width: 260,
    marginTop: 200,
    marginTop: 150,
  },
  inputContainer: {
    width: "80%",
    marginTop: 50,
  },
  nameContainer: {
    backgroundColor: colors.lightGrey,
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 10,
    paddingVertical: 5,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  nameIcon: {
    padding: 5,
  },
  input: {
    flex: 1,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "darkslateblue",
    width: "100%",
    padding: 15,
    borderRadius: 10,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "fadedBlue",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonOutlineText: {
    color: "darkslateblue",
    fontWeight: "700",
    fontSize: 16,
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
