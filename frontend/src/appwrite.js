const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

import { Client, ID, TablesDB, Query } from 'appwrite'
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID)
const tablesDB = new TablesDB(client);

//updated syntax for the latest version of appwrite 

//run this again whenever a user clicks on a movie??!!!!!

//Track searches made by different users
export const updateSearchCount = async (searchTerm, movie) => {
    //use appwrite SK to check if the search term already exists in database
    try {

        const result = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [
                Query.equal("searchTerm", searchTerm),
                Query.limit(1)
            ]
        });

        //WHY are we even storing the search term and looking up by search term instead of movie ID????? I WILL CHANGE THIS.

        console.log(result.rows)
        console.log(result.total)

        //so just update the count if so
        if(result.total > 0){
            const row = result.rows[0];

            await tablesDB.updateRow({
                databaseId: DATABASE_ID, 
                tableId: TABLE_ID, 
                rowId: row.$id, 
                data: {
                    count: row.count + 1
                }
            });

        } else {
        //if not, add it to database with count as 1
            await tablesDB.createRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: ID.unique(),
                data: {
                    searchTerm,
                    count: 1,
                    movieID: movie.id,
                    posterURL: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                }
            });
        }
    
    } catch (error) {
        console.error(error);
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