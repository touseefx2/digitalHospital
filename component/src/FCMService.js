import {Platform} from "react-native"
import messaging from '@react-native-firebase/messaging';


// DO NOT USE .configure() INSIDE A COMPONENT, EVEN App
class FCMService
{

    register = (onRegister,onforegroundNotification,onbackgrndNotification,onquitNotification) =>  //mthd
    {
        this.checkPermission(onRegister);
        this.createNotificationListeners(onRegister,onforegroundNotification,onbackgrndNotification,onquitNotification);
    }

    registerAppwithFCM = async () =>
    {
        if(Platform.OS == "ios")
        {
        await messaging().registerDeviceForRemoteMessages();
        await messaging().setAutoInitEnabled(true);
        }
        
    }

    checkPermission =  (onRegister) =>
    {
        messaging().hasPermission().then((enabled) =>{
        if(enabled){this.getToken(onRegister)}else{this.requestPermission(onRegister)} 
        }).catch(e=>{console.log("[FCMService]rgste prmsn rjctd : ",e)})
    }

    getToken =  (onRegister) =>
    {
        messaging().getToken().then((fcmToken) =>{
        if(fcmToken){onRegister(fcmToken)}else{console.log("[FCMService] user doesnot have a device token")}
        }).catch(e=>{console.log("[FCMService] gettoken rejected ",e)})
    }

    requestPermission  =  (onRegister) =>
    {
    messaging.requestPermission().then(() =>{
        this.getToken(onRegister)
        }).catch(e=>{console.log("[FCMService] request permission rejected ",e)})
    }

    deleteToken  = (onRegister) =>
    {
        console.log("[FCMService] delete token");
        messaging().deleteToken().catch(e=>{console.log("[FCMService] delete token error ",e)})
    }

    createNotificationListeners = (onRegister,onforegroundNotification,onbqNotification,onqstNotification) =>
    {

        
      //  when app is running ,but in the bckgrnd
        messaging().onNotificationOpenedApp(remoteMessage=>{
           
           
            console.log("[FCMService] onNotfctnOpndApp notfctn caused app to open (backgrnd state) ") 
            if(remoteMessage)
            {
                   const   t =remoteMessage.notification 
                    onbqNotification(t)
                // }
               
            }
        })

        //when app is open from a quit state
        messaging().getInitialNotification().then(remoteMessage=>{
            console.log("[FCMService] getInitlntfctn ntfctn cause app to open(quitstae) : ") 
            
            if(remoteMessage )
            {      
                const   t =remoteMessage.notification    
                 onqstNotification(t)          
            }
        })

        //foregroung state messages
        this.messageListener =  messaging().onMessage(async(remoteMessage)=>{
            console.log("[FCMService] Aa new FCM message Arrived (frgrnd state) : ");
            if(remoteMessage)
            {
                let notification = null;
                if(Platform.OS == "ios"){notification=remoteMessage.data.notification}
                else{notification=remoteMessage.notification}
                onforegroundNotification(notification)
            }
        })

        //triggered when have new token
        messaging().onTokenRefresh((fcmToken)=>{
            // console.log("[FCMService] new token refresh : ",fcmToken);
            onRegister(fcmToken)
        })


    }

    unRegister = ()=>{
        this.messageListener()
    }


}

export const fcmService = new FCMService();