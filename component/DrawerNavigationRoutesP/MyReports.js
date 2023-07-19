import React  from 'react';
import { StyleSheet,View, ToastAndroid,TextInput,TouchableOpacity,PermissionsAndroid,Image} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Title} from 'react-native-paper';
import {Card, CardItem,Text ,Container,Content,Body,Left,Right} from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker from 'react-native-document-picker';
import auth from '@react-native-firebase/auth';
import {Spinner } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import RNFetchBlob from 'rn-fetch-blob'
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import Dialog, { DialogContent,DialogFooter,DialogButton,FadeAnimation,DialogTitle} from 'react-native-popup-dialog';


 export default class MyReports extends React.Component  {
  constructor(props) {
    super(props);
    this.state =
    {
      categoryarray:[],
      
      document:null,
      dcname:"",
      reportsItems:[],
      category:"",
      title:"",
      g:false,
      //show upload dialog
     upload:false,
     uv:false,

     //show prscrptn uplad dlg
     uploadp:false,
     uvp:false,


     //fo clck camera/glry btn dialog option
     mv:false, //for dialog viible
     c:false,


       //show load doc dialog
       picload:false,
       ld:false,

    prescriptionarray:[],
    docfolder:`Documents/Patients/MyReportsDoc/${auth().currentUser.uid}`, //for patnt all uploaded prsecription
    
      
    }
  }


  componentDidMount()
  {
    this.clctsreportsitem();
   this.checkReports()
  }

  componentWillUnmount()
{
 
    if(this.unsubscribe) {
      this.unsubscribe();
      }
      if(this.subscriby) {
        this.subscriby();
        }
}


uploadcameraimage = async () =>
{
  this.setState({mv:false})
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  ImagePicker.launchCamera(options , (response) => {
    if (response.didCancel) {
      ToastAndroid.showWithGravity(
       "cancel",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM);
    } else if (response.error) {
      ToastAndroid.showWithGravity(
        response.error.toString(),
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM);
      console.log('ImagePicker Error: ', response.error);
    } else {
      const URI =  response.uri ;
      const s  =  response.fileName ;   
      console.log('filename', s);
      this.setState({document:URI,dcname:s,g:false});
}
  });
}


uploadgalleryimage = async () =>
{
  this.setState({mv:false})
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
 
  ImagePicker.launchImageLibrary(options ,async (response) => {
   
    if (response.didCancel) {
      ToastAndroid.showWithGravity(
       "cancel",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM);
    } else if (response.error) {
      ToastAndroid.showWithGravity(
        response.error.toString(),
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM);
      console.log('ImagePicker Error: ', response.error);
    } else {
      const URI =   response.uri ;
      const s  =  response.fileName ;   
      console.log('filename g',  s );
      this.setState({document:URI,dcname:s,g:true});
    }
  });
}

clctsreportsitem()
{

     this.subscriby  = firestore().collection("dropdownitems").onSnapshot((doc)=>{
      if(doc.size>0)
      {
        let rpi = [];
        doc.forEach(data=>{
          const ri  = data.data().report;
          rpi=ri ;
        });
        this.setState({ reportsItems: rpi})
       }else
      {
        this.setState({ reportsItems: []})
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
    const currentUser  = auth().currentUser.uid
    const ref = firestore().collection("users").doc(currentUser).collection("MyReports").doc(id)
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

checkReports()
{
  const currentUser  = auth().currentUser.uid
  const ref = firestore().collection("users").doc(currentUser).collection("MyReports")
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

     console.log(orgnlcatg)
        this.setState({categoryarray:orgnlcatg})

    }else
    {
      this.setState({categoryarray:[]})
    }
  })
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
    if(this.state.category!="")
    {
      try {
        const res = await DocumentPicker.pick({
        //Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles]
        });
        //Printing the log realted to the file
        console.log('res docmnt : ' + JSON.stringify(res));
        const stat = await RNFetchBlob.fs.stat(res.uri) || null
        this.setState({dcname:res.name,document:stat.path})
        //Setting the state to show single file attributes
        } catch (err) {
        //Handling any exception (If any)
        if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled');
        } else {
        //For Unknown Error
        alert("Please donot select from recent tab")
        console.log('Unknown Error: ' + JSON.stringify(err));
        throw err;
        }
        }
    }else{alert("Please Select Category first")}
  };

  checkFormValidate()
  {
    const {document,dcname,title,category} = this.state;
    if(document != null && dcname != "" && title != "" && category != "" )
    {
       return true
    }else{
      return false
    }
  }


  checkstoragedupliacatefile(cat,dc)
  {
    const c = this.checkFormValidate();
    if(c){
      this.setState({picload:true,ld:true})
      const currentUser  = auth().currentUser.uid
      const ref = firestore().collection("users").doc(currentUser).collection("MyReports").orderBy("createdat")
      ref.get().then((doc)=>{
        if(doc)
        {
          let c  = false;
          doc.forEach(d => {
            console.log(d)
            if(cat == d.data().category && dc == d.data().documentname )
            {
              c = true;
            }
          });
  
          if(c)
          {
            alert(`File ${dc} is already exist in database storage in same category !  \n Please change file name and then upload`)
            this.setState({ld:false})
          }else{
            this.uploaddocumentfirebase(this.state.document,this.state.dcname);
          }
        }
  })
  
    }else{
      alert("Please fill all fields")
    }

    }

  
  uploaddocumentfirebase = async (uri,docname) =>
  {
    try{
      console.log("upld dcmnt firebase ", uri)
      const {docfolder,g} = this.state;
      let urii=""
      if(g) { urii= (await (RNFetchBlob.fs.stat(uri)) ).path}
      else {  urii= uri } 
        storage().ref(`${docfolder}/${this.state.category}/${docname}`)
        .putFile(urii)
        .then((snapshot) => {
          //You can check the image is now uploaded in the storage bucket
          console.log(snapshot);
          console.log(`${docname} has been successfully uploaded.`);
          this.getdocfirebase(docname);
        }).catch((e) => {console.log('uuploading dcmnt firebase error => ', e)});
    }catch (e){
   console.log('uploading dcmnt firebase error => ',e)
    }
    
    }
  
    getdocfirebase = async (docname) =>
    {
      const {docfolder} = this.state;
       await storage().ref(`${docfolder}/${this.state.category}/${docname}`)
        .getDownloadURL()
        .then((url) => {
          //from url you can fetched the uploaded image easily
          this.setState({document:url,dcname:docname}) 
          this.confirm()
        })
        .catch((e) => console.log('getting downloadURL of image error => ', e));
      }

      confirm()
      {
      const {document,dcname,title,category} = this.state;
        this.setState({picload:true,ld:true})
        const currentUser  = auth().currentUser.uid;
        const report = {
          title:title,
          document:document,
          documentname:dcname,
          category:category,    
          exist:false, 
          createdat:new Date()
        }
        const ref = firestore().collection("users").doc(currentUser).collection("MyReports")
        ref.add(report).then(()=>this.setState({uv:false,title:"",category:"",document:null,dcname:"",ld:false,uvp:false}) ,
        ToastAndroid.showWithGravity(
          "Upload success",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM),
        )
    
    
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


  renderUpload()
  {
    const {uv,document,picload,dcname,reportsItems} = this.state;
    this.ReportItems=reportsItems.map(element=>{
      return {label: element, value: element};
    });

    return(
    <Dialog
      visible={uv}
      footer={
        <DialogFooter>
          <DialogButton
            text="Cancel"
            onPress={() => {this.setState({document:null,dcname:"",uv:false,title:"",category:""})}}
          />
          <DialogButton
            text="Upload"
            onPress={() => {this.checkstoragedupliacatefile(this.state.category,this.state.dcname)}}
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
      {picload && this.renderDocload()} 
      <DialogContent>
    <View style={{padding:10}}>
    <Title style={{textAlign:"center"}}>Upload Report</Title>
    <View style={{width:"100%",height:0.5,backgroundColor:"#307ecc",marginTop:3}} />
  
  <View style={{padding:10}}>
  <DropDownPicker
   items={this.ReportItems} 
    placeholder="Select Category"
    placeholderStyle={{ textAlign: 'center'}}
  containerStyle={{width: 170, height:50}}
    style={{backgroundColor: '#fafafa',paddingVertical: 10}}
    dropDownStyle={{backgroundColor: '#fafafa'}}
     onChangeItem={item => 
      this.setState({
        category: item.value
    })
    }
/> 
  </View>



<TextInput  style={{ backgroundColor:"white",width:170,height:60,fontSize:16,marginTop:15,borderColor:"black",borderWidth:0.3,textAlign:"center",alignSelf:"center"}}  
    onChangeText={text=> this.setState({title :text })}
    placeholder={"Title"}
      multiline={true}
      numberOfLines={1}
      scrollEnabled={true}
      underlineColorAndroid='transparent'  
/>


<View style={{width:"100%",height:0.5,backgroundColor:"#307ecc",marginTop:20}} />
<Text style={{fontWeight:"600",marginTop:10,fontSize:15}}>Upload document </Text>
{document != null ?  (  
                <View style={{flexDirection:"row",alignItems:"center",marginTop:8}}>           
                <View style={{backgroundColor:"#307ecc",padding:5,borderRadius:10,alignItems:"center",width:124}}>
               {this.RenderReduceDdocname(dcname)}
                </View>
                <TouchableOpacity  style={{marginLeft:7}} onPress={()=>this.setState({document:null,dcname:""})}>
               <MaterialCommunityIcons  size={20} color="#f24e4e" name="close" />
               </TouchableOpacity>
                </View>
          ) : 
<TouchableOpacity onPress={()=> this.checkDocumentPermission()}>
<MaterialCommunityIcons style={{marginLeft:"20%",marginTop:5}} size={25} name="link-variant" />
</TouchableOpacity> }

   </View>
      </DialogContent>
    </Dialog>
  
    )
  
  }

  renderpickerdialog()
{
  return(  
  <Dialog
    visible={this.state.mv}
    dialogTitle={<DialogTitle title="Upload From" />}
    style={{padding:10}}
    footer={
      <DialogFooter>
        <DialogButton
          text="Cancel"
          textStyle={{color:"#307ecc"}}
          onPress={() => {this.setState({mv:false,g:false})}}
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
    <DialogContent>
     <View style={{marginTop:23,justifyContent:"space-between"}}>
  <TouchableOpacity onPress={()=>{this.uploadcameraimage()}}>
<Text style={{fontSize:19}}>Camera{'\n'}{'\n'}</Text>
</TouchableOpacity>
<TouchableOpacity onPress={()=>{this.uploadgalleryimage()}}>
<Text style={{fontSize:19}}>Gallery</Text>
</TouchableOpacity>
</View>
    </DialogContent>
  </Dialog>
  )

}

  renderUploadp()
  {
    const {uvp,document,picload,c} = this.state;
    return(
    <Dialog
      visible={uvp}
      footer={
        <DialogFooter>
          <DialogButton
            text="Cancel"
            onPress={() => {this.setState({document:null,dcname:"",uvp:false,title:"",category:""})}}
          />
          <DialogButton
            text="Upload"
            onPress={() => {this.checkstoragedupliacatefile(this.state.category,this.state.dcname)}}
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
      {picload && this.renderDocload()} 
      {c && this.renderpickerdialog()}
      <DialogContent>
    <View style={{padding:10}}>

    <Title style={{textAlign:"center"}}>Upload Prescription</Title>
    <View style={{width:"100%",height:0.5,backgroundColor:"#307ecc",marginTop:3}} />
  


<TextInput  style={{ backgroundColor:"white",width:140,height:60,fontSize:16,marginTop:15,borderColor:"black",borderWidth:0.3,textAlign:"center",alignSelf:"center"}}  
    onChangeText={text=> this.setState({title :text })}
    placeholder={"Title"}
      multiline={true}
      numberOfLines={1}
      scrollEnabled={true}
      underlineColorAndroid='transparent'  
/>

<View style={{width:"100%",height:0.5,backgroundColor:"#307ecc",marginTop:20}} />

{document == null ? (
  <TouchableOpacity style={{flexDirection:"row",padding:5,alignSelf:"center"}} onPress={()=>{this.setState({c:true,mv:true})}}>
  <Text style={{fontWeight:"600",marginTop:10,fontSize:15}}>Upload</Text>
  <Ionicons style={{marginLeft:"10%",marginTop:5}} size={25} color="green" name="md-add-circle-outline" />
  </TouchableOpacity> 

    )
     :
     <View style={{padding:5,marginTop:8,alignSelf:"center"}}>  
     <Text style={{textTransform:"uppercase",fontSize:15,color:"#858585"}}>Prescription</Text>
     <View style={{flexDirection:"row",marginTop:15}}>
     <Image  source={{uri:document}} style={{width:120, height:120}}/>
     <MaterialCommunityIcons onPress={()=>{this.setState({document:null,dcname:""})}}  name="close" size={25} color="red" />
     </View>
     </View> 
     
     }

   </View>
      </DialogContent>
    </Dialog>
  
    )
  
  }
  

  RenderReduceDdocname(name)
  {
    const s = name;
    const ext =  s.substr(s.lastIndexOf('.') + 1);
    const dcname = s.substring(0, s.lastIndexOf('.'));
  
    console.log("ext , "+ext+"  , filenmae , "+dcname);
  
  
      if(dcname.length > 8)  return <Text   style={{color:"white",fontSize:13}}>{`${dcname.substring(0,8)}.. .`+ext}</Text>
       else
       return <Text  style={{color:"white",fontSize:15}}>{s}</Text>
  }

  renderTopBar(){
    return(
  <Card style={{marginTop:-10,elevation:7}}>
           <CardItem >
            <Left>
            <TouchableOpacity style={{marginTop:10,alignSelf:"center",flexDirection:"row"}} onPress={()=>{this.setState({upload:true,uv:true})}}>
     <Text style={{fontSize:16}}>Upload Reports</Text>
     <Ionicons  style={{marginLeft:5}}  size={22} color="#307ecc" name="md-add-circle-outline" />
        </TouchableOpacity>
        <View style={{backgroundColor:"grey",width:2,height:30,marginLeft:5}} />
              </Left>
              <Body>
              <TouchableOpacity style={{marginTop:10,alignSelf:"center",flexDirection:"row"}} onPress={()=>{this.setState({uploadp:true,uvp:true,category:"Prescriptions"})}}>
     <Text style={{fontSize:16}}>Upload Prescriptions</Text>
     <Ionicons  style={{marginLeft:5}}  size={22} color="green" name="md-add-circle-outline" />
        </TouchableOpacity>
              </Body>
             
            </CardItem>
  </Card>
    )
  }
  

render(){
  const {upload,categoryarray,uploadp} = this.state;
  if(categoryarray.length > 0 )
  {
    this.item = categoryarray.map((d)=>{
       return( 
        <TouchableOpacity  onPress={()=>{this.props.navigation.navigate("ReportsViewScreen",{cat:d.cat})}} >
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
     <Container >
       {this.renderTopBar()}   
<Content >
{upload && this.renderUpload()}
{uploadp && this.renderUploadp()}
      <ScrollView >
      <View  style={{flexWrap:"wrap",marginTop:40,flexShrink:1,flexDirection:"row",margin:5,justifyContent:"space-between"}}>
       {this.item}
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
