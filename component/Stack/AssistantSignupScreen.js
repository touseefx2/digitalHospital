import React, { Component } from "react";
import {  View,Image,ToastAndroid,TouchableOpacity,StyleSheet,ActivityIndicator, Keyboard,Modal} from "react-native";
import { Item, Input, Label,Icon,Form,Content,Container,Text,Spinner} from 'native-base';
import {Button} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {Appbar} from "react-native-paper";
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin,GoogleSigninButton} from '@react-native-community/google-signin';
import Dialog, { DialogContent,FadeAnimation} from 'react-native-popup-dialog';
import firestore from '@react-native-firebase/firestore';



export default class AssistantSignupScreen extends Component {

  inputarr=[];
  constructor(props)
{
  super(props);
  this.state={
  type:"Assistant", 
  photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQmwhpgFNYWplnRky7pig1D8zshLmEjRIIzHg&usqp=CAU",
  name:"",
  ishidep:true,
  psd:"",
  eml:"",
  cnic:"",
  phn:"+92",
  refdoctoremail:"",
  gndr:"",
  status:"Offline",
  lastOnline:"",
  bc1:"white",
  bc2:"white",
  cu:null,
//for google rndr
  guserInfo:null,
  gettinggLoginStatus:false,
//foe phn vrfctn
  message:"",
  load:false,
  tick:false,
  mv:false,
  clk:false,
  };
}

componentDidMount()
{
  console.log("cdm cal")
this.getstoreinput();
setTimeout(()=>{ this.changeclrgndr()},100)
}

validate= ()=>
{
 if(this.state.name == "" || this.state.psd== "" || this.state.eml == "" || this.state.phn == "" || this.state.gndr == ""  || this.state.refdoctoremail == "" )
   return false;
 else
   return true;
}

 emailvalidate= ()=>
 {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var email = this.state.eml;
  var demail = this.state.refdoctoremail;
  if (reg.test(email) === false ||  reg.test(demail) === false) {
    alert("Email pattern in invalid please correct pattern \n Example : abc@c2.com ")
    return false;
  }
  else {
    console.log("Email is Correct");
    return true;
  }
 }

 
 phonevalidate= ()=>
 {
  let reg = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/;
  var phn = this.state.phn;
  if (reg.test(phn) === false || phn.length < 13 || phn.length >13  ) {
    alert("Phone  pattern in invalid please correct pattern  \n Example : +923071234567")
    return false;
  }
  else {
    console.log("phone is Correct");
    return true;
  }
 }

 clearform = () =>
 {
   this.setState({
    name:"",
    psd:"",
    eml:"",
    phn:"+92",
    gndr:"",
    bc1:"white",
    bc2:"white",
    refdoctoremail:""
   })
 }

 storeinput   = async () => {
  try {
    this.inputarr.push({n:this.state.name,pn:this.state.phn,e:this.state.eml,g:this.state.gndr});
    await AsyncStorage.setItem('assistantinputlist',JSON.stringify(this.inputarr));
    console.log("input is store");
 } catch (e) {
   console.log(e);
 }
 }

 getstoreinput   = async () => {
  try {
    var value =JSON.parse(await AsyncStorage.getItem('assistantinputlist'))
    if(value != null)
    {
      console.log(value);
     //ye sb  o index me ha is lye  mean array k andr ik  e objct ha
      this.setState({
  name:value[0].n ,
  eml:value[0].e,
  phn:value[0].pn,
  gndr:value[0].g,
      })
    }
    else { 
      console.log("value is empty");
    }
 }catch(e) { console.log(e);}

}

 googlesignin =  async () => {
  GoogleSignin.configure({
    //It is mandatory to call this method before attempting to call signIn()
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    // Repleace with your webClientId generated from Firebase console
    webClientId:"293087775218-qgb53igkarjbtktt0nei3on13gv4p8v6.apps.googleusercontent.com",
   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  });
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn().then(({user})=>{ 
      console.log(user), this.setState({guserInfo:user,gettinggLoginStatus:true,psd:""})})
    .then(()=>this.signOutg()).catch((e)=>{alert(e)})
  }catch (error) {
    var errorMessage = error.message;
    var si  = errorMessage.indexOf("]")+1
    var  ei  = errorMessage.length -1
    const msg = errorMessage.substr(si,ei)
    alert(msg);
    }
  };
  


signOutg = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (error) {
    console.error(error);
  }
};


  changeclrgndr()
{
  if(this.state.gndr == "Male")
  {
  this.setState({bc1:"#c2d0ff",bc2:"white"})
  }
  else if(this.state.gndr == "FeMale")
  {
    this.setState({bc2:"#c2d0ff",bc1:"white"})
  }
}



