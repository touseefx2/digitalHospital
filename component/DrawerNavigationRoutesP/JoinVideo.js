import React  from 'react';
import { StyleSheet,View,Dimensions,Text,TouchableOpacity,BackHandler,AppState} from "react-native";
import {Avatar} from 'react-native-paper';
import SoundPlayer from 'react-native-sound-player'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import  MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals
} from 'react-native-webrtc';


const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

 export default class JoinVideo extends React.Component  {


  constructor(props) {
    super(props);  
    this.state =
    {
      appState: AppState.currentState,
      did:auth().currentUser.uid,
      ofrid:null,
      localStream:null,
      remoteStream:null,
      cachedLocalPC:null,
      isFront:true,
      offer:null,
      isMuted:false,
      isCamoff:false,
      isrMuted:false,
      rend:false,
      isrCamoff:false,
      end:false,
      sound:true,
      d:null,   //ptntdata
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  onBackPress(id) {
  const {cachedLocalPC,localStream} = this.state;
  this.setState({end:true})
  if(this.timerInterval) {
    clearInterval(this.timerInterval);
    }
    SoundPlayer.stop('rush', 'mp3')
  if (cachedLocalPC) {
    cachedLocalPC.removeStream(localStream);
    cachedLocalPC.close();
  }
  const roomRef =  firestore().collection('videocallrooms').doc(id);
  roomRef.collection('callerCandidates').get().then(val => {
   if(val.size>0){
    val.forEach(e=> {
      e.ref.delete();
    });
   }
   roomRef.delete().then(()=>{this.props.navigation.goBack(null)})
})
console.log("end stream or then end compmnnt by end call buton")

}

  startLocalStream = async () => {
    const {isFront,did} = this.state;
    const facing = isFront ? 'front' : 'environment';
    const devices = await mediaDevices.enumerateDevices();
    const videoSourceId = devices.find(device => device.kind === 'videoinput' && device.facing === facing);
    const facingMode = isFront ? 'front' : 'environment';
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          frameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints).catch((e)=>{console.log("newstream error : ",e)})
    this.setState({localStream:newStream})
  }

   joinCall = async id => {
    const {localStream,remoteStream} = this.state;
    const roomRef =  firestore().collection('videocallrooms').doc(id);
    const callerCandidatesCollection =  roomRef.collection('callerCandidates');
    const roomSnapshot = await roomRef.get();

    if (!roomSnapshot.exists) return
    const localPC = new RTCPeerConnection(configuration);
    localPC.addStream(localStream);

    localPC.onicecandidate = e => {
      if (!e.candidate) {
        console.log('Got final candidate!');
        return;
      }
      callerCandidatesCollection.add(e.candidate.toJSON());
    };

    localPC.onaddstream = e => {
      if (e.stream && remoteStream !== e.stream) {
        console.log('RemotePC received the stream join', e.stream);
        this.setState({remoteStream:e.stream})
      }
    };

    const offer = roomSnapshot.data().offer;
    await localPC.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await localPC.createAnswer();
    await localPC.setLocalDescription(answer);

    const roomWithAnswer = { answer };
    await roomRef.update(roomWithAnswer).then(()=>{this.setState({sound:false})})

    roomRef.collection('callerCandidates').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          try {
            let data = change.doc.data();
            await localPC.addIceCandidate(new RTCIceCandidate(data));
          } catch (error) {
            console.log("onaddicecandidate error : ",error)
          }
        }
      });
    });

    this.setState({cachedLocalPC:localPC})
  };

  switchCamera = () => {
    const {localStream,isFront} = this.state;
    localStream.getVideoTracks().forEach(track => {
      track._switchCamera();
      this.setState({isFront:!isFront})
    });
    }
  
    switchVideo= () => {
      const {localStream,did} = this.state;
      localStream.getVideoTracks().forEach(track => {
       track.enabled= !track._enabled;  //track.muted= !track._enabled;
       const roomRef =  firestore().collection('videocallrooms').doc(did);
      roomRef.update({
        answercamoff:!track._enabled,
      })
        this.setState({isCamoff:!track._enabled})
      });
      }
  
  
    toggleMute = () => {
      const {remoteStream,localStream,did} = this.state;
      if (!remoteStream) {
        return;
      }
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
        const roomRef =  firestore().collection('videocallrooms').doc(did);
        roomRef.update({
          answermicmute:!track.enabled
        })
        this.setState({isMuted:!track.enabled})
      });
    }

  

  componentDidUpdate = (prevProps, prevState) => {
  const {sound,ofrid} = this.state;
  if(prevState.sound == true && sound == false  )
  {
    if(this.timerInterval) {
      clearInterval(this.timerInterval);
      }
      SoundPlayer.stop('rush', 'mp3')
  }
  if(prevState.ofrid == null && ofrid != null)
  {
    const roomRef2 =  firestore().collection('users').doc(ofrid);
    this.unsubscribe =  roomRef2.onSnapshot((d)=>{
    if(d.exists){
      this.setState({d:d.data()})
    }
    })
  }
  
}

