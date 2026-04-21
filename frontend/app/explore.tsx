import ExploreGrid from "@/components/exploreGrid";
import { Movie } from "@/components/resultsCarousel";
import { MovieswithAdditionalInformation } from "@/tmdbAPI";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Navbar from "../components/navbar";


//explore page
export default function Explore() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

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

        //sort in alphabetical order by title
        const sorted = formattedMovies.sort((movie_a, movie_b) => movie_a.title.localeCompare(movie_b.title));
        setAllMovies(sorted);
        setMovies(sorted);
      };
    loadMovies();
  }, []);

  // Handle search as user types
  useEffect(() => {
    if (text.trim() === '') {
      // Show all movies if search is empty
      setMovies(allMovies);
    } else {
      // Filter movies from the loaded dataset only
      const searchQuery = text.toLowerCase();
      const filteredMovies = allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery)
      );
      setMovies(filteredMovies);
    }
  }, [text, allMovies]);
      

  return (
    <View style={styles.screen}>

      {/*search bar*/}
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="🔎︎   tap to search for your next favorite film..." placeholderTextColor={'#AA7A7A'}/>
      </View>

      {/*title for movies*/}
      <Text style={styles.text}>{text.trim() ? 'Search Results' : 'Movies A-Z'}</Text>

      <View style={styles.gridContainer}>
        <ExploreGrid movies={movies}/>
      </View>

      {/*navbar*/}
      <Navbar />
      
    </View>
  );
}

//UI styles for the explore screen with positioning
const styles=StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#834141',
  },
  inputContainer: {
    position: 'absolute',
    width: '90%',
    height: '4%',
    top: '10%',
    left: '4%',
    backgroundColor: '#632020',
    opacity: 0.5,
    borderRadius: 60,
  },
  input: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: '#ffffff',
    position: 'absolute',
    width: '90%',
    height: '100%',
    alignSelf: 'center',
  },
  text: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: '#CEABAB',
    position: 'absolute',
    top: '18%',
    left: '5%',
  },
  gridContainer: {
    position: 'absolute',
    top: '21.6%',
    width: '96%',
    height: '67%',
    alignSelf: 'center',
  }
})