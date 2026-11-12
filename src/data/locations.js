// Location pool. lat/lng are approximate targets; at game start each is snapped to the nearest
// Street View panorama (see lib/streetview.js) and scoring uses the panorama's actual position.
export const LOCATIONS = [
  { id: 'tokyo', place: 'Shibuya, Tokyo', country: 'Japan', lat: 35.659, lng: 139.7, region: 'East Asia', language: 'Japanese (Kanji / Kana)', flag: '🇯🇵' },
  { id: 'rio', place: 'Copacabana, Rio de Janeiro', country: 'Brazil', lat: -22.971, lng: -43.185, region: 'South America', language: 'Portuguese (Latin)', flag: '🇧🇷' },
  { id: 'lisbon', place: 'Lisbon', country: 'Portugal', lat: 38.722, lng: -9.139, region: 'Southern Europe', language: 'Portuguese (Latin)', flag: '🇵🇹' },
  { id: 'vancouver', place: 'Vancouver', country: 'Canada', lat: 49.283, lng: -123.12, region: 'North America', language: 'English / French (Latin)', flag: '🇨🇦' },
  { id: 'wellington', place: 'Wellington', country: 'New Zealand', lat: -41.286, lng: 174.776, region: 'Oceania', language: 'English / Māori (Latin)', flag: '🇳🇿' },
  { id: 'cairo', place: 'Cairo', country: 'Egypt', lat: 30.044, lng: 31.236, region: 'North Africa', language: 'Arabic (Arabic script)', flag: '🇪🇬' },
  { id: 'capetown', place: 'Cape Town', country: 'South Africa', lat: -33.925, lng: 18.424, region: 'Southern Africa', language: 'English / Afrikaans (Latin)', flag: '🇿🇦' },
  { id: 'mumbai', place: 'Mumbai', country: 'India', lat: 19.076, lng: 72.878, region: 'South Asia', language: 'Marathi / Hindi (Devanagari)', flag: '🇮🇳' },
  { id: 'reykjavik', place: 'Reykjavík', country: 'Iceland', lat: 64.147, lng: -21.943, region: 'Northern Europe', language: 'Icelandic (Latin)', flag: '🇮🇸' },
  { id: 'mexico', place: 'Mexico City', country: 'Mexico', lat: 19.433, lng: -99.133, region: 'Central America', language: 'Spanish (Latin)', flag: '🇲🇽' },
  { id: 'bangkok', place: 'Bangkok', country: 'Thailand', lat: 13.756, lng: 100.502, region: 'Southeast Asia', language: 'Thai (Thai script)', flag: '🇹🇭' },
  { id: 'moscow', place: 'Moscow', country: 'Russia', lat: 55.756, lng: 37.617, region: 'Eastern Europe', language: 'Russian (Cyrillic)', flag: '🇷🇺' },
  { id: 'nairobi', place: 'Nairobi', country: 'Kenya', lat: -1.286, lng: 36.817, region: 'East Africa', language: 'Swahili / English (Latin)', flag: '🇰🇪' },
  { id: 'buenosaires', place: 'Buenos Aires', country: 'Argentina', lat: -34.604, lng: -58.382, region: 'South America', language: 'Spanish (Latin)', flag: '🇦🇷' },
  { id: 'sydney', place: 'Sydney', country: 'Australia', lat: -33.869, lng: 151.209, region: 'Oceania', language: 'English (Latin)', flag: '🇦🇺' },
  { id: 'istanbul', place: 'Istanbul', country: 'Türkiye', lat: 41.008, lng: 28.978, region: 'Western Asia', language: 'Turkish (Latin)', flag: '🇹🇷' },
  { id: 'seoul', place: 'Seoul', country: 'South Korea', lat: 37.566, lng: 126.978, region: 'East Asia', language: 'Korean (Hangul)', flag: '🇰🇷' },
  { id: 'lima', place: 'Lima', country: 'Peru', lat: -12.046, lng: -77.043, region: 'South America', language: 'Spanish (Latin)', flag: '🇵🇪' },
];
