import React  from 'react';
import { StyleSheet,View,Text,TouchableOpacity,ToastAndroid,TextInput,AppState,PermissionsAndroid} from "react-native";
import SpecialityCard from "./SpecialityCard";
import { ScrollView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {notificationManager} from "../src/NotificationManager"
import {connect} from "react-redux"
import firestore from '@react-native-firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-community/async-storage';
import {fcmService} from "../src/FCMService"
import {cancelAlarmById} from 'react-native-simple-alarm';
import Dialog, { DialogContent,FadeAnimation,DialogFooter,DialogButton} from 'react-native-popup-dialog';


 class  Home extends React.Component  {
   
  constructor(props) {
    super(props);
    this.state = {
      specialityItems:[],
      countryItem:[],
      cityItem:[],
      simg:[],
      appState: AppState.currentState,
    }
  }

 clctspcltyitem()
  {
    this.subscribyy=firestore().collection("users").onSnapshot((doc)=>{
       this.subscriby  = firestore().collection("dropdownitems").onSnapshot((doc)=>{
        if(doc.size>0)
        {
          let spi = []; let ci = []; let  ctyi = []; let simg = []
          doc.forEach(data=>{
          const si  = data.data().specialist;
          const cti  = data.data().city;
          const cni  = data.data().country;
          const spim  = data.data().si;
          spi=si ;  ci=cni ;  ctyi=cti ; simg=spim
          });
           this.setState({simg:simg})
          let fspi = []
          spi.map((a)=>{
            let i=0;
            this.props.mydoctorusers.forEach(b => {
              // console.log("home1 se ",b)
              if(a==b.speciality)
              {
                i++;
              }
            });
            const obj= {total:i,spclty:a}
            fspi.push(obj)           
          })

          this.setState({ specialityItems: fspi,countryItem:ci,cityItem:ctyi})
         }else
        {
          this.setState({ specialityItems: [],countryItem:[],cityItem:[]})
        }
       })
      
    
    })
   
  }
  
componentDidMount()
{
 
  this.clctspcltyitem()
  fcmService.registerAppwithFCM();//forios
  fcmService.register(this.onRegister,this.onforegroundNotification,this.onbqNotification,this.onqsNotification);
  notificationManager.configure(this.onOpenNotification);
  const roomRef =  firestore().collection('videocallrooms').doc(auth().currentUser.uid);
  roomRef.onSnapshot(async (d)=>{
   if(!d.exists){}else{
   
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
        this.props.navigation.navigate("JoinVideo")
      } else {
        //If permission denied then show alert 'Storage Permission Not Granted'
        alert('Audio/Video Permission Not Granted \n Some One is calling you \n Please allow this feature to use video call');
      }
    } catch (err) {
      //To handle permission related issue
      console.log(err);
    }
    
   }
  })
  //ye yahan is lye kya kyn k drwr se logout krna ha to yahan drwr k ksi scren me obsrvr dena pare ga
 auth().onAuthStateChanged((user)=> {   
    if (user) {
      this.setState({ev:user.emailVerified})
      firestore().collection("users").doc(user.uid).get().then((doc)=>{
         if(doc.data().address.city =="" && doc.data().address.address==""){this.setState({od:true})}
      })
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

onforegroundNotification = (notify) =>{
  console.log("[App] fcm  onforegroundNotification P :", notify);
}

onqsNotification= async (notify) =>{
  console.log("[App] fcm  onqsNotification P :", notify);
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
      if(notify.android.sound == "ios_notification"){ this.props.navigation.navigate("ChatScreen"); }
      else if(notify.android.sound == "appntmnt"){ this.props.navigation.navigate("AppointmentScreen");}
      else if(notify.android.sound == "order"){ this.props.navigation.navigate("MyOrders");}
    }
 }catch(e){ console.log(e);}
  
    }

}// this is prblm aftr bckgrnd state cal quite remote is also cal i solve by asyn strge var

onbqNotification  = async  (notify) =>
{
  console.log("[App] fcm  onbqNotification P :", notify);
  if(notify){
    try {
    await AsyncStorage.setItem('b',"true");
    if(notify.android.sound == "ios_notification"){ this.props.navigation.navigate("ChatScreen");}
    else if(notify.android.sound == "appntmnt"){ this.props.navigation.navigate("AppointmentScreen");}
    else if(notify.android.sound == "order"){ this.props.navigation.navigate("MyOrders");}
 } catch (e) {
   console.log(e);
 }    
  
}
}

  onNotification(notify)
  {
      console.log("[App] ntfctnmngr onNotification by fcm on  P :", notify);
  }

  onOpenNotification =(notify) => //if app in  frgrndand user clk fcm msg
  {
    console.log("[App] ntfctnmngr onOpenNotification by fcm/nrml ntfctn on  P :", notify);
    if(notify){
    if(notify.sound == "ios_notification"){this.props.navigation.navigate("ChatScreen");}
    else if(notify.sound == "appntmnt"){ this.props.navigation.navigate("AppointmentScreen");}
    else if(notify.sound == "order"){ this.props.navigation.navigate("MyOrders");}
    else if(notify.soundName == "alarm.mp3" )
         {
         if(notify.action == "Open" )
         {
          }
         
         else if(notify.action == "Off" )
         {
           cancelAlarmById(notify.id);
         }
     }

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




componentWillUnmount()
{
  if(this.subscriby) {
    this.subscriby();
    } 
    if(this.subscribyy) {
      this.subscribyy();
      }
}


saveod()
 {
   if(this.state.city!="" && this.state.address!="" && this.state.country!="")
   {
    firestore().collection("users").doc(this.props.myuser.uid).update({
      address:{
        city:this.state.city,
        address:this.state.address,
        country:this.state.country,
      }
        }).then(()=>{
          this.setState({od:false});
          ToastAndroid.showWithGravity(
            "Save",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM);
        })
   }else {alert("Please Fill Empty Field")}

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

renderEmailVerified()
{
  return(
    <View style={{flexDirection:"row", backgroundColor:"#307ecc",padding:5,justifyContent:"space-between"}}>
    <Text style={{ fontSize:17, color: '#fff' }}>Please verify your email....</Text>
    <TouchableOpacity  onPress={()=>this.sendEmailVerificationLink()}>
   <Text style={{color:"yellow",fontSize:17,fontWeight:'bold'}}>Verify</Text>
   </TouchableOpacity >
    </View>
  )
}

renderOtherDetail()
{
  const {city,address,country,countryItem,cityItem} = this.state;
  this.CityItems=cityItem.map(element=>{
    return {label: element, value: element};
  });
  this.CountryItem=countryItem.map(element=>{
    return {label: element, value: element};
  });
  return(
  <Dialog
  footer={
    <DialogFooter>
      <DialogButton
        text="Cancel"
        onPress={() => {this.setState({od:false})}}
      />
      <DialogButton
        text="Save"
        onPress={() => {this.saveod() }}
      />
    </DialogFooter>
  }
    visible={this.state.od}
    style={{padding:10}}
     onHardwareBackPress={() => true}
     dialogAnimation={new FadeAnimation({
      initialValue: 0, // optional
      animationDuration: 150, // optional
      useNativeDriver: true, // optional
    })}
  >
    <DialogContent>
    <Text style={{ fontSize:16,fontWeight:"bold" }}>Please Provide Other Imp Detail</Text>
    <View  style={{marginTop:15 }}>
  <DropDownPicker
     items={this.CountryItem} 
    defaultValue={country} 
    placeholder="Country"
    placeholderStyle={{ textAlign: 'center'}}
  containerStyle={{width: 170, height:50}}
    style={{backgroundColor: '#fafafa',paddingVertical: 10}}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => this.setState({
        country: item.value
    })}
/> 
</View>
  
    <View style={{marginTop:15 }}  >
<DropDownPicker
    items={this.CityItems} 
    defaultValue={city}
    placeholder="City"
    placeholderStyle={{ textAlign: 'center',}}
  containerStyle={{width: 170, height:50}}
    style={{backgroundColor: '#fafafa',paddingVertical: 10}}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => this.setState({
        city: item.value
    })}
/>    
</View>


<TextInput  style={{ backgroundColor:"white",width:170,fontSize:16,height:60,marginTop:15,borderColor:"black",borderWidth:0.3,textAlign:"center"}}  
    onChangeText={text => this.setState({address :text })}
      placeholder={"Address"}
      defaultValue={address}
      multiline={true}
      numberOfLines={1}
      scrollEnabled={true}
      underlineColorAndroid='transparent'  
/>


    </DialogContent>
  </Dialog>

  )

}


render(){  
  const  {specialityItems,ev,simg} = this.state;
 if(specialityItems.length>0)
 {
let i = -1;
this.item = specialityItems.map( (e) =>{
  i++;
        return(  
       <SpecialityCard img={simg[i]} cuid={this.props.myuser} navigate={this.props.navigation.navigate} spclty={e.spclty} total={e.total}  />
            )

   });

 }else
 {
  this.item = null;
 }
 
return(
  
       <View style={styles.container}>
        {!ev && this.renderEmailVerified()}
        {this.renderOtherDetail()}
        <Text style={{fontSize:22,color:"#307ecc",margin:5,marginTop:15,fontWeight:"700"}} >Choose Speciality</Text>
          <ScrollView>
            <View style={{marginTop:"5%",flexDirection:"row",justifyContent:"space-between",flexWrap:"wrap",padding:3,margin:3}}>
            {this.item} 
            </View>   
          </ScrollView>

      </View>
)
     }

  };

  

const styles= StyleSheet.create({

  container:
  {
    flex:1,
    backgroundColor:"white"
  }
});


const  mapStateToProps = (state) => 
{
  return{
 mydoctorusers:state.Alldoctoruser,
 myuser:state.user,
        }
}

export default connect(mapStateToProps)(Home); 