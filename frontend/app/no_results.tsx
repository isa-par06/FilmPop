import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Navbar from "../components/navbar";



//results recommendations page
export default function Results() {
    const router = useRouter();
    
  return (
    <View style={styles.screen}>
      {/*top film strip*/}
      <Image 
        source={require('../assets/images/filmStripTop.png')}
        style={styles.filmTop}
        resizeMode="contain"
      />
      {/*page title*/}
      <Text style={styles.title}>
        WHOOPS!
      </Text>

      {/*page subtitle - description of no recommendations*/}
      <Text style={styles.description}>
        Unfortunately, there are no recommendations that match your preferences at this time, please try again.
      </Text>

      {/*restart button - takes user back to the empty preference page*/}
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => router.push('/home')}>
          <Image source={require('../assets/images/restart_button.png')}/>
        </TouchableOpacity>

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
  filmTop: {
    position: 'absolute',
    top: '-15%',
    left: '0%',
    width: '100%',
    height: 575,
    opacity: 0.48,
  },
  title: {
    fontFamily: 'FascinateInline_400Regular',
    fontSize: 36,
    color: '#E3DDB9',
    textShadowColor: '#3D1313',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    lineHeight: 40,
    position: 'absolute',
    width: '96%',
    height: '20%',
    top: '12%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#CEABAB',
    top: '40%',
    width: '80%',
    alignSelf: 'center',
    textAlign: 'center',
  },
 button: {
    justifyContent: 'center', 
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    top: '46%',
 }
})