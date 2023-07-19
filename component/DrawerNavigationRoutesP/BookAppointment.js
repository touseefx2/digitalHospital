import React, { Component } from 'react';
import {View,Text,TouchableOpacity,ScrollView,ToastAndroid,PermissionsAndroid,Dimensions,Image} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import {Card, CardItem,Item, Input, Form ,Label ,Container,Content,Body,Left,Right,Radio} from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar} from 'react-native-paper';
import {connect} from "react-redux"
import Dialog, { DialogContent,FadeAnimation,DialogFooter,DialogButton,SlideAnimation,DialogTitle} from 'react-native-popup-dialog';
import firestore from '@react-native-firebase/firestore';
import {Spinner } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob'
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
 
class BookAppointment extends Component {

  static navigationOptions  = ({ navigation }) => {
    return { 
      title:"Book Appointment",
            headerStyle: {
              backgroundColor: "#307ecc",
            },
            headerTintColor: '#fff',
          }
    };
  

  constructor(props) {
    super(props);
    this.state =
    {
      dctr:null,
     slots: [],
     available:true,
     time:null,
     date:null,
     showdate:null,
     isDateTimePickerVisible: true,
     document:null,
     dcname:"",
     catg:props.navigation.getParam("catg"),

    rslot:false,  //render
    cnfrm:false, cld:false,  //render cnfrm appnmtmnt
    es:true,

    docfolder:`Documents/Patients/MyReportsDoc/${auth().currentUser.uid}`,
    categoryarray:[],
    
    scat:null,
    reportsarray:[],
    er:true,
    //for upldng doc prgs dialog
    ld:false,       // for vsbl 
    picload:false,  //render

    //for selct upload option dialg
      mv:false,
      cmv:false,

    //for render view report
    vr:false,
    vrc:false,

    //for render view lab reports
    vlr:false,
    vlrc:false,

    //slcrpt dcmnt ha to upload ni krna firestrg me kyn k phly ka ha so ckh vrbl
    srd:false,
    is:""
    }
  }
 
