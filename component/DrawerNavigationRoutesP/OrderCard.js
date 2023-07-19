import React from 'react';
import {View,Dimensions,TouchableOpacity,Platform,PermissionsAndroid,Image,ToastAndroid,Alert} from "react-native";
import { Card, CardItem, Thumbnail, Left, Body, Right,Button,Text,Spinner, Item, Input, Form ,Label} from 'native-base';
import moment from "moment";
import  MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs';
import Dialog, {DialogFooter,DialogButton,SlideAnimation,DialogTitle,FadeAnimation,DialogContent} from 'react-native-popup-dialog';
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

  const [rload,setrload] = React.useState(false);
  const [rld,setrld] = React.useState(false);

  const [dload,setdload] = React.useState(false);
  const [dld,setdld] = React.useState(false);
  const [is,setis] = React.useState("");

  function frepeatorder(oid,props){
    const ref = firestore().collection('orders');
    ref.add({
      patientid:props.d.d.patientid,
      mid:props.d.d.mid,
      orderid:oid,
      address:props.d.d.address,
      city:props.d.d.city,
      cancelby:"",
      createdat:Date.now(),
      cancelreason:"",
      exist:props.d.d.exist,
      phone:props.d.d.phone,
      name:props.d.d.name,
      total:"",
      maddress:props.d.d.maddress,
      memail:props.d.d.memial,
      dlvry:props.d.d.dlvry,
      option:props.d.d.option,
     ptemail:props.d.d.ptemail,
     minfo:props.d.d.minfo,
      document:props.d.d.document,
      documentname:props.d.d.documentname,
      orderstatus:"Pending",
      orderdate:firestore.FieldValue.serverTimestamp()
    }).then((d)=>{

      ref.doc(d.id).update({
        createdat:Date.now()
      }).then(
        setdld(false),
        ToastAndroid.showWithGravity(
        "Done",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM)
      )
      .catch(e=>console.log("cnfrm app erre , ",e))

      }).catch(e=>console.log("cnfrm app erre , ",e))
  
  }

  function repeatorder(props){
    setrld(false);
    setdload(true);
    setdld(true)
    const db = firestore().collection("orders")
    db.get().then((doc)=>{ 
     const min = 1;
     const max = 1000000000;
     const rand = min + Math.random() * (max - min);
     let orderid= JSON.stringify(rand).substring(0,6);

     if(doc.size>0)
     {
       doc.forEach(da => {
         const d = da.data()
         if(orderid==d.orderid)
         {
           const min = 1;
           const max = 1000000000;
           const rand = min + Math.random() * (max - min);
           orderid= JSON.stringify(rand).substring(0,6);
         }
       });

       frepeatorder(orderid,props)

     }else{
  
      frepeatorder(orderid,props)

     }
   })
       
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
            onPress={() => setld(false)}
          />
          <DialogButton
            text="Yes"
            textStyle={{color:"#307ecc"}}
            onPress={() => {
             firestore().collection("orders").doc(props.d.id).update({cancelby:"patient",orderstatus:"Cancel",createdat:Date.now()})
            .then(setld(false), ToastAndroid.showWithGravity(
                "Cancel",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM)).catch((e)=>console.log(e))}}
           
          />
        </DialogFooter>
     }
    >
       
    </Dialog>
    )
  }

  function renderRepeatOrder(props){

    return(
      <Dialog
      visible={rld}
      onHardwareBackPress={() => true}
      dialogAnimation={new SlideAnimation({
        slideFrom: 'bottom',
      })}
      dialogTitle={<DialogTitle  title="Are you sure u want repeat this order ?" />}
      footer={
       <DialogFooter>
          <DialogButton
            text="No"
            textStyle={{color:"#307ecc"}}
            onPress={() => setrld(false)}
          />
          <DialogButton
            text="Yes"
            textStyle={{color:"#307ecc"}}
            onPress={() => {repeatorder(props)}}
          />
        </DialogFooter>
     }
    >
       
       
    </Dialog>
    )
  }

  function renderDocload()
  {
    return(
    <Dialog
      visible={dld}
      onHardwareBackPress={() => true}
      dialogAnimation={new FadeAnimation({
        initialValue: 0, // optional
        animationDuration: 150, // optional
        useNativeDriver: true, // optional
      })}
    >
      <DialogContent>
       <Spinner size="large" color="blue"/>
      </DialogContent>
    </Dialog>
  
    )
  
  }
  
  function done(props){
    Alert.alert(
      '',
      'Order Received  ?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: ()  => {
            firestore().collection("orders").doc(props.d.id)
            .update({orderstatus:"Done",createdat:Date.now()})
            .then(
              ToastAndroid.showWithGravity(
                "Done",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM),
                 props.navigate("Rate",{receiverid:props.d.d.mid}),
                ).catch((e)=>console.log(e))
          }
        }
      ],
      { cancelable: false }
    );
 
  }

