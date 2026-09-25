{/* Returns a Search Field */}
import { Search as SearchIcon } from 'lucide-react'; //Since the component is named search, the icon had to be named something else

// The {} are necessary because we are destructuring the props object received by the component
const Search = ({searchTerm, setSearchTerm}) => {
  return (

    <div className="input input-lg w-100 max-w-full">
      {/* Styling is placed on a DIV so that the search icon appears to be inside of the search box */ }
        
        {/* Search Icon*/ }
        <SearchIcon color="#8D9BF8" />

        <input 
            type="text"
            placeholder="search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* As someone types, the search term will get updated */ }
        
    </div>
  )
}
export default Search