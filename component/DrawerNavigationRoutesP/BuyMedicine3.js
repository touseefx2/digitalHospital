import React  from 'react';
import {View,ScrollView,TouchableOpacity,Dimensions,ToastAndroid} from "react-native";
import { Container,Content,Card, CardItem, Left,Text, Radio,Label,Body,Form, Item, Input,Spinner} from 'native-base'
import {Button} from 'react-native-paper';
import {connect} from "react-redux"
import RNFetchBlob from 'rn-fetch-blob'
import storage from '@react-native-firebase/storage';
import Dialog, { DialogContent,FadeAnimation,DialogFooter,SlideAnimation,DialogTitle} from 'react-native-popup-dialog';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';



class  BuyMedicine3 extends React.Component  {

  static navigationOptions  = ({ navigation }) => {
    return {
      title:"order info",
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

      name:this.props.myuser.username,
      address:this.props.myuser.address.address || "",
      city:this.props.myuser.address.city || "",
      phone:this.props.myuser.phone ,
      dlvry:null,
      category:"Prescriptions",

      select1:false,
      s1t:"",

      da:[],
      srd:props.navigation.getParam("srd"),

      docfolder:`Documents/Patients/MyReportsDoc/${auth().currentUser.uid}/Prescriptions`,
     
      m:null, //mdcal user data
      document:props.navigation.getParam("document"),
      dcname:props.navigation.getParam("dcname"),
      rid:props.navigation.getParam("receiverid"),
      cid:auth().currentUser.uid,
      option:props.navigation.getParam("text"),
      gi:props.navigation.getParam("gi"),

      cld:false,
      upd:false,

      ld:false,
      load:false,
    }
  }

  componentDidMount()
  {
  const {rid,srd}  = this.state 
  console.log("srd",srd)
  const db = firestore().collection("users").doc(rid)
  db.get().then((doc)=>{
  if(doc.exists){
    this.setState({m:doc.data()})
  }else{this.setState({m:null})}
  })

  this.unsubscribe = db.collection("deliveryMethod").onSnapshot((doc)=>{
if(doc.size>0)
{
let a=[];
doc.forEach(da => {
const d = da.data();
const select = false;
const aid = da.id;
const obj = {d,select,aid}
a.push(obj)
});
this.setState({da:a})
}else{
this.setState({da:[]})
}
  })
  }

  
componentWillUnmount()
{
  if(this.unsubscribe) {
    this.unsubscribe();
    }
  }
 

  select(id,d)
  {
  const nda = this.state.da.map(obj => 
  obj.aid === id ? { aid: id, d: d , select:true} : { aid: obj.aid, d: obj.d , select:false});
  this.setState({ da : nda ,dlvry:d});
  }

  uploaddocumentfirebase = async (uri,docname,orderid,gi) =>
{
  try{
      const {docfolder} = this.state;
     
      if(gi){
        const urii =  await RNFetchBlob.fs.stat(uri)
        storage().ref(`${docfolder}/${docname}`)
        .putFile(urii.path)
        .then((snapshot) => {
          //You can check the image is now uploaded in the storage bucket
          this.getdocfirebase(docname,orderid);
        }).catch((e) => {console.log('uploading dcmnt gi firebase error => ', e)});
      }else{
        storage().ref(`${docfolder}/${docname}`)
        .putFile(uri)
        .then((snapshot) => {
          //You can check the image is now uploaded in the storage bucket
          this.getdocfirebase(docname,orderid);
        }).catch((e) => {console.log('uuploading dcmnt firebase error => ', e)});
      }
     

  }catch (e){
 console.log('uploading dcmnt firebase error => ',e)
  }
  
  }

