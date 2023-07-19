import React, { Component } from "react";
import auth from '@react-native-firebase/auth';



export default class Logout extends Component {


  render() {
    auth().signOut().then(()=>console.log("sigout search se"))
    .catch(error=>{alert(error.message)});
    
    return (
null
    );
  }
}


