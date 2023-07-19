const functions = require('firebase-functions');
// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();



exports.onNewmessage = functions.firestore.document("chatrooms/{uid}").onUpdate(async (change, context) => {
  console.log("room id",context.params.uid);
  const eventStatusa =  change.after.data();
  const eventStatusb =  change.before.data();

  if(eventStatusb.senderlastread != eventStatusa.senderlastread || eventStatusb.receiverlastread != eventStatusa.receiverlastread)
{ 
  console.log(" sndrntfctn before ",eventStatusb.sendernotification , "  after  " , eventStatusa.sendernotification);
  console.log(" rcvrntfctn before ",eventStatusb.receivernotification , "  after  " , eventStatusa.receivernotification);
  
  if(eventStatusa.receivernotification == true && eventStatusa.senderlastread  == false) //p
  {
    const rcvrid= eventStatusa.receiverid;
    console.log("sndr last read not true yes and  push ntfctn to  rcvr",rcvrid)
    firestore.collection("users").doc(rcvrid).get().then((doc) => {
      if (doc.exists) { 
        const token = doc.data().token; //multiple be de skte array bna k
      
        
        if(token!=null)
        {
          const payload = {
            notification: {
              title:'D Hospital',
              body: `${eventStatusa.senderinfo.name}  New Message`,
              sound: "ios_notification.mp3",
              soundName: "ios_notification.mp3",
              playSound:"true", 
              priority: 'high'
            }
          };
   
        
          admin.messaging().sendToDevice(token,payload).then(response => {
            console.log('Successfully sent message:', response);
          })
          .catch(error => {
            console.log('Error sending message:', error);
          });
         
   


        }

      }
    })

  }

  if(eventStatusa.sendernotification == true && eventStatusa.receiverlastread  == false) //d
  {
    const sndrid= eventStatusa.senderid;
    console.log("rcvr last read not true yes and  push ntfctn to  sndr",sndrid)
    firestore.collection("users").doc(sndrid).get().then((doc) => {
      if (doc.exists) { 
        const token = doc.data().token; //multiple be de skte array bna k
       
        if(token!=null)
        {

          const payload = {
            notification: {
              title:'D Hospital',
              body: `${eventStatusa.receiverinfo.name}  New Message`,
              sound: "ios_notification.mp3",
              soundName: "ios_notification.mp3",
              playSound:"true", 
              priority: 'high'
            }
          };
   

           admin.messaging().sendToDevice(token,payload)  .then(response => {
            console.log('Successfully sent message:', response);
          })
          .catch(error => {
            console.log('Error sending message:', error);
          });

     
//           const options =
//           {
// contentAvailable: true,
// vibrate: true, // (optional) default: true
// vibration:300,
//     playSound:true,      
//       vibrate:true,
//       foreground:true,
//           }
          

        }

      }
    })

  }

}else
{
  return null;
}

   });


 exports.onNewAppointment = functions.firestore.document("appointments/{uid}")
 .onUpdate(async (change, context) => {
    const rid=context.params.uid
    console.log("room id",rid);
    const esa =  change.after.data();
    const esb =  change.before.data();
    console.log("esb : ",esb.exist, ", esa : " ,esa.exist);
   
    if(esb.exist == esa.exist )
    {
  console.log("esa or esb exist same")

if( esa.active == "Process" )
{
 
  console.log("actv prcs true",esa);

firestore.collection("users").doc(esa.doctorid).get().then((doc) => {
if (doc.exists) { 
const token = doc.data().token; //multiple be de skte array bna k

if(token!=null)
{
  const payload = {
    notification: {
      title:'D Hospital',
      body: `New Appointment active\n (Pt. ${esa.patientinfo.name}) `,
      sound: "appntmnt",
      soundName: "appntmnt.mp3",
      playSound:"true", 
      priority: 'high'
    }
  };


  admin.messaging().sendToDevice(token,payload).then(response => {
    console.log('Successfully sent message:', response);
  })
  .catch(error => {
    console.log('Error sending message:', error);
  });
 
}

}
})



} //end if active isprocess


if( esa.active == "Schedule" )
{
 
  console.log("Sschdul prcs true",esa);

firestore.collection("users").doc(esa.doctorid).get().then((doc) => {
if (doc.exists) { 
const token = doc.data().token; //multiple be de skte array bna k

if(token!=null)
{
  const payload = {
    notification: {
      title:'D Hospital',
      body: `Appointment Schedule\n (Pt. ${esa.patientinfo.name}) `,
      sound: "appntmnt",
      soundName: "appntmnt.mp3",
      playSound:"true", 
      priority: 'high'
    }
  };


  admin.messaging().sendToDevice(token,payload).then(response => {
    console.log('Successfully sent message:', response);
  })
  .catch(error => {
    console.log('Error sending message:', error);
  });
 
}

}
})

firestore.collection("users").doc(esa.patientid).get().then((doc) => {
  if (doc.exists) { 
  const token = doc.data().token; //multiple be de skte array bna k
  
  if(token!=null)
  {
    const payload = {
      notification: {
        title:'D Hospital',
        body: `Appointment Schedule\n (Pt. ${esa.doctorinfo.name}) `,
        sound: "appntmnt",
        soundName: "appntmnt.mp3",
        playSound:"true", 
        priority: 'high'
      }
    };
  
  
    admin.messaging().sendToDevice(token,payload).then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
   
  }
  
  }
  })
  

} //end if Sschedule 


if( esa.active == "Cancel" && esa.cancelby  == "")
{
console.log("cancl by ptnt true",esa);

firestore.collection("users").doc(esa.doctorid).get().then((doc) => {
if (doc.exists) { 
  const token = doc.data().token; //multiple be de skte array bna k

  if(token!=null)
  {
    const payload = {
      notification: {
        title:'D Hospital',
        body: `Appointment Cancel\n (Pt. ${esa.patientinfo.name}) `,
        sound: "appntmnt",
        soundName: "appntmnt.mp3",
        playSound:"true", 
        priority: 'high'
      }
    };

  
    admin.messaging().sendToDevice(token,payload).then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
   
  }

}
})

} //end if active iscancl by pt

if( esa.active == "Cancel" && esa.cancelby  == "doctor")
{
console.log("cancl by dctr true",esa);

firestore.collection("users").doc(esa.patientid).get().then((doc) => {
if (doc.exists) { 
  const token = doc.data().token; //multiple be de skte array bna k

  if(token!=null)
  {
    const payload = {
      notification: {
        title:'D Hospital',
        body: `Appointment Cancel\n (Dr. ${esa.doctorinfo.name})\n  reason : (${esa.cancelreason})`,
        sound: "appntmnt",
        soundName: "appntmnt.mp3",
        playSound:"true", 
        priority: 'high'
      }
    };

  
    admin.messaging().sendToDevice(token,payload).then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
   
  }

}
})

} //end if active iscancl by dctr

if( esa.active == "Refer" && esa.cancelby  == "doctor")
{
console.log("Refer by dctr true",esa);

firestore.collection("users").doc(esa.patientid).get().then((doc) => {
if (doc.exists) { 
  const token = doc.data().token; //multiple be de skte array bna k

  if(token!=null)
  {
    const payload = {
      notification: {
        title:'D Hospital',
        body: `Appointment Cancel\n (Dr. ${esa.doctorinfo.name})\n  reason : (Refer other doctor)`,
        sound: "appntmnt",
        soundName: "appntmnt.mp3",
        playSound:"true", 
        priority: 'high'
      }
    };

  
    admin.messaging().sendToDevice(token,payload).then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
   
  }

}
})

} //end if active isrfr by dctr


}else{
  console.log("esa or esb exist not same")
}



})


