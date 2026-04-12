import { useRef } from "react";
import { Animated, Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet } from "react-native";


//placeholder for API Movie data
export type Movie = {
  id: string;
  poster_URL: string;
  title: string;
  year: number;
  genre: string[];
  duration: string;
  streaming: string[];
  match: string; //idk if we are storing this or not, can be deleted if not needed
};

//props used for the movie carousel - an array of the movies that are being displayed and a function 
//that is called once the user stops scrolling to snap the carousel to the closest movie
type movieCarouselProps = {
    movies: Movie[];
    onSnapToItem: (movie: Movie, index: number) => void;
} 

//measurements and constants to use for the carousel
const { width } = Dimensions.get('window');

const ITEM_WIDTH = width * 0.647;
const ITEM_HEIGHT = ITEM_WIDTH * 1.47;
const SPACING = 2;
const SNAP_INTERVAL = ITEM_WIDTH + SPACING;
const SIDE_PADDING = (width - ITEM_WIDTH) / 2;

export default function ResultsCarousel({ movies, onSnapToItem }: movieCarouselProps) {
    const scrollX = useRef(new Animated.Value(0)).current; //continuously updated scroll data for animation/visual effects

    //what happens when the user stops scrolling - the carousel snaps to the closest movie 
    const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x; //gets current horizontal scroll position once the scrolling has stopped
        const index = Math.round(offsetX / SNAP_INTERVAL); //converts scroll position to index of movie thats the closest

        //only snap to that index if a movie belongs there
        if (movies[index]) {
            onSnapToItem(movies[index], index); //calls the onSnapToItem function with the movie at the calculated index so carousel snaps to that movie
        }
    };

    return (
        <Animated.FlatList
            data={movies} //data being used in the list (movies)
            keyExtractor={(item) => item.id} //gets the id for each movie to use as a key for the list
            horizontal //makes the list scroll horizontally
            showsHorizontalScrollIndicator = {false} //hides scroll bar
            bounces = {true} //makes list bounce when it reaches the end
            decelerationRate = {'fast'} //makes scroll stop faster (better snapping)
            snapToInterval = {SNAP_INTERVAL} //dictates location of snap (created by SNAP_INTERVAL)
            snapToAlignment = {'start'} //dictates where the snap is aligned to (start of the movie item)
            contentContainerStyle = {styles.contentContainer}
            ItemSeparatorComponent={() => <Animated.View style={{ width: SPACING }} />}
            onMomentumScrollEnd = {handleScrollEnd} //calls function for end scroll logic
            scrollEventThrottle = {16} //how often scroll updates are set (16ms or 60fps for smooth animation)

            //as the user scrolls, keep track of scroll postion with scrollX
            onScroll = {Animated.event([{nativeEvent: { contentOffset: {x: scrollX}}}],
                { useNativeDriver: true} //just for better performance
            )}

            //renders each movie item in the carousel
            renderItem = {({item, index}) => {
                const inputRange = [
                    (index - 1) * SNAP_INTERVAL, //position of left movie
                    index * SNAP_INTERVAL, //position of middle/current movie
                    (index + 1) * SNAP_INTERVAL, //position of right movie
                ];

                //interpolates the scrollX value so the images scale up and down as the get closer and farther from the middle
                const scale = scrollX.interpolate ({
                    inputRange, outputRange: [0.82, 1, 0.82], extrapolate: 'clamp',
                });

                //interpolates the scrollX value so the images fade in and out as they get closer and farther from the middle
                const opacity = scrollX.interpolate ({
                    inputRange, outputRange: [0.5, 1, 0.5], extrapolate: 'clamp',
                });

                return (
                    //movie item with the scaling and opacity animation applied to it and a border frame around it
                    <Animated.View style={[styles.cardContainer, { transform: [{scale}], opacity }]}>
                        <Image source = {require("../assets/images/resultsMovieBorder.png")} style={styles.frame}/>
                        <Image source={{uri: item.poster_URL}} style={styles.poster} />
                    </Animated.View>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        paddingHorizontal: SIDE_PADDING, //makes sure the first and last movie are centered  
    },
    cardContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
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
});
