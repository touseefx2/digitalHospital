import React from 'react';
import {View,ToastAndroid,ScrollView,TouchableOpacity,Platform,PermissionsAndroid,useRef,useMemo,Dimensions,TextInput} from "react-native";
import { Card, CardItem, Thumbnail, Icon, Radio,Left, Body, Right,Button,Text } from 'native-base';
import { Item, Input, Form ,Label } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import Dialog, { DialogContent,DialogFooter,DialogButton,SlideAnimation,DialogTitle} from 'react-native-popup-dialog';
import RNFetchBlob from 'rn-fetch-blob'
import  AntDesign from 'react-native-vector-icons/AntDesign';
import  MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import { Avatar,Paragraph } from 'react-native-paper';
import FileViewer from 'react-native-file-viewer';
import auth from '@react-native-firebase/auth';

export function RenderReduceDdocname(props)
{
  const s = props.name;
  console.log(s);
  const ext =  s.substr(s.lastIndexOf('.') + 1);
  const dcname = s.substring(0, s.lastIndexOf('.'));

  console.log("ext , "+ext+"  , filenmae , "+dcname);


    if(dcname.length > 6)  return <Text   style={{color:"white",fontSize:15}}>{`${dcname.substring(0,5)}.. .`+ext}</Text>
     else
     return <Text  style={{color:"white",fontSize:15}}>{s}</Text>
}

export function checkFileExist (dn,id) 
{
  console.log(id)
  const {fs } = RNFetchBlob;
  let Dir = fs.dirs.DownloadDir;
  const localFile = Dir+"/"+"x2"+"/"+dn;
  RNFS.exists(localFile)
  .then(success => {
    const ref = firestore().collection("appointments").doc(id)
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

export function openfile(dn) 
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



export function  downloadImage (uri,docname,id)  
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
      showNotification: true,
      foreground:true,
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
    }).catch(e=> {
     console.log(e),
     alert("Sorry , this file dose not exist in database storage ")
       })
}

export async function checkPermission (uri,docname,id)  
  {
    if (Platform.OS === 'ios') {
      downloadImage(uri,docname,id);
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
         downloadImage(uri,docname,id);
        } else {
          //If permission denied then show alert 'Storage Permission Not Granted'
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        //To handle permission related issue
        console.warn(err);
      }
    }
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