exports.onNewOrder = functions.firestore.document("orders/{uid}")
 .onUpdate(async (change, context) => {
  const rid=context.params.uid
  console.log("room id",rid);
  const esa =  change.after.data();
  const esb =  change.before.data();
  console.log("esb : ",esb.exist, ", esa : " ,esa.exist);
 
  if(esb.exist == esa.exist )
  {
console.log("esa or esb exist same")
  
  
if( esa.orderstatus == "Pending")
{
  console.log("pndng order true",esa);

  firestore.collection("users").doc(esa.mid).get().then((doc) => {
    if (doc.exists) { 
      const token = doc.data().token; //multiple be de skte array bna k

      if(token!=null)
      {
        const payload = {
          notification: {
            title:'D Hospital',
            body: `New Order active\n (Pt. ${esa.name}) `,
            sound: "order",
            soundName: "order.mp3",
            playSound:"true", 
            priority: 'high'
          }
        };
 
      
        admin.messaging().sendToDevice(token,payload).then(response => {
          console.log('Successfully sent message:', response);
        })
        .catch(error => {
          console.log('Error sending message:', error);
        });
       
      }

    }
})

} //end if order isprocess

if( esa.orderstatus == "Cancel" && esa.cancelby  == "patient")
{
console.log("order cancl by ptnt true",esa);

firestore.collection("users").doc(esa.mid).get().then((doc) => {
if (doc.exists) { 
  const token = doc.data().token; //multiple be de skte array bna k

  if(token!=null)
  {
    const payload = {
      notification: {
        title:'D Hospital',
        body: `Order Cancel\n (Pt. ${esa.name}) `,
        sound: "order",
        soundName: "order.mp3",
        playSound:"true", 
        priority: 'high'
      }
    };

  
    admin.messaging().sendToDevice(token,payload).then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
   
  }

}
})

} //end if order iscancl by pt

if( esa.orderstatus == "Cancel"  && esa.cancelby  == "medical")
{
console.log("cancl by md  true",esa);

firestore.collection("users").doc(esa.patientid).get().then((doc) => {
if (doc.exists) { 
  const token = doc.data().token; //multiple be de skte array bna k

  if(token!=null)
  {
    const payload = {
      notification: {
        title:'D Hospital',
        body: `Oder Cancel\n (Md. ${esa.minfo.name})\n  reason : (${esa.cancelreason})`,
        sound: "order",
        soundName: "order.mp3",
        playSound:"true", 
        priority: 'high'
      }
    };

  
    admin.messaging().sendToDevice(token,payload).then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
   
  }

}
})

} //end if order iscancl by md

if( esa.orderstatus == "Deliver")
{
console.log("dlvr  by  md  true ",esa);

firestore.collection("users").doc(esa.patientid).get().then((doc) => {
if (doc.exists) { 
  const token = doc.data().token; //multiple be de skte array bna k

  if(token!=null)
  {
    const payload = {
      notification: {
        title:'D Hospital',
        body: `Oder Deliver\n (Md. ${esa.minfo.name})\n  orderid : (${esa.orderid})`,
        sound: "order",
        soundName: "order.mp3",
        playSound:"true", 
        priority: 'high'
      }
    };

  
    admin.messaging().sendToDevice(token,payload).then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
   
  }

}
})

} //end if order is dlvr by md



}
else{
  console.log("esa or esb exist not same")
}
 
})



