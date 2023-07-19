import { createDrawerNavigator,createStackNavigator} from "react-navigation";
import React  from 'react';
import HomeScreenD from './HomeScreenD';
import AssistantList from "./AssistantList";
import RateScreenD from './RateScreenD';
import AppointmentScreen from "./AppointmentScreen";
import RequestScreen from "./RequestScreen";
import Video from './Video'; 
import AlarmListD from "./AlaramListD";
import AlaramD from "./AlaramD";
import LogoutD from "./LogoutD";
import EditProfileD from "./EditProfileD";
import Chats from "./Chats";
import StoChatScreen from "./StoChatScreen"
import CustomDrawerNavigatorD from "./CustomDrawerNavigatorD"
import UserProfileD from "./UserProfileD";
import Giph_Screen from "../Giph_Screen";
import StatusScreen from "./StatusScreen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import {Dimensions} from "react-native";


const HomeStack = createStackNavigator({
    HomeScreenD: {
       screen:HomeScreenD,
       navigationOptions: ({ navigation }) => ({
               title: 'HOME',
               headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
               headerStyle: {
                 backgroundColor: "#307ecc",
               },
               headerTintColor: '#fff',
             }),
     }
   });

const AlaramStack = createStackNavigator({
    Alaram: {
       screen:AlaramD,
       navigationOptions: ({ navigation }) => ({
               title: 'REMINDER',
               headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
               headerStyle: {
                 backgroundColor: "#307ecc",
               },
               headerTintColor: '#fff',
             }),
     },
     AlarmList: {
      screen:AlarmListD,
    }
   });
 
   const AppointmentStack = createStackNavigator({
    AppointmentScreen: {
        screen: AppointmentScreen,
        navigationOptions: ({ navigation }) => ({
                title: 'Appointment',
                headerLeft:<Ionicons style={{marginLeft:10}} name="md-arrow-back" size={35} color="white" onPress={()=>navigation.navigate("HomeScreenD")} />,  
                headerStyle: {
                  backgroundColor: "#307ecc",
                },
                headerTintColor: '#fff',
              }),
              
      },
    });
   
