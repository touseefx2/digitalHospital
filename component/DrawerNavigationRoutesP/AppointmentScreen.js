import React from "react";
import ActiveAppointment  from "./ActiveAppointment";
import HistoryAppointment from "./HistoryAppointment"
import StoChatScreen from "./StoChatScreen"
import ViewProfile from './ViewProfile'; 
import Rate from "./Rate"
import RateScreen from "./RateScreen"
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
  Rate: {
   screen:Rate,
 },
 RateScreen: {
  screen:RateScreen,
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
   Rate: {
    screen:Rate,
  },
 RateScreen: {
  screen:RateScreen,
}
 });

 AppnmntStack.navigationOptions = ({ navigation }) => {

  let tabBarVisible = true;
  let  swipeEnabled = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName

  if ( routeName == 'StoChatScreen' ||  routeName == 'ViewProfile' ||  routeName == 'Video'  || routeName == 'Rate' || routeName == 'RateScreen' ) {
    tabBarVisible = false
    swipeEnabled = false
}

  return {
      tabBarVisible,
      swipeEnabled
  }
}
 HistoryStack.navigationOptions = ({ navigation }) => {

  let tabBarVisible = true;
  let  swipeEnabled = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName

  if ( routeName == 'StoChatScreen' ||   routeName == 'ViewProfile'  || routeName == 'Rate' || routeName == 'RateScreen' ||  routeName == 'Video'   ) {
      tabBarVisible = false
      swipeEnabled = false
  }

  return {
      tabBarVisible,
      swipeEnabled
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

