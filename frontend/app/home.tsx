import { Text, View } from "react-native";
import Navbar from "../components/navbar";
import {StyleSheet} from 'react-native';
export default function Home() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Home Screen!!!</Text>
      <Navbar />
    </View>
  );
}


//UI styles for the home screen with positioning
const styles=StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#834141',
  },
  text: {
    position: 'absolute',
    width: '90%',
    height: 100,
    top: '40%',
    alignSelf: 'center',
  },
})
