import React  from 'react';
import {TouchableOpacity,View,Image} from "react-native";
import {Text} from 'react-native-paper';
import {Spinner} from 'native-base';

 export default function  SpecialityCard (props)  {
    const [is,setis] = React.useState("");
return(
<View style={{width:150,borderRadius:15,marginTop:20}}>
<TouchableOpacity style={{justifyContent:"center",alignItems:"center",padding:5}}
onPress={async ()=>{props.navigate("Home2",{spclty:props.spclty,d:props.d,cuid:props.cuid,total:props.total})}}>
<Image onLoadStart={()=>{setis("loading")}} onLoad={()=>{setis("loaded")}}   style={{height:90,width:90,borderRadius:45,backgroundColor:null}} source={{uri:props.img || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8wTls4_pUqyqAR5gnVttLrqySG7Gl43vIYQ&usqp=CAU"}}  />
{is == "loading" ?( <Spinner style={{position:"absolute",marginTop:30}} size="large" color="#307ecc"/>) : null}
<View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"center",alignItems:"center",margin:5,flexShrink:1}}>
<Text style={{fontWeight:"700",textTransform:"capitalize"}}>{props.spclty}</Text>
<Text style={{fontSize:12,marginLeft:3}}>({props.total})</Text>
</View>
</TouchableOpacity>
<View style={{backgroundColor:"#307ecc",height:1}}/>
</View>

)}

  