  getdocfirebase = async (docname,oid) =>
  {
    const {docfolder} = this.state;
     await storage().ref(`${docfolder}/${docname}`)
      .getDownloadURL()
      .then((url) => {
        //from url you can fetched the uploaded image easily
        this.setState({document:url,dcname:docname}) 
        this.saveordertodb(oid)
      })
      .catch((e) => console.log('getting downloadURL of image error => ', e));
    }

saveordertodb(oid){
  const {cid,rid,m,name,address,city,phone,dlvry,option,document,dcname,category} = this.state;
  const ref = firestore().collection('orders');
  ref.add({
    patientid:cid,
    mid:rid,
    orderid:oid,
    address:address,
    city:city,
    cancelby:"",
    createdat:Date.now(),
    cancelreason:"",
    exist:false,
    phone:phone,
    name:name,
    total:"",
    maddress:m.address,
    memail:m.email,
    dlvry,
    option,
   ptemail:this.props.myuser.email,
   minfo:{
      name :m.username,
      photo:m.photo,      
      phone:m.phone,      
    },
    document:document,
    documentname:dcname,
    orderstatus:"Pending",
    orderdate:firestore.FieldValue.serverTimestamp()
  }).then( (d)=>{  
     ref.doc(d.id).update({createdat:Date.now()});
     const currentUser  = auth().currentUser.uid;
      const report = {
        title:"*Order Prescription",
        document:document,
        documentname:dcname,
        category:category,    
        exist:false, 
        createdat:new Date()
      };
      const ref2 = firestore().collection("users").doc(currentUser).collection("MyReports");
      const ref3 = firestore().collection("users").doc(currentUser).collection("MyReports").where(`category` , '==' ,'Prescriptions');
      ref3.get().then((doc)=>{
      if(doc.size>0)
      {
       let c = false;
       doc.forEach(d => {
         if(category == d.data().category && dcname == d.data().documentname )
          {c =true}
       });
       if(!c){
        ref2.add(report).then(
          this.setState({ld:false}),
          ToastAndroid.showWithGravity(
          "Success",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM),
          this.props.navigation.navigate("MedicalScreen")
            ).catch(e=>console.log("cnfrm app erre , ",e))
       }else{
         console.log("sorry this dcmnt name is already in prescrpn category");
         this.setState({ld:false}),
          ToastAndroid.showWithGravity(
          "Success",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM),
          this.props.navigation.navigate("MedicalScreen")}
      }else{
        ref2.add(report).then(
          this.setState({ld:false}),
          ToastAndroid.showWithGravity(
          "Success",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM),
          this.props.navigation.navigate("MedicalScreen")
            ).catch(e=>console.log("cnfrm app erre , ",e))
      }
      })

      
   
  }).catch(e=>console.log("cnfrm app erre , ",e))

}

  continue()
  {
  const {name,address,city,phone,dlvry,document,dcname,gi,srd} = this.state;
  if(dlvry==null)
  {alert("Please select any delivery option")}
  else if(address == "" || name == ""   || phone == "" || city == "" ) 
  {alert("Please update addrress or other info")}
  else{
    this.setState({ld:true,load:true})
    const db = firestore().collection("orders")
     db.get().then((doc)=>{ 
      const min = 1;
      const max = 1000000000;
      const rand = min + Math.random() * (max - min);
      let orderid= JSON.stringify(rand).substring(0,6);

      if(doc.size>0)
      {
        doc.forEach(da => {
          const d = da.data()
          console.log(d)
          if(orderid==d.orderid)
          {
            const min = 1;
            const max = 1000000000;
            const rand = min + Math.random() * (max - min);
            orderid= JSON.stringify(rand).substring(0,6);
          }
        });

        if(!srd){
          this.uploaddocumentfirebase(document,dcname,orderid,gi)
        }else{
          this.saveordertodb(orderid)
        }
       

      }else{

        if(!srd){
          this.uploaddocumentfirebase(document,dcname,orderid,gi)
        }else{
          this.saveordertodb(orderid)
        }
   
      

      }
    })

    

  }
  }

  updcontinue()
  {
    const {name,address,city,phone} = this.state;
  if(name=="" || address=="" || city=="" || phone=="")
  {alert("Please fill empty fields")}
  else{
    let reg = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/;
    if (reg.test(phone) === false || phone.length < 13 || phone.length >13  ) {
      alert("Phone  pattern in invalid please correct pattern  \n Example : +923071234567")
    }
    else {
     this.setState({cld:false})
    }
  }
  }

  renderOptionBar(){
    const  {da} = this.state;
  if(da.length > 0)
  {
    this.item = da.map((d)=>{
       return( 
<Card style={{marginTop:30}}>
 
 <CardItem style={{backgroundColor:"#cccccc"}}>
   <Left>
     <TouchableOpacity  onPress={()=>this.select(d.aid,d.d)}  style={{flexDirection:"row"}}>
     <Radio color="#307ecc" selectedColor="#307ecc"   onPress={()=>this.select(d.aid,d.d)} selected={d.select}  />
   <Text style={{fontSize:14,fontWeight:"bold",color:"#3b3b3b",textTransform:"capitalize"}}>{d.d.name}</Text>
     </TouchableOpacity>
   </Left>
 </CardItem>

 <CardItem>
       <Text style={{fontSize:14}}>{d.d.workingdays} working days</Text>     
 </CardItem>

 <View style={{backgroundColor:"#cccccc",height:1}}  />
 
 <CardItem>
 <Text style={{fontSize:14,fontWeight:"bold",color:"#6e6e6e"}}>Delivery fee : RS {d.d.fee}</Text>
 </CardItem>

 

</Card>
       )
    
      })
    }else{return null}

    return(
      <View>
 {this.item}
      </View>
    )
  }

