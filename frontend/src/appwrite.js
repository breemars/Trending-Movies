const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

import { Client, TablesDB, Query } from 'appwrite'

// Create an Appwrite client that will be used to communicate with our Appwrite backend.
// The endpoint tells the client where the Appwrite server is located,
// while the project ID tells Appwrite which project we want to work with.
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID)

// Create a TablesDB instance using our Appwrite client
const tablesDB = new TablesDB(client);

// This function updates how many times each movie is either searched for
// or selected by a user. We use the movie's ID as the row ID in Appwrite
// so that each movie has its own unique row in the database.
export const updateTrendingCount = async (movie) => {
    
    try {
        // Check to see if a row for this movie in the database exists
        const result = await tablesDB.getRow({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            rowId: String(movie.id)
        });

        // If the movie already exists in our database, we update the existing row
        // by increasing its trending rank (count) by 1.
        await tablesDB.updateRow({
                databaseId: DATABASE_ID, 
                tableId: TABLE_ID, 
                rowId: result.$id, 
                data: {
                    count: result.count + 1
                }
        });

    //if not, add it to database with count as 1
    } catch (error) {

        // If there is no row for this movie yet, Appwrite returns a 404 error.
        // so we add a new row with an initial count of 1
        if (error.code === 404) {
            await tablesDB.createRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: String(movie.id), //Appwrite uses strings as its IDs
                // Store the movie information that we might need to display later:
                data: {
                    title: movie.title,
                    count: 1,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average,
                    original_language: movie.original_language,
                    overview: movie.overview,
                    release_date: movie.release_date
                }
            });

        } else {
            console.error(error);
        } 
    }
}


// This function gets the movies that are currently trending based on
// the COUNT of how many times users have searched for or selected them.
// Only returns the first five based on descending order.
export const getTrendingMovies = async () => {

    try {
        const result = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [
                Query.limit(5),
                Query.orderDesc("count")
            ]
        });

        return result.rows //Returns an array of movie objects

    } catch (error) {
        console.error(error)
    }
}