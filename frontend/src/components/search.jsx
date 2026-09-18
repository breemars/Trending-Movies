

/* the props need to be in {} as I am destructuring the object it recieved*/
const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className="search">
        {/* search icon goes here */ }

        <input 
            type="text"
            className="input input-lg w-100 max-w-full"
            placeholder="search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />


        {/* as someone types, the search term will get updated */ }
        
    </div>
  )
}

export default Search