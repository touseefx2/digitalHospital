import React, { Component } from "react";
import {View,Image,Animated,ActivityIndicator,Text} from "react-native";
import auth from '@react-native-firebase/auth';


export default class SplashScreen extends Component {


  constructor(props)
  {   
    super(props);   
    this.state = {
      fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
    };
    }
  
    chkusr = async () =>
    {
        this.unsuscribeAuth =   auth().onAuthStateChanged( async (user)=> {
        if (user) { 
          console.log("splash se loginlodng ",user);
         this.props.navigation.navigate("LoginSuccessLoading")
        }
        else {
          console.log("splash se no user so nvgt login");
             this.props.navigation.navigate("LoginScreen") 
        }
     });
    }

   
     componentDidMount = async () =>
      {
    await  this.anmt_start();
     setTimeout(async () => {
    this.chkusr();
     },2800)   
            
  }

  componentWillUnmount()
  {
      if(this.unsuscribeAuth) {
        this.unsuscribeAuth();
        }
  }

  anmt_start = async  () => {
    Animated.timing(          // Animate over time
      this.state.fadeAnim,    // The animated value to drive
      {
        toValue: 1,           // Animate to opacity: 1 (opaque)
        duration: 2500,
        useNativeDriver:true,      
      }
    ).start();                // Starts the animation
  };


  render() {
    let { fadeAnim } = this.state;
    return (
      <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"white"}}>

    
    <Text style={{color:"#307ecc",fontSize:27,fontWeight:"bold",alignSelf:"center",marginBottom:40}}>DIGITAL HOSPITAL</Text>
        <Animated.View useNativeDriver={false} style={{ opacity: fadeAnim }} >
          <Image source={require("../assets/dl.jpg")} style={{width:170,height:170,borderRadius:85}} />
        </Animated.View>
        <ActivityIndicator  style={{marginTop:40}} size="large" color="#307ecc" />

        </View>
    );
  }
}

