import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setUser(user));
    return () => unsubscribe();
  }, []);

  const handleContinue = () => {
    if (step === 1) {
      if (!email.trim()) {
        Alert.alert('Enter your email');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!name.trim() || !genre.trim()) {
        Alert.alert('Enter your name and favorite genre');
        return;
      }
      setStep(3);
      return;
    }
  };

  const handleCreateAccount = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Enter a username and password');
      return;
    }

    try {
      const usersCollection = collection(db, 'users');
      const emailQuery = query(usersCollection, where('email', '==', email));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        Alert.alert('Account exists', 'Please log in instead');
        router.push('/login');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await addDoc(usersCollection, {
        email,
        name,
        favoriteGenre: genre,
        username,
      });

      console.log('User signed up:', userCredential.user);
      await AsyncStorage.setItem('userEmail', email);
      router.push({ pathname: '/home', params: { userEmail: email } });
    } catch (error) {
      Alert.alert('Error', 'Could not create account. Please try again.');
      console.log('Error signing up:', error);
    }
  };

  useEffect(() => {
    if (user) {
      router.push({ pathname: '/home', params: { userEmail: email } });
    }
  }, [user, email, router]);

  if (user) {
    return null;
  }

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <>
          <Text style={styles.subtitle}>Enter your email to get started</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#CEABAB"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <Text style={styles.subtitle}>Tell us about yourself</Text>
          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor="#CEABAB"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Favorite genre"
            placeholderTextColor="#CEABAB"
            value={genre}
            onChangeText={setGenre}
            autoCapitalize="words"
          />
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep(1)}>
            <Text style={styles.linkText}>Go back</Text>
          </TouchableOpacity>
        </>
      );
    }

    return (
      <>
        <Text style={styles.subtitle}>Choose your username and password</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#CEABAB"
          value={username}
          onChangeText={setUsername}
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
        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStep(2)}>
          <Text style={styles.linkText}>Go back</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={styles.screen}>
      <Image 
        source={require('../assets/images/filmStripTop.png')}
        style={styles.filmTop}
        resizeMode="contain"
      />
      <Image 
        source={require('../assets/images/filmStripBottom.png')}
        style={styles.filmBottom}
        resizeMode="contain"
      />
      
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to FilmPop!</Text>
        {renderStepContent()}

        {step === 1 ? (
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.linkText}>Already have an account? Log in</Text>
          </TouchableOpacity>
        ) : null}
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
    height: 575,
  },
  filmBottom: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    width: '100%',
    height: 575,
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
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: '#3D1313',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  stepText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#CEABAB',
    marginBottom: 24,
  },
  subtitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#E3DDB9',
    marginBottom: 20,
    textAlign: 'center',
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