return(
<Card style={{marginTop:20,elevation:3}} >
{load  &&  rendercancelDialog(props)}
{rload  &&   renderRepeatOrder(props)}
{dload && renderDocload()}
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
{props.d.d.orderstatus == "Done"? 
(<Text style={{color:"green",fontSize:13,fontWeight:"bold"}}>
  {props.d.d.orderstatus}
</Text>):null}
</Right>
</CardItem>

            <CardItem>
              <Left>
                <Thumbnail source={{uri: props.d.d.minfo.photo}} style={{height:60, width:60,borderRadius:5}} />
                <Body>
                {props.d.d.minfo.name.length > 20 ?
         (
         <Text  style={{textTransform:"capitalize",fontSize:15}}>Md. {`${props.d.d.minfo.name.substring(0, 34)}..`}</Text>
         ) :
         <Text style={{textTransform:"capitalize",fontSize:15}}>Md. {props.d.d.minfo.name}</Text>
  }

                  <Text style={{color:"grey",fontSize:13}} >{props.d.d.minfo.phone}</Text>
                  <Text style={{color:"grey",fontSize:13}} >{props.d.d.memail}</Text>
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

{props.d.d.orderdate ? (
  <Item floatingLabel style={{height:60}} >
  <Input style={{fontSize:13}} editable={false}
   multiline={true}
   numberOfLines={1} 
  value={moment(new Date(props.d.d.orderdate.toDate())).format("LLL")} />
  <Label style={{fontSize:13,fontWeight:"700"}}>Oder Date</Label>
</Item>
): null}


<Item stackedLabel   style={{width:295}}>
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
  <Label style={{fontSize:13,fontWeight:"700"}}>Total Payable</Label>
</Item>
) 
: 
(<Item floatingLabel style={{height:60}}>
  <Input style={{fontSize:13,textTransform:"capitalize",color:"red"}} editable={false} value={`${"\n"}- - - - - - -${"\n"}`} />
  <Label style={{fontSize:13,fontWeight:"700"}}>Total Payable</Label>
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
              <Fontisto   size={20} color="black"name="arrow-down" />
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
                 <Image onLoadStart={()=>{setis("loading")}}  onLoad={()=>{setis("loaded")}} resizeMode="cover" blurRadius={4}  source={{uri:props.d.d.document}} style={{width:120, height:120}}  />
                <MaterialCommunityIcons style={{position:"absolute",marginTop:40}} size={40} color="white" name="cloud-download-outline"/>  
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
          <TouchableOpacity style={{alignItems:"center"}} onPress={()=>{ openfile(props.d.d.documentname);console.log(props.d.d.documentname)}}>
          <Image onLoadStart={()=>{setis("loading")}} onLoad={()=>{setis("loaded")}} resizeMode="cover"  source={{uri:props.d.d.document}} style={{width:120, height:120}}/>
          {is == "loading" ?( <Spinner style={{position:"absolute",marginTop:40}} size="large" color="#307ecc"/>) : null}
         </TouchableOpacity>
         </Left>
             <Right>
             <Text style={{color:"grey",fontSize:14}}>{props.d.d.option}</Text>
             </Right>
         </CardItem>       
        
       ) : null}


             { props.d.d.orderstatus == "Pending"
               ? 
               <CardItem>
              <Left>
               <Button 
               onPress={()=>{ setld(true);setload(true);}} 
               transparent>
                 <MaterialIcons color="red" size={25} name="close" />
                  <Text>Cancel Order</Text>
                </Button>
              </Left>  
              <Right>
              <Button 
               onPress={async ()=>{
                const room = await CheckndCreateRoom(props.d.d.mid);
                props.navigate("StoChatScreen",{roomid:room.id,photo:props.d.d.minfo.photo,receiverid:room.receiverid,senderid:room.senderid,name:props.d.d.minfo.name})  
                }}  
               transparent>
                  <MaterialIcons color="#307ecc" size={25} name="chat" />
                  <Text>Chat</Text>
                </Button>
              </Right>
              </CardItem> 
              : null}
             
             { props.d.d.orderstatus == "Deliver"
               ? 
               <CardItem>
              <Left>
              <Button 
              onPress={()=>{done(props)}}
               transparent>
                  <MaterialIcons color="green"  size={25} name="done-all" />
                  <Text>Order Received</Text>
                </Button>  
              </Left>  
              </CardItem> 
              : null}

{ props.d.d.orderstatus == "Done"
               ? 
               <CardItem>
              <Left>
              <Button 
               onPress={()=>{setrload(true);setrld(true)}}  
               transparent>
                  <MaterialIcons color="#307ecc" size={22} name="repeat" />
                  <Text>Repeat the same order</Text>
                </Button>
              </Left>  
              <Right> 
              <Button 
              onPress={()=>{props.navigate("Rate",{receiverid:props.d.d.mid})}}
               transparent>
                 <MaterialIcons color="green" size={22} name="star-half" />
                  <Text>Rate</Text>
                </Button>          
              </Right>
              </CardItem> 
              : null}

          </Card>

)
  }


