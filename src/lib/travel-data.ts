import bali from "@/assets/dest-bali.jpg";
import maldives from "@/assets/dest-maldives.jpg";
import goa from "@/assets/dest-goa.jpg";
import thailand from "@/assets/dest-thailand.jpg";
import korea from "@/assets/dest-korea.jpg";

export type Destination = {
  id: string;
  name: string;
  country: string;
  image: string;
  tagline: string;
  blurb: string;
  rating: number;
  days: string;
  bestSeason: string;
  weather: string;
  safety: string;
  budgetPerDay: number; // USD per traveler per day (guide + experiences only)
  guides: string[];
  experiences: string[];
};

export const destinations: Destination[] = [
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    image: bali,
    tagline: "Island of the Gods",
    blurb: "Sacred temples, emerald rice terraces, and surf-soaked sunsets.",
    rating: 4.9,
    days: "6N / 7D",
    bestSeason: "Apr – Oct",
    weather: "26–31°C, tropical",
    safety: "Very Safe · 4.8/5",
    budgetPerDay: 65,
    guides: ["Local sightseeing guide", "Cultural temple guide", "Surf instructor", "Food tour guide", "Language assistance"],
    experiences: ["Ubud rice terrace walk", "Uluwatu sunset & Kecak dance", "Nusa Penida island hop", "Mount Batur sunrise trek"],
  },
  {
    id: "maldives",
    name: "Maldives",
    country: "Maldives",
    image: maldives,
    tagline: "Where the ocean writes poetry",
    blurb: "Glass-clear lagoons, coral reefs, and bioluminescent shores.",
    rating: 4.9,
    days: "5N / 6D",
    bestSeason: "Nov – Apr",
    weather: "27–30°C, sunny",
    safety: "Very Safe · 4.9/5",
    budgetPerDay: 80,
    guides: ["Snorkel & dive guide", "Island-hop local guide", "Marine biologist tour", "Cultural Malé guide", "Language assistance"],
    experiences: ["Manta ray snorkel", "Sandbank picnic", "Bioluminescent beach night", "Local island culture walk"],
  },
  {
    id: "goa",
    name: "Goa",
    country: "India",
    image: goa,
    tagline: "Sun, sand & susegad",
    blurb: "Portuguese soul, palm-fringed beaches, and electric night markets.",
    rating: 4.7,
    days: "4N / 5D",
    bestSeason: "Nov – Feb",
    weather: "24–32°C, breezy",
    safety: "Safe · 4.5/5",
    budgetPerDay: 35,
    guides: ["Local beach guide", "Heritage walking guide", "Food & feni tour", "Adventure water-sports guide", "Language assistance"],
    experiences: ["Old Goa heritage walk", "Dudhsagar waterfall trek", "Anjuna flea market", "Sunset dolphin cruise"],
  },
  {
    id: "thailand",
    name: "Thailand",
    country: "Thailand",
    image: thailand,
    tagline: "Land of smiles",
    blurb: "Limestone cliffs, floating markets, and temples that glow at dusk.",
    rating: 4.8,
    days: "6N / 7D",
    bestSeason: "Nov – Mar",
    weather: "25–33°C, tropical",
    safety: "Safe · 4.6/5",
    budgetPerDay: 55,
    guides: ["Phi Phi island guide", "Bangkok cultural guide", "Muay Thai experience guide", "Street food tour guide", "Language assistance"],
    experiences: ["Phi Phi island longtail tour", "Grand Palace & Wat Pho", "Chiang Mai elephant sanctuary", "Floating market crawl"],
  },
  {
    id: "korea",
    name: "South Korea",
    country: "South Korea",
    image: korea,
    tagline: "Tradition meets neon",
    blurb: "Hanok villages, cherry blossoms, and Seoul's electric nights.",
    rating: 4.8,
    days: "6N / 7D",
    bestSeason: "Mar – May, Sep – Nov",
    weather: "10–24°C, mild",
    safety: "Very Safe · 4.9/5",
    budgetPerDay: 75,
    guides: ["Seoul cultural guide", "K-drama locations guide", "Hanok village guide", "Korean BBQ food guide", "Language assistance"],
    experiences: ["Gyeongbokgung palace tour", "Bukchon Hanok walk", "Cherry blossom picnic", "Myeongdong night market"],
  },
];
