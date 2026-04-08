//CITATION: Medium, How to Fetch and Display Movie List Using TMDB API

const apiKey = '10c6c5ea756731e81e1748979a8d4cd9';

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
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
    
    
          //handle response, check for errors, parse, use data
        if (!response.ok){
            throw new Error('Failed to retrieve the movie information');
        }

         const data = await response.json();

         return data.results;
    }

    //catch any error message + return what the error is
    catch(error:any){
        console.error('Error fetching movie information', error.message );
        return []
    }
}

//adding streaming services as a property to each movie
export async function MovieswithStreamingInformation(){
    const movies = await fetchMovieData();
    
    //await waits for the result of a promise to resolve 
    //fetch() returns a promise

    const moviesWithStreaming = [];


    //for loop for now, will have to change for optimization purposes
    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];

        const streaming = await fetchStreamingData(movie.id);

        //need to add the streaming service to the movie
        //creating a copy of the movie because we don't want to accidentally modify the OG data of the movie
        const movieWithStreaming = Object.assign({}, movie, {streaming: streaming});
        //copies movie and streaming service into the target ({}) object

        moviesWithStreaming.push(movieWithStreaming);
    }

    //list of movies now with a streaming service property
    return moviesWithStreaming;
}

export function filterUsingGenre (movies: any[], selectedGenre: any[]){
    //going through each movie in array, filter() is creating a shallow copying
    //and filtering based on the "test" (if genre matches selected genre) //
    const result = movies.filter((movie) => {
    
    for (let i =0; i < movie.genre_ids.length; i++){
        const genre = movie.genre_ids[i];

        //checks if the arr has the genre
        //include() checks and returns if true or false 
        if (selectedGenre.includes(genre)) {
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
        for (let i = 0; i < movie.streaming.length; i++) {
            const streamingService = movie.streaming[i];

            if (selectedService.includes(streamingService)) {
                return true;
            }
        }
        return false;
    })

    return result;
}

export function filterUsingMood(movies: any[], mood: string){
    // we are going to determine mood using genres
    let genres: number[] = [];

    //case sensitive
    mood = mood.toLowerCase();

    //genres are denoted with numbers
    if (mood == "happy") {
        //family, animation, comedy
        genres = [10751, 16, 35]
    }

    else if (mood == "scared") {
        //horror, thriller
        genres = [27, 53]
    }

    else if (mood == "romantic"){
        //romance
        genres = [10749]
    }

    else if (mood == "curious") {
        //documentaries, history
        genres = [99, 36]
    }

    else if (mood == "adventurous"){
        //adventure, action
        genres = [12, 28]
    }

    if (genres.length == 0){
        return movies;
    }

    //we are mapping moods to genres, then using those genres to filter the movies
    return filterUsingGenre(movies, genres);

}

