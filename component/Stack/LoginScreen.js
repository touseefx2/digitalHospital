import React  from "react";
import {Button} from 'react-native-paper';
import { View,StatusBar,TouchableOpacity,Dimensions,Image,Alert} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, Item, Input ,Text} from 'native-base';
import auth from '@react-native-firebase/auth';
import Dialog, { DialogContent,DialogFooter,DialogButton,SlideAnimation,DialogTitle} from 'react-native-popup-dialog';
import NetInfo from "@react-native-community/netinfo";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class LoginScreen extends React.Component {
  
  constructor(props)
{
super(props);
global.a="";  //for store writen email localy
this.state=
{
ishidep: true,
em : "",
pwd : "",
isConnected:null,

//SIGNUP MODAL
clk:false,
load:false,
};
}

storeData = async () => {
  try {
     this.a= this.state.em.toString();
    await AsyncStorage.setItem("e",JSON.stringify(this.a),async ()=>{console.log("email is store :"+this.a)})
  } catch (e) {
    console.log(e);
  }
}

getData = async () => {
  try {
   var rt = JSON.parse(await AsyncStorage.getItem("e"))

    if(rt!="")
    {
       this.setState({em:rt}) 
    }
    else { 
      this.setState({em:""}) 
    }
  } catch(e) {
    console.log(e);
  }
}


validate= ()=>
{
 if(this.state.em == "" || this.state.pwd== "")
   return false;
 else
   return true;
}

clearform = () =>
{
  this.setState({
   pwd:"",
   em:""
  })
}

emailvalidate= ()=>
 {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var email = this.state.em;
  if (reg.test(email) === false) {
    alert("Email pattern in invalid please correct pattern \n Example : abc@c2.com ")
    return false;
  }
  else {
    console.log("Email is Correct");
    return true;
  }
 }

click(e,p)
{
  var v = this.validate();
if(v)
{
  var ev = this.emailvalidate();

  if(ev)
  {

    if(this.state.isConnected)
    {
      
      auth().signInWithEmailAndPassword(e,p)
      .then(user => { 
        this.storeData();
          console.log(user);
          if(user != null)
          {
            this.props.navigation.navigate("LoginSuccessLoading");
            this.clearform();
          }
      })
      .catch((error)=>{
        var errorMessage = error.message;
        var si  = errorMessage.indexOf("]")+1
        var  ei  = errorMessage.length -1
        const msg = errorMessage.substr(si,ei)
        alert(msg);
      });
      
    }
    else if(!this.state.isConnected){
     alert("No Internet Connection")
    }
  
  }


    
}
else
{
  alert("Fill empty fields");
} 

}

handleConnectivityChange = state => {
  if (state.isConnected) {
    this.setState({isConnected:true})
  } else {
    this.setState({isConnected:false})
  }
};


componentDidMount()
{
  this.getData();
  this.unsubscribe = NetInfo.addEventListener(state => {
    this.setState({isConnected:state.isConnected})
   });

  }


componentWillUnmount() {
 
  if (this.unsubscribe != null) 
  {this.unsubscribe()}
 
  }


renderlogin()
{
  const {ishidep} = this.state;
  return(
    <Container  >
   
        <Content>

 <Text style={{  fontSize: 47, fontWeight: "bold", color: "#307ecc", marginTop: 20, alignSelf: "stretch", textAlign:"center"}}>D Hospital</Text>
 <View  style={{margin:27,padding:10,marginTop:70}}>
            <Item style={{borderColor:"black",padding:4}} rounded>
            <Input placeholder='E-mail' value={this.state.em} onChangeText={(txt)=>this.setState({em:txt})} />
            </Item>

            <Item style={{marginTop:30,borderWidth:4,borderColor:"black",padding:4}} rounded>
            <Input placeholder='Password'  value={this.state.pwd}  secureTextEntry={ishidep} defaultValue={this.state.pwd} onChangeText={(txt)=>this.setState({pwd:txt})} />
            {ishidep ? (
           <MaterialCommunityIcons name="eye-off-outline" onPress={()=>this.setState({ishidep:false})} color="grey" size={24}/>
            ) :(
              <MaterialCommunityIcons name="eye-outline" onPress={()=>this.setState({ishidep:true})} color="grey" size={24}/>
            )}
            </Item>
  </View>           

<View style={{marginTop:30,alignItems:"center"}}>

<Button style={{borderColor:"silver",backgroundColor:"#307ecc",borderWidth:0.7,borderRadius:20,width:250}}  onPress={()=>this.click(this.state.em,this.state.pwd)}>
  <Text style={{fontSize:17,color:"white",fontWeight:"bold"}}>Log in</Text>
</Button>


<TouchableOpacity style={{alignItems:"center",marginTop:37,alignSelf:"center"}}  onPress={()=>this.props.navigation.navigate("ForgotPassword")}>
<Text style={{fontSize:16,textDecorationLine:"underline"}}>Forgotten  Paswword?</Text>
</TouchableOpacity>

<Text style={{color:"#307ecc",textAlign:"center",fontWeight:"bold"}}>{"\n"}OR{"\n"}</Text>

<Button style={{borderColor:"silver",backgroundColor:"#307ecc",borderWidth:0.7,borderRadius:20,width:250}}  onPress={()=>this.setState({clk:true,load:true})}>
  <Text style={{fontSize:17,color:"white",fontWeight:"bold"}}>Sign up</Text>
</Button>

</View>

</Content>
      </Container>
  )
}

renderSignupModal()
{
  return(
  <Dialog
  footer={
    <DialogFooter>
      <DialogButton
        text="Cancel"
        textStyle={{color:"#307ecc"}}
        onPress={() => {
          this.setState({load: false })
        }}
      />
    </DialogFooter>
  }
  dialogAnimation={new SlideAnimation({
    slideFrom: 'bottom',
    initialValue: 600, // optional
    useNativeDriver: true, // optional
  })}
   dialogTitle={<DialogTitle title="Sign Up"/>}
    visible={this.state.load}
    style={{padding:10}}
    onHardwareBackPress={() => true}
  >
    <DialogContent style={{width:Dimensions.get('window').width - 30,borderRadius:10}}>

 <View style={{flexDirection:"row",justifyContent:"space-between"}}>

 <TouchableOpacity 
 onPress={()=>{
  this.setState({load:false})
  setTimeout( () => {
   this.props.navigation.navigate("DoctorSignupScreen")
  }, 1000)}}
 style={{elevation:3,width:130,height:130,padding:0,margin:5,borderRadius:10,justifyContent:"center",alignItems:"center"}}>
 <Image   source={require("../../assets/dl.jpg")} style={{width:80, height:80}}   /> 
 <Text style={{fontWeight:"bold"}}>Docotor</Text>
 </TouchableOpacity>

 <TouchableOpacity 
 onPress={()=>{
  this.setState({load:false})
  setTimeout( () => {
    this.props.navigation.navigate("PatientSignupScreen")
  }, 1000)}}
 style={{elevation:3,width:130,height:130,padding:5,margin:5,borderRadius:10,justifyContent:"center",alignItems:"center"}}>
 <Image  source={require("../../assets/ptntlogo.jpg")} style={{width:80, height:80}}   /> 
 <Text style={{fontWeight:"bold"}}>Patient</Text>
 </TouchableOpacity>
 
 </View>

 <View style={{flexDirection:"row",justifyContent:"space-between"}}>

<TouchableOpacity   
onPress={()=>{
this.setState({load:false})
setTimeout( () => {
  this.props.navigation.navigate("AssistantSignupScreen")
}, 1000)}}
style={{elevation:3,width:130,height:130,padding:5,margin:5,borderRadius:10,justifyContent:"center",alignItems:"center"}}>
<Image  source={require("../../assets/asstntlogo.jpg")} style={{width:80, height:80}}   /> 
<Text style={{fontWeight:"bold"}}>Assistant</Text>
</TouchableOpacity >

<TouchableOpacity  
onPress={()=>{
  this.setState({load:false})
  setTimeout( () => {
    this.props.navigation.navigate("MedicalSignupScreen")
  }, 1000)}}
style={{elevation:3,width:130,height:130,padding:5,margin:5,borderRadius:10,justifyContent:"center",alignItems:"center"}}>
<Image  source={require("../../assets/mdcllogo.jpg")} style={{width:80, height:80}}   /> 
<Text style={{fontWeight:"bold"}}>Medical Store</Text>
</TouchableOpacity >

</View>

    </DialogContent> 
  </Dialog>

  )

}

    render() {
      const  {clk} = this.state;
      return (
        <View style={{ flex: 1}}>
           <StatusBar hidden={true}/>  
          {this.renderlogin()}
          {clk && this.renderSignupModal()}

       </View>

       );
     }
  }
  

    