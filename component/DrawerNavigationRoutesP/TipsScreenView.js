import React  from 'react';
import { StyleSheet,View,ScrollView,Image,ImageBackground} from "react-native";
import { Item, Input, Label,Icon,Form,Content,Container,Text,Spinner} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import {Card,Title, Paragraph,Avatar,Button} from 'react-native-paper';

 export default class TipsScreenView extends React.Component  {
  constructor(props) {
    super(props);
    this.state={
      ft: props.navigation.getParam("t"),
    }
  }

  static navigationOptions  = ({ navigation }) => {
    return { 
      title:navigation.getParam("t"),
            headerStyle: {
              backgroundColor: "#307ecc",
            },
            headerTintColor: '#fff',
          }
    };


    renderFever()
    {
      return(
        <View>
           <ScrollView>
  <Card style={{padding:5}}>
  <Card.Cover source={require("../../assets/ft.jpeg")} />
  <Card.Title title="Fever Tips" subtitle="5 tips for managing a fever" />
  <Card.Content>
      <Paragraph>
      When you first notice it, rest. Being active makes your body heat rise. When you’ve got a fever, activity brings your body temperature up even higher. Help your body recover – and avoid becoming dehydrated or getting heatstroke – by taking it easy until your fever comes down.
Remember to drink, lots. Sweating is your body’s natural cooling system, so staying well hydrated (with things like water or chicken soup) is extra-important.
Eat healthy foods. Nutrients and fluids can help boost your immune system – and the healthier you are when you have a fever, the quicker you'll get over it.
Dress light. Bundling up too much can make it harder to reduce a fever. If you have chills, try wearing a single, light layer and using one lightweight blanket.
If your temperature’s over 103ºF, let your doctor know. You may have the flu or another infection, so get checked out to be sure.
Also, make sure to wash your hands often – it can help you avoid colds, flu and the fevers that might come with them. Try to keep your hands away from your eyes, nose and mouth, too.
      </Paragraph>
    </Card.Content>
  </Card>
  </ScrollView>
        </View>
      )
    }

    renderDep()
    {
      return(
        <View>
           <ScrollView>
   <Card style={{padding:5}}>
  <Card.Cover source={require("../../assets/dt.jpg")} />
  <Card.Title title="Derpression Tips" subtitle="5 Ways to Help Yourself Through Depression" />
  <Card.Content>
      <Paragraph>
      If you feel depressed, it's best to do something about it — depression doesn't just go away on its own. In addition to getting help from a doctor or therapist, here are 5 things you can do to feel better :
      </Paragraph>
      <Paragraph style={{marginTop:10}}>
      <Title> 1 - Exercise : </Title> {"\n"} Take a 15- to 30-minute brisk walk every day — or dance, jog, or bike if you prefer. People who are depressed may not feel much like being active. But make yourself do it anyway (ask a friend to exercise with you if you need to be motivated). Once you get in the exercise habit, it won't take long to notice a difference in your mood.
In addition to getting aerobic exercise, some yoga poses can help relieve feelings of depression. Try downward-facing dog or legs-up-the-wall pose (you can find these poses on yoga websites). Two other aspects of yoga — breathing exercises and meditation — can also help people with depression feel better.
      </Paragraph>
      <Paragraph style={{marginTop:10}}>
      <Title> 2 - Nurture yourself with good nutrition : </Title> {"\n"} Depression can affect appetite. One person may not feel like eating at all, but another might overeat. If depression has affected your eating, you'll need to be extra mindful of getting the right nourishment. Proper nutrition can influence a person's mood and energy. So eat plenty of fruits and vegetables and get regular meals (even if you don't feel hungry, try to eat something light, like a piece of fruit, to keep you going).
      </Paragraph>
      <Paragraph style={{marginTop:10}}>
      <Title> 3 - Identify troubles, but don't dwell on them : </Title> {"\n"} but don't dwell on them. Try to identify any situations that have contributed to your depression. When you know what's got you feeling blue and why, talk about it with a caring friend. Talking is a way to release the feelings and to receive some understanding.
Once you air out these thoughts and feelings, turn your attention to something positive. Take action to solve problems. Ask for help if you need it. Feeling connected to friends and family can help relieve depression. It may also help them feel there's something they can do instead of just watching you hurt.
      </Paragraph>
      <Paragraph style={{marginTop:10}}>
      <Title> 4- Express yourself : </Title> {"\n"} With depression, a person's creativity and sense of fun may seem blocked. Exercise your imagination (painting, drawing, doodling, sewing, writing, dancing, composing music, etc.) and you not only get those creative juices flowing, you also loosen up some positive emotions. Take time to play with a friend or a pet, or do something fun for yourself. Find something to laugh about — a funny movie, perhaps. Laughter helps lighten your mood.
      </Paragraph>
      <Paragraph style={{marginTop:10}}>
      <Title> 4 - Express yourself : </Title> {"\n"} With depression, a person's creativity and sense of fun may seem blocked. Exercise your imagination (painting, drawing, doodling, sewing, writing, dancing, composing music, etc.) and you not only get those creative juices flowing, you also loosen up some positive emotions. Take time to play with a friend or a pet, or do something fun for yourself. Find something to laugh about — a funny movie, perhaps. Laughter helps lighten your mood.
      </Paragraph>
      <Paragraph style={{marginTop:10}}>
      <Title> 5 - Try to notice good things : </Title> {"\n"} Depression affects a person's thoughts, making everything seem dismal, negative, and hopeless. If depression has you noticing only the negative, make an effort to notice the good things in life. Try to notice one thing, then try to think of one more. Consider your strengths, gifts, or blessings. Most of all, don't forget to be patient with yourself. Depression takes time to heal.
      </Paragraph>
    </Card.Content>
  </Card>
  </ScrollView>
        </View>
      )
    }


render(){
return(
      <View style={styles.container}>    
{this.state.ft=="Fever Tips" && this.renderFever() }
{this.state.ft=="Derpression Tips" && this.renderDep() }
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
  });
   
  

