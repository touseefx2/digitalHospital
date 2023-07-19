import { createDrawerNavigator,createStackNavigator} from "react-navigation";
import React  from 'react';
import SearchScreen from "./SearchScreen";
import Home from './Home';
import Home2 from './Home2';
import HomeScreen from './HomeScreen';
import AppointmentScreen from "./AppointmentScreen";
import TipsScreen from "./TipsScreen";
import TipsScreenView from './TipsScreenView';
import TipsScreenViewVideo from './TipsScreenViewVideo';
import SearchView from './SearchView';
import MyReports from './MyReports'; 
import RateScreen from './RateScreen'; 
import JoinVideo from './JoinVideo'; 
import MyReportsCatagoryView from './MyReportsCatagoryView';
import Logout from "./Logout";
import OrderScreen from "./OrderScreen";
import CustomDrawerNavigator from "./CustomDrawerNavigator";
import Alaram from "./Alaram";
import AlarmList from "./AlaramList";
import EditProfileP from "./EditProfileP";
import UserProfileP from "./UserProfileP";
import StoChatScreen from "./StoChatScreen";
import BuyMedicine from "./BuyMedicine";
import BuyMedicine2 from "./BuyMedicine2";
import BuyMedicine3 from "./BuyMedicine3";
import BookAppointment from "./BookAppointment"
import Giph_Screen from "../Giph_Screen";
import Rate from "./Rate"
import Chats from "./Chats";
import MedicalScreen from "./MedicalScreen";
import MedicalView from "./MedicalView";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Dimensions} from "react-native";




const HomeStack = createStackNavigator({
  Home: {
    screen:Home,
    navigationOptions: ({ navigation }) => ({
            title: 'Home',
            headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
            headerStyle: {
              backgroundColor: "#307ecc",
            },
            headerTintColor: '#fff',
          }),
  },
  Home2: {
    screen:Home2,
  },  
  HomeScreen: {
       screen:HomeScreen,
     },
     StoChatScreen: {
       screen:StoChatScreen, 
     },
     Rate: {
       screen:Rate, 
     },
     RateScreen: {
      screen:RateScreen, 
    },
     SearchView: {
       screen:SearchView,
     },
     BookAppointment: {
      screen:BookAppointment,
    }
   });

   const AppointmentStack = createStackNavigator({
   AppointmentScreen: {
       screen: AppointmentScreen,
       navigationOptions: ({ navigation }) => ({
               title: 'Appointments',
               headerLeft:<Ionicons style={{marginLeft:10}} name="md-arrow-back" size={35} color="white" onPress={()=>navigation.navigate("HomeScreen")} />,  
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
              headerLeft:<Ionicons style={{marginLeft:10}} name="md-arrow-back" size={35} color="white" onPress={()=>navigation.navigate("HomeScreen")} />,  
              headerStyle: {
                backgroundColor: "#307ecc",
              },
              headerTintColor: '#fff',
            }),
    },
     });
  

const AlaramStack = createStackNavigator({
    Alaram: {
       screen:Alaram,
       navigationOptions: ({ navigation }) => ({
               title: 'Pill Rreminders',
               headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
               headerStyle: {
                 backgroundColor: "#307ecc",
               },
               headerTintColor: '#fff',
             }),
     },
     AlarmList: {
      screen:AlarmList,
    }
   });

