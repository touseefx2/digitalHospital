import React  from 'react';
import { StyleSheet,View, ToastAndroid,Text,Button,TextInput,TouchableOpacity,PermissionsAndroid} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dialog, { DialogContent,FadeAnimation,DialogFooter,DialogButton} from 'react-native-popup-dialog';
import {Title} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker from 'react-native-document-picker';
import {Card} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {Spinner } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs';
import storage from '@react-native-firebase/storage';
import { ScrollView } from 'react-native-gesture-handler';

 export default class ViewReport extends React.Component  {
  constructor(props) {
    super(props);
    this.state={
      categoryarray:[],
      ptid:props.navigation.getParam("receiverid"),
    }
  }

 
  static navigationOptions  = ({ navigation }) => {
    return {
      title:"Reports",
            headerStyle: {
              backgroundColor: "#307ecc",
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              color:"white",
              textTransform:"capitalize"
            }
          }
    };
  
    componentDidMount()
    {
     this.checkReports()
    }

    componentWillUnmount()
    {
     
        if(this.unsubscribe) {
          this.unsubscribe();
          }
    }

    checkReports()
{
 
  const ref = firestore().collection("users").doc(this.state.ptid).collection("MyReports")
  this.unsubscribe  =  ref.orderBy("createdat").onSnapshot((doc)=>{
    if(doc.size>0)
    {
      const orgnlcatg=[];
      const catg=[];

      doc.forEach(d => {
          const cat = d.data().category;
          catg.push(cat)
           this.checkFileExist(d.data().documentname,d.id)
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
        console.log(orgnlcatg)

    }else
    {
      this.setState({categoryarray:[]})
    }
  })
}
  

checkFileExist = (dn,id) =>
{
  const {fs } = RNFetchBlob;
  let Dir = fs.dirs.DownloadDir;
  const localFile = Dir+"/"+"x2"+"/"+dn;
  RNFS.exists(localFile)
  .then(success => {
    const ref = firestore().collection("users").doc(this.state.ptid).collection("MyReports").doc(id)
      if (success) {
         console.log("file exist , ",success)
         ref.update({    exist:true  })
      } else {
        console.log("file not exist , ",success)
        ref.update({    exist:false  })
      }
  })
  .catch(err => {
      console.log(err.message, err.code);
  });
}

render(){
  const {categoryarray} = this.state;
  if(categoryarray.length > 0 )
  {
    this.item = categoryarray.map((d)=>{
       return( 
        <TouchableOpacity  onPress={()=>{this.props.navigation.navigate("ReportsViewScreen",{cat:d.cat,receiverid:this.state.ptid})}} >
        <Card style={{elevation:5,marginTop:30,alignItems:"center",backgroundColor:d.cat == "Prescriptions" ? "green" : "#307ecc",padding:15,width:155}}>
           <View style={{flexDirection:"row",justifyContent:"space-around"}}>
          
          <View style={{width:150,flexShrink:1}}> 
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
    this.item  =  <Text style={{fontSize:30,color:"silver",marginTop:"60%",textAlign:"center",alignSelf:"center",marginLeft:50}}>No Record Found</Text>
    }

return(  
      <View style={styles.container}>  
     <ScrollView >
     <View  style={{flexWrap:"wrap",marginTop:40,flexShrink:1,flexDirection:"row",margin:5,justifyContent:"space-between"}}>
       {this.item}
     </View>
     </ScrollView>

     
      </View>
)
     }

  };

  

const styles= StyleSheet.create({

  container:
  {
    flex:1,
    backgroundColor:"#f0fbff",
    alignItems:"center"
  }
});
