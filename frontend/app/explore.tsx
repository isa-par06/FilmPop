import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Navbar from "../components/navbar";

//explore page
export default function Explore() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
        <Text style={styles.text}>Explore Screen!!!</Text>
      <Navbar />
    </View>
  );
}

//UI styles for the explore screen with positioning
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