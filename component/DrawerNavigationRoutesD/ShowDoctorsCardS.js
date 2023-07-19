import React  from 'react';
import {View,Image,Text,ToastAndroid,Dimensions,TextInput} from "react-native";
import  AntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import { Card, CardItem, Left, Button,Spinner} from 'native-base'
import Dialog, { DialogContent,DialogFooter,DialogButton,SlideAnimation,DialogTitle} from 'react-native-popup-dialog';

 export default function  ShowDoctorsCard (props)  {

  const [is,setis] = React.useState("");
  const [rn,setrn] = React.useState(false);
  const [rnc,setrnc] = React.useState(false);
  const [t,sett] = React.useState("");

  function srfr(aid,did,props){
    if(t!=""){
      const dbupdate = firestore().collection("appointments").doc(aid);
      dbupdate.update({
       active:"Refer",cancelby:"doctor",createdat:Date.now(),cancelreason:t,refdid:did
       }).then(
         setrn(false),
         sett(""),
         props.navigate.goBack(),
       ToastAndroid.showWithGravity(
       "Refer Done \n Move in History",
       ToastAndroid.SHORT,
       ToastAndroid.BOTTOM))

    }
    else{alert("Please enter note")}
   }
  // props.aid,props.d.uid
  function renderrn(props){
    return(
      <Dialog
      visible={rn}
      onHardwareBackPress={() => true}
      dialogAnimation={new SlideAnimation({
        slideFrom: 'bottom',
      })}
      dialogTitle={<DialogTitle  title="Refer Note" />}
      footer={
       <DialogFooter>
         <DialogButton
            text="Cancel"
            textStyle={{color:"#307ecc"}}
            onPress={() => {setrn(false)}}
          />
          <DialogButton
            text="Refer"
            textStyle={{color:"#307ecc"}}
            onPress={() => {srfr(props.aid,props.d.uid,props)}}
          />
        </DialogFooter>
     }
    >
       <DialogContent style={{width:Dimensions.get('window').width-20,marginTop:10,padding:7}}>
      
       <TextInput   style={{marginTop:5,height:120,padding:7,fontSize:15}}  
     onChangeText={t => sett(t)}
     multiline={true}
     placeholder={"Please enter note"}
     placeholderTextColor="silver"
     scrollEnabled={true}
     underlineColorAndroid="#307ecc"
/>
    
       </DialogContent>
       
    </Dialog>
    )
  }

return(
  <Card style={{marginTop:30,elevation:2,borderColor:"black"}}>
{rnc && renderrn(props)}

 <CardItem>
        <Left>
        <Image  onLoadStart={()=>{setis("loading")}} onLoad={()=>{setis("loaded")}} source={{uri:props.d.photo}} style={{width:70, height:70,borderRadius:4}}/> 
        {is == "loading" ?( <Spinner style={{position:"absolute",marginTop:15,alignSelf:"center"}} size="large" color="#307ecc"/>) : null}
        <View  style={{marginLeft:40}}>
          <Text style={{fontSize:14,fontWeight:"bold",color:"black",textTransform:"capitalize"}}>Dr. {(props.d.username).substring(0,25)}</Text>
            <Text style={{color:"black"}}>{props.d.speciality}</Text>
            <Text>{(props.d.qualification).substring(0,24)}</Text>
            <Text>{(props.d.address.city+","+props.d.address.country).substring(0,24)+".."}</Text>
          </View>
         </Left>  
       
          
  
          
 </CardItem>

           
           <CardItem>
              <Left>
               <Button  onPress={()=>{props.navigate("ViewProfileD",{receiverid:props.d.uid})}} transparent>
               <AntDesign  color="#307ecc" size={22} name="profile" />
                 <Text>View Profile</Text>
                 </Button>
                 <Button style={{marginLeft:10}}  onPress={()=>{setrnc(true),setrn(true)}} transparent>
               <AntDesign  color="green" size={22} name="check" />
                 <Text>Select</Text>
                 </Button>
              </Left>
              
                     
              </CardItem>

 

</Card>

  
)
  }

  