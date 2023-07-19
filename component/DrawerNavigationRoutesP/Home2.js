import React  from 'react';
import {View,Text} from "react-native";
import ShowDoctorsCard from "./ShowDoctorsCard";
import { Container,Content } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { Searchbar } from 'react-native-paper';
import {connect} from "react-redux"

class  Home2 extends React.Component  {
  
  static navigationOptions  = ({ navigation }) => {
    return {
      tabBarVisible: false,
      title:navigation.getParam("spclty"),
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
      search:"",
      total:props.navigation.getParam("total"),
      spclty:props.navigation.getParam("spclty"),
      cuid:props.navigation.getParam("cuid"),
    }
  }

 


render(){  
  const  {search,cuid,spclty} = this.state;
 if(this.props.mydoctorusers)
  {
     this.item = this.props.mydoctorusers.map( (doctoraccount) =>{
     if(search=="" && doctoraccount.speciality == spclty )
     {
            return(
              <ShowDoctorsCard cuid={cuid} navigate={this.props.navigation.navigate}  d={doctoraccount}   />
            )
            
     }else if(search != "" && doctoraccount.speciality == spclty)
     {
        const s= search.toLowerCase();
        const dname = doctoraccount.username.toLowerCase() 
        const sl = s.length;  const dn =  dname.substr(0, sl);
       if(s==dn)
       {
        return(
          <ShowDoctorsCard cuid={cuid}  navigate={this.props.navigation.navigate} d={doctoraccount}     />
        )
       } 
     }
   });
  }else{  this.item  =  <Text style={{fontSize:30,color:"silver",marginTop:"40%",textAlign:"center"}}>No Record Found</Text>}

  


return( 
  <Container >
    <Searchbar placeholder="Search doctor by name" placeholderTextColor="silver" style={{elevation:4,marginTop:1}} onChangeText={t=>this.setState({search:t})} value={this.state.search}  />
  <Content>
          <ScrollView>
          <View style={{marginTop:"10%",flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",margin:7}}>
            {this.item}
            </View>   
          </ScrollView>
  </Content>
       </Container>
)
     }

  };

  
  const  mapStateToProps = (state) => 
  {
    return{
   mydoctorusers:state.Alldoctoruser,
          }
  }
  
  export default connect(mapStateToProps)(Home2); 