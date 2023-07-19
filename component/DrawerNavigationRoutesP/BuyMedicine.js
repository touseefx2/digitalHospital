import React  from 'react';
import {View,ScrollView,Image,TouchableOpacity,Dimensions,ToastAndroid} from "react-native";
import { Container,Content,Card, CardItem, Left,Right,Text,Radio,Spinner} from 'native-base'
import {Button} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Dialog, { DialogContent,FadeAnimation,DialogFooter,DialogButton,SlideAnimation,DialogTitle} from 'react-native-popup-dialog';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-picker';
import Feather from 'react-native-vector-icons/Feather';

export default class  BuyMedicine extends React.Component  {

  static navigationOptions  = ({ navigation }) => {
    return {
      title:"order with prescription",
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
  

  constructor(props) {
    super(props);
    this.state = {
      clk:false,
      document:null,
      dcname:"",
      gi:false,
      rid:props.navigation.getParam("receiverid"),

      srd:false,
      categoryarray:[],
       //for render view report
    vr:false,
    vrc:false,

    //for render view lab reports
    vlr:false,
    vlrc:false,

    total:0,
    is:""
    }
  }


  componentDidMount(){
    this.checkReports();
  }

  continue()
  {
    if(this.state.document!= null && this.state.dcname!="")
    {
     this.props.navigation.navigate("BuyMedicine2",{receiverid:this.state.rid,document:this.state.document,dcname:this.state.dcname,gi:this.state.gi,srd:this.state.srd})
    }else{
       alert("Please upload a prescription to continue")
    }
  }

  select(id,d,c)
{
const nda = this.state.categoryarray.map(obj => 
obj.aid === id ? { aid: id, d: d , select:true,count:c} : { aid: obj.aid, d: obj.d , select:false,count:obj.count});
this.setState({ categoryarray : nda ,document:d.document,dcname:d.documentname});
}


  checkReports()
{
  const currentUser  = auth().currentUser.uid
  const ref = firestore().collection("users").doc(currentUser).collection("MyReports").where(`category` , '==' ,'Prescriptions')
  ref.get().then((doc)=>{
    if(doc.size>0)
    {
      const arr=[];
      let i = 1;
      let t= 0
      doc.forEach(dd => {  
             t++;
            const select = false;
            const aid = dd.id;
            const d =dd.data()
            const obj = {d,select,aid,count:i++}
            arr.push(obj)
  }); 
      this.setState({total:t,categoryarray:arr})
    }else
    {
     this.setState({categoryarray:[]})
    }
  })
}

  uploadcameraimage = async () =>
{
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
      this.setState({document:URI,dcname:s,gi:false,srd:false});
}
  });
}


uploadgalleryimage = async () =>
{
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
      this.setState({document:URI,dcname:s,gi:true,srd:false});
    }
  });
}

