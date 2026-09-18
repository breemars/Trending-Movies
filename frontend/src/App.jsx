import { useState } from 'react'
import Search from './components/search'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  
  return (
    <div className="min-h-screen md:grid md:grid-cols-[400px_1fr] bg-linear-to-b from-[#040111] to-[#000077]">

      {/* Sidebar */}
      <div className="flex flex-col gap-3 p-5 bg-transparent">
        
        <h1 className="text-4xl text-center font-bold">🍿 Trending <span className="text-gradient">Movies</span></h1>

        <div className="flex-1 bg-[#050217]/75 rounded-4xl">
          {/* Trending movies */}
        </div>

      </div>

      {/* Right side */}
      <div className="flex flex-col gap-3 px-5">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between p-6">
          <h2 className="text-2xl italic">All Movies</h2>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* Main content */}
        <div className="flex-1 bg-[#050217]/80">
          
            {/* Movies */}
          
        </div>

      </div>
    </div>
  )
}

export default App