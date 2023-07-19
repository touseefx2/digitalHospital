import React  from 'react';
import { View, StyleSheet,Text} from "react-native";
import firestore from '@react-native-firebase/firestore';
import RateScreenCardM from "./RateScreenCardM";
import { ScrollView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

 export default  class RateScreenM extends React.Component{

  static navigationOptions  = ({ navigation }) => {
    return {
      title:"Rating",
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
    this.state={
      rating:[]
    }
  }

  componentDidMount()
  {
    const did = auth().currentUser.uid
    const dbref1 = firestore().collection("users");
    const dbref2 = firestore().collection("users").doc(did).collection("rating");
    
     
        this.subscriby  = dbref2.onSnapshot((doc)=>{
        if(doc.size>0)
        {
          let r =[]
          doc.forEach(e => {           
            
            this.subscribyy = dbref1.onSnapshot((doc)=>{
            if(doc.size>0)
            {
              doc.forEach(d=> {
                if(d.data().uid == e.data().userid )
                {
                  dbref2.doc(e.id).update({
                    username:d.data().username,
                    userphoto:d.data().photo
                  })
                }
              });
            }
            })
            
            
            r.push(e.data())         
          });
          this.setState({rating:r})
        }
        
        })



  }

  componentWillUnmount()
  {
    if(this.subscriby) {
      this.subscriby();
      }
      if(this.subscribyy) {
        this.subscribyy();
        }
  }

 render()
 {
  const  {rating} = this.state;
  if(rating.length>0)
  {
    this.item = rating.map((e)=>{
      return(
     <RateScreenCardM e = {e}/>
         )
    })
  } else{ return <Text style={{fontSize:30,color:"silver",marginTop:"40%",textAlign:"center"}}>Empty</Text>}

  return(
    <View style={styles.container}>
    <ScrollView> 
{this.item}
    </ScrollView>
        </View>
  )}

 }

const styles= StyleSheet.create({

  container:
  {
    flex:1
  },

});
