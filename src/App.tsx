import {useEffect,useState} from 'react';

type MovieType = {
  Title: string;
  Year: string;
  Poster: string;
  imdbID: string;
};

function App() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  async function fetchMovies(query: string) {
      const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${import.meta.env.VITE_API_KEY}`);
      const data = await  res.json();
      
      if (data.Search) {
        setMovies(data.Search);
      } else {
        console.log("No results:", data);
      }
    }

  useEffect(() => {
    fetchMovies(searchTerm);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchMovies(searchTerm);
  }

  

  const films = movies.map((movie) => 
    (<Movie 
      key={movie.imdbID}
      title={movie.Title}
      year={Number(movie.Year)}
      poster={movie.Poster}
    />));

  return (
    <div>
      <h1>My Movie App 🎬</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a movie"
        />
        <button type="submit">Search</button>
      </form>
      {films}
    </div>
  );
}

function Movie(props: { title: string; year: number; poster: string}) {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>{props.year}</p>
      <img src={props.poster}></img>
    </div>
  );
}

export default App;