exports.onUserStatusChanged = functions.database.ref('status/{uid}').onUpdate(async (change, context) => {
    // Get the data written to Realtime Database
    
    const userStatusFirestoreRef = firestore.doc(`users/${context.params.uid}`);
    const eventStatus = change.after.val();

    console.log("event status false",eventStatus);
    

    //functions.logger.log('eventstus val', eventStatus)
    // If the current timestamp for this data is newer than
    // the data that triggered this event, we exit this function.
    if (eventStatus.status  == "offline") {
      console.log("event status true",eventStatus);
       return userStatusFirestoreRef.update({
        status:"offline",
        lastonline:admin.firestore.FieldValue.serverTimestamp()
    });
    }

    if (eventStatus.status  == "online") {
      console.log("event status true",eventStatus);
       return userStatusFirestoreRef.update({
        status:"online",
        lastonline:""
    });
    }


    
  });

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Cloud Firestore under the path /messages/:documentId/original
// exports.addMessage = functions.https.onRequest(async (req, res) => {
//   // Grab the text parameter.
//   const original = "hello toti"
//   // Push the new message into Cloud Firestore using the Firebase Admin SDK.
//   const writeResult = await admin.firestore().collection('messages').add({original: original});
//   // Send back a message that we've succesfully written the message
//   res.json({result: `Message with ID: ${writeResult.id} added.`});
// });

// // Listens for new messages added to /messages/:documentId/original and creates an
// // uppercase version of the message to /messages/:documentId/uppercase
// exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
//     .onCreate((snap, context) => {
//       // Grab the current value of what was written to Cloud Firestore.
//       const original = snap.data().original;

//       // Access the parameter `{documentId}` with `context.params`
//       functions.logger.log('Uppercasing', context.params.documentId, original);
      
//       const uppercase = original.toUpperCase();
      
//       // You must return a Promise when performing asynchronous tasks inside a Functions such as
//       // writing to Cloud Firestore.
//       // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
//       return snap.ref.set({uppercase}, {merge: true});
//     });
