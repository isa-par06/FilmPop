import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Navbar from "../components/navbar";
import { auth, db } from "../lib/firebase";

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    email: '',
    name: '',
    username: '',
    favoriteGenre: '',
  });
  const [docId, setDocId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editFavoriteGenre, setEditFavoriteGenre] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const currentEmail = auth.currentUser?.email;
      if (!currentEmail) {
        setLoading(false);
        return;
      }

      try {
        const usersCollection = collection(db, 'users');
        const emailQuery = query(usersCollection, where('email', '==', currentEmail));
        const querySnapshot = await getDocs(emailQuery);

        if (!querySnapshot.empty) {
          const profileDoc = querySnapshot.docs[0];
          const doc = profileDoc.data();
          setProfile({
            email: doc.email || currentEmail,
            name: doc.name || '',
            username: doc.username || '',
            favoriteGenre: doc.favoriteGenre || '',
          });
          setDocId(profileDoc.id);
          setEditName(doc.name || '');
          setEditUsername(doc.username || '');
          setEditFavoriteGenre(doc.favoriteGenre || '');
        } else {
          setProfile({
            email: currentEmail,
            name: '',
            username: '',
            favoriteGenre: '',
          });
        }
      } catch (error) {
        console.log('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  const handleStartEditing = () => {
    setEditName(profile.name);
    setEditUsername(profile.username);
    setEditFavoriteGenre(profile.favoriteGenre);
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditName(profile.name);
    setEditUsername(profile.username);
    setEditFavoriteGenre(profile.favoriteGenre);
    setEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim() || !editUsername.trim() || !editFavoriteGenre.trim()) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    if (!docId) {
      Alert.alert('Unable to save profile.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', docId);
      await updateDoc(userDocRef, {
        name: editName,
        username: editUsername,
        favoriteGenre: editFavoriteGenre,
      });
      setProfile({
        ...profile,
        name: editName,
        username: editUsername,
        favoriteGenre: editFavoriteGenre,
      });
      setEditing(false);
    } catch (error) {
      console.log('Error updating profile:', error);
      Alert.alert('Error', 'Could not save your profile.');
    }
  };

  return (
    <View style={styles.screen}>
      <Image
        source={require('../assets/images/profileFilmSticker.png')}
        style={styles.filmTop}
        resizeMode="contain"
      />
      {/* profile top section */}
      <View style={styles.topSection}>
        <Image 
            source={require('../assets/images/profileTop.png')}
            style={styles.profileTop}
            resizeMode="contain"
        />

        <View style={styles.usernameOverlay}>
          {editing ? (
                    <TextInput
                      style={styles.usernameText}
                      placeholder="Username"
                      placeholderTextColor="#CEABAB"
                      value={editUsername}
                      onChangeText={setEditUsername}
                      autoCapitalize="characters"
                    />
          ) : (
            <Text style={styles.usernameText}>
              {(profile.username || 'Not set')}</Text>
          )}
        </View>
        
      </View>


      <View style={styles.profileContainer}>
      <Image 
        source={require('../assets/images/profileLabel.png')} 
        style={styles.profileLabel} 
        resizeMode="contain" />
        {loading ? (
          <Text style={styles.loadingText}>Loading profile...</Text>
        ) : (
          <View style={styles.infoCard}>
            {editing ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.editInput}
                    placeholder="Full name"
                    placeholderTextColor="#CEABAB"
                    value={editName}
                    onChangeText={setEditName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={styles.editInput}
                    placeholder="Username"
                    placeholderTextColor="#CEABAB"
                    value={editUsername}
                    onChangeText={setEditUsername}
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Favorite Genre</Text>
                  <TextInput
                    style={styles.editInput}
                    placeholder="Favorite genre"
                    placeholderTextColor="#CEABAB"
                    value={editFavoriteGenre}
                    onChangeText={setEditFavoriteGenre}
                    autoCapitalize="words"
                  />
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                    <Text style={styles.saveText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Name</Text>
                  <Text style={styles.value}>{profile.name || 'Not set'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Username</Text>
                  <Text style={styles.value}>{profile.username || 'Not set'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>{profile.email || 'Not set'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Favorite Genre</Text>
                  <Text style={styles.value}>{profile.favoriteGenre || 'Not set'}</Text>
                </View>
              </>
            )}
          </View>
        )}
      </View>

    {/*tickets nav area*/}
    {!editing && (
    <View style={styles.ticketRow}>
      <TouchableOpacity activeOpacity={0.8} style={styles.ticketButton} onPress={handleStartEditing}>
              <Image 
              source={require('../assets/images/ticket1.png')}
              style={styles.ticketImage}
              resizeMode="contain"
              />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8} style={styles.ticketButton} onPress={handleSignOut}>
              <Image 
              source={require('../assets/images/ticket3.png')}
              style={styles.ticketImage}
              resizeMode="contain"
              />
      </TouchableOpacity>
    </View>
    )}

    {/*popcorn image*/}
          <Image source={require('../assets/images/popcorn.png')}
            style={styles.popcorn}
            resizeMode="contain"
          />

      <Navbar />
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
    top: 0,
    left: 0,
    width: '100%',
    height: 445,
  },
  profileContainer: {
    position: 'relative',
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 1,
  },
  topSection: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 75,
  },
  profileTop: {
    width: '100%',
    height: 220,
  },
  profileLabel: {
    position: 'absolute',
    width: 330,
    height: 50,
    zIndex: 2,
    marginTop: -5,
  },
  usernameOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top:110,
    left: 0,
    right: 0,
  },
  usernameText:{
    fontFamily: 'FascinateInline_400Regular',
    fontSize: 33,
    color: '#632020',
    textAlign: 'center',
    marginTop: 10,
  },
  title: {
    fontFamily: 'FascinateInline_400Regular',
    fontSize: 40,
    color: '#E3DDB9',
    textShadowColor: '#3D1313',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 20,
  },
  loadingText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#CEABAB',
  },
  infoCard: {
    width: '100%',
    backgroundColor: 'rgba(99, 32, 32, 0.8)',
    borderRadius: 16,
    borderColor: '#E3DDB9',
    borderWidth: 1,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 0,
    marginTop: 20,
  },
  infoRow: {
    marginBottom: 18,
  },
  label: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#CEABAB',
    marginBottom: 6,
  },
  value: {
    fontFamily: 'AveriaSerifLibre_400Regular',
    fontSize: 18,
    color: '#E3DDB9',
  },
  signOutButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#CEABAB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signOutText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#834141',
  },
  editInput: {
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(227, 221, 185, 0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E3DDB9',
    paddingHorizontal: 12,
    color: '#E3DDB9',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  editButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#CEABAB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  editText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#834141',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },
  saveButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#E3DDB9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: -10,
  },
  saveText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#834141',
  },
  cancelButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#632020',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E3DDB9',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 10,
  },
  cancelText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#E3DDB9',
  },
  ticketRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  ticketButton: {
    flex: 1,
    alignItems: 'center',
  },
  ticketImage: {
    width: 121,
    height: 64,
  },
  popcorn: {
    position: 'absolute',
    height: 238,
    width: '100%',
    left: 0,
    top: '67%',
  },
});