//nvgtn clas cmpnnt me hoti ha srf na k fnctn cmpnnt 

 export default function  AppointmentCard (props)  {

  const [load,setload] = React.useState(false);
  const [ld,setld] = React.useState(false);
  const [s1,sets1] = React.useState(false);
  const [s2,sets2] = React.useState(false);
  const [s3,sets3] = React.useState(false);
  const [t,sett] = React.useState("");



  const [p,setp] = React.useState(false);
  const [pc,setpc] = React.useState(false);

  const [rn,setrn] = React.useState(false);
  const [rnc,setrnc] = React.useState(false);

  const [rsr,setrsr] = React.useState(false);
  const [rsrc,setrsrc] = React.useState(false);
  const [rd,setrd] = React.useState(null);

  

  function renderPicker(props){
    return(
      <Dialog
      visible={p}
      onHardwareBackPress={() => true}
      dialogAnimation={new SlideAnimation({
        slideFrom: 'bottom',
      })}
      footer={
       <DialogFooter>
          <DialogButton
            text="Cancel"
            textStyle={{color:"#307ecc"}}
            onPress={() => {setp(false)}}
          />
        </DialogFooter>
     }
    >
       <DialogContent style={{width:Dimensions.get('window').width-50,marginTop:10,padding:7}}>
   <View style={{marginTop:23,justifyContent:"space-between"}}>
  <TouchableOpacity onPress={()=>{setp(false);props.object.navigation.navigate("SearchScreen",{aid:props.d.aid})}}>
<Text style={{fontSize:17}}>Refer with Suggested doctor{'\n'}{'\n'}</Text>
</TouchableOpacity>
<TouchableOpacity onPress={()=>{setp(false);setrnc(true);setrn(true)}}>
<Text style={{fontSize:17}}>Refer with simple note</Text>
</TouchableOpacity>
</View>
    
       </DialogContent>
       
    </Dialog>
    )
  }

  function srfr(aid){
    if(t!=""){
      const dbupdate = firestore().collection("appointments").doc(aid);
      dbupdate.update({
       active:"Refer",cancelby:"doctor",createdat:Date.now(),cancelreason:t
       }).then(
         setrn(false),
         sett(""),
       ToastAndroid.showWithGravity(
       "Refer Done \n Move in History",
       ToastAndroid.SHORT,
       ToastAndroid.BOTTOM))

    }
    else{alert("Please enter note")}
   }
  
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
            onPress={() => {srfr(props.d.aid)}}
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


  function rendercancelDialog(aid){
    return(
      <Dialog
      visible={ld}
      onHardwareBackPress={() => true}
      dialogAnimation={new SlideAnimation({
        slideFrom: 'bottom',
      })}
      dialogTitle={<DialogTitle  title="Are you sure u want to cancel Appoitnment ?" />}
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
            onPress={() => {cancel(aid)}}
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
            <Text style={{fontSize:15}}>Emergency</Text>
            </Left>        
           </CardItem>      
 </TouchableOpacity>

 <View style={{height:1,backgroundColor:"silver"}} />

 <TouchableOpacity  style={{marginTop:10}}  onPress={()=>{fs2()}}>
          <CardItem>      
            <Left>   
            <Radio color="#307ecc" selectedColor="#307ecc"  selected={s2} />       
            <Text style={{fontSize:15}}>Busy</Text>
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

  function fs1(){
    sets1(true);sets2(false);sets3(false);sett("Emergency")
   }
 
   function fs2(){
     sets1(false);sets2(true);sets3(false);sett("Busy")
   }
 
   function fs3(){
     sets1(false);sets2(false);sets3(true);sett("")
   }

  function cancel(aid){
    if(t!=""){
      const dbupdate = firestore().collection("appointments").doc(aid);
      dbupdate.update({
       active:"Cancel",cancelby:"doctor",createdat:Date.now(),cancelreason:t
       }).then(
         setld(false),
         sett(""),
       ToastAndroid.showWithGravity(
       "Cancle Done",
       ToastAndroid.SHORT,
       ToastAndroid.BOTTOM))

    }else
    {
      alert("Please select any option")
    }

   
  }

  function videocall(props){
  const roomRef =  firestore().collection('videocallrooms').doc(props.d.patientid);
  roomRef.get().then(async (d)=>{
    if(d.exists){
      alert(`Sorry\n ${props.d.patientinfo.name} is on another call...`)
    }else{

      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Audio Permission Required',
            message: 'This app needs access to your Audio to Video Call',
          }
        );

        const granted2 = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Take Picture and video Permission Required',
            message: 'This app needs access to your Cmera to Video Call',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED && granted2 === PermissionsAndroid.RESULTS.GRANTED ) {
          //Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          props.object.navigation.navigate("Video",{did:props.d.patientid,name:props.d.patientinfo.name,photo:props.d.patientinfo.photo})
        } else {
          //If permission denied then show alert 'Storage Permission Not Granted'
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        //To handle permission related issue
        console.warn(err);
      }

    }
    })
  }

  function renderseerefer(props){
   
if(props.d.refdid!="")
{
  firestore().collection("users").doc(props.d.refdid)
  .get().then((doc)=>{
   if(doc.data())
   {
   const d = doc.data();
   setrd(d);
   }else{
     setrd(null);
   }
  });
}else{
 setrd(null)
}
    
    return(
      <Dialog
      visible={rsr}
      onHardwareBackPress={() => true}
      dialogAnimation={new SlideAnimation({
        slideFrom: 'bottom',
      })}
      dialogTitle={<DialogTitle  title="Refer Note" />}
      footer={
       <DialogFooter>
          <DialogButton
            text="Close"
            textStyle={{color:"#307ecc"}}
            onPress={() => setrsr(false)}
          />
        </DialogFooter>
     }
    >

        <ScrollView>
        <DialogContent style={{width:Dimensions.get('window').width - 30,borderRadius:10}}>
        <View style={{padding:2}}>

<Text style={{color:"silver",fontSize:14,marginTop:10}}>From</Text>
<Card  style={{padding:5}}>
<View style={{flexDirection:"row",marginTop:5}}>
  <Avatar.Image size={35} source={{uri: props.d.doctorinfo.photo }} />
  <View  style={{flexShrink:1}}>
  {props.d.doctorinfo.name.length > 25?
          (
            <Text style={{fontSize:13,textTransform:"capitalize",marginLeft:10,marginTop:5}}>
              Dr. {`${props.d.doctorinfo.name.substring(0, 25)}..`}
              </Text>
          ) :
          <Text style={{fontSize:13,textTransform:"capitalize",marginLeft:10,marginTop:5}}>Dr. {props.d.doctorinfo.name}</Text>
        }
  </View>
  </View>

  <View style={{marginTop:14}}>
<Text style={{fontSize:14}}>* Note :-</Text>
<Paragraph style={{fontSize:15,marginTop:5,color:"grey"}}>{props.d.cancelreason}
asjhakjshakjhskajhskaj  hskajhskjahskjahskjahskjaajshakjshkajhs akjshkajshkajhs kjashkjahskjahs
asjhakjshak  jhska jhskajhskajhskjahskjahskjahskjaajshakjshkajhs akjshkajshkajhs kjashkjahskjahs
asjhakjs
</Paragraph>
</View>
</Card>
<Text style={{color:"silver",fontSize:14,marginTop:20}}>Suggested to</Text>
{rd !=null  && (
  <Card  style={{padding:5}}>
<View style={{flexDirection:"row",marginTop:5}}>
<Avatar.Image size={40} source={{uri:rd.photo }} />
<View  style={{flexShrink:1}}>
{rd.username.length > 30?
      (
        <Text style={{fontSize:14,textTransform:"capitalize",marginLeft:10,marginTop:5}}>
          Dr. {`${rd.username.substring(0, 30)}..`}
          </Text>
      ) :
      <Text style={{fontSize:13,textTransform:"capitalize",marginLeft:10,marginTop:5}}>Dr. {rd.username}</Text>
    }

    <Text style={{fontSize:12,color:"grey",marginTop:15,textTransform:"capitalize",marginLeft:10,marginTop:5}}>{(rd.email).substring(0, 40)}</Text>
    <Text style={{fontSize:12,color:"grey",marginTop:10,textTransform:"capitalize",marginLeft:10,marginTop:5}}>{rd.phone}</Text>
    <Text style={{fontSize:12,color:"grey",marginTop:10,textTransform:"capitalize",marginLeft:10,marginTop:5}}>{rd.speciality}</Text>
    <Text style={{fontSize:12,color:"grey",marginTop:10,textTransform:"capitalize",marginLeft:10,marginTop:5}}>{rd.address.country+","+rd.address.city}</Text>
</View>

</View>
</Card>
)}
        </View>
        </DialogContent>
        </ScrollView>
      </Dialog>
      
    )

  }

  return(

<Card style={{marginTop:20,elevation:5}} >
{load  && rendercancelDialog(props.d.aid)}
{pc && renderPicker(props)}
{rnc && renderrn(props)}
{rsrc &&renderseerefer(props)}
<CardItem style={{backgroundColor:"#e8e8e8"}}>
<Left>
<Text style={{color:"#7d7d7d",fontSize:14}}>
  Status
</Text>
</Left>

<Right>
{props.d.active == "Schedule" ?(
  <Text style={{color:"green",fontSize:13,fontWeight:"bold"}}>
  {props.d.active}
</Text>
)
:null}
{props.d.active == "Process" ?(
  <Text style={{color:"red",fontSize:13,fontWeight:"bold"}}>
  {props.d.active}
</Text>
)
:null}
{props.d.active == "Cancel" && props.d.cancelby =="" ?(
  <Text style={{color:"red",fontSize:13,fontWeight:"bold"}}>
  {props.d.active}
</Text>
)
:null}
{props.d.active == "Cancel" && props.d.cancelby !="" ?(
  <View>
  <Text style={{color:"red",fontSize:12}}>
   Cancel By  Doctor
  </Text>
  <Text style={{color:"green",fontSize:13,fontWeight:"bold"}}>
   {props.d.cancelreason}
  </Text>
    </View>
)
:null}
{props.d.active == "Refer" && props.d.cancelby !="" ?(
  <View>
  <Text style={{color:"red",fontSize:12}}>
   Cancel By  Doctor
  </Text>
  <TouchableOpacity onPress={()=>{setrsrc(true);setrsr(true)}} style={{flexDirection:"row",alignItems:"center"}}>
  <AntDesign  color="green" size={13} name="form" />
  <Text style={{color:"green",fontSize:13,fontWeight:"bold",textDecorationLine:"underline",marginLeft:5}}>
   Refer Note
  </Text>
  </TouchableOpacity >

    </View>
)
:null}
</Right>
</CardItem>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: props.d.patientinfo.photo}} style={{height:70, width:70,borderRadius:35}} />
                <Body>
                {props.d.patientinfo.name.length > 20 ?
         (
         <Text  style={{textTransform:"capitalize",fontSize:15}}>Pt. {`${props.d.patientinfo.name.substring(0, 34)}..`}</Text>
         ) :
         <Text style={{textTransform:"capitalize",fontSize:15}}>Pt. {props.d.patientinfo.name}</Text>
  }

                  <Text style={{marginTop:7,color:"grey",fontSize:14}} >{props.d.email}</Text>
                </Body>
              </Left>
            </CardItem>

            <CardItem cardBody>

            <View >


