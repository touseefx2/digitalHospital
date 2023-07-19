import React, { Component } from 'react';
import { StyleSheet,Text,View,Image,TouchableOpacity,ToastAndroid} from 'react-native';
import { Item, Input,Spinner,Container,Content, Label,Form } from 'native-base';
import auth from '@react-native-firebase/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob'
import Dialog, { DialogContent,DialogFooter,DialogButton,FadeAnimation,DialogTitle} from 'react-native-popup-dialog';
import {connect} from "react-redux"

 class UserProfileD extends Component {

  constructor(props)
  {
    super(props);
    this.state = {
     dbuser:null,
     user:null,
//for upldng prgs dialog
     ld:false,       // for vsbl 
     picload:false,  //render
//fo clck camera btn dialog option
     mv:false, //for dialog viible
     c:false, //chk camera btn pres or not if true then mv true and show dialog and mv false is invsble dialog render

     imagefolder:`Photos/Doctors/profilePictures/${this.props.myuser.uid}/`,

 }
}


 componentDidMount ()
{    console.log("cdm cal prfl d")
     const user = auth().currentUser;
     this.setState({user:user})
 }

 componentWillUnmount()
 {
  console.log("cdunmnt cal prfl d")
 }

changeNndSt= async (un,st) =>
{
  const {user} = this.state;
  this.setState({namesaveload:true,nsload:true})
  const update = {
    displayName:un,
  };
  await auth().currentUser.updateProfile(update).then(()=>
  {
    const dbref =   firestore().collection("users").doc(this.props.myuser.uid);
    dbref.update({
        username:un,
        service_time:st
      })
    
        setTimeout(() => {
      this.setState({nsload:false}),
      ToastAndroid.showWithGravity(
        "save  successfully ",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM);
     },400)   ;
  }).catch((error)=>{
    ToastAndroid.showWithGravity(
    "save not successfully"+error,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM);
  })
}

uploadcameraimagefirebase = async (uri,imageName) =>
{
  const {imagefolder} = this.state;
  //const stat = await RNFetchBlob.fs.stat(selectedPictureUri) || null //ye camere pic uri me kam ni kre ga
  
    storage().ref(`${imagefolder}${imageName}`)
    .putFile(uri)
    .then((snapshot) => {
      //You can check the image is now uploaded in the storage bucket
      console.log(snapshot);
      console.log(`${imageName} has been successfully uploaded.`);
      this.getdpimagefirebase(imageName);
    }).catch((e) => {console.log('uploading image error => ', e)});
  }

  uploadgalleryimagefirebase = async (uri,imageName) =>
{
  const {imagefolder} = this.state;
  const stat = await RNFetchBlob.fs.stat(uri) || null //ye camere pic uri me kam ni kre ga
  console.log(stat);
    storage().ref(`${imagefolder}${imageName}`)
    .putFile(stat.path)
    .then((snapshot) => {
      //You can check the image is now uploaded in the storage bucket
      console.log(snapshot);
      console.log(`${imageName} has been successfully uploaded.`);
      this.getdpimagefirebase(imageName);
    }).catch((e) => {console.log('uploading image error => ', e)});
  }

getdpimagefirebase = async (imageName) =>
{
  const { imagefolder} = this.state;
    storage().ref(`${imagefolder}${imageName}`)
    .getDownloadURL()
    .then((url) => {
      //from url you can fetched the uploaded image easily
      this.changpic(url);
    })
    .catch((e) => console.log('getting downloadURL of image error => ', e));
  }

changpic= async (pic) =>
{
  const {user} = this.state;
  const update = {
  photoURL:pic 
  };
  await auth().currentUser.updateProfile(update).then(()=>
  {
      const dbref =   firestore().collection("users").doc(this.props.myuser.uid);
      dbref.update({
        photo:pic
      })

      console.log("photo url also update in database dctr : "+pic)
   
    setTimeout(() => {
      this.setState({ld:false}),
    ToastAndroid.showWithGravity(
      "upload  successfully ",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM);
     },1800)
     
  }).catch((error)=>{
    ToastAndroid.showWithGravity(
    "upload not successfully"+error,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM);
  })
}

uploadcameraimage = async () =>
{
  this.setState({mv:false})
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
 
  ImagePicker.launchCamera(options , (response) => {
   
    console.log('Response = ', response);
    if (response.didCancel) {
      ToastAndroid.showWithGravity(
       "cancel",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM);
    } else if (response.error) {
      ToastAndroid.showWithGravity(
        response.error.toString(),
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM);
      console.log('ImagePicker Error: ', response.error);
    } else {
      const URI =  response.uri ;
      console.log('response', URI);
      this.setState({
      picload:true,ld:true
      });
      this.uploadcameraimagefirebase(URI,response.fileName);
    }
  });
}


uploadgalleryimage = async () =>
{
  this.setState({mv:false})
  let options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
 
  ImagePicker.launchImageLibrary(options , (response) => {
   
    console.log('Response = ', response);
    if (response.didCancel) {
      ToastAndroid.showWithGravity(
       "cancel",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM);
    } else if (response.error) {
      ToastAndroid.showWithGravity(
        response.error.toString(),
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM);
      console.log('ImagePicker Error: ', response.error);
    } else {
      const URI =  response.uri ;
      console.log('response',URI);
      this.setState({
      picload:true,ld:true
      });
     this.uploadgalleryimagefirebase(URI,response.fileName);
    }
  });
}

renderpickerdialog()
{
  return(  
  <Dialog
    visible={this.state.mv}
    style={{padding:10}}
    footer={
      <DialogFooter>
        <DialogButton
          text="Cancel"
          textStyle={{color:"#307ecc"}}
          onPress={() => {this.setState({mv:false})}}
        />
      </DialogFooter>
    }
    dialogTitle={<DialogTitle title="Upload From" />}
    onTouchOutside={() => {this.setState({mv: false });}}
    onHardwareBackPress={() => true}
    dialogAnimation={new FadeAnimation({
      initialValue: 0, // optional
      animationDuration: 150, // optional
      useNativeDriver: true, // optional
    })}
  >
    <DialogContent>
     <View style={{marginTop:23,justifyContent:"space-between"}}>
     <TouchableOpacity onPress={()=>{this.uploadcameraimage()}}>
<Text style={{fontSize:19}}>CAMERA{'\n'}{'\n'}</Text>
</TouchableOpacity>
<TouchableOpacity onPress={()=>{this.uploadgalleryimage()}}>
<Text style={{fontSize:19}}>GALLERY</Text>
</TouchableOpacity>
</View>
    </DialogContent>
  </Dialog>
  )

}

renderpicload()
{
  return(
  <Dialog
    visible={this.state.ld}
    style={{padding:10,height:400}}
    // onTouchOutside={() => {
    //   this.setState({ld: false });
    // }}
    dialogAnimation={new FadeAnimation({
      initialValue: 0, // optional
      animationDuration: 150, // optional
      useNativeDriver: true, // optional
    })}
  >
    <DialogContent>
     <Text style={{fontSize:16}}>Uploading Progress....</Text>
     <Spinner size="large" color="blue"/>
    </DialogContent>
  </Dialog>

  )

}




renderprofile()
{ 
return(
  <View>

  <View style={{flexDirection:"row",alignItems:"center",backgroundColor:"#307ecc"}} > 

<View style={{margin:5,padding:5}}>
<Image style={styles.avatar} source={{uri:this.props.myuser.photo}}/>
<TouchableOpacity onPress={()=>{this.setState({c:true,mv:true})}} style={{backgroundColor:"#bfbfbf",width:35,height:35,alignItems:"center",alignSelf:"center",borderRadius:17.5,borderColor:"white",borderWidth:2,marginTop:-35,marginLeft:110,justifyContent:"center"}}>
<FontAwesome name="camera" size={23}  color="#363636"  />
</TouchableOpacity>
</View>
<View style={{flexShrink:1,marginRight:3,marginLeft:6}}>
      {this.props.myuser.username.length >30?
         (
         <Text   style={styles.name}>Dr. {`${this.props.myuser.username.substring(0, 30)}..`}</Text>
         ) :
         <Text style={styles.name}>Dr. {this.props.myuser.username}</Text>
  }
      </View>
</View>

<Button mode="contained" style={{width:80,backgroundColor:"#307ecc",margin:10,borderWidth:1,borderRadius:20,elevation:7}} onPress={()=>{this.props.navigation.navigate("EditProfileD")}} >
  <Text style={{color:"white",textTransform: 'capitalize',}}>Edit</Text>
</Button>


  <Form style={{margin:15,padding:15}}> 

  <Item  floatingLabel style={{borderColor:"black"}} >
                      <Label >Name</Label>
                      <Input style={{textTransform:"capitalize"}}
                       multiline={true}
                       numberOfLines={1}
                       value={this.props.myuser.username}
                       underlineColorAndroid='transparent'   
                        editable={false}       />
                      </Item>


            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Phone</Label>
              <Input value={this.props.myuser.phone} style={{textTransform: 'capitalize',}} editable={false} />
            </Item>


            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>E-mail</Label>
              <Input value={this.props.myuser.email}  editable={false} 
              multiline={true}
              numberOfLines={1}
              underlineColorAndroid='transparent'  
             editable={false}/>
            </Item>

            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Gender</Label>
              <Input value={this.props.myuser.gender} style={{textTransform: 'capitalize',}} editable={false} />
            </Item>

            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Service Time</Label>
              <Input value={this.props.myuser.service_time} style={{textTransform: 'capitalize',}} editable={false} />
            </Item>

            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>PMDC Number</Label>
              <Input value={this.props.myuser.pmdc_num} style={{textTransform: 'capitalize',}} editable={false} />
            </Item>

            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Cnic</Label>
              <Input value={this.props.myuser.cnic} style={{textTransform: 'capitalize',}} editable={false} />
            </Item>

            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Fees</Label>
              <Input value={this.props.myuser.fees} style={{textTransform: 'capitalize',}} editable={false} />
            </Item>

            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Speciality</Label>
              <Input value={this.props.myuser.speciality} style={{textTransform: 'capitalize',}} editable={false} />
            </Item>

            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Qualification</Label>
              <Input value={this.props.myuser.qualification} style={{textTransform: 'capitalize',}} editable={false} />
            </Item>

            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Country</Label>
              <Input value={this.props.myuser.address.country} style={{textTransform: 'capitalize',}} editable={false} />
            </Item>

            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>City</Label>
              <Input value={this.props.myuser.address.city} style={{textTransform: 'capitalize',}} editable={false} />
            </Item>


            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Open</Label>
              <Input  style={{textTransform: 'capitalize',}}
                                multiline={true}
                                numberOfLines={0}
                                scrollEnabled={true}
                                onContentSizeChange={(e) => {
                                const  numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
                                 }}
                                 editable={false} value={JSON.stringify(this.props.myuser.available).split('"').join("").split('[').join("").split(']').join("").split(',').join(" , ")} />
            
            </Item>


            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>Address</Label>
              <Input  style={{textTransform: 'capitalize',}}
                                multiline={true}
                                numberOfLines={0}
                                scrollEnabled={true}
                                onContentSizeChange={(e) => {
                                const  numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
                                 }}
                                 editable={false} value={this.props.myuser.address.address} />
            </Item>


            <Item floatingLabel style={{borderColor:"black"}}>
              <Label>About</Label>
              <Input style={{textTransform: 'capitalize',}}
                                multiline={true}
                                numberOfLines={0}
                                scrollEnabled={true}
                                onContentSizeChange={(e) => {
                                const  numOfLinesCompany = e.nativeEvent.contentSize.height / 18;
                                 }}
                                 editable={false} value={this.props.myuser.about} />
             
            </Item>
  
  </Form>



</View>

)
}


  render() {
    const {user,picload,c,namesaveload} = this.state;
    return (
      <Container >
      <Content>

         {user && this.renderprofile()}
         {namesaveload && this.rendernamesaveload() }
         {c && this.renderpickerdialog()}
         {picload && this.renderpicload()}
         </Content>
    </Container>

  
    );
  }

}

const styles = StyleSheet.create({
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 66,
    borderWidth: 2,
    borderColor:"white",
  },
  name:{
    color: "white",
    fontWeight:"bold",
    fontSize:20,
    textTransform: 'capitalize',
  },
inputitem:{
  fontSize:16,
  color:"black"
},
  Item:{
marginTop:10,
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

export default connect(mapStateToProps)(UserProfileD)