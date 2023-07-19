import React  from 'react';
import { StyleSheet,View,Text} from "react-native";
import ShowMedicalsCard from "./ShowMedicalsCard";
import { Container,Content } from 'native-base';
import { Searchbar } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {notificationManager} from "../src/NotificationManager"
import {connect} from "react-redux"
import firestore from '@react-native-firebase/firestore';
import {fcmService} from "../src/FCMService"


 class  MedicalScreen extends React.Component  { 

  constructor(props) {
    super(props);
    this.state = {
     search:""
    }
  }
  
// saveTokenToDatabase = async (token) => {
//   // Assume user is already signed in
//   const userId = this.props.myuser.uid;
//   // Add the token to the users datastore
//   await firestore()
//     .collection('users')
//     .doc(userId)
//     .update({
//       token: token,
//     }).then(console.log("[App] token save in database"));
// }

// onRegister = (token) =>
// {
//   console.log("[App] onRegister :", token);
//   if(token!=null)
//  { this.saveTokenToDatabase(token); }
// }

// onNotification(notify)
// {
//   console.log("[App] onNotification P :", notify);
//   const options =
//   {
//     soundName: "ios_notification.mp3",  //andrd/app/src/main/raw k and ntctn dal do mp3 os us ka nam de do
//     playSound:true,      
//     vibrate:true           //or vibrate k lye permision dne hti manifst me see pakag docs
//   }
//   notificationManager.showNotification("1",notify.title,notify.body,notify,options);

// }

// onOpenNotification =(notify) =>
// {
//    console.log("[App] onOpenNotification P :", notify);
//    if(notify.soundName == "ios_notification.mp3" || notify.messageId != "")
//    {
//     this.props.navigation.navigate("ChatScreen");
//    }
// }

componentDidMount()
{
  // notificationManager.configure(this.onOpenNotification);
  // fcmService.registerAppwithFCM();//forios
  // fcmService.register(this.onRegister,this.onNotification,this.onOpenNotification);
  // //ye yahan is lye kya kyn k drwr se logout krna ha to yahan drwr k ksi scren me obsrvr dena pare ga
 auth().onAuthStateChanged((user)=> {   
    if (user) {
    console.log(user);
    } else { 
      const rdbref = database().ref('status/'+this.props.myuser.uid);
      const dbref =   firestore().collection("users").doc(this.props.myuser.uid);
      rdbref.set({
        status:"offline",
      })
      dbref.update({
        lastonline:firestore.FieldValue.serverTimestamp(),
        status:"Offline"
      })
      fcmService.unRegister();
      notificationManager.unRegister();
  console.log("srch se no user so nvgt login");
  this.props.navigation.navigate("LoginScreen");

}
  })

}



render(){  

  const  {search} = this.state;
 if(this.props.mymedicalusers)
  {
     this.item = this.props.mymedicalusers.map( (mc) =>{
if(mc.delivery){

  if(search=="")
  {
         return(
           <ShowMedicalsCard  navigate={this.props.navigation.navigate}  d={mc}   />
         )
         
  }else if(search != "")
  {
     const s= search.toLowerCase();
     const dname = mc.username.toLowerCase() 
     const sl = s.length;  const dn =  dname.substr(0, sl);
    if(s==dn)
    {
     return(
       <ShowMedicalsCard  navigate={this.props.navigation.navigate} d={mc}     />
     )
    } 
  }

}   
   });
  }else{   this.item  =  <Text style={{fontSize:30,color:"silver",marginTop:"40%",textAlign:"center"}}>No Record Found</Text>}

  
 
return(
  <Container >
    <Searchbar placeholder="Search by medical store name" placeholderTextColor="silver" style={{elevation:4,marginTop:1}} onChangeText={t=>this.setState({search:t})} value={this.state.search}  />
  <Content>
          <ScrollView>
          <View style={{marginTop:"10%",flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",margin:7}}>
            {this.item}
            </View>   
          </ScrollView>
  </Content>
       </Container>
)
     }

  };

  

const styles= StyleSheet.create({

  container:
  {
    flex:1,
    backgroundColor:"silver",
  }
});


const  mapStateToProps = (state) => 
{
  return{
 mymedicalusers:state.Allmedicaluser,
 myuser:state.user,
        }
}



export default connect(mapStateToProps)(MedicalScreen); 