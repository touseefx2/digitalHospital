import firestore from '@react-native-firebase/firestore';

export const action_getMessages=(roomid)=>
{
return async (dispacth)=> 
    {
//dflt order ascndng hta ha or jo last msg ho ga wo sb se nechy ana chaie
firestore().collection("chatrooms").doc(roomid).collection("messages").orderBy("createdAt").onSnapshot((doc)=>{
    const messages=[];
    doc.forEach(doc => {
        messages.id = doc.id;
        const obj = {...doc.data(), id: doc.id};
        messages.push(obj);   
    });
 
    //  set last msg in cahat room
    if(messages.id)
    {
        firestore().collection("chatrooms").doc(roomid).update({
            lastMessage:messages[messages.length-1].text ||  messages[messages.length-1].photo || messages[messages.length-1].file,
        }); 
           
    }
 

    dispacth({
        type:"CHAT_UPDATE_MESSAGES",
        payload:messages
    })
})
  
    }
}

export const action_setMessages=()=>
{
return async (dispacth)=> 
    {

    dispacth({
        type:"SET_CHAT_MESSAGES",
        payload:[]
    })
  
    }
}