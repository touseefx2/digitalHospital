import React, { Component } from "react";
import auth from '@react-native-firebase/auth';



export default class LogoutM extends Component {


  render() {
    auth().signOut().then(()=>console.log("sigout  mddcl se"))
    .catch(error=>{alert(error.message)});
    
    return (
null
    );
  }
}