<View style={{flexDirection:"row",justifyContent:"space-between"}}>


<Form  style={{padding:5,width:160,marginTop:-10}}>

<Item floatingLabel style={{height:40}} >
  <Input style={{fontSize:14,textTransform:"capitalize"}} editable={false} value={props.d.time} />
  <Label style={{fontSize:14,fontWeight:"700"}}>Time</Label>
</Item>


<Item floatingLabel style={{height:40}} >
  <Input style={{fontSize:14,textTransform:"capitalize"}} editable={false} value={props.d.fees} />
  <Label style={{fontSize:14,fontWeight:"700"}}>Fees</Label>
</Item>


<Item floatingLabel style={{height:40}} >
  <Input style={{fontSize:14,textTransform:"capitalize"}} editable={false} value={props.d.patientinfo.phone} />
  <Label style={{fontSize:14,fontWeight:"700"}}>Phone</Label>
</Item>
</Form>

<Form  style={{padding:5,width:160,marginTop:-10}}>
<Item floatingLabel style={{height:40}} >
  <Input style={{fontSize:14}} editable={false} value={props.d.duration+" min"} />
  <Label style={{fontSize:14,fontWeight:"700"}}>Duration</Label>
</Item>


<Item floatingLabel  style={{height:40}}>
  <Input style={{fontSize:14,textTransform:"capitalize"}} editable={false} value={props.d.showdate} />
  <Label style={{fontSize:14,fontWeight:"700"}}>Date</Label>
