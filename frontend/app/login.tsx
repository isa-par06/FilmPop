// frontend/screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    return () => unsubscribe();
  }, []);

  // Login function
  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user);
      await AsyncStorage.setItem('userEmail', email);
      router.push({ pathname: '/home', params: { userEmail: email } });
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
      console.log('Error signing in:', error);
    }
  };

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
        Alert.alert('Login Instead');
        console.log('User with the email already exists.');
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
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        
        <TouchableOpacity style={styles.button} onPress={handleEmailLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleEmailSignup}>
          <Text style={styles.buttonText}>Signup</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#834141',
  },
});