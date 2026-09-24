const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

import { Client, TablesDB, Query } from 'appwrite'
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID)
const tablesDB = new TablesDB(client);

//updated syntax for the latest version of appwrite 

//run this again whenever a user clicks on a movie??!!!!!

//Track searches made by different users
export const updateSearchCount = async (movie) => {
    //use appwrite SK to check if the search term already exists in database
    try {

        const result = await tablesDB.getRow({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            rowId: String(movie.id)
        });

        //so just update the count if so
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
        if (error.code === 404) {
        // Row does not exist

            await tablesDB.createRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: String(movie.id),
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

        return result.rows

    } catch (error) {
        console.error(error)
    }
}