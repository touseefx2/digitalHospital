import React  from 'react';
import { View, StyleSheet,ScrollView} from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Card,Title, Paragraph,Button,Avatar,Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';

 class AssistantList extends React.Component{

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
          if(e.data().doctorrequest == true)
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


 render()
 {
  if(this.state.rqst != null)
  {
    this.item = this.state.rqst.map( (d) =>{
    return(
      <View>
      <Card style={{elevation:2,borderRadius:10,margin:10,padding:5,borderWidth:0.3,borderColor:"blue"}}>

      <Card.Title title={d.username} subtitle={d.type}  />
    <Card.Content>
    <Card.Cover style={{ 
     width: 100,
    height: 100,
    borderRadius: 50,
}} source={{ uri: d.photo }} />
      <Paragraph style={{marginTop:20}}>{d.phone}</Paragraph>
      <Paragraph>{d.email}</Paragraph>
      <Paragraph>{d.address.country}</Paragraph>
      <Paragraph>{d.address.city}</Paragraph>
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
    flex:1,backgroundColor:"silver"
  },

});


 export default AssistantList; 
