import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
//login page
export default function Index() {
  return (
    <View style={styles.screen}>
      {/*top film strip*/}
      <Image 
      source={require('../assets/images/filmStripTop.png')}
      style={styles.filmTop}
      resizeMode="contain"
      />
      {/*bottom film strip*/}
      <Image 
      source={require('../assets/images/filmStripBottom.png')}
      style={styles.filmBottom}
      resizeMode="contain"
      />
      {/*title image*/}
      <Image 
      source={require('../assets/images/title.png')}
      style={styles.titleImage}
      resizeMode="contain"
      />
      {/*sign-in button image, touchable opacity is used to make it a button later*/}
      <TouchableOpacity activeOpacity={0.8} style={styles.signInButtonWrapper}>
        <Image 
        source={require('../assets/images/signInButton.png')}
        style={styles.signInButtonImage}
        resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

//UI styles for the login screen with positioning
const styles=StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#834141',
  },
  filmTop: {
    position: 'absolute',
    top: -30,
    left: 0,
    width: '100%',
    height: 575
  },
  filmBottom: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    width: '100%',
    height: 575
  },
  titleImage: {
    position: 'absolute',
    width: '90%',
    height: 100,
    top: '40%',
    alignSelf: 'center',
  },
  signInButtonWrapper: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
  },
  signInButtonImage: {
    height: 90,
    width: 180,
  },
})
