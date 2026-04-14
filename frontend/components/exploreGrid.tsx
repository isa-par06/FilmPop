import { FlatList, Image, StyleSheet, View } from "react-native";

//movie type (we only need id, title, + poster for the explore page grid)
type Movie = {
  id: string;
  title: string;
  poster_URL: string;
};

//we just need an array of movies for the function
type Props = {
  movies: Movie[];
};

//creates + renders the explore page grid of movies
export default function ExploreGrid({ movies }: Props) {
    return (
        <FlatList
            data={movies}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}

            //renders just the poster image
            renderItem={({item }) => (
                <View style={styles.posterCard}>
                    <Image source={{ uri: item.poster_URL }} style={styles.poster} />
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    //styles each row of movies (w/ 3 movies each)
    row: {
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    //styles the entire block of movies
    listContent: {
        paddingHorizontal: 8,
        paddingBottom: 60,
    },
    //styles the poster size
    posterCard: {
        width: '32.6%',
    },
    //styles the poster image 
    poster: {
        width: '100%',
        aspectRatio: 0.67,
        borderWidth: 2,
        borderColor: '#281D1D'
    },
});