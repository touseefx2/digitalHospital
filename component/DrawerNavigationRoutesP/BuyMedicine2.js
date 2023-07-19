import React  from 'react';
import {View,ScrollView,Image,TouchableOpacity,Dimensions,TextInput} from "react-native";
import { Container,Content,Card, CardItem, Left,Right,Text,ListItem, Radio,Label,Spinner} from 'native-base'
import {Button} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Dialog, { DialogContent,FadeAnimation,DialogFooter,DialogButton} from 'react-native-popup-dialog';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-picker';

export default class  BuyMedicine2 extends React.Component  {

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
      select1:null,
      select12:null,
      select13:null,

      select2:null,
      select3:null,

  
      s12t:"1",

      e:null,
      s13t:"",
      
      srd:props.navigation.getParam("srd"),
      document:props.navigation.getParam("document"),
      dcname:props.navigation.getParam("dcname"),
      rid:props.navigation.getParam("receiverid"),
      gi:props.navigation.getParam("gi"),

      text:"",
      clk:false,
      is:""
    }
  }



  select1()
  {
    this.setState({select1:true,select2:false,select3:false,select12:true,select13:false,e:true,text:"Order everything as per prescription",s13t:"For"})
  }

  select12()
  {
    this.setState({select1:true,select2:false,select3:false,select12:true,select13:false,s13t:"For",e:true})
  }

  select13()
  {
    this.setState({select1:true,select2:false,e:false,select3:false,select13:true,select12:false,s13t:"Duration or quantity of medicines as written by doctor"})
  }

  select2()
  {
    this.setState({select1:false,e:false,select2:true,select3:false,select12:false,select13:false,text:"Let me specify medicines & quantity",s13t:""})
  }

    select3()
    {
         this.setState({select1:false,select2:false,e:false,select3:true,select12:false,select13:false,text:"Chat/Call me for details",s13t:""}) 
    }


  continue()
  {
    const  {text,s13t,select12,s12t,select2,srd} = this.state;
    if(text != "")
    {  
    let x = false;
    const txt = text
    let ftext = ""
    let s13 = "";

    if(select2)
    {
      if(s13t==""){ alert("Please enter medicies name ,quantity"); x=true}
    }
 
   if(select12)
    {
    s13=s13t+" "+s12t+" days"
    ftext  = txt + "\n  " + s13
    }else{
      ftext  = txt + "\n  " + s13t
    }
  
     if(!x){
      this.props.navigation.navigate("BuyMedicine3",{receiverid:this.state.rid,document:this.state.document,dcname:this.state.dcname,text:ftext,gi:this.state.gi,srd:srd})
     }
 
    }else{
       alert("Please select any option")
    }
  }



  renderOptionBar(){
    const  {select1,select2,select3,select12,select13,s12t,e} = this.state;
    return(
<Card style={{marginTop:20}}>
 
  <View>
          <ListItem>
          <TouchableOpacity  style={{flexDirection:"row"}}  onPress={()=>this.select1()}>
           <Left>          
            <Text style={{fontSize:15}}>Order everything as per prescription</Text>
            </Left>
            <Right >
            <Radio color="#307ecc" selectedColor="#307ecc"  onPress={()=>this.select1()} selected={select1} />
            </Right>
           </TouchableOpacity>
           </ListItem>
          
            {select1 ? (
              <View  style={{marginLeft:25}}>
              <ListItem>
              <TouchableOpacity  style={{flexDirection:"row"}}  onPress={()=>this.select12()}>
              <Left style={{flexDirection:"row",alignItems:"center"}}>          
            <Text style={{fontSize:14}}>For   </Text>
            <TextInput   style={{width:40,textAlign:"center",fontSize:16}}  
            maxLength={3}
            defaultValue={s12t}
            editable={e}
       onChangeText={text => this.setState({s12t:text })}
       keyboardType={"number-pad"}
       underlineColorAndroid="underline"
/>
        <Label  style={{fontSize:14,color:"silver"}}> days</Label>    
             
            </Left>
            <Right >
            <Radio color="green" selectedColor="green"  onPress={()=>this.select12()} selected={select12} />
            </Right>
              </TouchableOpacity>
              </ListItem>

              <ListItem>
              <TouchableOpacity  style={{flexDirection:"row"}}  onPress={()=>this.select13()}>
              <Left>          
            <Text style={{fontSize:14}}>Duration or quantity of medicines as written by doctor</Text>
            </Left>
            <Right >
            <Radio color="green" selectedColor="green"  onPress={()=>this.select13()} selected={select13} />
            </Right>
              </TouchableOpacity>
              </ListItem>
              </View>   ): null}
     
 </View>

 <View>

          <ListItem>
          <TouchableOpacity  style={{flexDirection:"row"}}   onPress={()=>this.select2()}>
           <Left> 
              <Text style={{fontSize:15}}>Let me specify medicines {"&"} quantity</Text>
            </Left>
            <Right>
              <Radio selectedColor="#307ecc" color="#307ecc"  onPress={()=>this.select2()} selected={select2} />
            </Right>
            </TouchableOpacity>
          </ListItem>

           {select2 ? (
              <View  style={{marginLeft:25}}> 
              
      <TextInput   style={{}}  
       onChangeText={text => this.setState({s13t :text })}
      placeholder={"Medicine(s) name, quantity/duration"}
      multiline={true}
      numberOfLines={1}
      underlineColorAndroid='underline'
/>
<Label  style={{fontSize:13,color:"silver",marginLeft:10}}> e.g Panadol, 2 Strips</Label>
              </View>
           ) : null}

 </View>

         

          <ListItem>
          <TouchableOpacity  style={{flexDirection:"row"}}   onPress={()=>this.select3()}>
           <Left> 
              <Text style={{fontSize:15}}>Chat/Call me for details</Text>
            </Left>
            <Right>
              <Radio  color="#307ecc"  selectedColor="#307ecc" onPress={()=>this.select3()} selected={select3} />
            </Right>
            </TouchableOpacity>
          </ListItem>
</Card>
    )
  }



  renderDropDown()
  {
    
    return(
      <Card style={{marginTop:20,marginBottom:20}}>
          
              <CardItem  style={{flexDirection:"row",justifyContent:"space-between"}}>
              <Text  style={{fontSize:15,fontWeight:"700",color:"#545454",textTransform:"capitalize"}}>Attached prescription</Text>
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
        <CardItem>
       <Image  onLoadStart={()=>{this.setState({is:"loading"})}}  onLoad={()=>{this.setState({is:"loaded"})}} source={{uri:this.state.document}} style={{width:120, height:150}}/>
       {this.state.is == "loading" ?( <Spinner style={{position:"absolute",marginTop:40}} size="large" color="#307ecc"/>) : null}
        </CardItem>
       ) : null}
      

         
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

render(){

return( 
  <Container style={{backgroundColor:"#e8e8e8"}}>   
  <Content >
          <ScrollView>
    <Text style={{textTransform:"uppercase",color:"#858585",margin:7,fontSize:15}} >choose an options</Text>
    {this.renderOptionBar()}
    <Text style={{color:"#858585",margin:7,marginTop:15,fontSize:14}} >We dispense full strips of tablets/capsules</Text>
    {this.renderDropDown()}          
          </ScrollView>
  </Content>
{this.renderBottom()}
       </Container>
  
)
     }
  };
  