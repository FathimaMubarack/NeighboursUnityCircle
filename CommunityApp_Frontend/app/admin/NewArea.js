import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import colors from "../../assets/colors";
import apiClient from "../ApiConfig";

export default function NewArea() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postcode, setPostcode] = useState("");

  function handleSubmit() {
    const areaData = {
      name: name,
      city,
      country,
      postcode,
    };
    apiClient
      .post('/new-area', areaData)
      .then((res) => {
        console.log(res.data);
        if (res.data.status == "ok") {
          Alert.alert("New Area Updated successfully!!");
        } else {
          Alert.alert(JSON.stringify(res.data));
        }
      })
      .catch((e) => console.log(e));
  }

  function handleName(e) {
    const nameVars = e.nativeEvent.text;
    setName(nameVars);
  }
  function handleCity(e) {
    const cityVars = e.nativeEvent.text;
    setCity(cityVars);
  }
  function handleCountry(e) {
    const countryVars = e.nativeEvent.text;
    setCountry(countryVars);
  }
  function handlePostcode(e) {
    const postcodeVars = e.nativeEvent.text;
    setPostcode(postcodeVars);
  }

  return (
    <View style={styles.inputWrapper}>
      <View style={styles.Wrapper}>
        <Text style={styles.descriptionWrapper}>Name</Text>
        <View style={styles.inputAreaWrapper}>
          <TextInput
            placeholder="Type Area Name"
            onChange={(e) => handleName(e)}
          />
        </View>
      </View>
      <View style={styles.Wrapper}>
        <Text style={styles.descriptionWrapper}>City</Text>
        <View style={styles.inputAreaWrapper}>
          <TextInput
            placeholder="Type City Name"
            onChange={(e) => handleCity(e)}
          />
        </View>
      </View>
      <View style={styles.Wrapper}>
        <Text style={styles.descriptionWrapper}>Country</Text>
        <View style={styles.inputAreaWrapper}>
          <TextInput
            placeholder="Type Country Name"
            onChange={(e) => handleCountry(e)}
          />
        </View>
      </View>
      <View style={styles.Wrapper}>
        <Text style={styles.descriptionWrapper}>Postal Code</Text>
        <View style={styles.inputAreaWrapper}>
          <TextInput
            placeholder="Type Area Postal Code"
            onChange={(e) => handlePostcode(e)}
          />
        </View>
      </View>
      <TouchableOpacity onPress={() => handleSubmit()}>
        <View style={styles.submitWrapper}>
          <Text style={styles.submitTextWrapper}> Submit </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    paddingTop: 20,
  },
  Wrapper: {
    marginVertical: 10,
  },
  descriptionWrapper: {
    marginTop: 5,
  },
  inputAreaWrapper: {
    marginVertical: 5,
    flexDirection: "row",
    borderRadius: 15,
    backgroundColor: colors.lightGrey,
    height: 40,
  },
  submitWrapper: {
    backgroundColor: colors.darkBlue,
    justifyContent: "center",
    marginTop: 25,
    borderRadius: 5,
    width: "25%",
    alignItems: "center",
    alignSelf: "center",
    height: 30,
  },
  submitTextWrapper: {
    color: colors.white,
  },
});
