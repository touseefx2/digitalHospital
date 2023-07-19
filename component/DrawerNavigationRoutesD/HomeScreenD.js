import React  from 'react';
import {View,Text,ScrollView,TextInput,TouchableOpacity,ToastAndroid,ActivityIndicator, Dimensions,Image} from "react-native";
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {connect} from "react-redux"
import moment from "moment";
import firestore from '@react-native-firebase/firestore';
import {notificationManager} from "../src/NotificationManager"
import Dialog, { DialogContent,FadeAnimation} from 'react-native-popup-dialog';
import {fcmService} from "../src/FCMService"
import {cancelAlarmById} from 'react-native-simple-alarm';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-community/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';


class  HomeScreenD extends React.Component  {
  inputarr=[];
  constructor(props) {
    super(props);
    this.state = {


      specialityItems:[],
      countryItems:[],
      cityItems:[],

      isod:null,
      odv:false,
      isnod:null,
      ndv:false,
      ists:null,
      istsLoader:false,
      ev:null,

      address:"",
      city:"",
      about:"",
      country:"",
      speciality:"",
      available:"",
      slots:[],
      qualification:"",
      duration:"10",
      

      ftime:"3",
      ftime2:"00",
      ftampm:"PM",
      stime:"5",
      stime2:"00",
      stampm:"PM"
    }
  }

  storeinput   = async () => {
    try {
      this.inputarr.push({adrs:this.state.address,abt:this.state.about});
      await AsyncStorage.setItem('otherdetaildoctorinputlist',JSON.stringify(this.inputarr));
   } catch (e) {
     console.log(e);
   }
   }

   getstoreinput   = async () => {
    try {
      var value =JSON.parse(await AsyncStorage.getItem('otherdetaildoctorinputlist'))
      if(value != null)
      {
       //ye sb  o index me ha is lye  mean array k andr ik  e objct ha
        this.setState({
    address:value[0].adrs ,
    about:value[0].abt,
        })
      }
      else { 
        console.log("value is empty");
      }
   }catch(e) { console.log(e);}
  
  }

  checkOtherDetailField()
  {
    const {city,about,country,speciality,available,address,qualification} = this.state;
    if(city !="" && about !="" && country !="" && speciality !=""  && available !="" && address !="" && qualification !="")
    {
return true;
    }
    else{
     return false;
    }
  }


  saveImpDetailToDb= async () => {
    const {city,about,country,qualification,speciality,available,address,slots,duration,ftime,ftime2,ftampm,stime,stime2,stampm} = this.state;
    var firstTime= ftime+":"+ftime2+" "+ftampm;
    var endTime  = stime+":"+stime2+" "+stampm;
    var service_time = firstTime+"-"+endTime

 const uid = this.props.myuserd.uid;
if(slots.length>0)
{
  this.storeinput();
  this.inputarr=[];
firestore().collection("users").doc(uid).update({
about:about,
qualification:qualification,
available:available,
service_time:service_time,
speciality:speciality,
address:{
city:city,
country:country,
address:address,
},
duration:duration,
slots:slots
}).then(()=>{
  ToastAndroid.showWithGravity(
    "Save",
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM),
  this.setState({ndv:false,ists:null})
})
}
else{
  alert("Please Create Time Slots")
}
  }
  

