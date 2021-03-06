import React from 'react';
import { ScrollView, Text, View, StyleSheet, Button, AsyncStorage, TextInput, TouchableOpacity, Image} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export default class Favorite extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            name: '',
            token: ''
        };
      }

    componentDidMount(){
        this._checkToken();
        this._DisplayAlbum();
    }

    _checkToken(){
        AsyncStorage.multiGet(["accessToken", "username"])
          .then(result => {
              //console.log(result[0][1]);
              //console.log(result[1][1]);
              if(result === null)
              {
                this.props.navigation.navigate('Home');
              }
              else
              {
                  this.setState({
                      name: result[1][1],
                      token: result[0][1]
                  })
              }
          })
          .catch(err => {
              console.log(err)
          })
      }

    _DisplayAlbum(){
        fetch('https://api.imgur.com/3/account/NicoleZessec2/albums/ids', {
            "method": "GET",
            "headers": {
              "Authorization": "Bearer 009c835452d021690f1bc8c8484cd6ab339cf8c6"
            },
        })
        .then((response) => response.json())
        //If response is in json then in success
        .then((responseJson) => {
            console.log("album", responseJson);
            this.setState({
                images: responseJson.data,
            })
        })
        //If response is not in json then in error
        .catch((error) => {
            //Error 
            //alert(JSON.stringify(error));
            console.error("error:" + error);
        });
    }

    _renderItem(item){
        //console.log("item in render: ", item);
        return (
          <View>
            <Image
                source={{ uri: item.link }}
                style={styles.image}
                //PlaceholderContent={<ActivityIndicator />}
            />
          </View>
        )
      }

    render() {
        //console.log(this.state.images);
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.imageRow}>
                <FlatList
                data= {this.state.images}
                keyExtractor= {(item) => item.id.toString()}
                renderItem={({item}) => this._renderItem(item)}
                />
            </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    position: {
      position: "relative"
    },
    imageRow: {
      flex: 1, 
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    image: {
        width: 100,
        height: 100,
        position: 'relative'
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    contentContainer: {
      paddingTop: 30,
    },
    getStartedContainer: {
      alignItems: 'center',
      marginHorizontal: 50,
    },
    getStartedText: {
      fontSize: 20,
      color: 'rgba(96,100,109, 1)',
      lineHeight: 30,
      textAlign: 'center',
    },
    input: {
      width: 250,
      height: 44,
      padding: 10,
      marginTop: 30,
      marginLeft: 60,
      backgroundColor: '#ecf0f1'
    },
  });