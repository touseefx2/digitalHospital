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

 export default function ShowMedicalsCard (props)  {
  const [is,setis] = React.useState("");
return(
  <View style={{marginTop:20,elevation:7,backgroundColor:"white",borderRadius:5,borderColor:"black",borderWidth:0.1}}>

<TouchableOpacity 
  onPress={()=>{props.navigate("MedicalView",{d:props.d})}}
  style={{width:165}}>
  <Image  onLoadStart={()=>{setis("loading")}} onLoad={()=>{setis("loaded")}}  source={{uri:props.d.photo}} style={{width:165, height:120,backgroundColor:null}}/> 
  {is == "loading" ?( <Spinner style={{position:"absolute",marginTop:15,alignSelf:"center"}} size="large" color="#307ecc"/>) : null}
  <RenderOnline s={props.d.status}/>
  <View  style={{padding:5}}>
  {props.d.username.length > 18 ?
         (
         <Text  style={{fontWeight:"bold",fontSize:14,textTransform:"capitalize"}}>{`${props.d.username.substring(0, 18)}..`}</Text>
         ) :
         <Text style={{fontWeight:"bold",fontSize:14,textTransform:"capitalize"}}>{props.d.username}</Text>
  }


           <View floatingLabel style={{marginTop:10}}>
            <Text style={{fontSize:13}} >Phone</Text>
           <Text style={{fontWeight:"bold",marginTop:4,fontSize:13,color:"grey",textTransform:"capitalize"}}>{props.d.phone}</Text>
            </View>
         

            <View floatingLabel style={{marginTop:10}}>
            <Text style={{fontSize:13}} >Location</Text>
              {(props.d.address.city+","+props.d.address.country).length > 20 ?
         (
          <Text style={{fontWeight:"bold",marginTop:4,fontSize:13,color:"grey",textTransform:"capitalize"}}>{(props.d.address.city+","+props.d.address.country).substring(0, 20)+".."}</Text>
         ) :
         <Text style={{fontWeight:"bold",marginTop:4,fontSize:13,color:"grey",textTransform:"capitalize"}}>{props.d.address.city+","+props.d.address.country}</Text>
  }
            </View>

  </View>

  </TouchableOpacity>


  </View>

  
)
  }

  