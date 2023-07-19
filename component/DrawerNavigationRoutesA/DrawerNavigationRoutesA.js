import { createDrawerNavigator,createStackNavigator} from "react-navigation"
import HomeScreenA from './HomeScreenA';
import EditProfileA from "./EditProfileA";
import UserProfileA from "./UserProfileA";
import React from 'react';
import LogoutA from "./LogoutA";
import Giph_Screen from "../Giph_Screen";
import CustomDrawerNavigatorA from "./CustomDrawerNavigatorA";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Dimensions} from "react-native";



const HomeStackA = createStackNavigator({
    HomeScreenA: {
       screen:HomeScreenA,
       navigationOptions: ({ navigation }) => ({
               title: 'Home',
               headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
               headerStyle: {
                 backgroundColor: "#307ecc",
               },
               headerTintColor: '#fff',
             }),
     }
   });
  
const ProfileStackA = createStackNavigator({
    ProfileScreen: {
        screen:UserProfileA,
        navigationOptions: ({ navigation }) => ({
                title: 'PROFILE',
                headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
                headerStyle: {
                  backgroundColor: "#307ecc",
                },
                headerTintColor: '#fff',
              }),
      },
      EditProfileA: {
       screen: EditProfileA,
       navigationOptions: ({ navigation }) => ({
               title: 'EDIT',
               headerStyle: {
                 backgroundColor: "#307ecc",
               },
               headerTintColor: '#fff',
             }),
     }
    });
    
     const Giphstack = createStackNavigator({
  GiphScreen: {
      screen:Giph_Screen,
      navigationOptions: ({ navigation }) => ({
        title: 'GIPHs',
        headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
        headerStyle: {
          backgroundColor: "#000",
        },
        headerTintColor: '#fff',
      }),
}
});

      const LogoutstackA = createStackNavigator({
        LogoutScreenA: {
            screen:LogoutA,
          }
        });
    
    
    

    export const DrawerNavigationRoutesA  = createDrawerNavigator(
            {
              HomeStackA: {
                screen:HomeStackA,
                navigationOptions: ({ navigation }) => ({
                  drawerLabel: "Home",
                  drawerIcon: () => (
                    <SimpleLineIcons name="home" size={23} color="#368fcf" />
                  )
                })
              },
              UserProfileA: {
                screen:ProfileStackA,
                navigationOptions: ({navigation}) => {
                  return {
                      drawerLabel: () => null,
                  }
              }
              },
              Giph:{
                screen:Giphstack,
                navigationOptions: ({ navigation }) => ({
                  drawerLabel: "Giph",
                  drawerIcon: () => (
                    <MaterialCommunityIcons name="face" size={23} color="orange" />
                  )
                })
              },
              lOgOut:{
                screen:LogoutstackA,
                navigationOptions: ({ navigation }) => ({
                  drawerLabel: "LogOut",
                  drawerIcon: () => (
                    <MaterialCommunityIcons name="logout" size={23} color="orange" />
                  )
                })
              }
              },
            {
                contentComponent: (props) => <CustomDrawerNavigatorA {...props} />,
                drawerWidth: Dimensions.get('window').width - 160,
               hideStatusBar:false,                              
              drawerBackgroundColor: "#262626",
              overlayColor: null,
              contentOptions: {
               labelStyle: {
                 fontFamily: 'SomeFont',
                 color: 'white',
                  
               },
               //activeTintColor: "pink",
               activeBackgroundColor: "#1c1c1c",
              }
            }  ,
      );