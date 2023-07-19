import React, { Component } from "react";
import { View,ActivityIndicator,PermissionsAndroid,ToastAndroid} from "react-native";
import {connect} from "react-redux"
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {action_SetUser} from "./Redux/Actions/userAction"
import {action_SetdUser} from "./Redux/Actions/userAction"
import {action_SetaUser} from "./Redux/Actions/userAction"
import {action_SetmUser} from "./Redux/Actions/userAction"
import {action_SetDUsers} from "./Redux/Actions/doctorusersAction"  //all dctr set
import {action_SetMUsers} from "./Redux/Actions/medicalusersAction"   //all mdcl user

// ye is lye bnae jb login scs ho jae to us k bad  user ka data agy recv kr k drwr nvgtn me bjh sken search screen 
//khd drwr k and thi is lye ni bjh skte thy


class  LoginSuccessLoading extends Component  {

   componentDidMount () { 
      auth().onAuthStateChanged(async  (user)=> {
      if (user) 
        {  
          user.reload();  
        
           const dbref =   firestore().collection("users").doc(user.uid);
           await     dbref.get().then( async (doc) => {
              if (doc.exists) { //exist ik bar e dta ha  data
                 const user = doc.data();             
                 if(user.type == "patient")
                 {
                  // for dynmcly set redux user if any chnge in database
              dbref.onSnapshot((doc)=> { 
                this.props.SetUser(doc.data())
              })
                   //  get all doctor in redux to show patient (dynmcly set in redux)
              const myitem  =  firestore().collection("users").where("type", "==", "doctor")
              myitem.onSnapshot((doc)=> { 
                  if(doc != null)
                  { 
                    const doctors = [];
                    doc.forEach((d)=> {
                      // console.log("lsgns cs se",d)
                      doctors.push(d.data())
                  }); 
                    this.props.SetDUsers(doctors); 
                  }
                  } );

                  const myitem2  =  firestore().collection("users").where("type", "==", "Medical")
                  myitem2.onSnapshot((doc)=> { 
                      if(doc != null)
                      { 
                        const medicals = [];
                        doc.forEach((d)=> {
                         medicals.push(d.data())
                      }); 
                        this.props.SetMUsers(medicals); 
                      }
                      } );
                 
                      try {
                        const granted = await PermissionsAndroid.request(
                          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                          {
                            title: 'Audio Permission Required',
                            message: 'This app needs access to your Audio to accept Video Call\n\nClick oustide this box and then allow this feature',
                          }
                        );
                    
                        const granted2 = await PermissionsAndroid.request(
                          PermissionsAndroid.PERMISSIONS.CAMERA,
                          {
                            title: 'Take Picture and video Permission Required',
                            message: 'This app needs access to your Camera to accept Video Call\n Click oustide this box and then allow this feature ',
                          }
                        );
                    
                        if (granted === PermissionsAndroid.RESULTS.GRANTED && granted2 === PermissionsAndroid.RESULTS.GRANTED ) {
                          //Once user grant the permission start downloading
                          console.log('Storage Permission Granted.');
                          console.log("loginldng se patntdrwr");
                          this.props.navigation.navigate("DrawerNavigationRoutesP" );
                        } else {
                          //If permission denied then show alert 'Storage Permission Not Granted'
                             ToastAndroid.showWithGravity(
                            "Audio/Video Permission Not Granted\n\nFor using Video call Please allow this feature",
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM);
                            this.props.navigation.navigate("DrawerNavigationRoutesP" );
                        }
                      } catch (err) {
                        //To handle permission related issue
                        console.log(err);
                      }
                    

                  
                 }
                 else if(user.type == "doctor")
                 {
                   // for dynmcly set redux user if any chnge in database
                    dbref.onSnapshot((doc)=> { 
                      this.props.SetdctrUser(doc.data())
                  })

              const myitem  =  firestore().collection("users").where("type", "==", "doctor")
              myitem.onSnapshot((doc)=> { 
                  if(doc != null)
                  { 
                    const doctors = [];
                    doc.forEach((d)=> {
                      // console.log("lsgns cs se",d)
                      doctors.push(d.data())
                  }); 
                    this.props.SetDUsers(doctors); 
                  }
                  } );



                  console.log("loginldng se dctrdrwr");
                  this.props.navigation.navigate("DrawerNavigationRoutesD" );
                 }
                 else if(user.type == "Assistant")
                 {
                   // for dynmcly set redux user if any chnge in database
                    dbref.onSnapshot((doc)=> { 
                      this.props.SetasstntUser(doc.data())
                  })
                  console.log("loginldng se asstnt drwr");
                  this.props.navigation.navigate("DrawerNavigationRoutesA" );
                 }
                 else if(user.type == "Medical")
                 {
                   // for dynmcly set redux user if any chnge in database
                    dbref.onSnapshot((doc)=> { 
                      this.props.SetmdclUser(doc.data())
                  })
                  console.log("loginldng se medcl drwr");
                  this.props.navigation.navigate("DrawerNavigationRoutesM" );
                 }
              } else {
                  console.log("No any user found in table but login sucees ");
                  // this.props.navigation.navigate("LoginScreen")
              }
          }).catch(function(error) {
              console.log("Error getting document:", error);
          });

          
      
          } //end if uer

          //for just chkng 
          else{
            console.log("no user in loginloadncreen")
              this.props.navigation.navigate("LoginScreen")          
          }
         
    
 })
  }

  

render(){

  
return(
      <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"white"}}>  
     <ActivityIndicator size="large" color="#307ecc"></ActivityIndicator>
      </View>
)
     }

  }


const  mapDispatchToProps = (dispatch) => { 
  return{
   SetUser:(u)=>{ dispatch(action_SetUser(u))},  //set crnt ptntn usr
   SetdctrUser:(u)=>{ dispatch(action_SetdUser(u))}, //set crnt dctr user
   SetasstntUser:(u)=>{ dispatch(action_SetaUser(u))}, //set crnt asstnt user
   SetmdclUser:(u)=>{ dispatch(action_SetmUser(u))}, //set crnt mdcl user
   SetDUsers:(u)=>{ dispatch(action_SetDUsers(u))}, // set dctr all usr
   SetMUsers:(u)=>{ dispatch(action_SetMUsers(u))}, // set dctr all usr
         }
}



  export default connect(null,mapDispatchToProps)(LoginSuccessLoading) ;
