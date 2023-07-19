import  React from "react";
import { createDrawerNavigator,createStackNavigator} from "react-navigation"
import Chats from "./Chats"
import StoChatScreen  from "./StoChatScreen" 
import LogoutM from "./LogoutM"
import OrderScreen from "./OrderScreen";
import HomeScreenM from './HomeScreenM';
import RateScreenM from './RateScreenM';
import DeliveryScreen from './DeliveryScreen';
import EditProfileM from "./EditProfileM";
import UserProfileM from "./UserProfileM";
import Giph_Screen from "../Giph_Screen";
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomDrawerNavigatorM from "./CustomDrawerNavigatorM"
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Dimensions} from "react-native";



const HomeStackM = createStackNavigator({
    HomeScreenM: {
       screen:HomeScreenM,
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
  
   const DeliveryStackM = createStackNavigator({
    DeliveryScreen: {
       screen: DeliveryScreen,
       navigationOptions: ({ navigation }) => ({
               title: 'Delivery',
               headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
               headerStyle: {
                 backgroundColor: "#307ecc",
               },
               headerTintColor: '#fff',
             }),
     }
   });
  
   const OrderStack = createStackNavigator({
    OrderScreen: {
    screen:OrderScreen,
    navigationOptions: ({ navigation }) => ({
            title: 'Orders',
            headerLeft:<Ionicons style={{marginLeft:10}} name="md-arrow-back" size={35} color="white" onPress={()=>navigation.navigate("HomeScreenM")} />,  
            headerStyle: {
              backgroundColor: "#307ecc",
            },
            headerTintColor: '#fff',
          }),
  },
   });


    const RateStackM = createStackNavigator({
      RateScreenM: {
          screen:RateScreenM,
          navigationOptions: ({ navigation }) => ({
                  title: 'RATE',
                  headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
                  headerStyle: {
                    backgroundColor: "#307ecc",
                  },
                  headerTintColor: '#fff',
                }),
        }
      });
  
   const ChatStack = createStackNavigator({
    ChatScreenM: {
       screen:Chats,
       navigationOptions: ({ navigation }) => ({
               title: 'CHAT',
            headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
            headerStyle: {
                 backgroundColor: "#307ecc",
               },
               headerTintColor: '#fff',
             }),
     },
     StoChatScreen: {
      screen:StoChatScreen,
    },
   });

    const ProfileStackM = createStackNavigator({
      ProfileScreen: {
          screen:UserProfileM,
          navigationOptions: ({ navigation }) => ({
                  title: 'PROFILE',
                  headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
                  headerStyle: {
                    backgroundColor: "#307ecc",
                  },
                  headerTintColor: '#fff',
                }),
        },
        EditProfileM: {
         screen: EditProfileM,
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
  
   const LogoutstackM = createStackNavigator({
    LogoutScreenM: {
        screen:LogoutM,
      }
    });
  

    OrderStack.navigationOptions = ({ navigation }) => {
    
      let drawerLockMode ="unlocked";
    
      let routeName = navigation.state.routes[navigation.state.index].routeName
    
      if ( routeName == 'OrderScreen' ) {
        drawerLockMode = 'locked-open';
      }
    
      return {
        drawerLockMode,
      }
    }
    ChatStack.navigationOptions = ({ navigation }) => {

      let drawerLockMode ="unlocked";
    
      let routeName = navigation.state.routes[navigation.state.index].routeName
    
    
      if ( routeName == 'StoChatScreen' ) {
        drawerLockMode = 'locked-open';
      }
    
      return {
        drawerLockMode,
      }
    }
    ProfileStackM.navigationOptions = ({ navigation }) => {
    
      let drawerLockMode ="unlocked";
    
      let routeName = navigation.state.routes[navigation.state.index].routeName
    
      if ( routeName == 'EditProfileM' ) {
        drawerLockMode = 'locked-open';
      }
    
      return {
        drawerLockMode,
      }
    }

export const DrawerNavigationRoutesM  = createDrawerNavigator(
    {
      HomeStackM: {
        screen:HomeStackM,
        navigationOptions: ({ navigation }) => ({
          drawerLabel: "Home",
          drawerIcon: () => (
            <SimpleLineIcons name="home" size={23} color="#368fcf" />
          )
        })
      },
      DeliveryStackM: {
        screen: DeliveryStackM,
        navigationOptions: ({ navigation }) => ({
          drawerLabel: " Delivery",
          drawerIcon: () => (
            <SimpleLineIcons name="home" size={23} color="#368fcf" />
          )
        })
      },
      Chats: {
        screen:ChatStack,
        navigationOptions: ({ navigation }) => ({
          drawerLabel: "CHAT",
          drawerIcon: () => (
            <SimpleLineIcons name="user" size={23} color="#368fcf" />
          )
        })
      },
      MyOrders:{
        screen:OrderStack,
        navigationOptions: ({ navigation }) => ({
          drawerLabel: "Orders",
          drawerIcon: () => (
            <AntDesign name="shoppingcart" size={23}  color="orange"/>
          )
        }),
        },
      RateScreenM:{
        screen: RateStackM,
        navigationOptions: ({ navigation }) => ({ 
          drawerLabel: "Ratings",
          drawerIcon: () => (
            <SimpleLineIcons name="star" size={23} color="#368fcf" />
          )
        })
      },
      UserProfileM: {
        screen:ProfileStackM,
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
        screen:LogoutstackM,
        navigationOptions: ({ navigation }) => ({
          drawerLabel: "LogOut",
          drawerIcon: () => (
            <MaterialCommunityIcons name="logout" size={23} color="orange" />
          )
        })
      }
      },
    {
        contentComponent: (props) => <CustomDrawerNavigatorM {...props} />,
        drawerWidth: Dimensions.get('window').width - 160,
       hideStatusBar:false,                              
      drawerBackgroundColor: "#262626",
      overlayColor: null,
      drawerLockMode :"unlocked", 
      unmountInactiveRoutes: true,
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
  