playSong() {
  try {
    SoundPlayer.playSoundFile('rush', 'mp3')
  } catch (e) {
    console.log('cannot play the song file', e)
  }
}


handleAppStateChange = (nextAppState) => {
  const {cachedLocalPC,localStream,did} = this.state;
  this.setState({ appState: nextAppState }); 
  if (nextAppState === 'inactive') {
    this.setState({end:true})
    if(this.timerInterval) {
      clearInterval(this.timerInterval);
      }
      SoundPlayer.stop('rush', 'mp3')
    if (cachedLocalPC) {
      cachedLocalPC.removeStream(localStream);
      cachedLocalPC.close();
    }
    const roomRef =  firestore().collection('videocallrooms').doc(did);
    roomRef.collection('callerCandidates').get().then(val => {
     if(val.size>0){
      val.forEach(e=> {
        e.ref.delete();
      });
     }
     roomRef.delete().then(()=>{this.props.navigation.goBack(null)})
  })
    console.log("end stream or then end compmnnt by backrng modeend call buton")
    

    console.log("joinVideod is in inactive Mode.")
  }

  if (nextAppState === 'background') {
    this.setState({end:true})
    if(this.timerInterval) {
      clearInterval(this.timerInterval);
      }
      SoundPlayer.stop('rush', 'mp3')
    if (cachedLocalPC) {
      cachedLocalPC.removeStream(localStream);
      cachedLocalPC.close();
    }
    const roomRef =  firestore().collection('videocallrooms').doc(did);
    roomRef.collection('callerCandidates').get().then(val => {
     if(val.size>0){
      val.forEach(e=> {
        e.ref.delete();
      });
     }
     roomRef.delete().then(()=>{this.props.navigation.goBack(null)})
  })
    console.log("end stream or then end compmnnt by backrng modeend call buton")
    

    console.log("joinvdeo p is in Background Mode. App")
  }
};

  componentDidMount () {
  const {did} = this.state;
  this.startLocalStream();
  AppState.addEventListener('change', this.handleAppStateChange);
  BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  setTimeout(() => {
    const roomRef =  firestore().collection('videocallrooms').doc(did);
    this.unsubscriberr =  roomRef.onSnapshot((d)=>{
      if(!d.exists){
        this.setState({rend:true})
       console.log("dctr ne reject/end kr de call");
       if(this.timerInterval) {
        clearInterval(this.timerInterval);
        }
        SoundPlayer.stop('rush', 'mp3')
        setTimeout(() => {
          this.props.navigation.goBack(null)
        }, 1500);
      
      }else
      {
        this.setState({
          isrCamoff:d.data().offercamoff,
          isrMuted:d.data().offermicmute,
        })
      }
     })
  },4000);
this.playSong();
this.timerInterval = setInterval(() => {this.playSong()},12000)
   const roomRef =  firestore().collection('videocallrooms').doc(auth().currentUser.uid);
    roomRef.get().then(async (d)=>{
    if(d.exists){
      this.setState({ofrid:d.data().offeruid})}
    })
}

  handleBackButtonClick() {
    console.log("onback cal")  
    return true;
 }

  componentWillUnmount(){
if(this.unsubscriberr) {
  this.unsubscriberr();
  }
  if(this.unsubscribe) {
    this.unsubscribe();
    }
  BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  AppState.removeEventListener('change', this.handleAppStateChange);
  if(this.timerInterval) {
    clearInterval(this.timerInterval);
    }
  }

  renderBottom(){
    const {localStream,did,remoteStream,isMuted,isCamoff} = this.state;
    return(
      <View style={{position:"absolute",bottom:0,width:"100%",marginBottom:0,alignSelf:"center"}}>
     
     
     <View style={{justifyContent:"space-evenly",alignItems:"center",flexDirection:"row"}}>
     
     {(localStream && !remoteStream) ?(
       <TouchableOpacity onPress={() =>{this.joinCall(did)}} style={{backgroundColor:"green",justifyContent:"center",alignItems:"center",width:50,height:50,borderRadius:25}}>
       <MaterialIcons color="white"  size={25} name="call-end" />
       </TouchableOpacity>  
     ):null}
     
     {localStream ?(
      <TouchableOpacity onPress={() =>{this.onBackPress(did)}} style={{backgroundColor:"red",justifyContent:"center",alignItems:"center",width:50,height:50,borderRadius:25}}>
     <MaterialIcons color="white"  size={25} name="call-end" />
     </TouchableOpacity>
     ):null}
     
     </View>
     
   
     {!isCamoff && isMuted && <MaterialIcons style={{position:"absolute",right:0,opacity:0.7,marginRight:30,backgroundColor:"black"}} color="white"   size={25} name="mic-off" /> }
     {isCamoff && !isMuted && <MaterialIcons style={{position:"absolute",right:0,opacity:0.7,marginRight:30,backgroundColor:"black"}} color="white"   size={25} name="videocam-off" /> }
     {isCamoff && isMuted && (
       <View style={{position:"absolute",right:0,marginRight:30,opacity:0.7,backgroundColor:"black"}}>
        <MaterialIcons  color="white"   size={25} name="videocam-off" /> 
        <MaterialIcons  style={{marginTop:17}} color="white"  size={25} name="mic-off" />
       </View>
     )}

     <View  style={{backgroundColor:"black",marginTop:50,borderWidth:0.3,borderColor:"silver",height:50,padding:5,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
     {localStream && (<MaterialCommunityIcons color="white" onPress={()=>{this.switchCamera()}} size={30} name="camera-party-mode" />)} 
     {(localStream && !isCamoff && remoteStream) ?(
       <MaterialIcons  onPress={()=>{this.switchVideo()}} color="white" size={30} name="videocam-off" />
      ):null }
      {(localStream && isCamoff && remoteStream) ?(
                   <View  style={{backgroundColor:"#636363",width:40,height:40,borderRadius:20,alignItems:"center",justifyContent:"center"}}>
            <MaterialIcons color="white" onPress={()=>{this.switchVideo()}} size={25} name="videocam-off" />
                   </View>
      ):null }
      {(localStream && !isMuted && remoteStream) ?(
       <MaterialIcons color="white" onPress={()=>{this.toggleMute()}} size={30} name="mic-off" />
      ):null }
      {(localStream && isMuted && remoteStream) ?(
            <View  style={{backgroundColor:"#636363",width:40,height:40,borderRadius:20,alignItems:"center",justifyContent:"center"}}>
            <MaterialIcons color="white" onPress={()=>{this.toggleMute()}} size={25} name="mic-off" />
            </View>
      ):null }
       {(localStream && !remoteStream) ?(
      <MaterialIcons color="silver"  size={30} name="videocam-off" />
      ):null }
         {(localStream && !remoteStream) ?(
    <MaterialIcons color="silver"  size={30} name="mic-off" />
      ):null }
     </View>
      
     </View>
       
    )
  }

render(){
  const {localStream,remoteStream,isFront,d,isrCamoff,isrMuted,end,rend} = this.state;
    let t = ""; let name =""; let photo="";
  if(d!=null){
    t = d.type;
    if(t == "doctor"){t="Dr. "}else 
    if(t == "patient"){t="Pt. "}else{t="Md. "}
     name =d.username;
     photo=d.photo;
  }
return(  
<View style={{flex:1,backgroundColor:"black"}} >

          {localStream && !remoteStream  && (
          <RTCView   style={styles.ols} mirror={isFront ? true : false} objectFit="cover" streamURL={localStream && localStream.toURL()} />
          )}

           {localStream && remoteStream && (
          <RTCView style={{
            width:Dimensions.get('window').width,
            height:Dimensions.get('window').height,
           opacity: isrCamoff ? 0.5 : null,
          }}  objectFit="cover"  streamURL={remoteStream && remoteStream.toURL()} />
          )}     

   { remoteStream  && (
 <RTCView  style={styles.lnrs}  zOrder={1} mirror={isFront ? true : false}  streamURL={localStream && localStream.toURL()} />   
         )} 

      {(localStream && !remoteStream) ? 
      (
        <View  style={{ marginTop:"10%",alignItems:"center",justifyContent:"center",position:"absolute",alignSelf:"center",marginLeft:10,marginRight:10}}>
        <Avatar.Image  style={{borderWidth:0.5,borderColor:"white"}}  size={100} source={{uri:photo}}/>
        <Text style={{fontSize:18,color:"white",marginTop:25,fontWeight:"bold"}}>{t+(name).substr(0,30)+" .."}</Text>
        <Text style={{fontSize:16,color:"white",marginTop:20}}>D_hospital video call</Text>
       </View>
      ) : null} 
      {end || rend ?(
      <View  style={{ marginTop:"50%",alignItems:"center",justifyContent:"center",position:"absolute",alignSelf:"center",marginLeft:10,marginRight:10}}>
      <Text  style={{fontSize:20,color:"red",fontWeight:"bold"}}>End</Text>
      </View>
      ):null}

      {(localStream && remoteStream && isrMuted && !isrCamoff) ? (
      <View  style={{ marginTop:"45%",alignItems:"center",justifyContent:"center",position:"absolute",alignSelf:"center",marginLeft:10,marginRight:10}}>
      <View style={{backgroundColor:"black",opacity:0.9,alignItems:"center",padding:3,borderRadius:5}}>
      <MaterialIcons  color="white"  size={15} name="mic-off" />
      <Text style={{fontSize:14,color:"white"}}>{name} muted this call</Text> 
      </View>
      </View>
      ):null}

    {(localStream && remoteStream && isrCamoff && !isrMuted) ? (
      <View  style={{ marginTop:"45%",alignItems:"center",justifyContent:"center",position:"absolute",alignSelf:"center",marginLeft:10,marginRight:10}}>
      <View style={{backgroundColor:"black",opacity:0.9,alignItems:"center",padding:3,borderRadius:5}}>
      <MaterialIcons  color="white"  size={15} name="videocam-off"/>
      <Text style={{fontSize:14,color:"white"}}>{name} turned camera off</Text> 
      </View>
      </View>
      ):null}

{(localStream && remoteStream && isrCamoff && isrMuted) ? (
      <View  style={{ marginTop:"45%",alignItems:"center",justifyContent:"center",position:"absolute",alignSelf:"center",marginLeft:10,marginRight:10}}>
      <View style={{backgroundColor:"black",opacity:0.9,alignItems:"center",padding:3,borderRadius:5}}>
      <View style={{flexDirection:"row",alignSelf:"center",justifyContent:"space-evenly"}}>
      <MaterialIcons  color="white"  size={15} name="videocam-off"/>
      <MaterialIcons  color="white"  size={15} name="mic-off"/>
      </View>
      <Text style={{fontSize:14,color:"white"}}>{name} turned camera and microphone off</Text> 
      </View>
      </View>
      ):null}

      {this.renderBottom()}
  </View>
)
     }

  };

  
  const styles = StyleSheet.create({
   ols: {
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height,
    },  
    lnrs:{
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height-510,
      position:"absolute",
       marginTop:Dimensions.get('window').height-205,
       marginLeft:"50%",
       marginRight:5,
    } ,
  });
  
