import React  from 'react';
import { StyleSheet,View,TouchableOpacity,Text} from "react-native";
import {Avatar} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; //icon
import { ScrollView } from 'react-native-gesture-handler';
import { Item, Input, Form ,Container,Content,Label } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

 export default class  ViewProfile extends React.Component  {

  static navigationOptions  = ({ navigation }) => {
    return {
      title:"Pt. Profile",
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
      ptid:props.navigation.getParam("receiverid"),
      d:null
    }
  }


  componentDidMount()
  {
    this.subscribyy  = firestore().collection("users").doc(this.state.ptid).onSnapshot((doc)=>{
        if(doc.exists)
        {
        this.setState({d:doc.data()})
        }else
        {
          this.setState({d:null})
        }
       })
    
     }

  componentWillUnmount()
  {
      if(this.subscribyy) {
        this.subscribyy();
        } 
  }



  renderProfile()
  {
    const  {d,ptid} = this.state;
    if(d!= null){
        return(  
          <View>
        <View style={{flexDirection:"row",alignItems:"center"}} > 
        
        <View style={{margin:5,padding:5}}>
        <Avatar.Image  style={styles.avatar} size={140} source={{uri:d.photo}}/>
        {d.status == "online" ?
        (<FontAwesome   style={{alignItems:"center",alignSelf:"center",marginTop:-20,marginLeft:110,justifyContent:"center"}} name="circle" size={14}   color="#1cd949"  />)
        :<FontAwesome   style={{alignItems:"center",alignSelf:"center",marginTop:-20,marginLeft:110,justifyContent:"center"}} name="circle" size={14}  color="#de3c3c"  /> } 
        </View>
        <View style={{flexShrink:1,marginRight:3,marginLeft:5}}>
        {d.username.length >31 ?
           (
           <Text   style={styles.name}>Pt. {`${d.username.substring(0, 31)}..`}</Text>
           ) :
           <Text style={styles.name}>Pt. {d.username}</Text>
        }
        </View>
       
        </View>
        

        
          <Form  style={{margin:15,padding:15}}>


                   

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
  

                    <Item  floatingLabel >
                      <Label style={{textTransform:"capitalize",fontSize:15}}>Name</Label>
                      <Input style={{textTransform:"capitalize",fontSize:15}}
                       multiline={true}
                       numberOfLines={1}
                       underlineColorAndroid='transparent'   
                        editable={false} 
                        value={d.username}  />
                      </Item>

                      <Item  floatingLabel >
                      <Label style={{textTransform:"capitalize",fontSize:15}}>Gender</Label>
                      <Input style={{textTransform:"capitalize",fontSize:15}} editable={false} value={d.gender} />
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
     
      } else{ return null}

  }

  

render(){  

return(
  <Container>
  <Content>
          <ScrollView >
            {this.renderProfile()}
          </ScrollView> 
    </Content>
    </Container>

)

    }
  };

  
  const styles = StyleSheet.create({
    avatar: {
      elevation:10,
      alignItems:"center",
      justifyContent:"center",
    },
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
   