const RequestStack = createStackNavigator({
    RequestScreen: {
       screen:RequestScreen,
       navigationOptions: ({ navigation }) => ({
               title: 'REQUEST',
               headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
               headerStyle: {
                 backgroundColor: "#307ecc",
               },
               headerTintColor: '#fff',
             }),
     }
   });
  
   const StatusStack = createStackNavigator({
    StatusScreen: {
       screen:StatusScreen,
       navigationOptions: ({ navigation }) => ({
               title: 'STATUS',
               headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
               headerStyle: {
                 backgroundColor: "#307ecc",
               },
               headerTintColor: '#fff',
             }),
     },
     AssistantList: {
      screen: AssistantList,
      navigationOptions: ({ navigation }) => ({
        title: 'Assistant List',
        headerStyle: {
          backgroundColor: "#307ecc",
        },
        headerTintColor: '#fff',
      }),
    }
   });
  
   const RateStackD = createStackNavigator({
    RateScreenD: {
        screen:RateScreenD,
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
        ChatScreen: {
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
        Video: {
          screen:Video,  navigationOptions: { header: null} 
        },
       });
        
       const ProfileStack = createStackNavigator({
       ProfileScreen: {
           screen:UserProfileD,
           navigationOptions: ({ navigation }) => ({
                   title: 'PROFILE',
                   headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
                   headerStyle: {
                     backgroundColor: "#307ecc",
                   },
                   headerTintColor: '#fff',
                 }),
         },
         EditProfileD: {
          screen:EditProfileD,
          navigationOptions: ({ navigation }) => ({
                  title: 'EDIT',
                  headerStyle: {
                    backgroundColor: "#307ecc",
                  },
                  headerTintColor: '#fff',
                }),
        }
       });

       const LogoutstackD = createStackNavigator({
        LogoutScreenD: {
            screen:LogoutD,
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
AlaramStack.navigationOptions = ({ navigation }) => {

  let drawerLockMode ="unlocked";

  let routeName = navigation.state.routes[navigation.state.index].routeName

  if ( routeName == 'AlarmList' ) {
    drawerLockMode = 'locked-open';
  }

  return {
    drawerLockMode,
  }
}
StatusStack.navigationOptions = ({ navigation }) => {

  let drawerLockMode ="unlocked";

  let routeName = navigation.state.routes[navigation.state.index].routeName

  if ( routeName == 'AssistantList' ) {
    drawerLockMode = 'locked-open';
  }

  return {
    drawerLockMode,
  }
}
ProfileStack.navigationOptions = ({ navigation }) => {

  let drawerLockMode ="unlocked";

  let routeName = navigation.state.routes[navigation.state.index].routeName

  if ( routeName == 'EditProfileD' ) {
    drawerLockMode = 'locked-open';
  }

  return {
    drawerLockMode,
  }
}
AppointmentStack.navigationOptions = ({ navigation }) => {

  let drawerLockMode ="unlocked";

  let routeName = navigation.state.routes[navigation.state.index].routeName
  if ( routeName == 'AppointmentScreen' ) {
    drawerLockMode = 'locked-open';
  }

  return {
    drawerLockMode,
  }
}



export const DrawerNavigationRoutesD  = createDrawerNavigator(
    {   
      HomeScreenD: {
        screen: HomeStack, 
        navigationOptions: ({ navigation }) => ({
            drawerLabel:"Home", //drwr k andr nam chng krta
          drawerIcon: () => (
            <Ionicons name="ios-home" size={23}  color="#368fcf"/>
          )
        })
      },
      AppointmentScreen: {
        screen: AppointmentStack, 
        navigationOptions: ({ navigation }) => ({
            drawerLabel:"Appointment", //drwr k andr nam chng krta
          drawerIcon: () => (
            <SimpleLineIcons name="calendar" size={23}  color="#368fcf"/>
          )
        })
      },
      RateScreenD:{
        screen: RateStackD,
        navigationOptions: ({ navigation }) => ({ 
          drawerLabel: "Ratings",
          drawerIcon: () => (
            <SimpleLineIcons name="star" size={23} color="#368fcf" />
          )
        })
      } ,
      ChatScreen:{
      screen:ChatStack,
      navigationOptions: ({ navigation }) => ({
        drawerLabel: "Chat",
        drawerIcon: () => (
          <Feather name="message-circle" size={23}  color="#368fcf"/>
        )
      }),
      },
      AlaramScreen:{
        screen:AlaramStack,
        navigationOptions: ({ navigation }) => ({
          drawerLabel: "Reminder",
          drawerIcon: () => (
            <MaterialCommunityIcons name="alarm" size={23}  color="#368fcf"/>
          )
        }),
        },
        RequestScreen:{
          screen:RequestStack,
          navigationOptions: ({ navigation }) => ({
            drawerLabel: "Request",
            drawerIcon: () => (
              <Ionicons name="md-person-add" size={23}  color="#368fcf"/>
            )
          }),
          },
         StatusScreen:{
            screen:StatusStack,
            navigationOptions: ({ navigation }) => ({
              drawerLabel: "Status",
              drawerIcon: () => (
                <MaterialCommunityIcons name="details" size={23} color="orange" />
              )
            }),
            },
      Giph:{
        screen:Giphstack,
        navigationOptions: ({ navigation }) => ({
          drawerLabel: "Giph",
          drawerIcon: () => (
            <Feather  name="smile" size={23} color="#368fcf"  />
          )
        })
      },  
      UserProfile: {
        screen:ProfileStack,
        navigationOptions: ({navigation}) => {
          return {
              drawerLabel: () => null,
          }
      }
      },
      lOgOut:{
        screen:LogoutstackD,
        navigationOptions: ({ navigation }) => ({
          drawerLabel: "LogOut",
          drawerIcon: () => (
            <MaterialCommunityIcons name="logout" size={23} color="orange" />
          )
        })
      }
      },
    {
      contentComponent: (props) => <CustomDrawerNavigatorD {...props} />,
      drawerWidth: Dimensions.get('window').width - 160,
     hideStatusBar:false,    
     drawerLockMode :"unlocked",
     unmountInactiveRoutes: true,                      
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
    {
      initialRouteName:HomeScreenD,
    }
);

