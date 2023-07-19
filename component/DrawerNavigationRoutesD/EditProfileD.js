import React, { Component } from 'react';
import { StyleSheet,Text,View,TextInput,ToastAndroid,TouchableOpacity,ScrollView,ActivityIndicator} from 'react-native';
import { Item, Input, Icon ,Spinner,Container,Content,Label } from 'native-base';
import auth from '@react-native-firebase/auth';
import { Button } from 'react-native-paper';
import moment from "moment";
import firestore from '@react-native-firebase/firestore';
import Dialog, { DialogContent,FadeAnimation} from 'react-native-popup-dialog';
import DropDownPicker from 'react-native-dropdown-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import {connect} from "react-redux"

class EditProfileD extends Component {

  constructor(props)
  {
    super(props);
    this.state = {

    name:props.myuser.username,
    st:props.myuser.service_time,
    available:props.myuser.available,
    city:props.myuser.address.city,
    speciality:props.myuser.speciality,
    cityItem:[],
    spcltyItem:[],
    about:props.myuser.about,
    address:props.myuser.address.address,
    fees:props.myuser.fees,
    qualification:props.myuser.qualification,
    slots:props.myuser.slots ,
    duration:props.myuser.duration,


      ftime:"",
      ftime2:"",
      ftampm:"" || "PM",
      stime:"",
      stime2:"",
      stampm:"" || "PM",
      istsLoader:false,
      ists:null,

     namesaveload:false,//render
     nsload:false, //for vsbl invsbl 
 }
}

changename= async () =>
{
  const {st,name,available,city,fees,about,address,speciality,ftime,ftime2,ftampm,stime,stime2,stampm,duration,slots,qualification} = this.state;
  
  if(st!="")
  {
    var firstTime= ftime+":"+ftime2+" "+ftampm;
    var endTime  = stime+":"+stime2+" "+stampm;
    var service_time = firstTime+"-"+endTime;
  }else
  {
    var service_time = ""
  }

  this.setState({namesaveload:true,nsload:true})
  const update = {
    displayName:name,
  };
  await auth().currentUser.updateProfile(update).then(()=>
  {
      const dbref =   firestore().collection("users").doc(this.props.myuser.uid);
      dbref.update({
        username:name,
        service_time:service_time,
        duration:duration,
        about:about,
        slots:slots,
        qualification:qualification,
        available:available,
        speciality:speciality,
        fees:fees,
        address:{
          city:city,
          address:address,
          country:"Pakistan"
          }
      }).then(
        () => { 
          this.setState({nsload:false}),
          ToastAndroid.showWithGravity(
            "save  successfully ",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM);
        }
      )
    
}).catch((error)=>{
  this.setState({nsload:false}),
  ToastAndroid.showWithGravity(
  "save not successfully"+error,
  ToastAndroid.LONG,
  ToastAndroid.BOTTOM);
})

}

componentDidMount()
{
  const {st,slots}  = this.state;
  this.clctspcltyitem()
  if(st!="")
  {
    var ftm =st.substring(0, st.indexOf(':'))
    var s=st.split(":")
    var ftm2 =s[1].substring(0,2) 
    var ss=st.split("-")
    var ftampm = ss[0].slice(-2)
  
    var stm =ss[1].substring(0, ss[1].indexOf(':'))
    var d=ss[1].split(":")
    var stm2 =d[1].substring(0,2) 
    var stampm = d[1].slice(-2)
  
    this.setState({ftime:ftm,ftime2:ftm2,ftampm:ftampm,stime:stm,stime2:stm2,stampm:stampm})
  }  
  if(slots!="")  { this.setState({ists:true})} else { this.setState({ists:false})}
}


clctspcltyitem()
{
     this.subscriby  = firestore().collection("dropdownitems").onSnapshot((doc)=>{
      if(doc.size>0)
      {
       let  ctyi = []; let  si = [];
        doc.forEach(data=>{
        const cti  = data.data().city;
        const spi  = data.data().specialist;
         ctyi=cti ;  si=spi ; 
        });
  
  
        this.setState({ cityItem:ctyi,spcltyItem:si})
       }else
      {
        this.setState({ cityItem:[],spcltyItem:[]})
      }
     })

}

componentWillUnmount()
{
  if(this.subscriby) {
    this.subscriby();
    } 
  }


createTimeSslots()
{
    const {ftime,ftime2,ftampm,stime,stime2,stampm,duration} = this.state;
    
    if(ftime !="" && ftime2 !="" && ftampm !="" && stime !="" && stime2 !="" && stampm !="" && duration != "" )
    {
      var firsttime= ftime+":"+ftime2+" "+ftampm;
      var endtime  = stime+":"+stime2+" "+stampm;
      let startTime = moment(firsttime,"hh:mm A");
      let endTime = moment(endtime,"hh:mm A");
      if(endTime.isBefore(startTime)){ endTime.add(1,"day")}
      let arr = [];
      while(startTime<=endTime)
      {
        arr.push(new moment(startTime).format("hh:mm A"))
        startTime.add(parseInt(duration),"minutes")
      }
  
      if(arr.length>0)
      {
        setTimeout(() => {
          this.setState({istsLoader:false,slots:arr,ists:true})
        }, 1200);
       
      }
    }else{
      alert("Please enter  full service time and duration")
      this.setState({istsLoader:false})
    }
 
}

deleteSlots(k)
{
   const {slots} = this.state;
   const index = slots.indexOf(k)
   if (index > -1) { slots.splice(index, 1) } 
   this.setState({slots:slots})
}


renderets()
{
  return(
    <View style={{alignSelf:"center",marginTop:10,width:"85%",height:"50%",backgroundColor:"#307ecc"}}>  
     <Text style={{fontSize:20,color:"silver"}}>Empty Time Slots</Text>
    </View>
)
}

renderts()
{
  const {slots} = this.state;
  if(slots.length>0)
  {

    this.slotsarr = slots.map((k)=> {
      return (                 
      
          <View style={{margin:10,padding:10,backgroundColor:"white",borderRadius:20,flexShrink:1,flexDirection:"row",justifyContent:"center",alignItems:"center"}} >
          <Text style={{textAlign:"center",fontSize:14}}>{k}</Text>
          <TouchableOpacity   style={{marginLeft:10}}onPress={()=>{this.deleteSlots(k)}}
        >
         <Entypo name="cross" size={24} color="#ff2b39" />
       </TouchableOpacity>
          </View>
         
       
      
)
  })

    return(
       <ScrollView>
        <View style={{alignSelf:"center",marginTop:10,width:"90%",height:"100%",backgroundColor:"#307ecc",borderRadius:20,flexDirection:"row",flexWrap:"wrap",justifyContent:"center",alignItems:"center"}}>  
        {this.slotsarr}
        </View>
        </ScrollView>
    )
  }
}

rendernamesaveload()
{

  return(
  <Dialog
    visible={this.state.nsload}
    style={{padding:10}}
    onHardwareBackPress={() => true}
    dialogAnimation={new FadeAnimation({
      initialValue: 0, 
      animationDuration: 150,
      useNativeDriver: true,
    })}
  >
    <DialogContent>
     <Spinner size="large" color="blue"/>
    </DialogContent>
  </Dialog>

  )
}

renderprofile()
{ 
  const {name,qualification,available,city,about,address,speciality,duration,ftampm,stampm,fees,ftime,ftime2,stime,stime2,spcltyItem,cityItem} = this.state;
  this.CityItems=cityItem.map(element=>{
    return {label: element, value: element};
  });
  this.SpcltyItems=spcltyItem.map(element=>{
    return {label: element, value: element};
  });
  return(
  <View style={{margin:15,padding:15}}>
           
           <Item style={{marginTop:50}} floatingLabel>
              <Label>User Name</Label>
              <Input  value={name}  onChangeText={(txt)=>this.setState({name:txt})}
              multiline={true}
              numberOfLines={1}
              underlineColorAndroid='transparent'  
             editable={false} />
            </Item>

            <Item style={{marginTop:20}} floatingLabel>
              <Label>Fees</Label>
              <Input keyboardType={"number-pad"} value={fees}  onChangeText={(txt)=>this.setState({fees:txt})} />
            </Item>

            <Item style={{marginTop:20}} floatingLabel>
              <Label>Qualification</Label>
              <Input value={qualification}  onChangeText={(txt)=>this.setState({qualification:txt})} />
            </Item>
                    
                      <View style={{marginTop:20}}> 
                      <Label style={{color:"silver"}}>Available</Label>             
    <DropDownPicker
    items={[
        {label: 'Monday', value: 'Mon'},
        {label: 'Tuesday', value: 'Tue'},
        {label: 'Wednesday', value: 'Wed'},
        {label: 'Thursday', value: 'Thu'},
        {label: 'Friday', value: 'Fri'},
        {label: 'Saturday', value: 'Sat'},
        {label: 'Sunday', value: 'Sun'}
    ]}
    multiple={true}
multipleText="%d items have been selected."
min={0}
max={7}
   defaultValue={available}
    placeholder="Available"
    placeholderStyle={{ textAlign: 'center'}}
  containerStyle={{width: 170, height:50}}
    style={{backgroundColor: '#fafafa',paddingVertical: 10}}
    itemStyle={{justifyContent: 'flex-start'}}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => {
      this.setState({
      available: item })
      }}
/>    
                     </View>

                     <View style={{marginTop:20}}  >
                     <Label style={{color:"silver"}}>Speciality</Label>
<DropDownPicker
 items={this.SpcltyItems}
    placeholder="Speciality"
    placeholderStyle={{ textAlign: 'center'}}
  containerStyle={{width: 170, height:50}}
    style={{backgroundColor: '#fafafa',paddingVertical: 10}}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => this.setState({
        speciality: item.value
    })}
/>    
</View>

<View style={{marginTop:20 }}  >
<Label style={{color:"silver"}}>City</Label>
<DropDownPicker
     items={this.CityItems}
    placeholder="City"
    placeholderStyle={{ textAlign: 'center',}}
  containerStyle={{width: 170, height:50}}
    style={{backgroundColor: '#fafafa',paddingVertical: 10}}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => this.setState({
        city: item.value
    })}
