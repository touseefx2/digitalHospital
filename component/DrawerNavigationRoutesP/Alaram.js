import React  from 'react';
import { StyleSheet,View,ToastAndroid,Text} from "react-native";
import Dialog, { DialogContent,FadeAnimation,DialogFooter,DialogButton} from 'react-native-popup-dialog';
import DateTimePickerModal from "react-native-modal-datetime-picker";;
import {createAlarm, getAlarms,deleteAllAlarms} from 'react-native-simple-alarm';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SoundPlayer from 'react-native-sound-player'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput } from 'react-native-paper';

 export default class Alaram extends React.Component  {
  constructor(props) {
    super(props);
    this.state =
    {
      isCreateAalarm:false,
      isDateTimePickerVisible: false,
       msg:"",
       dmsg:"Medicine Remainder",
      //for msginput dialog
     ld:false,       // for vsbl 
     msgload:false,  //render
      
    }
  }

getAlarms = async () => {
  try {
    const alarms = await getAlarms();
    console.log("alaram : " ,alarms)
  } catch (e) {}
}

deleteAllAlarms = async () => {
  try {
    await deleteAllAlarms();
  } catch (e) {}
}

hideDatePicker = () => {
  this.setState({isDateTimePickerVisible:false});
}

addAlarm = async (date) => {
  const {msg,dmsg} = this.state;
    await createAlarm({
      message_id: "123" ,
      active: true,
      date: date,
      message: msg || dmsg ,
      autoCancle:false,
      snooze:0.5,
      soundName: "alarm.mp3",
      actions: '["Open","Off"]',
      visibility:"public",
    }).then((d)=>{
     console.log(d)
     ToastAndroid.showWithGravity(
      "Success",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM)
      this.setState({msg:""})
    })
  }


handleConfirm = (date) => {
  console.warn("A date has been picked: ", date);
  if(date)
  {
    this.hideDatePicker();
    this.addAlarm(date);
  }
  else
  {
    alert('Please Select date or time  for Create Alarm');
  }
};


renderMessageAboutAlarm()
{
  return(
  <Dialog
  footer={
    <DialogFooter>
      <DialogButton
        text="cancel"
        onPress={() => {this.setState({ld:false,isCreateAalarm:true,isDateTimePickerVisible:true,msg:""})}}
      />
      <DialogButton
        text="ok"
        onPress={() => {this.setState({ld:false,isCreateAalarm:true,isDateTimePickerVisible:true})}}
      />
    </DialogFooter>
  }
    visible={this.state.ld}
    style={{padding:10}}
    onTouchOutside={() => {
      this.setState({ld: false ,msg:""});
    }}
     onHardwareBackPress={() => true}
    dialogAnimation={new FadeAnimation({
      initialValue: 0, // optional
      animationDuration: 150, // optional
      useNativeDriver: true, // optional
    })}
  >
    <DialogContent>
    <TextInput 
    style={{height:120,width:200,fontSize:18,marginTop:7}}
      onChangeText={text => this.setState({ msg :text })}
      placeholder={"Note (Optional)"} placeholderTextColor={"silver"}
      defaultValue={this.state.msg}
/>
    </DialogContent>
  </Dialog>

  )

}


renderDateTimePicker()
{
  return(
    <View>
 <DateTimePickerModal
        isVisible={this.state.isDateTimePickerVisible}
        mode='datetime'
        date={new Date()}
        minimumDate={new Date()}
        onConfirm={(d)=>this.handleConfirm(d)}
        onCancel={()=>this.hideDatePicker()}
      />
    </View>
  )
}


render(){
  const {isCreateAalarm,msgload} = this.state;
return(  
      <View style={styles.container}>  

    <TouchableOpacity style={{marginTop:70}} onPress={()=>{this.props.navigation.navigate("AlarmList")}}>
    <Text style={{color:"#095c3f",fontSize:19,alignSelf:"center",textDecorationLine:"underline"}}>REMINDER LIST</Text>
      </TouchableOpacity>

      <View style={{position: 'absolute', bottom: 0,justifyContent:"center",alignItems:"center",marginBottom:40}}>
      <TouchableOpacity  onPress={()=>{ this.setState({msgload:true,ld:true})}}>
      <MaterialCommunityIcons size={170}  style={{alignSelf:"center"}}  name="alarm-plus" color="silver"  />
      <Text style={{color:"#307ecc",fontSize:18,alignSelf:"center",fontWeight:"bold"}}>CREATE MEDICINE REMINDER</Text>  
      </TouchableOpacity>
      </View>

   {isCreateAalarm && this.renderDateTimePicker()}
   {msgload  && this.renderMessageAboutAlarm()}
      </View>
)
     }

  };

  

const styles= StyleSheet.create({

  container:
  {
    flex:1,
    backgroundColor:"#f0fbff",
    alignItems:"center"
  }
});
