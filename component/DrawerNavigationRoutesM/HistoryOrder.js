import React  from 'react';
import {View,ScrollView,Image,TouchableOpacity,Dimensions,TextInput,AppState} from "react-native";
import { Container,Content,Card, CardItem, Left,Right,Text,ListItem, Radio,Label} from 'native-base'
import {Button} from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Dialog, { DialogContent,FadeAnimation,DialogFooter,DialogButton} from 'react-native-popup-dialog';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Spinner } from 'native-base';
import OrderCard from "./OrderCard"
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-picker';

export default class  MyOrders extends React.Component  {

  constructor(props) {
    super(props);
    this.state = {
      order:[],
      load:true,
      empty:false,
    }
  }


componentDidMount(){
  this.unsubscribe =firestore().collection("orders").orderBy("createdat", "desc").onSnapshot((doc)=>{
    if(doc.size>0)
  {
    let da  =  [];
    doc.forEach(dat => {
      const d  = dat.data();     
      if(d.mid==auth().currentUser.uid && d.orderstatus != "Pending"){
        const obj  ={d,id:dat.id}
        da.push(obj)
      }
    });
    if(da.length>0){this.setState({empty:false,order:da,load:false})}else{this.setState({order:da,empty:true,load:false})}
  }else{
    this.setState({order:[],empty:true,load:false})
  }
  })
}


componentWillUnmount()
{
  if(this.unsubscribe) {
    this.unsubscribe();
    }
  }
 
 
  rendercheckappnmnt()
  {
    const {empty} = this.state;
    return( 
        <View>
        {empty 
          ? ( <Text style={{fontSize:30,color:"silver",marginTop:"50%",textAlign:"center"}}>EMPTY</Text>) 
          :  null}
            {/* <Searchbar placeholder="Search  by doctor name"   onChangeText={t=>this.setState({search:t})} value={this.state.search} placeholderTextColor="silver" style={{elevation:4,marginTop:1,height:40}}   />  } */}
        </View>
    )
  }
  



render(){
  const {load} = this.state;
  const {order}= this.state;
  if(order.length>0)
  {
    this.item = order.map( (d) =>{
    return  <OrderCard  navigate={this.props.navigation.navigate}  d={d} id={d.id} />
    })
  }else{  this.item  =  null}

  return( 
  <Container>   
{load ? ( <Spinner style={{marginTop:"50%",alignSelf:"center"}} size="large" color="#307ecc"/>) : this.rendercheckappnmnt()}
  <Content  style={{marginBottom:30}}>
          <ScrollView>     
          {this.item}
          </ScrollView>
  </Content>

  </Container>
  
)
     }
  };
  