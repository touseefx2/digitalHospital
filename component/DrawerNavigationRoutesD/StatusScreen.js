import React  from 'react';
import { View, StyleSheet} from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Text} from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Item, Input, Label } from 'native-base';


 class StatusScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state={
   tr:"",
   tb:"",
   abt:"",
   acpt:false,
    }
  }

  componentDidMount()
  {
    const id = auth().currentUser.uid;
    const dbref = firestore().collection("ai").doc(id);
    this.unsubscribe = dbref.onSnapshot((d)=>{
     if(d.exists)
     {
      this.setState({tr:d.data().totalRoom,tb:d.data().totalbed,abt:d.data().about,acpt:true})
     }
    })
  }

  componentWillUnmount()
  {
    if(this.unsubscribe) {
      this.unsubscribe();
      }
  }

  renderAssistntacpt()
  {
    const {tr,tb,abt}  = this.state;
    return(
      <View style={{margin:30,padding:20,marginTop:"35%"}}>
<Item style={{marginTop:20}} floatingLabel>
 <Label>Total Room</Label>
 <Input keyboardType="numeric" value={tr}  editable={false} />
</Item>
<Item style={{marginTop:20}} floatingLabel>
 <Label>Total Beds</Label>
 <Input keyboardType="numeric"  value={tb}  editable={false} />
</Item>
<Item style={{marginTop:20}} floatingLabel>
 <Label>About Room and Bed Status</Label>
 <Input  value={abt} editable={false}
 multiline={true}
 numberOfLines={0}
 scrollEnabled={true}
 onContentSizeChange={(e) => {
  const numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
 }}  />
</Item>
</View>
    )
  }

 render()
 {
   const {acpt} = this.state;
   console.log(acpt)
 return(
<View style={styles.container}>
      
      <View style={{position:"absolute",right:0,marginTop:10}}>
          <TouchableOpacity onPress={()=>{this.props.navigation.navigate("AssistantList")}}>
            <Text style={{fontSize:18,textDecorationLine:"underline"}}> Assistant's List </Text>
          </TouchableOpacity>
          </View>
{acpt && this.renderAssistntacpt()}

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


 export default StatusScreen; 
