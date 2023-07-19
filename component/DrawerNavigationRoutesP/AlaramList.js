// libs
import React, {Component} from 'react';
import {
  Alert,
  Text,
  Dimensions,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import RadioForm from 'react-native-simple-radio-button';
import moment from 'moment';
import {cancelAlarmById,activateAlarmById,deleteAlarmById,getAlarms,} from 'react-native-simple-alarm';
// Global
import {Colors, Convert} from '../styles/styles';

const {height, width} = Dimensions.get('window');

export default  class AlarmList extends Component {

  static navigationOptions  = ({ navigation }) => {
    return {
      title:"REMINDER LIST",
            headerStyle: {
              backgroundColor: "#307ecc",
            },
            headerTintColor: '#fff',
          }
    };

  state = {
    alarms: [],
  };

  async componentDidMount() {
    const alarms = await getAlarms();
    this.setState({
      alarms,
    });
  }

  confirmDeletePress = (data, rowRef) => {
    Alert.alert('Are you sure?', 'Your alarm will be deleted', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => this.handleDeletePress(data, rowRef),
      },
    ]);
  };

  handleAlarmActivation = (value, alarm) => {
    if (value === 0) {
      cancelAlarmById(alarm.id);
    } else if (value === 1) {
      activateAlarmById(alarm.id);
    }
  };

  renderAlarms = ({item}) => {
    const radio_props = [
      {label: 'On', value: 1},
      {label: 'Off', value: 0},
    ];
    if (!item) {
      return null;
    }
    return (
      <View style={styles.alarmContainer}>
        <View style={{display: 'flex', flexDirection: 'column'}}>
          <View style={styles.alarm}>
           
          <View  style={{paddingLeft: Convert(10)}}>
           <Text style={{fontSize: Convert(35)}}>
                {moment(item.date).format('hh:mm A')}
              </Text>
              <Text style={{fontSize: Convert(15)}}>
                {new Date(item.date).toDateString()}
              </Text>
           </View>


            <RadioForm
              radio_props={radio_props}
              labelColor={'gray'}
              onPress={(value) => this.handleAlarmActivation(value, item)}
              formHorizontal={true}
              animation={true}
              initial={item.active ? 0 : 1}
              radioStyle={{paddingRight: Convert(13)}}
              style={{marginLeft: Convert(60)}}
            />
          </View>
          <View
            style={{
              display: 'flex',
              marginTop:5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{item.message}</Text>
          </View>
        </View>
      </View>
    );
  };

  handleDeletePress = async (data, rowRef) => {
    const {item} = data;
    await cancelAlarmById(item.id);
    const updatedAlarms = await deleteAlarmById(item.id);
    this.setState({
      alarms: updatedAlarms,
    });
    if (rowRef) {
      rowRef.manuallySwipeRow(0);
    }
  };

  render() {
    return (
      <SwipeListView
        style={{
          width: width,
          marginTop:30,
          height: height,
          backgroundColor: Colors.lightGray,
        }}
        data={this.state.alarms}
        renderItem={this.renderAlarms}
        keyExtractor={(index) => `list-item-${index}`}
        renderHiddenItem={(data, rowMap) => (
          <View
            style={{
              alignSelf: 'flex-end',
              marginRight: Convert(10),
              marginTop: Convert(5),
              padding: Convert(11),
              backgroundColor: "white",
            }}>
            <TouchableOpacity
              onPress={() =>
                this.confirmDeletePress(data, rowMap[data.item.key])
              }>
              <Image
                style={{
                  height: Convert(50),
                  width: Convert(50),
                }}
                source={require('../../assets/trash.jpg')}
              />
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-75}
      />
    );
  }
}

const styles = StyleSheet.create({
  alarmContainer: {
    height: Convert(100),
    display: 'flex',
    flexDirection: 'column',
    marginTop:3,
    margin:10,
    justifyContent: 'space-around',
    borderStyle:"dotted",
    borderColor: "#307ecc",
    borderRadius:17,
    borderWidth: 0.5,
    elevation:1.5,
    backgroundColor: 'white',
  },
  alarm: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

