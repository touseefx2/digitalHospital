import React, {useState,useEffect} from 'react';
import {View, TextInput, StyleSheet, FlatList, Image,Text,TouchableOpacity} from 'react-native';
import {Item, Input, Label} from 'native-base';
// do not forget to add fresco animation to build.gradle



export function Giph() {
  
  const [iv,uiv]=useState("");
  const [gifs, setGifs] = useState([]);
  const [term, updateTerm] = useState('');
  const [Bs_url, uurl]=useState(""); //for giphy


//   You can easily search for Giphy stickers by replacing the BASE_URL
// http://api.giphy.com/v1/stickers/search

  async function fetchGifs() {
    try {
      const API_KEY = "8dAjwx5m7DMhArmQ2XUCy6X0UEPl2cxi"
      const BASE_URL = Bs_url;
      const resJson = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=${term}`);
      const res = await resJson.json();
      setGifs(res.data);
    } catch (error) {
      alert(error);
    }
  } /// add facebook fresco

  //useEffect should be able to handle that.  You can set the effect to run only when the state value changes:

  //first render k bad ik bar  cal hta or phr state k chnge hne pr
  useEffect(() => {
    console.log("use efct cal");

    if(Bs_url !=  "")
    {fetchGifs(), console.log(Bs_url)}

  } ,[Bs_url]); // Only re-run the effect if BS-url changes


  return (
    <View style={styles.view}>


   
            <Item floatingLabel>
              <Label style={{color:"#fff"}}>Search Giphy</Label>
              <Input style={{color:"#fff"}}  onChangeText={(txt)=>uiv(txt)} />
            </Item>

      <View style={{justifyContent:"space-between",flexDirection:"row",marginTop:30}}>

      <TouchableOpacity  onPress={()=> { if(iv!="") {  updateTerm(iv), uurl("http://api.giphy.com/v1/gifs/search")} else { alert("Please enter giph name")}}}>
     <Text style={{color:"pink",fontSize:17}}>Giphy</Text>
     <Text style={{color:"white"}}>______</Text>
</TouchableOpacity>

<TouchableOpacity  onPress={()=> { if(iv!="") {  updateTerm(iv), uurl("http://api.giphy.com/v1/stickers/search")} else {alert("Please enter giph name") }} }>
     <Text style={{color:"pink",fontSize:17}}>Giphy_Stickers</Text>
     <Text style={{color:"white"}}>_________________</Text>
</TouchableOpacity>
        
      </View>


      <FlatList style={{marginTop:70}}
        data={gifs}
        renderItem={({item}) => (
          <Image
            resizeMode='contain'
            style={styles.image}
            source={{uri: item.images.original.url}}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 10,
    backgroundColor: "#272c36"
  },
  textInput: {
    width: '100%',
    height: 50,
    color: 'white'
  },
  image: {
    width: 300,
    height: 150,
    borderWidth: 3,
    marginBottom: 5
  },
});