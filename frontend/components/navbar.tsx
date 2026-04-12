import { usePathname, useRouter } from "expo-router";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

//navbar component
export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  //function to determine the opacity of the navbar icons (the page the user is on will be opaque and the rest will be at 60% opacity)
  const getOpacity = (path: string) => {
    return pathname === path ? 1 : 0.6; 
  };

  return (
    <ImageBackground
      source={require('../assets/images/navFilmStrip.png')}
      style={styles.navbarContainer}
      resizeMode="contain"
    >

    {/*container to hold buttons - to be able to change their positions*/}
    <View style={styles.buttonRow}>
      {/*home button*/}
      <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/home')} style={{opacity: getOpacity('/home')}}>
              <Image 
              source={require('../assets/images/homeButton.png')}
              style={styles.navbarIcons}
              resizeMode="contain"
              />
              <Text style={styles.navText}>home</Text>
      </TouchableOpacity>

      {/*explore button*/}
      <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/explore')} style={{opacity: getOpacity('/explore')}}>
              <Image 
              source={require('../assets/images/exploreButton.png')}
              style={styles.navbarIcons}
              resizeMode="contain"
              />
              <Text style={styles.navText}>explore</Text>
      </TouchableOpacity>

      {/*profile button*/}
      <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/profile')} style={{opacity: getOpacity('/profile')}}>
              <Image 
              source={require('../assets/images/profileButton.png')}
              style={styles.navbarIcons}
              resizeMode="contain"
              />
              <Text style={styles.navText}>profile</Text>
      </TouchableOpacity>
    </View>

    </ImageBackground>
  );
}

//UI styles for the login screen with positioning
const styles=StyleSheet.create({
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    width: "100%",
    alignItems: "center",
    left: 0,
    height: 94,
  },
  buttonRow:{
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 76,
    left: 3,
  },
  navbarIcons: {
    width: 46,
    height: 46,
  },
  navText: {
    fontFamily: 'AveriaSerifLibre_400Regular',
    fontSize: 10,
    color: "#E3DDB9",
    textAlign: "center",
  },

})