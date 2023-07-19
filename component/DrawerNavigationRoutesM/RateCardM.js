import React  from 'react';
import { StyleSheet,View,Image} from "react-native";
import {Card,Title, Paragraph,Button,Avatar,Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";

export function Star (props)
{
   let stars = [];
		// Loop 5 times
		for (var i = 1; i <= 5; i++) {
			// set the path to filled stars
			// let path = require('../../assets/star-filled.png');
			// If ratings is lower, set the path to unfilled stars
			if (i > props.ratings) {
				// path = require('../../assets/star-unfilled.png');
			}

			stars.push((<Image style={styles.image} source={path} />));
    }

  return stars;
    
}



 export default function RateCardM (props)  {

return(
      <View>
        
        <Card style={{elevation:3,borderRadius:20,margin:10,padding:10,borderWidth:0.2,borderColor:"blue"}}>

<View style={{flexDirection:"row"}}> 
  <Avatar.Image size={50} source={{uri: props.photo }} />
    <Card.Content style={{justifyContent:"center",alignItems:"center"}}>
    <Title style={{fontSize:17}}>{props.name}</Title>  
    </Card.Content>
</View>

<View style={{flexDirection:"row",marginTop:14}}> 
<Card.Content style={{flexDirection:"row"}}>
  <Star ratings={props.ratings}/>
    </Card.Content>
    <Text style={{fontSize:14}}>{moment(props.create).format('DD/MM/YYYY')}</Text> 
</View>

<Card.Content style={{marginTop:10,flexDirection:"row"}}>
 <Paragraph>{props.comment}</Paragraph>
    </Card.Content>

        </Card>

      </View>
)
  }

  

  const styles = StyleSheet.create({
    image: {
      width: 17,
      height: 17
    },
  });
