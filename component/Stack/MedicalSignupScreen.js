import React, { Component } from "react";
import {  View,Image,ToastAndroid,TouchableOpacity,StyleSheet,ActivityIndicator, Keyboard,Modal} from "react-native";
import { Item, Input, Label,Icon,Form,Content,Container,Text,Spinner} from 'native-base';
import {Button,Avatar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {Appbar} from "react-native-paper";
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import Dialog, { DialogContent,FadeAnimation} from 'react-native-popup-dialog';
import firestore from '@react-native-firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';



export default class MedicalSignupScreen extends Component {

  inputarr=[];
  constructor(props)
{
  super(props);
  this.state={
  type:"Medical", 
  photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQmwhpgFNYWplnRky7pig1D8zshLmEjRIIzHg&usqp=CAU",
  name:"",
  psd:"",
  eml:"",
  ishidep:true,
  cnic:"",
  phn:"+92",
  ptclphn:"",
  srn:"",
  cityItem:[],
  city:"",
  address:"",
  status:"Offline",
  lastOnline:"",
  cu:null,

  fsrn:['11','12','13',"14","15","16","17","18"],//dummmy store reg num

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
this.clctspcltyitem()
this.getstoreinput();
}

componentWillUnmount()
{
  if(this.subscriby) {
    this.subscriby();
    } 
  }

  clctspcltyitem()
{
     this.subscriby  = firestore().collection("dropdownitems").onSnapshot((doc)=>{
      if(doc.size>0)
      {
        let  ctyi = [];
        doc.forEach(data=>{
        const cti  = data.data().city;
         ctyi=cti ;
        });
  
  
        this.setState({ cityItem:ctyi})
       }else
      {
        this.setState({ cityItem:[]})
      }
     })

}

validate= ()=>
{
 if(this.state.name == "" || this.state.psd== "" || this.state.eml == "" || this.state.phn == "" || this.state.srn == ""  || this.state.cnic == "" || this.state.city == "" || this.state.address == ""  )
   return false;
 else
   return true;
}

 emailvalidate= ()=>
 {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var email = this.state.eml;
  if (reg.test(email) === false) {
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
    srn:"",
    cnic:"",
    ptclphn:"",
    address:""
   })
 }

 storeinput   = async () => {
  try {
    this.inputarr.push({n:this.state.name,pn:this.state.phn,ptclpn:this.state.ptclphn,e:this.state.eml,srn:this.state.srn,cnic:this.state.cnic,adrs:this.state.address,city:this.state.city});
    await AsyncStorage.setItem('medicalinputlist',JSON.stringify(this.inputarr));
    console.log("input is store");
 } catch (e) {
   console.log(e);
 }
 }

 getstoreinput   = async () => {
  try {
    var value =JSON.parse(await AsyncStorage.getItem('medicalinputlist'))
    if(value != null)
    {
      console.log(value);
     //ye sb  o index me ha is lye  mean array k andr ik  e objct ha
      this.setState({
  name:value[0].n ,
  eml:value[0].e,
  phn:value[0].pn,
 srn:value[0].srn,
cnic:value[0].cnic,
 ptclphn:value[0].ptclpn,
 address:value[0].adrs,
 city:value[0].city,
      })
    }
    else { 
      console.log("value is empty");
    }
 }catch(e) { console.log(e);}

}

cnicvalidate= ()=>
{
 let reg = (/\d{5}-\d{7}-\d/);
 var cnic = this.state.cnic; 
 if (reg.test(cnic) === false) {
   alert("cnic pattern in invalid please correct pattern  (length must be equal to 12)\n Example : 1234-234567-1 ")
   return false;
 }
 else {
   console.log("cnic is Correct");
   return true;
 }
}


Click(p)
{
var v = this.validate();
if(v)
{
var ev = this.emailvalidate();
var pv= this.phonevalidate();
var cv= this.cnicvalidate();

if(ev && cv && pv)
{
  this.storeinput();
  this.inputarr=[];



   if(this.state.psd.length < 6 )
{
  alert("passwor length must be greater or equal to 6");
}
else//pswd chkng else
{
  var c = false;
  this.state.fsrn.map((d) =>
    {
      if( d == this.state.srn )
       c= true
    } );


  if(c)
  {

    var cd = false;
    firestore().collection("users").get().then((docs)=>{
    if (docs.size>0)
    {
      docs.forEach(d => {
        const a = d.data();
        if(a.type =="Medical")
        {
          console.log(a)
          if(a.store_reg_num == this.state.srn ){cd = true}
        } 
      });

    }

      if(!cd)
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
           this.handleSubmit(this.state.eml,this.state.psd);
          this.setState({mv:false})
          },1500) ;
          break;
       }
      });
      
      
      }else
      {
        alert("This store reg  num "+this.state.srn+" is already register in this app , pleasr enter correct reg num")
      }

  
    })


  }else{
    alert("Sorry Your Store Reg num is not Register in pmdc list !\n or Please Enter Correct medical store reg num")
  }


}

}//emil vldte chck

}//form fill chk
else
{
alert("Fill Empty Eields");
}

}

