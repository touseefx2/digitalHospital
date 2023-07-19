import React, { Component } from 'react';
import { StyleSheet,Text,View,Image,TouchableOpacity} from 'react-native';
import { Item, Input,Container,Content, Label,Form } from 'native-base';
import {connect} from "react-redux"
import firestore from '@react-native-firebase/firestore'

 class ViewProfile extends Component {

  static navigationOptions  = ({ navigation }) => {
    return {
      title:"Dr. Profile",
            headerStyle: {
              backgroundColor: "#307ecc",
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              color:"white",
              textTransform:"capitalize"
            }
          }
    };
  
    
  constructor(props)
  {
    super(props);
    this.state = {
     receiverid:props.navigation.getParam("receiverid"),
 }
}


  render() {
 const {receiverid} = this.state;
 this.doctorAccount = this.props.myuser.map((doctoraccount)=>{
  if(receiverid == doctoraccount.uid)
  {
   return(
   <View>

<View style={{flexDirection:"row",alignItems:"center",backgroundColor:"#307ecc"}} > 
<View style={{margin:5,padding:5}}>
<Image style={styles.avatar} source={{uri:doctoraccount.photo}}/>
</View>
<Text style={styles.name}>Dr. {(doctoraccount.username).substring(0,30)}</Text>
</View>

  <Form style={{margin:15,padding:15}}> 

  <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Doctor Name</Label>
              <Input value={doctoraccount.username} style={{textTransform: 'capitalize'}}
               multiline={true}
               numberOfLines={1}
               underlineColorAndroid='transparent' 
              editable={false} />
            </Item>

            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Phone</Label>
              <Input value={doctoraccount.phone} style={{textTransform: 'capitalize',}} editable={false} />
            </Item>


            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>E-mail</Label>
              <Input value={doctoraccount.email} style={{textTransform: 'capitalize',}} editable={false}
               multiline={true}
               numberOfLines={1}
               underlineColorAndroid='transparent'  />
            </Item>

            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Gender</Label>
              <Input value={doctoraccount.gender} style={{textTransform: 'capitalize',}} editable={false} />
            </Item>



            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Speciality</Label>
              <Input value={doctoraccount.speciality} style={{textTransform: 'capitalize',}} editable={false} />
            </Item>

            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Country</Label>
              <Input value={doctoraccount.address.country} style={{textTransform: 'capitalize',}} editable={false} />
            </Item>

            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>City</Label>
              <Input value={doctoraccount.address.city} style={{textTransform: 'capitalize',}} editable={false} />
            </Item>


            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Address</Label>
              <Input  style={{textTransform: 'capitalize',}}
                                multiline={true}
                                numberOfLines={0}
                                scrollEnabled={true}
                                onContentSizeChange={(e) => {
                                const  numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
                                 }}
                                 editable={false} value={doctoraccount.address.address} />
            </Item>


            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>About</Label>
              <Input style={{textTransform: 'capitalize',}}
                                multiline={true}
                                numberOfLines={0}
                                scrollEnabled={true}
                                onContentSizeChange={(e) => {
                                const  numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
                                 }}
                                 editable={false} value={doctoraccount.about} />
             
            </Item>
  
  </Form>

  </View>
   )
                                } //endif
}) //endmap

return(
<Container >
  <Content>
{this.doctorAccount}
  </Content>
    </Container>
)}

 }
  

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor:"white",
  },
  name:{
    color: "white",
    fontWeight:"bold",
    fontSize:22,
    textAlign:"center",
    textTransform: 'capitalize',
    flexWrap:"wrap",
    flexShrink:1,
    marginRight:10,
    marginLeft:7
  },
inputitem:{
  fontSize:16,
  color:"black"
},
  Item:{
marginTop:10,
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
 myuser:state.Alldoctoruser,
        }
}

export default connect(mapStateToProps)(ViewProfile)