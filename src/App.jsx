import  { useState, useEffect } from 'react';

export default function App() {
  const [sprites, setSprites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 sm:text-5xl uppercase">
            Ditto Sprite Gallery
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-slate-400 sm:text-lg md:mt-5 md:max-w-3xl">
            8 distinct styles extracted from a single <span className="text-purple-400 font-semibold">PokeAPI</span> payload.
          </p>
        </div>

        {/* 8-Image Responsive Grid System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sprites.map((sprite) => (
            <div 
              key={sprite.id} 
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