/>    
</View>


<Item  style={{marginTop:30}}  floatingLabel>
                        <Label>Address</Label>
                        <Input  value={address}  onChangeText={(txt)=>this.setState({address:txt})}
                        multiline={true}
                       numberOfLines={0}
                       scrollEnabled={true}
                       onContentSizeChange={(e) => {
                        const numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
                       }} />
                      </Item>

                      


                      <Item  style={{marginTop:30}}  floatingLabel>
                        <Label>About</Label>
                        <Input  value={about}  onChangeText={(txt)=>this.setState({about:txt})}
                        multiline={true}
                       numberOfLines={0}
                       scrollEnabled={true}
                       onContentSizeChange={(e) => {
                        const numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
                       }} />
                      </Item>

{/* time slots edit */}
                      <Text style={{marginTop:15,fontSize:15,color:"Black"}}>Service Time : </Text>
                      <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:15}} > 
<TextInput  style={{width: 40, height:40,backgroundColor:"white",fontSize:16,borderColor:"black",borderWidth:0.7,textAlign:"center"}}
 onChangeText={text => this.setState({ftime :text })}
 defaultValue={ftime}
 maxLength={2}
 keyboardType="number-pad"
/>
<TextInput  style={{width: 40, height:40,backgroundColor:"white",fontSize:16,borderColor:"black",borderWidth:0.7,textAlign:"center"}}
 onChangeText={text => this.setState({ftime2 :text })}
 defaultValue={ftime2}
 maxLength={2}
 keyboardType="number-pad"