Click(p)
{
var v = this.validate();
if(v)
{
var ev = this.emailvalidate();
var pv= this.phonevalidate();

if(ev && pv)
{
  this.storeinput();
  this.inputarr=[];


   if(this.state.psd.length < 6 )
{
  alert("passwor length must be greater or equal to 6");
}
else//pswd chkng else
{
 this.setState({clk:true,mv:true,load:true});
  auth().verifyPhoneNumber(p).on('state_changed', async (phoneAuthSnapshot) => {
 switch (phoneAuthSnapshot.state) {
   //  IOS AND ANDROID EVENTS
   case auth.PhoneAuthState.CODE_SENT: // or 'sent'
   setTimeout(() => {
    this.setState({message:"Phone num Verification code sent to number : "+this.state.phn+" \n Auto verify process Please wait..."}) 
   },300)
     break;
   case auth.PhoneAuthState.ERROR: // or 'error'
   setTimeout(() => {
    this.setState({message:"Phone num  verification code not send \n or  to many request send so try again latter after some time",load:false})
   },300)
     break;
   // ANDROID ONLY EVENTS
   case auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
   setTimeout(() => {
    this.setState({load:false,message:"Phone num Auto verification  timed out  plz try again  \n or Register with correct phone number \n or please use your current mobile number in which app is install"})
   },300)
     break;
   case auth.PhoneAuthState.AUTO_VERIFIED: 
   setTimeout(() => {
    this.setState({message:"Phone num Auto Verified successfull",load:false,tick:true})
   },300)   ;
     setTimeout(() => {
  firestore().collection("users").where('email' , '==' , `${this.state.refdoctoremail}`).get().then((d)=>{
    if(d.size>0)
    {
      let read = false;
      let id ="";
      d.forEach(e => {
        if(e.data().type  == "doctor" )
        {
          read = true;
          id = e.data().uid;
        }
      });

      if(read)
      {
        this.handleSubmit(this.state.eml,this.state.psd,id);
      }else{
        alert("refdoctoremail not found in Doctor \n Please enter correct refdoctoremail")
      }

    }else{
      alert("refdoctoremail is  not found in Doctor  \n Please enter correct refdoctoremail")
    }
          })

    this.setState({mv:false})
    },1500) ;
    break;
 }
});

}

}//emil vldte chck

}//form fill chk
else
{
alert("Fill Empty Eields");
}

}

gclick= async (p) =>
{
  this.setState({clk:false,load:false,tick:false,message:"",mv:false})

  const {guserInfo,psd,phn,gndr} = this.state;
  if( psd== "" || phn == "" || gndr == ""  || refdoctoremail == "" )
  {
    alert("Fill empty field")
  }
 else
   {
var pv= this.phonevalidate();
if(pv)
{
  var   gn = guserInfo.name;
  var   ge = guserInfo.email;
  try {
    this.inputarr.push({n:gn,pn:phn,e:ge,g:gndr});
    await AsyncStorage.setItem('patientinputlist',JSON.stringify(this.inputarr));
    console.log("input is store");
    this.inputarr=[];

 } catch (e) {
  alert(e);
 }
 this.inputarr=[];

 if(psd.length < 6 )
 {
   alert("passwor length must be greater or equal to 6");
 }
 else//pswd chkng else
 {
  this.setState({clk:true,mv:true,load:true});
  auth().verifyPhoneNumber(p).on('state_changed', async (phoneAuthSnapshot) => {
 switch (phoneAuthSnapshot.state) {
   //  IOS AND ANDROID EVENTS
   case auth.PhoneAuthState.CODE_SENT: // or 'sent'
   setTimeout(() => {
    this.setState({message:"Phone num Verification code sent to number : "+this.state.phn+" \n Auto verify process Please wait..."}) 
   },300)
     break;
   case auth.PhoneAuthState.ERROR: // or 'error'
   setTimeout(() => {
    this.setState({mv:false,load:false});
    alert("Phone num  verification code not send \n or  to many request send so try again latter after some time")
   },300)
     break;
   // ANDROID ONLY EVENTS
   case auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
   setTimeout(() => {
    this.setState({load:false,mv:false})
    alert("Phone num Auto verification  timed out  plz try again  \n or Register with correct phone number \n or please use your current mobile number in which app is install")
   },300)
     break;
   case auth.PhoneAuthState.AUTO_VERIFIED: 
   setTimeout(() => {
    this.setState({message:"Phone num Auto Verified successfull",load:false,tick:true})
   },300)   ;
     setTimeout(() => {
  firestore().collection("users").where('email' , '==' , `${this.state.refdoctoremail}`).get().then((d)=>{
    if(d.size>0)
    {
      let read = false;
      let id ="";
      d.forEach(e => {
        if(e.data().type  == "doctor" )
        {
          read = true;
          id = e.data().uid;
        }
      });

      if(read)
      {
        this.ghandleSubmit(guserInfo.email,this.state.psd,id);
      }else{
        alert("refdoctoremail not found in Doctor \n Please enter correct refdoctoremail")
      }

    }else{
      alert("refdoctoremail is  not found in Doctor  \n Please enter correct refdoctoremail")
    }
          })
         this.setState({mv:false})
      },1500)   ;
      break;
  }
 });
 
 }


}

}  
}