</Item>


</Form>

</View>


{props.d.doc != null  ? 
 (  
                <View style={{flexDirection:"row",alignItems:"center",marginLeft:15,marginTop:20}}>         
          {!props.d.exist 
          ? 
           <View style={{backgroundColor:"#545454",padding:5,flexDirection:"row",elevation:10,borderRadius:10,alignItems:"center",justifyContent:"center",width:124,flexWrap:"wrap"}}>
          <RenderReduceDdocname name={props.d.docname} />
          <MaterialCommunityIcons  size={23} color="white" name="file-outline"/> 
          </View>           
            :
            <View style={{backgroundColor:"#707070",padding:5,flexDirection:"row",elevation:10,borderRadius:10,alignItems:"center",justifyContent:"space-evenly",width:124,flexWrap:"wrap"}}>
            <RenderReduceDdocname name={props.d.docname} />
            <MaterialCommunityIcons  size={23} color="white" name="file-outline"/> 
            </View>
             }    
             
               
               {!props.d.exist ?  
               <TouchableOpacity style={{marginLeft:17}} onPress={()=>{checkPermission(props.d.doc,props.d.docname,props.d.aid)}}>
               <MaterialCommunityIcons size={27} color="black" name="download"/> 
               </TouchableOpacity>
               :  
               <TouchableOpacity style={{marginLeft:17}} onPress={()=>{openfile(props.d.docname)}}>
                <MaterialCommunityIcons  size={27} color="#999999" name="open-in-new"/> 
               </TouchableOpacity>}
                  
              
                </View>
                         ) : null }
