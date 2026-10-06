type Artist = {
  name: string;
  shortName: string;
  tagline: string;
  instagram: string;
  spotify: string;
  youtube: string;
  tiktok: string;
  bookingWhatsapp: string;
  bookingEmail: string;
};

export const artist: Artist = {
  name: "MC JVILA",
  shortName: "JVILA",
  tagline: "É O J DE NOVO.",
  instagram: "https://www.instagram.com/mc.jvila/",
  spotify: "https://open.spotify.com/artist/2f8xoxornfSw6ePzgyM9NO",
  youtube: "",
  tiktok: "",
  bookingWhatsapp: "",
  bookingEmail: "",
};

export const navigation = [
  { number: "01", label: "HOME", href: "#home" },
  { number: "02", label: "MÚSICA", href: "#musica" },
  { number: "03", label: "SHOWS", href: "#shows" },
  { number: "04", label: "GALERIA", href: "#galeria" },
  { number: "05", label: "CONTATO", href: "#booking" },
] as const;
