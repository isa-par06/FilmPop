import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Navbar from "../components/navbar";

//preference questions page
export default function Preferences() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
        <Text style={styles.text}>Preferences Screen!!!</Text>
      <Navbar/>
    </View>
  );
}

//UI styles with positioning
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