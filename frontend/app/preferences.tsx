import { Slider } from "@miblanchard/react-native-slider";
import { useRouter } from "expo-router";
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Navbar from "../components/navbar";


//preference questions page
export default function Preferences() {
  const router = useRouter();

  //states for all of the preference options
  const [duration, setDuration] = useState([60, 160]);
  const [selGenres, setSelGenres] = useState<string[]>([]);
  const [selMood, setSelMood] = useState<string>("");
  const [selServices, setSelServices] = useState<string[]>([]);


  //hard coded options for moods, genres, and subscription services
  const moods = ["happy", "scared", "romantic", "curious", "adventurous"];
  const genres = ["action", "western", "war", "thriller", "tv movie", "science fiction", "romance", "mystery", "music", "horror", "history", "fantasy", "family", "drama", "documentary", "crime", "comedy", "animation", "adventure"];
  const services = ["Netflix", "HBO", "Peacock", "Prime Video", "Disney Plus", "Hulu", "Paramount Plus", "Apple TV"];


  //helper function used when submitting the preferences to the results page
  const handleSubmit = () => {
    const filters = {
      minTime: duration[0],
      maxTime: duration[1],
      mood: selMood,
      genres: selGenres,
      services: selServices,
    };

    router.push({
      pathname: "/results",
      params: {
        filters: JSON.stringify(filters),
      },
    });
  };


  return (
    <View style={styles.screen}>
      {/*top film strip*/}
      <Image source={require('../assets/images/homeFilmSticker.png')}
        style={styles.filmTop}
        resizeMode="contain"
      />
      
      {/*title*/}
      <Text style={styles.title}>MAKE YOUR SELECTION!</Text>

      {/*everything inside the element that scrolls (questions + options + buttons at the end)*/}
      <View style={styles.scrollView}>
        <ScrollView contentContainerStyle={{ paddingBottom: 226 }}>

        {/*MOOD QUESTION*/}
          <Text style={[styles.questions, {}]}>What mood are you feeling for today?</Text>

          <View style= {styles.buttonsContainer}>
            {moods.map((mood) => {
            return (
              <TouchableOpacity key={mood} style={[styles.buttonBox, selMood.includes(mood) ? {borderColor: '#C7AF95'} : {borderColor: '#411B1B'}]} activeOpacity={0.8} 
                onPress={() => {
                  if (selMood.includes(mood)) { setSelMood(""); } 
                  else { setSelMood(mood); }
                }
              }>
                <Text style={[styles.button, selMood.includes(mood) ? {color: '#C7AF95'} : {color: '#834141'}]}>{mood.toUpperCase()}</Text>
              </TouchableOpacity>
            )
          })}
          </View>

        {/*GENRE QUESTION*/}
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

        {/*SUBSCRIPTION SERVICE QUESTION*/}
          <Text style={[styles.questions, {}]}>What subscription services are avaliable to you?</Text>

          <View style= {styles.buttonsContainer}>
            {services.map((service) => {
              return (
                <TouchableOpacity key={service} style={[styles.buttonBox, selServices.includes(service) ? {borderColor: '#C7AF95'} : {borderColor: '#411B1B'}]} activeOpacity={0.8} onPress={() => {
                  if (selServices.includes(service)) { setSelServices(selServices => selServices.filter(item => item !== service)); } 
                  else { setSelServices(selServices => [...selServices, service]); }
                }}>
                  <Text style={[styles.button, selServices.includes(service) ? {color: '#C7AF95'} : {color: '#834141'}]}>{service.toUpperCase()}</Text>
                </TouchableOpacity>
              )
            })}
          </View>

        {/*DURATION QUESTION*/}
          <Text style={[styles.questions, {}]}>How long would you like your film to be?</Text>

          {/* used a slider component to make the time range */}
          <View style={[{alignSelf: 'center', width: '90%'}]}>
            <Slider 
                value={duration}
                onValueChange={val => setDuration(val)}
                step={10}
                minimumValue={50}
                maximumValue={200}
                minimumTrackTintColor="#632020"
                maximumTrackTintColor="#C7AF95"
                thumbTintColor="#632020"
                thumbTouchSize={{ width: 40, height: 40 }}
                trackStyle={styles.track}
                thumbStyle={styles.thumb}
                containerStyle={styles.sliderContainer}
            />
          {/* text showcasing range of slider*/}
            <View style={[styles.sliderTextRow, {marginTop: '16%', width: '105%'}]}>
              <Text style={[{fontFamily: 'Inter_400Regular_Italic', fontSize: 14, color: '#E3DDB9'}]}>50 mins</Text>
              <Text style={[{fontFamily: 'Inter_400Regular_Italic', fontSize: 14, color: '#E3DDB9'}]}>200 mins</Text>
            </View>
          {/* text displaying what numbers the user is on for the slider*/}
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

        {/* buttons at the button of the screen (clear selection - submit selection)*/}
          <View style={styles.ticketButtonsRow}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {setDuration([60, 160]),  setSelMood(""), setSelGenres([]), setSelServices([])}}>
              <Image source={require('../assets/images/preferencesClearSelection.png')}/>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={() => {handleSubmit()}}>
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