  saveTokenToDatabase = async (token) => {
    // Assume user is already signed in
    const userId = this.props.myuserd.uid;
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
  
  componentDidMount = async () =>
{
  this.getstoreinput();
  this.getdropdownitems();
  fcmService.registerAppwithFCM();//forios
  fcmService.register(this.onRegister,this.onforegroundNotification,this.onbqNotification,this.onqsNotification);
  notificationManager.configure(this.onOpenNotification);

   
   

  auth().onAuthStateChanged((user)=> {   
    if (user) {
          this.setState({ev:user.emailVerified})
          console.log(user)
          const dbref =   firestore().collection("users").doc(user.uid);
          this.unsubscribee = dbref.onSnapshot( (docs)=>{
          if(docs.exists)
          {
            if(docs.data().address.city  == ""  && docs.data().slots == "" )
            {
            this.setState({isod:true,odv:true})
            }
            else{
              this.setState({isod:false})
            }
          }
          })

             } else {
      fcmService.unRegister();
      notificationManager.unRegister();
      const rdbref = database().ref('status/'+this.props.myuserd.uid);
      const dbref =   firestore().collection("users").doc(this.props.myuserd.uid);
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
  console.log("[App] fcm  onforegroundNotification D :", notify);
}

onqsNotification= async (notify) =>{
  console.log("[App] fcm  onqsNotification D :", notify);
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
    }
 }catch(e){ console.log(e);}
  
    }

}// this is prblm aftr bckgrnd state cal quite remote is also cal

onbqNotification  = async  (notify) =>
{
  console.log("[App] fcm  onbqNotification D :", notify);
  if(notify){
    try {
    await AsyncStorage.setItem('b',"true");
    if(notify.android.sound == "ios_notification"){ this.props.navigation.navigate("ChatScreen");}
    else if(notify.android.sound == "appntmnt"){ this.props.navigation.navigate("AppointmentScreen");}
 } catch (e) {
   console.log(e);
 }    

}
  
 
}

  onNotification(notify)
  {
      console.log("[App] ntfctnmngr onNotification by fcm on  D :", notify);
  }



  onOpenNotification =(notify) => //if app in  frgrndand user clk fcm msg
  {
    console.log("[App] ntfctnmngr onOpenNotification by fcm/nrml ntfctn or  cause by nrml ntfct in quit state  on  D :", notify);
    if(notify){
    if(notify.sound == "ios_notification"){this.props.navigation.navigate("ChatScreen");}
    else if(notify.sound == "appntmnt"){ this.props.navigation.navigate("AppointmentScreen");}
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
  
  componentWillUnmount()
  {
      if(this.unsubscribee) {
        this.unsubscribee();
        }
        if(this.subscriby) {
          this.subscriby();
          }
  }
getdropdownitems(){
  this.subscriby  = firestore().collection("dropdownitems").onSnapshot((doc)=>{
    if(doc.size>0)
    {
      let spi = []; let cni = []; let  cityi = [];
      doc.forEach(data=>{
      const si  = data.data().specialist;
      const ci  = data.data().country;
      const cti  = data.data().city;
      spi=si ;  cni=ci ;  cityi=cti ;
      });
     this.setState({ specialityItems: spi, countryItems:cni, cityItems:cityi})
     }else
    {
      this.setState({ specialityItems: [], cityItems:[], countryItems:[]})
    }
   })
 
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

createTimeSslots()
{
    const {ftime,ftime2,ftampm,stime,stime2,stampm,duration} = this.state;
    var firsttime= ftime+":"+ftime2+" "+ftampm;
    var endtime  = stime+":"+stime2+" "+stampm;

    let startTime = moment(firsttime,"hh:mm A");
    let endTime = moment(endtime,"hh:mm A");
    if(endTime.isBefore(startTime)){ endTime.add(1,"day")}
    let arr = [];
    while(startTime<=endTime)
    {
      arr.push(new moment(startTime).format("hh:mm A"))
      startTime.add(parseInt(duration),"minutes")
    }

    if(arr.length>0)
    {
      setTimeout(() => {
        this.setState({istsLoader:false,slots:arr,ists:true})
      }, 1200);
     
    }
}

deleteSlots(k)
{
   const {slots} = this.state;
   const index = slots.indexOf(k)
   if (index > -1) { slots.splice(index, 1) } 
   this.setState({slots:slots})
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

renderOtherDetail()
{
  const {city,about,country,speciality,available,address,qualification,specialityItems,countryItems,cityItems} = this.state;
  
  this.SpecialityItems=specialityItems.map(element=>{
    return {label: element, value: element};
   });
  this.CityItems=cityItems.map(element=>{
    return {label: element, value: element};
  });
  this.CountryItem=countryItems.map(element=>{
    return {label: element, value: element};
  });


  
  return(
  <Dialog
    visible={this.state.odv}
    style={{padding:10}}
     onHardwareBackPress={() => true}
     dialogAnimation={new FadeAnimation({
      initialValue:200, // optional
    })}
  >
    <ScrollView>
    <Text style={{ padding: 5,fontSize:17, backgroundColor: '#000', color: '#fff' }}>Please Provide Other Imp Detail</Text>
    <DialogContent>
    <View style={{alignSelf:"center",margin:10}}>   
    <View  style={{marginTop:30 }}>
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

<View style={{marginTop:15}}  >
<DropDownPicker
      items={this.SpecialityItems} 
    defaultValue={speciality}
    placeholder="Speciality"
    placeholderStyle={{ textAlign: 'center'}}
  containerStyle={{width: 170, height:50}}
    style={{backgroundColor: '#fafafa',paddingVertical: 10}}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => this.setState({
        speciality: item.value
    })}
/>    
</View>

<View style={{marginTop:15}}  >
<DropDownPicker

    items={[
        {label: 'Monday', value: 'Mon'},
        {label: 'Tuesday', value: 'Tue'},
        {label: 'Wednesday', value: 'Wed'},
        {label: 'Thursday', value: 'Thu'},
        {label: 'Friday', value: 'Fri'},
        {label: 'Saturday', value: 'Sat'},
        {label: 'Sunday', value: 'Sun'}
    ]}
    multiple={true}
multipleText="%d items have been selected."
min={0}
max={7}

    defaultValue={available}
    placeholder="Available"
    placeholderStyle={{ textAlign: 'center'}}
  containerStyle={{width: 170, height:50}}
    style={{backgroundColor: '#fafafa',paddingVertical: 10}}
    itemStyle={{justifyContent: 'flex-start'}}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => {
      this.setState({
      available: item })
      }}
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

                      <TextInput  style={{ backgroundColor:"white",width:170,height:60,fontSize:16,marginTop:15,borderColor:"black",borderWidth:0.3,textAlign:"center"}}   
                       multiline={true}
                       placeholder={"Qualification"}
                       numberOfLines={1}
                       scrollEnabled={true}
                       onChangeText={text => this.setState({qualification :text })}
                       underlineColorAndroid='transparent'     
                       defaultValue={qualification}  />

                

   <TextInput style={{backgroundColor:"white",width:170,height:60,fontSize:16,marginTop:15,borderColor:"black",borderWidth:0.3,textAlign:"center"}}  
    onChangeText={text => this.setState({about :text })}
      placeholder={"About..."}
      defaultValue={about}
      multiline={true}
      numberOfLines={1}
      scrollEnabled={true}
      underlineColorAndroid='transparent' 
/>

<TouchableOpacity style={{backgroundColor:"#307ecc",marginTop:20,padding:10,borderRadius:10,alignSelf:"center",elevation:2}} 
  onPress={()=>{
  const c = this.checkOtherDetailField()
  if(c){this.setState({odv:false,isnod:true,ndv:true,ists:false}),this.renderNextOd()}
  else { alert("Please Fill Empty Fields")}
  }
  } >
  <Text style={{color:"white",fontSize:20,fontWeight:"bold"}}> Next </Text>
</TouchableOpacity>
</View>
    </DialogContent>
    </ScrollView>
  </Dialog>

  )

}

renderNextOd()
{
  const {duration,ftampm,stampm,ftime,ftime2,stime,stime2,ists} = this.state;
  return(
  <Dialog
    visible={this.state.ndv}
    style={{padding:10}}
     onHardwareBackPress={() => true}
     dialogAnimation={new FadeAnimation({
      initialValue:200, // optional
    })}
  >
    <ScrollView>
    <Text style={{ padding: 5,fontSize:17, backgroundColor: '#000', color: '#fff' }}>Please Provide Other Imp Detail</Text>
    <DialogContent>
<Text style={{marginTop:15,fontSize:18,color:"black",margin:7}}>Service Time : </Text>
<View style={{flexDirection:"row",justifyContent:"space-between",marginTop:17}} > 
<TextInput  style={{width: 40, height:40,backgroundColor:"white",fontSize:16,borderColor:"black",borderWidth:0.7,textAlign:"center"}}
 onChangeText={text => this.setState({ftime :text })}
 defaultValue={ftime}
 maxLength={2}
 keyboardType="number-pad"
/>
<TextInput  style={{width: 40, height:40,backgroundColor:"white",fontSize:16,borderColor:"black",borderWidth:0.7,textAlign:"center"}}
 onChangeText={text => this.setState({ftime2 :text })}
 defaultValue={ftime2}
 maxLength={2}
 keyboardType="number-pad"
/>
<DropDownPicker
    items={[
        {label: 'AM', value: 'AM'},
        {label: 'PM', value: 'PM'},
    ]}
    defaultValue={ftampm} 
    placeholderStyle={{ textAlign: 'center'}}
    containerStyle={{width: 65, height:40}}
    style={{backgroundColor: '#fafafa',paddingVertical: 10}}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => this.setState({
        ftampm: item.value
    })}
/> 
<Text style={{fontSize:20,color:"white",alignSelf:"center",fontWeight:"bold"}}>-</Text>
<TextInput  style={{width: 40, height:40,backgroundColor:"white",fontSize:16,borderColor:"black",borderWidth:0.7,textAlign:"center"}}
 onChangeText={text => this.setState({stime :text })}
 defaultValue={stime}
 maxLength={2}
 keyboardType="number-pad"
/>
<TextInput  style={{width: 40, height:40,backgroundColor:"white",fontSize:16,borderColor:"black",borderWidth:0.7,textAlign:"center"}}
 onChangeText={text => this.setState({stime2 :text })}
 defaultValue={stime2}
 maxLength={2}
 keyboardType="number-pad"
/>
<DropDownPicker
    items={[
        {label: 'AM', value: 'AM'},
        {label: 'PM', value: 'PM'},
    ]}
    defaultValue={stampm} 
    placeholderStyle={{ textAlign: 'center'}}
    containerStyle={{width: 65, height:40}}
    style={{backgroundColor: '#fafafa',paddingVertical: 10}}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => this.setState({
        stampm: item.value
    })}
/>

</View>

<View style={{flexDirection:"row",marginTop:17}} >
<Text style={{marginTop:10,fontSize:18,color:"black",margin:7}}>Duration : </Text>
<TextInput  style={{width: 40, height:40,backgroundColor:"white",fontSize:16,borderColor:"black",borderWidth:0.7,textAlign:"center"}}
 onChangeText={text => this.setState({duration :text })}
 defaultValue={duration}
 maxLength={2}
 keyboardType="number-pad"
/>
<Text style={{fontSize:20,color:"black",alignSelf:"center",marginLeft:10}}>minutes</Text>
</View>

<View style={{flexDirection:"row",marginTop:27,margin:7,justifyContent:"space-between"}} >
<TouchableOpacity  mode="contained" style={{backgroundColor:"#307ecc",borderRadius:10,padding:10,elevation:2}} 
onPress={()=>{this.setState({istsLoader:true}),this.createTimeSslots()}} >
<Text style={{color:"white",fontSize:14}}>Create Time Slots</Text>
</TouchableOpacity >
{this.state.istsLoader  == true ?  <ActivityIndicator size="large" color="red" /> : null }
<TouchableOpacity style={{backgroundColor:"#307ecc",padding:10,borderRadius:10,elevation:2}}
 onPress={()=>{this.saveImpDetailToDb()}} >
<Text style={{color:"white",fontSize:15}}>Save</Text>
</TouchableOpacity>
</View>
{ists && this.renderts()}
{ists==false && this.renderets()}
    </DialogContent>
    </ScrollView>
  </Dialog>

  )

}


renderets()
{
  return(
    <View style={{alignSelf:"center",flex:1,marginTop:70}}>  
    <Text style={{fontSize:18,color:"black"}}>Empty Time Slots</Text>
    </View>
)
}

renderts()
{
  const {slots} = this.state;
  if(slots.length>0)
  {
    this.slotsarr = slots.map((k)=> {
      return (                   
          <View style={{margin:10,padding:10,backgroundColor:"white",borderRadius:20,flexShrink:1,flexDirection:"row",justifyContent:"center",alignItems:"center"}} >
          <Text style={{textAlign:"center",fontSize:14}}>{k}</Text>
          <TouchableOpacity   style={{marginLeft:10}}onPress={()=>{this.deleteSlots(k)}}
        >
         <Entypo name="cross" size={24} color="#ff2b39" />
       </TouchableOpacity>
          </View>
      
)
  })

    return(
      <View style={{alignSelf:"center",flex:1,marginTop:20,width:"95%",backgroundColor:"#307ecc",borderRadius:20}}>   
      <ScrollView>
       <View  style={{flexDirection:"row",width:"95%",justifyContent:"space-evenly",flexWrap:"wrap"}}>
       {this.slotsarr}
       </View>
        </ScrollView>
     </View>
    )
  }
}

 
render(){
const  {isod,ev,isnod} = this.state;
 
return( 
<View style={{flex:1}}>
{isod && this.renderOtherDetail()}
{!ev && this.renderEmailVerified()}
{isnod && this.renderNextOd()}
{this.renderWelcome()}
</View>
  
)
     }
  };
  

  const  mapStateToProps = (state) => 
{
  return{
 myuserd:state.userd,
        }
}

 export default connect(mapStateToProps)(HomeScreenD); 