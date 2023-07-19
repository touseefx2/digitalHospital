import React from 'react'
import {PermissionsAndroid,AppState,Image}  from 'react-native'
import storage from '@react-native-firebase/storage';
import {Spinner} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput,View,Dimensions,ToastAndroid,Keyboard,TouchableOpacity} from "react-native";
import { Button,Text,Avatar} from "react-native-paper";
import Dialog, { DialogContent,DialogFooter,DialogButton,FadeAnimation,DialogTitle} from 'react-native-popup-dialog';
import RNFetchBlob from 'rn-fetch-blob'
import ImagePicker from 'react-native-image-picker';
import {connect} from "react-redux"
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {action_getMessages,action_setMessages} from "../Redux/Actions/chatAction"
import { ScrollView} from 'react-native-gesture-handler';
import moment from "moment";
import DocumentPicker from 'react-native-document-picker';

 class StoChatScreen extends React.Component {

  static navigationOptions  = ({ navigation }) => {
    return {
      tabBarVisible: false,
      headerRight:<Avatar.Image  size={37} source={{uri:navigation.getParam("photo")  }} /> ,  
      title:navigation.getParam("name"),
            headerStyle: {
              backgroundColor: "#307ecc",
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              color:"white",
              textTransform:"capitalize"
            }
          }
    };
  
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      load:false,
      text:"",
      photo:"",
      file:"",
      dwnld:false,
      path:"",
      filename:"",
      room:{},
      frndphoto:this.props.navigation.getParam("photo"),
      //for upldng prgs dialog
     ld:false,       // for vsbl 
     picload:false,  //render
    //fo clck camera btn dialog option
     mv:false, //for dialog viible
     c:false, //chk camera btn pres or not if true then mv true and show dialog and mv false is invsble dialog render
     imagefolder:`Photos/Doctor/chatPictures/${this.props.myuser.uid}/`,
     docfolder:`Documents/Doctor/chatDoc/${this.props.myuser.uid}/`,
    };
  }

  handleAppStateChange = (nextAppState) => {
 
    this.setState({ appState: nextAppState });
    const currentUser = auth().currentUser.uid
    const roomid =  this.props.navigation.getParam("roomid")
    const sndrid = this.props.navigation.getParam("senderid") ;
    if (nextAppState === 'background') {
      if(this.props.chatmessages.length>1)
      {
        if(sndrid != currentUser )
        {
          firestore().collection("chatrooms").doc(roomid).update({
            receivernotification:true,
          })
        }else{
          firestore().collection("chatrooms").doc(roomid).update({
            sendernotification:true
           })
      }  
     
      }
      // Do something here on app background.
      console.log("App is in Background Mode.")
    }
  
    if (nextAppState === 'active') {
      if(this.props.chatmessages.length>1)
      {
        if(sndrid != currentUser )
        {
          firestore().collection("chatrooms").doc(roomid).update({
            receivernotification:false,
          })
        }else{
          firestore().collection("chatrooms").doc(roomid).update({
            sendernotification:false
           })
        }
      } 
    
      // Do something here on app active foreground mode.
      console.log("App is in Active Foreground Mode.")
    }
  
    if (nextAppState === 'inactive') {
      if(this.props.chatmessages.length>1)
      {
        if(sndrid != currentUser )
        {
          firestore().collection("chatrooms").doc(roomid).update({
            receivernotification:false,
          })
        }else{
          firestore().collection("chatrooms").doc(roomid).update({
            sendernotification:false
           })
        }
      } 
      if(this.props.chatmessages.length<1)
      {
        firestore().collection("chatrooms").doc(roomid).delete().then().catch((e=>console.log(e)))
      }
     
      // Do something here on app inactive mode.
      console.log("App is in inactive Mode.")
    }
  };

 getRoominfo = async () =>{
const roomid =  this.props.navigation.getParam("roomid")
 await firestore().collection("chatrooms").doc(roomid).get().then((res)=>{
const room = {id:res.id,...res.data()};
this.setState({room});
 })

  }

  componentDidMount()
  {
    AppState.addEventListener('change', this.handleAppStateChange);
    const currentUser = auth().currentUser.uid
    const roomid =  this.props.navigation.getParam("roomid")
    const sndrid = this.props.navigation.getParam("senderid") ;
     this.getRoominfo();
     this.props.setmessages();
     this.unsubscribee = this.props.getmessages(roomid);
    if(sndrid != currentUser )
    {
      firestore().collection("chatrooms").doc(roomid).update({
        receivernotification:false,
        senderlastread:true,
      })
    }else{ 
      firestore().collection("chatrooms").doc(roomid).update({
        receiverlastread:true,
        sendernotification:false
                         })
    }

  }

  componentWillUnmount()
  {
    const currentUser = auth().currentUser.uid
    const sndrid = this.props.navigation.getParam("senderid") ;
    const roomid =  this.props.navigation.getParam("roomid")
    AppState.removeEventListener('change', this.handleAppStateChange);
    if(this.unsubscribee) {
      this.unsubscribee();
      }
    if(this.props.chatmessages.length<1)
    {
firestore().collection("chatrooms").doc(roomid).delete().then().catch((e=>console.log(e)))
    }else{
      
      if(sndrid != currentUser )
      {
      firestore().collection("chatrooms").doc(roomid).update({
        receivernotification:true,
        senderlastread:true,
      })
      }else{
        firestore().collection("chatrooms").doc(roomid).update({
          sendernotification:true,
          receiverlastread:true,
                           })
      }
     
      
    }

       
  }

 
  onSendMessagetodb(text,photo,file,filename) {
    const {room}=  this.state;
    const sndrid = this.props.navigation.getParam("senderid") ;
    const currentUser = auth().currentUser.uid
    const message = {text,createdAt:Date.now(),photo,file,filename,userid:auth().currentUser.uid,onload:""}
    var dbref = firestore().collection("chatrooms").doc(room.id) 
    dbref.collection("messages").add(message).then(()=>{
      dbref.update({
        lastMessageCreatedAt:Date.now()
      })
     })
    if(sndrid != currentUser )
    {
      dbref.update({
        receiverlastread:false,
      }) 
    }else{
      dbref.update({
        senderlastread:false
      })
    }
   
   } 

   onload(id){
    const {room}=  this.state;
    var dbref = firestore().collection("chatrooms").doc(room.id) 
    dbref.collection("messages").doc(id).update({
      onload:"loaded"
    })
   }

  onloadstrt(id){
    const {room}=  this.state;
    var dbref = firestore().collection("chatrooms").doc(room.id) 
    dbref.collection("messages").doc(id).update({
      onload:"loading"
    })
  }

  uploadcameraimage = async () =>
{
  this.setState({mv:false})
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  ImagePicker.launchCamera(options , (response) => {
    console.log('Response = ', response);
    if (response.didCancel) {
      ToastAndroid.showWithGravity(
       "cancel",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM);
    } else if (response.error) {
      ToastAndroid.showWithGravity(
        response.error.toString(),
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM);
      console.log('ImagePicker Error: ', response.error);
    } else {
      console.log(response)
      const URI =  response.uri ;
      this.setState({
      picload:true,ld:true
      });
      this.uploadcameraimagefirebase(URI,response.fileName);
    }
  });
}