  compare(ad) {
    var cd = moment(new Date()).format("D/M/Y")
    var CurrentDate = moment(cd,"DD/MM/YYYY");
    if (CurrentDate > ad) {
      return "Greater"
     } else if (CurrentDate < ad){
      return "Smaller"
     }else{
      return "Equal"
     }
}

GlobaldynamicheckAppntmnt()
{
 firestore().collection("appointments").get().then((docs)=>{
      if(docs.size>0)
      {
        docs.forEach((data) => {
          const  d=data.data();
          const aid=data.id;

      const dbupdate = firestore().collection("appointments").doc(aid);            

          if(d.active  == "Process")
          {
            var  AppnmntDate =moment(d.date,"DD/MM/YYYY");
            const CurrentDate = this.compare(AppnmntDate)
           
            if(CurrentDate == "Greater")
            {
              dbupdate.update({
                active:"Schedule",createat:Date.now()
              })
            }

            if(CurrentDate == "Equal")
            {
              var ct= moment(new Date()).format('h:mma')
              var currentTime = moment(ct, 'h:mma');
              var slotTime = moment(d.time, 'h:mma');
              if(currentTime.isAfter(slotTime) || currentTime.isSame(slotTime))
              {
                dbupdate.update({
                  active:"Schedule",createat:Date.now()
                })      
              }
            }
          }
          
})

}
})
}

componentDidMount(){
  const {catg}= this.state
  var c =catg.split("Specialist");
  var catgry = c[0].trim();
  this.setState({catg:catgry});
  this.checkReports();
  this.GlobaldynamicheckAppntmnt()
  this.timerInterval = setInterval(() => {this.GlobaldynamicheckAppntmnt()},10000)
}

componentDidUpdate(prevProps, prevState) {
  const {scat}  = this.state;
  console.log(prevState.scat,": ", scat)
  if(prevState.scat == null && scat!=null)
  {
  const currentUser  = auth().currentUser.uid
  const ref = firestore().collection("users").doc(currentUser).collection("MyReports").orderBy("createdat");
  ref.get().then((doc)=>{
    if(doc.size>0)
    {
      const arr=[];
      let i = 1;
      doc.forEach(dd => {
          if(scat  == dd.data().category)
          {
             const select = false;
             const aid = dd.id;
             const d =dd.data()
            const obj = {d,select,aid,count:i++}
            arr.push(obj)
          } 
    }); 
       this.setState({reportsarray:arr,er:false}) 
    }else
    {
      this.setState({reportsarray:[],er:true})
    }

  })
}

}

select(id,d,c)
{
const nda = this.state.reportsarray.map(obj => 
obj.aid === id ? { aid: id, d: d , select:true,count:c} : { aid: obj.aid, d: obj.d , select:false,count:obj.count});
this.setState({ reportsarray : nda ,document:d.document,dcname:d.documentname});
}

checkReports()
{
  const currentUser  = auth().currentUser.uid
  const ref = firestore().collection("users").doc(currentUser).collection("MyReports")
  ref.orderBy("createdat").get().then((doc)=>{
    if(doc.size>0)
    {
      const orgnlcatg=[];
      const catg=[];

      doc.forEach(d => {
          const cat = d.data().category;
          catg.push(cat)
    });
      
    catg.forEach(function (value, index, arr){
      let first_index = arr.indexOf(value);
      let last_index = arr.lastIndexOf(value);
       if(first_index !== last_index){ //chck dplct value
        const index = catg.indexOf(value)
        if (index > -1) { catg.splice(index, 1) } 
       }
  });

 
// total krna duplct nklne k bad (apun ka logic)
     catg.map((a)=>{
      let i = 0;
      doc.forEach(d => {
        if( a   == d.data().category) 
        {
            i++;
        }   
  });
       const obj= {total:i,cat:a}
       orgnlcatg.push(obj)
     })
        this.setState({categoryarray:orgnlcatg})
    }else
    {
      this.setState({categoryarray:[]})
    }
  })
}

componentWillUnmount()
{
  if(this.unsubscribee) {
    this.unsubscribee();
    }
    if(this.unsubscribe) {
      this.unsubscribe();
      }
      if(this.unsubscribeee) {
        this.unsubscribeee();
        }
        if(this.timerInterval) {
          clearInterval(this.timerInterval);
          }
}

checkduplicatetimeslotactive(sd,t,dcname)
{
  const {document,srd}= this.state 
  const dctrId = this.props.navigation.getParam("receiverid")
  const currentuserid =  auth().currentUser.uid;
  this.setState({picload:true,ld:true})
  firestore().collection("appointments").where(`patientid` , '==' , currentuserid).get().then((docs)=>{
    if(docs.size>0)
    {
     var x = 'ok';
      docs.forEach((data) => {
        const  d=data.data();            
        if(d.active  == "Process" && sd ==  d.date  && d.doctorid != dctrId )
        {
          const st =t;                 //slct time
          const dt = d.time;           //actv prcs appntmnt time

        if(st == dt)
        {  
          x = "anotherDoctorSame"
        }
        else{
          var start = moment(st, "HH:mm");
          var end = moment(dt, "HH:mm");
          var minutes = Math.abs( end.diff(start, 'minutes'));
          console.log("minutes ", minutes)
          if(minutes < 30)
          {
            x = "anotherDoctorless30"
          }
        }
       
         } 
        else if(d.active  == "Process" && d.doctorid == dctrId  ){
          x = "sameDoctorSame"
        }   
                           })

                           console.log("x ",x)
     if(x=="anotherDoctorSame")
     {
      this.setState({ld:false})
       alert("Sorry\n  Same time_slot of another doctor already in process ");
     }else if(x=="sameDoctorSame")
     {
      this.setState({ld:false})
      alert("Sorry\n  This doctor appointment already in process");
     }
     else if(x=="anotherDoctorless30")
     {
      this.setState({ld:false})
      alert("Sorry\n  Overlap time_slot of another doctor already in process\n   Slot difference must be greater than 30  minutes");
     }
     else if(x=="ok")
     {

       if(dcname!="" && document !=null && !srd ) 
       {this.uploaddocumentfirebase(sd,t,document,dcname)}
       else{this.bookconfirm(sd,t) }
    
      }
}else
{
  if(dcname!="" && document !=null && !srd ) 
       {this.uploaddocumentfirebase(sd,t,document,dcname)}
       else{ this.bookconfirm(sd,t)}
}



})
}

  
hideDatePicker = () => {
  this.setState({isDateTimePickerVisible:false});
}

checkAvailablity(date)
{
 const dctrId = this.props.navigation.getParam("receiverid")
 this.unsubscribeee =  firestore().collection('users').doc(dctrId).onSnapshot((d) =>{
  const available = d.data().available;
  if(available)
  { 
    const daydate = new Date(date).toDateString();
     var c  = false
    available.forEach(d => {
      if(daydate.substring(0, 3) ==  d )
      {
         const sd =new Date(date).toDateString();
         const ddate   =   moment(date).format("D/M/Y");
         this.setState({date:ddate,showdate:sd})
         this.checkslots(ddate);
         c  = true
      }
    });
   if(c== false)
   {
   this.setState({available:false,es:false})
   }
  }
})
}

checkslots(date)
{
    const dctrId = this.props.navigation.getParam("receiverid")
    this.unsubscribe =  firestore().collection('users').doc(dctrId).onSnapshot((d) =>{
    const slots = d.data().slots;
     if(slots!= "")
     {
      this.unsubscribee = firestore().collection("appointments").where(`doctorid` , '==' , dctrId).onSnapshot((doc)=>{
        var rslots =  slots.slice(); //copy slot array in rsots
        if(doc)
        {
          doc.forEach(snapshot => { 
            if(snapshot.data().active == "Process" && date ==  snapshot.data().date )
            {
              const t  = snapshot.data().time;
              const index = rslots.indexOf(t)
              if (index > -1) { rslots.splice(index, 1) }           
            }
            });


     //then check current date is select or not
     const CurrentDate   =   moment(new Date()).format("D/M/Y");
     const SelectDate   =  date;
     if(CurrentDate  == SelectDate)
     {
      var ctslots =  rslots.slice();  // agr ye na kren to slote map k sath slice hta jae ganot true
      var ct= moment(new Date()).format('h:mma')
      ctslots.map((s)=>{
       var currentTime = moment(ct, 'h:mma');
       var slotTime = moment(s, 'h:mma');
       if(currentTime.isAfter(slotTime) || currentTime.isSame(slotTime) )
       {
        const index = rslots.indexOf(s)
        if (index > -1){ rslots.splice(index, 1) }           
       }
      })
     }
   
      
           this.setState({slots:rslots,rslot:true,dctr:d.data(),es:false})
           
        }else{
          this.setState({slots:rslots,dctr:d.data(),rslot:true,es:false})
        }
      })

      }else{
        this.setState({rslot:true,es:false})
      }
  })

}

handleConfirm = (date) => {
 
  if(date)
  {
    this.hideDatePicker();
    this.checkAvailablity(date)
   
  }
  else
  {
    alert('Please Select date fro booking');
  }
};

bookconfirm(date,time)
{
  const {dctr,document,dcname,showdate,catg} = this.state;
  const ref = firestore().collection('appointments');
    ref.add({
      patientid:auth().currentUser.uid,
      doctorid:this.props.navigation.getParam("receiverid"),
      ptaddress:this.props.myuser.address,
      draddress:dctr.address,
      speciality:dctr.speciality,
      cancelby:"",
      cancelreason:"",
      refdid:"",
      dremail:dctr.email,
      ptemail:this.props.myuser.email,
      doctorinfo:{
        name:dctr.username,
        photo:dctr.photo,      
        phone:dctr.phone,      
      },
      patientinfo:{
        name:this.props.myuser.username,
        photo:this.props.myuser.photo,
        phone:this.props.myuser.phone,
      },
      duration:dctr.duration,
      fees:dctr.fees,
      time:time,
      date:date,
      showdate:showdate,
      document:document,
      documentname:dcname,
      active:"Process",
      exist:false,
      createdat:Date.now()
    }).then( (d)=>{
      ref.doc(d.id).update({ createdat:Date.now()});
       if(document!=null && dcname !=""){


        const currentUser  = auth().currentUser.uid;
        const report = {
          title:"*Appointment doc",
          document:document,
          documentname:dcname,
          category:catg,    
          exist:false, 
          createdat:new Date()
        };
        const ref2 = firestore().collection("users").doc(currentUser).collection("MyReports");
        const ref3 = firestore().collection("users").doc(currentUser).collection("MyReports").where(`category` , '==' ,`${catg}`);
        ref3.get().then((doc)=>{
        if(doc.size>0)
        {
           let c = false;
         doc.forEach(d => {
           if(catg == d.data().category && dcname == d.data().documentname )
            {c =true}
         });
      
         if(!c){
          ref2.add(report).then(
            this.setState({document:null,dcname:"",ld:false,cld:false}),
            ToastAndroid.showWithGravity(
              "Confirm",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM),
            setTimeout(() => {
              this.props.navigation.goBack()
            },500),
              ).catch(e=>console.log("cnfrm app erre , ",e))
         }else{
           console.log("sorry this dcmnt name is already in lab report category");
           this.setState({document:null,dcname:"",ld:false,cld:false});
           ToastAndroid.showWithGravity(
             "Confirm",
             ToastAndroid.SHORT,
             ToastAndroid.BOTTOM);
           setTimeout(() => {
             this.props.navigation.goBack()
           },500);
              }
  
        }else{
          ref2.add(report).then(
          this.setState({document:null,dcname:"",ld:false,cld:false}),
          ToastAndroid.showWithGravity(
            "Confirm",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM),
          setTimeout(() => {
            this.props.navigation.goBack()
          },500),
                  ).catch(e=>console.log("cnfrm app erre , ",e))
       
            }
        })
  

       }
     else{
      this.setState({document:null,dcname:"",ld:false,cld:false});
      ToastAndroid.showWithGravity(
        "Confirm",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM);
      setTimeout(() => {
        this.props.navigation.goBack()
      },500);
     }
      
    }).catch(e=>console.log("cnfrm app erre , ",e))

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
this.setState({dcname:res.name,document:stat.path,srd:false});
//Setting the state to show single file attributes
} catch (err) {
//Handling any exception (If any)
if (DocumentPicker.isCancel(err)) {
//If user canceled the document selection
alert('Canceled');
} else {
//For Unknown Error
alert("Please donot select from Recent/Download tab")
console.log('Unknown Error: ' + JSON.stringify(err));
throw err;
}
}

};