handleSubmit = async(e,p,id) => {
  await auth().createUserWithEmailAndPassword(e,p)
  .then((result)=>{  
    if(result != null)
  {
    this.setState({cu:result.user})
      result.user.updateProfile({
        displayName: this.state.name,
        photoURL:this.state.photo,
      })
  
      const address= {
        city:"",
        address:"",
        country:"Pakistan"
      }
  //To use a custom ID you need to use .set, rather than .add
        
             firestore().collection('users').doc(result.user.uid).set({
              email : result.user.email, //ye id or email update ni krte pehly k creat ho jati is lye aces kr skte sath hi
              uid :result.user.uid,
              username :this.state.name,
              gender : this.state.gndr,
              phone: this.state.phn,
              photo : this.state.photo,
              refdoctoremail:this.state.refdoctoremail,
              refdoctorid:id,
              doctorrequest:false,
              type: this.state.type,
              status: this.state.status,
              lastonline: this.state.lastOnline,
              address,
              createdat: new Date(),
              token:null,
             }).
            then(
               ToastAndroid.showWithGravity(
              "Add Successfull",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM),
              AsyncStorage.setItem("e",JSON.stringify(result.user.email)),
              setTimeout(() => {
               this.clearform();
                this.props.navigation.navigate("LoginSuccessLoading"); 
                       },1000)
            ).catch((error)=> {
              var errorMessage = error.message;
              var si  = errorMessage.indexOf("]")+1
              var  ei  = errorMessage.length -1
              const msg = errorMessage.substr(si,ei)
              alert(msg);
            })
                  
      
    } //end if
  
  })
  .catch((error)=> {
  const {cu} = this.state;
  if(cu != null)
  {
    cu.delete().then(()=> {
      console.log("beacuse no user add inn data base so user is delete try again")
      this.setState({cu:null})
      })
  }
  var errorMessage = error.message;
  var si  = errorMessage.indexOf("]")+1
  var  ei  = errorMessage.length -1
  const msg = errorMessage.substr(si,ei)
  alert(msg);
  });
  }
   

ghandleSubmit = async(e,p,id) => {
  const {guserInfo} = this.state;
 await auth().createUserWithEmailAndPassword(e,p)
  .then((result)=>{

    if(result != null)
  {
    this.setState({cu:result.user})
    console.log(result);
    result.user.updateProfile({
      displayName: guserInfo.name,
      photoURL:guserInfo.photo,
    })
  
    const address= {
      city:"",
      address:"",
      country:"Pakistan"
    }

    firestore().collection('users').doc(result.user.uid).set({
    email :result.user.email, //ye id or email update ni krte pehly k creat ho jati is lye aces kr skte sath hi
    uid :result.user.uid,
     username : guserInfo.name,
     gender : this.state.gndr,
    phone :this.state.phn,
     photo :guserInfo.photo || this.state.photo,
     type:this.state.type,
     status: this.state.status,
    lastonline: this.state.lastOnline,
    address,
    refdoctoremail:this.state.refdoctoremail,
    refdoctorid:id,
    doctorrequest:false,
    createdat: new Date(),
    token:null,
   }).then(
      ToastAndroid.showWithGravity(
     "Add Successfull",
     ToastAndroid.SHORT,
     ToastAndroid.BOTTOM),
     AsyncStorage.setItem("e",JSON.stringify(result.user.email)),
     setTimeout(() => {
      this.clearform();
       this.props.navigation.navigate("LoginSuccessLoading"); 
              },1000)
   ).catch((error)=> {
    var errorMessage = error.message;
    var si  = errorMessage.indexOf("]")+1
    var  ei  = errorMessage.length -1
    const msg = errorMessage.substr(si,ei)
    alert(msg);
  })
        
  } //end if

})  //sub error idr e aty hen agr ddatabase e rfrnc na bane to wo be ir ae ga error so dlt use
.catch((error) => {

  const {cu} = this.state;
  if(cu != null)
  {
    cu.delete().then(()=> {
      console.log("beacuse no user add in data base so user is delete try again")
      this.setState({cu:null})
      })
  }
  var errorMessage = error.message;
    var si  = errorMessage.indexOf("]")+1
    var  ei  = errorMessage.length -1
    const msg = errorMessage.substr(si,ei)
    alert(msg);
});


}