vlrback(id)
{
  if(this.state.categoryarray.length>0)
  {
    const nda = this.state.categoryarray.map(obj => 
      obj.aid === id ? {aid: obj.aid, d: obj.d , select:false,count:obj.count } : { aid: obj.aid, d: obj.d , select:false,count:obj.count});
      this.setState({vlr: false,document:null,dcname:"",srd:false,categoryarray:nda})
    }else
    {
      this.setState({vlr: false,document:null,dcname:"",srd:false,categoryarray:[]})
    }
  
  
}

  renderTopBar(){
    return(
<Card style={{marginTop:-10}}>
               
           <CardItem>   
            <Left>
              <TouchableOpacity onPress={()=>{this.uploadcameraimage()}} style={{alignItems:"center"}}>
              <MaterialCommunityIcons   size={30} color="#307ecc" name="camera-outline" />
              <Text style={{marginTop:5,fontSize:15}}>Camera</Text>
              </TouchableOpacity>
              </Left>
      
              <Right>
                <TouchableOpacity onPress={()=>{this.uploadgalleryimage()}} style={{alignItems:"center"}}>
                <Entypo  size={30} color="#307ecc" name="image" />
                <Text style={{marginTop:5,fontSize:15}}>Gallery</Text>
                </TouchableOpacity>
              </Right>
            </CardItem>
</Card>
    )
  }

  renderSecure(){
    const  {document} = this.state;
    return(
      <View >
                 <View style={{marginLeft:10}}>
         <Text  style={{fontSize:13,color:"grey"}}>OR</Text>
<TouchableOpacity  
   onPress={()=>{
  if(this.state.categoryarray.length>0)
  {
    const nda = this.state.categoryarray.map(obj => 
      obj.aid === "*" ? {aid: obj.aid, d: obj.d , select:false,count:obj.count } : { aid: obj.aid, d: obj.d , select:false,count:obj.count});
      this.setState({categoryarray:nda,vr:true,vrc:true})
    }else{
      this.setState({vr:true,vrc:true})
    }
   }}
 
 style={{alignItems:"center",marginTop:5,flexDirection:"row"}}>
<Text style={{fontSize:14,color:"black",textDecorationLine:"underline",}}>Select From Prescription</Text>
<Feather  name="mouse-pointer" size={18} color="black" />
</TouchableOpacity>
         </View>

     {document == null ? (
       <View>


      <View style={{alignItems:"center",justifyContent:"center",marginTop:18}}>  
     <MaterialCommunityIcons  name="security" size={100} color="#de4949" />
     <View style={{margin:10}}>
     <Text style={{color:"#878787",fontSize:15,textAlign:"center"}}>Your attached prescription will be secure and private. Only our pharmacist will review it.</Text>
     </View>
     </View>

       </View>
 
    )
     :
     <View style={{padding:10,marginTop:10}}>  
     <Text style={{textTransform:"uppercase",fontSize:15,color:"#858585"}}>Attached  Prescription</Text>
     <View style={{flexDirection:"row",marginTop:20}}>
     <Image  source={{uri:document}} style={{width:120, height:150}}/>
     <MaterialCommunityIcons onPress={()=>{this.setState({document:null,dcname:"",srd:false})}}  name="close" size={25} color="red" />
     </View>
     
     </View> }
     
      
     </View>   
     
    )
  }

  renderDropDown()
  {
    return(
      <Card style={{marginTop:10}}>
          
              <CardItem  style={{flexDirection:"row",justifyContent:"space-between"}}>
              <Text  style={{fontSize:15,fontWeight:"700",color:"#545454"}}>Why upload a prescription ?</Text>
              {!this.state.clk
              ? 
              <TouchableOpacity onPress={()=>this.setState({clk:true})}> 
                <Fontisto   size={23} color="grey" name="arrow-down" />
              </TouchableOpacity>
             :
             <TouchableOpacity onPress={()=>this.setState({clk:false})}> 
             <Fontisto   size={23} color="grey" name="arrow-up" />
           </TouchableOpacity>}
              </CardItem>
       
       {this.state.clk ? (
        <CardItem style={{flexDirection:"column"}}>
        <View style={{flexDirection:"row",alignItems:"center"}}>
        <Entypo   size={20} color="black" name="mobile" />
        <Text style={{fontSize:12,color:"#878787",marginLeft:10}}>Never lose the digital copy of your prescription. It will be with you wherever you go.</Text>
        </View>
        <View style={{flexDirection:"row",alignItems:"center",marginTop:10}}>
        <MaterialCommunityIcons   size={20} color="black" name="android-messages" />
        <Text style={{fontSize:12,color:"#878787",marginLeft:10}}>Is your hard to understand? MedicalStore pharmacists will help uou in placing your order.</Text>
        </View>
        <View style={{flexDirection:"row",alignItems:"center",marginTop:10}}>
        <Entypo   size={20} color="black" name="lock" />
        <Text style={{fontSize:12,color:"#878787",marginLeft:10}}>Details from your prescription are not shared with any third party.</Text>
        </View>
        <View style={{flexDirection:"row",alignItems:"center",marginTop:10}}>
        <MaterialCommunityIcons   size={20} color="black" name="home-outline" />
        <Text style={{fontSize:12,color:"#878787",marginLeft:10}}>Government regulations require a prescription for orderimg some medicines.</Text>
        </View>
        </CardItem>
       ) : null}
      

         
</Card>
    )
  }

  renderValidGuide()
  {
return(
  <Card style={{backgroundColor:"white",marginTop:20,padding:10,marginBottom:20}}>
  <Text style={{color:"#545454",fontSize:15,fontWeight:"700"}}>Valid Prescription Guide</Text>
  <Text style={{color:"red",textAlign:"center",fontSize:14,marginTop:15}}>Image is sharp and not blured.{"\n"}Image isn't cropped.</Text>
  <Image  style={{
    alignSelf:"center",
    width: Dimensions.get('window').width - 50,
    height:400,
    borderRadius: 10,
    marginTop:20}}  source={require("../../assets/medi.jpg")}  />

    <View style={{flexDirection:"row",alignItems:"center",marginTop:20}}>
    <MaterialCommunityIcons  size={8} color="red" name="checkbox-blank-circle" /> 
     <Text style={{color:"#545454",fontSize:14,marginLeft:10}}>Include details of doctor and patient + clinic visit details.</Text> 
    </View>
   
    <View style={{flexDirection:"row",alignItems:"center",marginTop:10}}>
    <MaterialCommunityIcons  size={8} color="red" name="checkbox-blank-circle" /> 
     <Text style={{color:"#545454",fontSize:14,marginLeft:10}}>Medicines will be dispensed as per prescription.</Text> 
    </View>

  </Card>
)
  }

  renderBottom()
  {
    return(
<Button 
onPress={()=>{this.continue()}} style={{backgroundColor:"#307ecc",borderWidth:0.7,borderRadius:20,width:Dimensions.get('window').width - 30,marginBottom:10,alignSelf:"center"}}>
  <Text style={{fontSize:17,color:"white",fontWeight:"bold"}}>Continue</Text>
</Button>
    )
  }

  renderLabreports(){
    const {vr,total}= this.state;
    return(
      <Dialog
      dialogTitle={<DialogTitle title="Lab Reports" />}
      footer={
        <DialogFooter>
          <DialogButton
            text="Cancel"
            textStyle={{color:"#307ecc"}}
            onPress={() => {
              this.setState({vr: false})
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
        <DialogContent style={{width:Dimensions.get('window').width - 40,borderRadius:10}}>
        <View  style={{alignItems:"center",justifyContent:"center"}}>
         
         
        <TouchableOpacity  onPress={()=>{this.setState({vlr:true,vlrc:true})}} >
          <Card style={{elevation:5,marginTop:30,alignItems:"center",backgroundColor:"green",padding:10,width:150}}>
             <View style={{flexDirection:"row",justifyContent:"space-around"}}>
            
            <View style={{width:140,flexShrink:1}}> 
              <Text  style={{color:"white",fontSize:15,fontWeight:"bold"}}>
                Prescriptions
              </Text> 
            </View>
              <View>
               <Text  style={{color:"white",fontSize:14,fontWeight:"bold"}}>({total})</Text>
              </View>
            
  
         
             </View>
  
    </Card>
    </TouchableOpacity>


          </View>
        </DialogContent>
      </Dialog>
      )
    
  
  }

  renderViewLabreports(){
    const {vlr,categoryarray,document}= this.state;
    
    if(categoryarray.length>0)
    {
      this.item = categoryarray.map((d)=>{ 
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
    <Left>
     <Image onLoadStart={()=>{this.setState({is:"loading"})}}  onLoad={()=>{this.setState({is:"loaded"})}}  source={{uri:d.d.document}} style={{width:130, height:130}}  />
     {this.state.is == "loading" ?( <Spinner style={{position:"absolute",marginTop:40}} size="large" color="#307ecc"/>) : null}
  </Left>  
   </CardItem> 
  
  </Card>
   )  
      })
    }else{
      this.item  =  <Text style={{fontSize:18,color:"silver",textTransform:"capitalize",marginTop:"40%",textAlign:"center"}}> No record found</Text>
      }
  
    return(
      <Dialog
      dialogTitle={<DialogTitle title="Prescriptions"/>}
      footer={
        <DialogFooter>
          <DialogButton
            text="Back"
            textStyle={{color:"#307ecc"}}
            onPress={() => {       
              this.vlrback("*")
            }}
          />
           <DialogButton
            text="Select"
            textStyle={{color:"#307ecc"}}
            onPress={() => {
              if(document!=null)
              this.setState({vlr: false,vr:false,srd:true})
              else
              alert("Please select any image")
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
          {this.item}
          </View>
        </DialogContent>
        </ScrollView>
      </Dialog>
      )
    
  
  }

render(){
const  {vrc,vlrc} = this.state;
 
return( 
  <Container style={{backgroundColor:"#e8e8e8"}}>   
  {vrc && this.renderLabreports()}
  {vlrc && this.renderViewLabreports()}
  <Content>
          <ScrollView>
    {this.renderTopBar()}
    {this.renderSecure()}
    {this.renderDropDown()}
    {this.renderValidGuide()}          
          </ScrollView>
  </Content>
{this.renderBottom()}
       </Container>
  
)
     }
  };
  