import React  from 'react';
import {View,Text,Dimensions} from "react-native";
import { Paragraph,Avatar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
import { TouchableOpacity } from 'react-native-gesture-handler';
//nvgtn clas cmpnnt me hoti ha srf na k fnctn cmpnnt 


export function RenderOnline(props)
{
  if(props.s == "online") 
  {
    return(
      <View  style={{marginLeft:Dimensions.get('window').width - 50}}>
    <MaterialCommunityIcons name="checkbox-blank-circle" size={11} color="#1cd949"/>
      </View>
  
    )
  }
  else
  {
     const date = props.lastonline || ""
    if(date!="")  //fst time ti last onln nul hta na  bad me update 
    {
      const ddate = moment(new Date(props.lastonline.toDate())).format("LLL") ;
    return(
      <View  style={{marginLeft:"28%",flexDirection:"row",justifyContent:"space-between"}}>
        <Text style={{fontSize:12,color:"#7a7a7a"}}>Last Active</Text>
        <Text style={{fontSize:12,color:"#7a7a7a"}}>{ddate}</Text>
      </View> 
    )
  }else{
    return null;
  }

  }
}

 export default function  ChatCards(props)  {
   const typ=props.type;
   let type = "" ;
   if(typ == "Medical"){type="Md. "}
   else if(typ == "patient"){type="Pt. "}
   else  if(typ == "doctor"){type="Dr. "}
   else if(typ == "assistant"){type="As. "}

  return(
  <TouchableOpacity  onPress={()=>{props.object.navigation.navigate("StoChatScreen",{roomid:props.roomid,receiverid:props.receiverid,name:props.name,photo:props.photo,senderid:props.senderid})}}  style={{padding:5,backgroundColor:"white",margin:15,marginBottom:-7}}>
 
 <RenderOnline s={props.status} lastonline={props.lastonline}/>
 <View style={{flexDirection:"row"}}>
 <Avatar.Image size={75} source={{uri: props.photo }} />
 <View>
 {props.name.length > 22 ?
         (
           <Text style={{fontSize:15,textTransform:"capitalize",fontWeight:"700",marginLeft:15,marginTop:10}}>
             {type+`${props.name.substring(0, 25)}..`}
             </Text>
         ) :
         <Text style={{fontSize:15,textTransform:"capitalize",fontWeight:"700",marginLeft:15,marginTop:10}}>{type+props.name}</Text>
       }
 
 <View style={{marginLeft:17,marginTop:17}}>
 {props.lastMessage.length > 32 ?
         (
           <Paragraph style={{fontWeight:props.read ? "0" :"bold",color:props.read ? "#7a7a7a" :"black",fontSize:props.read ? 15 :16}}>
             {`${props.lastMessage.substring(0, 32)}....`}
             </Paragraph>
         ) :
         <Paragraph style={{fontWeight:props.read ? "0" : "bold",color:props.read ? "#7a7a7a" :"black",fontSize:props.read ? 15 :16}}>{props.lastMessage}</Paragraph>
       }
 </View>
 
 </View>
 </View>
 <View  style={{backgroundColor:"silver",height:1,marginTop:20,marginLeft:"29%"}}/>
         </TouchableOpacity >
 )

}

  

