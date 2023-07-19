import React  from 'react';
import { StyleSheet,View, ToastAndroid,Text,TouchableOpacity,PermissionsAndroid,AppState,Image} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, CardItem, Thumbnail, Left, Body, Right,Button,Spinner, Item, Input, Form ,Label} from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs';
import { ScrollView } from 'react-native-gesture-handler';
import FileViewer from 'react-native-file-viewer';


export default  class MyReportsCatagoryView extends React.Component {

  static navigationOptions  = ({ navigation }) => {
    return {
      title:navigation.getParam("cat")+" Reports",
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
      appState: AppState.currentState,
       reportsarray:[],
       ptid:props.navigation.getParam("receiverid"),
       is:"",
       cat: this.props.navigation.getParam("cat"),
      }
    }

    componentDidMount()
    {
      AppState.addEventListener('change', this.handleAppStateChange);
    
    
      const ref = firestore().collection("users").doc(this.state.ptid).collection("MyReports").orderBy("createdat")
      this.unsubscribe  =  ref.onSnapshot((doc)=>{
        if(doc.size>0)
        {
          const arr=[];
          let i = 1;
          const cat = this.props.navigation.getParam("cat");
          doc.forEach(d => {
              if(cat  == d.data().category)
              {
                const obj = {id:d.id,report:d.data(),count:i++}
                arr.push(obj)
              } 
        });
         this.setState({reportsarray:arr})
        }else
        {
          this.setState({reportsarray:[]})
        }
  
      })
    }