renderphnvrfyload()
{
  const {load,tick,mv} = this.state;
  return(
  <Dialog
    visible={mv}
    style={{padding:5,height:300}}
    onHardwareBackPress={() => true}
    dialogAnimation={new FadeAnimation({
      initialValue: 0, // optional
      animationDuration: 150, // optional
      useNativeDriver: true, // optional
    })}
  >
    <DialogContent>
    {this.renderMessage()}
    {load && (<Spinner color='blue' size="large" />) }
     {tick && (<Feather name="check" style={{marginTop:13}} size={30} color="green" />)}
    </DialogContent>
  </Dialog>

  )

}

renderMessage() {
  const { message } = this.state;

  if (!message.length) return null;

  return (
    <Text style={{ marginTop:7,fontSize:15}}>{message}</Text>
  );
}

rendergooglesigin()
{
  const {ishidep} = this.state;
  return(

    <Container style={{marginBottom:17}}>
<Content>
<Appbar.Header style={{backgroundColor:"#307ecc"}}>
      <Appbar.Content title="PATIENT"/>
      <Appbar.Action icon="delete" onPress={()=>{this.clearform()}} /> 
    </Appbar.Header>

    <Text style={{ padding: 5,fontSize:14, backgroundColor: '#000', color: '#fff' }}>Google sigin Successfull please enter some information</Text>

          <Form style={{padding:20,marginTop:17}}>
            <Item floatingLabel>
              <Label>Phone</Label>
            <Icon active name='person' style={{color:"green"}}/>
              <Input keyboardType="number-pad" value={this.state.phn} onChangeText={(txt)=>this.setState({phn:txt})} />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Icon active name='eye' onPress={()=>this.setState({ishidep:!ishidep})}  style={{color:"grey"}}/>
              <Input  value={this.state.psd}  secureTextEntry={ishidep} onChangeText={(txt)=>this.setState({psd:txt})} />
            </Item>
            <Item floatingLabel >
              <Label>Ref_Doctor_Email</Label>
            <Icon active name='mail' style={{color:"#307ecc"}}/>
              <Input   value={this.state.refdoctoremail} onChangeText={(txt)=>this.setState({refdoctoremail:txt})} />
            </Item>
            <Item> 
              <View style={{flexDirection:"row",marginTop:40,justifyContent:"space-between"}}>
             <Text style={{marginTop:12}}>Gender :        </Text>
            <TouchableOpacity style={{...styles.button ,backgroundColor:this.state.bc1 }} onPress={()=>{ this.setState({gndr:"Male"});setTimeout(() => {
      this.changeclrgndr() 
      }, 0)}  }>
            <View style={{flexDirection:"row",justifyContent:"space-around"}}>
            <Text style={{marginTop:10}}>Male</Text>
            <MaterialCommunityIcons name="human-male" size={50} color="#188DAD"/>
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.button2 ,backgroundColor:this.state.bc2 }} onPress={()=>{ this.setState({gndr:"FeMale"});setTimeout(() => {
      this.changeclrgndr() 
      }, 0)}  } >
            <View style={{flexDirection:"row",justifyContent:"space-around"}}>
            <Text style={{marginTop:10}}>FeMale</Text>
            <MaterialCommunityIcons name="human-female" size={50} color="#188DAD"/>
            </View>
            </TouchableOpacity>
            </View>
            </Item>

          </Form>

          <Button mode="contained" style={{backgroundColor:"#188DAD",borderRadius:65,width:130,marginLeft:130,marginTop:20}}  onPress={()=>{this.gclick(this.state.phn),Keyboard.dismiss()}}>
  <Text style={{color:"white",fontSize:17,fontWeight:"bold"}}>Submit</Text>
</Button>

   

          </Content>
 </Container>
  )
}

