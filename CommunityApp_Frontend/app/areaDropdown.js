import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import colors from "../assets/colors";
import apiClient from "./ApiConfig";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const DropdownComponent = ({ locationId,setLocationId }) => {
  const [area, setArea] = useState([]);
  const [city, setCity] = useState([]);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    apiClient
      .get("/getLocations")
      .then((response) => {
        console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let areaArray = [];
        for (var i = 0; i < count; i++) {
          areaArray.push({
            value: response.data[i]._id,
            label: `${response.data[i].name}, ${response.data[i].city}`,
          });
        }
        setArea(areaArray);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return (
    <View style={styles.container}>
      <View>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={area}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Location" : "..."}
          searchPlaceholder="Search..."
          value={locationId}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setLocationId(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <MaterialIcons
              style={styles.icon}
              color={isFocus ? "blue" : "black"}
              name="add-location"
              size={20}
            />
          )}
        />
      </View>
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 47,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: colors.lightGrey,
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
