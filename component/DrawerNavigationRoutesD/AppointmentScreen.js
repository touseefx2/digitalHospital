import React from "react";
import ActiveAppointment  from "./ActiveAppointment";
import HistoryAppointment from "./HistoryAppointment"
import StoChatScreen from "./StoChatScreen"
import Video from './Video'; 
import MyReportsCatagoryView from './MyReportsCatagoryView';
import ViewProfile from './ViewProfile';
import ViewReport from './ViewReport';
import ViewProfileD from './ViewProfileD';
import SearchScreen from './SearchScreen';
import {createMaterialTopTabNavigator,createStackNavigator,createAppContainer} from 'react-navigation';


const AppnmntStack = createStackNavigator({
  ActiveAppointment: {
     screen:ActiveAppointment, navigationOptions: { header: null} 
   },
   StoChatScreen: {
     screen:StoChatScreen
   },
   ViewProfile: {
    screen:ViewProfile,
  },
  ViewReport: {
   screen:ViewReport,
 },
 ReportsViewScreen: {
  screen:MyReportsCatagoryView,
},
Video: {
  screen:Video,  navigationOptions: { header: null} 
},
ViewProfileD: {
  screen:ViewProfileD,
},
SearchScreen: {
  screen:SearchScreen,
}
 });

 const HistoryStack = createStackNavigator({
  HistoryAppointment: {
     screen:HistoryAppointment, navigationOptions: { header: null} 
   },
   StoChatScreen: {
     screen:StoChatScreen
   },
   ViewProfile: {
     screen:ViewProfile,
   },
   ViewReport: {
    screen:ViewReport,
  },
  ReportsViewScreen: {
    screen:MyReportsCatagoryView,
  },
  Video: {
    screen:Video,  navigationOptions: { header: null} 
  },
 });

 HistoryStack.navigationOptions = ({ navigation }) => {

  let tabBarVisible = true;
  let  swipeEnabled = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName

  if ( routeName == 'StoChatScreen'  || routeName == 'Video' || routeName == 'ViewProfile'  || routeName == 'ViewReport'||  routeName == 'ReportsViewScreen' ) {
      tabBarVisible = false
      swipeEnabled = false
  }

  return {
      tabBarVisible,
      swipeEnabled
  }
}

AppnmntStack.navigationOptions = ({ navigation }) => {

  let tabBarVisible = true;
  let  swipeEnabled = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName
  if ( routeName == 'StoChatScreen' ||  routeName == 'ViewProfile' ||  routeName == 'ViewProfileD' ||  routeName == "SearchScreen" || routeName == 'ViewReport' || routeName == 'ReportsViewScreen' || routeName == 'Video' ) {
    tabBarVisible = false
    swipeEnabled = false
}
  return {
      tabBarVisible,
      swipeEnabled,
  }
}

const mytab = createMaterialTopTabNavigator(
  {
    Tab1: {
        screen: AppnmntStack,
        navigationOptions: {
            title: 'ACTIVE'
        }
    },
    Tab2: {
      screen: HistoryStack,
      navigationOptions: {
          title: 'HISTORY'
      }
      
  },
    },
    {

      tabBarOptions:{
        showIcon:true,
        style:{
          backgroundColor:"#307ecc",
          marginTop:-20,
         
      }
  }, 
  },
  
    {
      swipeEnabled:true ,  //True or false to enable or disable swiping between tabs dflt is true 
                          //asie bht se hen fnctn is ke
      
                        },
   
)

const Appconatainer = createAppContainer(mytab);


export default class App extends React.Component
{
  render()
  {
    return (
    <Appconatainer />
          );

  }
}