uploadgalleryimage = async () =>
{
  this.setState({mv:false})
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  ImagePicker.launchImageLibrary(options , (response) => {
    console.log('Response = ', response);
    if (response.didCancel) {
      ToastAndroid.showWithGravity(
       "cancel",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM);
    } else if (response.error) {
      ToastAndroid.showWithGravity(
        response.error.toString(),
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM);
      console.log('ImagePicker Error: ', response.error);
    } else {
      const URI =  response.uri ;
      console.log('response',URI);
      this.setState({
      picload:true,ld:true
      });
     this.uploadgalleryimagefirebase(URI,response.fileName);
    }
  });
}

checkDocumentPermission = async () => {
  if (Platform.OS === 'ios') {
    this.uploaddocument();
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
        this.uploaddocument();
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

uploaddocument =async () => {
          //Opening Document Picker to select one file
  try {
    const res = await DocumentPicker.pick({
      //Provide which type of file you want user to pick
      type: [DocumentPicker.types.allFiles]
    });
    //Printing the log realted to the file
    console.log('res docmnt : ' + JSON.stringify(res));
    const stat = await RNFetchBlob.fs.stat(res.uri) || null
    this.uploaddocumentfirebase(stat.path,res.name);
    this.setState({
      picload:true,ld:true
      });
    //Setting the state to show single file attributes
  } catch (err) {
    //Handling any exception (If any)
    if (DocumentPicker.isCancel(err)) {
      //If user canceled the document selection
      alert('Canceled');
    } else {
      //For Unknown Error
      alert("Please donot select from recent/download tab")
     console.log('Unknown Error: ' + JSON.stringify(err));
      throw err;
    }
  }

};

uploadcameraimagefirebase = async (uri,imagename) =>
{
  const {imagefolder} = this.state;
    storage().ref(`${imagefolder}${imagename}`)
    .putFile(uri)
    .then((snapshot) => {
      //You can check the image is now uploaded in the storage bucket
      console.log(snapshot);
      console.log(`${imagename} has been successfully uploaded.`);
      this.getimagefirebase(imagename);
    }).catch((e) => {console.log('uploading image error => ', e)});
  }

  
  uploadgalleryimagefirebase = async (uri,imagename) =>
{
  const {imagefolder} = this.state;
  const stat = await RNFetchBlob.fs.stat(uri) || null //ye camere pic uri me kam ni kre ga
  console.log(stat);
    storage().ref(`${imagefolder}${imagename}`)
    .putFile(stat.path)
    .then((snapshot) => {
      //You can check the image is now uploaded in the storage bucket
      console.log(snapshot);
      console.log(`${imagename} has been successfully uploaded.`);
      this.getimagefirebase(imagename);
    }).catch((e) => {console.log('uploading image error => ', e)});
  }

  uploaddocumentfirebase = async (uri,docname) =>
  {
    try{
      console.log("upld dcmnt firebase ", uri)
      const {docfolder} = this.state;
        storage().ref(`${docfolder}${docname}`)
        .putFile(uri)
        .then((snapshot) => {
          //You can check the image is now uploaded in the storage bucket
          console.log(snapshot);
          console.log(`${docname} has been successfully uploaded.`);
          this.getdocfirebase(docname);
        }).catch((e) => {console.log('uploading image error => ', e)});
    }catch (e){
   console.log(e)
    }
    
    }

  getimagefirebase = async (imagename) =>
{
  const { imagefolder} = this.state;
   await storage().ref(`${imagefolder}${imagename}`)
    .getDownloadURL()
    .then((url) => {
      //from url you can fetched the uploaded image easily
      this.setState({ld:false,text:"",file:"",photo:url}) 
     this.onSendMessagetodb(this.state.text,this.state.photo,this.state.file,this.state.filename);
    })
    .catch((e) => console.log('getting downloadURL of image error => ', e));
  }

  getdocfirebase = async (docname) =>
  {
    const {docfolder} = this.state;
     await storage().ref(`${docfolder}${docname}`)
      .getDownloadURL()
      .then((url) => {
        //from url you can fetched the uploaded image easily
        this.setState({ld:false,text:"",file:url,photo:"",filename:docname}) 
       this.onSendMessagetodb(this.state.text,this.state.photo,this.state.file,this.state.filename);
      })
      .catch((e) => console.log('getting downloadURL of image error => ', e));
    }

   checkPermission = async (uri) => {
      if (Platform.OS === 'ios') {
        this.downloadImage(uri);
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
            this.downloadImage(uri);
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
  
    DOCdownloadcheckPermission = async (uri,name) => {
      if (Platform.OS === 'ios') {
        this.downloadDoc(uri,name);
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
            this.downloadDoc(uri,name);
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

  downloadDoc (uri,docname)  
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
    })
}


    downloadImage = (uri) => {
      this.setState({dwnld:false})
      //Main function to download the image
      let date = new Date(); //To add the time suffix in filename
      //Image URL which we want to download
      let image_URL =uri;
      //Getting the extention of the file
      let ext = this.getExtention(image_URL);
      var oext = ext.split("?")
      ext = "."+oext[0]
      ToastAndroid.showWithGravity(
        "Download Start",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER)
     //Get config and fs from RNFetchBlob
      //config: To pass the downloading related options
      //fs: To get the directory path in which we want our image to download
      const { config, fs } = RNFetchBlob;
      let PictureDir = fs.dirs.DownloadDir;
      console.log("picdir   " ,PictureDir)
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          //Related to the Android only
          useDownloadManager: true,
          mediaScannable : true,
          notification: true,
          path:  PictureDir+"/"+"x2"+"/"+ Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
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
            ToastAndroid.BOTTOM),
            this.setState({dwnld:true,path:res.data})
        })

      } 
  

     getExtention = (filename) => {
      //To get the file extension
      //return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
      var ext = /^.+\.([^.]+)$/.exec(filename);
      return ext == null ? "" : ext[1];
    };

  renderpickerdialog()
{
  return(  
  <Dialog
    visible={this.state.mv}
    style={{padding:10}}
    onHardwareBackPress={() => true}
    footer={
      <DialogFooter>
        <DialogButton
          text="Cancel"
          textStyle={{color:"#307ecc"}}
          onPress={() => {this.setState({mv:false})}}
        />
      </DialogFooter>
    }
    onTouchOutside={() => {this.setState({mv: false });
    }}
    dialogTitle={<DialogTitle title="Upload From" />}
    dialogAnimation={new FadeAnimation({
      initialValue: 0, // optional
      animationDuration: 150, // optional
      useNativeDriver: true, // optional
    })}
  >
    <DialogContent>
     <View style={{marginTop:23,justifyContent:"space-between"}}>
     <TouchableOpacity onPress={()=>{this.uploadcameraimage()}}>
<Text style={{fontSize:19}}>CAMERA{'\n'}{'\n'}</Text>
</TouchableOpacity>
<TouchableOpacity onPress={()=>{this.uploadgalleryimage()}}>
<Text style={{fontSize:19}}>GALLERY</Text>
</TouchableOpacity>
</View>
    </DialogContent>
  </Dialog>
  )

}

