import React  from 'react';
import { StyleSheet,View,ScrollView,Image,ImageBackground} from "react-native";
import { Item, Input, Label,Icon,Form,Content,Container,Text,Spinner} from 'native-base';
import firestore from '@react-native-firebase/firestore';


 export default class SearchView extends React.Component  {
  constructor(props) {
    super(props);
    this.state={
      data:"",
      rateuser:null,
    }
  }

  static navigationOptions  = ({ navigation }) => {
    return { 
      title:navigation.getParam("receivername"),
            headerStyle: {
              backgroundColor: "#307ecc",
            },
            headerTintColor: '#fff',
          }
    };
  

    componentDidMount()
    {
      const rid = this.props.navigation.getParam("receiverid")
      const dbref = firestore().collection("users").doc(rid);
     this.unsubscribe = dbref.onSnapshot((doc)=>{
  if(doc.exists)
  {
    this.setState({data:doc.data()})
  }
  })

  this.unsubscribee = dbref.collection("rate").onSnapshot((d)=>{
    if(d.size>0)
    {
      const r=[];
      d.forEach(e => {
        r.push(e.data())
        //for dyncmy update name in rate user data
        this.unsubscribeee =   firestore().collection("users").doc(e.data().userid).onSnapshot((u)=>{
         dbref.collection("rate").doc(e.id).update({
                  username:u.data().username,
                  userphoto:u.data().photo,
              })    
        })
      });
      this.setState({rateuser:r})
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

    renderprofile()
    { 
      const {data,rateuser} = this.state;
      if(data!="")
      {
        if(rateuser!=null)
  {
    console.log(rateuser)
this.item  = this.state.rateuser.map((d)=>{
 return(
  <RateCard  name={d.username} photo={d.userphoto} comment={d.comment} ratings={d.ratings} create={d.createdAt} />
 )
})
  }else{
    this.item  = null;
  }

        return(
          <Container >
          <Content>
          <ImageBackground style={styles.header}>
                <Image style={styles.avatar} source={{uri:data.photo}}/>
                </ImageBackground> 
          
                <Form style={{padding:20,marginTop:50,margin:10,padding:30}}>
                      <Item floatingLabel>
                        <Label>Name</Label>
                        <Input editable={false} value={data.username} />
                      </Item>
                      <Item floatingLabel>
                        <Label>Email</Label>
                        <Input editable={false} value={data.email} />
                      </Item>
                      <Item floatingLabel>
                        <Label>Phone</Label>
                        <Input editable={false} value={data.phone} />
                      </Item>
                      <Item floatingLabel>
                        <Label>Speciality</Label>
                        <Input editable={false} value={data.speciality} />
                      </Item>
                      <Item floatingLabel>
                        <Label>City</Label>
                        <Input editable={false} value={data.address.city} />
                      </Item>
                      <Item floatingLabel>
                        <Label>Country</Label>
                        <Input editable={false} value={data.address.country} />
                      </Item>
                      <Item floatingLabel>
                        <Label>Service Time</Label>
                        <Input editable={false} value={data.service_time} />
                      </Item>
                      <Item floatingLabel>
                        <Label>Fees</Label>
                        <Input editable={false} value={data.fees} />
                      </Item>
                      <Item floatingLabel>
                        <Label>Open</Label>
                        <Input  style={{marginTop:10}} 
                                multiline={true}
                                numberOfLines={0}
                                scrollEnabled={true}
                                onContentSizeChange={(e) => {
                                const  numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
                                 }}
                                 editable={false} value={JSON.stringify(data.available).split('"').join("").split('[').join("").split(']').join("").split(',').join(" , ")} />
                      </Item>
                      <Item floatingLabel>
                        <Label>Addrress</Label>
                        <Input  style={{marginTop:10}} 
                                multiline={true}
                                numberOfLines={0}
                                scrollEnabled={true}
                                onContentSizeChange={(e) => {
                                const  numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
                                 }}
                                 editable={false} value={data.address.address} />
                      </Item>
                      <Item floatingLabel>
                        <Label>About</Label>
                        <Input  style={{marginTop:10}} 
                                multiline={true}
                                numberOfLines={0}
                                scrollEnabled={true}
                                onContentSizeChange={(e) => {
                                const  numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
                                 }}
                                 editable={false} value={data.about} />
                      </Item>
               </Form>
          <Text style={{fontWeight:"bold",marginLeft:10}}>Ratings and reviews :</Text>
{this.item}
          </Content>
          </Container>
          
              )
      } 

    }

render(){
return(
      <View style={styles.container}>  
       {this.renderprofile()}
      </View>
)
     }

  };


const styles = StyleSheet.create({
  container:
  {
    flex:1,
    backgroundColor:"#f0fbff"
  },
  header:{
   // backgroundColor: "#00BFFF",
   backgroundColor:"#307ecc",
    height:170,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:12
  },
  name:{
    color: "black",
    fontWeight:"bold",
    fontSize:19,
    textAlign:"center",
    marginTop:73,
  },
inputitem:{
  fontSize:15,
  color:"#292929"
},
  Item:{
marginTop:10,
borderColor:"#00BFFF",
borderWidth:1,
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
});
 