handleSubmit = async(e,p) => {
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
        city:this.state.city,
        address:this.state.address,
        country:"Pakistan"
      }
  //To use a custom ID you need to use .set, rather than .add
        
             firestore().collection('users').doc(result.user.uid).set({
              email : result.user.email, //ye id or email update ni krte pehly k creat ho jati is lye aces kr skte sath hi
              uid :result.user.uid,
              username :this.state.name,
             store_reg_num : this.state.srn,
              phone: this.state.phn,
              ptcl_phone:this.state.ptclphn,
              photo : this.state.photo,
              delivery:false,
              cnic:this.state.cnic,
              type: this.state.type,
              status: this.state.status,
              lastonline: this.state.lastOnline,
              payment:"Cash And Delivery",
              address,
              createdat: new Date(),
              token:null,
             }).  then(
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



rendersigin()
{
  const {cityItem,ishidep} = this.state;

  this.CityItems=cityItem.map(element=>{
    return {label: element, value: element};
  });
  
  return(

<Container style={{marginBottom:17}}>
<Content>
<Appbar.Header style={{backgroundColor:"#307ecc"}}>
      <Appbar.BackAction onPress={()=>this.props.navigation.goBack()} />
      <Appbar.Content title="MEDICAL"/>
       <Appbar.Action icon="delete" onPress={()=>{this.clearform()}} /> 
    </Appbar.Header>
<View style={{justifyContent:"center",alignItems:"center"}}>
        <Image source={require("../../assets/mdcllogo.jpg")} style={{width:120, height:120,borderRadius:50}}   />
        </View>
          <Form style={{padding:20,marginTop:-20}}>
            <Item floatingLabel>
              <Label>Store Name</Label>
            <Icon active name='person' style={{color:"#307ecc"}}/>
              <Input value={this.state.name} onChangeText={(txt)=>this.setState({name:txt})} />
            </Item>
            <Item floatingLabel >
              <Label>Store_Rigestration_num</Label>
              <Input keyboardType="number-pad"  value={this.state.srn} onChangeText={(txt)=>this.setState({srn:txt})} />
            </Item>
            <View style={{padding:15,marginTop:20}} >
<DropDownPicker
     items={this.CityItems} 
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
            <Item floatingLabel>
              <Label>Phone</Label>
            <Icon active name='call' style={{color:"green"}}/>
              <Input  value={this.state.phn} keyboardType="numeric" onChangeText={(txt)=>this.setState({phn:txt})} />
            </Item>
            <Item floatingLabel>
              <Label>Store_Ptcl_Phone (optional)</Label>
            <Icon active name='call' style={{color:"green"}}/>
              <Input  value={this.state.ptclphn} keyboardType="numeric" onChangeText={(txt)=>this.setState({ptclphn:txt})} />
            </Item>

              <Item floatingLabel>
              <Label>Address</Label>
              <Input value={this.state.address} onChangeText={(txt)=>this.setState({address:txt})}
              multiline={true}
              numberOfLines={0}
              scrollEnabled={true}
              onContentSizeChange={(e) => {
               const numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
              }} />
            </Item>
            <Item floatingLabel>
              <Label>Cnic</Label>
            <Icon active name='person' style={{color:"#307ecc"}}/>
              <Input value={this.state.cnic} onChangeText={(txt)=>this.setState({cnic:txt})} />
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
          
          </Form>

          <View style={{marginTop:22,justifyContent:"center",alignItems:"center"}}>
          <Button mode="contained" style={{backgroundColor:"#188DAD",borderRadius:65,width:130}}  onPress={()=>{this.Click(this.state.phn),Keyboard.dismiss()}}>
  <Text style={{color:"#white",fontSize:17,fontWeight:"bold"}}>Register</Text>
</Button>
</View>

<TouchableOpacity style={{alignItems:"center",marginTop:19,marginLeft:17}} onPress={()=> this.props.navigation.navigate("LoginScreen")}>
<Text style={{color:"green"}}>Already have an account ?</Text>
</TouchableOpacity>


  
             </Content>
    </Container>
     )
   }



   render() {
const {clk} = this.state;
    return (
        <View style={{ flex: 1}}>

{this.rendersigin()}
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