rendersigin()
{
  const {ishidep} = this.state;
  return(

<Container style={{marginBottom:17}}>
<Content>
<Appbar.Header style={{backgroundColor:"#307ecc"}}>
      <Appbar.BackAction onPress={()=>this.props.navigation.goBack()} />
      <Appbar.Content title="ASSISTANT"/>
       <Appbar.Action icon="delete" onPress={()=>{this.clearform()}} /> 
    </Appbar.Header>
<View style={{justifyContent:"center",alignItems:"center"}}>
        <Image  source={require("../../assets/asstntlogo.jpg")} style={{width:130, height:130,borderRadius:65}}   />
        </View>
          <Form style={{padding:20,marginTop:-30}}>
            <Item floatingLabel>
              <Label>Name</Label>
            <Icon active name='person' style={{color:"#307ecc"}}/>
              <Input value={this.state.name} onChangeText={(txt)=>this.setState({name:txt})} />
            </Item>
            <Item floatingLabel>
              <Label>Phone</Label>
            <Icon active name='call' style={{color:"green"}}/>
              <Input  value={this.state.phn} keyboardType="numeric" onChangeText={(txt)=>this.setState({phn:txt})} />
            </Item>
            <Item floatingLabel >
              <Label>Email</Label>
            <Icon active name='mail' style={{color:"#307ecc"}}/>
              <Input   value={this.state.eml} onChangeText={(txt)=>this.setState({eml:txt})} />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Icon active name='eye' onPress={()=>this.setState({ishidep:!ishidep})}  style={{color:"grey"}}/>
              <Input  value={this.state.psd}  secureTextEntry={ishidep} onChangeText={(txt)=>this.setState({psd:txt})} />
            </Item>
            <Item floatingLabel >
              <Label>Ref_Doctor_Email</Label>
            <Icon active name='mail' style={{color:"#307ecc"}}/>
              <Input   value={this.state.refdoctoremail} onChangeText={(txt)=>this.setState({refdoctoremail:txt})} />
            </Item>
             <Item> 
              <View style={{flexDirection:"row",marginTop:40,justifyContent:"space-between"}}>
             <Text style={{marginTop:12}}>Gender :        </Text>
            <TouchableOpacity style={{...styles.button ,backgroundColor:this.state.bc1 }} onPress={()=>{ this.setState({gndr:"Male"});setTimeout(() => {
      this.changeclrgndr() 
      }, 0)}  }>
            <View style={{flexDirection:"row",justifyContent:"space-around"}}>
            <Text style={{marginTop:10}}>Male</Text>
            <MaterialCommunityIcons name="human-male" size={50} color="#188DAD"/>
            </View>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.button2 ,backgroundColor:this.state.bc2 }} onPress={()=>{ this.setState({gndr:"FeMale"});setTimeout(() => {
      this.changeclrgndr() 
      }, 0)}  } >
            <View style={{flexDirection:"row",justifyContent:"space-around"}}>
            <Text style={{marginTop:10}}>FeMale</Text>
            <MaterialCommunityIcons name="human-female" size={50} color="#188DAD"/>
            </View>
            </TouchableOpacity>
            </View>
            </Item>
          </Form>

          <View style={{marginTop:22,justifyContent:"center",alignItems:"center"}}>
          <Button mode="contained" style={{backgroundColor:"#307ecc",borderRadius:70,width:120}}  onPress={()=>{this.Click(this.state.phn),Keyboard.dismiss()}}>
  <Text style={{color:"#white",fontSize:17,fontWeight:"bold"}}>Register</Text>
    </Button>
    
</View>

<TouchableOpacity style={{alignItems:"center",marginTop:19,marginLeft:17}} onPress={()=> this.props.navigation.navigate("LoginScreen")}>
<Text style={{color:"#307ecc",textDecorationLine:"underline"}}>Already have an account ?</Text>
</TouchableOpacity>

    <Text style={{color:"#307ecc",textAlign:"center",fontWeight:"bold"}}>{"\n"}OR{"\n"}</Text>

<View  style={{alignSelf:"center"}}>
<GoogleSigninButton    style={{ width: 192, height: 48 }}    size={GoogleSigninButton.Size.Wide}    color={GoogleSigninButton.Color.Dark}    onPress={()=>this.googlesignin()}    disabled={this.state.isSigninInProgress} />
</View>

   
             </Content>
    </Container>
     )
   }



   render() {
const {clk,gettinggLoginStatus} = this.state;
    return (
        <View style={{ flex: 1}}>

{!gettinggLoginStatus && this.rendersigin()}
{gettinggLoginStatus && this.rendergooglesigin()}
{clk && this.renderphnvrfyload()}
 </View>
    );
  }
}


const styles = StyleSheet.create({

  button: {
    elevation: 3, // Android
    width:100,
    height:50,
    borderRadius:17,
    paddingLeft:10,
   // backgroundColor: this.state.bc1
  },
  button2: {
    elevation: 3, // Android
    width:100,
    height:50,
    borderRadius:17,
    paddingLeft:10,
    marginLeft:15,
   // backgroundColor: this.state.bc2
  }
})