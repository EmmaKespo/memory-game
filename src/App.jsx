import  { useState, useEffect } from 'react';

export default function App() {
  const [sprites, setSprites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //game logic
  const [clickedIds, setClickedIds] = useState(new Set());
  const [score, setScore] = useState(0);
  // 1. Initialize bestScore from localStorage (defaults to 0 if none exists)
  const [bestScore, setBestScore] = useState(() => {
    const savedBest = localStorage.getItem('ditto_best_score');
    return savedBest ? parseInt(savedBest, 10) : 0;
});



  //alternative for clickedIds: const [clickedIds, setClickedIds] = useState([]);

  // alternative for Click handler that checks for unique selections, modifies score, and reshuffles
 /* const handleCardClick = (id) => {
    if (clickedIds.includes(id)) {
      // Game Over: Reset score and clicked tracking history
      setScore(0);
      setClickedIds([]);
    } else {
      // Correct Move: Increment score and record the ID
      const newScore = score + 1;
      setScore(newScore);
      setClickedIds([...clickedIds, id]);

      // High Score Validation: Check and record if current score beats the best score
      if (newScore > bestScore) {
        setBestScore(newScore);
      }
        
    }
       // Instantly reshuffle the entire grid deck on every click turn
    setSprites((prevSprites) => shuffleArray(prevSprites));
  };
  // Super simple shuffle approach
const handleCardClick = (id) => {
  // 1. Run your scoring logic here...
  if (clickedIds.includes(id)) {
    setScore(0);
    setClickedIds([]);
  } else {
    const newScore = score + 1;
    setScore(newScore);
    setClickedIds([...clickedIds, id]);
    if (newScore > bestScore) setBestScore(newScore);
  }

  // 2. Simple one-line shuffle and state update
  setSprites((prevSprites) => [...prevSprites].sort(() => Math.random() - 0.5));
};

  */
  // Fisher-Yates shuffle algorithm to randomly rearrange the array elements
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };



  useEffect(() => {
    // Fetching the free PokeAPI endpoint for Ditto
    fetch('https://pokeapi.co/api/v2/pokemon/ditto')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch Pokemon data');
        return res.json();
      })
      .then((data) => {
        // Extracting 8 different sprite options from the nested payload
        const extractedSprites = [
          { id: 1, label: 'Default Front', url: data.sprites.front_default },
          { id: 2, label: 'Default Back', url: data.sprites.back_default },
          { id: 3, label: 'Shiny Front', url: data.sprites.front_shiny },
          { id: 4, label: 'Shiny Back', url: data.sprites.back_shiny },
          { id: 5, label: 'Official Artwork', url: data.sprites.other['official-artwork'].front_default },
          { id: 6, label: 'Shiny Artwork', url: data.sprites.other['official-artwork'].front_shiny },
          { id: 7, label: 'Gen V (Animated)', url: data.sprites.versions['generation-v']['black-white'].animated.front_default },
          { id: 8, label: 'Gen V Shiny (Animated)', url: data.sprites.versions['generation-v']['black-white'].animated.front_shiny },
        ];
        
        // Filter out any variants that might be missing or null
        setSprites(extractedSprites.filter(sprite => sprite.url));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-red-400 font-medium">
        Error: {error}
      </div>
    );
  }
// clicked id

 const handleCardClick = (id) => {
    if (clickedIds.has(id)) {
      setScore(0);
      setClickedIds(new Set());
    } else {
      const newScore = score + 1;
      setScore(newScore);
      setClickedIds(new Set(clickedIds).add(id));
      
      if (newScore > bestScore) {
        setBestScore(newScore);
         localStorage.setItem('ditto_best_score', newScore.toString());
      }
       // AUTOMATIC RESTART LOGIC: Check if the user reached the max score of 8
      if (newScore === 8) {
      // Use setTimeout so the UI finishes updating the 8/8 score before resetting
      setTimeout(() => {
        alert(" Congratulations! You found all 8 unique variants and won the game!");
        setScore(0);
        setClickedIds([]);
      }, 100);
    
  }
    }
    // Instantly reshuffle the entire grid deck on every click turn
    setSprites((prevSprites) => shuffleArray(prevSprites));
  };


  const handleResetGame = () => {
  setScore(0);
  setBestScore(0);
  setClickedIds([]);
  localStorage.removeItem('ditto_best_score');
  // Reshuffle the grid immediately upon resetting
  setSprites((prevSprites) => [...prevSprites].sort(() => Math.random() - 0.5));
};



  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">

    
        {/* Header Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 sm:text-5xl uppercase">
             Memory Game
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-slate-400 sm:text-lg md:mt-5 md:max-w-3xl">
            Get points by clicking images, but <span className="text-pink-400 font-semibold underline decoration-wavy">don't click the same image twice</span>! Max score is 8.
          </p>
        </div>


      <div className="md:w-1/3 flex flex-col justify-between items-center md:items-start bg-slate-900 p-6 rounded-xl border border-slate-700">
          <div className="space-y-6 w-full">
            <div className="bg-slate-800 p-4 rounded-xl shadow-inner border border-slate-600">
              <span className="block text-sm text-slate-400 uppercase font-semibold">Best Score</span>
              <span className="block text-4xl font-bold text-yellow-400 mt-1">{bestScore}</span>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-xl shadow-inner border border-slate-600">
              <span className="block text-sm text-slate-400 uppercase font-semibold">Current Score</span>
              <span className="block text-4xl font-bold text-blue-400 mt-1">{score}</span>
            </div>
          </div>
          {/* Reset Button  */}
      <button
        onClick={handleResetGame}
        className="w-full bg-red-950/40 hover:bg-red-900/60 active:bg-red-900 text-red-400 hover:text-red-300 border border-red-900/50 rounded-xl py-2 px-3 text-xs font-semibold tracking-wider uppercase font-sans transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Reset Game
      </button>

        </div>
          
        


        {/* 8-Image Responsive Grid System */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sprites.map((sprite) => (
            <button 
              key={sprite.id} 
              onClick={() => handleCardClick(sprite.id)}
              className="group relative bg-slate-800 rounded-2xl border border-slate-700/50 p-6 flex flex-col items-center justify-between transition-all duration-300 hover:scale-105 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
            >
              {/* Image Container with Subtle Background Glow */}
              <div className="relative w-32 h-32 flex items-center justify-center bg-slate-900/50 rounded-xl p-2 mb-4 overflow-hidden border border-slate-700/30 group-hover:bg-slate-900 transition-colors duration-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img 
                  src={sprite.url} 
                  alt={sprite.label} 
                  className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                  loading="lazy"
                />
                
              </div>
          

              {/* Text Label Badge */}
              <div className="w-full text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/40 text-purple-300 border border-purple-800/60 tracking-wide">
                  {sprite.label}
                </span>
              </div>
              
            </button>

          ))}
        </div>
        {/* Styled Footer Block at the bottom */}
    <footer className="mt-16 border-t border-slate-800/60 pt-6 pb-2 text-center">
      <p className="text-xs tracking-widest text-slate-500 font-medium font-sans uppercase">
        &copy; 2026 By <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-bold">Emma Kespo</span>
      </p>
    </footer>
      </div>
    
  );
}
