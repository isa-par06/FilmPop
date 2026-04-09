import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    return () => unsubscribe();
  }, []);

  // Signup function
  const handleEmailSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const usersCollection = collection(db, 'users');
      const emailQuery = query(usersCollection, where('email', '==', email));
      const emailSnapshot = await getDocs(emailQuery);

      if (emailSnapshot.empty) {
        await addDoc(usersCollection, { email });
        console.log('User signed up:', userCredential.user);
        await AsyncStorage.setItem('userEmail', email);
        router.push({ pathname: '/home', params: { userEmail: email } });
      } else {
        Alert.alert('Account exists', 'Please log in instead');
        router.push('/login');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
      console.log('Error signing up:', error);
    }
  };

  useEffect(() => {
    if (user) {
      // only navigate after render cycle, not during render
      router.push({ pathname: '/home', params: { userEmail: email } });
    }
  }, [user, email, router]);

  if (user) {
    // render nothing while redirecting
    return null;
  }

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
      
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to FilmPop!</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#CEABAB"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#CEABAB"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        
        <TouchableOpacity style={styles.button} onPress={handleEmailSignup}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.linkText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'FascinateInline_400Regular',
    fontSize: 48,
    fontWeight: 'bold',
    color: '#E3DDB9',
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: '#3D1313',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(227, 221, 185, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#E3DDB9',
    fontFamily: 'Inter_700Bold',
    borderColor: '#E3DDB9',
    borderWidth: 1,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#632020',
    borderRadius: 8,
    borderColor: '#E3DDB9',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontFamily: 'AveriaSerifLibre_400Regular',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E3DDB9',
  },
  linkText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#E3DDB9',
    textDecorationLine: 'underline',
  },
});
