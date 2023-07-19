import {createStackNavigator} from "react-navigation";
import React  from 'react';
import LoginScreen from './LoginScreen';
import DoctorSignupScreen from './DoctorSignupScreen';
import PatientSignupScreen from './PatientSignupScreen';
import MedicalSignupScreen from './MedicalSignupScreen';
import AssistantSignupScreen from './AssistantSignupScreen';
import ForgotPassword from "./ForgotPassword"

export const stacaak = createStackNavigator(
  {
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
  },
  {
    defaultNavigationOptions: ({navigation})=> {
      return {
  header:null
      };  
    }
  }
);


