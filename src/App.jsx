
import './App.css'
import Search from './components/Search';
import { useState } from 'react';
import { useEffect } from 'react';
import Spinner from './components/Loader';
import Loader from './components/Loader';


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }}


function App() {

  const [searchTerm, setSearchTerm] = useState(''); 
  const[error, setError] = useState('');
  const [movies, setMovies] = useState([]); 
  const [loading, setLoading] = useState(false);


  const fetchMovies = async () => {

    setLoading(true);
    setError('');
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      if (data.Response === 'False') {
        setError( data.error ||'failed to fetch movies');
        movies([]);
        return;
      }
      setMovies(data.results|| []);
    }
    catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to fetch movies. Please try again later.');
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {

    fetchMovies();

  },[])


  return (

    <main>
      <div className='pattern' />
        <div className='wrapper'>
          <header>
            <img src='./hero.png' alt='hero.png'  />
            <h1> Find <span className='text-gradient'> Movies</span> You'll Enjoy Without the Hassle </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
          <section className='all-movies'>
            <h2 className='mt-[40px]'>All Movies</h2>
    
          {loading ? (
            <Loader />
          ): error ? (
            <p className='text-red-500'>{error}</p>
          ) : (
            <ul>
             { movies.map((movie) => (

              <p key={movie.id} className='text-white'>{movie.title}</p>
             )) }
            </ul>
          )}

          </section>
      </div>
    </main>
 
  )
}

export default App