/>
<DropDownPicker
    items={[
        {label: 'AM', value: 'AM'},
        {label: 'PM', value: 'PM'},
    ]}
    defaultValue={ftampm} 
    placeholderStyle={{ textAlign: 'center'}}
    containerStyle={{width: 65, height:40}}
    style={{backgroundColor: '#fafafa',paddingVertical: 10}}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => this.setState({
        ftampm: item.value
    })}
/> 
<Text style={{fontSize:20,alignSelf:"center"}}>-</Text>
<TextInput  style={{width: 40, height:40,backgroundColor:"white",fontSize:16,borderColor:"black",borderWidth:0.7,textAlign:"center"}}
 onChangeText={text => this.setState({stime :text })}
 defaultValue={stime}
 maxLength={2}
 keyboardType="number-pad"
/>
<TextInput  style={{width: 40, height:40,backgroundColor:"white",fontSize:16,borderColor:"black",borderWidth:0.7,textAlign:"center"}}
 onChangeText={text => this.setState({stime2 :text })}
 defaultValue={stime2}
 maxLength={2}
 keyboardType="number-pad"
/>
<DropDownPicker
    items={[
        {label: 'AM', value: 'AM'},
        {label: 'PM', value: 'PM'},
    ]}
    defaultValue={stampm} 
    placeholderStyle={{ textAlign: 'center'}}
    containerStyle={{width: 65, height:40}}
    style={{backgroundColor: '#fafafa',paddingVertical: 10}}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => this.setState({
        stampm: item.value
    })}
/>

</View>
<View style={{flexDirection:"row",marginTop:17}} >
<Text style={{marginTop:15,fontSize:15,margin:7}}>Duration : </Text>
<TextInput  style={{width: 40, height:40,backgroundColor:"white",fontSize:16,borderColor:"black",borderWidth:0.7,textAlign:"center",alignSelf:"center"}}
 onChangeText={text => this.setState({duration :text })}
 defaultValue={duration}
 maxLength={2}
 keyboardType="number-pad"
/>
<Text style={{fontSize:15,marginLeft:10,alignSelf:"center"}}>minutes</Text>
</View>

<View style={{flexDirection:"row",justifyContent:"space-between"}} >
<Button mode="contained" style={{width:170,backgroundColor:"#00BFFF",marginTop:40,borderWidth:1,borderRadius:20,elevation:2}} onPress={()=>{this.setState({istsLoader:true}),this.createTimeSslots()}}>
  <Text style={{color:"white",fontSize:12}}>Create Time Slots</Text>
</Button> 
{this.state.istsLoader  == true ?  <ActivityIndicator size="small" color="blue" /> : null }
<Button mode="contained" style={{width:90,backgroundColor:"#00BFFF",marginTop:40,borderWidth:1,borderRadius:20,elevation:2}} onPress={()=>{this.changename()}} >
  <Text style={{color:"white",fontSize:14}}>Save</Text>
</Button> 
</View>






</View>


)
}

  render() {
    const {namesaveload,ists} = this.state;
    return (
      <Container >
      <Content>
         {this.renderprofile()}
         {namesaveload && this.rendernamesaveload() }
         {ists && this.renderts()}
         {ists==false && this.renderets()} 
         </Content>
    </Container>

  
    );
  }

}

const styles = StyleSheet.create({
  header:{
   // backgroundColor: "#00BFFF",
   backgroundColor:"#307ecc",
    height:117,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 83,
    borderWidth: 4,
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
 
const  mapStateToProps = (state) => 
{
  return{
 myuser:state.userd
        }
}

export default connect(mapStateToProps)(EditProfileD); 