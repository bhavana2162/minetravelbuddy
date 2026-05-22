import santorini from "@/assets/dest-santorini.jpg";
import kyoto from "@/assets/dest-kyoto.jpg";
import bali from "@/assets/dest-bali.jpg";
import swiss from "@/assets/dest-swiss.jpg";
import dubai from "@/assets/dest-dubai.jpg";
import maldives from "@/assets/dest-maldives.jpg";
import paris from "@/assets/dest-paris.jpg";

export const styles = [
  { name: "Solo Escape", icon: "🧭", desc: "Find yourself on the road" },
  { name: "Guided Trips", icon: "🗺️", desc: "Local experts by your side" },
  { name: "Group of 10", icon: "👥", desc: "Curated small-group travel" },
  { name: "Girls Only", icon: "💃", desc: "Safe, sisterhood, unforgettable" },
  { name: "Boys Only", icon: "🤝", desc: "Backpacks & big adventures" },
  { name: "Couple", icon: "💞", desc: "Romance written in passports" },
  { name: "Family", icon: "🏡", desc: "Memories for every generation" },
  { name: "Luxury", icon: "✨", desc: "Five-star, every moment" },
  { name: "Backpacking", icon: "🎒", desc: "Budget, but never basic" },
  { name: "Adventure", icon: "🏔️", desc: "Adrenaline-grade itineraries" },
  { name: "Beach", icon: "🌊", desc: "Toes in the sand vibes" },
  { name: "Honeymoon", icon: "💍", desc: "Begin the forever trip" },
  { name: "Road Trips", icon: "🚗", desc: "Highway is the destination" },
  { name: "Spiritual", icon: "🕉️", desc: "Sacred routes, inner journeys" },
  { name: "Wildlife", icon: "🐯", desc: "Eye-to-eye with the wild" },
  { name: "Festivals", icon: "🎆", desc: "Travel for the celebration" },
];

export const destinations = [
  { id: "maldives", name: "Maldives", country: "Maldives", image: maldives, tag: "Overwater Villa", price: "$1,499", currency: "USD", days: "5N / 6D", rating: 4.9 },
  { id: "santorini", name: "Santorini", country: "Greece", image: santorini, tag: "Couple Escape", price: "€1,199", currency: "EUR", days: "4N / 5D", rating: 4.8 },
  { id: "bali", name: "Ubud, Bali", country: "Indonesia", image: bali, tag: "Spiritual Retreat", price: "Rp 9.5M", currency: "IDR", days: "6N / 7D", rating: 4.9 },
  { id: "kyoto", name: "Kyoto", country: "Japan", image: kyoto, tag: "Sakura Season", price: "¥189,000", currency: "JPY", days: "5N / 6D", rating: 4.9 },
  { id: "swiss", name: "Interlaken", country: "Switzerland", image: swiss, tag: "Alpine Luxury", price: "CHF 2,250", currency: "CHF", days: "7N / 8D", rating: 4.9 },
  { id: "dubai", name: "Dubai", country: "UAE", image: dubai, tag: "City of Gold", price: "AED 3,499", currency: "AED", days: "4N / 5D", rating: 4.7 },
  { id: "paris", name: "Paris", country: "France", image: paris, tag: "Romance Capital", price: "€999", currency: "EUR", days: "4N / 5D", rating: 4.8 },
];

export const countries = [
  { code: "IN", name: "India", flag: "🇮🇳", cities: ["Goa", "Kerala", "Kashmir", "Manali", "Jaipur", "Ladakh", "Andaman"] },
  { code: "TH", name: "Thailand", flag: "🇹🇭", cities: ["Bangkok", "Phuket", "Krabi", "Chiang Mai", "Pattaya"] },
  { code: "JP", name: "Japan", flag: "🇯🇵", cities: ["Tokyo", "Osaka", "Kyoto", "Mt. Fuji"] },
  { code: "KR", name: "South Korea", flag: "🇰🇷", cities: ["Seoul", "Busan", "Jeju"] },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", cities: ["Zurich", "Interlaken", "Lucerne"] },
  { code: "FR", name: "France", flag: "🇫🇷", cities: ["Paris", "Nice", "Lyon"] },
  { code: "ID", name: "Bali", flag: "🇮🇩", cities: ["Ubud", "Kuta", "Seminyak", "Nusa Penida"] },
  { code: "AE", name: "Dubai", flag: "🇦🇪", cities: ["Downtown", "Marina", "Palm Jumeirah"] },
  { code: "MV", name: "Maldives", flag: "🇲🇻", cities: ["Malé", "Maafushi", "Baa Atoll"] },
  { code: "IT", name: "Italy", flag: "🇮🇹", cities: ["Rome", "Venice", "Florence", "Amalfi"] },
  { code: "TR", name: "Turkey", flag: "🇹🇷", cities: ["Istanbul", "Cappadocia", "Antalya"] },
  { code: "SG", name: "Singapore", flag: "🇸🇬", cities: ["Marina Bay", "Sentosa"] },
];

export const events = [
  { month: "Jan", country: "India 🇮🇳", name: "Sankranti", desc: "Kite festival across skies", weather: "Cool", price: "₹12,999" },
  { month: "Mar", country: "India 🇮🇳", name: "Holi", desc: "Festival of colors", weather: "Warm", price: "₹15,499" },
  { month: "Mar", country: "Japan 🇯🇵", name: "Cherry Blossom", desc: "Sakura blooms nationwide", weather: "Mild", price: "¥210,000" },
  { month: "Apr", country: "Thailand 🇹🇭", name: "Songkran", desc: "Water festival, new year", weather: "Hot", price: "฿28,000" },
  { month: "Jul", country: "France 🇫🇷", name: "Bastille Day", desc: "Fireworks over the Seine", weather: "Sunny", price: "€1,099" },
  { month: "Jul", country: "Japan 🇯🇵", name: "Gion Matsuri", desc: "Kyoto's grand parade", weather: "Hot", price: "¥195,000" },
  { month: "Oct", country: "India 🇮🇳", name: "Dussehra", desc: "Mysore royal procession", weather: "Pleasant", price: "₹14,999" },
  { month: "Nov", country: "India 🇮🇳", name: "Diwali", desc: "Festival of lights", weather: "Cool", price: "₹17,999" },
  { month: "Dec", country: "Switzerland 🇨🇭", name: "Christmas Markets", desc: "Alpine winter magic", weather: "Snow", price: "CHF 2,400" },
];
