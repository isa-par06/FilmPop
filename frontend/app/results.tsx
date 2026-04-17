import ResultsCarousel, { Movie } from "@/components/resultsCarousel";
import { MovieswithAdditionalInformation } from "@/tmdbAPI";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Navbar from "../components/navbar";

//results recommendations page
export default function Results() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await MovieswithAdditionalInformation();

      const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
      const formattedMovies = data.map((movie: any) => ({
        id: String(movie.id),
        poster_URL: `${IMAGE_BASE}${movie.poster_path}`,
        title: movie.title,
        year: movie.release_date?.split("-")[0] || "N/A",
        genre: movie.genre_ids,
        duration: movie.runtime + " mins",
        streaming: movie.streaming,
        match: 'N/A', //placeholder
      }));

      setMovies(formattedMovies);
      setSelectedMovie(formattedMovies[0]); // set first movie as default
    };

    loadMovies();
  }, []);

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
        YOUR MOVIE RECOMMENDATIONS!
      </Text>

      {/*page subtitle - description of recommendations*/}
      <Text style={styles.description}>
        description of recommendations here. description of recommendations here. description of recommendations here. description of recommendations here.
      </Text>

      <View style={styles.carousel}>
        <ResultsCarousel movies={movies} onSnapToItem={(movie) => setSelectedMovie(movie)}/>
      </View>

      {/*info under carousel about the selected movie*/}
      <View style={styles.carouselText}>
        <ScrollView style={styles.scroll}>
        {selectedMovie && (
          <>
            <Text style={[styles.movieTitle, {position: 'absolute', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>
            <Text style={[styles.movieTitle, {position: 'absolute',textShadowOffset: { width: 1, height: 0 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>
            <Text style={[styles.movieTitle, {position: 'absolute', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>
            <Text style={[styles.movieTitle, {position: 'absolute', textShadowOffset: { width: -1, height: -1 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>
            <Text style={[styles.movieTitle, {position: 'absolute', textShadowOffset: { width: -1, height: 0 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>
            <Text style={[styles.movieTitle, {position: 'absolute', textShadowOffset: { width: 0, height: -1 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>
            <Text style={[styles.movieTitle, {position: 'absolute', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>
            <Text style={[styles.movieTitle, {position: 'absolute',textShadowOffset: { width: 1, height: -1 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>

            <Text style={styles.movieTitle}>{selectedMovie.title.toUpperCase()}</Text>


            <Text style={styles.movieInfo}> Genre: {selectedMovie.genre?.join(", ")} | Duration: {selectedMovie.duration} | Year: {selectedMovie.year} | Found On: {selectedMovie.streaming?.join(", ")}</Text>
          </>
        )}
        </ScrollView>
      </View>

      {/*button row at the bottom of the page (edit selection - add to watchlist - restart)*/}
      <View style={styles.buttonsRow}>
        {/*button takes you back to preferences (to edit, so preferences must be saved)*/}
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/preferences')}>
          <Image source={require('../assets/images/edit_selection_button.png')}/>
        </TouchableOpacity>

        {/*onPress must be CHANGED to add movie to watchlist instead of route to preferences!!!!!!!!!!*/}
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/preferences')}>
          <Image source={require('../assets/images/add_to_watchlist_button.png')}/>
        </TouchableOpacity>

        {/*restart button - takes user back to the home page*/}
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/home')}>
          <Image source={require('../assets/images/restart_button.png')}/>
        </TouchableOpacity>
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
    top: '7.6%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#CEABAB',
    top: '16.8%',
    width: '80%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  carousel: {
    position: 'absolute',
    top: '22.4%',
  },
  carouselText: {
    top: '61%',
    width: '95%',
    height: '14%',
    alignSelf: 'center',
  },
  scroll: {

  },
  movieTitle: {
    fontFamily: 'AveriaSerifLibre_700Bold',
    fontSize: 36,
    color: '#552121',
    textShadowColor: "#CEABAB", // outline color
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 36,
  },
  movieInfo: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: '#CEABAB',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 6,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    top: '62%',
  },
})