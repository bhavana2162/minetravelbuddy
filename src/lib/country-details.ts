export type CountryDetail = {
  code: string;
  name: string;
  flag: string;
  tagline: string;
  currency: string;
  bestSeason: string;
  weather: string;
  safety: number; // /5
  budget: string;
  cities: string[];
  attractions: string[];
  food: string[];
  experiences: string[];
  nightlife: string;
  image: string;
};

import bali from "@/assets/dest-bali.jpg";
import dubai from "@/assets/dest-dubai.jpg";
import kyoto from "@/assets/dest-kyoto.jpg";
import maldives from "@/assets/dest-maldives.jpg";
import paris from "@/assets/dest-paris.jpg";
import santorini from "@/assets/dest-santorini.jpg";
import swiss from "@/assets/dest-swiss.jpg";

export const countryDetails: CountryDetail[] = [
  {
    code: "IN", name: "India", flag: "🇮🇳",
    tagline: "Land of a thousand vibes",
    currency: "₹ INR", bestSeason: "Oct – Mar", weather: "18–28°C", safety: 4,
    budget: "₹12,000 – ₹40,000",
    cities: ["Goa", "Kerala", "Kashmir", "Manali", "Jaipur", "Ladakh", "Andaman", "Varanasi", "Rishikesh"],
    attractions: ["Taj Mahal", "Backwaters", "Pangong Lake", "Amber Fort"],
    food: ["Butter Chicken", "Dosa", "Biryani", "Chaat"],
    experiences: ["Houseboat stays", "Desert safari", "Yoga retreats", "Beach raves"],
    nightlife: "Vibrant in Goa, Mumbai & Bengaluru",
    image: bali,
  },
  {
    code: "TH", name: "Thailand", flag: "🇹🇭",
    tagline: "Islands, temples & late nights",
    currency: "฿ THB", bestSeason: "Nov – Feb", weather: "25–32°C", safety: 4,
    budget: "฿18,000 – ฿55,000",
    cities: ["Bangkok", "Phuket", "Krabi", "Chiang Mai", "Pattaya"],
    attractions: ["Grand Palace", "Phi Phi Islands", "Doi Suthep"],
    food: ["Pad Thai", "Tom Yum", "Mango Sticky Rice"],
    experiences: ["Island hopping", "Floating markets", "Cruise dinner"],
    nightlife: "Legendary in Bangkok & Phuket",
    image: maldives,
  },
  {
    code: "JP", name: "Japan", flag: "🇯🇵",
    tagline: "Where neon meets nature",
    currency: "¥ JPY", bestSeason: "Mar – May", weather: "10–22°C", safety: 5,
    budget: "¥150,000 – ¥400,000",
    cities: ["Tokyo", "Osaka", "Kyoto", "Mt. Fuji"],
    attractions: ["Shibuya Crossing", "Fushimi Inari", "Mt. Fuji"],
    food: ["Sushi", "Ramen", "Takoyaki", "Wagyu"],
    experiences: ["Bullet train", "Ryokan stay", "Anime city tours"],
    nightlife: "Shinjuku & Dotonbori until dawn",
    image: kyoto,
  },
  {
    code: "KR", name: "South Korea", flag: "🇰🇷",
    tagline: "K-pop, K-drama, K-magic",
    currency: "₩ KRW", bestSeason: "Apr & Oct", weather: "12–24°C", safety: 5,
    budget: "₩1.2M – ₩3.5M",
    cities: ["Seoul", "Busan", "Jeju Island"],
    attractions: ["Gyeongbokgung", "Haeundae Beach", "Jeju waterfalls"],
    food: ["Bibimbap", "Korean BBQ", "Tteokbokki"],
    experiences: ["K-pop tours", "Cherry blossoms", "Street food markets"],
    nightlife: "Hongdae & Itaewon",
    image: santorini,
  },
  {
    code: "CH", name: "Switzerland", flag: "🇨🇭",
    tagline: "Alpine luxury, postcard views",
    currency: "CHF", bestSeason: "Jun – Sep / Dec", weather: "-2–22°C", safety: 5,
    budget: "CHF 1,800 – CHF 4,500",
    cities: ["Zurich", "Interlaken", "Lucerne"],
    attractions: ["Jungfrau", "Lake Geneva", "Matterhorn"],
    food: ["Fondue", "Raclette", "Rösti"],
    experiences: ["Scenic train", "Skiing", "Christmas markets"],
    nightlife: "Chic lounges in Zurich",
    image: swiss,
  },
  {
    code: "FR", name: "France", flag: "🇫🇷",
    tagline: "Romance in every cobblestone",
    currency: "€ EUR", bestSeason: "Apr – Jun / Sep", weather: "10–25°C", safety: 4,
    budget: "€1,000 – €3,200",
    cities: ["Paris", "Nice", "Lyon"],
    attractions: ["Eiffel Tower", "Louvre", "French Riviera"],
    food: ["Croissants", "Macarons", "Coq au Vin"],
    experiences: ["Seine cruise", "Wine country", "Bastille Day fireworks"],
    nightlife: "Marais & Pigalle",
    image: paris,
  },
  {
    code: "AE", name: "Dubai", flag: "🇦🇪",
    tagline: "Skyline of the future",
    currency: "AED", bestSeason: "Nov – Mar", weather: "18–30°C", safety: 5,
    budget: "AED 3,500 – AED 12,000",
    cities: ["Downtown", "Marina", "Palm Jumeirah"],
    attractions: ["Burj Khalifa", "Desert dunes", "Atlantis"],
    food: ["Shawarma", "Mandi", "Knafeh"],
    experiences: ["Desert safari", "Skydiving", "Yacht parties"],
    nightlife: "Rooftop scene at Marina & JBR",
    image: dubai,
  },
  {
    code: "MV", name: "Maldives", flag: "🇲🇻",
    tagline: "Toes in the water, head in clouds",
    currency: "$ USD", bestSeason: "Nov – Apr", weather: "26–30°C", safety: 5,
    budget: "$1,500 – $6,000",
    cities: ["Malé", "Maafushi", "Baa Atoll"],
    attractions: ["Overwater villas", "Manta rays", "Coral reefs"],
    food: ["Mas Huni", "Garudhiya"],
    experiences: ["Snorkeling", "Sunset cruise", "Private island"],
    nightlife: "Resort lounges & beach bonfires",
    image: maldives,
  },
];
