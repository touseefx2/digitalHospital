import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "react-native-push-notification";
import {Platform} from "react-native"


// DO NOT USE .configure() INSIDE A COMPONENT, EVEN App
class NotificationManager
{

    configure = (onOpenNotification) =>  //mthd
    {
         PushNotification.configure({
           //1- (optional) Called when Token is generated (iOS and Android)
            onRegister: function (token) {
            // console.log("[NotificationManager] onRegister TOKEN:", token);
                                         },

                                
            //2/ (required) Called when a remote is received or opened, or local notification is opened
            onNotification: function (notification) { //jb ntfctn a jae to us pe click kr k action lena k ly
              //  console.log("[NotificationManager] onNOTIFICATION:", notification);      
                 if(!notification.data)
                 {
                     return 
                    }
                  
                if(notification.userInteraction)
                {
                    onOpenNotification(Platform.OS == "ios" ?  notification.data.item : notification);
                }
             
                 // process the notification
                // only call calback if not from foreground
                  // (required) Called when a remote is received or opened, or local notification is opened
                if(Platform.OS==="ios")
                { 
                    notification.finish(PushNotificationIOS.FetchResult.NoData)
                } 
                
                                                     },   

                                                     
                // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
                onAction: function (notification) {
                    onAction(notification)
                    console.log("ACTION:", notification.action);
                    console.log("NOTIFICATION:", notification);

                    // process the action
                },

                // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
                onRegistrationError: function(err) {
                    console.error(err.message, err);
                },
                permissions: {
                    alert: true,
                    badge: true,
                    sound: true,
                },
                popInitialNotification: true,
                requestPermissions: true,
                playSound : true,
                soundName: "ios_notification.mp3" ||'default',
                                    })
    } //end cnfgr mth

    _buildAndroidNotification = (id,title,message,data={},options={}) =>
    {
        return{
  id:id,
  autoCancel: true, // (optional) default: true
  largeIcon: options.largeIcon || "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
  smallIcon: options.smallIcon || "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
  bigText:  message || "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
  subText:  title || "This is a subText", // (optional) default: none
  vibrate: options.vibrate || true, // (optional) default: true
  vibration: options.vibration || 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
  priority: options.priority || "high", // (optional) set notification priority, default: high
  importance: options.importance || "high" ,
  data: data,
  playSound : options.playSound || true,
  soundName: "ios_notification.mp3"|| 'default',
  foreground:true
 // actions: '["Yes", "No"]'
        }
    }

    showNotification  = (id,title,message,data={},options={}) =>
    {
        PushNotification.localNotification({
            //only andrd
            ...this._buildAndroidNotification(id,title,message,options,data),
            //ios and android prpties
            date: new Date(Date.now() + 60 * 1000), // in 60 secs
            title: title || "",
            message : message || "",
            allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
            userInteraction:true,   //if the ntfctn was opend by the user  from ntfctn area or not
           // visibility: "public", // (optional) set notification visibility, default: private
           playSound : options.playSound || true,
           soundName: "ios_notification.mp3" || 'default',
           
          });
    }

  
    cancelAllNotification   = () =>
    {
if(Platform.OS === "ios")
{
    PushNotificationIOS.removeAllDeliveredNotifications();
}else{
    PushNotification.cancelAllLocalNotifications()
}
    }

    removeDeliveredNotificationsByID  = (notfctnid) =>
    {
        console.log("[NotificationManager] rmvdlvrntfctnbyid :", notfctnid);
        PushNotification.cancelLocalNotifications({id:`${notfctnid}`})
    }

    

    popInitiallNotification   = (onInitialNotification) =>
    {
        PushNotification.popInitialNotification((notification) => {
            onInitialNotification(notification)    
          });
    }

      


    unRegister   = () =>
    {
    PushNotification.unregister()
    }



}

export const notificationManager = new NotificationManager();