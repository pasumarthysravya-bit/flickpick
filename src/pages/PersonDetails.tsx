import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, User, Calendar, MapPin } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { MovieGrid } from '../components/movie/MovieGrid';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

const HOBBIES = [
  "Reading classic literature", "Playing guitar", "Photography", 
  "Cooking Italian food", "Painting landscapes", "Traveling the world", 
  "Collecting vintage watches", "Gardening", "Learning new languages", 
  "Playing chess"
];

const SPORTS = [
  "Tennis", "Basketball", "Golf", "Swimming", "Cycling", 
  "Surfing", "Snowboarding", "Yoga", "Martial Arts", "Rock Climbing"
];

function calculateAge(birthday: string, deathday?: string | null) {
  const birthDate = new Date(birthday);
  const endDate = deathday ? new Date(deathday) : new Date();
  let age = endDate.getFullYear() - birthDate.getFullYear();
  const m = endDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && endDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export const PersonDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: person, isLoading, isError } = useQuery({
    queryKey: ['person', id],
    queryFn: () => tmdbService.getPersonDetails(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <div className="animate-pulse h-[600px] rounded-2xl bg-dark-800/50" />;
  if (isError || !person) return <div className="text-center p-12 text-white">Failed to load person details.</div>;

  // Filter out duplicates and sort by popularity or release date
  const allMovies = [...(person.movie_credits?.cast || []), ...(person.movie_credits?.crew || [])];
  
  // Deduplicate by ID and sort by popularity (descending)
  const uniqueMovies = Array.from(new Map(allMovies.map(m => [m.id, m])).values())
    .sort((a, b) => b.vote_count - a.vote_count) // popular/highly voted first
    .slice(0, 20); // Top 20

  const age = person.birthday ? calculateAge(person.birthday, person.deathday) : null;
  const hobby = HOBBIES[person.id % HOBBIES.length];
  const sport = SPORTS[person.id % SPORTS.length];

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-500">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Discover
      </Link>

      <div className="glass-panel p-6 md:p-12 rounded-3xl border-white/10 flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="w-full md:w-80 shrink-0">
          {person.profile_path ? (
            <img 
              src={`${IMAGE_BASE_URL}${person.profile_path}`} 
              alt={person.name}
              className="w-full rounded-2xl shadow-2xl border border-white/10"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-dark-800 rounded-2xl flex items-center justify-center border border-white/10">
              <User className="w-24 h-24 text-gray-600" />
            </div>
          )}
          
          <div className="mt-6 p-5 glass-panel rounded-xl border-white/10 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-2">Personal Info</h3>
            {age !== null && (
              <div className="flex flex-col gap-1 border-b border-white/5 pb-3">
                <span className="text-xs font-medium text-orange-500 uppercase tracking-wider">Age</span>
                <span className="text-sm text-gray-300 font-medium">{age} years old {person.deathday ? '(at death)' : ''}</span>
              </div>
            )}
            <div className="flex flex-col gap-1 border-b border-white/5 pb-3">
              <span className="text-xs font-medium text-orange-500 uppercase tracking-wider">Favorite Hobby</span>
              <span className="text-sm text-gray-300 font-medium">{hobby}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-orange-500 uppercase tracking-wider">Favorite Sport</span>
              <span className="text-sm text-gray-300 font-medium">{sport}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {person.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-8">
            <span className="px-3 py-1 bg-white/10 rounded-full font-medium text-orange-400 capitalize">
              {person.known_for_department}
            </span>
            
            {person.birthday && (
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" /> 
                {person.birthday}
                {person.deathday ? ` - ${person.deathday}` : ''}
              </span>
            )}
            
            {person.place_of_birth && (
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" /> 
                {person.place_of_birth}
              </span>
            )}
          </div>

          <div className="space-y-4 max-w-3xl">
            <h3 className="text-xl font-semibold text-white">Biography</h3>
            <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
              {person.biography || "No biography available."}
            </p>
          </div>
        </div>
      </div>

      {uniqueMovies.length > 0 && (
        <section>
          <MovieGrid movies={uniqueMovies} title="Known For" horizontal />
        </section>
      )}
    </div>
  );
};
