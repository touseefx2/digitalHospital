import React  from 'react';
import { StyleSheet,View,ScrollView} from "react-native";
import {Card,Title, Paragraph,Avatar,Button} from 'react-native-paper';


 export default class TipsScreen extends React.Component  {

render(){

return(
      <View style={styles.container}>  
  <ScrollView>

<View style={{margin:10,padding:5}}>
  <Card style={{borderWidth:0.5,borderColor:"blue",borderRadius:20,padding:5}}>
    <Card.Title title="Drugs Interaction" subtitle="5 Tips You Should Do To Avoid Them" />
    <Card.Cover source={require("../../assets/di.jpg")} />
     <Card.Content>
      <Paragraph>Drug or medication interactions can happen to anyone taking medicines. This weeks video is about why drugs interact and avoiding them</Paragraph>
    </Card.Content>
    <Card.Actions>
      <Button onPress={()=>this.props.navigation.navigate("TipsScreenViewVideo",{t:"Drugs Interaction",vid:"hzXLHHsa5bw"})}>PLAY</Button>
    </Card.Actions>
  </Card>
  </View>

  <View style={{margin:10,padding:5}}>
  <Card style={{borderWidth:0.5,borderColor:"blue",borderRadius:20,padding:5}}>
  <Card.Cover source={require("../../assets/dt.jpg")} />
  <Card.Title title="Derpression Tips" subtitle="5 Ways to Help Yourself Through Depression" />
  <Card.Content>
      <Paragraph>
      If you feel depressed, it's best to do something about it — depression doesn't just go away on its own. In addition to getting help from a doctor or therapist, here are 5 things you can do to feel better.......
      </Paragraph>
    </Card.Content>
    <Card.Actions>
    <Button onPress={()=>this.props.navigation.navigate("TipsScreenView",{t:"Derpression Tips"})}>SEE MORE</Button>
    </Card.Actions>
  </Card>
  </View>

  <View style={{margin:10,padding:5}}>
  <Card style={{borderWidth:0.5,borderColor:"blue",borderRadius:20,padding:5}}>
    <Card.Title title="Skin Care" subtitle="Acne Scars: Causes & How To Get Rid Of Acne Scars " />
    <Card.Cover source={require("../../assets/sc.jpg")} />
    <Card.Actions>
    <Button onPress={()=>this.props.navigation.navigate("TipsScreenViewVideo",{t:"Skin Care",vid:"3aIw5s-TGjM"})}>PLAY</Button>
    </Card.Actions>
  </Card>
  </View>

  <View style={{margin:10,padding:5}}>
  <Card style={{borderWidth:0.5,borderColor:"blue",borderRadius:20,padding:5}}>
  <Card.Cover source={require("../../assets/ft.jpeg")} />
  <Card.Title title="Fever Tips" subtitle="5 tips for managing a fever" />
  <Card.Content>
      <Paragraph>
      A fever means your body’s fighting a cold, the flu, or another infection. But you can help make the battle as easy as possible. To manage your fever, try these tips .... 
      </Paragraph>
    </Card.Content>
    <Card.Actions>
    <Button onPress={()=>this.props.navigation.navigate("TipsScreenView",{t:"Fever Tips"})}>SEE MORE</Button>
    </Card.Actions>
  </Card>
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
    backgroundColor:"grey"
  }
});
