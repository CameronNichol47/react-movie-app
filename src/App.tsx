import {useEffect,useState} from 'react';

type MovieType = {
  Title: string;
  Year: string;
};

function App() {
  const [movies, setMovies] = useState<MovieType[]>([]);

  useEffect(() => {
    async function fetchMovies() {
      const res = await fetch(`https://www.omdbapi.com/?s=batman&apikey=${import.meta.env.VITE_API_KEY}`);
      const data = await  res.json();
      
      if (data.Search) {
        setMovies(data.Search);
      } else {
      console.log("No results:", data);
      }
    }

    fetchMovies();


  }, []);

  const titles = movies.map((movie) => 
    (<Movie 
      key={movie.Title}
      title={movie.Title}
      year={Number(movie.Year)}
    />));
  return (
    <div>
      <h1>My Movie App 🎬</h1>
      {titles}
    </div>
  );
}

function Movie(props: { title: string; year: number}) {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>{props.year}</p>
    </div>
  );
}

export default App;
