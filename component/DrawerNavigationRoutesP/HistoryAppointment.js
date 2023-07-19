import React  from 'react';
import { StyleSheet,Text,ScrollView,AppState,View} from "react-native";
import firestore from '@react-native-firebase/firestore';
import { Searchbar } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { Container,Content } from 'native-base';
import {Spinner } from 'native-base';
import moment from "moment";
import AppointmentCard from "./AppointmentCard";

export default class  HistoryAppointment extends React.Component  { 
  constructor(props) {
    super(props);
    this.state = {
      HistoryAppointment:[],
      appState: AppState.currentState,
      search:"",

      load:true,
      empty:false,
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

  componentDidMount(){
      const currentuserid =  auth().currentUser.uid;
      this.unsubscribe = firestore().collection("appointments").orderBy("createdat", "desc").onSnapshot((docs)=>{
        this.setState({load:true,empty:false})
        if(docs.size>0)
        {
          const app=[];
          docs.forEach((data) => {
            const  d=data.data();

            if(d.patientid==auth().currentUser.uid && d.active !="Process" && d.active !="Schedule" ){
              const aid=data.id;
              const obj = {aid:aid,refdid:d.refdid,cancelreason:d.cancelreason,showdate:d.showdate,cancelby:d.cancelby,address:d.draddress,email:d.dremail,speciality:d.speciality,active:d.active,date:d.date,time:d.time,duration:d.duration,doctorinfo:d.doctorinfo,fees:d.fees,doc:d.document,docname:d.documentname,patientid:d.patientid,doctorid:d.doctorid,exist:d.exist}
              app.push(obj);
            }  
  })

  if(app.length>0)
  {this.setState({HistoryAppointment:app,load:false})}else {  this.setState({load:false,empty:true,HistoryAppointment:app}) }

 
  }else{
    this.setState({HistoryAppointment:[],load:false,empty:true})
  }
})
  
}

componentWillUnmount()
{
  if(this.unsubscribe) {
    this.unsubscribe();
    }
}

rendercheckappnmnt()
{
  const {empty} = this.state;
  return( 
      <View>
      {empty 
        ? ( <Text style={{fontSize:30,color:"silver",marginTop:"40%",textAlign:"center"}}>No Record Found</Text>) 
        :   <Searchbar onChangeText={t=>this.setState({search:t})} value={this.state.search} placeholder="Search  by doctor name" placeholderTextColor="silver" style={{elevation:4,marginTop:1,height:40}}   />  }

      </View>
  )
}


render(){ 
  const {load,search} = this.state;
  if(this.state.HistoryAppointment.length> 0 )
  {
    this.item = this.state.HistoryAppointment.map( e =>{
      if(search==""){ return( <AppointmentCard d={e} object={this.props}/> )  }
      else if (search!=""  ){ 
        const s= search.toLowerCase();
        const dname = e.doctorinfo.name.toLowerCase() 
        const sl = s.length;  const dn =  dname.substr(0, sl);
        if(s==dn)
        {
         return(
          <AppointmentCard d={e} object={this.props}/>
         )
        } 
      }
          
    })
  }else
  {
    this.item = null;
  }
 
return(
  
  <Container >
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


