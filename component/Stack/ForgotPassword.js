import React  from 'react';
import {Button, Appbar} from 'react-native-paper';
import { View,ActivityIndicator, Keyboard} from "react-native";
import {Item, Input, Label,Text} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';

// ye is lye bnae jb login scs ho jae to us k bad  user ka data agy recv kr k drwr nvgtn me bjh sken search screen 
//khd drwr k and thi is lye ni bjh skte thy

 export default class  ForgotPassword extends React.Component  {
  constructor(props)
  {
    super(props);
    
    this.state = {
        em:"",
        load:"F",
        errmsg:"",
        rl:"F"
    }
  }
 

  
 emailvalidate= ()=>
 {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var email = this.state.em;
  if (reg.test(email) === false) {
    return false;
  }
  else {
    return true;
  }
 }

chkacnt(e)
{
    auth().signInWithEmailAndPassword(e,"..")
    .catch((error)=>{
        var d =JSON.stringify(error.message);
        var s = JSON.parse(d);
        this.setState({errmsg:s}),
        console.log(s);
        //alert(s);
})

}

click(e)
  {
    var v = this.emailvalidate();

    if(!this.state.em == "" )
{
    if(v)
    {
            this.setState({load:"T",errmsg:"",rl:"F"})
            setTimeout(() => {
              this.setState({load:"F"}),
              this.chkacnt(e);
            },1200)   ;
            
     }    
    else{ alert("Email pattern in invalid please correct pattern \n Example : abc@c2.com ")}
}   
else
    {
      alert("Please enter email");
    } 

}

sendresetlink(e)
{
  auth().sendPasswordResetEmail(e)
 .then((user)=>{
  this.setState({rl:'T',load:"F"});
 }).catch((error)=>{
  this.setState({load:"F"});
  var errorMessage = error.message;
  var si  = errorMessage.indexOf("]")+1
  var  ei  = errorMessage.length -1
  const msg = errorMessage.substr(si,ei)
  alert(msg);
  });
}

resetpwd(e)
{
this.setState({load:"T"});
setTimeout(() => {
  this.sendresetlink(e);
  },400)   ;
}




render(){

return(
      <View style={{flex:1}}>
        <Appbar.Header style={{backgroundColor:"#307ecc"}}>
      <Appbar.BackAction onPress={()=>this.props.navigation.goBack()} />
      <Appbar.Content title="Find Your Account" titleStyle={{fontSize:20}} />
    </Appbar.Header>


    <View style={{marginTop:50}}>

          <Item floatingLabel>
              <Label style={{fontSize:17}}>Email</Label>
              <Input value={this.state.em} style={{fontSize:17}} onChangeText={(txt)=>this.setState({em:txt})} />
            </Item>

            <Button  mode="contained" style={{backgroundColor:"#307ecc",marginTop:27,borderRadius:17,margin:5}}  onPress={()=>{this.click(this.state.em),Keyboard.dismiss()}}>
                <Text style={{color:"white",fontSize:17,fontWeight:"bold"}}>Find Your ACCOUNT</Text>
                </Button>
            
     </View>
        
                {this.state.load == "T" ? (<View style={{justifyContent:"center",alignItems:"center",marginTop:50}}>
                  <ActivityIndicator size="large" color="#307ecc"></ActivityIndicator>
        </View>) : null }



        {this.state.errmsg == "[auth/wrong-password] The password is invalid or the user does not have a password." ? (<View style={{justifyContent:"center",alignItems:"center",marginTop:130}}>
        <Text style={{fontSize:23,fontWeight:"bold"}}>Record Found </Text>
        <Text style={{color:"#307ecc",fontSize:15,fontWeight:"bold"}}>Reset via Email : {this.state.em}</Text>
          <Button  style={{backgroundColor:"#307ecc",borderRadius:17,marginTop:23}} onPress={()=>this.resetpwd(this.state.em)}  >
                <Text style={{color:"white",fontSize:14,fontWeight:"bold"}}>Reset Password</Text>
                </Button>
        </View>) : null }

        {this.state.errmsg == "[auth/user-not-found] There is no user record corresponding to this identifier. The user may have been deleted." ? 
        (<View style={{justifyContent:"center",alignItems:"center",marginTop:130}}>
        <Text style={{fontSize:23,fontWeight:"bold"}}>NO Record Found</Text>
        <Text style={{color:"#307ecc",fontSize:17,fontWeight:"bold"}}>Search again with correct email</Text>
        </View>)
        : null }

{this.state.errmsg == "[auth/too-many-requests] Too many unsuccessful login attempts. Please try again later." ? 
        (<View style={{justifyContent:"center",alignItems:"center",marginTop:130}}>
        <Text style={{color:"silver",fontSize:23,fontWeight:"bold"}}>Too many unsuccessful login attempts.</Text>
        <Text style={{color:"#256bdb",fontSize:17,fontWeight:"bold"}}>Please try again later.</Text>
        </View>)
        : null }

{this.state.errmsg == "[auth/network-request-failed] A network error (such as timeout, interrupted connection or unreachable host) has occurred." ? 
        (<View style={{justifyContent:"center",alignItems:"center",marginTop:130}}>
        <Text style={{color:"silver",fontSize:23,fontWeight:"bold"}}>A network error</Text>
        <Text style={{color:"#256bdb",fontSize:17,fontWeight:"bold"}}>(such as timeout,interrupted connection ,no internet connection)</Text>
        </View>)
        :  null
        }

        
{this.state.rl == "T" ? 
        (<View style={{justifyContent:"center",alignItems:"center",flexDirection:"row",marginTop:70}}>
        <Feather name="check" size={23} color="green" />
        <Text style={{color:"grey",fontSize:17,fontWeight:"bold"}}> Reset Link Send (please check your email)</Text>
        </View>)
        :  null
        }



      </View>
)

    }

     }

  

