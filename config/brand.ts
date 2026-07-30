import type { BrandConfig } from "@/types/brand";

/**
 * SINGLE SOURCE OF TRUTH.
 *
 * To rebrand this website for a different jewellery business, edit ONLY this
 * file and the Cloudinary asset URLs. No component code should change.
 */
export const BRAND: BrandConfig = {
  businessName: "Gen Alpha",
  tagline: "Trendy Imitation Jewellery in Chalakudy",
  description:
    "Gen Alpha is Chalakudy's favourite destination for trendy imitation and fashion jewellery.",

  logo: "/logo.png",
  favicon: "/favicon.ico",

  heroVideo:
    "https://res.cloudinary.com/cfg3wh0j/video/upload/v1784880148/genalpha_hero.mp4",

  storyVideos: [],

  storeImages: [
    "/images/store1.webp",
    "https://res.cloudinary.com/cfg3wh0j/image/upload/v1784880150/genalpha_store_a.webp",
    "https://res.cloudinary.com/cfg3wh0j/image/upload/v1784880152/genalpha_store_b.webp",
    "https://res.cloudinary.com/cfg3wh0j/image/upload/v1784880153/genalpha_store_c.webp",
  ],

  address: "D5, PNP Square, 14/620, opp. Punjab National Bank, North Chalakudy, Chalakudy, Kerala 680307",
  city: "Chalakudy",
  state: "Kerala",
  pincode: "680307",

  phone: "+918137040954",
  whatsapp: "918137040954",
  email: "",

  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=GEN%20ALPHA&query_place_id=ChIJBbmOI_EDCDsRVbljGbBsaqA",

  openingHours: "Mon–Sat: 9:30 AM – 8:00 PM · Sunday: 10:00 AM – 7:00 PM",

  instagram: "",
  facebook: "",

  seo: {
    title: "Gen Alpha | Jewellery in Chalakudy",
    description:
      "Gen Alpha — your premier jewellery store in Chalakudy. Gold, diamond and silver jewellery crafted for every occasion. Visit us in Chalakudy, Kerala.",
    keywords: [
      "Gen Alpha",
      "jewellery Chalakudy",
      "gold jewellery Chalakudy",
      "diamond jewellery Chalakudy",
      "silver jewellery Chalakudy",
      "jewellery store Chalakudy",
      "gold shop Chalakudy",
      "jewellery Kerala",
    ],
    canonical: "https://gen-alpha-north-chalakudy.vercel.app",
    ogImage:
      "/images/store1.webp",
  },

  faq: [],

  whatsappMessage:
    "Hello Gen Alpha, I'd like to know more about your jewellery collections.",
};