</View>


            </CardItem>

              { props.d.active == "Process"
               ? 
               <CardItem>
               <Left>
               <Button 
               onPress={()=>{
               setload(true);setld(true);
              }} 
               transparent>
                  <MaterialIcons color="red" size={25} name="close" />
                  <Text>Cancel</Text>
                </Button>
              </Left>

              <Body>
                <Button 
                onPress={()=>{props.object.navigation.navigate("ViewProfile",{receiverid:props.d.patientid})}}
                transparent>
                   <AntDesign  color="#307ecc" size={25} name="profile" />
                  <Text>View Profile</Text>
                </Button>
              </Body>

              <Right>
              <Button 
                onPress={async ()=>{
                const room = await CheckndCreateRoom(props.d.patientid);
                props.object.navigation.navigate("StoChatScreen",{roomid:room.id,receiverid:room.receiverid,photo:props.d.patientinfo.photo,senderid:room.senderid,name:props.d.patientinfo.name})  
                }} 
                transparent>
                  <MaterialIcons color="#307ecc" size={25} name="chat" />
                  <Text>Chat</Text>
                </Button>
              </Right>  
         

              </CardItem> 
              : 
              <CardItem>
              <Left>
              <Button onPress={()=>{videocall(props)}}  transparent>
                        <MaterialIcons color="#307ecc" size={25} name="video-call" />
                          <Text>Video Call</Text>
                        </Button>
                        </Left> 
                        <Body>
                        <Button 
                          onPress={async ()=>{
                          const room = await CheckndCreateRoom(props.d.patientid);
                          props.object.navigation.navigate("StoChatScreen",{roomid:room.id,receiverid:room.receiverid,photo:props.d.patientinfo.photo,senderid:room.senderid,name:props.d.patientinfo.name})  
                          }} 
                          transparent>
                            <MaterialIcons color="#307ecc" size={25} name="chat" />
                            <Text>Chat</Text>
                          </Button>
                        </Body> 
                        <Right>  
                        <Button 
                          onPress={()=>{props.object.navigation.navigate("ViewProfile",{receiverid:props.d.patientid})}}
                          transparent>
                             <AntDesign  color="#307ecc" size={25} name="profile" />
                            <Text>View Profile</Text>
                          </Button>                       
                       
                          </Right> 
            </CardItem>
              }

{ props.d.active == "Process" && (
              <CardItem>
              <Left>
              <Button onPress={()=>{videocall(props)}}  transparent>
                 <MaterialIcons color="#307ecc" size={25} name="video-call" />
                 <Text>Video Call</Text>
                 </Button>
              </Left>
              <Right>
                 <Button onPress={()=>{ setpc(true);setp(true)}}  transparent>
                 <MaterialIcons color="#307ecc" size={22} name="repeat" />
                 <Text>Refer To Other Doctor</Text>
                 </Button>
              </Right>              
              </CardItem>
)}
              
               
          </Card>

)
  }


