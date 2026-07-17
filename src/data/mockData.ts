import type { Genre, MovieDetails } from '../types';

export const mockGenres: Genre[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

export const mockMovies: MovieDetails[] = [
  {
    id: 1,
    title: "Dragon",
    overview: "A young man embraces his flaws and learns to navigate life, love, and friendship in this hilarious and heartwarming coming-of-age comedy.",
    poster_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&h=1080&fit=crop",
    release_date: "2025-02-21",
    vote_average: 8.2,
    vote_count: 12500,
    genre_ids: [35, 18],
    original_language: "ta",
    runtime: 140,
    genres: [{ id: 35, name: "Comedy" }, { id: 18, name: "Drama" }],
    production_companies: [{ id: 1, name: "AGS Entertainment", logo_path: null }],
    production_countries: [{ iso_3166_1: "IN", name: "India" }],
    spoken_languages: [{ iso_639_1: "ta", name: "Tamil" }],
    status: "Released",
    tagline: "Embrace the chaos.",
    budget: 5000000,
    revenue: 20000000,
    credits: {
      cast: [
        { id: 101, name: "Pradeep Ranganathan", character: "Hero", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=300&fit=crop", order: 0 },
        { id: 102, name: "Anupama Parameswaran", character: "Heroine", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=300&fit=crop", order: 1 }
      ],
      crew: [{ id: 201, name: "Ashwath Marimuthu", job: "Director", department: "Directing", profile_path: null }]
    },
    videos: {
      results: [{ id: "v1", key: "dQw4w9WgXcQ", name: "Official Trailer", site: "YouTube", type: "Trailer" }] // Rickroll placeholder
    },
    similar: { results: [] }
  },
  {
    id: 2,
    title: "Mission: Impossible - The Final Reckoning",
    overview: "Ethan Hunt and his IMF team embark on their most dangerous mission yet, to track down a terrifying new weapon that threatens all of humanity before it falls into the wrong hands.",
    poster_path: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=1920&h=1080&fit=crop",
    release_date: "2025-05-23",
    vote_average: 8.8,
    vote_count: 5400,
    genre_ids: [28, 12, 53],
    original_language: "en",
    runtime: 165,
    genres: [{ id: 28, name: "Action" }, { id: 12, name: "Adventure" }, { id: 53, name: "Thriller" }],
    production_companies: [{ id: 4, name: "Paramount Pictures", logo_path: null }],
    production_countries: [{ iso_3166_1: "US", name: "United States of America" }],
    spoken_languages: [{ iso_639_1: "en", name: "English" }],
    status: "Released",
    tagline: "Our lives are the sum of our choices.",
    budget: 250000000,
    revenue: 800000000,
    credits: {
      cast: [
        { id: 103, name: "Tom Cruise", character: "Ethan Hunt", profile_path: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=300&fit=crop", order: 0 },
        { id: 104, name: "Hayley Atwell", character: "Grace", profile_path: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=300&fit=crop", order: 1 }
      ],
      crew: [{ id: 202, name: "Christopher McQuarrie", job: "Director", department: "Directing", profile_path: null }]
    },
    videos: {
      results: [{ id: "v2", key: "NOhDyUmT9z0", name: "Official Trailer", site: "YouTube", type: "Trailer" }] // Fake key
    },
    similar: { results: [] }
  },
  {
    id: 3,
    title: "Vettaiyan",
    overview: "A righteous police officer fights against a corrupt educational system and powerful criminals to bring justice to the marginalized.",
    poster_path: "https://images.unsplash.com/photo-1533167649158-6d508895b680?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop",
    release_date: "2024-10-10",
    vote_average: 7.9,
    vote_count: 8500,
    genre_ids: [28, 80, 18],
    original_language: "ta",
    runtime: 163,
    genres: [{ id: 28, name: "Action" }, { id: 80, name: "Crime" }],
    production_companies: [{ id: 5, name: "Lyca Productions", logo_path: null }],
    production_countries: [{ iso_3166_1: "IN", name: "India" }],
    spoken_languages: [{ iso_639_1: "ta", name: "Tamil" }],
    status: "Released",
    tagline: "The Hunter Arrives.",
    budget: 15000000,
    revenue: 40000000,
    credits: {
      cast: [
        { id: 105, name: "Rajinikanth", character: "Vettaiyan", profile_path: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=300&fit=crop", order: 0 }
      ],
      crew: [{ id: 203, name: "T.J. Gnanavel", job: "Director", department: "Directing", profile_path: null }]
    },
    videos: {
      results: [{ id: "v3", key: "dQw4w9WgXcQ", name: "Trailer", site: "YouTube", type: "Trailer" }]
    },
    similar: { results: [] }
  },
  {
    id: 4,
    title: "Amaran",
    overview: "The inspiring true story of Major Mukund Varadarajan and his bravery during a counter-terrorism operation.",
    poster_path: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&h=1080&fit=crop",
    release_date: "2024-10-31",
    vote_average: 8.5,
    vote_count: 9200,
    genre_ids: [28, 18, 10752],
    original_language: "ta",
    runtime: 150,
    genres: [{ id: 28, name: "Action" }, { id: 10752, name: "War" }],
    production_companies: [{ id: 6, name: "Raaj Kamal Films", logo_path: null }],
    production_countries: [{ iso_3166_1: "IN", name: "India" }],
    spoken_languages: [{ iso_639_1: "ta", name: "Tamil" }],
    status: "Released",
    tagline: "A hero's journey.",
    budget: 10000000,
    revenue: 35000000,
    credits: {
      cast: [
        { id: 106, name: "Sivakarthikeyan", character: "Mukund", profile_path: "https://images.unsplash.com/photo-1488161628813-04466f872507?w=200&h=300&fit=crop", order: 0 },
        { id: 107, name: "Sai Pallavi", character: "Indhu", profile_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=300&fit=crop", order: 1 }
      ],
      crew: [{ id: 204, name: "Rajkumar Periasamy", job: "Director", department: "Directing", profile_path: null }]
    },
    videos: {
      results: [{ id: "v4", key: "dQw4w9WgXcQ", name: "Trailer", site: "YouTube", type: "Trailer" }]
    },
    similar: { results: [] }
  },
  {
    id: 5,
    title: "Dune: Part Two",
    overview: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    poster_path: "https://images.unsplash.com/photo-1547823065-4cbbb2d4d185?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?w=1920&h=1080&fit=crop",
    release_date: "2024-03-01",
    vote_average: 8.6,
    vote_count: 15000,
    genre_ids: [878, 12],
    original_language: "en",
    runtime: 166,
    genres: [{ id: 878, name: "Sci-Fi" }, { id: 12, name: "Adventure" }],
    production_companies: [{ id: 7, name: "Legendary Pictures", logo_path: null }],
    production_countries: [{ iso_3166_1: "US", name: "United States" }],
    spoken_languages: [{ iso_639_1: "en", name: "English" }],
    status: "Released",
    tagline: "Long live the fighters.",
    budget: 190000000,
    revenue: 711000000,
    credits: {
      cast: [
        { id: 108, name: "Timothée Chalamet", character: "Paul", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=300&fit=crop", order: 0 }
      ],
      crew: [{ id: 205, name: "Denis Villeneuve", job: "Director", department: "Directing", profile_path: null }]
    },
    videos: {
      results: [{ id: "v5", key: "dQw4w9WgXcQ", name: "Trailer", site: "YouTube", type: "Trailer" }]
    },
    similar: { results: [] }
  },
  {
    id: 6,
    title: "Kalki 2898 AD",
    overview: "A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to earth to protect the world from evil forces.",
    poster_path: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=500&h=750&fit=crop",
    backdrop_path: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop",
    release_date: "2024-06-27",
    vote_average: 7.8,
    vote_count: 5000,
    genre_ids: [878, 28, 14],
    original_language: "te",
    runtime: 181,
    genres: [{ id: 878, name: "Sci-Fi" }, { id: 28, name: "Action" }, { id: 14, name: "Fantasy" }],
    production_companies: [{ id: 8, name: "Vyjayanthi Movies", logo_path: null }],
    production_countries: [{ iso_3166_1: "IN", name: "India" }],
    spoken_languages: [{ iso_639_1: "te", name: "Telugu" }],
    status: "Released",
    tagline: "The Future is Here.",
    budget: 70000000,
    revenue: 140000000,
    credits: {
      cast: [
        { id: 109, name: "Prabhas", character: "Bhairava", profile_path: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=300&fit=crop", order: 0 }
      ],
      crew: [{ id: 206, name: "Nag Ashwin", job: "Director", department: "Directing", profile_path: null }]
    },
    videos: {
      results: [{ id: "v6", key: "dQw4w9WgXcQ", name: "Trailer", site: "YouTube", type: "Trailer" }]
    },
    similar: { results: [] }
  }
];

// Helper to strip movie details down to basic Movie for lists
export const getBasicMoviesList = (): any[] => {
  return mockMovies.map(m => ({
    id: m.id,
    title: m.title,
    overview: m.overview,
    poster_path: m.poster_path,
    backdrop_path: m.backdrop_path,
    release_date: m.release_date,
    vote_average: m.vote_average,
    vote_count: m.vote_count,
    genre_ids: m.genre_ids,
    original_language: m.original_language
  }));
};
