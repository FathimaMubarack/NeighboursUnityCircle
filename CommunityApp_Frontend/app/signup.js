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
import React, { useEffect, useState } from "react";
import { Link, useNavigation } from "expo-router";
import {
  GestureHandlerRootView,
  ScrollView,
  TextInput,
} from "react-native-gesture-handler";
import colors from "../assets/colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import apiClient from "./ApiConfig";
import DropdownComponent from "./areaDropdown";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

const SignupScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerify, setEmailVerify] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [locationId, setLocationId] = useState("");
  const [role, setRole] = useState("");

  const data = [
    { label: "Individual User", value: "individual" },
    { label: "Organizational User", value: "organization" },
  ];

  const navigation = useNavigation();
  function handleSubmit() {
    const userData = {
      name: name,
      email,
      password,
      locationId,
      role,
    };
    if (emailVerify && passwordVerify) {
      apiClient
        .post("/register", userData)
        .then((res) => {
          console.log(res.data);
          if (res.data.status == "ok") {
            Alert.alert("Registered Successfully!!");
            navigation.navigate("login");
          } else {
            Alert.alert(JSON.stringify(res.data));
          }
        })
        .catch((e) => console.log(e));
    } else {
      Alert.alert("Fill mandatory details");
    }
  }

  function handleName(e) {
    const nameVar = e.nativeEvent.text;
    setName(nameVar);
  }

  function handleEmail(e) {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerify(false);
    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)) {
      setEmail(emailVar);
      setEmailVerify(true);
    }
  }

  function handlePassword(e) {
    const passwordVar = e.nativeEvent.text;
    setPassword(passwordVar);
    setPasswordVerify(false);
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)) {
      setPassword(passwordVar);
      setPasswordVerify(true);
    }
  }

  return (
    <GestureHandlerRootView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../assets/images/Logo.png")}
          />
        </View>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <View style={styles.inputContainer}>
            <View style={styles.nameContainer}>
              <FontAwesome5
                name="user-circle"
                color={colors.black}
                size={20}
                style={styles.nameIcon}
              />
              <TextInput
                placeholder="Name"
                style={styles.input}
                onChange={(e) => handleName(e)}
              />
            </View>
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
                onChange={(e) => handleEmail(e)}
              />
              {email.length < 1 ? null : emailVerify ? (
                <FontAwesome5 name="check-circle" color="green" size={20} />
              ) : (
                <MaterialIcons name="error" color="red" size={20} />
              )}
            </View>
            {email.length < 1 ? null : emailVerify ? null : (
              <Text
                style={{
                  marginLeft: 20,
                  color: "red",
                }}
              >
                Enter Valid Email Address
              </Text>
            )}

            <View style={styles.nameContainer}>
              <FontAwesome5
                name="lock"
                color={colors.black}
                size={20}
                style={styles.nameIcon}
              />
              <TextInput
                placeholder="Password"
                secureTextEntry={showPassword}
                style={styles.input}
                onChange={(e) => handlePassword(e)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {password.length < 1 ? null : showPassword ? (
                  <Ionicons name="eye" style={{ marginRight: 10 }} size={23} />
                ) : (
                  <Ionicons
                    name="eye-off"
                    style={{ marginRight: 10 }}
                    size={23}
                  />
                )}
              </TouchableOpacity>
            </View>
            {password.length < 1 ? null : passwordVerify ? null : (
              <Text
                style={{
                  marginLeft: 20,
                  color: "red",
                }}
              >
                Password must contain 6 or more characters with uppercase,
                lowercase and number
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <View style={{ marginTop: -45 }}>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Please Select the type of user"
                searchPlaceholder="Search..."
                value={role}
                onChange={(item) => {
                  setRole(item.value);
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color="black"
                    name="Safety"
                    size={20}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={{ marginTop: -55 }}>
              <DropdownComponent setLocationId={setLocationId} />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => handleSubmit()}
              style={styles.button}
            >
              <Text style={styles.buttonText}> Register </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default SignupScreen;

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
    width: "85%",
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
  dropdownWrapper: {
    width: "80%",
    flexDirection: "row",
  },
  dropdown: {
    width: "100%",
  },
  dropdown: {
    height: 47,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: colors.lightGrey,
  },
  dropdownContainer: {
    backgroundColor: "white",
    padding: 16,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: colors.lightGrey,
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
