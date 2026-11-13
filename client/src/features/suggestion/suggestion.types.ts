export type ParsedRequest = {
  when: string | null;
  budgetEur: number | null;
  adults: number | null;
  childrenAges: number[];
  from: string | null;
  vibe: string[];
};

export type MissingInfoQuestion = {
  question: string;
  options: string[];
};

export type DestinationWeather = {
  tempC: number;
  summary: string;
};

export type DestinationImage = {
  url: string;
  authorName: string;
  authorUrl: string;
};

export type DestinationLinks = {
  hotels: string;
  tickets: string;
};

export type Destination = {
  name: string;
  nameEn: string;
  country: string;
  countryCode: string;
  why: string;
  weather: DestinationWeather;
  flightTimeMin: number;
  nights: number;
  estCostEur: number;
  highlights: string[];
  imageQuery: string;
  airportIata: string | null;
  image: DestinationImage | null;
  links: DestinationLinks;
};

export type Suggestion = {
  parsed: ParsedRequest;
  missingInfo: MissingInfoQuestion[];
  destinations: Destination[];
};
