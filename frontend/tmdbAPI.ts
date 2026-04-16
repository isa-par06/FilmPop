//CITATION: Medium, How to Fetch and Display Movie List Using TMDB API

const apiKey = '10c6c5ea756731e81e1748979a8d4cd9';

//genre mapping, api provides genre in #, convert to strings, easier to read!
const GENRE_MAP: { [key:string]: number} = {
    action : 28,
    western: 37,
    war: 10752,
    thriller: 53,
    "tv movie": 10770,
    "science fiction": 878,
    romance: 10749,
    mystery: 9648,
    music: 10402,
    horror: 27,
    history: 36,
    fantasy: 14,
    family: 10751,
    drama: 18,
    documentary: 99,
    crime: 80,
    comedy: 35,
    animation: 16,
    adventure: 12
}

//being used outside this file, need to export it unlike genre_map
export const GENRE_ID_TO_NAME: { [key:string]: string} = {
    28: "Action",
    37: "Western",
    10752: "War",
    53: "Thriller", 
    10770: "TV Movie",
    878: "Science Fiction",
    10749: "Romance",
    9648: "Mystery",
    10402: "Music",
    27: "Horror",
    36: "History",
    14: "Fantasy",
    10751: "Family",
    18: "Drama",
    99: "Documentary",
    80: "Crime",
    35: "Comedy",
    16: "Animation",
    12: "Adventure"
}
    

/* USING THESE FUNCTIONS:
in another page,

import {MovieswithAdditionalInformation, filterUsingGenre, filterUsingStreamingService, filterUsingMood, filterUsingLength} from "../tmdbAPI";

FETCH ALL MOVIES:
(originally had fetchMovieData, but this didn't include streaming or runtime info, so this adds streaming + runtime info to each movie)
const movies = await MovieswithAdditionalInformation();

FILTERING:
1. mood
movies classified under the mood "curious" will be returned
const filteredMood = filterUsingMood(movies, "curious");

2. streaming service
movies streaming on netflix will be returned
const filteredStreaming = filterUsingStreamingService(movies, ["Netflix"]);

3. genre
horror movies will be returned
const filteredGenre = filterUsingGenre(movies, ["horror"]);

4. length
const filtered = filterUsingLength(movies, 70, 120);
console.log("filtered:", filtered.length);
if (filtered.length >0 ){
     console.log("filtered movies using length:", JSON.stringify(filtered[0], null, 2));
}

5. applying multiple filters at the same time
happy (mood), comedic (genre) movies on netflix example:

const movies = await MovieswithAdditionalInformation();
const filteredMood = filterUsingMood(movies, "happy");
const happyNetflixMovies = filterUsingStreamingService(filteredMood, ["Netflix"]);
const happyComediesNetflixMovies = filterUsingGenre(happyNetflixMovies, ["comedy"]);

this will display a movie that matches all of those!
on website, right click + inspect, should see console displayed

json.stringify converts the value to a string, making it more readable
 if (happyComediesNetflixMovies.length >0){
      console.log("example movie", JSON.stringify(happyComediesNetflixMovies[0], null, 2));
    }

    null = all properties of obj included, 2 = amount of spaces for readability



*/
export async function fetchStreamingData(movieID: number){
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/watch/providers?api_key=${apiKey}`);
        
        if (!response.ok) {
            throw new Error('Failed to retrieve the streaming information for desired movie.')
        }

        //convert the response into data 
        const data = await response.json();

        let streamingSubscriptions = [];

        //results are US providers and available for free if subscribed to that streaming service
        //ie: no 3.99 to rent, 10.99 to buy
        if (data.results && data.results.US && data.results.US.flatrate){
            streamingSubscriptions = data.results.US.flatrate;
        }

        console.log("Streaming data:", data);
        //.map() looping thru each item, returning the provider name, and then returning the provider names
        const streamingServices = streamingSubscriptions.map((streaming: {provider_name: string}) => streaming.provider_name);
        return streamingServices;
    }


     //catch any error message + return what the error is
    catch(error:any){
        console.error('Error fetching movie information', error.message );
        return []
    }

}

//fetch() sends HTTP requests + can handle responses asynchronously
//makes network connections
export async function fetchMovieData(){
    try {

        //we want to limit the amount of movies we are filtering through due to performance issues
        let movies: any[] = [];
        for (let page = 1; page < 4; page ++){
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_watch_monetization_types=flatrate&sort_by=popularity.desc&watch_region=US&vote_average.gte=7&vote_count.gte=800&page=${page}`);
               //handle response, check for errors, parse, use data
            
            if (!response.ok){
                throw new Error('Failed to retrieve the movie information');
            }
         
            const data = await response.json();
            //adding movies to the array through each loop
            movies = movies.concat(data.results);
        }

        console.log("total movies:", movies.length);
         return movies;
    }

    //catch any error message + return what the error is
    catch(error:any){
        console.error('Error fetching movie information', error.message );
        return []
    }
}


