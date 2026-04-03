import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Navbar from "../components/navbar";

//profile page
export default function Profile() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      {/*top film strip*/}
      <Image 
      source={require('../assets/images/profileFilmSticker.png')}
      style={styles.filmTop}
      resizeMode="contain"
      />
      <Navbar />
    </View>
  );
}

//UI styles for the profile screen with positioning
const styles=StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#834141',
  },
  filmTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 445
  },
})