renderpicload()
{
  return(
  <Dialog
    visible={this.state.ld}
    // onTouchOutside={() => {
    //   this.setState({ld: false });
    // }}
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

  render() {
    const {picload,c} = this.state;
      if(this.props.chatmessages)
      {
        this.item = this.props.chatmessages.map((msg)=>{
          const iscurrentusermessage  = msg.userid  == auth().currentUser.uid;
         if(iscurrentusermessage)
         {
            return(
              <View style={{flexDirection:"row",alignSelf:"flex-end",margin:7,alignItems:"center"}}> 
  
            {msg.text != "" ?  (
              <View style={{backgroundColor:"#307ecc",margin:10,padding:10,borderRadius:20,flexShrink: 1}}>
              <Text  style={{color:"white",fontSize:20}}>{msg.text}</Text> 
              <Text  style={{color:"white",fontSize:10}}>{moment(msg.createdAt).format("LLL")}</Text>
               </View>            
          ) : null }
            {msg.photo != "" ?  ( 
              <View style={{margin:10,flexShrink: 1}}>
              <Image onError={(e)=>{console.log("img err ", e)}} onLoadStart={()=>{this.onloadstrt(msg.id)}}  onLoad={()=>{this.onload(msg.id)}}  style={{width: 180, height: 180}} source={{uri:msg.photo}}/>
              {msg.onload == "loading" ?( <Spinner style={{position:"absolute",marginTop:40,alignSelf:"center"}} size="large" color="#307ecc"/>) : null}
              <Text  style={{fontSize:10,color:"#307ecc"}}>{moment(msg.createdAt).format("LLL")}</Text>
               </View> 
          ) : null }
            {msg.file != "" ?  (             
                <View style={{backgroundColor:"#307ecc",padding:10,borderRadius:17,margin:10,alignItems:"center",flexShrink: 1}}>
              <Text style={{color:"yellow"}}>{msg.filename}  <MaterialCommunityIcons size={25} color="yellow" name="file-outline"/> </Text>
              <Text  style={{color:"white",fontSize:10}}>{moment(msg.createdAt).format("LLL")}</Text>
               </View>
          ) : null }
<Avatar.Image style={{backgroundColor:null}} size={33} source={{uri: this.props.myuser.photo }} />
          
           </View>
                 )
          }
          else
          {
            return(
              <View style={{flexDirection:"row",alignSelf:"flex-start",margin:7,alignItems:"center"}}> 
  <Avatar.Image style={{backgroundColor:null}} size={33} source={{uri: this.state.frndphoto }} />
  {msg.text != "" ?  (
              <View style={{backgroundColor:"#e0e0e0",margin:10,padding:10,borderRadius:20,flexShrink: 1}}>
              <Text  style={{fontSize:20}}>{msg.text}</Text> 
              <Text  style={{fontSize:10}}>{moment(msg.createdAt).format("LLL")}</Text>
               </View>            
          ) : null }
            {msg.photo != "" ?  ( 
              <View style={{flexDirection:"row",alignItems:"center",flexShrink: 1}}>                   
              <View style={{margin:10}}>
              <Image onError={(e)=>{console.log("img err ", e)}} onLoadStart={()=>{this.onloadstrt(msg.id)}}   onLoad={()=>{this.onload(msg.id)}} style={{width: 180, height: 180}} source={{uri:msg.photo}}/>
              {msg.onload == "loading" ?( <Spinner style={{position:"absolute",marginTop:40,alignSelf:"center"}} size="large" color="#307ecc"/>) : null}
              <Text  style={{fontSize:10,color:"#307ecc"}}>{moment(msg.createdAt).format("LLL")}</Text>
               </View> 
             <MaterialCommunityIcons size={30} color="#999999" name="download" onPress={()=>{this.checkPermission(msg.photo)}}/>   
               </View> 
          ) : null }
            {msg.file != "" ?  (   
              <View style={{flexDirection:"row",alignItems:"center",flexShrink: 1}}>           
                <View style={{backgroundColor:"silver",padding:10,borderRadius:17,margin:10,alignItems:"center",flexShrink: 1}}>
              <Text>{msg.filename}  <MaterialCommunityIcons size={25} name="file-outline"/> </Text>
              <Text  style={{color:"blue",fontSize:10}}>{moment(msg.createdAt).format("LLL")}</Text>
               </View>
               <TouchableOpacity onPress={()=>{this.DOCdownloadcheckPermission(msg.file,msg.filename)}}>
               <MaterialCommunityIcons size={30} color="#999999" name="download" />
               </TouchableOpacity>
               </View>
          ) : null }  
           </View>
                 )
  
          }      
    
        })
      }
  
    return (
      <View style={{flex:1}}>     
        {c && this.renderpickerdialog()} 
        {picload && this.renderpicload()}   
        <View style={{flex: 2}}>
          <ScrollView showsVerticalScrollIndicator={true}  ref="scrollView"
          onContentSizeChange={(width,height) => this.refs.scrollView.scrollTo({y:height})} >
            {this.item} 
            </ScrollView> 
         </View>


        <View style={{alignItems:"center",justifyContent:"center" ,flex:.2,borderWidth:0.5,borderStyle:"dotted",borderColor:"#307ecc",flexDirection:"row",width: Dimensions.get('window').width,}}>
       <MaterialCommunityIcons size={25} name="camera" onPress={()=>this.setState({mv:true,c:true})} />
       <MaterialCommunityIcons size={20} name="link-variant" onPress={()=>this.checkDocumentPermission()} />
      <TextInput style={{flex: 1, flexWrap: 'wrap',fontSize:17}} value={this.state.text}  placeholder="Type message here..." onChangeText={(text)=>this.setState({text})}/>
      <Button style={{backgroundColor:null}}  onPress={()=>{
          if(!this.state.text=="")
          {
          this.onSendMessagetodb(this.state.text,this.state.photo,this.state.file),
          Keyboard.dismiss();
          this.setState({text:""})
           }
          else
          {
            ToastAndroid.showWithGravity(
            "Please Enter message",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM)
          }
        }
        }>
      <Text style={{color:"#307ecc",fontSize:16,fontWeight:"bold"}}>Send</Text>
      </Button>
      </View>

      </View> 

  
    );
  }
}



const  mapStateToProps = (state) => 
{
  return{
 chatmessages:state.chat.messages,
 myuser:state.userd,
        }
}

const  mapDispatchToProps = (dispatch) => { 
  
  return{
    getmessages:(roomid)=>{ dispatch(action_getMessages(roomid))},  
    setmessages:()=>{ dispatch(action_setMessages())}, 
        }
}

export default connect(mapStateToProps,mapDispatchToProps)(StoChatScreen);