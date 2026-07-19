import type { BrandConfig } from "@/types/brand";

/**
 * SINGLE SOURCE OF TRUTH.
 *
 * To rebrand this website for a different jewellery business, edit ONLY this
 * file and the Cloudinary asset URLs. No component code should change.
 */
export const BRAND: BrandConfig = {
  businessName: "GEN ALPHA",
  tagline: "Trusted Jewellery Store in Chalakudy",
  description:
    "GEN ALPHA is Chalakudy's trusted destination for exquisite gold, diamond, and silver jewellery. Serving Chalakudy with timeless craftsmanship and elegant designs for every celebration.",

  logo: "/icons/logo.svg",
  favicon: "/favicon.ico",

  heroVideo:
    "https://res.cloudinary.com/fylz5e3j/video/upload/v1782936959/VN20260702_013328_tbexfn.mp4",

  storyVideos: [
    {
      quote: "ലാളിത്യത്തിലെ പൂർണ്ണത.",
      description:
        "അണിയാൻ തീരെ ഭാരമില്ലാത്ത, എന്നാൽ കണ്ണഞ്ചിപ്പിക്കുന്ന ഡിസൈനുകൾ. നിങ്ങളുടെ ഓരോ സാധാരണ ദിവസത്തെയും മനോഹരമാക്കാൻ ഇവ മതിയാകും.",
      video:
        "https://res.cloudinary.com/fylz5e3j/video/upload/v1782936959/VN20260702_013328_tbexfn.mp4",
      segments: { startAt: 0, loopEnd: 8 },
    },
    {
      quote: "കൈകളിൽ വിരിയുന്ന വിസ്മയം.",
      description:
        "ഓരോ ആഭരണവും ഓരോ കലാരൂപമാണ്. അതിസൂക്ഷ്മമായി, തികഞ്ഞ പൂർണ്ണതയോടെ രൂപപ്പെടുത്തിയെടുത്തവ. നിങ്ങളുടെ സ്വപ്നങ്ങൾക്ക് സ്വർണ്ണത്തിൽ ജീവൻ വയ്ക്കുമ്പോൾ.",
      video:
        "https://res.cloudinary.com/fylz5e3j/video/upload/v1782936959/VN20260702_013328_tbexfn.mp4",
      segments: { startAt: 32, loopEnd: 40 },
    },
    {
      quote: "ചാലക്കുടിയുടെ ഹൃദയത്തിൽ നിന്ന്.",
      description:
        "ഈ നാടിന്റെ പൈതൃകവും പുതുമയും ഒത്തുചേരുന്ന ആഭരണങ്ങൾ. തലമുറകളായി നിങ്ങൾ നൽകുന്ന വിശ്വാസത്തിന് സ്വർണ്ണത്തേക്കാൾ തിളക്കമുണ്ട്.",
      video:
        "https://res.cloudinary.com/fylz5e3j/video/upload/v1782936959/VN20260702_013328_tbexfn.mp4",
      segments: { startAt: 16, loopEnd: 24 },
    },
  ],

  storeImages: [
    "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnFbGM_ajTSTCg610JJkgLVqG0yZZ3RRAQzQ3v_Sr4Rf2KnoQe-V9EVTMazQ2m5YapMRLf-4fyR7SNvg7KCglaFuBexmF55GEhSAo08UkTVmudQsP__i069grEV9SSyQ9-R7HiflWpiQrQ=s1600",
    "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkdZJ3DQBH8kwfML6c53eg9RafAr864VezJJqjhwJiIYGAOIwGnVN2woPJWJIM1bGZPuavnsAL__v_F_rUxXhP561z1oZ2PjjDfVOHw9HCGnP6ao3sCT5enbB1=s1600",
    "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnREl_L4H9ulTGcG74dfoyuCYDM47OoNS7uQ1JTK5rEyxZnt5AxpxN93vdALxFvVkA5wq2TsPDOS4-jDRAax50mWMWBMfsH_jYLMWOUy3MO84tDz3f1xC1IChcORD8KAFkdJqBaL5Sf-xg=s1600",
    "https://res.cloudinary.com/fylz5e3j/image/upload/v1782940196/hayazbb_wb1juf.webp",
  ],

  address: "D5, PNP SQUARE, 14/620, opp. PUNJAB NATIONAL BANK, North Chalakudy, Chalakudy, Kerala 680307",
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
    title: "GEN ALPHA | Jewellery in Chalakudy",
    description:
      "GEN ALPHA is Chalakudy's trusted destination for exquisite gold, diamond, and silver jewellery. Serving Chalakudy with timeless craftsmanship and elegant designs for every celebration.",
    keywords: [
      "GEN ALPHA",
      "jewellery Chalakudy",
      "gold jewellery Chalakudy",
      "diamond jewellery Chalakudy",
      "silver jewellery Chalakudy",
      "jewellery store Kerala",
    ],
    canonical: "https://gen-alpha-north-chalakudy.vercel.app",
    ogImage:
      "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnFbGM_ajTSTCg610JJkgLVqG0yZZ3RRAQzQ3v_Sr4Rf2KnoQe-V9EVTMazQ2m5YapMRLf-4fyR7SNvg7KCglaFuBexmF55GEhSAo08UkTVmudQsP__i069grEV9SSyQ9-R7HiflWpiQrQ=s1600",
  },

  faq: [],

  whatsappMessage:
    "Hello GEN ALPHA, I'd like to know more about your jewellery collections.",
};
