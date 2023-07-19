import React, { Component } from 'react';
import { StyleSheet,Text,View,ToastAndroid} from 'react-native';
import { Item, Input, Icon ,Spinner,Container,Content,Label,Form } from 'native-base';
import auth from '@react-native-firebase/auth';
import { Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Dialog, { DialogContent,FadeAnimation} from 'react-native-popup-dialog';
import DropDownPicker from 'react-native-dropdown-picker';
import {connect} from "react-redux"

class EditProfileP extends Component {

  constructor(props)
  {
    super(props);
    this.state = {
    name:props.myuser.username,
    city:props.myuser.address.city ,
    address:props.myuser.address.address,

    cityItem:[],

     namesaveload:false,//render
     nsload:false, //for vsbl invsbl 
 }
}

componentDidMount()
{
  this.clctspcltyitem()
}

changename= async () =>
{
  const {name,city,address,ptcl} = this.state;
  this.setState({namesaveload:true,nsload:true})
  const update = {
    displayName:name,
  };
  await auth().currentUser.updateProfile(update).then(()=>
  {
      const dbref =   firestore().collection("users").doc(this.props.myuser.uid);
      dbref.update({
        username:name,
        address:{
          city:city,
          address:address,
          country:"Pakistan"
          }
      }).then(
        () => { 
          this.setState({nsload:false}),
          ToastAndroid.showWithGravity(
            "save  successfully ",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM);
        }
      )
    
}).catch((error)=>{
  this.setState({nsload:false}),
  ToastAndroid.showWithGravity(
  "save not successfully"+error,
  ToastAndroid.LONG,
  ToastAndroid.BOTTOM);
})

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


componentWillUnmount()
{
  if(this.subscriby) {
    this.subscriby();
    } 
  }


rendernamesaveload()
{
  return(
  <Dialog
    visible={this.state.nsload}
    style={{padding:10}}
    onHardwareBackPress={() => true}
    dialogAnimation={new FadeAnimation({
      initialValue: 0, 
      animationDuration: 150,
      useNativeDriver: true,
    })}
  >
    <DialogContent>
     <Spinner size="large" color="blue"/>
    </DialogContent>
  </Dialog>

  )
}

renderprofile()
{ 
  const {name,address,cityItem,ptcl} = this.state;
  this.CityItems=cityItem.map(element=>{
    return {label: element, value: element};
  });
return(
  <Form style={{margin:15,padding:15}}>

           
           <Item style={{borderColor:"black"}} floatingLabel>
              <Label>Name</Label>
              <Input  value={name}  onChangeText={(txt)=>this.setState({name:txt})} 
              multiline={true}
              numberOfLines={1}
              />
            </Item>

  
                   


<Item  style={{borderColor:"black"}}  floatingLabel>
                        <Label>Address</Label>
                        <Input  value={address}  onChangeText={(txt)=>this.setState({address:txt})}
                        multiline={true}
                       numberOfLines={1}/>
                      </Item>

 <View style={{marginTop:20,marginLeft:15}}  >
<DropDownPicker
   items={this.CityItems} 
    placeholder="City"
    placeholderStyle={{ textAlign: 'center',}}
  containerStyle={{width: 170, height:50,marginBottom:100}}
    style={{backgroundColor: '#fafafa',paddingVertical: 10,borderColor:"black"}}
    dropDownStyle={{backgroundColor: '#fafafa',borderColor:"black"}}
    onChangeItem={item => this.setState({
        city: item.value
    })}
/>    
</View>

</Form>


)
}


renderBottom()
{
  return(
       <Button mode="contained" style={{width:100,marginBottom:10,alignSelf:"center",backgroundColor:"#307ecc",borderWidth:1,borderRadius:20,elevation:5}} onPress={()=>{this.changename()}} >
          <Text style={{color:"white"}}>Save</Text>
        </Button> 
        
  )
}



  render() {
    const {namesaveload} = this.state;
    return (
      <Container >
      <Content>
         {this.renderprofile()}
         {namesaveload && this.rendernamesaveload() }
         </Content>
         {this.renderBottom()}
    </Container>

  
    );
  }

}

const styles = StyleSheet.create({
  header:{
   backgroundColor:"#307ecc",
    height:117,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 83,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:12
  },
  name:{
    color: "black",
    fontWeight:"bold",
    fontSize:19,
    textAlign:"center",
    marginTop:73,
  },
inputitem:{
  fontSize:15,
  color:"#292929"
},
  Item:{
marginTop:10,
borderColor:"#00BFFF",
borderWidth:1,
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
});
 
const  mapStateToProps = (state) => 
{
  return{
 myuser:state.user
        }
}


export default connect(mapStateToProps)(EditProfileP); 