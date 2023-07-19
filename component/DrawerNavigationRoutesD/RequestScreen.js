import React  from 'react';
import { View, StyleSheet,ScrollView, ToastAndroid} from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Card,Title, Paragraph,Button,Avatar,Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

 class RequestScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state={
    rqst:null
    }
  }

  componentDidMount()
  {
    const id = auth().currentUser.uid;
    const dbref = firestore().collection("users").where(`refdoctorid` , '==' , `${id}`);
    this.unsubscribe = dbref.onSnapshot((d)=>{
      if(d.size>0)
      {
        const r = [];
        d.forEach(e => {
          if(e.data().doctorrequest == false)
          {
            r.push(e.data())
          }
        });
        this.setState({rqst:r})
      }
    })

  }

  componentWillUnmount()
  {
    if(this.unsubscribe) {
      this.unsubscribe();
      }
  }

  acpt(id)
  {
    firestore().collection("users").doc(id).update({
      doctorrequest:true
    }).then(
      ToastAndroid.showWithGravity(
        "Accept",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM)
    )
  }

  cancl(id)
  {
    firestore().collection("users").doc(id).update({
      doctorrequest:"cancle"
    }).then(
      ToastAndroid.showWithGravity(
        "Cancle",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM)
    )
  }

 render()
 {
  if(this.state.rqst != null)
  {
    this.item = this.state.rqst.map( (d) =>{
    
    return(

      <View>
      <Card style={{elevation:2,borderRadius:10,margin:10,padding:5,borderWidth:0.3,borderColor:"blue"}}>

  <View style={{flexDirection:"row",justifyContent:"space-between"}}> 
  <Avatar.Image size={70} source={{uri: d.photo }} />
    <Card.Content style={{flex:1,alignSelf:"center"}}>
    <Title style={{fontSize:16}}>{d.username}</Title>  
    </Card.Content>
    <Card.Content>
    <Button onPress={()=>{this.acpt(d.uid)}}  style={{backgroundColor:"#5ce655",borderColor:"green",borderWidth:1,borderStyle:"dotted",borderRadius:10,width:90}}>
  <Text style={{color:"black",fontSize:12,fontWeight:"bold"}}>Accept</Text>
</Button>
<Button  onPress={()=>{this.cancl(d.uid)}}  style={{backgroundColor:"#ff4747",borderColor:"green",borderWidth:1,borderStyle:"dotted",borderRadius:10,width:90,marginTop:10}}>
  <Text style={{color:"white",fontSize:12,fontWeight:"bold"}}>Cancle</Text>
</Button>
    </Card.Content>
</View>


<Card.Content>
<Text>{d.type}</Text>
</Card.Content>


     </Card>
     </View>
    )
    
    });
  }else{
    this.item = null;
  }

 return(
<View style={styles.container}>
        <ScrollView> 
          {this.item}
        </ScrollView>
</View>
 )

 }

 }

const styles= StyleSheet.create({

  container:
  {
    flex:1,backgroundColor:"#f0fbff"
  },

});


 export default RequestScreen; 