  renderTopBar(){
    const {name,address,city,phone} = this.state;
      return(
        <Card style={{marginTop:-10,elevation:7}}>
                   <CardItem style={{padding:5,marginTop:10}}>
                      <Left>
                      <MaterialCommunityIcons name="home" color="#307ecc" size={20}   />
                        <Body>   
                          <View>                       
                          {name.length > 15 ? (
                          <Text  style={{textTransform:"capitalize",fontSize:15,fontWeight:"700",color:"black"}}>Deliver to {`${this.props.myuser.username.substring(0, 15)}..`}</Text>
                        ) :
                        <Text  style={{textTransform:"capitalize"}}>Deliver to {name}</Text> }    
                        <Text  style={{fontSize:13,color:"black",marginTop:3}}>{phone}</Text>
                        <Text  style={{fontSize:13,color:"black"}}>{address},{city}</Text>
                        
                         </View>              
                        </Body>   
                        <TouchableOpacity onPress={()=>{this.setState({upd:true,cld:true})}}>
                    <Text  style={{color:"#307ecc",fontSize:15,fontWeight:"700"}}>EDIT</Text>
                    </TouchableOpacity>             
                      </Left>
                    </CardItem>           
                    
        </Card>
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
        dialogTitle={<DialogTitle  title="Please wait..." />}
      >
        <DialogContent>
         <Spinner size="large" color="blue"/>
        </DialogContent>
      </Dialog>
    
      )
    
    }



  renderBottom()
  {
    return(
<Button 
onPress={()=>{this.continue()}} style={{borderWidth:0.5,backgroundColor:"#307ecc",borderRadius:5,width:Dimensions.get('window').width - 30,marginBottom:10,alignSelf:"center"}}>
  <Text style={{fontSize:17,color:"white",fontWeight:"bold"}}>Cofirm delivery</Text>
</Button>
    )
  }

  renderUpdateBottom()
  {
    return(
<Button 
onPress={()=>{this.updcontinue()}} style={{backgroundColor:"#307ecc",width:Dimensions.get('window').width}}>
  <Text style={{fontSize:17,color:"white",fontWeight:"bold"}}>update address</Text>
</Button>
    )
  }

  renderUpdate()
{
  const {name,address,city,phone,cld} = this.state;
  return(
  <Dialog
    visible={cld}
    footer={
      <DialogFooter>
        {this.renderUpdateBottom()}
      </DialogFooter>
    }
    onHardwareBackPress={() => true}
    dialogAnimation={new SlideAnimation({
      slideFrom: 'top',
      initialValue: 0, // optional
      useNativeDriver: true, // optional
    })}
     dialogTitle={<DialogTitle  title="Manage Address" />}
  >
    <ScrollView>
    <DialogContent style={{width:Dimensions.get('window').width,marginTop:10}}>
  
     <Form style={{padding:10,marginTop:10}}>
        
            <Item floatingLabel>
              <Label>Name</Label>
              <Input  value={name}  onChangeText={(txt)=>this.setState({name:txt})} 
              multiline={true}
              numberOfLines={1} />
            </Item> 

            <Item floatingLabel>
              <Label>Phone</Label>
              <Input value={phone}  onChangeText={(txt)=>this.setState({phone:txt})}  />
            </Item> 

            <Item floatingLabel>
              <Label>City</Label>
              <Input  value={city}  onChangeText={(txt)=>this.setState({city:txt})} />
            </Item>

            <Item floatingLabel>
              <Label>Address</Label>
              <Input  value={address}  onChangeText={(txt)=>this.setState({address:txt})} 
              multiline={true}
              numberOfLines={1} />
            </Item> 

        
      </Form>

    </DialogContent>
    </ScrollView>  
  </Dialog>
  )

}


render(){
return( 
  <Container>   
{this.renderTopBar()}
  <Content >
    {this.state.upd && this.renderUpdate()}
    {this.state.load && this.renderDocload()}
          <ScrollView>
           {this.renderOptionBar()}
          </ScrollView>
  </Content>
{this.renderBottom()}
       </Container>
  
)
     }
  };
  

  const  mapStateToProps = (state) => 
{
  return{
 myuser:state.user,
        }
}

export default connect(mapStateToProps)(BuyMedicine3); 