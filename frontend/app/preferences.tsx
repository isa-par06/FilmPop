import { Slider } from "@miblanchard/react-native-slider";
import { useRouter } from "expo-router";
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Navbar from "../components/navbar";

//preference questions page
export default function Preferences() {
  const router = useRouter();
  const [duration, setDuration] = useState([50, 120]);
  const [selGenres, setSelGenres] = useState<string[]>([]);
  const [selMoods, setSelMoods] = useState<string[]>([]);
  const [selServices, setSelServices] = useState<string[]>([]);

  const moods = ["happy", "scared", "romantic", "curious", "adventurous"];
  const genres = ["action", "western", "war", "thriller", "tv movie", "science fiction", "romance", "mystery", "music", "horror", "history", "fantasy", "family", "drama", "documentary", "crime", "comedy", "animation", "adventure"];


  return (
    <View style={styles.screen}>
      {/*top film strip*/}
      <Image source={require('../assets/images/homeFilmSticker.png')}
        style={styles.filmTop}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>MAKE YOUR SELECTION!</Text>

      <View style={styles.scrollView}>
        <ScrollView contentContainerStyle={{ paddingBottom: 226 }}>
          <Text style={[styles.questions, {}]}>What mood are you feeling for today?</Text>

          <View style= {styles.buttonsContainer}>
            {moods.map((mood) => {
            return (
              <TouchableOpacity key={mood} style={[styles.buttonBox, selMoods.includes(mood) ? {borderColor: '#C7AF95'} : {borderColor: '#411B1B'}]} activeOpacity={0.8} 
                onPress={() => {
                  if (selMoods.includes(mood)) { setSelMoods(selMoods => selMoods.filter(item => item !== mood)); } 
                  else { setSelMoods(selMoods => [...selMoods, mood]); }
                }
              }>
                <Text style={[styles.button, selMoods.includes(mood) ? {color: '#C7AF95'} : {color: '#834141'}]}>{mood.toUpperCase()}</Text>
              </TouchableOpacity>
            )
          })}
          </View>

          <Text style={[styles.questions, {}]}>What genre do you prefer?</Text>

          <View style= {styles.buttonsContainer}>
            {genres.map((genre) => {
            return (
              <TouchableOpacity key={genre} style={[styles.buttonBox, selGenres.includes(genre) ? {borderColor: '#C7AF95'} : {borderColor: '#411B1B'}]} activeOpacity={0.8} onPress={() => {
                if (selGenres.includes(genre)) { setSelGenres(selGenres => selGenres.filter(item => item !== genre)); } 
                else { setSelGenres(selGenres => [...selGenres, genre]); }
              }}>
                <Text style={[styles.button, selGenres.includes(genre) ? {color: '#C7AF95'} : {color: '#834141'}]}>{genre.toUpperCase()}</Text>
              </TouchableOpacity>
            )
          })}
          </View>

          <Text style={[styles.questions, {}]}>What subscription services are avaliable to you?</Text>
          <Text style={[styles.questions, {}]}>How long would you like your film to be?</Text>

          <View style={[{alignSelf: 'center', width: '90%'}]}>
            <Slider 
                value={duration}
                onValueChange={val => setDuration(val)}
                step={10}
                minimumValue={20}
                maximumValue={160}
                minimumTrackTintColor="#632020"
                maximumTrackTintColor="#C7AF95"
                thumbTintColor="#632020"
                thumbTouchSize={{ width: 40, height: 40 }}
                trackStyle={styles.track}
                thumbStyle={styles.thumb}
                containerStyle={styles.sliderContainer}
            />
            <View style={[styles.sliderTextRow, {marginTop: '16%', width: '105%'}]}>
              <Text style={[{fontFamily: 'Inter_400Regular_Italic', fontSize: 14, color: '#E3DDB9'}]}>20 mins</Text>
              <Text style={[{fontFamily: 'Inter_400Regular_Italic', fontSize: 14, color: '#E3DDB9'}]}>160 mins</Text>
            </View>
            <View style={[styles.timeText, {marginTop: '26%'}]}>
              <Text style={styles.timeDisplay}>{duration[0]}</Text>
              <Text style={[{fontFamily: 'Inter_700Bold', fontSize: 24, color: '#E3DDB9'}]}>-</Text>
              <Text style={styles.timeDisplay}>{duration[1]}</Text>
            </View>
            <View style={[styles.sliderTextRow, {marginTop: '39%', width: '46%'}]}>
              <Text style={[{fontFamily: 'Inter_400Regular_Italic', fontSize: 14, color: '#E3DDB9'}]}>minutes</Text>
              <Text style={[{fontFamily: 'Inter_400Regular_Italic', fontSize: 14, color: '#E3DDB9'}]}>minutes</Text>
            </View>
          </View>


          <View style={styles.ticketButtonsRow}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {setDuration([50, 120]), setSelGenres([]), setSelMoods([])}}>
              <Image source={require('../assets/images/preferencesClearSelection.png')}/>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push({
                pathname: '/results', 
                params: {minTime: duration[0], maxTime: duration[1], genres: selGenres, moods: selMoods}
              }
            )}>
              <Image source={require('../assets/images/preferencesSubmitSelection.png')}/>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      
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
    top: 6,
    left: -20,
    width: '110%',
    height: 480
  },
  title: {
    fontFamily: 'FascinateInline_400Regular',
    fontSize: 40,
    color: '#E3DDB9',
    textShadowColor: '#3D1313',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    position: 'absolute',
    top: '10%',
    width: '90%',
    lineHeight: 40,
    alignSelf: 'center',
    textAlign: 'center'
  },
  scrollView: {
    top: '23.6%',
    width: '95%',
    height: '66%',
    alignSelf: 'center',
  },
  questions: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#CEABAB',
    left: '4%',
    marginTop: 14,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    alignSelf: 'center',
    width: '92%',
    gap: 8,
  },
  buttonBox: {
    backgroundColor: '#632020',
    borderColor: '#411B1B',
    borderWidth: 1,
    borderRadius: 30,
    width: 'auto',
    height: 34,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  button: {
    fontFamily: 'AveriaSerifLibre_400Regular',
    fontSize: 24,
    textAlign: 'center',
    paddingLeft: 8,
    paddingRight: 8,
  },
  track: {
    height: 10,
    borderRadius: 10,
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  sliderContainer: {
    width: '90%',
    marginTop: 20,
    marginBottom: 30,
    alignSelf: 'center',
  },
  sliderTextRow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    alignSelf: 'center',
  },
  timeText: {
    position: 'absolute',
    flexDirection: 'row', 
    alignItems: 'center',
    alignSelf: 'center',
    width: '60%',
    justifyContent: 'center',
  },
  timeDisplay: {
    fontFamily: 'AveriaSerifLibre_700Bold',
    fontSize: 20,
    color: '#E3DDB9',
    backgroundColor: '#632020',
    borderColor: '#E3DDB9',
    borderWidth: 1,
    borderRadius: 60,
    height: 40,
    lineHeight: 36,
    width: 70,
    textAlign: 'center',
    alignSelf: 'center',
    marginHorizontal: 12,
  },
  ticketButtonsRow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',
    top: '112.6%',
  }
})