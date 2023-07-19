import React  from 'react';
import {View,TouchableOpacity,Image,Text} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Spinner} from 'native-base';

export function RenderOnline(props)
{
  if(props.s == "online") 
  {
    return(
      <MaterialCommunityIcons  style={{padding:5}} name="checkbox-blank-circle" size={10} color="#1cd949"/>
    )
  }
  else
  {
    return(
      <MaterialCommunityIcons  style={{padding:5}} name="checkbox-blank-circle" size={10} color="#de3c3c"/>
    )
  }
}

 export default function  ShowDoctorsCard (props)  {
  const [is,setis] = React.useState("");
return(
  <View style={{marginTop:20,elevation:7,backgroundColor:"white",borderRadius:5,borderColor:"black",borderWidth:0.1}}>

<TouchableOpacity 
  onPress={()=>{props.navigate("HomeScreenS",{d:props.d,cuid:props.cuid})}}
  style={{width:165,justifyContent:"center"}}>
  <Image  onLoadStart={()=>{setis("loading")}} onLoad={()=>{setis("loaded")}}  source={{uri:props.d.photo}} style={{width:165, height:120}}/> 
  {is == "loading" ?( <Spinner style={{position:"absolute",marginTop:15,alignSelf:"center"}} size="large" color="#307ecc"/>) : null}
  <RenderOnline s={props.d.status}/>
  <View  style={{padding:5}}>
  {props.d.username.length > 16 ?
         (
         <Text  style={{fontWeight:"bold",fontSize:15,textTransform:"capitalize"}}>Dr.{`${props.d.username.substring(0, 16)}..`}</Text>
         ) :
         <Text style={{fontWeight:"bold",fontSize:15,textTransform:"capitalize"}}>Dr.{props.d.username}</Text>
  }
      {props.d.qualification.length > 20 ?
         (
          <Text style={{fontWeight:"bold",marginTop:4,fontSize:14,color:"grey",textTransform:"capitalize"}}>{`${props.d.qualification.substring(0, 20)}..`}</Text>
         ) :
         <Text style={{fontWeight:"bold",marginTop:4,fontSize:14,color:"grey",textTransform:"capitalize"}}>{props.d.qualification}</Text>
  }
         

            <View  style={{flexDirection:"row",marginTop:10,justifyContent:"space-between"}}>
              <Text style={{fontSize:14}} >Fees</Text>
              <Text style={{fontSize:14,color:"green"}}>{props.d.fees}</Text>
            </View>

            <View floatingLabel style={{marginTop:10}}>
            <Text style={{fontSize:14}} >Location</Text>
              {(props.d.address.city+","+props.d.address.country).length > 20 ?
         (
          <Text style={{fontWeight:"bold",marginTop:4,fontSize:14,color:"grey",textTransform:"capitalize"}}>{(props.d.address.city+","+props.d.address.country).substring(0, 20)+".."}</Text>
         ) :
         <Text style={{fontWeight:"bold",marginTop:4,fontSize:14,color:"grey",textTransform:"capitalize"}}>{props.d.address.city+","+props.d.address.country}</Text>
  }
            </View>

  </View>

  </TouchableOpacity>


  </View>

  
)
  }

  