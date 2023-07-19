import React from 'react';
import { View,Text} from "react-native";
import moment from "moment";
import {Rating } from 'react-native-ratings';
import { Avatar,Paragraph } from 'react-native-paper';

  
 export default function  RateScreenCardM(props)
 {
return(

  <View    style={{padding:5,backgroundColor:"white",margin:15,marginBottom:-7}}>
  
  <View style={{flexDirection:"row",alignItems:"center"}}>
  <Avatar.Image size={65} source={{uri: props.e.userphoto }} />
  <View  style={{flexShrink:1}}>
  {props.e.username.length > 45 ?
          (
            <Text style={{fontSize:16,textTransform:"capitalize",fontWeight:"700",marginLeft:15,marginTop:10}}>
              {`${props.e.username.substring(0, 45)}..`}
              </Text>
          ) :
          <Text style={{fontSize:16,textTransform:"capitalize",fontWeight:"700",marginLeft:15,marginTop:10}}>{props.e.username}</Text>
        }
  </View>
  </View>

<View >

<View style={{flexDirection:"row",alignItems:"center",marginTop:20}}>
<Rating
  type='custom' 
  ratingColor="#307ecc"
  ratingCount={5}
  startingValue={props.e.rating}
  readonly={true}
  imageSize={19}
/>
<Text style={{fontSize:14,marginLeft:10}}>{moment(props.create).format('DD/MM/YYYY')}</Text> 
</View >

<View style={{flexShrink:1,marginTop:10}}>
<Paragraph >{props.e.comment}</Paragraph>
</View>
   

</View>

  <View  style={{backgroundColor:"silver",height:1,marginTop:10}}/>
     
          </View  >
 
              

)
 }