uploaddocumentfirebase = async (sd,t,uri,docname) =>
{
  try{
    console.log("upld dcmnt firebase ", uri)
    const {docfolder,catg} = this.state;
      storage().ref(`${docfolder}/${catg}/${docname}`)
      .putFile(uri)
      .then((snapshot) => {
        //You can check the image is now uploaded in the storage bucket
        console.log(snapshot);
        console.log(`${docname} has been successfully uploaded.`);
        this.getdocfirebase(sd,t,docname);
      }).catch((e) => {console.log('uuploading dcmnt firebase error => ', e)});
  }catch (e){
 console.log('uploading dcmnt firebase error => ',e)
  }
  
  }

  getdocfirebase = async (sd,t,docname) =>
  {
    const {docfolder,catg} = this.state;
     await storage().ref(`${docfolder}/${catg}/${docname}`)
      .getDownloadURL()
      .then((url) => {
        //from url you can fetched the uploaded image easily
        this.setState({document:url,dcname:docname}) 
        this.bookconfirm(sd,t)
      })
      .catch((e) => console.log('getting downloadURL of image error => ', e));
    }

    renderDocload()
{
  return(
  <Dialog
    visible={this.state.ld}
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

renderpickerdialog()
{
  return(  
  <Dialog
    visible={this.state.mv} 
    footer={
      <DialogFooter>
        <DialogButton
          text="Cancel"
          textStyle={{color:"#307ecc"}}
          onPress={() => {this.setState({mv:false})}}
        />
      </DialogFooter>
    }
    onHardwareBackPress={() => true}
    dialogAnimation={new FadeAnimation({
      initialValue: 0, // optional
      animationDuration: 150, // optional
      useNativeDriver: true, // optional
    })}
  >
    <DialogContent style={{padding:10}}>
     <View style={{marginTop:23,justifyContent:"space-between"}}>
  <TouchableOpacity onPress={()=>{this.setState({mv:false,vr:true,vrc:true})}}>
<Text style={{fontSize:17}}>Select From Lab Reports{'\n'}{'\n'}</Text>
</TouchableOpacity>
<TouchableOpacity onPress={()=>{this.setState({mv:false});this.checkDocumentPermission()}}>
<Text style={{fontSize:17}}>Upload Reports</Text>
</TouchableOpacity>
</View>
    </DialogContent>
  </Dialog>
  )

}

renderLabreports(){
  const {categoryarray,vr}= this.state;
  if(categoryarray.length > 0 )
  {
    this.item = categoryarray.map((d)=>{
      console.log(d)
       return( 
        <TouchableOpacity  onPress={()=>{this.setState({vlr:true,vlrc:true,scat:d.cat})}} >
        <Card style={{elevation:5,marginTop:30,alignItems:"center",backgroundColor:d.cat == "Prescriptions" ? "green" : "#307ecc",padding:10,width:135}}>
           <View style={{flexDirection:"row",justifyContent:"space-around"}}>
          
          <View style={{width:125,flexShrink:1}}> 
          {d.cat == "Prescriptions" ?(
            <Text  style={{color:"white",fontSize:15,fontWeight:"bold"}}>
            {d.cat}
            </Text> 
          ):
          (
            <Text  style={{color:"white",fontSize:15,fontWeight:"bold"}}>
            {d.cat} Reports
            </Text>  
          )
           }   
                
          </View>

            <View>
             <Text  style={{color:"white",fontSize:14,fontWeight:"bold"}}>({d.total})</Text>
            </View>
          

       
           </View>

  </Card>
  </TouchableOpacity>

          )  
    })
  }else{
  this.item  =  <Text style={{fontSize:20,color:"silver",textAlign:"center",alignSelf:"center"}}>No Record Found</Text>
  }

  return(
    <Dialog
    dialogTitle={<DialogTitle title="Lab Reports" />}
    footer={
      <DialogFooter>
        <DialogButton
          text="Cancel"
          textStyle={{color:"#307ecc"}}
          onPress={() => {
            this.setState({vr: false,srd:false,is:""})
          }}
        />
      </DialogFooter>
    }
       visible={vr}
       onHardwareBackPress={() => true}
       dialogAnimation={
        new FadeAnimation({
          initialValue: 0, // optional
          animationDuration: 150, // optional
          useNativeDriver: true, // optional 
      })}
    >
     
      <ScrollView>
      <DialogContent style={{width:Dimensions.get('window').width - 25,borderRadius:10}}>
      <View  style={{flexWrap:"wrap",marginTop:20,flexShrink:1,flexDirection:"row",margin:5,justifyContent:"space-between"}}>
        {this.item}
        </View>
      </DialogContent>
      </ScrollView>
    </Dialog>
    )
  

}

renderViewLabreports(){
  const {vlr,reportsarray,document,er,scat}= this.state;
  
  if(reportsarray.length>0)
  {
    this.item = reportsarray.map((d)=>{ 
      console.log(d);
      return(    
        <Card style={{marginTop:30,elevation:5}}>
 
 <CardItem style={{backgroundColor:"#696969"}}>
   <Left>
     <TouchableOpacity  onPress={()=>this.select(d.aid,d.d,d.count)}   style={{flexDirection:"row",alignItems:"center"}}>
     <Radio color="white" selectedColor="white"  onPress={()=>this.select(d.aid,d.d,d.count)} selected={d.select}  />
     <Text style={{fontSize:15,marginLeft:10,color:"white"}}>{d.count} - </Text>
    <Text style={{fontSize:15,fontWeight:"bold",color:"white",textTransform:"capitalize",marginLeft:5}}>{d.d.title}</Text>
     </TouchableOpacity>
   </Left>
 </CardItem>

 <CardItem>
 {scat !="Prescriptions" ? 
 (
<Left>
  <View style={{backgroundColor:"#307ecc",padding:7,borderRadius:5,alignItems:"center",flexShrink: 1}}>
  <Text style={{color:"white",fontSize:15}}> {this.RenderReduceDdocnamevlr(d.d.documentname)}</Text>
  </View>
</Left>
 )
 :
 <Left>
   <Image onLoadStart={()=>{this.setState({is:"loading"})}}  onLoad={()=>{this.setState({is:"loaded"})}} source={{uri:d.d.document}} style={{width:120, height:120}}  />
   {this.state.is == "loading" ?( <Spinner style={{position:"absolute",marginTop:30}} size="large" color="#307ecc"/>) : null}
</Left>
}
    
 </CardItem> 

</Card>

          )  
    })
  }else{
    this.item  =  null;
    }

  return(
    <Dialog
    dialogTitle={<DialogTitle title={scat!="Prescriptions" ? scat+" Reports" : scat }/>}
    footer={
      <DialogFooter>
        <DialogButton
          text="Back"
          textStyle={{color:"#307ecc"}}
          onPress={() => {       
            this.setState({vlr: false,scat:null,reportsarray:[],document:null,dcname:"",er:true,srd:false,is:""})
          }}
        />
         <DialogButton
          text="Select"
          textStyle={{color:"#307ecc"}}
          onPress={() => {
            if(document!=null)
            this.setState({vlr: false,vr:false,scat:null,reportsarray:[],er:true,srd:true,is:""})
            else
            alert("Please select a  document")
          }}
        />
      </DialogFooter>
    }
       visible={vlr}
       onHardwareBackPress={() => true}
       dialogAnimation={ new SlideAnimation({
        slideFrom: 'top',
      })}
    >
      <ScrollView>
      <DialogContent style={{width:Dimensions.get('window').width - 25,borderRadius:10}}>
      <View>
        {er ? <Spinner size="large" color="blue" style={{marginTop:"40%",alignSelf:"center"}}/> : null}
        {this.item}
        </View>
      </DialogContent>
      </ScrollView>
    </Dialog>
    )
  

}


renderSlots()
{
    const {slots} = this.state;
    if(slots.length > 0) 
    {
      this.slotsarr = slots.map((k)=> {
        return (                 
          <TouchableOpacity 
          style={{margin:10,padding:10,backgroundColor:"#307ecc",borderRadius:5,flexShrink:1}}
          onPress={()=>{this.setState({cnfrm:true,cld:true,time:k})}}
          >
           <Text style={{textAlign:"center",fontSize:17,color:"white",fontWeight:"bold"}}>{k}</Text>
          </TouchableOpacity>
        
 )
    })

    return (
      <ScrollView >
      <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"center",marginTop:40}}>  
     { this.slotsarr }
      </View>
      </ScrollView>
  )
    }else{
      return(
        <Text style={{textAlign:"center",color:"white",fontSize:20,backgroundColor:"black"}}>No Time Slots Available</Text>
      )
    }

  }

  renderAvailable()
  {
  return(
    <Text style={{textAlign:"center",color:"white",fontSize:20,backgroundColor:"black"}}>OFF DAY</Text>
        )
}

  renderDateTimePicker()
{
  return(
    <View>
 <DateTimePickerModal
        isVisible={this.state.isDateTimePickerVisible}
        mode='date'
        date={new Date()}
        itemStyle={{
          backgroundColor: "red"            
        }}
        
        minimumDate={new Date()}
        onConfirm={(d)=>this.handleConfirm(d)}
        onCancel={()=>{this.hideDatePicker(),this.props.navigation.goBack()}}
        
      />
    </View>
  )
}


 RenderReduceDdocname(name)
{
  const s = name;
  console.log(s);
  const ext =  s.substr(s.lastIndexOf('.') + 1);
  const dcname = s.substring(0, s.lastIndexOf('.'));

  console.log("ext , "+ext+"  , filenmae , "+dcname);


    if(dcname.length > 6)  return <Text   style={{color:"white",fontSize:15}}>{`${dcname.substring(0,5)}.. .`+ext}</Text>
     else
     return <Text  style={{color:"white",fontSize:15}}>{s}</Text>
}

