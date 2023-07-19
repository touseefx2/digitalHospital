import React  from 'react';
import {View,Text,TouchableOpacity,ToastAndroid,Image,Dimensions} from "react-native";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from "react-redux"
import firestore from '@react-native-firebase/firestore';
import Dialog, { SlideAnimation,DialogFooter,DialogButton,DialogTitle} from 'react-native-popup-dialog';
import {notificationManager} from "../src/NotificationManager"
import {fcmService} from "../src/FCMService"


class  HomeScreenM extends React.Component  {

  constructor(props) {
    super(props);
    this.state = {
      ev:null,
      v:true
    }
  }

  saveTokenToDatabase = async (token) => {
    // Assume user is already signed in
    const userId = this.props.myuser.uid;
    // Add the token to the users datastore
    await firestore()
      .collection('users')
      .doc(userId)
      .update({
        token: token,
      }).then(console.log("[App] token save in database"));
  }
  
  onRegister = (token) =>
  {
    console.log("[App] onRegister :", token);
    if(token!=null)
   { this.saveTokenToDatabase(token); }
  }
  
componentDidMount()
{
  fcmService.registerAppwithFCM();//forios
  fcmService.register(this.onRegister,this.onforegroundNotification,this.onbqNotification,this.onqsNotification);
  notificationManager.configure(this.onOpenNotification);
 auth().onAuthStateChanged((user)=> {   
    if (user) {
this.setState({ev:user.emailVerified})
console.log(user)
             } else {
      fcmService.unRegister();
      notificationManager.unRegister();
      const rdbref = database().ref('status/'+this.props.myuser.uid);
      const dbref =   firestore().collection("users").doc(this.props.myuser.uid);
      rdbref.set({
        status:"offline",
      })
      dbref.update({
        lastonline:firestore.FieldValue.serverTimestamp(),
        status:"Offline"
      })
  console.log("srchd se no user so nvgt login");
  this.props.navigation.navigate("LoginScreen");

}
  })

}


onforegroundNotification = (notify) =>{
  console.log("[App] fcm  onforegroundNotification M :", notify);
}

onqsNotification= async (notify) =>{
  console.log("[App] fcm  onqsNotification M :", notify);
  if(notify){
  try {
    var b =await AsyncStorage.getItem('b')|| ""
    if(b != "")
    {
      if(b == "true" ){
       console.log("ye bckgrnd k bad wala quit a ra so no code")
      }
    }
    else { 
      console.log("1st time quitsttae")
      if(notify.android.sound == "ios_notification"){ this.props.navigation.navigate("Chats"); }
      else if(notify.android.sound == "order"){ this.props.navigation.navigate("MyOrders");}
    }
 }catch(e){ console.log(e);}
  
    }

}// this is prblm aftr bckgrnd state cal quite remote is also cal i solve by asyn strge var

onbqNotification  = async  (notify) =>
{
  console.log("[App] fcm  onbqNotification M :", notify);
  if(notify){
    try {
    await AsyncStorage.setItem('b',"true");
    if(notify.android.sound == "ios_notification"){ this.props.navigation.navigate("Chats");}
    else if(notify.android.sound == "order"){ this.props.navigation.navigate("MyOrders");}
 } catch (e) {
   console.log(e);
 }    
  
}
}

  onNotification(notify)
  {
      console.log("[App] ntfctnmngr onNotification by fcm on  M :", notify);
  }


  onOpenNotification =(notify) => //if app in  frgrndand user clk fcm msg
  {
    console.log("[App] ntfctnmngr onOpenNotification by fcm/nrml ntfctn on  M :", notify);
    if(notify){
    if(notify.sound == "ios_notification"){this.props.navigation.navigate("Chats");}
    else if(notify.sound == "order"){ this.props.navigation.navigate("MyOrders");}
    }

  }
  

componentWillUnmount()
{
    if(this.unsubscribee) {
      this.unsubscribee();
      }
}

sendEmailVerificationLink()
{
auth().currentUser.sendEmailVerification().then(()=>{
          ToastAndroid.showWithGravity(
          "Email verifiaction link is \n send to your email :"+auth().currentUser.email+"\n Please verify email !",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM)
}).catch((e)=>{alert(e)})
}



renderDelivery()
{
  return(
    <Dialog
    footer={
      <DialogFooter>
        <DialogButton
          text="Ok"
          onPress={async () => {
           await this.setState({v:false});
          this.props.navigation.navigate("DeliveryStackM")}}
        />
      </DialogFooter>
    }
      visible={this.state.v}
      style={{padding:10}}
      onHardwareBackPress={() => true}
    dialogAnimation={new SlideAnimation({
      slideFrom: 'top',
      initialValue: 0, // optional
      useNativeDriver: true, // optional
    })}
     dialogTitle={<DialogTitle title="Please add delivery method" />}
    >     
    </Dialog>

   )}

   renderEmailVerified()
{
  return(
    <View style={{flexDirection:"row", backgroundColor:  "#307ecc",padding:5,justifyContent:"space-between"}}>
    <Text style={{ fontSize:17, color: '#fff' }}>Please verify your email....</Text>
    <TouchableOpacity  onPress={()=>this.sendEmailVerificationLink()}>
   <Text style={{color:"yellow",fontSize:17,fontWeight:'bold'}}>Verify</Text>
   </TouchableOpacity >
    </View>
  )
}

   renderWelcome()
{
  return(
    <View style={{padding:5}}>
   <Image source={require("../../assets/wg.gif")}  
    style={{width:250, height:220}} /> 
    <Image source={require("../../assets/wd.gif")}  
    style={{width:300, height:300,position:"absolute",right:0,marginTop:"50%"}} /> 
    </View>
  )
}

render(){
  const  {ev} = this.state;
  console.log(this.props.myuser)
return( 
<View style={{flex:1}}>
  {this.props.myuser.delivery == false  && this.renderDelivery()}
  {!ev && this.renderEmailVerified()}
  {this.renderWelcome()}
</View>
)
     }
  };
  

  const  mapStateToProps = (state) => 
{
  return{
 myuser:state.userm,
        }
}

 export default connect(mapStateToProps)(HomeScreenM); 