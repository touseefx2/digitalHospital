import React from 'react';
import {View,Dimensions,TextInput,TouchableOpacity,Platform,PermissionsAndroid,Image,ToastAndroid} from "react-native";
import { Card, CardItem, Thumbnail, Icon, Radio,Left, Body, Right,Button,Text,Spinner } from 'native-base';
import { Item, Input, Form ,Label } from 'native-base';
import moment from "moment";
import Fontisto from 'react-native-vector-icons/Fontisto';
import  AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import  MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs';
import Dialog, { DialogContent,DialogFooter,DialogButton,SlideAnimation,DialogTitle} from 'react-native-popup-dialog';
import FileViewer from 'react-native-file-viewer';
import auth from '@react-native-firebase/auth';

export async function checkPermission (uri,docname,id)  {
  if (Platform.OS === 'ios') {
      downloadDoc(uri,docname,id);
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to download Photos',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //Once user grant the permission start downloading
        console.log('Storage Permission Granted.');
        downloadDoc(uri,docname,id);
      } else {
        //If permission denied then show alert 'Storage Permission Not Granted'
        alert('Storage Permission Not Granted');
      }
    } catch (err) {
      //To handle permission related issue
      console.warn(err);
    }
  }
};

export function downloadDoc (uri,docname,id)  
{
  //Image URL which we want to download
  let image_URL =uri;
  ToastAndroid.showWithGravity(
    "Download Start",
    ToastAndroid.SHORT,
    ToastAndroid.CENTER)
 //Get config and fs from RNFetchBlob
  //config: To pass the downloading related options
  //fs: To get the directory path in which we want our image to download
  const { config, fs } = RNFetchBlob;
  let PictureDir = fs.dirs.DownloadDir;
  let options = {
    fileCache: true,
    addAndroidDownloads: {
      //Related to the Android only
      useDownloadManager: true,
      mediaScannable : true,
      notification: true,
      path:  PictureDir+"/"+"x2"+"/"+ docname,
      description: 'File',
    },
  };
    config(options)
    .fetch('GET', image_URL)
    .then((res)=>{
      console.log(res)
      ToastAndroid.showWithGravity(
        "Download Successfull \n\n --> Internal Storage --> Download --> x2 ",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM)
      checkFileExist(docname,id);
    })
}

export function checkFileExist  (dn,id) 
{
  const {fs } = RNFetchBlob;
  let Dir = fs.dirs.DownloadDir;
  const localFile = Dir+"/"+"x2"+"/"+dn;
  RNFS.exists(localFile)
  .then(success => {
    const ref = firestore().collection("orders").doc(id)
      if (success) {
         console.log("file exist , ",success)
         ref.update({ exist:true  })
      } else {
        console.log("file not exist , ",success)
        ref.update({    exist:false  })
      }
  })
  .catch(err => {
      console.log(err.message, err.code);
  });
}

export function openfile (dn) 
{
  const {fs } = RNFetchBlob;
  let Dir = fs.dirs.DownloadDir;
  const localFile = Dir+"/"+"x2"+"/"+dn;
  RNFS.exists(localFile)
   FileViewer.open(localFile)
   .then(() => {
     //Can do anything you want after opening the file successfully
     console.log('Success');
   })
   .catch(_err => {
     //Handle failure here
     console.log(_err);
   });

}