RenderReduceDdocnamevlr(name)
 {
   const s = name;
   console.log(s);
   const ext =  s.substr(s.lastIndexOf('.') + 1);
   const dcname = s.substring(0, s.lastIndexOf('.'));
 
   console.log("ext , "+ext+"  , filenmae , "+dcname);
 
 
     if(dcname.length > 18)  return <Text style={{color:"white",fontSize:14,textAlign:"center"}}>{`${dcname.substring(0,18)}.. .`+ext} <MaterialCommunityIcons  size={20} color="white" name="file-outline"/> </Text>  
      else
      return <Text style={{color:"white",fontSize:14,textAlign:"center"}}>{s} <MaterialCommunityIcons  size={20} color="white" name="file-outline"/> </Text>  
 }


renderConfirm()
{
  const {dctr,time,date,document,picload,dcname,showdate,mvc,vrc,vlrc} = this.state;
  return(
  <Dialog
    visible={this.state.cld}
    footer={
      <DialogFooter>
        <DialogButton
          text="Cancel"
          textStyle={{color:"#307ecc"}}
          onPress={() => {this.setState({document:null,dcname:"",cld:false,srd:false})}}
        />
        <DialogButton
          text="Confirm"
          textStyle={{color:"#307ecc"}}
          onPress={() => {this.checkduplicatetimeslotactive(date,time,dcname) }}
        />
      </DialogFooter>
    }
    onHardwareBackPress={() => true}
    dialogAnimation={new SlideAnimation({
      slideFrom: 'top',
      initialValue: 0, // optional
      useNativeDriver: true, // optional
    })}
     dialogTitle={<DialogTitle title="Confirm" />}
  >
    {picload && this.renderDocload()} 
    {mvc && this.renderpickerdialog()} 
    {vrc && this.renderLabreports()}
    {vlrc && this.renderViewLabreports()}
    <DialogContent style={{width:Dimensions.get('window').width - 45}}>
     
      <View style={{flexDirection:"row",alignItems:"center"}}>
      <Avatar.Image style={{alignSelf:"center"}} size={80} source={{uri: dctr.photo }} />
      <View style={{flexShrink:1,marginLeft:10}}>
      {dctr.username.length > 40 ?
         (
         <Text  style={{fontWeight:"bold",fontSize:15,textTransform:"capitalize"}}>Dr. {`${dctr.username.substring(0, 40)}..`}</Text>
         ) :
         <Text style={{fontWeight:"bold",fontSize:15,textTransform:"capitalize"}}>Dr. {dctr.username}</Text>
  }
      </View>
      </View>
  
     <Form style={{padding:10,marginTop:10}}>
        
          <Item style={{height:27}}>
             <Input style={{fontSize:14,textTransform:"capitalize"}} editable={false} value={dctr.fees} />
            <Label style={{fontSize:14,fontWeight:"700"}}>Fees</Label>
          </Item>

          <Item style={{height:27}}>
             <Input style={{fontSize:14,textTransform:"capitalize"}} editable={false} value={time} />
            <Label style={{fontSize:14,fontWeight:"700"}}>Time</Label>
          </Item>

          <Item style={{height:27}}>
             <Input style={{fontSize:14,textTransform:"capitalize"}} editable={false} value={dctr.duration+" Minutes"}  />
            <Label style={{fontSize:14,fontWeight:"700"}}>Duration</Label>
          </Item>
      
          <Item style={{height:27}}>
             <Input style={{fontSize:14,textTransform:"capitalize"}} editable={false} value={showdate}  />
            <Label style={{fontSize:14,fontWeight:"700"}}>Date</Label>
          </Item>
      
      </Form>

<Text style={{fontWeight:"600",marginTop:20,fontSize:14,marginLeft:30}}>Upload/Select Document  <Text style={{fontSize:14,color:"silver",fontWeight:"bold"}}>(optional)</Text> </Text>
    
{document != null ?  (  
               <View style={{flexDirection:"row",alignItems:"center",marginLeft:28,marginTop:8}}>           
               <View style={{backgroundColor:"#307ecc",padding:5,borderRadius:10,alignItems:"center",width:124}}>
              {this.RenderReduceDdocname(dcname)}
               </View>
               <TouchableOpacity  style={{marginLeft:88}} onPress={()=>this.setState({document:null,dcname:"",srd:false})}>
              <MaterialCommunityIcons  size={25} color="#f24e4e" name="close" />
              </TouchableOpacity>
               </View>
          ) : 
<TouchableOpacity  style={{alignSelf:"center",marginTop:15}} onPress={()=>this.setState({mvc:true,mv:true})}>
<Ionicons   size={28} color="#307ecc" name="md-add-circle-outline" />
</TouchableOpacity> }  

    </DialogContent>  
  </Dialog>
  )

}


  render() {
    const {es}= this.state

    return (
      <View style={{flex:1}} >
  {this.renderDateTimePicker()}
 {this.state.rslot && this.renderSlots()} 
 {this.state.cnfrm && this.renderConfirm()}
 {!this.state.available && this.renderAvailable() }
 {es ? <Spinner size="large" color="blue" style={{marginTop:"40%",alignSelf:"center"}}/> : null}
      </View>
    );
  }
}



const  mapStateToProps = (state) => 
{
  return{
 myuser:state.user,
        }
}

export default connect(mapStateToProps)(BookAppointment); 