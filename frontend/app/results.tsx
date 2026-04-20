import ResultsCarousel, { Movie } from "@/components/resultsCarousel";
import { filterUsingGenre, filterUsingLength, filterUsingMood, filterUsingStreamingService, GENRE_ID_TO_NAME, MovieswithAdditionalInformation } from "@/tmdbAPI";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Navbar from "../components/navbar";
import {GENRE_ID_TO_NAME} from "../tmdbAPI";

type Filters = {
  minTime: number;
  maxTime: number;
  mood: string;
  genres: string[];
  services: string[];
};


//results recommendations page
export default function Results() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {filters} = useLocalSearchParams();

  const parsedFilters: Filters = filters
    ? JSON.parse(filters as string)
    : {
        minTime: 20,
        maxTime: 160,
        mood: "",
        genres: [],
        services: [],
      };

  useEffect(() => {
    const loadMovies = async () => {
      const data = await MovieswithAdditionalInformation();

      let filteredMovies = data;

      filteredMovies = filterUsingLength(filteredMovies, parsedFilters.minTime, parsedFilters.maxTime);

      if (parsedFilters.mood) {
        filteredMovies = filterUsingMood(filteredMovies, parsedFilters.mood);
      }

      if (parsedFilters.genres && parsedFilters.genres.length > 0) {
        filteredMovies = filterUsingGenre(filteredMovies, parsedFilters.genres);
      }

      if (parsedFilters.services && parsedFilters.services.length > 0) {
        filteredMovies = filterUsingStreamingService(filteredMovies, parsedFilters.services);
      }

      const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
      const formattedMovies = filteredMovies.map((movie: any) => ({
        id: String(movie.id),
        poster_URL: `${IMAGE_BASE}${movie.poster_path}`,
        title: movie.title,
        year: movie.release_date?.split("-")[0] || "N/A",
        genre: (movie.genre_ids || []).map((id: number) => GENRE_ID_TO_NAME[String(id)] || "Unknown"),
        duration: movie.runtime,
        streaming: movie.streaming,
        match: 'N/A', //placeholder
      }));


      setMovies(formattedMovies);
      setSelectedMovie(formattedMovies[0]); // set first movie as default

      setIsLoading(false);
    };

    loadMovies();
  }, []);


  return (
    <View style={styles.screen}>

      {isLoading && (
        <View style={styles.indicator}>
          <ActivityIndicator size="small" color="#3D1313" />
        </View>
      )}
      {!isLoading && movies.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            Unfortunately, there are no recommendations that match your preferences at this time, please try again.
          </Text>
        </View>
      )}

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
        Here you will find all the movies that match your preferences. Swipe to discover your next favorite film! Enjoy!
      </Text>

      <View style={styles.carousel}>
        <ResultsCarousel movies={movies} onSnapToItem={(movie) => setSelectedMovie(movie)}/>
      </View>

      {/*info under carousel about the selected movie*/}
      <View style={styles.carouselText}>

        <ScrollView>
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


            <Text style={styles.movieInfo}> Genre: {selectedMovie.genre?.join(", ")} | Duration: {selectedMovie.duration} mins | Year: {selectedMovie.year} | Found On: {selectedMovie.streaming?.join(", ")}</Text>
          </>
        )}
        </ScrollView>
      </View>

      {/*button row at the bottom of the page (edit selection - restart)*/}
      <View style={styles.buttonsRow}>
        {/*button takes you back to preferences (to edit, so preferences must be saved)*/}
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/preferences')}>
          <Image source={require('../assets/images/edit_selection_button.png')}/>
        </TouchableOpacity>


        {/*restart button - takes user back to the empty preference page*/}
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
  noResultsContainer: {
    position: 'absolute',
    top: "10%",
    height: "42%",
    width: "100%",
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#CEABAB',
    top: '40%',
    width: '80%',
    alignSelf: 'center',
    textAlign: 'center',
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
  indicator: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: "60%",
    top: "20%"
  },
})