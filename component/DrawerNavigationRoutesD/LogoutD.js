import React, { Component } from "react";
import auth from '@react-native-firebase/auth';



export default class LogoutD extends Component {


  render() {
    auth().signOut().then(()=>console.log("sigout searchd se"))
    .catch(error=>{alert(error.message)});
    
    return (
null
    );
  }
}


