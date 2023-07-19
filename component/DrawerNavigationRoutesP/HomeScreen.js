import React  from 'react';
import { StyleSheet,View,TouchableOpacity,Text,Image} from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome'; //icon
import { ScrollView } from 'react-native-gesture-handler';
import { Item, Input, Form ,Container,Content,Label,Spinner} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import {connect} from "react-redux"
import auth from '@react-native-firebase/auth';

 class  HomeScreen extends React.Component  {
  static navigationOptions  = ({ navigation }) => {
    return {
      title:"Dr. Profile",
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
      cuid:props.navigation.getParam("cuid"),
      dctr:props.navigation.getParam("d"),
      rating:0,
      is:""
    }
  }


  componentDidMount()
  {
    this.subscribyy  = firestore().collection("users").doc(this.state.dctr.uid).collection("rating").onSnapshot((doc)=>{
        if(doc.size>0)
        {
          let i=0;
          doc.forEach(e => {
          i++;
          });
        this.setState({rating:i})
        }else
        {
          this.setState({rating:0})
        }
       })
    
     }

  componentWillUnmount()
  {
      if(this.subscribyy) {
        this.subscribyy();
        } 
  }

  CheckndCreateRoom (friendid)  
  {
    return new Promise((resolve,reject)=>{
      const currentuserid =   auth().currentUser.uid ;
      const receiverid = friendid;    
      const user = { [friendid]:true, [currentuserid]:true }  
      const senderinfo ={name:"",photo:"",status:"",lastonline:"",type:""}
      const receiverinfo ={name:"",photo:"",status:"",lastonline:"",type:""}
      const lastMessageCreatedAt = "";
      //check kro ye room pehly ka to ni bna hwa agr bna ha to use me sare msg jane chaie naya na bane
firestore().collection("chatrooms")
.where(`user.${friendid}` , '==' , true)
.where(`user.${currentuserid}` , '==' , true).get().then((docs)=>{

  let room = {}; //khali objct hamesah true hta ha 
docs.forEach(snapshot => {
  room = snapshot.data();
  room.id = snapshot.id;
});

if(!room.id)
{
  //create room 1st time chat btw two user
  room = { user, createdAt : Date.now(), lastMessage:"",lastMessageCreatedAt,senderid:currentuserid,receiverid:receiverid,receivernotification:true,sendernotification:true,senderinfo,receiverinfo,senderlastread:true,receiverlastread:true}
  firestore().collection("chatrooms").add(room).then((res)=>{
    room.id = res.id;
    resolve(room);
  })
 }
 else
 { 
   resolve(room);
 }
})
  
   })

  }



  renderProfile()
  {
    const  {dctr,rating,is} = this.state;
    if(this.props.mydoctorusers){
      this.item =  this.props.mydoctorusers.map( (d) =>{
      if(d.uid == dctr.uid  )
      {
       
        return(  
          <View>
        <View style={{flexDirection:"row",alignItems:"center"}} > 
        
        <View style={{margin:5,padding:5}}>
        <Image onLoadStart={()=>{this.setState({is:"loading"})}}  onLoad={()=>{this.setState({is:"loaded"})}} 
          style={{height:140,width:140,borderRadius:70,backgroundColor:null}} 
        source={{uri:d.photo}}/>
       {is == "loading" ?( <Spinner style={{position:"absolute",marginTop:30,alignSelf:"center"}} size="large" color="#307ecc"/>) : null}
        {d.status == "online" ?
        (<FontAwesome   style={{alignItems:"center",alignSelf:"center",marginTop:-20,marginLeft:110,justifyContent:"center"}} name="circle" size={14}   color="#1cd949"  />)
        :<FontAwesome   style={{alignItems:"center",alignSelf:"center",marginTop:-20,marginLeft:110,justifyContent:"center"}} name="circle" size={14}  color="#de3c3c"  /> } 
        </View>
        <View style={{flexShrink:1,marginRight:3,marginLeft:5}}>
        {d.username.length >31 ?
           (
           <Text   style={styles.name}>Dr. {`${d.username.substring(0, 31)}..`}</Text>
           ) :
           <Text style={styles.name}>Dr. {d.username}</Text>
        }
        </View>
       
        </View>
        
        <TouchableOpacity onPress={()=>{this.props.navigation.navigate("RateScreen",{did:dctr.uid})}}   style={{marginTop:7,alignSelf:"flex-end",marginRight:10}} >
          <Text style={{color:"yellow",backgroundColor:"#307ecc",borderRadius:7,textTransform: 'capitalize',fontSize:14,padding:5}}>Rating and Reviews ({rating})</Text>
        </TouchableOpacity >
        

          <Form  style={{margin:15,padding:15}}>


          <Item  floatingLabel >
                      <Label style={{textTransform:"capitalize",fontSize:15}}>Service Time</Label>
                      <Input style={{textTransform:"capitalize",fontSize:15}} editable={false} value={d.service_time} />
                    </Item>
                   
          <Item  floatingLabel  >
                      <Label style={{textTransform:"capitalize",fontSize:15}}>Available</Label>
                      <Input style={{textTransform:"capitalize",fontSize:15}} 
                       multiline={true}
                       numberOfLines={1}
                       underlineColorAndroid='transparent'  
                        editable={false} 
                        value={JSON.stringify(d.available).split('"').join("").split('[').join("").split(']').join("").split(',').join(" , ")}  />
                      </Item>
                   

                   

                    <Item  floatingLabel >
                      <Label style={{textTransform:"capitalize",fontSize:15}}>Phone</Label>
                      <Input style={{textTransform:"capitalize",fontSize:15}} editable={false} value={d.phone} />
                    </Item>
        
                   
                    <Item floatingLabel >
                      <Label style={{textTransform:"capitalize",fontSize:15}}>E-mail</Label>
                      <Input style={{fontSize:15}}   value={d.email}
                       multiline={true}
                       numberOfLines={1}
                       underlineColorAndroid='transparent'  
                      editable={false} 
                         />
                    </Item>
  
                    <Item floatingLabel >
                      <Label style={{textTransform:"capitalize",fontSize:15}}>Fees</Label>
                      <Input style={{textTransform:"capitalize",fontSize:15}} editable={false} value={d.fees} />
                    </Item>
  
                    <Item floatingLabel >
                      <Label style={{textTransform:"capitalize",fontSize:15}}>Qualification</Label>
                      <Input style={{textTransform:"capitalize",fontSize:15}} editable={false} value={d.qualification} />
                    </Item>

                    <Item  floatingLabel >
                      <Label style={{textTransform:"capitalize",fontSize:15}}>Name</Label>
                      <Input style={{textTransform:"capitalize",fontSize:15}}
                       multiline={true}
                       numberOfLines={1}
                       underlineColorAndroid='transparent'   
                        editable={false} 
                        value={d.username}  />
                      </Item>
  
                    <Item floatingLabel >
                      <Label style={{textTransform:"capitalize",fontSize:15}}>Country</Label>
                      <Input style={{textTransform:"capitalize",fontSize:15}} editable={false} value={d.address.country} />
                    </Item>
        
                    <Item floatingLabel >
                      <Label style={{textTransform:"capitalize",fontSize:15}}>City</Label>
                      <Input style={{textTransform:"capitalize",fontSize:15}} editable={false} value={d.address.city} />
                    </Item>
  
        
                    <Item floatingLabel >
                      <Label style={{textTransform:"capitalize",fontSize:15}}>Address</Label>
                      <Input  style={{textTransform:"capitalize",fontSize:15}}
                                       multiline={true}
                                       numberOfLines={1}
                                       underlineColorAndroid='transparent'
                                        editable={false} 
                                        value={d.address.address} />
                    </Item>
        
                    
                  </Form>
       
        </View>
        )
        }else{
          return null
        }
      }) 
  }

  return(
    <View>
      {this.item}
    </View>
  )
  
}
  
  renderBottomBar(){
    const  {dctr} = this.state;
    return(
      <View style={{backgroundColor:"black",height:50,flexDirection:"row"}}>
      
      <TouchableOpacity 
      onPress={()=>{ this.props.navigation.navigate("BookAppointment",{receiverid:dctr.uid,catg:dctr.speciality})}}
       style={{height:50,backgroundColor:"black",padding:25,justifyContent:"center"}} >
        <Text style={{color:"white",textTransform: 'capitalize',fontSize:17,marginTop:-6}}>Book Appointment</Text>
      </TouchableOpacity >

      <View style={{backgroundColor:"white",height:49,width:1}}/>

      <TouchableOpacity 
       onPress={async ()=>{
       const room = await this.CheckndCreateRoom(dctr.uid);
       this.props.navigation.navigate("StoChatScreen",{roomid:room.id,name:dctr.username,photo:dctr.photo,receiverid:room.receiverid,senderid:room.senderid}) }}      
       style={{height:50,backgroundColor:"black",padding:25,justifyContent:"center"}} >
        <Text style={{color:"white",textTransform: 'capitalize',fontSize:17,marginTop:-6}}>Chat</Text>
      </TouchableOpacity >

      <View style={{backgroundColor:"white",height:49,width:1}}/>

      <TouchableOpacity 
      onPress={()=>{this.props.navigation.navigate("Rate",{receiverid:dctr.uid})}} 
      style={{height:50,backgroundColor:"black",padding:25,justifyContent:"center"}} >
        <Text style={{color:"white",textTransform: 'capitalize',fontSize:17,marginTop:-6}}>Rate</Text>
      </TouchableOpacity >

    </View>
   
    )
  }

render(){  

return(
  <Container>
  <Content>
          <ScrollView >
            <View>
            {this.renderProfile()}
            </View>
          </ScrollView> 
    </Content>
    {this.renderBottomBar()}
    </Container>

)

    }
  };

  
  const styles = StyleSheet.create({
    name:{
      color: "#307ecc",
      fontWeight:"bold",
      fontSize:20,
      textTransform: 'capitalize',
    },
  inputitem:{
    fontSize:16,
    color:"black",
  },
    Item:{
  marginTop:10,
  
    },

  });
   
  const  mapStateToProps = (state) => 
  {
    return{
   mydoctorusers:state.Alldoctoruser,
          }
  }
  
  export default connect(mapStateToProps)(HomeScreen); 