import React from "react";
import { View, Text, StatusBar, Image, StyleSheet } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import colors from "../assets/colors";
import { Link } from "expo-router";

const data = [
  {
    title: "Welcome to NeighboursUnityCircle",
    text: "All your community management in one place",
    image: require("../assets/images/slider1.png"),
    bg: "#59b2ab",
  },
  {
    title: "Engage in community events",
    text: "Organize and take part in local community events",
    image: require("../assets/images/slider2.png"),
    bg: "#febe29",
  },
  {
    title: "Support your Community",
    text: "Support your community and promote a healthy environment",
    image: require("../assets/images/slider3.png"),
    bg: "#22bcb5",
  },
];
const Onboard = (props) => {
  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const keyExtractor = (item) => item.title;

  const renderDoneButton = () => {
    return (
      <View style={styles.rightTextWrapper}>
        <Link href="/login" style={styles.rightText}>
          Done
        </Link>
      </View>
    );
  };
  const renderNextButton = () => {
    return (
      <View style={styles.rightTextWrapper}>
        <Text style={styles.rightText}>Next</Text>
      </View>
    );
  };
  const renderPrevButton = () => {
    return (
      <View style={styles.leftTextWrapper}>
        <Text style={styles.leftText}>Prev</Text>
      </View>
    );
  };

 

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      <AppIntroSlider
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderDoneButton={renderDoneButton}
        renderNextButton={renderNextButton}
        renderPrevButton={renderPrevButton}
        showPrevButton
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        data={data}
        // onDone={handleDone}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  image: {
    marginVertical: 60,
  },
  title: {
    fontSize: 24,
    color: colors.black,
    textAlign: "center",
    // fontFamily: 'PlayfairDisplay-Bold',
    marginHorizontal: 60,
  },
  text: {
    fontSize: 14,
    color: colors.gray,
    textAlign: "center",
    // fontFamily: 'PlayfairDisplay-SemiBold',
    marginHorizontal: 60,
    marginTop: 20,
  },
  rightTextWrapper: {
    width: 40,
    height: 40,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  rightText: {
    color: colors.blue,
    // fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 14,
  },
  leftTextWrapper: {
    width: 40,
    height: 40,
    marginLeft: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  leftText: {
    color: colors.fadedBlue,
    // fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 14,
  },
  dotStyle: {
    backgroundColor: colors.fadedBlue,
  },
  activeDotStyle: {
    backgroundColor: colors.blue,
  },
});

export default Onboard;
