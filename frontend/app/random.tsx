import { Movie } from "@/components/resultsCarousel";
import { RandomMovieWithAdditionalInformation } from "@/tmdbAPI";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Navbar from "../components/navbar";
import { GENRE_ID_TO_NAME } from "../tmdbAPI";

export default function Random() {
    const router = useRouter();
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const loadMovies = async () => {
      const randomMovie = await RandomMovieWithAdditionalInformation();
      if(!randomMovie) return;

      const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
      const formattedMovie={
        id: String(randomMovie.id),
        poster_URL: `${IMAGE_BASE}${randomMovie.poster_path}`,
        title: randomMovie.title,
        year: randomMovie.release_date?.split("-")[0] || "N/A",
        genre: (randomMovie.genre_ids || []).map((id: number) => GENRE_ID_TO_NAME[String(id)] || "Unknown"),
        duration: 'N/A',
        streaming: randomMovie.streaming,
        match: 'N/A',
      }
      setSelectedMovie(formattedMovie);
    };

      useEffect(() => {
        loadMovies();
      }, []);
    
  return (
    <View style={styles.screen}>
      <Image
        source={require('../assets/images/profileFilmSticker.png')}
        style={styles.filmTop}
        resizeMode="contain"
      />

    {/*title and decor*/}
      <Text style={styles.title}>
              YOUR RANDOMIZED SELECTION!
      </Text>

      <Image 
              source={require('../assets/images/movieDecorTop.png')}
              style={styles.decorTop}
              resizeMode="contain"/>

    {/*Movie displayed*/}
      {selectedMovie && (
       <View style={styles.cardContainer}>
            <Image source = {require("../assets/images/resultsMovieBorder.png")} style={styles.frame}/>
            <Image source={{uri: selectedMovie.poster_URL}} style={styles.poster} />
        </View>
      )}
      <Image 
              source={require('../assets/images/movieDecorBottom.png')}
              style={styles.decorBottom}
              resizeMode="contain"
      />
      {/*Movie title & info area*/}
        {selectedMovie && (
          <View style={styles.movieTextContainer}>
            <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.movieTitle, {position: 'absolute', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.movieTitle, {position: 'absolute',textShadowOffset: { width: 1, height: 0 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.movieTitle, {position: 'absolute', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.movieTitle, {position: 'absolute', textShadowOffset: { width: -1, height: -1 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.movieTitle, {position: 'absolute', textShadowOffset: { width: -1, height: 0 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.movieTitle, {position: 'absolute', textShadowOffset: { width: 0, height: -1 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.movieTitle, {position: 'absolute', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.movieTitle, {position: 'absolute',textShadowOffset: { width: 1, height: -1 }, textShadowRadius: 1}]}>{selectedMovie.title.toUpperCase()}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.movieTitle}>{selectedMovie.title.toUpperCase()}</Text>


            <Text style={styles.movieInfo}> Genre: {selectedMovie.genre?.join(", ")} | Duration: {selectedMovie.duration} | Year: {selectedMovie.year} | Found On: {selectedMovie.streaming?.join(", ")}</Text>
          </View>
        )}

      {/*ticket buttons*/}
          <View style={styles.ticketRow}>
            <TouchableOpacity activeOpacity={0.8} style={styles.ticketButton} onPress={loadMovies}>
                    <Image 
                    source={require('../assets/images/ticket2Random.png')}
                    style={styles.ticketImage}
                    resizeMode="contain"
                    />
            </TouchableOpacity>
          </View>
      <Navbar />
      
    </View>

  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#834141',
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
  movieTextContainer: {
    position: 'absolute',
    top: '63%',
    width: '92%',
    alignSelf: 'center',
    alignItems: 'center',
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
  filmTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 445,
  },
  decorTop: {
    position: 'absolute',
    top: 160,
    left: 135,
    width: '100%',
    height: 50,
    
  },
  decorBottom: {
    position: 'absolute',
    bottom: 345,
    right: 135,
    width: '100%',
    height: 50,
    
  },
  cardContainer: {
    width: 267,
    height: 392,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '19%',
    alignSelf: 'center',
},
  frame: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
  },
  poster: {
      width: '90%',
      height: '90%',
  },
  ticketRow: {
    position: 'absolute',
    bottom: 120,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  ticketButton: {
    flex: 1,
    alignItems: 'center',
  },
  ticketImage: {
    width: 141,
    height: 84,
  },
});
