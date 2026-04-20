import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Navbar from "../components/navbar";
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadUserName = async () => {
      const currentEmail = auth.currentUser?.email;
      if (!currentEmail) {
        return;
      }

      try {
        const usersCollection = collection(db, 'users');
        const emailQuery = query(usersCollection, where('email', '==', currentEmail));
        const querySnapshot = await getDocs(emailQuery);

        if (!querySnapshot.empty) {
          const profileDoc = querySnapshot.docs[0];
          const doc = profileDoc.data();
          setUserName(doc.name || '');
        }
      } catch (error) {
        console.log('Error loading user name:', error);
      }
    };

    loadUserName();
  }, []);
  return (
    <View style={styles.screen}>
      {/*top film strip*/}
      <Image source={require('../assets/images/homeFilmSticker.png')}
        style={styles.filmTop}
        resizeMode="contain"
      />

      {/*welcome text*/}
      <Text style={styles.welcome_text}>HI {userName.toUpperCase()}!</Text>

      {/*text above filter button*/}
      <Text style={[styles.text, {width: '90%', height: 100, top: '32.2%', left: '4%'}]}>Ready to watch the perfect movie?</Text>


      <View style={styles.buttonsRow}>
        {/*filter button*/}
        <TouchableOpacity activeOpacity={0.8} style={[styles.buttonBox, { width: '100%', height: '80%'}]} 
        onPress={() => router.push('/preferences')}>
          <Text style={[styles.buttonText]}>FILTER YOUR SELECTION</Text>
        </TouchableOpacity>
      </View>

      {/*text above randomizer button*/}
      <Text style={[styles.text, {width: '90%', height: 100, top: '48.4%', left: '4%'}]}>Looking for a surprise?</Text>

      {/*randomizer button*/}
      <TouchableOpacity activeOpacity={0.8} style={[styles.buttonBox, { width: '95%', height: '10%', top: '31%', alignSelf: 'center'}]} 
      onPress={() => router.push('/random')}>
        <Text style={[styles.buttonText, {paddingTop: 26}]}>MOVIE RANDOMIZER</Text>
      </TouchableOpacity>

      {/*popcorn image*/}
      <Image source={require('../assets/images/popcorn.png')}
        style={styles.popcorn}
        resizeMode="contain"
      />
      
      <Navbar/>
    </View>
  );
}


//UI styles for the home screen with positioning
const styles=StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#834141',
  },
  welcome_text: {
    fontFamily: 'FascinateInline_400Regular',
    fontSize: 40,
    color: '#E3DDB9',
    textShadowColor: '#3D1313',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    top: '12%',
    left: '6%',
  },
  text: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: '#CEABAB',
    position: 'absolute',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    alignSelf: 'center',
    width: '95%',
    height: '13.6%',
    top: '27%',
  },
  buttonBox: {
    backgroundColor: '#632020',
    borderColor: '#E3DDB9',
    borderWidth: 1,
    borderRadius: 14,
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'AveriaSerifLibre_400Regular',
    color: '#E3DDB9',
    fontSize: 28,
    display: 'flex',
    textAlign: 'center',
  },
  filmTop: {
    position: 'absolute',
    top: 6,
    left: -20,
    width: '110%',
    height: 480
  },
  popcorn: {
    position: 'absolute',
    height: 238,
    width: '100%',
    left: 0,
    top: '67%',
  },
})