const TipsStack = createStackNavigator({
    TipsScreen: {
       screen:TipsScreen,
       navigationOptions: ({ navigation }) => ({
               title: 'Tips',
               headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
               headerStyle: {
                 backgroundColor: "#307ecc",
               },
               headerTintColor: '#fff',
             }),
     },
     TipsScreenView: {
      screen: TipsScreenView,
    },
    TipsScreenViewVideo: {
      screen:  TipsScreenViewVideo,
    }
   });

   const SearchStack = createStackNavigator({
    SearchScreen: {
        screen:SearchScreen,
        navigationOptions: ({ navigation }) => ({
                title: 'Search Doctors',
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
     Rate: {
       screen:Rate, 
     },
     RateScreen: {
      screen:RateScreen, 
    },
     SearchView: {
       screen:SearchView,
     },
     BookAppointment: {
      screen:BookAppointment,
    },  
    HomeScreenS: {
         screen:HomeScreen,
       },
    });

   
    const ChatStack = createStackNavigator({
     ChatScreen: {
        screen:Chats,
        navigationOptions: ({ navigation }) => ({
                title: 'Chats',
             headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={30} color="white" onPress={()=>navigation.toggleDrawer()} />,  
             headerStyle: {
                  backgroundColor: "#307ecc",
                },
                headerTintColor: '#fff',
              }),
      },
      StoChatScreen: {
       screen:StoChatScreen,
     }
    });

    const ReportStack = createStackNavigator({
      ReportScreen: {
         screen:MyReports,
         navigationOptions: ({ navigation }) => ({
                 title: 'Lab Reports',
              headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={30} color="white" onPress={()=>navigation.toggleDrawer()} />,  
              headerStyle: {
                   backgroundColor: "#307ecc",
                 },
                 headerTintColor: '#fff',
               }),
       },
       ReportsViewScreen: {
        screen:MyReportsCatagoryView,
      },
     });
 

    const ProfileStack = createStackNavigator({
        ProfileScreen: {
            screen:UserProfileP,
            navigationOptions: ({ navigation }) => ({
                    title: 'Profile',
                    headerLeft:<Ionicons style={{marginLeft:10}} name="md-menu" size={35} color="white" onPress={()=>navigation.toggleDrawer()} />,  
                    headerStyle: {
                      backgroundColor: "#307ecc",
                    },
                    headerTintColor: '#fff',
                  }),
          },
          EditProfileP: {
           screen: EditProfileP,
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

  const JoinStack = createStackNavigator({
    JoinVideo: {
        screen:JoinVideo , navigationOptions: { header: null} 
    }
  });

  const Logoutstack = createStackNavigator({
    LogoutScreen: {
        screen:Logout,
      }
    });
   
    const MedicalStack = createStackNavigator({
      MedicalScreen: {
         screen:MedicalScreen,
         navigationOptions: ({ navigation }) => ({
                 title: 'Pharmacies',
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
       MedicalView: {
         screen:MedicalView,
       },
       Rate: {
        screen:Rate, 
      },
      RateScreen: {
        screen:RateScreen, 
      },
      BuyMedicine: {
        screen:BuyMedicine, 
      },
      BuyMedicine2: {
        screen:BuyMedicine2, 
      },
      BuyMedicine3: {
        screen:BuyMedicine3, 
      },
     });
     

     HomeStack.navigationOptions = ({ navigation }) => {

      let drawerLockMode ="unlocked";
    
      let routeName = navigation.state.routes[navigation.state.index].routeName
    
    
      if ( routeName == 'Home2'  ||  routeName == 'Video' || routeName == 'BookAppointment' || routeName == 'HomeScreen' || routeName == 'StoChatScreen' || routeName == 'SearchView'|| routeName == 'Rate' || routeName == 'RateScreen'  ) {
        drawerLockMode = 'locked-open';
      }
    
      return {
        drawerLockMode,
      }
    }
    MedicalStack.navigationOptions = ({ navigation }) => {

      let drawerLockMode ="unlocked";
    
      let routeName = navigation.state.routes[navigation.state.index].routeName
    
    
      if ( routeName == 'StoChatScreen' || routeName == 'Rate' || routeName == 'RateScreen' || routeName == 'MedicalView'|| routeName == 'BuyMedicine' || routeName == 'BuyMedicine2' || routeName == 'BuyMedicine3'  ) {
        drawerLockMode = 'locked-open';
      }
    
      return {
        drawerLockMode,
      }
    }
    TipsStack.navigationOptions = ({ navigation }) => {

      let drawerLockMode ="unlocked";
    
      let routeName = navigation.state.routes[navigation.state.index].routeName
    
    
      if ( routeName == 'TipsScreenView' || routeName == 'TipsScreenViewVideo' ) {
        drawerLockMode = 'locked-open';
      }
    
      return {
        drawerLockMode,
      }
    }  
    SearchStack.navigationOptions = ({ navigation }) => {

      let drawerLockMode ="unlocked";
    
      let routeName = navigation.state.routes[navigation.state.index].routeName
    
    
      if ( routeName == 'StoChatScreen' || routeName == 'Rate' || routeName == 'RateScreen' || routeName == 'SearchView'|| routeName == 'BookAppointment'  ) {
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
    ReportStack.navigationOptions = ({ navigation }) => {
    
      let drawerLockMode ="unlocked";
    
      let routeName = navigation.state.routes[navigation.state.index].routeName
    
      if ( routeName == 'ReportsViewScreen' ) {
        drawerLockMode = 'locked-open';
      }
    
      return {
        drawerLockMode,
      }
    }
    ProfileStack.navigationOptions = ({ navigation }) => {
    
      let drawerLockMode ="unlocked";
    
      let routeName = navigation.state.routes[navigation.state.index].routeName
    
      if ( routeName == 'EditProfileP' ) {
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
    JoinStack.navigationOptions = ({ navigation }) => {
    
      let drawerLockMode ="unlocked";
    
      let routeName = navigation.state.routes[navigation.state.index].routeName
    
      if ( routeName == 'JoinVideo' ) {
        drawerLockMode = 'locked-open';
      }
    
      return {
        drawerLockMode,
      }
    }
   
    export  const DrawerNavigationRoutesP  = createDrawerNavigator(
        {
          HomeScreen:{
            screen: HomeStack,
            navigationOptions: ({ navigation }) => ({ 
              drawerLabel: "Home",
              drawerIcon: () => (
                <SimpleLineIcons name="home" size={23} color="#368fcf" />
              )
            })
          } ,                 
          SearchScreen: {
            screen: SearchStack, 
            navigationOptions: ({ navigation }) => ({
                drawerLabel:"Search Doctors", //drwr k andr nam chng krta
              drawerIcon: () => (
                <Ionicons name="ios-search" size={23}  color="#368fcf"/>
              )
            })
          },
          MedicalScreen:{
            screen: MedicalStack,
            navigationOptions: ({ navigation }) => ({
              drawerLabel: "Pharmacies",
              drawerIcon: () => (
                <MaterialCommunityIcons name="medical-bag" size={23}  color="#368fcf"/>
              )
            }),
            },
          ReportScreen:{
            screen:ReportStack,
            navigationOptions: ({ navigation }) => ({
              drawerLabel: "Lab Reports",
              drawerIcon: () => (
                <MaterialCommunityIcons name="note-text" size={23}  color="#368fcf"/>
              )
            }),
            },
         AppointmentScreen: {
            screen: AppointmentStack, 
            navigationOptions: ({ navigation }) => ({
                drawerLabel:"Appointments", //drwr k andr nam chng krta
              drawerIcon: () => (
                <SimpleLineIcons name="calendar" size={23}  color="#368fcf"/>
              )
            })
          },
          MyOrders:{
            screen:OrderStack,
            navigationOptions: ({ navigation }) => ({
              drawerLabel: "Orders",
              drawerIcon: () => (
                <AntDesign name="shoppingcart" size={23}  color="#368fcf"/>
              )
            }),
            },
          ChatScreen:{
          screen:ChatStack,
          navigationOptions: ({ navigation }) => ({
            drawerLabel: "Chats",
            drawerIcon: () => (
              <Feather name="message-circle" size={23}  color="#368fcf"/>
            )
          }),
          },
          AlaramScreen:{
            screen:AlaramStack,
            navigationOptions: ({ navigation }) => ({
              drawerLabel: "Pill Reminders",
              drawerIcon: () => (
                <MaterialCommunityIcons name="alarm" size={23}  color="#368fcf"/>
              )
            }),
            },
          UserProfileP: {
            screen:ProfileStack,
            navigationOptions: ({navigation}) => {
              return {
                  drawerLabel: () => null,
              }
          }
          },
          TipsScreen: {
            screen:TipsStack,
            navigationOptions: ({ navigation }) => ({
              drawerLabel: "Tips",
              drawerIcon: () => (
                <SimpleLineIcons name="speech" size={23} color="#368fcf" />
              )
            })
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
          JoinVideo: {
            screen:JoinStack,
            navigationOptions: ({navigation}) => {
              return {
                  drawerLabel: () => null,
              }
          }
          },
          lOgOut:{
            screen:Logoutstack,
            navigationOptions: ({ navigation }) => ({
              drawerLabel: "LogOut",
              drawerIcon: () => (
                <MaterialCommunityIcons name="logout" size={23} color="orange" />
              )
            })
          }
          },
        {
            contentComponent: (props) => <CustomDrawerNavigator {...props} />,
            drawerWidth: Dimensions.get('window').width - 160,
          unmountInactiveRoutes: true,
           hideStatusBar:false,   
           drawerLockMode :"unlocked",                           
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
 