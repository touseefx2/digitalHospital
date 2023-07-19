import React  from 'react';
import { StyleSheet,View,ScrollView} from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ChatCards from "./ChatsCards"; //if sndr is dctr in room

 class  Chats extends React.Component  {
  constructor(props) {
    super(props);
    this.state={
    chatUsers:[],
    }
  }

  componentDidMount (){
    try{
      const currentuserid =  auth().currentUser.uid;
      const dbref = firestore().collection("chatrooms")
      this.unsubscribee = dbref.where(`user.${currentuserid}`,'==' ,true).onSnapshot( (docs)=>{
        this.setState({chatUsers:[]})
        if(docs.size>0)
        {
          const chaters=[];
          const room={};
        docs.forEach((d) => {
 
          if(d.data().senderid != currentuserid && d.data().lastMessage != "" )
          {
           this.unsubscribeee = firestore().collection("users").doc(d.data().senderid).onSnapshot((u)=>{
             if(u.exists)
             {
              firestore().collection("chatrooms").doc(d.id).update({
                senderinfo:{
                  name:u.data().username,
                  photo:u.data().photo,
                  status:u.data().status,
                  type:u.data().type,
                  lastonline:u.data().lastonline,
                }
              }) 
             }
           })

            room.id = d.id;
            const obj =  {senderinfo:d.data().senderinfo,senderid:d.data().senderid, roomid:d.id,lastMessage:d.data().lastMessage,lastMessageCreatedAt:d.data().lastMessageCreatedAt,read:d.data().senderlastread,receiverid:d.data().receiverid}
            chaters.push(obj);
          }

          if(d.data().senderid == currentuserid && d.data().lastMessage != "")
          {
            this.setState({sndrisdctr:true})
  
            this.unsubscribe = firestore().collection("users").doc(d.data().receiverid).onSnapshot((u)=>{
              if(u.exists)
              {
                firestore().collection("chatrooms").doc(d.id).update({
                  receiverinfo:{
                    name:u.data().username,
                    photo:u.data().photo,
                    type:u.data().type,
                    status:u.data().status,
                    lastonline:u.data().lastonline,
                  }
                }) 
              }
               })

           room.id=d.id; 
           const obj = {receiverinfo:d.data().receiverinfo,lastMessageCreatedAt:d.data().lastMessageCreatedAt,receiverid:d.data().receiverid,senderid:d.data().senderid,roomid:d.id,lastMessage:d.data().lastMessage,read:d.data().receiverlastread}
           chaters.push(obj);      
          }

    });
    
    if(room.id)
    {
      this.setState({chatUsers:chaters})
    }
    else
    {
      this.setState({chatUsers:[]})
    }
        }else
        {
          this.setState({chatUsers:[]})
        }     
  })
  
    }//endtry
    catch(e){
    console.log("catch error from chatD --> ",JSON.stringify(e))
    }

}


componentWillUnmount()
  {
    if(this.unsubscribe) {
      this.unsubscribe();
      }
      if(this.unsubscribee) {
        this.unsubscribee();
        }
        if(this.unsubscribeee) {
          this.unsubscribee();
          }
  }

render(){
  if(this.state.chatUsers.length>0)
  {
      this.item = this.state.chatUsers.sort((a, b) =>{ return b.lastMessageCreatedAt - a.lastMessageCreatedAt }).map( e =>{
        let  pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
         '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
         '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
         '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
         '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
         '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
         var lastMessage = e.lastMessage || ""
         if(pattern.test(lastMessage) == true)
         {
           lastMessage="photo/file"
         }

         if (e.senderid  == auth().currentUser.uid)
         {
          return( <ChatCards object={this.props} type={e.receiverinfo.type} receiverid={e.receiverid} senderid={e.senderid} roomid={e.roomid} name={e.receiverinfo.name} photo={e.receiverinfo.photo} status={e.receiverinfo.status} lastonline={e.receiverinfo.lastonline} lastMessage={lastMessage} read={e.read}  /> ) 
         }else{
          return( <ChatCards object={this.props} type={e.senderinfo.type} senderid={e.senderid} receiverid={e.receiverid} roomid={e.roomid} name={e.senderinfo.name} photo={e.senderinfo.photo} status={e.senderinfo.status} lastonline={e.senderinfo.lastonline} lastMessage={lastMessage} read={e.read}   /> )       
         }
   
        
   });
   
    }else{
    this.item = null;
  }
  
return(
      <View style={styles.container}>  
        <ScrollView> 
          {this.item}
        </ScrollView>

      </View>
)
     }

  };

  
const styles= StyleSheet.create({

  container:
  {
    flex:1,
    backgroundColor:"white"
  }
});


export default Chats;