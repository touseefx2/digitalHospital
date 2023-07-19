import  React from "react";
import { View,Text, ScrollView,Image,StyleSheet} from "react-native";
import { DrawerItems } from "react-navigation";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Spinner} from 'native-base';

const  mapStateToProps = (state) => 
{
  return{
 myuser:state.userd
        }
}


 function CustomDrawerNavigatorD (props) { 
  const [is,setis] = React.useState("");
  let name = props.myuser.username || ""
    return( 
  
        <ScrollView style={{backgroundColor:"#262626"}} >
           <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",backgroundColor:"black"}}>
            <Image  onLoadStart={()=>{setis("loading")}} onLoad={()=>{setis("loaded")}} style={styles.avatar} source={{uri:props.myuser.photo}}/>
            {is == "loading" ?( <Spinner style={{position:"absolute",marginTop:15}} size="large" color="#307ecc"/>) : null}
            <View style={{margin:10,flexShrink:1}}>
              {name.length > 36 
              ? ( <Text style={{fontSize:15,fontWeight:"bold",color:"white",margin:5,textTransform:"capitalize"}}>{`Dr. ${name.substring(0,36)}..`}</Text>   ) 
              : <Text style={{fontSize:15,fontWeight:"bold",color:"white",margin:5,textTransform:"capitalize"}}>{"Dr. "+name}</Text>}

</View>
            </View>
<TouchableOpacity onPress={()=>props.navigation.navigate("UserProfile")} style={{margin:5,flexDirection:"row",alignItems:"center"}}>
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

//positn absolute krne se pic se agy jo text ha wo nechy ni blky use jaga pe ae ga jahan pic ha

export default connect(mapStateToProps)(CustomDrawerNavigatorD);