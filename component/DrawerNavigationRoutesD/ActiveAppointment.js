import React  from 'react';
import { StyleSheet,ScrollView,AppState,Text,View} from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from "moment";
import { Container,Content } from 'native-base';
import AppointmentCard from "./AppointmentCard";
import {Spinner } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob'
import { Searchbar} from 'react-native-paper';
import RNFS from 'react-native-fs';

export default class  ActiveAppointment extends React.Component  { 
  constructor(props) {
    super(props);
    this.state = {
      ActiveAppointment:[],
      appState: AppState.currentState,
      search:"",
      load:true,
      empty:false,
    }
  }

  handleAppStateChange = (nextAppState) => {
 
    this.setState({ appState: nextAppState });
  
    if (nextAppState === 'background') {
      // Do something here on app background.
      console.log("App is in Background Mode. actvappmnt")
    }
  
    if (nextAppState === 'active') {
      this.checkdocmntfileexist()
      // Do something here on app active foreground mode.
      console.log("App is in Active Foreground Mode. actvappmnt")
    }
  
    if (nextAppState === 'inactive') {
      // Do something here on app inactive mode.
      console.log("App is in inactive Mode. actvappmnt")
    }
  };

  checkFileExist = (dn,id) =>
{
  const {fs } = RNFetchBlob;
  let Dir = fs.dirs.DownloadDir;
  const localFile = Dir+"/"+"x2"+"/"+dn;
  RNFS.exists(localFile)
  .then(success => {
    const currentUser  = auth().currentUser.uid
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

dynamicheckAppntmnt()
{
  this.unsubscribe = firestore().collection("appointments").orderBy("createdat", "desc").onSnapshot((docs)=>{
    this.setState({load:true,empty:false})
    console.log("onsnp app cal")
    if(docs.size>0)
    {
      const app=[];
      docs.forEach((data) => {
        const  d=data.data();

        if(d.doctorid==auth().currentUser.uid && d.active =="Process" ){


          const aid=data.id;
          const dbupdate = firestore().collection("appointments").doc(aid);    
  
           //update dctr info in appmnt dynmcly
        this.unsubscribee =  firestore().collection("users").doc(d.patientid).onSnapshot((u)=>{
         if(u.exists)
         {
          dbupdate.update({
            patientinfo:{
              name:u.data().username,
              photo:u.data().photo,
              phone:u.data().phone,
            }
          })
         } 
        })  
  
      
            var  AppnmntDate =moment(d.date,"DD/MM/YYYY");
            const CurrentDate = this.compare(AppnmntDate)
           
            if(CurrentDate == "Greater")
            {
              dbupdate.update({
                active:"Schedule",
                createdat:Date.now()
              })
            }
  
            if(CurrentDate == "Smaller")
            {
             
            }
  
            if(CurrentDate == "Equal")
            {
              var ct= moment(new Date()).format('h:mma')
              var currentTime = moment(ct, 'h:mma');
              var slotTime = moment(d.time, 'h:mma');
              if(currentTime.isAfter(slotTime) || currentTime.isSame(slotTime))
              {
                dbupdate.update({
                  active:"Schedule",
                  createdat:Date.now()
                })      
              }
            }
         
            const obj = {aid:aid,showdate:d.showdate,cancelreason:d.cancelreason,cancelby:d.cancelby,active:d.active,address:d.ptaddress,email:d.ptemail,exist:d.exist,patientinfo:d.patientinfo,doctorinfo:d.doctorinfo,refdid:d.refdid,date:d.date,time:d.time,duration:d.duration,fees:d.fees,doc:d.document,docname:d.documentname,patientid:d.patientid,doctorid:d.doctorid}
             app.push(obj);
          

        }

        
})

if(app.length>0)
  {this.setState({ActiveAppointment:app,load:false,empty:false})}else {  this.setState({load:false,empty:true,ActiveAppointment:app}) }

}else{
  this.setState({ActiveAppointment:[],load:false,empty:true})
}
})

}

checkdocmntfileexist()
{
  const currentuserid =  auth().currentUser.uid;
  firestore().collection("appointments").where(`doctorid` , '==' , currentuserid).get().then((docs)=>{
    if(docs.size>0)
    {
      docs.forEach(data =>{
        const d = data.data();
      if(d.document!=null){this.checkFileExist(d.documentname,data.id)}
      });
    }
  })
}

  componentDidMount(){
    AppState.addEventListener('change', this.handleAppStateChange);
    this.dynamicheckAppntmnt()
    this.timerInterval = setInterval(() => {this.dynamicheckAppntmnt()},20000)
    this.checkdocmntfileexist()
}

componentWillUnmount()
{
  AppState.removeEventListener('change', this.handleAppStateChange);
  if(this.unsubscribe) {
    this.unsubscribe();
    }
  if(this.unsubscribee) {
    this.unsubscribee();
    }
    if(this.timerInterval) {
    clearInterval(this.timerInterval);
    }
}



rendercheckappnmnt()
{
  const {empty} = this.state;
  return( 
      <View>
      {empty 
        ? ( <Text style={{fontSize:30,color:"silver",marginTop:"40%",textAlign:"center"}}>No Record Found</Text>) 
        :   <Searchbar placeholder="Search  by patient name"   onChangeText={t=>this.setState({search:t})} value={this.state.search} placeholderTextColor="silver" style={{elevation:4,marginTop:1,height:40}}   />  }

      </View>
  )
}

render(){ 
  const {load,search} = this.state;
  if(this.state.ActiveAppointment.length> 0 )
  {
    this.item = this.state.ActiveAppointment.map( e =>{

      if(search==""){ return( <AppointmentCard d={e} object={this.props}/> )  }
      else if (search!=""  ){ 
        const s= search.toLowerCase();
        const dname = e.patientinfo.name.toLowerCase() 
        const sl = s.length;  const dn =  dname.substr(0, sl);
        if(s==dn)
        {
         return(
          <AppointmentCard d={e} object={this.props}/>
         )
        } 
      }

           
    })
  }else{
    this.item = null;
  }
 
return(
        <Container>
      {load ? ( <Spinner style={{marginTop:"40%",alignSelf:"center"}} size="large" color="#307ecc"/>) : this.rendercheckappnmnt()}
       <Content> 
      <ScrollView> 
        <View style={{marginTop:20,marginBottom:15}}>
        {this.item }
        </View>
      </ScrollView> 
      </Content>
       </Container>
)
     }

  };

  

const styles= StyleSheet.create({

  container:
  {
    flex:1,
  }
});


