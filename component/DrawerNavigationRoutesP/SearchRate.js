import React  from 'react';
import { StyleSheet,View,TextInput,Dimensions,Text,TouchableOpacity} from "react-native";
import {AirbnbRating } from 'react-native-ratings';
import firestore from '@react-native-firebase/firestore';
import Dialog, { DialogContent,SlideAnimation,FadeAnimation,DialogTitle} from 'react-native-popup-dialog';
import {connect} from "react-redux"
import { ScrollView } from 'react-native-gesture-handler';
import {Spinner } from 'native-base';


  class Rate extends React.Component  {
   
  static navigationOptions  = ({ navigation }) => {
    return { 
      title:"Rate",
            headerStyle: {
              backgroundColor: "#307ecc",
            },
            headerTintColor: '#fff',
          }
    };
  
  constructor(props) {
    super(props);
    this.state={
      rating: 3,
      comment: "",

      rv: false,
      rvld:false,

      load:false,
      loadv:false,
    }
  }

  saveRateToDb  = async ()=>
  {
    this.setState({load:true,loadv:true})
    const username = this.props.myuser.username;
    const userphoto =  this.props.myuser.photo;
    const userid  =  this.props.myuser.uid;
    const rating  =  this.state.rating;
    const comment =  this.state.comment;
    const rate={username,userphoto,userid,rating,comment,createdAt:Date.now()}
    const receiverid = this.props.navigation.getParam("receiverid")
    await firestore().collection("users").doc(receiverid).collection("rating").doc(userid).set(rate).then(()=>{
      this.setState({loadv:false,rv:true,rvld:true})
      setTimeout(() => {
        this.setState({rvld:false})
        this.props.navigation.goBack()
      }, 1500);
     
    }).catch(e=>alert(e));


  }

  renderRateView()
  {
    return(
    <Dialog
    dialogAnimation={new SlideAnimation({
      slideFrom: 'bottom',
      initialValue: 600, // optional
      useNativeDriver: true, // optional
    })}
      dialogTitle={<DialogTitle title="Post Sucessfully"/>}
      visible={this.state.rvld}
      style={{padding:10}}
      onHardwareBackPress={() => true}
    >
      <DialogContent style={{justifyContent:"center",borderRadius:10,marginTop:10}}>
      <AirbnbRating
   count={5}
   reviews={['Terrible', 'Bad', 'Okay', 'Good', 'Great']}
   defaultRating={this.state.rating}
   size={30}
   selectedColor= "#307ecc"
   reviewColor= "#307ecc"
   reviewSize={25}
   isDisabled={true}
 />
      </DialogContent> 
    </Dialog>
  
    )
  
  }

  renderLoad()
  {
    return(
    <Dialog
    dialogAnimation={new FadeAnimation({
      initialValue: 0, // optional
    })}
      visible={this.state.loadv}
      onHardwareBackPress={() => true}
    >
      <DialogContent>
      <Spinner size="large" color="#307ecc"/>
      </DialogContent> 
    </Dialog>
  
    )
  
  }

render(){
  const {rv,load} = this.state;
return(
      <View style={styles.container}>  
      <ScrollView>
      <View style={{justifyContent:"center",alignItems:"center",marginTop:"25%",marginBottom:20}}>  
{rv && this.renderRateView()}
{load && this.renderLoad()}
<View  style={{padding:7,elevation:15,backgroundColor:"white"}}>
<AirbnbRating
   count={5}
   reviews={['Terrible', 'Bad', 'Okay', 'Good', 'Great']}
   defaultRating={this.state.rating}
   size={35}
   selectedColor= "#307ecc"
   reviewColor= "#307ecc"
   reviewSize={30}
   onFinishRating={(rating)=>this.setState({rating})}
 />
</View>

<TextInput   style={{ backgroundColor:"white",flexDirection: "row",width:Dimensions.get('window').width - 50,fontSize:17,marginTop:17,borderColor:"#307ecc",borderWidth:1,padding:10,alignItems:"center"}}  
    onChangeText={text => this.setState({comment :text })}
      placeholder={"Describe your experience (optional)"}
      multiline={true}
      numberOfLines={3}
      underlineColorAndroid='transparent'
/>

<TouchableOpacity style={{marginTop:40,backgroundColor:"#307ecc",padding:7,width:Dimensions.get('window').width - 280,elevation:5,alignItems:"center"}}  onPress={()=>this.saveRateToDb()} >
  <Text style={{fontSize:18,color:"white",fontWeight:"700"}}>Post</Text>
</TouchableOpacity>
</View>
</ScrollView>
      </View>
)
     }
  };

const styles = StyleSheet.create({
  container:
  {
    flex:1,
  }
});
 
const  mapStateToProps = (state) => 
{
  return{
 myuser:state.user,
        }
}



export default connect(mapStateToProps)(Rate); 