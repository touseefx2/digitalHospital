/**
 * @format
 */
import React  from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import { Provider } from 'react-redux'  //prvdr use takkehamara reactjs cmnct kr ske redux k sath
import {createStore,applyMiddleware,combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {name as appName} from './app.json';
import userReducer from "./component/Redux/Reducers/userReducer" //When you import the module's default, dont't use brace{}
import userdReducer from "./component/Redux/Reducers/userdReducer"
import useraReducer from "./component/Redux/Reducers/useraReducer"
import usermReducer from "./component/Redux/Reducers/usermReducer"
import doctorReducer from "./component/Redux/Reducers/doctorReducer"
import medicalReducer from "./component/Redux/Reducers/medicalReducer"
import chatReducer from "./component/Redux/Reducers/chatReducer"
import messaging from '@react-native-firebase/messaging';
console.disableYellowBox = true;

const masterReducer =  combineReducers({
    user:userReducer,
    userd:userdReducer,
    usera:useraReducer,
    userm:usermReducer,
    Alldoctoruser:doctorReducer,
    Allmedicaluser:medicalReducer,
    chat:chatReducer,
}) 
const store =  createStore(masterReducer,{user:[],Alldoctoruser:[],Allmedicaluser:[],userd:[],chat:[],usera:[],userm:[]},applyMiddleware(thunk));  //create store me reducer pass krna hta ha
                                     

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('ntfctn fcm Message handled in the background!', remoteMessage);
  });
  
  function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
      // App has been launched in the background by iOS, ignore
      return null;
    }
  
    return(
        <Provider store={store}>
                <App/>
            </Provider>
            )
  }
    

AppRegistry.registerComponent(appName,() => HeadlessCheck) ;
