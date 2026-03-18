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
  const [selectedMovies, setSelectedMovies] = useState<MovieType[]>([]);

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
    setMovies([]);
    fetchMovies(searchTerm);
  }

  

  const films = movies.map((movie) => 
    (<Movie 
      key={movie.imdbID}
      title={movie.Title}
      year={Number(movie.Year)}
      poster={movie.Poster}
      onSelect={() =>
        setSelectedMovies((prev) => {
          if (prev.length >= 12) return prev;
          if (prev.some((m) => m.imdbID === movie.imdbID)) return prev;
          return [...prev, movie];
        })
      }
    />
  ));

  return (
    <div>
      <h1>My Movie and Show App 🎬</h1>

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

      <h2>My Selections ({selectedMovies.length}/12)</h2>
      {selectedMovies.map((movie) => (
        <div key={movie.imdbID} style={{ marginBottom: "20px" }}>
          <p>{movie.Title} ({movie.Year})</p>
          <img src={movie.Poster} alt={movie.Title} width="100" />
        </div>
      ))}
    </div>
  );
}

function Movie(props: { title: string; year: number; poster: string; onSelect: () => void}) {
  return (
  <div>
    <div>
      <h2>{props.title}</h2>
      <p>{props.year}</p>
      <img src={props.poster}></img>
    </div>
    <div>
      <button onClick={props.onSelect} style={{marginBottom: "30px"}}>Choose</button>

    </div>
  </div>
  );
}

export default App;
