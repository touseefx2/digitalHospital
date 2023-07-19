import React  from 'react';
import { StyleSheet,View,ToastAndroid} from "react-native";
import auth from '@react-native-firebase/auth';
import {connect} from "react-redux"
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {Card,Title,Button,Avatar,Text} from 'react-native-paper';
import { Item, Input, Label } from 'native-base';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

 class  HomeScreenA extends React.Component  { 
  constructor(props) {
    super(props);
    this.state = {
      ev:null,
      refdctr:null,
      sr:false,
      cr:false,
      ar:false,

      tr:"",
      tb:"",
      abt:""
    }
  }
  

componentDidMount()
{
 auth().onAuthStateChanged((user)=> {   
    if (user) {




      this.unsubscribee  = firestore().collection("users").doc(auth().currentUser.uid).onSnapshot((d)=>{
        if(d.exists)
        {
          this.unsubscribe  =  firestore().collection("users").doc(d.data().refdoctorid).onSnapshot((d)=>{
          if(d.exists)
          {
            this.setState({refdctr:d.data()})
          }
          })
    
          this.unsubscribeee  =  firestore().collection("ai").doc(d.data().refdoctorid).onSnapshot((d)=>{
            if(d.exists)
            {
              this.setState({tr:d.data().totalRoom,tb:d.data().totalbed,abt:d.data().about})
            }
            })
    
         if(d.data().doctorrequest == false)
         {
           this.setState({sr:true,ar:false,cr:false})
         }else if(d.data().doctorrequest == true)
         {
          this.setState({ar:true,cr:false,sr:false})
         }else if(d.data().doctorrequest == "cancle")
         {
          this.setState({cr:true,ar:false,sr:false})
         }
        }
       }) 









    console.log(user);
    this.setState({ev:user.emailVerified})
    } else { 
      const rdbref = database().ref('status/'+this.props.myuser.uid);
      const dbref =   firestore().collection("users").doc(this.props.myuser.uid);
      rdbref.set({
        status:"offline",
      })
      dbref.update({
        lastonline:firestore.FieldValue.serverTimestamp(),
        status:"Offline"
      })
      // fcmService.unRegister();
      // notificationManager.unRegister();
  console.log("mdcl se no user so nvgt login");
  this.props.navigation.navigate("LoginScreen");

}
  })
  
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
        this.unsubscribeee();
        }
}

cancl()
{
  firestore().collection("users").doc(auth().currentUser.uid).update({
    doctorrequest:"cancle"
  }).then(
    ToastAndroid.showWithGravity(
      "Cancle",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM)
  )
}

againrqst()
{
  firestore().collection("users").doc(auth().currentUser.uid).update({
    doctorrequest:false
  }).then(
    ToastAndroid.showWithGravity(
      "Request send",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM)
  )
}

save =  () =>
{
const {refdctr,tr,tb,abt} =  this.state;
if(refdctr)
{
  const dbref =firestore().collection("ai").doc(refdctr.uid);
  dbref.get().then((d)=>{
   if(d.exists)
   {
    dbref.update({
      totalRoom:tr,
      totalbed:tb,
      about:abt
    }).then(
       ToastAndroid.showWithGravity(
      "Save",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM),
    ).catch((e)=>{
      console.log(e)
    })
   }else
   {
    dbref.set({
      totalRoom:tr,
      totalbed:tb,
      about:abt
    }).
    then(
       ToastAndroid.showWithGravity(
      "Save",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM),
    ).catch((e)=>{
      console.log(e)
    })
   }

  })

}

}

