import React from "react";
import ActiveOrder  from "./ActiveOrder";
import HistoryOrder from "./HistoryOrder";
import StoChatScreen from "./StoChatScreen"
import ViewProfile from './ViewProfile';

import {createMaterialTopTabNavigator,createStackNavigator,createAppContainer} from 'react-navigation';


const OrderStack = createStackNavigator({
  ActiveOrder: {
     screen:ActiveOrder, navigationOptions: { header: null} 
   },
   StoChatScreen: {
     screen:StoChatScreen
   },
   ViewProfile: {
    screen:ViewProfile,
  },
 });

 const HistoryStack = createStackNavigator({
  HistoryOrder: {
     screen: HistoryOrder, navigationOptions: { header: null} 
   },
   StoChatScreen: {
     screen:StoChatScreen
   },
   ViewProfile: {
     screen:ViewProfile,
   },
 });

 OrderStack .navigationOptions = ({ navigation }) => {

  let tabBarVisible = true;
  let  swipeEnabled = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName

  if ( routeName == 'StoChatScreen' ||  routeName == 'ViewProfile') {
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

  if ( routeName == 'StoChatScreen'||  routeName == 'ViewProfile' ) {
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
        screen: OrderStack,
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

