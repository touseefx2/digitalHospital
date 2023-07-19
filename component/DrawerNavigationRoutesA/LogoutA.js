import React, { Component } from "react";
import auth from '@react-native-firebase/auth';



export default class LogoutA extends Component {


  render() {
    auth().signOut().then(()=>console.log("sigout asstnt se"))
    .catch(error=>{alert(error.message)});
    
    return (
null
    );
  }
}