renderacptrqst()
{
  const {tr,tb,abt}  = this.state;
return(
  <View style={{margin:20,padding:10,marginTop:60}}>

             <Item style={{marginTop:20}} stackedLabel>
              <Label>Total Room</Label>
              <Input keyboardType="numeric" value={tr}   onChangeText={(txt)=>this.setState({tr:txt})} />
            </Item>

            <Item style={{marginTop:20}} stackedLabel>
              <Label>Total Beds</Label>
              <Input keyboardType="numeric"  value={tb}   onChangeText={(txt)=>this.setState({tb:txt})} />
            </Item>

            <Item style={{marginTop:20}} stackedLabel>
              <Label>About Room and Bed Status</Label>
              <Input  value={abt}   onChangeText={(txt)=>this.setState({abt:txt})}
              multiline={true}
              numberOfLines={0}
              scrollEnabled={true}
              onContentSizeChange={(e) => {
               const numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
              }}  />
            </Item>

          
 <TouchableOpacity onPress={()=>this.save()}   style={{marginTop:70}}>
 <View style={{width:80,height:40,backgroundColor:"#00BFFF",borderRadius:10,alignSelf:"center",elevation:5,padding:9}} >  
   <Text style={{color:"white",alignSelf:"center",fontSize:18}}>Save</Text>
 </View>
 </TouchableOpacity>


  </View>
)
}



renderrequestprgrs()
{
  const {refdctr}  = this.state;
  if(refdctr)
  {
    return(
      <View>
          <Card style={{elevation:2,borderRadius:10,margin:10,padding:15,borderWidth:0.3,borderColor:"blue"}}>

<View style={{flexDirection:"row",justifyContent:"space-between"}}>
<Avatar.Image size={50} source={{uri: refdctr.photo }} />
    <Card.Content style={{justifyContent:"center",flex:1}}>
    <Title style={{fontSize:15}}>{refdctr.username}</Title>  
    </Card.Content>
<View>
  <Text style={{fontSize:14}}>Request Progress..</Text>
  <Button  onPress={()=>{this.cancl()}}  style={{marginTop:10,backgroundColor:"#ff4747",borderColor:"green",borderWidth:1,borderStyle:"dotted",borderRadius:10,width:80,height:30}}>
  <Text style={{color:"white",fontSize:10,fontWeight:"bold"}}>Cancle</Text>
</Button>
  </View>
</View>




     </Card>
      </View>
    )
  }
}

rendercanclerequest()
{
  const {refdctr}  = this.state;
  if(refdctr)
  {
    return(
      <View>
          <Card style={{elevation:2,borderRadius:10,margin:10,padding:15,borderWidth:0.3,borderColor:"blue"}}>
      <View style={{flexDirection:"row"}}> 
  <Avatar.Image size={50} source={{uri: refdctr.photo }} />
    <Card.Content style={{justifyContent:"center",alignItems:"center"}}>
    <Title style={{fontSize:17}}>{refdctr.username}</Title>  
    </Card.Content>
</View>
<View style={{position:"absolute",right:0}} >
  <Button  onPress={()=>{this.againrqst()}}  style={{marginTop:10,backgroundColor:"#5ce655",borderColor:"green",borderWidth:1,borderStyle:"dotted",borderRadius:10,width:90}}>
  <Text style={{fontSize:10,fontWeight:"bold"}}>Request</Text>
</Button>
  </View>

     </Card>
      </View>
    )
  }
}

sendEmailVerificationLink()
{
auth().currentUser.sendEmailVerification().then(()=>{
          ToastAndroid.showWithGravity(
          "Email verifiaction link is \n send to your email :"+auth().currentUser.email+"\n Please verify email !",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM)
}).catch((e)=>{alert(e)})
}

renderEmailVerified()
{
  return(
    <View style={{flexDirection:"row", backgroundColor: '#000',padding:5,justifyContent:"space-between"}}>
    <Text style={{ fontSize:17, color: '#fff' }}>Please verify your email....</Text>
    <TouchableOpacity  onPress={()=>this.sendEmailVerificationLink()}>
   <Text style={{color:"#1ce8b8",fontSize:17,fontWeight:'bold'}}>Verify</Text>
   </TouchableOpacity >
    </View>
  )
}


render(){
  const {sr,cr,ar,ev} = this.state;
return(
  
      <View style={styles.container}>
         {!ev && this.renderEmailVerified()}
        <ScrollView>
        {sr && this.renderrequestprgrs()}
        {cr && this.rendercanclerequest()}
        {ar && this.renderacptrqst()}
        </ScrollView>
      </View>
)
     }

  };

  

const styles= StyleSheet.create({

  container:
  {
    flex:1,
  }
});


const  mapStateToProps = (state) => 
{
  return{
 myuser:state.usera,
        }
}



export default connect(mapStateToProps)(HomeScreenA); 