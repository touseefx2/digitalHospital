import React  from 'react';
import { StyleSheet,View,Text} from "react-native";
import ShowDoctorsCardS from "./ShowDoctorsCardS";
import {Button} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import {connect} from "react-redux"
import DropDownPicker from 'react-native-dropdown-picker';
import firestore from '@react-native-firebase/firestore';

 class  SearchScreen extends React.Component  { 

  static navigationOptions  = ({ navigation }) => {
    return {
      tabBarVisible: false, 
      title:"Doctors List",
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
      city:"",
      speciality:"",
      specialityItems:[],
      cityItem:[],
      aid:props.navigation.getParam("aid")
    }

  }
  

  clctspcltyitem()
  {
       this.subscriby  = firestore().collection("dropdownitems").onSnapshot((doc)=>{
        if(doc.size>0)
        {
          let spi = [];  let  ctyi = [];
          doc.forEach(data=>{
          const si  = data.data().specialist;
          const cti  = data.data().city;
          spi=si ;  ctyi=cti
          });

          this.setState({ specialityItems:spi,cityItem:ctyi})
         }else
        {
          this.setState({ specialityItems: [],cityItem:[]})
        }
       })

   
  }

  componentDidMount= ()=>{
  this.clctspcltyitem()
  }


componentWillUnmount()
{
    if(this.subscriby) {
      this.subscriby();
      }
}

onrefresh =()=>
{
  this.setState({city:null,speciality:null})
}

render(){  
  const {city,speciality,specialityItems,cityItem} = this.state;
const cityy =   city== null ? "" : city
const specialityy =   speciality== null ? "" : speciality

  this.CityItems=cityItem.map(element=>{
    return {label: element, value: element};
  });
  this.spcltyItems=specialityItems.map(element=>{
    return {label: element, value: element};
  });

  let x=false; 
 if(this.props.mydoctorusers)
  {  
      this.item = this.props.mydoctorusers.map( (doctoraccount) =>{ 
        
            if(cityy != "" && specialityy != "")
         {
          if(doctoraccount.address.city == cityy &&  doctoraccount.speciality == specialityy )
          { 
            x=true;
            return(
              <ShowDoctorsCardS navigate={this.props.navigation.navigate} d={doctoraccount}/>
            )
          }
          }
            
});
  }

return(
      <View style={styles.container}>

      <View style={{margin:20,marginTop:20}}>
      <DropDownPicker
   items={this.CityItems} 
searchable={true}
defaultValue={city}
searchablePlaceholder="Search for an item"
searchablePlaceholderTextColor="gray"
searchableError={() => <Text>Not Found</Text>}
    placeholder="Location"
   placeholderStyle={{ textAlign: 'center'}}
  containerStyle={{width: 170, height:40}}
    style={{backgroundColor: 'white',paddingVertical: 10,borderColor:"#307ecc"}}
    dropDownStyle={{backgroundColor: 'white'}}
    onChangeItem={item => this.setState({
        city: item.value
    })}
    
/> 
<View  style={{marginTop:10}}>
<DropDownPicker
     items={this.spcltyItems} 
    searchable={true}
    defaultValue={speciality}
searchablePlaceholder="Search for an item"
searchablePlaceholderTextColor="gray"
searchableError={() => <Text>Not Found</Text>}
    placeholder="Speciality"
    placeholderStyle={{ textAlign: 'center'}}
  containerStyle={{width: 170, height:40}}
  style={{backgroundColor: 'white',paddingVertical: 10,borderColor:"#307ecc"}}
  dropDownStyle={{backgroundColor: 'white'}}
    onChangeItem={item => this.setState({
        speciality: item.value
    })}
/>  
</View> 
      </View>    
<Button onPress={()=>{this.onrefresh()}}  style={{backgroundColor:"#307ecc",borderRadius:5,width:80,position:"absolute",right:0,margin:50}}>
  <Text style={{color:"white",fontSize:14}}>Clear</Text>
</Button>
<View  style={{width:"100%",height:0.3,backgroundColor:"#307ecc"}} />
  {cityy !="" && specialityy !="" && (
    <Text  style={{fontSize:14,margin:5,color:"grey"}}>Search Result</Text>
  )}
       <ScrollView >
       <View style={{marginTop:"10%",flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",margin:7}}>
        {(cityy!="" && specialityy !="" && x) &&  this.item}
        {(cityy!="" && specialityy !="" && !x) &&  <Text> No Record found</Text>}
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
  }
});


const  mapStateToProps = (state) => 
{
  return{
 mydoctorusers:state.Alldoctoruser,
        }
}



export default connect(mapStateToProps)(SearchScreen); 