import React from "react"
import { View,Text, ScrollView,TouchableOpacity,Image,StyleSheet} from "react-native";
import { DrawerItems } from "react-navigation";
import { connect } from "react-redux";
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Spinner} from 'native-base';

const  mapStateToProps = (state) => 
{
  return{
 myuser:state.usera
        }
}


 function CustomDrawerNavigatorA (props) { 
  const [is,setis] = React.useState("");
  
    return( 
  
        <ScrollView style={{backgroundColor:"#262626"}} >
            <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",height:190,backgroundColor:"black"}}>
            <Image  onLoadStart={()=>{setis("loading")}} onLoad={()=>{setis("loaded")}} style={styles.avatar} source={{uri:props.myuser.photo}}/>
            {is == "loading" ?( <Spinner style={{position:"absolute",marginTop:15}} size="large" color="#307ecc"/>) : null}
       <Text style={{fontSize:16,fontWeight:"bold",marginTop:7,color:"white"}}>{props.myuser.username}</Text>   
            </View>
            <TouchableOpacity onPress={()=>props.navigation.navigate("UserProfileA")} style={{margin:5,flexDirection:"row",alignItems:"center"}}>
<AntDesign  name="flag" size={18} color="green" />
<Text style={{marginLeft:7,color:"white",fontSize:15}}>Profile</Text>
</TouchableOpacity>
            <View style={{marginTop:20,backgroundColor:"#262626"}}>
            <DrawerItems   {...props} />
             </View>
        </ScrollView>
                                   );

                                   

}
const styles = StyleSheet.create({
                                  
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "white",
    marginTop:5
  },
})

export default connect(mapStateToProps)(CustomDrawerNavigatorA);