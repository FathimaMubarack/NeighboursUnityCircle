import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "expo-router";
import apiClient from "../ApiConfig";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import colors from "../../assets/colors";
import {
  GestureHandlerRootView,
  ScrollView,
  TextInput,
} from "react-native-gesture-handler";

const AdminRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerify, setEmailVerify] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();
  function handleSubmit() {
    const adminData = {
      name: name,
      email,
      password,
      role: "admin",
    };
    if (name && emailVerify && passwordVerify) {
      apiClient
        .post("/register", adminData)
        .then((res) => {
          console.log(res.data);
          //   if (res.data.status == "ok") {
          //     Alert.alert("New Admin Created Successfully");
          //     navigation.navigate("");
          //   } else {
          //     Alert.alert(JSON.stringify(res.data));
          //   }
        })
        .catch((e) => console.log(e));
    } else {
      Alert.alert("Fill Mandatory Details");
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
      <ScrollView>
        <Text style={{ marginTop: 20 }}> Create New Admin </Text>

        <KeyboardAvoidingView style={styles.container}>
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

export default AdminRegister;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});