export function CheckndCreateRoom (friendid)  
{
  return new Promise((resolve,reject)=>{
    const currentuserid =   auth().currentUser.uid ;
    const receiverid = friendid;    
    const user = { [friendid]:true, [currentuserid]:true }  
    const senderinfo ={name:"",photo:"",status:"",lastonline:"",type:""}
    const receiverinfo ={name:"",photo:"",status:"",lastonline:"",type:""}
    const lastMessageCreatedAt = "";
    //check kro ye room pehly ka to ni bna hwa agr bna ha to use me sare msg jane chaie naya na bane
firestore().collection("chatrooms")
.where(`user.${friendid}` , '==' , true)
.where(`user.${currentuserid}` , '==' , true).get().then((docs)=>{

let room = {}; //khali objct hamesah true hta ha 
docs.forEach(snapshot => {
room = snapshot.data();
room.id = snapshot.id;
});

if(!room.id)
{
//create room 1st time chat btw two user
room = { user, createdAt : Date.now(), lastMessage:"",lastMessageCreatedAt,senderid:currentuserid,receiverid:receiverid,receivernotification:true,sendernotification:true,senderinfo,receiverinfo,senderlastread:true,receiverlastread:true}
firestore().collection("chatrooms").add(room).then((res)=>{
  room.id = res.id;
  resolve(room);
})
}
else
{ 
 resolve(room);
}
})

 })

}


 export default function  OrderCard (props)  {
  const [clk,setclk] = React.useState(false);
  const [load,setload] = React.useState(false);
  const [ld,setld] = React.useState(false);

  const [dload,setdload] = React.useState(false);
  const [dld,setdld] = React.useState(false);

  const [total,settotal] = React.useState("");

  const [s1,sets1] = React.useState(false);
  const [s2,sets2] = React.useState(false);
  const [s3,sets3] = React.useState(false);
  const [t,sett] = React.useState("");
  const [is,setis] = React.useState("");


  function dlvr(ft,id){
  if(total!="")
  {
    firestore().collection("orders").doc(id).update({total:ft,orderstatus:"Deliver",createdat:Date.now()})
            .then(
              setdld(false),settotal(""),
              ToastAndroid.showWithGravity(
                "Deliver",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM),
            ).catch((e)=>console.log(e))
  }else{
    alert("Please enter total medicine amount")
  }

  }


  function fs1(){
   sets1(true);sets2(false);sets3(false);sett("Invalid Prescription")
  }

  function fs2(){
    sets1(false);sets2(true);sets3(false);sett("Not Available")
  }

  function fs3(){
    sets1(false);sets2(false);sets3(true);sett("")
  }

  function cancel(props){
    if(t!=""){
      firestore().collection("orders").doc(props.d.id)
      .update({cancelby:"medical",orderstatus:"Cancel",cancelreason:t,createdat:Date.now()})
      .then( setld(false), sett(""),
        ToastAndroid.showWithGravity(
          "Cancel",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM)
      ).catch((e)=>console.log(e))
    }else
    {
      alert("Please select any option")
    }

   
  }

  function rendercancelDialog(props){
    return(
      <Dialog
      visible={ld}
      onHardwareBackPress={() => true}
      dialogAnimation={new SlideAnimation({
        slideFrom: 'bottom',
      })}
      dialogTitle={<DialogTitle  title="Are you sure u want to cancel order ?" />}
      footer={
       <DialogFooter>
          <DialogButton
            text="No"
            textStyle={{color:"#307ecc"}}
            onPress={() => {setld(false),sett("")}}
          />
          <DialogButton
            text="Yes"
            textStyle={{color:"#307ecc"}}
            onPress={() => {cancel(props)}}
          />
        </DialogFooter>
     }
    >
       <DialogContent style={{width:Dimensions.get('window').width-10,marginTop:10,padding:7}}>
        <Text style={{color:"#307ecc",fontWeight:"bold"}}>Please select any reason</Text>
        <Card style={{marginTop:20}}>

        <View>

 <TouchableOpacity  onPress={()=>{fs1()}} >
          <CardItem>      
            <Left>   
            <Radio color="#307ecc" selectedColor="#307ecc" selected={s1} />       
            <Text style={{fontSize:15}}>Invalid Prescription</Text>
            </Left>        
           </CardItem>      
 </TouchableOpacity>

 <View style={{height:1,backgroundColor:"silver"}} />

 <TouchableOpacity  style={{marginTop:10}}  onPress={()=>{fs2()}}>
          <CardItem>      
            <Left>   
            <Radio color="#307ecc" selectedColor="#307ecc"  selected={s2} />       
            <Text style={{fontSize:15}}>Not Available</Text>
            </Left>        
           </CardItem>      
 </TouchableOpacity>

 <View style={{height:1,backgroundColor:"silver"}} />

 <TouchableOpacity  style={{marginTop:10}} onPress={()=>{fs3()}}>
          <CardItem>      
            <Left>   
            <Radio color="#307ecc" selectedColor="#307ecc"   selected={s3} />       
            <Text style={{fontSize:15}}>Other reason</Text>
            </Left>        
           </CardItem>      
 </TouchableOpacity>

{s3 ? (
      <TextInput   style={{marginTop:5,height:90,padding:7}}  
     onChangeText={t => sett(t)}
     multiline={true}
     placeholder={"Enter other reason"}
     placeholderTextColor="silver"
     scrollEnabled={true}
     underlineColorAndroid="#307ecc"
/>
) : null}
       
        </View>

        
        </Card>
       </DialogContent>
       
    </Dialog>
    )
  }

  function renderdlvrDialog(props){
    let t  = parseInt(total) || "0"
    let ftotal  = JSON.stringify(parseInt(t) + parseInt(props.d.d.dlvry.fee))+" PKR"
    return(
      <Dialog
      visible={dld}
      onHardwareBackPress={() => true}
      dialogAnimation={new SlideAnimation({
        slideFrom: 'bottom',
      })}
      dialogTitle={<DialogTitle  title="Confirm Delivery" />}
      footer={
       <DialogFooter>
          <DialogButton
            text="Cancel"
            textStyle={{color:"#307ecc"}}
            onPress={() => {setdld(false),settotal("")}}
          />
          <DialogButton
            text="Confirm"
            textStyle={{color:"#307ecc"}}
            onPress={() => {
             dlvr(ftotal,props.d.id)}}
          />
        </DialogFooter>
     }
    >
       <DialogContent style={{width:Dimensions.get('window').width-50,marginTop:10,padding:7}}>
        
       <Card style={{marginTop:10}}>

        <CardItem style={{backgroundColor:"#cccccc"}}>
      <Left>
      <MaterialIcons color="green" size={25} name="person-pin-circle" />
      <Text style={{fontSize:13,fontWeight:"bold",color:"#3b3b3b",textTransform:"capitalize"}}>{props.d.d.dlvry.name}</Text>
      </Left>
    </CardItem>

  <CardItem>
       <Text style={{fontSize:13}}>{props.d.d.dlvry.workingdays} working days</Text>     
 </CardItem>

 <View style={{backgroundColor:"#cccccc",height:1}}  />
 
 <CardItem>
 <Text style={{fontSize:13,fontWeight:"bold",color:"#6e6e6e"}}>Delivery fee : RS {props.d.d.dlvry.fee}</Text>
 </CardItem>

      </Card>


<CardItem style={{marginTop:5}} >

<Item stackedLabel style={{width:200,borderBottomColor:"green"}}>
   <Label style={{fontSize:13,fontWeight:"700"}}>Total medicine amount</Label>
  <Input style={{fontSize:13}} placeholder="e.g  550" placeholderTextColor="silver" keyboardType="number-pad"  onChangeText={(t)=>settotal(t)} value={total} />
</Item>
</CardItem>

<Card style={{marginTop:10}}>

<CardItem>
<Left>
<Text style={{fontSize:14,fontWeight:"bold",color:"black"}}>Total</Text>
</Left>
<Right>
<Text style={{fontSize:14,color:"red",textTransform:"capitalize"}}>{ftotal}</Text>
</Right>
</CardItem>

</Card>


       </DialogContent>
       
    </Dialog>
    )
  }

return(
<Card style={{marginTop:20,elevation:3}} >
{load  && rendercancelDialog(props)}
{dload  && renderdlvrDialog(props)}
<CardItem style={{backgroundColor:"#d9d9d9"}}>
<Left>
<Text style={{color:"#7d7d7d",fontSize:14}}>
  Status
</Text>
</Left>

<Right>
{props.d.d.cancelby == "patient"? 
(<Text style={{color:"red",fontSize:13,fontWeight:"bold"}}>
  {props.d.d.orderstatus}
</Text>):null}
{props.d.d.cancelby == "medical"? 
(
  <View>
<Text style={{color:"red",fontSize:12}}>
 Cancel By Medical
</Text>
<Text style={{color:"green",fontSize:13,fontWeight:"bold"}}>
 {props.d.d.cancelreason}
</Text>
  </View>
):null}
{props.d.d.orderstatus == "Pending"? 
(<Text style={{color:"red",fontSize:13,fontWeight:"bold"}}>
  {props.d.d.orderstatus}
</Text>):null}
{props.d.d.orderstatus == "Deliver"? 
(<Text style={{color:"green",fontSize:13,fontWeight:"bold"}}>
  {props.d.d.orderstatus}
</Text>):null}
</Right>
</CardItem>

            <CardItem>
              <Left>
                <Thumbnail source={require("../../assets/ordr.png")} style={{height:60, width:60,borderRadius:30}} />
                <Body>
                {props.d.d.name.length > 20 ?
         (
         <Text  style={{textTransform:"capitalize",fontSize:15}}>Pt. {`${props.d.d.name.substring(0, 34)}..`}</Text>
         ) :
         <Text style={{textTransform:"capitalize",fontSize:15}}>Pt. {props.d.d.name}</Text>
  }
                  <Text style={{color:"grey",fontSize:13}} >{props.d.d.minfo.phone}</Text>
                  <Text style={{color:"grey",fontSize:13}} >{props.d.d.ptemail}</Text>
                </Body>
              </Left>
            </CardItem>

            <CardItem cardBody>

<View >

<View style={{flexDirection:"row",justifyContent:"space-between"}}>

<Form  style={{padding:5,width:160,marginTop:-10}}>

<Item floatingLabel style={{height:40}} >
  <Input style={{fontSize:13,textTransform:"capitalize"}} editable={false} value={props.d.d.orderid} />
  <Label style={{fontSize:13,fontWeight:"700"}}>Order ID</Label>
</Item>

<Item floatingLabel style={{height:60}} >
  <Input style={{fontSize:13}} editable={false}
   multiline={true}
   numberOfLines={1} 
  value={moment(new Date(props.d.d.orderdate.toDate())).format("LLL")} />
  <Label style={{fontSize:13,fontWeight:"700"}}>Oder Date</Label>
</Item>

<Item stackedLabel  style={{width:295}}>
<Label style={{fontSize:13,fontWeight:"700"}}>Shipping Address</Label>
  <Input style={{fontSize:13,textTransform:"capitalize"}} editable={false}
   multiline={true}
   numberOfLines={3} 
  value={(`${props.d.d.address},${props.d.d.city}`).substr(0,120)+" ..."} />
</Item>

</Form>

<Form  style={{padding:5,width:160,marginTop:-10}}>

<Item floatingLabel style={{height:40}}>
  <Input style={{fontSize:13,textTransform:"capitalize"}} editable={false} value={props.d.d.dlvry.fee} />
  <Label style={{fontSize:13,fontWeight:"700"}}>Shipping Charges</Label>
</Item>


{props.d.d.total != "" ? (
  <Item floatingLabel style={{height:60}}>
  <Input style={{fontSize:13,textTransform:"capitalize",color:"red"}} editable={false} value={props.d.d.total} />
  <Label style={{fontSize:13,fontWeight:"700"}}>Total Amount</Label>
</Item>
) 
: 
(<Item floatingLabel style={{height:60}}>
  <Input style={{fontSize:13,textTransform:"capitalize",color:"red"}} editable={false} value={`${"\n"}- - - - - - -${"\n"}`} />
  <Label style={{fontSize:13,fontWeight:"700"}}>Total Amount</Label>
</Item>)}



</Form>

</View>

</View>

            </CardItem >


            <CardItem  style={{flexDirection:"row",justifyContent:"space-between",marginTop:10,marginLeft:10}}>
              <Text  style={{fontSize:13,fontWeight:"700",color:"#545454",textTransform:"capitalize"}}>Prescription</Text>
              {!clk
              ? 
              <TouchableOpacity onPress={()=>setclk(true)}> 
                <Fontisto   size={20} color="black" name="arrow-down" />
              </TouchableOpacity>
             :
             <TouchableOpacity onPress={()=>setclk(false)}> 
             <Fontisto   size={20} color="black" name="arrow-up" />
           </TouchableOpacity>}
              </CardItem>
     

       {clk && !props.d.d.exist ? (
            <CardItem style={{marginLeft:10}}>
              <Left>
        <TouchableOpacity style={{alignItems:"center"}} onPress={()=>{checkPermission(props.d.d.document,props.d.d.documentname,props.d.id)}}>
         <Image  onLoadStart={()=>{setis("loading")}}  onLoad={()=>{setis("loaded")}} resizeMode="cover"  blurRadius={4}  source={{uri:props.d.d.document}} style={{width:120, height:120}} />
        <MaterialCommunityIcons  style={{position:"absolute",marginTop:40}} size={40} color="white" name="cloud-download-outline"/>  
        {is == "loading" ?( <Spinner style={{position:"absolute",marginTop:40}} size="large" color="#307ecc"/>) : null}
         </TouchableOpacity>
             </Left>
             <Right>
             <Text style={{color:"grey",fontSize:14}}>{props.d.d.option}</Text>
             </Right>
         </CardItem>
        
       ) :  null }
       
       {clk && props.d.d.exist ? (
        
          <CardItem style={{marginLeft:10}}> 
            <Left>
          <TouchableOpacity style={{alignItems:"center"}}  onPress={()=>{ openfile(props.d.d.documentname);console.log(props.d.d.documentname)}}>
         <Image onLoadStart={()=>{setis("loading")}}  onLoad={()=>{setis("loaded")}} resizeMode="cover" source={{uri:props.d.d.document}} style={{width:120, height:120}} />
         {is == "loading" ?( <Spinner style={{position:"absolute",marginTop:40}} size="large" color="#307ecc"/>) : null}
         </TouchableOpacity>
         </Left>
             <Right>
             <Text style={{color:"grey",fontSize:14}}>{props.d.d.option}</Text>
             </Right>
         </CardItem>       
        
       ) : null}



{/* Button */}
             { props.d.d.orderstatus == "Pending"
               ? 
               <CardItem>
              <Left>
               <Button 
               onPress={()=>{
                setld(true);setload(true)
              }} 
               transparent>
                 <MaterialIcons color="red" size={25} name="close" />
                  <Text>Cancel Order</Text>
                </Button>
              </Left> 
              <Body>
              <Button 
               onPress={()=>{
                setdld(true);setdload(true)
              }} 
               transparent>
                  <MaterialIcons color="green" size={25} name="done" />
                  <Text>Deliver</Text>
                </Button>
              </Body>
              <Right>
              <Button 
               onPress={async ()=>{
                const room = await CheckndCreateRoom(props.d.d.patientid);
                props.navigate("StoChatScreen",{roomid:room.id,receiverid:room.receiverid,senderid:room.senderid,name:props.d.d.name})  
                }}  
               transparent>
                  <MaterialIcons color="#307ecc" size={25} name="chat" />
                  <Text>Chat</Text>
                </Button>
              </Right>
              </CardItem> 
              : null}

{ props.d.d.orderstatus == "Deliver" ? (
  <CardItem>
    <Left>
    <Button 
               onPress={()=>{props.navigate("ViewProfile",{receiverid:props.d.d.patientid})}}
                transparent>
                   <AntDesign  color="#307ecc" size={25} name="profile" />
                  <Text>View Profile</Text>
                </Button>     
              </Left> 
  </CardItem>
                 
): null}

             
          </Card>

)
  }


