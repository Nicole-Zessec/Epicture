import React from 'react';
import { Image, ScrollView, Text, View, StyleSheet, Button, TextInput, AsyncStorage} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {decode, encode} from 'base-64';
//import imgur from "imgur";


export default class UploadImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          title: '',
          desc: '',
          token: '', 
        };
      }

      _checkToken(){
        //console.log('inside checktoken');
        AsyncStorage.getItem("accessToken")
          .then(result => {
              console.log(result)
              if(result === null)
              {
                this.setState({ token: result});  
                this.props.navigation.pop(1);
              }
          })
          .catch(err => {
              console.log(err)
          })
      }

      Upload(image){
        const formData = new FormData();
        formData.append('image', image);
        formData.append("title", this.state.title);
        formData.append("description", this.state.desc);
        //POST request 
        fetch('https://api.imgur.com/3/image', {
            "method": "POST",
            "timeout": 0,
            "body": formData,
            "headers": {
                "Authorization": "Bearer 71ca6576db1cd20c655591cb3628b52a653f823b",
                "Accept": 'application/json'
            },
            
        })
        .then((response) => response.json())
        //If response is in json then in success
        .then((responseJson) => {
            //console.log(responseJson);
            alert("Your Image has been Uploaded ! Check your posts in Profile.")
            this.props.navigation.goBack();

        })
        //If response is not in json then in error
        .catch((error) => {
        alert(JSON.stringify(error));
        console.error(error);
        });
    }


    render() {
        this._checkToken();
        const { navigation } = this.props;
        const image = navigation.getParam('result', 'No Result');
        return (
        <KeyboardAwareScrollView
            style={{ backgroundColor: '#fff' }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.container}
            scrollEnabled={true}>
                <Image
                    source={{ uri: image.uri }}
                    style={styles.image}
                    //PlaceholderContent={<ActivityIndicator />}
                />
            
                <TextInput
                    onChangeText={(title) => this.setState({ title })}
                    placeholder={'Enter a title ...'}
                    style={styles.input}
                    value={this.state.title}
                    autoFocus = {true}
                    clearTextOnFocus = {true}
                /> 
                <TextInput
                    onChangeText={(desc) => this.setState({ desc })}
                    placeholder={'Enter a description ...'}
                    style={styles.input}
                    value={this.state.desc}
                    autoFocus = {true}
                    clearTextOnFocus = {true}
                /> 
                <Button
                    //icon={<Icon name='code' color='#ffffff' />}
                    backgroundColor='#03A9F4'
                    onPress={()=>this.Upload(image.base64)}
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                    title='Upload Image' />
 
        </KeyboardAwareScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
    image: {
        width: 300,
        height: 300,
        marginLeft: 40,
        marginTop: 30,
    },
    input: {
        width: 250,
        height: 44,
        padding: 10,
        marginTop: 30,
        marginLeft: 60,
        backgroundColor: '#ecf0f1'
      },
})