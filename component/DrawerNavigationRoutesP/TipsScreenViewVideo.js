import React from 'react';
import {
  View,
  Text,
  StatusBar,
} from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe"; 

export default class TipsScreenViewVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      error:"",
      vid:props.navigation.getParam("vid")
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

  componentDidMount()
  {
    StatusBar.setHidden(true)
  }

  renderError()
  {
    return(
      <View style={{alignSelf:"center"}}>
      <Text>Error : {this.state.error}</Text>
        </View>
    )
  }

  render() {
    return (
      <View>
<Text style={{ fontSize:15, color: '#fff', backgroundColor: '#000',padding:5 }}>Note :   For see video you must needs to have the official YouTube app installed on the device</Text>
        
        <View style={{marginTop:20}}>
      <YoutubePlayer
        height={300}
        videoId={this.state.vid}
        play={true}
        onError={e => this.setState({ error: e.error })}
      />
      </View>

    {this.state.error!="" && this.renderError()} 
    

    </View>
    );
  }
}

