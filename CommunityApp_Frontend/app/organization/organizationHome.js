import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import categoriesData from '../../assets/data/categoriesData';
import colors from '../../assets/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Link, useNavigation } from 'expo-router';
import apiClient from '../ApiConfig';


const OrganizationHome = () => {

    const [userData, setUserData] = useState('')

    async function getData() {
        const token= await AsyncStorage.getItem('token');
        console.log(token);
        apiClient.post('/userdata',{token:token})
        .then(res=>{console.log(res.data)
        setUserData(res.data.data);
        });
    }

    useEffect(() => {
        getData();
    }, []);

    const navigation = useNavigation();
    const renderCategoryItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={()=>navigation.navigate(item.navigateTo)}>
            <View style={[
                styles.categoryItemWrapper,
                {
                    backgroundColor: item.selected ? colors.aliceBlue : colors.white,
                }
                ]}> 
                <Image source={item.image} style={styles.categoryItemImage}/>
                <Text style={styles.categoryItemTitle}>{item.title}</Text>
                <View 
                style={[
                    styles.categorySelectWrapper,
                    {
                        backgroundColor: item.selected ? colors.white : colors.darkBlue
                    }
                    ]}>
                <Ionicons 
                name="chevron-forward" 
                size={10} 
                style={styles.categorySelectIcon} 
                color={item.selected ? colors.black : colors.white}
                />
                </View>
            </View>
            </TouchableOpacity>
        )
    }


  return (
    // header
    <View style={styles.container}>
       <SafeAreaView>
        <View style={styles.headerWrapper}>
            <Image 
            source={require('../../assets/images/Profile.png')} 
            style={styles.profileImage} 
            />
            <Ionicons name="menu" size={24} color="black" />
        </View>
       </SafeAreaView>

      {/* title */}
       <View style= {styles.titlesWrapper}>
        <Text style={styles.titlessubtitle}>Hello</Text>
        <Text style={styles.titlesTitle}>{userData.name}</Text>
       </View>

      {/* categories */}
      <View style={styles.categoriesWrapper}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <View style={styles.categoriesListWrapper}>
            <FlatList 
             data={categoriesData}
             renderItem={renderCategoryItem}
             keyExtractor={item => item.id}
             horizontal={false}
             numColumns={2}
            />
        </View>
      </View>


    </View>
    
  );
};

export default OrganizationHome

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        alignItems: 'center',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 40,
    },
    titlesWrapper: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    titlessubtitle: {
        fontSize: 16,
        color: 'black',
    },
    titlesTitle: {
        fontWeight: '700',
        fontSize: 32,
        color: 'black',
        marginTop: 5,
    },
    categoriesWrapper: {
        marginTop: 30,
    },
    categoriesTitle: {
        fontSize: 16,
        paddingHorizontal: 20,
    },
    categoriesListWrapper: {
        paddingTop: 15,
        paddingBottom: 20,
        paddingHorizontal: 10,
    },
    categoryItemWrapper: {
        flex: 1,
        backgroundColor: 'blue',
        marginRight: 20,
        borderRadius: 20,
    },
    categoryItemImage: {
        width: 60,
        height: 60,
        marginTop: 25,
        alignSelf: 'center',
        marginHorizontal: 20,
    },
    categoryItemTitle: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 10,
        fontWeight: '500',
    
    },
    categorySelectWrapper: {
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: 26,
        height: 26,
        borderRadius: 26,
        marginBottom: 20,
    },
    categorySelectIcon: {
        alignSelf: 'center',

    },
    verifyTextWrapper: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '50%',
        padding: 15,
        borderRadius: 10,
    },
    verifyText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
        alignItems: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        alignItems:'center',
        alignSelf: 'center',
    },
});