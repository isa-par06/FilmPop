import { FlatList, Image, StyleSheet, View } from "react-native";

type Movie = {
  id: string;
  title: string;
  poster_URL: string;
};

type Props = {
  movies: Movie[];
};

export default function ExploreGrid({ movies }: Props) {
    return (
        <FlatList
            data={movies}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            renderItem={({item }) => (
                <View style={styles.posterCard}>
                    <Image source={{ uri: item.poster_URL }} style={styles.poster} />
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    row: {
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    listContent: {
        paddingHorizontal: 8,
        paddingBottom: 60,
    },
    posterCard: {
        width: '32.6%',
    },
    poster: {
        width: '100%',
        aspectRatio: 0.67,
        borderWidth: 2,
        borderColor: '#281D1D'
    },
});