    handleAppStateChange = (nextAppState) => {
 
      this.setState({ appState: nextAppState });
    
      if (nextAppState === 'background') {
        // Do something here on app background.
        console.log("App is in Background Mode. reportview")
      }
    
      if (nextAppState === 'active') {
        if(this.state.reportsarray.length>0)
        {
          this.state.reportsarray.forEach(d => {
            this.checkFileExist(d.documentname,d.id);
          });
        }
        // Do something here on app active foreground mode.
        console.log("App is in Active Foreground Mode. reportview")
      }
    
      if (nextAppState === 'inactive') {
        // Do something here on app inactive mode.
        console.log("App is in inactive Mode. reportview")
      }
    };
  
  
    componentWillUnmount()
{
  AppState.removeEventListener('change', this.handleAppStateChange);
    if(this.unsubscribe) {
      this.unsubscribe();
      }
}

checkPermission = async (uri,docname,id) => {
  if (Platform.OS === 'ios') {
    this.downloadDoc(uri,docname,id);
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
        this.downloadDoc(uri,docname,id);
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

downloadDoc (uri,docname,id)  
{
  //Image URL which we want to download
  let image_URL =uri;
  ToastAndroid.showWithGravity(
    "Download Start",
    ToastAndroid.SHORT,
    ToastAndroid.CENTER)
 //Get config and fs from RNFetchBlob
  //config: To pass the downloading related options
  //fs: To get the directory path in which we want our image to download
  const { config, fs } = RNFetchBlob;
  let PictureDir = fs.dirs.DownloadDir;
  let options = {
    fileCache: true,
    addAndroidDownloads: {
      //Related to the Android only
      useDownloadManager: true,
      mediaScannable : true,
      notification: true,
      path:  PictureDir+"/"+"x2"+"/"+ docname,
      description: 'File',
    },
  };
    config(options)
    .fetch('GET', image_URL)
    .then((res)=>{
      console.log(res)
      ToastAndroid.showWithGravity(
        "Download Successfull \n\n --> Internal Storage --> Download --> x2 ",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM)
        this.checkFileExist(docname,id);
    })
}




checkFileExist = (dn,id) =>
{
  const {fs } = RNFetchBlob;
  let Dir = fs.dirs.DownloadDir;
  const localFile = Dir+"/"+"x2"+"/"+dn;
  RNFS.exists(localFile)
  .then(success => {
    const currentUser  = auth().currentUser.uid
    const ref = firestore().collection("users").doc(this.state.ptid).collection("MyReports").doc(id)
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

       openfile=(dn) =>{
        const {fs } = RNFetchBlob;
        let Dir = fs.dirs.DownloadDir;
        const localFile = Dir+"/"+"x2"+"/"+dn;
        RNFS.exists(localFile)
         FileViewer.open(localFile)
         .then(() => {
           //Can do anything you want after opening the file successfully
           console.log('Success');
         })
         .catch(_err => {
           //Handle failure here
           console.log(_err);
         });
     
      }

      
 RenderReduceDdocname(name)
 {
   const s = name;
   console.log(s);
   const ext =  s.substr(s.lastIndexOf('.') + 1);
   const dcname = s.substring(0, s.lastIndexOf('.'));
 
   console.log("ext , "+ext+"  , filenmae , "+dcname);
 
 
     if(dcname.length > 10)  return <Text style={{color:"white",fontSize:15,textAlign:"center"}}>{`${dcname.substring(0,10)}.. .`+ext} <MaterialCommunityIcons  size={20} color="white" name="file-outline"/> </Text>  
      else
      return <Text style={{color:"white",fontSize:15,textAlign:"center"}}>{s} <MaterialCommunityIcons  size={20} color="white" name="file-outline"/> </Text>  
 }
 
  
  render(){
  
    const {reportsarray,cat} = this.state;
    if(reportsarray.length>0)
    {
      this.item = reportsarray.map((d)=>{  
        return(     
         
          <View style={{padding:10,marginTop:10}}>  
  

  {cat != "Prescriptions" ? ( 
    <View>
 <View style={{flexDirection:"row",alignItems:"center"}}> 
   <Text style={{fontSize:14}}>{d.count} - </Text> 
 <Text style={{fontSize:17,flexShrink:1,textTransform:"capitalize"}} >{d.report.title}</Text>
   </View>

 
   
        <View style={{flexDirection:"row",alignItems:"center",marginTop:15,marginLeft:13}}> 

{d.report.exist ? (<TouchableOpacity  onPress={()=>{ this.openfile(d.report.documentname)}} style={{backgroundColor:"#307ecc",padding:7,borderRadius:10,margin:5,alignItems:"center",flexShrink: 1}}>
        {this.RenderReduceDdocname(d.report.documentname)}
        </TouchableOpacity> ) :   <View style={{backgroundColor:"#307ecc",padding:7,borderRadius:10,margin:5,alignItems:"center",flexShrink: 1}}>
        {this.RenderReduceDdocname(d.report.documentname)}
        </View> }
      
        {!d.report.exist 
        ? ( <TouchableOpacity  onPress={()=>{this.checkPermission(d.report.document,d.report.documentname,d.id)}}>
        <MaterialCommunityIcons  style={{marginLeft:10}} size={25} color="black" name="download"/>  
        </TouchableOpacity>)   
        :  <TouchableOpacity  onPress={()=>{ this.openfile(d.report.documentname)}}>
        <MaterialCommunityIcons style={{marginLeft:10}} size={25} color="black" name="open-in-new"/>  
        </TouchableOpacity> }


         </View>

    </View>
  ):null}
       


                {cat == "Prescriptions" ? (
  <View>


{!d.report.exist ? (
  <CardItem>
  <Left>
  <View style={{flexDirection:"row"}}> 
  <Text style={{fontSize:14}}>{d.count} - </Text> 
  <Text style={{fontSize:17,flexShrink:1,textTransform:"capitalize"}} >{d.report.title}</Text>
  </View>
 </Left>
 <Right>
 <TouchableOpacity style={{alignItems:"center"}} onPress={()=>{this.checkPermission(d.report.document,d.report.documentname,d.id)}}>
<Image onLoadStart={()=>{this.setState({is:"loading"})}} onLoad={()=>{this.setState({is:"loaded"})}}   resizeMode="cover" blurRadius={4}  source={{uri:d.report.document}} style={{width:100, height:100}}  />
<MaterialCommunityIcons style={{position:"absolute",marginTop:40}} size={40} color="white" name="cloud-download-outline"/>  
{this.state.is == "loading" ?( <Spinner style={{position:"absolute",marginTop:40}} size="large" color="#307ecc"/>) : null}
</TouchableOpacity>

 </Right>
</CardItem>
):null}

{d.report.exist ? (
  <CardItem>
  <Left>
  <View style={{flexDirection:"row"}}> 
  <Text style={{fontSize:14}}>{d.count} - </Text> 
  <Text style={{fontSize:17,flexShrink:1,textTransform:"capitalize"}} >{d.report.title}</Text>
  </View>
 </Left>
 <Right>
 <TouchableOpacity onPress={()=>{ this.openfile(d.report.documentname);}}>
  <Image onLoadStart={()=>{this.setState({is:"loading"})}} onLoad={()=>{this.setState({is:"loaded"})}}  resizeMode="cover"  source={{uri:d.report.document}} style={{width:100, height:100}}/>
  {this.state.is == "loading" ?( <Spinner style={{position:"absolute",marginTop:40}} size="large" color="#307ecc"/>) : null}
  </TouchableOpacity>
 </Right>
</CardItem>
):null}


  </View>
        

        
): null} 


                <View style={{backgroundColor:"silver",height:1,marginTop:10}}/>


          </View>
  
            )  
      })
    }else{
      this.item  =  <Text style={{fontSize:30,color:"silver",marginTop:"40%",textAlign:"center"}}>No Record Found</Text>
    }
  
  return(  
        <View style={styles.container}>  
       <ScrollView >
       <View  style={{marginTop:40}}>
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
      backgroundColor:"white",
    }
  });
  