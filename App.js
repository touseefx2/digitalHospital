import React from "react";
import LoginSuccessLoading from './component/loginsucessloading';
import SplashScreen from "./component/SplashScreen";
import {DrawerNavigationRoutesP}  from "./component/DrawerNavigationRoutesP/DrawerNavigationRoutesP";  //patient drwr
import {DrawerNavigationRoutesD}  from "./component/DrawerNavigationRoutesD/DrawerNavigationRoutesD";  //dcte drwr
import {DrawerNavigationRoutesA}  from "./component/DrawerNavigationRoutesA/DrawerNavigationRoutesA";  //assistant drwr
import {DrawerNavigationRoutesM}  from "./component/DrawerNavigationRoutesM/DrawerNavigationRoutesM";  //Medical drwr
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { Alert,BackHandler,AppState} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { createAppContainer,createSwitchNavigator,createStackNavigator} from "react-navigation";
import firestore from '@react-native-firebase/firestore';
import NetInfo from "@react-native-community/netinfo";
import { StatusBar} from "react-native"
import LoginScreen from './component/Stack/LoginScreen';
import {notificationManager} from "./component/src/NotificationManager"
import DoctorSignupScreen from './component/Stack/DoctorSignupScreen';
import PatientSignupScreen from './component/Stack/PatientSignupScreen';
import MedicalSignupScreen from './component/Stack/MedicalSignupScreen';
import AssistantSignupScreen from './component/Stack/AssistantSignupScreen';
import ForgotPassword from "./component/Stack/ForgotPassword"




//for status bar hoden
function getActiveRoute(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRoute(route);
  }
  return route;
}

      
    const myswitch = createSwitchNavigator({
      SplashScreen: {
        screen: SplashScreen
      },
      LoginSuccessLoading:{
        screen:LoginSuccessLoading,
        },
        //logn signup forgot stack
        stack:{    
          screen: createStackNavigator({ 
           LoginScreen: {
             screen: LoginScreen,
           },          
               ForgotPassword:{
                 screen:ForgotPassword
               }, 
               DoctorSignupScreen:{
                 screen:DoctorSignupScreen
               } 
               ,
               PatientSignupScreen: {
               screen:PatientSignupScreen,
               } ,
               AssistantSignupScreen: {
                 screen:AssistantSignupScreen,
                 },
                 MedicalSignupScreen: {
                   screen:MedicalSignupScreen,
                   },
           } ,
           {
           defaultNavigationOptions: ({navigation})=> {
             return {
         header:null
             };  
           }
         }
 
          )
       },      
        DrawerNavigationRoutesP: {
          screen: DrawerNavigationRoutesP,
        },   
DrawerNavigationRoutesD: {
          screen: DrawerNavigationRoutesD
    } , 
    DrawerNavigationRoutesA: {
      screen: DrawerNavigationRoutesA
},
DrawerNavigationRoutesM: {
  screen: DrawerNavigationRoutesM
},
    },
    //swtch nbgtr ka  dflt hdr 
         {
          defaultNavigationOptions: ({navigation})=> {
            return {
        header:null
            };  
          }
        })
                
    const AppConatiner= createAppContainer(myswitch);

    
 export default class App extends React.Component {

  constructor(props)
  {
    super(props); 
    this.state = {
      userid:"",
      appState: AppState.currentState,
    };
    }

handleConnectivityChange = state => {
  if (state.isConnected) {
  } else {
    Alert.alert("No Internet Connection");
  }
};

componentDidMount() {
  AppState.addEventListener('change', this.handleAppStateChange);
  NetInfo.addEventListener(this.handleConnectivityChange);
  auth().onAuthStateChanged( (user)=> {
  if(user)
  {
    const uid= user.uid;
    user.reload();
  const roomRef =  firestore().collection('videocallrooms').doc(uid);
  this.subscriby =  roomRef.onSnapshot((d)=>{
   if(!d.exists){

    
   }else{
    if (this.state.appState === 'background') {
      notificationManager.showNotification("1","Calling","Someone is Calling You...","","");
      console.log("App is in Background Mode. call ntfctn send")
    }
   
   }
  })

 //foe ntfctn true and false
    firestore().collection("users").doc(user.uid).get().then((doc)=>{
      if(doc.exists)
      {
        const db =  firestore().collection("chatrooms").where(`user.${user.uid}` , '==' , true);
        const d= doc.data();
        if(user.uid == d.senderid)
        {
          firestore().collection("chatrooms").doc(da.id).update({
            sendernotification:true
            })
        }else if(user.uid == d.receiverid)
        {
          firestore().collection("chatrooms").doc(da.id).update({
            receivernotification:true
          })
        }
      
      }
    })
  
         //for making onln  user in realtime data base nd then assign cloud firestore function
          //implmnt in function index.js
          const dbref =   firestore().collection("users").doc(uid);
         var  rdbref = database().ref('status/'+uid);
          const  amOnline  = database().ref(".info/connected");
          amOnline.on('value', (snapshot) => {  
                      
            if(snapshot.val())
            {
              rdbref.set({
                status:"online",
              })
                dbref.update({
                  status:"online",
                  lastonline:""
                 }); 
            }
              
            rdbref.onDisconnect().set({
              status:"offline"
            }).then(()=>{
              rdbref.set({
                status:"online",
              })
            })

                                                                  
                              });
                            //   end show onln user
  }
  })
  
}

handleAppStateChange = async (nextAppState) => {
  this.setState({ appState: nextAppState });
  if (nextAppState === 'background') {
    // Do something here on app background.
    console.log("App is in Background Mode. App")
  }

  if (nextAppState === 'active') {    
    // Do something here on app active foreground mode.
    console.log("App is in Active Foreground Mode. App")
    try {
      await AsyncStorage.removeItem("b")
   } catch (e) {
     console.log(e);
   }
  }

  if (nextAppState === 'inactive') {
    // Do something here on app inactive mode.
    console.log("App is in inactive Mode. App")
  }
};

componentWillUnmount= async () =>
{
  try {
    await AsyncStorage.removeItem("b")
 } catch (e) {
   console.log(e);
 }
 if(this.subscriby) {
  this.subscriby();
  } 
}



render()
{
   return(
          <AppConatiner
        //for specific screen status bar hiden
        onNavigationStateChange={(prevState, currentState) => {
          const currentScreen = getActiveRoute(currentState);
          const prevScreen = getActiveRoute(prevState);
          if (prevScreen.routeName !== currentScreen.routeName) {
              if(currentScreen.routeName === 'LoginScreen' || currentScreen.routeName === 'SplashScreen' || currentScreen.routeName === 'DrawerNavigationRoutes' )
            {  console.log(currentScreen)    
              StatusBar.setHidden(true); }
              else
             { StatusBar.setHidden(false); }
          }
        }} />
                
            );
       

};
}

