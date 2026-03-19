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

  async function fetchMovieDetails(imdbID: string) {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${import.meta.env.VITE_API_KEY}`);
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    fetchMovies(searchTerm);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMovies([]);
    fetchMovies(searchTerm);
  }


async function handleFindAndSend() {
  console.log("PAGE ORIGIN:", window.location.origin);
  try {
    console.log("BUTTON CLICKED");
    console.log("SELECTED MOVIES:", selectedMovies);

    if (selectedMovies.length === 0) {
      console.log("No selected movies");
      return;
    }

    const details = await Promise.all(
      selectedMovies.map((m) => fetchMovieDetails(m.imdbID))
    );

    console.log("DETAILS:", details);

    const res = await fetch("http://127.0.0.1:5000/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
      selectedMovies: details,
    }),
  });

    console.log("FETCH STATUS:", res.status);

    const data = await res.json();
    console.log("BACKEND RESPONSE:", data);
  } catch (error) {
    console.error("ERROR IN handleFindAndSend:", error);
  }
}
  
async function testBackend() {
  try {
    const res = await fetch("http://127.0.0.1:5000/test");
    const data = await res.json();
    console.log("TEST BACKEND:", data);
  } catch (error) {
    console.error("TEST ERROR:", error);
  }
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
        <div>
          <button
            onClick={() =>
              setSelectedMovies((prev) =>
              prev.filter((m) => m.imdbID !== movie.imdbID)
              )
            }
          >
            Remove
          </button>
        </div>
        </div>
    ))}
    <button 
      onClick={handleFindAndSend}>
      Find Details For All Selected
    </button>
    <button onClick={testBackend}>Test Backend</button>
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
