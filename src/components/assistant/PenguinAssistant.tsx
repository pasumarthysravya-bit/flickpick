import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdbService } from '../../services/tmdb';
import { Mic, Loader2, MicOff } from 'lucide-react';

export const PenguinAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setError('');
        setTranscript('Listening...');
        setIsListening(true);
      };

      recognition.onresult = async (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(`Searching for: "${result}"`);
        setIsListening(false);
        await searchMovie(result);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'aborted') return;
        console.error("Speech error", event);
        setError(`Error: ${event.error} 🐧`);
        setIsListening(false);
        setTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  const searchMovie = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const results = await tmdbService.searchMovies(query);
      if (results.results && results.results.length > 0) {
        const movieId = results.results[0].id;
        setIsOpen(false);
        setTranscript('');
        navigate(`/movie/${movieId}`);
      } else {
        setError("I couldn't find any movie with that name! 🐧");
        setTranscript('');
      }
    } catch (err) {
      setError("Oops! Something went wrong searching. 🐧");
      setTranscript('');
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    } else {
      setError("Speech recognition is not supported in this browser. 🐧");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      startListening();
    } else {
      stopListening();
    }
  };

  const handleMicClick = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 bg-gray-900 border border-gray-700 rounded-2xl p-4 shadow-2xl shadow-blue-900/20 w-72 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0 overflow-hidden border border-gray-600">
              <img src="/penguin.png" alt="Pengu" className="w-full h-full object-cover" />
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">
              Hi I am Pengu. What movie would you like for me to search?
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-3">
            <button
              onClick={handleMicClick}
              disabled={isLoading}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : isListening ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>
            
            <p className="text-sm text-gray-400 min-h-5 text-center italic">
              {transcript || (isListening ? '' : 'Tap to speak')}
            </p>
          </div>

          {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
        </div>
      )}
      
      <button
        onClick={handleToggle}
        className="relative group flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-xl shadow-black/40 hover:scale-105 transition-transform overflow-hidden border-4 border-blue-500"
      >
        <img 
          src="/penguin.png" 
          alt="Pengu Assistant" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
        />
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  );
};
