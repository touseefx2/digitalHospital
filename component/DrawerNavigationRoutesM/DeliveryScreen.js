import React  from 'react';
import { View, StyleSheet,TouchableOpacity,Dimensions, ToastAndroid,Alert} from "react-native";
import {Card, CardItem, Left,Text,Label,Right, Item, Input, Form ,Container,Content,Body} from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Dialog, { DialogContent,SlideAnimation,DialogFooter,DialogButton,DialogTitle} from 'react-native-popup-dialog';

export default class DeliveryScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state={
    upload:false,
    uv:false,

    name:"",
    workingdays:"",
    fee:"",

    da:[]
    }
  }

  componentDidMount()
  {
    const db = firestore().collection("users").doc(auth().currentUser.uid)
    this.unsubscribe = db.collection("deliveryMethod").onSnapshot((doc)=>{
if(doc.size>0)
{
  db.update({
    delivery:true
  }).catch(e=>console.log(e))

  let a=[];
doc.forEach(da => {
  const d = da.data();
  let aid=da.id;
  const obj ={d,aid}
 a.push(obj)
});
this.setState({da:a})
}else{
  this.setState({da:[]})
db.update({
  delivery:false
}).catch(e=>console.log(e))
}
    })
  }

  componentWillUnmount()
  { 
     if(this.unsubscribe) {
    this.unsubscribe();
    }
  }

  save(n,w,f)
{
if(n != "" || w != ""  || f != "")
{
  firestore().collection("users").doc(auth().currentUser.uid).collection("deliveryMethod").add({
    name:n,
    workingdays:w,
    fee:f
  }).then(()=>{
    this.setState({uv:false})
    ToastAndroid.showWithGravity(
      "Save",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM)
  }).catch((e)=>console.log(e))

}else{alert("Please fill empty fields")}
}

delete(id)
{
  Alert.alert(
    'Alert',
    'Are you sure you want to delete ?',
    [
      {
        text: 'NO',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      },
      {
        text: 'Yes',
        onPress: ()  => {
  firestore().collection("users").doc(auth().currentUser.uid).collection("deliveryMethod").doc(id).delete()
  .then(()=>{
    this.setState({uv:false})
    ToastAndroid.showWithGravity(
      "Delete",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM)
  }).catch((e)=>console.log(e))
        }
      }
    ],
    { cancelable: false }
  );
  
}



  renderUpload()
  {
    const {name,workingdays,fee} = this.state;
    return(
    <Dialog
      visible={this.state.uv}
      footer={
        <DialogFooter>
          <DialogButton
            text="Cancel"
            onPress={() => {this.setState({name:"",workingdays:"",fee:"",uv:false})}}
          />
          <DialogButton
            text="Save"
            onPress={() => {this.save(name,workingdays,fee)}}
          />
        </DialogFooter>
      }
      onHardwareBackPress={() => true}
      dialogAnimation={new SlideAnimation({
        slideFrom: 'top',
        initialValue: 0, // optional
        useNativeDriver: true, // optional
      })}
       dialogTitle={<DialogTitle title="Add Delivery" />}
    >
      <DialogContent style={{width:Dimensions.get('window').width - 70,padding:5}}>

<Form style={{padding:10,marginTop:5}}>
        
<Item stackedLabel style={{borderColor:"black"}}>
              <Label style={{fontWeight:"700"}}>Branch name</Label>
              <Input onChangeText={(t)=>{this.setState({name:t})}}
              style={{fontSize:15}}
              placeholder="e.g  TCS Express Delivery"
              placeholderTextColor="silver"  
              />
            </Item>

            <Item stackedLabel style={{borderColor:"black"}}>
              <Label  style={{fontWeight:"700"}}>Working days</Label>
              <Input  onChangeText={(t)=>{this.setState({workingdays:t})}} 
               style={{fontSize:15}}
               placeholder="e.g  1 - 3 or 24 hours" 
               placeholderTextColor="silver"
               />
            </Item>

            <Item stackedLabel style={{borderColor:"black"}}>
              <Label  style={{fontWeight:"700"}}>Delivery fee</Label>
              <Input keyboardType={"number-pad"} onChangeText={(t)=>{this.setState({fee:t})}}
               style={{fontSize:15}}
               placeholder="e.g  250"
               placeholderTextColor="silver"
               />
            </Item>

</Form>

      </DialogContent>
    </Dialog>
  
    )
  
  }
  

renderTopBar(){
  return(
<Card style={{marginTop:-10,elevation:7}}>
         <CardItem >
          <Body>
          <TouchableOpacity style={{marginTop:10,alignSelf:"center",flexDirection:"row"}} onPress={()=>{this.setState({upload:true,uv:true})}}>
   <Text style={{fontSize:18}}>Add Delivery Method</Text>
   <Ionicons  style={{marginLeft:10}}  size={30} color="#307ecc" name="md-add-circle-outline" />
      </TouchableOpacity>
            </Body>
          </CardItem>
</Card>
  )
}


 render()
 {
  const {da} = this.state;
  if(da.length > 0 )
  {
    this.item = da.map((d)=>{
       return( 
        <Card style={{marginTop:20,elevation:5,borderRadius:10}}>
 

        <CardItem style={{backgroundColor:"#d9d9d9"}}>
          <Left>
          <MaterialCommunityIcons size={20} color="#307ecc" name="circle-medium"  />
          <Text style={{fontSize:14,fontWeight:"bold",color:"#3b3b3b",textTransform:"capitalize"}}>{d.d.name}</Text>
          </Left>
          <Right>
            <TouchableOpacity>
              <MaterialCommunityIcons  onPress={() => {this.delete(d.aid)}}size={25} color="red" name="delete-sweep-outline"  />
            </TouchableOpacity>
          </Right>
        </CardItem>

        <CardItem>
       <Text style={{fontSize:14}}>{d.d.workingdays} working days</Text>     
        </CardItem>

        <View style={{backgroundColor:"#cccccc",height:1}}  />
        
        <CardItem>
        <Text style={{fontSize:14,fontWeight:"bold",color:"#6e6e6e"}}>Delivery fee : RS {d.d.fee}</Text>
        </CardItem>

</Card>
          )  
    })
  }else{
  this.item  =  <Text style={{fontSize:30,color:"silver",marginTop:"40%",textAlign:"center"}}>EMPTY</Text>
  }
 return(
<Container >
  {this.renderTopBar()}   
<Content >
{this.state.upload && this.renderUpload()}
      <ScrollView >
        <View style={{marginTop:20}}>
        {this.item}
        </View> 
     </ScrollView>
</Content>
     </Container>
 )

 }

 }

const styles= StyleSheet.create({

  container:
  {
    flex:1
  },

});