//fetching movie length
export async function fetchMovieLength(movieID: number){
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}`);
        
        if (!response.ok) {
            throw new Error('Failed to retrieve the streaming information for desired movie.')
        }

        //convert the response into data 
        const data = await response.json();

        return data.runtime;
    }

     //catch any error message + return what the error is
    catch(error:any){
        console.error('Error fetching movie information', error.message );
        return 0;
    }

}




//adding streaming services as a property to each movie
export async function MovieswithAdditionalInformation(){
    const movies = await fetchMovieData();
    
    //await waits for the result of a promise to resolve 
    //fetch() returns a promise

    const moviesExtraInfo = [];


    //for loop for now, may have to change for optimization purposes
    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];

        const streaming = await fetchStreamingData(movie.id);
        const movieLength = await fetchMovieLength(movie.id);

        //need to add the streaming service to the movie
        //creating a copy of the movie because we don't want to accidentally modify the OG data of the movie
        const movieAttributes = Object.assign({}, movie, {streaming: streaming,
            runtime: movieLength
        });
        //copies movie and streaming service + movie length into the target ({}) object

        moviesExtraInfo.push(movieAttributes);
    }

    //list of movies now with a streaming service property
    return moviesExtraInfo;
}

export function filterUsingGenre (movies: any[], selectedGenre: string[]){
    const genreIDS = selectedGenre.map((genre)=> GENRE_MAP[genre.toLowerCase()]);
    
    //going through each movie in array, filter() is creating a shallow copying
    //and filtering based on the "test" (if genre matches selected genre) //
    const result = movies.filter((movie) => {
    
    for (let i =0; i < movie.genre_ids.length; i++){
        const genre = movie.genre_ids[i];

        //checks if the arr has the genre
        //include() checks and returns if true or false 
        if (genreIDS.includes(genre)) {
            return true;
        }
    }        
       return false; 
    });
    
    return result;
}

export function filterUsingStreamingService (movies: any[], selectedService: any[]){
    //same logic as above, but with streaming service
    const result = movies.filter((movie) => {
        if (!movie.streaming) {
            return false; 
            //don't want to crash if there's no streaming service
        }
        for (let i = 0; i < movie.streaming.length; i++) {
            const streamingService = movie.streaming[i];

            //accounting for case sensitivity! 
            if (selectedService.some(service=> streamingService.toLowerCase().includes(service.toLowerCase()))) {
                return true;
            }
        }
        return false;
    })

    return result;
}

export function filterUsingMood(movies: any[], mood: string){
    // we are going to determine mood using genres
    let genres: string[] = [];

    //case sensitive
    mood = mood.toLowerCase();

    //genres are denoted with numbers
    if (mood == "happy") {
        //family, animation, comedy
        genres = ["family", "animation", "comedy"]
    }

    else if (mood == "scared") {
        //horror, thriller
        genres = ["horror", "thriller"]
    }

    else if (mood == "romantic"){
        //romance
        genres = ["romance"]
    }

    else if (mood == "curious") {
        //documentaries, history
        genres = ["documentary", "history"]
    }

    else if (mood == "adventurous"){
        //adventure, action
        genres = ["adventure", "action"]
    }

    if (genres.length == 0){
        return movies;
    }

    //we are mapping moods to genres, then using those genres to filter the movies
    return filterUsingGenre(movies, genres);

}

//filter by duration of the movie
export function filterUsingLength(movies: any[], minimum: number, maximum: number) {
    const result = movies.filter((movie) => {
        if (!movie.runtime) {
            return false; 
            //don't want to crash if there's no runtime listed
        }
        if ( movie.runtime >= minimum && movie.runtime <= maximum) {
            return true;
        }

        return false;
    })

    return result; 
}