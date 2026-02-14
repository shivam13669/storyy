import type { LucideIcon } from "lucide-react";
import { Flag, Landmark, Mountain, MountainSnow, Waves } from "lucide-react";

export type DestinationIcon = "mountain" | "landmark" | "waves" | "flag" | "mountainSnow";

export type BikeOption = {
  id: string;
  name: string;
  description: string;
  image: string;
  priceMultiplier?: number; // 1.0 = base price, 1.2 = 20% more
  cc?: string;
  features?: string[];
  seatingPrices?: {
    solo: number;
    "dual-sharing": number;
    "seat-in-backup": number;
  };
  isBackupVehicle?: boolean; // True if this is the "Seat in Backup" car option
  isOwnBike?: boolean; // True if this is the "Own Bike" option
};

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  highlights?: string[];
  location?: string;
  transfer?: {
    type: string;
    vehicle: string;
    from: string;
    to: string;
    stops?: number;
  };
  stay?: {
    name: string;
    stars: number;
    checkIn: string;
    checkOut: string;
    nights: number;
    images: string[];
  };
};

export type DestinationPackage = {
  slug: string;
  name: string;
  duration: string;
  description: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  rating: number;
  reviews: number;
  highlights: string[];
  itineraryUrl?: string;
  image?: string;
  galleryImages?: string[];
  categories?: string[];
  itinerary?: ItineraryDay[];
  inclusions?: string[];
  exclusions?: string[];
  bikes?: BikeOption[];
  availableDates?: string[]; // Format: "YYYY-MM-DD"
};

export type DestinationQuickFacts = {
  bestTime: string;
  startPoint: string;
  travelStyle: string;
};

export type Destination = {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  summary: string;
  heroImage: string;
  icon: DestinationIcon;
  badge?: string;
  quickFacts: DestinationQuickFacts;
  packages: DestinationPackage[];
};

export const destinations: Destination[] = [
  {
    slug: "ladakh",
    name: "Ladakh",
    region: "India",
    tagline: "Rugged passes and starry desert skies",
    summary:
      "Ride across iconic Himalayan passes, share butter tea in remote villages, and wake up to surreal moonscapes beside Pangong Tso.",
    heroImage:
      "https://images.unsplash.com/photo-1526481280695-3c4693df8ced?auto=format&fit=crop&w=1600&q=80",
    icon: "mountain",
    badge: "Trending",
    quickFacts: {
      bestTime: "June – September",
      startPoint: "Leh Airport",
      travelStyle: "High-altitude expeditions",
    },
    packages: [
      {
        slug: "khardungla-changla-loop",
        name: "Khardungla Changla Loop",
        duration: "5 nights · 6 days",
        description:
          "Embark on a breathtaking 6-day journey through the majestic landscapes of Ladakh. Experience high-altitude adventure with the legendary Khardungla and Changla passes, serene Pangong Lake, mystical monasteries, and the enchanting Nubra Valley. This is not just about luxury or budget—it's about reconnecting with nature, embracing challenges, and finding joy in the unexpected.",
        price: "₹21,299",
        oldPrice: "₹42,000",
        badge: "Save 8%",
        rating: 4.9,
        reviews: 428,
        highlights: [
          "Welcome to Leh - The Land of Lamas",
          "Exploring Leh - A Journey Through History and Mysticism",
          "Road to Nubra - Into the Mystic Dunes",
          "Pangong Calling - The Lake of Dreams",
          "Return to Leh - Culture & Colors",
          "Farewell Ladakh - Until Next Time",
        ],
        itineraryUrl:
          "https://drive.google.com/uc?export=download&confirm=t&id=1jV0EcTYct29O9DY7dEI2HK1bgHq79Myq",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F9e2929517ee44d719568aadc2e96dcef%2F0487332556e645c49689f34a07f57e14?format=webp&width=1600&height=2400",
        galleryImages: [
          "https://cdn.builder.io/api/v1/image/assets%2F9e2929517ee44d719568aadc2e96dcef%2F0487332556e645c49689f34a07f57e14?format=webp&width=1600&height=2400",
          "https://cdn.builder.io/api/v1/image/assets%2Ffca3d655541c41dca4b7afc0cc1ad0b5%2Ff65e402bd0f64114bf9d139b1431aca4?format=webp&width=800&height=1200",
          "https://cdn.builder.io/api/v1/image/assets%2Ffca3d655541c41dca4b7afc0cc1ad0b5%2F9ab9181318894f2d8d21617ab4c2a83f?format=webp&width=800&height=1200",
          "https://cdn.builder.io/api/v1/image/assets%2F9e2929517ee44d719568aadc2e96dcef%2Fc56e32ac67b5429a8298412d2fca44d4?format=webp&width=1600&height=2400",
          "https://cdn.builder.io/api/v1/image/assets%2F9e2929517ee44d719568aadc2e96dcef%2F5f64937e077a45aba0193adf7a79d744?format=webp&width=1600&height=2400",
        ],
        categories: ["Mountain", "Adventure", "Two-wheeler"],
        itinerary: [
          {
            day: 1,
            title: "Welcome to Leh – The Land of Lamas",
            location: "Leh",
            description:
              "You'll be greeted with a warm Ladakhi welcome and transferred to your hotel. The day is reserved for acclimatization – take it easy, sip on hot butter tea, and let your body adjust to the altitude. Enjoy a leisurely evening stroll around Leh Market (if feeling well).",
            highlights: [
              "Arrival at Leh Airport",
              "Warm Ladakhi welcome and hotel transfer",
              "Acclimatization day",
              "Evening stroll around Leh Market (optional)",
            ],
            transfer: {
              type: "Airport Transfer",
              vehicle: "SUV",
              from: "Leh Airport",
              to: "Hotel in Leh",
              stops: 0,
            },
            stay: {
              name: "Hotel in Leh",
              stars: 3,
              checkIn: "3:00 PM",
              checkOut: "11:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F3a22643d47bc4479a35eddf47bd6058d?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 2,
            title: "Exploring Leh – A Journey Through History and Mysticism",
            location: "Leh",
            description:
              "Start with the Hall of Fame, a tribute to Indian soldiers, followed by a visit to the mysterious Magnetic Hill. Witness the confluence of the Indus and Zanskar Rivers at Sangam Point and find peace at the sacred Pathar Sahib Gurudwara. End your day with sunset views and peaceful vibes at Shanti Stupa.",
            highlights: [
              "Hall of Fame Museum – A tribute to our brave soldiers",
              "Magnetic Hill – Defy gravity at this optical illusion spot",
              "Sangam Point – Where the Indus and Zanskar rivers meet",
              "Patthar Sahib Gurudwara – A spiritual haven with a legendary story",
              "Evening at Shanti Stupa – Sunset views and peaceful vibes",
            ],
            stay: {
              name: "Hotel in Leh",
              stars: 3,
              checkIn: "Check-in",
              checkOut: "Check-out",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F3a22643d47bc4479a35eddf47bd6058d?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 3,
            title: "Road to Nubra – Into the Mystic Dunes",
            location: "Nubra Valley",
            description:
              "Cross the mighty Khardungla (18,380 ft) – one of the highest motorable roads in the world. Reach the enchanting Nubra Valley and experience Hundar Village with camel rides on the white sand dunes and a beautiful sunset over the valley.",
            highlights: [
              "Leh to Nubra Valley via KhardungLa Pass",
              "Cross the mighty KhardungLa (18,380 ft) – one of the highest motorable roads in the world",
              "Reach the enchanting Nubra Valley",
              "Camel ride on the white sand dunes",
              "Catch a beautiful sunset over the valley",
            ],
            transfer: {
              type: "Road Transfer",
              vehicle: "Motorbike with Backup Vehicle",
              from: "Leh",
              to: "Hundar, Nubra Valley",
              stops: 2,
            },
            stay: {
              name: "Camp in Hundar, Nubra Valley",
              stars: 3,
              checkIn: "4:00 PM",
              checkOut: "9:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F47658ef78ca64a43820e2da750796eb1?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 4,
            title: "Pangong Calling – The Lake of Dreams",
            location: "Pangong Lake",
            description:
              "Drive from Nubra to Pangong Lake via the scenic Shyok Route through mesmerizing landscapes. Arrive at Pangong Lake – the crown jewel of Ladakh. Marvel at the ever-changing hues of the lake and watch the stars dance over the lake at night.",
            highlights: [
              "Nubra to Pangong Lake via Shyok Route",
              "Scenic drive through mesmerizing landscapes",
              "Arrive at Pangong Lake – The crown jewel of Ladakh",
              "Marvel at the ever-changing hues of the lake",
              "Watch the stars dance over the lake at night",
            ],
            transfer: {
              type: "Road Transfer",
              vehicle: "Motorbike with Backup Vehicle",
              from: "Hundar, Nubra Valley",
              to: "Pangong Lake",
              stops: 1,
            },
            stay: {
              name: "Camps near Pangong Lake",
              stars: 3,
              checkIn: "5:00 PM",
              checkOut: "8:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Ff76b596747e94053acd198cc33778947?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 5,
            title: "Return to Leh – Culture & Colors",
            location: "Leh",
            description:
              "Drive via Changla Pass (17,586 ft), another high-altitude marvel. En route, stop by the peaceful Thiksey Monastery, Ladakh's wealthiest Hemis Monastery, and the iconic 3 Idiots School (Rancho's School) for Bollywood nostalgia before returning to Leh.",
            highlights: [
              "Pangong to Leh via ChangLa Pass",
              "Drive via ChangLa (17,586 ft), another high-altitude marvel",
              "Thiksey Monastery – A majestic hilltop monastery",
              "Hemis Monastery – Ladakh's wealthiest and most famous monastery",
              "3 Idiots School (Rancho's School) – Bollywood nostalgia",
            ],
            transfer: {
              type: "Road Transfer",
              vehicle: "Motorbike with Backup Vehicle",
              from: "Pangong Lake",
              to: "Hotel in Leh",
              stops: 3,
            },
            stay: {
              name: "Hotel in Leh",
              stars: 3,
              checkIn: "4:00 PM",
              checkOut: "11:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F3a22643d47bc4479a35eddf47bd6058d?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 6,
            title: "Farewell Ladakh – Until Next Time",
            description:
              "After breakfast, you'll be escorted to Leh Airport. Take off with your heart full of memories and soul touched by the mountains.",
            highlights: [
              "After breakfast, escort to Leh Airport",
              "Take off with unforgettable memories of Ladakh's landscapes, culture, and adventure",
            ],
            transfer: {
              type: "Airport Transfer",
              vehicle: "SUV",
              from: "Hotel in Leh",
              to: "Leh Airport",
              stops: 0,
            },
          },
        ],
        inclusions: [
          "Sightseeing (for complete trip as per itinerary)",
          "5 nights accommodation double sharing (3 Nights in Leh, 1 Night in Nubra, 1 Night in Pangong)",
          "10 Meals (Day 2nd to Day 6th Breakfast, Day 1st to Day 5th Dinner)",
          "Fuel for complete trip",
          "First-Aid kit for emergency",
          "Oxygen cylinder (1)",
          "Motorbike (RE Himalayan 452, RE Himalayan 411, RE Classic 350)",
          "Marshall Cum Mechanic",
          "Backup Vehicle from Nubra Day (Day 3 of the itinerary) with Helmet",
          "All inner line permits",
          "Bonfire (1 night)",
          "Leh Airport Pickup",
          "Leh Airport Drop",
        ],
        exclusions: [
          "Any food or beverage expenses not covered in the package",
          "Any additional costs incurred due to natural calamities or unforeseen circumstances beyond our control",
          "Any other expense not mentioned in the inclusion column",
          "Extra 5% GST",
        ],
        bikes: [
          {
            id: "himalayan-452",
            name: "Royal Enfield Himalayan 452",
            description: "Premium adventure bike. Maximum power and capabilities.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fefb8a20ed2eb4fb5b67c675a044988d4%2Fc9aec4380fa04f2b8857068d6a997558?format=webp&width=800&height=1200",
            priceMultiplier: 1.35,
            cc: "452cc",
            features: ["Maximum power", "Advanced suspension", "Best for experts", "Handles all terrains"],
          },
          {
            id: "himalayan-411",
            name: "Royal Enfield Himalayan 411",
            description: "Mid-range adventure bike. Great balance of power and comfort.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fe9a55513d7574416bb75353f3cc4131d%2F02706d30f1124e2ba7f98c9fd36e6894?format=webp&width=800&height=1200",
            priceMultiplier: 1.15,
            cc: "411cc",
            features: ["Better ground clearance", "Improved suspension", "More powerful engine", "Ideal for rough terrain"],
          },
          {
            id: "classic-350",
            name: "Royal Enfield Classic 350",
            description: "Perfect for beginners. Smooth, lightweight, and easy to handle.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fefb8a20ed2eb4fb5b67c675a044988d4%2F3ce46e66d9b648498cebe69aaf9f207e?format=webp&width=800&height=1200",
            priceMultiplier: 1.0,
            cc: "350cc",
            features: ["Best for beginners", "Comfortable seating", "Excellent fuel efficiency", "Classic design"],
          },
          {
            id: "seat-in-backup",
            name: "Seat in Backup",
            description: "Travel comfortably in a backup support vehicle.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fc5bcaa71489e4444b44e4bf32a26a570%2F03651deabdd94bccaee077d99e2caed7?format=webp&width=800&height=1200",
            priceMultiplier: 1.0,
            isBackupVehicle: true,
            features: ["Comfortable seating", "Support vehicle", "Scenic viewing"],
          },
        ],
        availableDates: [
          "2026-04-12", "2026-04-19",
          "2026-05-03", "2026-05-17", "2026-05-24", "2026-05-31",
          "2026-06-07", "2026-06-14", "2026-06-21", "2026-06-26",
          "2026-07-05", "2026-07-12", "2026-07-19", "2026-07-26",
          "2026-08-02", "2026-08-08", "2026-08-13", "2026-08-23", "2026-08-30",
          "2026-09-06", "2026-09-13", "2026-09-20", "2026-09-27",
          "2026-10-04", "2026-10-11", "2026-10-18",
        ],
      },
      {
        slug: "indias-last-turn",
        name: "India's Last Turn",
        duration: "6 nights · 7 days",
        description:
          "Experience the ultimate Ladakh adventure with this 7-day expedition through legendary passes and pristine landscapes. Ride across Khardungla, Diskit Monastery, explore Turtuk village at the Indo-Pak border, traverse Pangong Lake, and return via Changla Pass discovering monasteries and cultural landmarks.",
        price: "₹26,299",
        oldPrice: "₹36,900",
        badge: "Popular",
        rating: 4.8,
        reviews: 512,
        highlights: [
          "Hall of fame | Patthar sahib | Magnetic hill | Sangam point | Shanti Stupa",
          "Nubra Valley | Khardungla pass | Hundar Sand Dunes",
          "Hundar | Diskit Monastery | Turtuk | Hundar",
          "Shyok | Changthang valley | Tangtse | Pangong TSo",
          "Pangong | ChangLa | Thiksey | Shey | SECMOL",
          "Farewell Ladakh – Until Next Time",
        ],
        itineraryUrl:
          "https://drive.google.com/uc?export=download&confirm=t&id=1UkGUiHOHgNTskO0w6OrnOsV8cwpkaCG8",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F381a433fb289442aa3ed9e966284c387%2F33b69c51a9f5485eb147c5ce9248f980?format=webp&width=1600&height=2400",
        galleryImages: [
          "https://cdn.builder.io/api/v1/image/assets%2F381a433fb289442aa3ed9e966284c387%2F33b69c51a9f5485eb147c5ce9248f980?format=webp&width=1600&height=2400",
          "https://cdn.builder.io/api/v1/image/assets%2Ffca3d655541c41dca4b7afc0cc1ad0b5%2F3a25c72734df4c118462d8b0529e74fc?format=webp&width=800&height=1200",
          "https://cdn.builder.io/api/v1/image/assets%2Ffca3d655541c41dca4b7afc0cc1ad0b5%2F5fa473aa825c4588846807333541f23e?format=webp&width=800&height=1200",
          "https://cdn.builder.io/api/v1/image/assets%2F9e2929517ee44d719568aadc2e96dcef%2Fc56e32ac67b5429a8298412d2fca44d4?format=webp&width=1600&height=2400",
          "https://cdn.builder.io/api/v1/image/assets%2F9e2929517ee44d719568aadc2e96dcef%2F5f64937e077a45aba0193adf7a79d744?format=webp&width=1600&height=2400",
        ],
        categories: ["Mountain", "Adventure", "Two-wheeler"],
        itinerary: [
          {
            day: 1,
            title: "Leh Arrival | Acclimatization | Market | Overnight stay Leh",
            location: "Leh",
            description:
              "Arrive at Leh Airport and transfer to your hotel. Spend the day acclimatizing to the high altitude. Enjoy a leisurely evening and stroll around Leh Market with colorful shops selling warm clothes, sweet apricots, and prayer flags.",
            highlights: [
              "Arrival at Leh Airport",
              "Acclimatization at high altitude",
              "Leh Market exploration",
            ],
            transfer: {
              type: "Airport Transfer",
              vehicle: "SUV",
              from: "Leh Airport",
              to: "Hotel in Leh",
              stops: 0,
            },
            stay: {
              name: "Hotel in Leh",
              stars: 3,
              checkIn: "3:00 PM",
              checkOut: "11:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F3a22643d47bc4479a35eddf47bd6058d?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 2,
            title: "Hall of fame | Patthar sahib | Magnetic hill | Sangam point | Shanti Stupa",
            location: "Leh",
            description:
              "Explore Leh's top attractions including Hall of Fame Museum dedicated to Indian soldiers, Magnetic Hill where bikes roll uphill, Sangam Point where Indus and Zanskar rivers meet, and Pathar Sahib Gurudwara. End your day at Shanti Stupa for sunset views.",
            highlights: [
              "Hall of Fame Museum",
              "Magnetic Hill optical illusion",
              "Sangam Point - river confluence",
              "Pathar Sahib Gurudwara",
              "Shanti Stupa sunset views",
            ],
            stay: {
              name: "Hotel in Leh",
              stars: 3,
              checkIn: "Check-in",
              checkOut: "Check-out",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F3a22643d47bc4479a35eddf47bd6058d?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 3,
            title: "Nubra Valley | Khardungla pass | Hundar Sand Dunes | Overnight stay Hundar",
            location: "Nubra Valley",
            description:
              "Cross the mighty Khardungla Pass at 18,380 feet - one of the highest motorable roads in the world. Descend into the enchanting Nubra Valley and experience Hundar Village with camel rides on white sand dunes.",
            highlights: [
              "Khardungla Pass - 18,380 feet",
              "Highest motorable road experience",
              "Nubra Valley descent",
              "Hundar sand dunes",
              "Double-humped Bactrian camel rides",
              "Sunset over the valley",
            ],
            transfer: {
              type: "Biking Adventure",
              vehicle: "Royal Enfield with Backup Vehicle",
              from: "Leh",
              to: "Hundar, Nubra Valley",
              stops: 2,
            },
            stay: {
              name: "Camp/Resort in Hundar",
              stars: 3,
              checkIn: "4:00 PM",
              checkOut: "9:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F47658ef78ca64a43820e2da750796eb1?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 4,
            title: "Hundar | Diskit Monastery | Turtuk | Hundar | Overnight Stay Hundar",
            location: "Nubra Valley",
            description:
              "Day excursion to visit Diskit Monastery and explore Turtuk village - one of the last Indian villages before the Indo-Pak border. Experience the unique Balti culture and try local apricots. Return to Hundar in the evening.",
            highlights: [
              "Diskit Monastery - 106-meter Maitreya Buddha statue",
              "Turtuk village at Indo-Pak border",
              "Balti culture exploration",
              "Local apricot orchards",
              "Traditional Balti hospitality",
            ],
            transfer: {
              type: "Day Excursion",
              vehicle: "Royal Enfield",
              from: "Hundar",
              to: "Turtuk & Diskit",
              stops: 3,
            },
            stay: {
              name: "Camp/Resort in Hundar",
              stars: 3,
              checkIn: "Check-in",
              checkOut: "Check-out",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F47658ef78ca64a43820e2da750796eb1?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 5,
            title: "Shyok | Changthang valley | Tangtse | Pangong TSo | Overnight stay Pangong",
            location: "Pangong Lake",
            description:
              "Scenic drive from Nubra to Pangong Lake via the remote Shyok route. Ride along turquoise rivers through wild Changthang plateau. Arrive at Pangong Lake and marvel at its ever-changing hues. Watch stars dance over the lake at night.",
            highlights: [
              "Shyok River scenic drive",
              "Changthang valley exploration",
              "Pangong Lake arrival",
              "Color-changing waters",
              "Starlit sky experience",
            ],
            transfer: {
              type: "Scenic Biking Route",
              vehicle: "Royal Enfield with Backup Vehicle",
              from: "Hundar",
              to: "Pangong Lake",
              stops: 2,
            },
            stay: {
              name: "Camps near Pangong Lake",
              stars: 3,
              checkIn: "5:00 PM",
              checkOut: "8:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Ff76b596747e94053acd198cc33778947?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 6,
            title: "Pangong | ChangLa | Thiksey | Shey | SECMOL | Overnight stay Leh",
            location: "Leh",
            description:
              "Return to Leh via Changla Pass, another high-altitude marvel at 17,586 feet. En route, explore Thiksey Monastery with its Potala-like architecture, Shey Palace, and the innovative SECMOL campus inspired by the 3 Idiots movie.",
            highlights: [
              "Pangong to Leh via Changla Pass",
              "Changla Pass - 17,586 feet",
              "Thiksey Monastery visit",
              "Shey Palace exploration",
              "SECMOL campus - 3 Idiots location",
              "Leh market return",
            ],
            transfer: {
              type: "Return Biking Route",
              vehicle: "Royal Enfield with Backup Vehicle",
              from: "Pangong Lake",
              to: "Hotel in Leh",
              stops: 4,
            },
            stay: {
              name: "Hotel in Leh",
              stars: 3,
              checkIn: "4:00 PM",
              checkOut: "11:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F3a22643d47bc4479a35eddf47bd6058d?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 7,
            title: "Farewell Ladakh – Until Next Time",
            description:
              "After breakfast, transfer to Leh Airport. Depart with your heart full of memories and soul touched by the mountains, adventures, and the warmth of Ladakh's people.",
            highlights: [
              "Breakfast at hotel",
              "Airport transfer",
              "Departure with unforgettable memories",
            ],
            transfer: {
              type: "Airport Transfer",
              vehicle: "SUV",
              from: "Hotel in Leh",
              to: "Leh Airport",
              stops: 0,
            },
          },
        ],
        inclusions: [
          "6 nights accommodation (3 Nights in Leh, 2 Night in Nubra, 1 Night in Pangong)",
          "12 Meals (Day 2nd to Day 7th Breakfast, Day 1st to Day 6th Dinner)",
          "Sightseeing (for complete trip as per itinerary)",
          "Fuel for complete trip",
          "First-Aid kit for emergency",
          "Oxygen cylinder (1)",
          "Motorbike (RE Classic 350, RE Himalayan 411, RE Himalayan 452) with Helmet",
          "Marshall Cum Mechanic",
          "Backup Vehicle from (Nubra Day, Day 3 of the itinerary)",
          "All inner line permits",
          "Bonfire (1 night)",
          "Leh Airport Pickup",
          "Leh Airport Drop",
        ],
        exclusions: [
          "Any food or beverage expenses not covered in the package",
          "Any additional costs incurred due to natural calamities or unforeseen circumstances beyond our control",
          "Any other expense not mentioned in the inclusion column",
          "GST 5%",
        ],
        bikes: [
          {
            id: "himalayan-452",
            name: "Royal Enfield Himalayan 452",
            description: "Premium adventure bike. Maximum power and capabilities.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fefb8a20ed2eb4fb5b67c675a044988d4%2Fc9aec4380fa04f2b8857068d6a997558?format=webp&width=800&height=1200",
            priceMultiplier: 1.35,
            cc: "452cc",
            features: ["Maximum power", "Advanced suspension", "Best for experts", "Handles all terrains"],
          },
          {
            id: "himalayan-411",
            name: "Royal Enfield Himalayan 411",
            description: "Mid-range adventure bike. Great balance of power and comfort.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fe9a55513d7574416bb75353f3cc4131d%2F02706d30f1124e2ba7f98c9fd36e6894?format=webp&width=800&height=1200",
            priceMultiplier: 1.15,
            cc: "411cc",
            features: ["Better ground clearance", "Improved suspension", "More powerful engine", "Ideal for rough terrain"],
          },
          {
            id: "classic-350",
            name: "Royal Enfield Classic 350",
            description: "Perfect for beginners. Smooth, lightweight, and easy to handle.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fefb8a20ed2eb4fb5b67c675a044988d4%2F3ce46e66d9b648498cebe69aaf9f207e?format=webp&width=800&height=1200",
            priceMultiplier: 1.0,
            cc: "350cc",
            features: ["Best for beginners", "Comfortable seating", "Excellent fuel efficiency", "Classic design"],
          },
          {
            id: "seat-in-backup",
            name: "Seat in Backup",
            description: "Travel comfortably in a backup support vehicle.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fc5bcaa71489e4444b44e4bf32a26a570%2F03651deabdd94bccaee077d99e2caed7?format=webp&width=800&height=1200",
            priceMultiplier: 1.0,
            isBackupVehicle: true,
            features: ["Comfortable seating", "Support vehicle", "Scenic viewing"],
          },
        ],
        availableDates: [
          "2026-04-26",
          "2026-05-01", "2026-05-22",
          "2026-06-05", "2026-06-19", "2026-06-26",
          "2026-07-03", "2026-07-17", "2026-07-31",
          "2026-08-12", "2026-08-25",
          "2026-09-04", "2026-09-11",
          "2026-10-02", "2026-10-16",
        ],
      },
      {
        slug: "migla-throne-ride",
        name: "MigLa Throne Ride",
        duration: "7 nights · 8 days",
        description:
          "An unforgettable 8-day adventure through the heart of Ladakh, where breathtaking landscapes, ancient monasteries, and thrilling high-altitude passes await. This expedition is perfect for adrenaline seekers and nature lovers, offering a mix of scenic beauty, historical landmarks, and the world's highest motorable pass experience at Mig La.",
        price: "₹33,199",
        oldPrice: "₹43,500",
        badge: "Premium",
        rating: 4.7,
        reviews: 302,
        highlights: [
          "Arrival in Leh – Acclimatization & Bike Collection",
          "Leh Local Exploration - Nature & History Unite",
          "Nubra Valley – The Desert in the Mountains",
          "Nubra to Pangong Lake via Shyok Route",
          "Pangong to Hanle via Chushul, Rezang La War Memorial",
          "Touching the Sky at MigLa (19,400 feet)",
          "The Monastery Trail back to Leh",
          "Farewell Leh – Until We Meet Again",
        ],
        itineraryUrl:
          "https://drive.google.com/uc?export=download&confirm=t&id=1ftCLsCQzd-Vhv50ENyvLpVGzpiUFJFvC",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F381a433fb289442aa3ed9e966284c387%2Fa4a5f66915b3483c84c56b989e32176e?format=webp&width=1600&height=2400",
        galleryImages: [
          "https://cdn.builder.io/api/v1/image/assets%2F381a433fb289442aa3ed9e966284c387%2Fa4a5f66915b3483c84c56b989e32176e?format=webp&width=1600&height=2400",
          "https://cdn.builder.io/api/v1/image/assets%2Ffca3d655541c41dca4b7afc0cc1ad0b5%2Fceef36e3428c42b3870e060f1922a8cd?format=webp&width=800&height=1200",
          "https://cdn.builder.io/api/v1/image/assets%2Ffca3d655541c41dca4b7afc0cc1ad0b5%2Fdf0ea7d4b32f41649fbac97c9c1e77f0?format=webp&width=800&height=1200",
          "https://cdn.builder.io/api/v1/image/assets%2F9e2929517ee44d719568aadc2e96dcef%2Fc56e32ac67b5429a8298412d2fca44d4?format=webp&width=1600&height=2400",
          "https://cdn.builder.io/api/v1/image/assets%2F9e2929517ee44d719568aadc2e96dcef%2F5f64937e077a45aba0193adf7a79d744?format=webp&width=1600&height=2400",
        ],
        categories: ["Mountain", "Adventure", "Two-wheeler"],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Leh – Acclimatization & Bike Collection",
            location: "Leh",
            description:
              "Private cab transfer from Leh Airport takes you past tall snowy mountains into fresh cool air at 11,500 feet. Check into your hotel and take it easy for acclimatization. Enjoy a leisurely evening stroll through Leh Market with colorful shops. Evening: Collect your Royal Enfield Himalayan bike, check it out, and take a test ride.",
            highlights: [
              "Airport arrival at 11,500 feet",
              "Warm Ladakhi welcome",
              "Hotel check-in and acclimatization",
              "Leh Market exploration",
              "Royal Enfield bike collection and test ride",
            ],
            transfer: {
              type: "Private Cab",
              vehicle: "SUV",
              from: "Leh Airport",
              to: "Hotel in Leh",
              stops: 0,
            },
            stay: {
              name: "Cozy Leh Hotel",
              stars: 3,
              checkIn: "3:00 PM",
              checkOut: "11:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F3a22643d47bc4479a35eddf47bd6058d?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 2,
            title: "Leh Local Exploration - Nature & History Unite",
            location: "Leh",
            description:
              "Breakfast and begin your bike adventure. First, visit Gurudwara Pathar Sahib with its special rock that won't roll down (miracle story). Then, experience Magnetic Hill where your bike rolls uphill. Stop at beautiful Sangam where Indus River (blue) meets Zanskar River (green). Ride up to Shanti Stupa temple for sunset in orange-pink sky.",
            highlights: [
              "Fresh breakfast",
              "Gurudwara Pathar Sahib - miracle rock",
              "Magnetic Hill optical illusion",
              "Sangam Point - river confluence",
              "Shanti Stupa sunset experience",
            ],
            transfer: {
              type: "Bike Ride",
              vehicle: "Royal Enfield Himalayan 411/450cc",
              from: "Hotel in Leh",
              to: "Leh attractions",
              stops: 4,
            },
            stay: {
              name: "Leh Hotel",
              stars: 3,
              checkIn: "Check-in",
              checkOut: "Check-out",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F3a22643d47bc4479a35eddf47bd6058d?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 3,
            title: "Nubra Valley – The Desert in the Mountains",
            location: "Nubra Valley",
            description:
              "Breakfast served. Rev up to famous Khardungla Pass at 18,380 feet (world's 3rd highest bike road). Thin air makes heart race, prayer flags flap wild, eagles fly near. Zoom down into Nubra Valley to Hundar's soft golden sand dunes. Hop on double-hump Bactrian camel for sunset ride. Evening bonfire crackles with stars filling black sky.",
            highlights: [
              "Khardungla Pass - 18,380 feet",
              "World's 3rd highest motorable road",
              "Nubra Valley descent",
              "Hundar sand dunes",
              "Bactrian camel sunset ride",
              "Evening bonfire with local music",
            ],
            transfer: {
              type: "Bike Ride",
              vehicle: "Royal Enfield with Backup Vehicle",
              from: "Leh",
              to: "Hundar, Nubra Valley",
              stops: 2,
            },
            stay: {
              name: "Nubra Cottage or Swiss Camp",
              stars: 3,
              checkIn: "4:00 PM",
              checkOut: "9:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F47658ef78ca64a43820e2da750796eb1?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 4,
            title: "Nubra to Pangong Lake via Shyok Route",
            location: "Pangong Lake",
            description:
              "Breakfast served. Bike to Diskit village's giant 106-meter Maitreya Buddha statue smiling over lands. Then, twisty fun along flat shiny Shayok River, dodge small rocks, big open skies. Reach Pangong Lake at 14,270 feet - water turns blue to green in sun, half in India half Tibet. Afternoon relax by water, watch yaks and birds.",
            highlights: [
              "Diskit Monastery - 106-meter Buddha statue",
              "Shayok River scenic route",
              "Pangong Lake at 14,270 feet",
              "Color-changing waters",
              "India-Tibet border location",
              "Wildlife watching at lake",
            ],
            transfer: {
              type: "Scenic Bike Ride",
              vehicle: "Royal Enfield with Backup Vehicle",
              from: "Hundar",
              to: "Pangong Lake",
              stops: 2,
            },
            stay: {
              name: "Pangong Cottage",
              stars: 3,
              checkIn: "5:00 PM",
              checkOut: "8:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Ff76b596747e94053acd198cc33778947?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 5,
            title: "Pangong to Hanle via Chushul, Rezang La War Memorial & Dungti",
            location: "Hanle",
            description:
              "Breakfast served. Ride rough dirt roads through Chushul open lands to Rezang La War Memorial - quiet stone place honoring brave soldiers. Arrive Hanle far village and old monastery with colorful wall paintings and spinning prayer wheels. Night magic: Best stars in India - no lights, see full Milky Way river, shooting stars fall.",
            highlights: [
              "Chushul route through open lands",
              "Rezang La War Memorial",
              "Hanle village arrival",
              "Ancient monastery visit",
              "Clearest night skies in India",
              "Milky Way observation",
            ],
            transfer: {
              type: "Off-Road Bike Ride",
              vehicle: "Royal Enfield with Backup Vehicle",
              from: "Pangong Lake",
              to: "Hanle",
              stops: 2,
            },
            stay: {
              name: "Hanle Cottage or Hotel",
              stars: 3,
              checkIn: "5:00 PM",
              checkOut: "8:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F6aa9bceb5e4e4bf1a1120e5849eac001?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F6c0a2d2f6a09420487f7587f45a690a4?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F62d477c404d34375942af51d268da4f2?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 6,
            title: "Touching the Sky at MigLa (19,400 feet)",
            location: "Hanle",
            description:
              "Breakfast served big. Steep ride up Mig La at 19,400 feet (Earth's 2nd highest motorable road) - cold wind bites, prayer flags dance crazy, stand at top with huge empty world view, pure win feeling. Roll down through quiet high plains and empty lands to beautiful Hanle. Walk big land at sunset, peace everywhere.",
            highlights: [
              "Mig La Pass - 19,400 feet",
              "Earth's 2nd highest motorable pass",
              "Prayer flags and wind experience",
              "Panoramic mountain views",
              "High altitude riding achievement",
              "Sunset walk at Hanle",
            ],
            transfer: {
              type: "High-Altitude Bike Ride",
              vehicle: "Royal Enfield with Backup Vehicle",
              from: "Hanle",
              to: "Mig La & back to Hanle",
              stops: 1,
            },
            stay: {
              name: "Hanle Homestay",
              stars: 2,
              checkIn: "Check-in",
              checkOut: "Check-out",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F6c0a2d2f6a09420487f7587f45a690a4?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F6aa9bceb5e4e4bf1a1120e5849eac001?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F62d477c404d34375942af51d268da4f2?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 7,
            title: "The Monastery Trail back to Leh",
            location: "Leh",
            description:
              "Breakfast served. Ride via Nyoma, Chumathang and Thiksey, Shey Monastery on the way, then follow roaring Indus River through rocky Upshi narrow gorge back to Leh. Jump into Leh Market buzz - buy soft pashmina scarves in every color, shiny turquoise jewels, hot street momos and sweets. Special dinner with music vibes.",
            highlights: [
              "Nyoma and Chumathang route",
              "Thiksey Monastery visit",
              "Shey Palace exploration",
              "Indus River gorge riding",
              "Leh Market shopping",
              "Traditional Ladakhi dinner with music",
            ],
            transfer: {
              type: "Scenic Return Ride",
              vehicle: "Royal Enfield with Backup Vehicle",
              from: "Hanle",
              to: "Hotel in Leh",
              stops: 4,
            },
            stay: {
              name: "Leh Hotel",
              stars: 3,
              checkIn: "4:00 PM",
              checkOut: "11:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F3a22643d47bc4479a35eddf47bd6058d?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 8,
            title: "Farewell Leh – Until We Meet Again",
            description:
              "If flight late, quick stop at monastery or more market gifts like prayer beads or tea. Hand bike back with mechanic final check all good. Private cab to airport, carry Ladakh happy memories forever.",
            highlights: [
              "Optional monastery or market visit",
              "Bike handover to mechanic",
              "Airport transfer",
              "Departure with memories",
            ],
            transfer: {
              type: "Private Cab",
              vehicle: "SUV",
              from: "Hotel in Leh",
              to: "Leh Airport",
              stops: 0,
            },
          },
        ],
        inclusions: [
          "Motorbike (Himalayan 450cc\\411cc) with Helmet",
          "7 nights accommodation (3 Nights in Leh, 1 Night in Nubra, 1 Night in Pangong, 2 Night in Hanle/Nyoma)",
          "14 Meals (Day 2nd to Day 8th Breakfast, Day 1st to Day 7th Dinner)",
          "Sightseeing (for complete trip as per itinerary)",
          "Fuel for complete trip",
          "First-Aid kit for emergency",
          "Oxygen cylinder (1)",
          "Marshall Cum Mechanic",
          "Backup Vehicle from (Nubra Day, Day 3 of the itinerary)",
          "All inner line permits",
          "Bonfire (1 night)",
          "Leh Airport Pickup",
          "Leh Airport Drop",
        ],
        exclusions: [
          "Any food or beverage expenses not covered in the package",
          "Any additional costs incurred due to natural calamities or unforeseen circumstances beyond our control",
          "Any other expense not mentioned in the inclusion column",
        ],
        bikes: [
          {
            id: "himalayan-452",
            name: "Royal Enfield Himalayan 452",
            description: "Premium adventure bike. Maximum power and capabilities.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fefb8a20ed2eb4fb5b67c675a044988d4%2Fc9aec4380fa04f2b8857068d6a997558?format=webp&width=800&height=1200",
            priceMultiplier: 1.35,
            cc: "452cc",
            features: ["Maximum power", "Advanced suspension", "Best for experts", "Handles all terrains"],
          },
          {
            id: "himalayan-411",
            name: "Royal Enfield Himalayan 411",
            description: "Mid-range adventure bike. Great balance of power and comfort.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fe9a55513d7574416bb75353f3cc4131d%2F02706d30f1124e2ba7f98c9fd36e6894?format=webp&width=800&height=1200",
            priceMultiplier: 1.15,
            cc: "411cc",
            features: ["Better ground clearance", "Improved suspension", "More powerful engine", "Ideal for rough terrain"],
          },
          {
            id: "classic-350",
            name: "Royal Enfield Classic 350",
            description: "Perfect for beginners. Smooth, lightweight, and easy to handle.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fefb8a20ed2eb4fb5b67c675a044988d4%2F3ce46e66d9b648498cebe69aaf9f207e?format=webp&width=800&height=1200",
            priceMultiplier: 1.0,
            cc: "350cc",
            features: ["Best for beginners", "Comfortable seating", "Excellent fuel efficiency", "Classic design"],
          },
          {
            id: "seat-in-backup",
            name: "Seat in Backup",
            description: "Travel comfortably in a backup support vehicle.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fc5bcaa71489e4444b44e4bf32a26a570%2F03651deabdd94bccaee077d99e2caed7?format=webp&width=800&height=1200",
            priceMultiplier: 1.0,
            isBackupVehicle: true,
            features: ["Comfortable seating", "Support vehicle", "Scenic viewing"],
          },
        ],
        availableDates: [
          "2026-05-16", "2026-05-30",
          "2026-06-13", "2026-06-27",
          "2026-07-11", "2026-07-25",
          "2026-08-10", "2026-08-28",
          "2026-09-08", "2026-09-25",
        ],
      },
      {
        slug: "ultimate-ulingla",
        name: "Ultimate UmlingLa",
        duration: "7 nights · 8 days",
        description:
          "An unforgettable 8-day adventure through the heart of Ladakh, where breathtaking landscapes, ancient monasteries, and thrilling high-altitude passes await. This expedition is perfect for adrenaline seekers and nature lovers, offering a mix of scenic beauty, historical landmarks, and unparalleled stargazing opportunities at Umling La and Tso Moriri.",
        price: "₹33,199",
        oldPrice: "₹49,900",
        badge: "Best Value",
        rating: 4.9,
        reviews: 156,
        highlights: [
          "Arrival in Leh – Acclimatization & Bike Collection",
          "Leh Local Exploration - Nature & History Unite",
          "Nubra Valley – The Desert in the Mountains",
          "Nubra to Pangong Lake via Shyok Route",
          "Pangong to Hanle via Chushul & Rezang La",
          "Hanle to Umling La & Tso Moriri via Nyoma",
          "Tso Moriri to Leh via Puga Valley & Tanglang La",
          "Farewell Leh – Until We Meet Again",
        ],
        itineraryUrl:
          "https://drive.google.com/uc?export=download&confirm=t&id=1_pTNYJcwkfVVtfWn5LVkJcd1plVcyjM_",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F381a433fb289442aa3ed9e966284c387%2F7dcb39e48c924358b1c8822906e58ffc?format=webp&width=1600&height=2400",
        galleryImages: [
          "https://cdn.builder.io/api/v1/image/assets%2F381a433fb289442aa3ed9e966284c387%2F7dcb39e48c924358b1c8822906e58ffc?format=webp&width=1600&height=2400",
          "https://cdn.builder.io/api/v1/image/assets%2Ffca3d655541c41dca4b7afc0cc1ad0b5%2F2607a1fc2dda48d288e144c52717c5c7?format=webp&width=800&height=1200",
          "https://cdn.builder.io/api/v1/image/assets%2Ffca3d655541c41dca4b7afc0cc1ad0b5%2F069d6c5f770248adad95f2f869b38812?format=webp&width=800&height=1200",
          "https://cdn.builder.io/api/v1/image/assets%2F9e2929517ee44d719568aadc2e96dcef%2Fc56e32ac67b5429a8298412d2fca44d4?format=webp&width=1600&height=2400",
          "https://cdn.builder.io/api/v1/image/assets%2F9e2929517ee44d719568aadc2e96dcef%2F5f64937e077a45aba0193adf7a79d744?format=webp&width=1600&height=2400",
        ],
        categories: ["Mountain", "Adventure", "Two-wheeler"],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Leh – Acclimatization & Bike Collection",
            location: "Leh",
            description:
              "Private cab waits at Leh Airport, takes you smooth past tall snowy mountains into fresh cool air at 11,500 feet - feel the high-altitude magic start. Check into your nice hotel room; take it easy to adjust - slow walk through Leh market. Evening: Collect your strong Royal Enfield Himalayan bike, sit on comfy seat, check lights and tires.",
            highlights: [
              "Airport arrival at 11,500 feet",
              "High-altitude magic experience",
              "Warm Ladakhi welcome",
              "Hotel check-in and rest",
              "Leh Market exploration",
              "Royal Enfield bike collection and test ride",
            ],
            transfer: {
              type: "Private Cab",
              vehicle: "SUV",
              from: "Leh Airport",
              to: "Hotel in Leh",
              stops: 0,
            },
            stay: {
              name: "Cozy Leh Hotel",
              stars: 3,
              checkIn: "3:00 PM",
              checkOut: "11:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F3a22643d47bc4479a35eddf47bd6058d?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 2,
            title: "Leh Local Exploration - Nature & History Unite",
            location: "Leh",
            description:
              "Breakfast served fresh. Hop on your bike for fun rides: First Gurudwara Pathar Sahib with its special rock, then Magnetic Hill. Stop at pretty sangam where big Indus River meets Zanskar River. Ride up gentle hills to Shanti Stupa temple on top; catch sunset in orange-pink sky, hear soft bells and prayers.",
            highlights: [
              "Fresh breakfast",
              "Gurudwara Pathar Sahib - miracle rock",
              "Magnetic Hill illusion ride",
              "Sangam Point - river confluence",
              "Shanti Stupa temple visit",
              "Sunset and prayers experience",
            ],
            transfer: {
              type: "Bike Ride",
              vehicle: "Royal Enfield Himalayan 411/450cc",
              from: "Hotel in Leh",
              to: "Leh local attractions",
              stops: 4,
            },
            stay: {
              name: "Leh Hotel",
              stars: 3,
              checkIn: "Check-in",
              checkOut: "Check-out",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F3a22643d47bc4479a35eddf47bd6058d?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 3,
            title: "Nubra Valley – The Desert in the Mountains",
            location: "Nubra Valley",
            description:
              "Breakfast served. Rev up to famous Khardung La pass at 18,380 feet. Thin air makes heart race, prayer flags flap wild, eagles fly near. Zoom down curvy roads into Nubra Valley to Hunder's soft golden sand dunes; hop on double-hump Bactrian camel for bumpy sunset ride. Evening bonfire crackles, stars fill black sky.",
            highlights: [
              "Khardungla Pass - 18,380 feet",
              "3rd highest motorable road in world",
              "Nubra Valley descent into dunes",
              "Hundar sand dunes landscape",
              "Double-hump Bactrian camel safari",
              "Sunset ride experience",
              "Evening bonfire with music",
            ],
            transfer: {
              type: "Bike Ride",
              vehicle: "Royal Enfield with Backup Vehicle",
              from: "Leh",
              to: "Hundar, Nubra Valley",
              stops: 2,
            },
            stay: {
              name: "Nubra Cottage or Swiss Camp",
              stars: 3,
              checkIn: "4:00 PM",
              checkOut: "9:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F47658ef78ca64a43820e2da750796eb1?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 4,
            title: "Nubra to Pangong Lake via Shyok Route",
            location: "Pangong Lake",
            description:
              "Breakfast served. Bike to Diskit village's giant 106-meter Maitreya Buddha statue smiling big over lands; then twisty fun along flat shiny Shayok River. Reach wow Pangong Lake at 14,270 feet - water turns blue to green in sun, half in India half Tibet. Afternoon relax by water, watch yaks and birds.",
            highlights: [
              "Diskit Monastery - 106-meter Buddha statue",
              "Shayok River scenic ride",
              "Pangong Lake arrival at 14,270 feet",
              "Color-changing water phenomenon",
              "India-Tibet border location",
              "Wildlife viewing - yaks and birds",
              "Lakeside relaxation",
            ],
            transfer: {
              type: "Scenic Bike Ride",
              vehicle: "Royal Enfield with Backup Vehicle",
              from: "Hundar",
              to: "Pangong Lake",
              stops: 2,
            },
            stay: {
              name: "Pangong Cottage",
              stars: 3,
              checkIn: "5:00 PM",
              checkOut: "8:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Ff76b596747e94053acd198cc33778947?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 5,
            title: "Pangong to Hanle via Chushul, Rezang La War Memorial & Dungti",
            location: "Hanle",
            description:
              "Breakfast served. Ride rough dirt roads through Chushul open lands to Rezang La War Memorial - quiet stone place honoring brave soldiers, big empty mountain views. Arrive Hanle far village and old monastery: Colorful wall paintings, spinning prayer wheels, kind monks sing soft chants in calm air. Night magic: Best stars in India.",
            highlights: [
              "Chushul open lands riding",
              "Rezang La War Memorial visit",
              "Brave soldiers honor site",
              "Hanle remote village arrival",
              "Ancient monastery exploration",
              "Colorful Buddhist paintings",
              "Prayer wheels and monk chants",
              "Clearest night sky in India",
              "Milky Way observation",
            ],
            transfer: {
              type: "Off-Road Bike Ride",
              vehicle: "Royal Enfield with Backup Vehicle",
              from: "Pangong Lake",
              to: "Hanle",
              stops: 2,
            },
            stay: {
              name: "Hanle Cottage or Hotel",
              stars: 3,
              checkIn: "5:00 PM",
              checkOut: "8:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F6aa9bceb5e4e4bf1a1120e5849eac001?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F6c0a2d2f6a09420487f7587f45a690a4?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F62d477c404d34375942af51d268da4f2?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 6,
            title: "Hanle to Umling La & Tso Moriri via Nyoma",
            location: "Tso Moriri",
            description:
              "Breakfast served big. Steep ride up Umling La at 19,024 feet (Earth's 2nd highest motorable road) - cold wind bites, prayer flags dance crazy, stand at top with huge empty world view. Roll down through quiet high plains and empty lands to beautiful Tso Moriri Lake at 14,836 feet - green wet edges full of birds flying. Walk shores at sunset, peace everywhere.",
            highlights: [
              "Umling La Pass - 19,024 feet",
              "2nd highest motorable pass achievement",
              "Prayer flags and cold wind",
              "Tso Moriri Lake at 14,836 feet",
              "Pristine Himalayan beauty",
              "Green lake edges with birds",
              "Korzok Monastery on hill",
              "Sunset walk experience",
              "Mountain peace and serenity",
            ],
            transfer: {
              type: "High-Altitude Bike Ride",
              vehicle: "Royal Enfield with Backup Vehicle",
              from: "Hanle",
              to: "Umling La & Tso Moriri",
              stops: 2,
            },
            stay: {
              name: "Tso Moriri Cottage or Hotel",
              stars: 3,
              checkIn: "5:00 PM",
              checkOut: "8:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F62d477c404d34375942af51d268da4f2?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F6c0a2d2f6a09420487f7587f45a690a4?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F6aa9bceb5e4e4bf1a1120e5849eac001?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 7,
            title: "Tso Moriri to Leh via Puga Valley, Tso Kar, TanglangLa Pass",
            location: "Leh",
            description:
              "Breakfast served. Ride through beautiful Puga Valley, serene Tso Kar and over high Tanglang La pass with stone prayers, then follow roaring Indus River through rocky Upshi narrow gorge back to Leh. Jump into Leh Market buzz - buy soft pashmina scarves, shiny turquoise jewels, hot street momos. Special dinner with music vibes.",
            highlights: [
              "Puga Valley scenic ride",
              "Tso Kar lake exploration",
              "Tanglang La pass crossing",
              "Stone prayer experience",
              "Indus River gorge riding",
              "Narrow Upshi gorge navigation",
              "Leh Market return and shopping",
              "Pashmina and turquoise jewels",
              "Traditional Ladakhi dinner",
              "Live music evening",
            ],
            transfer: {
              type: "Scenic Return Ride",
              vehicle: "Royal Enfield with Backup Vehicle",
              from: "Tso Moriri",
              to: "Hotel in Leh",
              stops: 4,
            },
            stay: {
              name: "Leh Hotel",
              stars: 3,
              checkIn: "4:00 PM",
              checkOut: "11:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F3a22643d47bc4479a35eddf47bd6058d?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 8,
            title: "Farewell Leh – Until We Meet Again",
            description:
              "If flight late, quick stop at monastery or more market gifts. Hand bike back with mechanic final check all good. Private cab to airport, carry Ladakh happy memories forever with your heart full of adventures.",
            highlights: [
              "Optional monastery or market visit",
              "Bike final check with mechanic",
              "Airport transfer",
              "Departure with lifetime memories",
            ],
            transfer: {
              type: "Private Cab",
              vehicle: "SUV",
              from: "Hotel in Leh",
              to: "Leh Airport",
              stops: 0,
            },
          },
        ],
        inclusions: [
          "7 nights accommodation (3 Nights in Leh, 1 Night in Nubra, 1 Night in Pangong, 1 Night in Hanle/Nyoma, 1 Night in Tso Moriri)",
          "14 Meals (Day 2nd to Day 8th Breakfast, Day 1st to Day 7th Dinner)",
          "Sightseeing (for complete trip as per itinerary)",
          "Fuel for complete trip",
          "First-Aid kit for emergency",
          "Oxygen cylinder (1)",
          "Motorbike (RE Classic 350, RE Himalayan 411, RE Himalayan 452) with Helmet",
          "Marshall Cum Mechanic",
          "Backup Vehicle from (Nubra Day, Day 3 of the itinerary)",
          "All inner line permits",
          "Bonfire (1 night)",
          "Leh Airport Pickup",
          "Leh Airport Drop",
        ],
        exclusions: [
          "Any food or beverage expenses not covered in the package",
          "Any additional costs incurred due to natural calamities or unforeseen circumstances beyond our control",
          "Any other expense not mentioned in the inclusion column",
        ],
        bikes: [
          {
            id: "himalayan-452",
            name: "Royal Enfield Himalayan 452",
            description: "Premium adventure bike. Maximum power and capabilities.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fefb8a20ed2eb4fb5b67c675a044988d4%2Fc9aec4380fa04f2b8857068d6a997558?format=webp&width=800&height=1200",
            priceMultiplier: 1.35,
            cc: "452cc",
            features: ["Maximum power", "Advanced suspension", "Best for experts", "Handles all terrains"],
          },
          {
            id: "himalayan-411",
            name: "Royal Enfield Himalayan 411",
            description: "Mid-range adventure bike. Great balance of power and comfort.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fe9a55513d7574416bb75353f3cc4131d%2F02706d30f1124e2ba7f98c9fd36e6894?format=webp&width=800&height=1200",
            priceMultiplier: 1.15,
            cc: "411cc",
            features: ["Better ground clearance", "Improved suspension", "More powerful engine", "Ideal for rough terrain"],
          },
          {
            id: "classic-350",
            name: "Royal Enfield Classic 350",
            description: "Perfect for beginners. Smooth, lightweight, and easy to handle.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fefb8a20ed2eb4fb5b67c675a044988d4%2F3ce46e66d9b648498cebe69aaf9f207e?format=webp&width=800&height=1200",
            priceMultiplier: 1.0,
            cc: "350cc",
            features: ["Best for beginners", "Comfortable seating", "Excellent fuel efficiency", "Classic design"],
          },
          {
            id: "seat-in-backup",
            name: "Seat in Backup",
            description: "Travel comfortably in a backup support vehicle.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fc5bcaa71489e4444b44e4bf32a26a570%2F03651deabdd94bccaee077d99e2caed7?format=webp&width=800&height=1200",
            priceMultiplier: 1.0,
            isBackupVehicle: true,
            features: ["Comfortable seating", "Support vehicle", "Scenic viewing"],
          },
        ],
        availableDates: [
          "2026-05-02", "2026-05-23",
          "2026-06-06", "2026-06-20",
          "2026-07-04", "2026-07-18",
          "2026-08-01", "2026-08-10",
          "2026-09-01", "2026-09-11",
        ],
      },
      {
        slug: "trans-himalayan-ride",
        name: "Trans Himalayan Ride",
        duration: "12 nights · 13 days",
        description:
          "This 13-day Himalayan Odyssey is the ultimate pilgrimage for every adventure seeker - a grand circuit spanning over 3000 kilometers from the plains of Chandigarh to the highest reaches of the trans-Himalayan desert. From the lush saffron valleys of Kashmir to the stark moonscapes of Ladakh, conquer legendary passes and experience Ladakh's most remote frontiers before descending through the Atal Tunnel engineering marvel.",
        price: "₹27,999",
        oldPrice: "₹58,600",
        badge: "Group Special",
        rating: 4.9,
        reviews: 315,
        highlights: [
          "Chandigarh to Jammu - Gateway to the Mountains",
          "Jammu to Srinagar - Into the Heart of Kashmir",
          "Srinagar to Kargil - Crossing the Gateway to Ladakh",
          "Kargil to Leh - The Moonscapes of Lamayuru",
          "Leh to Nubra - Conquering the World's 3rd Highest Pass",
          "Hundar to Pangong - The Hidden Gem of Turtuk",
          "Shyok to Pangong - The Blue Jewel of the Himalayas",
          "Pangong to Hanle - The Borderlands of Hanle",
          "Hanle to Hanle - Touching the Sky at MigLa",
          "Nyoma to Leh - The Monastery Trail",
          "Leh to Sarchu - The High Altitude Plains",
          "Sarchu to Manali - Through the Engineering Marvel",
          "Manali to Chandigarh - The Final Descent",
        ],
        itineraryUrl:
          "https://drive.google.com/uc?export=download&confirm=t&id=1MPyuMnNvDp1g9lSAgDbym3PxGXc87lrp",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2Ff7bafe136619419dbf13ca7afdf8e95e%2F3049f1a0c38f4c3b9725e7b207142b2a?format=webp&width=1600&height=2400",
        galleryImages: [
          "https://cdn.builder.io/api/v1/image/assets%2Ff7bafe136619419dbf13ca7afdf8e95e%2F3049f1a0c38f4c3b9725e7b207142b2a?format=webp&width=1600&height=2400",
          "https://cdn.builder.io/api/v1/image/assets%2Ffca3d655541c41dca4b7afc0cc1ad0b5%2F1b6db0df6d584e0d8a86dc8e38de3c71?format=webp&width=800&height=1200",
          "https://cdn.builder.io/api/v1/image/assets%2Ffca3d655541c41dca4b7afc0cc1ad0b5%2F88fcd81ea1e147c28e72dd33a0cc30a6?format=webp&width=800&height=1200",
          "https://cdn.builder.io/api/v1/image/assets%2F9e2929517ee44d719568aadc2e96dcef%2Fc56e32ac67b5429a8298412d2fca44d4?format=webp&width=1600&height=2400",
          "https://cdn.builder.io/api/v1/image/assets%2F9e2929517ee44d719568aadc2e96dcef%2F5f64937e077a45aba0193adf7a79d744?format=webp&width=1600&height=2400",
        ],
        categories: ["Mountain", "Adventure", "Two-wheeler"],
        itinerary: [
          {
            day: 1,
            title: "The Gateway to the Mountains (340 km, 6-8 Hours)",
            location: "Jammu",
            description:
              "Kick off your journey from Chandigarh through the fertile plains of Punjab. Experience smooth transition from city skylines to rolling foothills of Jammu. Cruise through Jalandhar and Pathankot as distant peaks of the Himalayas begin to peek through the horizon.",
            highlights: [
              "Chandigarh departure",
              "Punjab plains riding",
              "Jalandhar passage",
              "Pathankot arrival",
              "First mountain glimpse",
            ],
            transfer: {
              type: "Group Bike Ride",
              vehicle: "Royal Enfield with Support Team",
              from: "Chandigarh",
              to: "Jammu",
              stops: 2,
            },
            stay: {
              name: "Hotel in Jammu",
              stars: 3,
              checkIn: "6:00 PM",
              checkOut: "8:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fdecb5abb385844a58caf82729218ca02?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fa11481f02e624effabc2ea005de74630?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 2,
            title: "Into the Heart of Kashmir (250 km, 7-9 Hours)",
            location: "Srinagar",
            description:
              "Breathtaking climb through Jawahar Tunnel leads you into Paradise on Earth. Ride past ancient ruins of Awantipora and lush saffron fields of Pampore. Experience mesmerizing evening by Dal Lake with floating magic of Srinagar houseboats.",
            highlights: [
              "Jawahar Tunnel passage",
              "Awantipora ruins",
              "Saffron fields of Pampore",
              "Dal Lake evening",
              "Srinagar floating magic",
            ],
            transfer: {
              type: "Group Scenic Ride",
              vehicle: "Royal Enfield with Support Team",
              from: "Jammu",
              to: "Srinagar",
              stops: 3,
            },
            stay: {
              name: "Hotel in Srinagar",
              stars: 3,
              checkIn: "5:00 PM",
              checkOut: "9:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc227101e17234baaa4001dcfe2754c6c?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fdecb5abb385844a58caf82729218ca02?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 3,
            title: "Crossing the Gateway to Ladakh (205 km, 6-7 Hours)",
            location: "Kargil",
            description:
              "Conquer the mighty Zoji La Pass, gateway to the cold desert. Terrain shifts dramatically from green meadows to rugged brownish cliffs. Pay respects at Drass War Memorial - the second coldest inhabited place on Earth.",
            highlights: [
              "Zoji La Pass conquest",
              "Sonmarg beauty",
              "Gateway to Ladakh",
              "Drass War Memorial visit",
              "Coldest inhabited place",
            ],
            transfer: {
              type: "Group High-Altitude Ride",
              vehicle: "Royal Enfield with Support Team",
              from: "Srinagar",
              to: "Kargil",
              stops: 2,
            },
            stay: {
              name: "Hotel in Kargil",
              stars: 3,
              checkIn: "5:00 PM",
              checkOut: "8:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fa11481f02e624effabc2ea005de74630?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fdecb5abb385844a58caf82729218ca02?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 4,
            title: "The Moonscapes of Lamayuru (215 km, 6-8 Hours)",
            location: "Leh",
            description:
              "Navigate Fotu La Pass - highest point on Srinagar-Leh highway. Experience surreal moonland topography of Lamayuru. Test physics at Magnetic Hill and find peace at Gurudwara Pathar Sahib. Explore Sham Valley before arriving in Leh.",
            highlights: [
              "Fotu La Pass experience",
              "Lamayuru moonscape",
              "Magnetic Hill illusion",
              "Sham Valley exploration",
              "Pathar Sahib Gurudwara",
              "Leh arrival",
            ],
            transfer: {
              type: "Group Mountain Ride",
              vehicle: "Royal Enfield with Support Team",
              from: "Kargil",
              to: "Leh",
              stops: 3,
            },
            stay: {
              name: "Hotel in Leh",
              stars: 3,
              checkIn: "4:00 PM",
              checkOut: "8:00 AM",
              nights: 2,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F3a22643d47bc4479a35eddf47bd6058d?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 5,
            title: "Conquering the World's 3rd Highest Motorable Pass (150 km, 5-6 Hours)",
            location: "Hundar",
            description:
              "Reach pinnacle at Khardungla - one of highest motorable passes. Descend into breathtaking Nubra Valley. Sunset camel safari on unique Double-Humped Bactrian Camels amidst white sand dunes of Hundar.",
            highlights: [
              "Khardungla Pass conquest",
              "3rd highest motorable pass",
              "Nubra Valley descent",
              "Hundar sand dunes",
              "Bactrian camel safari",
              "Sunset dune experience",
            ],
            transfer: {
              type: "Group Extreme Pass Ride",
              vehicle: "Royal Enfield with Support Team",
              from: "Leh",
              to: "Hundar, Nubra Valley",
              stops: 1,
            },
            stay: {
              name: "Camp/Resort in Hundar",
              stars: 3,
              checkIn: "4:00 PM",
              checkOut: "9:00 AM",
              nights: 2,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F47658ef78ca64a43820e2da750796eb1?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 6,
            title: "The Hidden Gem of Turtuk (170 km Round, 6-7 Hours)",
            location: "Hundar",
            description:
              "Ride to the edge of the border to Turtuk - culturally distinct village that was part of Pakistan until 1971. Explore apricot orchards and towering Maitreya Buddha statue at Diskit Monastery.",
            highlights: [
              "Turtuk village border location",
              "Balti culture discovery",
              "Indo-Pak border proximity",
              "Diskit Monastery visit",
              "Maitreya Buddha statue",
              "Apricot orchards",
            ],
            transfer: {
              type: "Group Border Ride",
              vehicle: "Royal Enfield with Support Team",
              from: "Hundar",
              to: "Turtuk & Diskit",
              stops: 2,
            },
            stay: {
              name: "Camp/Resort in Hundar",
              stars: 3,
              checkIn: "Check-in",
              checkOut: "Check-out",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F47658ef78ca64a43820e2da750796eb1?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 7,
            title: "The Blue Jewel of the Himalayas (180 km, 6-7 Hours)",
            location: "Pangong Lake",
            description:
              "Ride along turquoise Shyok River through wild Changthang plateau. Arrive at legendary Pangong Lake - watch water change from cerulean to emerald as sun sets over India-Tibet border.",
            highlights: [
              "Shyok River scenic route",
              "Changthang plateau riding",
              "Pangong Lake arrival",
              "Color-changing waters",
              "Cerulean to emerald transition",
              "India-Tibet border views",
            ],
            transfer: {
              type: "Group Scenic Ride",
              vehicle: "Royal Enfield with Support Team",
              from: "Hundar",
              to: "Pangong Lake",
              stops: 2,
            },
            stay: {
              name: "Camps near Pangong Lake",
              stars: 3,
              checkIn: "5:00 PM",
              checkOut: "8:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Ff76b596747e94053acd198cc33778947?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 8,
            title: "The Borderlands of Hanle (315 km, 7-8 Hours)",
            location: "Hanle",
            description:
              "Raw, off-road experience along Indo-China border. Visit Rezang La War Memorial honoring brave soldiers of 1962. Hanle offers clearest night skies in India with unparalleled stargazing opportunities.",
            highlights: [
              "Chushul route riding",
              "Rezang La War Memorial",
              "Brave soldiers honor",
              "Hanle remote arrival",
              "Ancient monastery visit",
              "Clearest night skies",
              "Milky Way observation",
            ],
            transfer: {
              type: "Group Off-Road Expedition",
              vehicle: "Royal Enfield with Support Team",
              from: "Pangong Lake",
              to: "Hanle",
              stops: 2,
            },
            stay: {
              name: "Hanle Cottage or Hotel",
              stars: 3,
              checkIn: "5:00 PM",
              checkOut: "8:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F6aa9bceb5e4e4bf1a1120e5849eac001?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F6c0a2d2f6a09420487f7587f45a690a4?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F62d477c404d34375942af51d268da4f2?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 9,
            title: "Touching the Sky at MigLa (140 km, 5-6 Hours)",
            location: "Hanle",
            description:
              "Exhilarating climb to MigLa Pass offering panoramic views of Tibetan plateau. Visit Indian Astronomical Observatory - one of world's highest sites for optical, infrared, and gamma-ray telescopes.",
            highlights: [
              "MigLa Pass climbing",
              "High-altitude achievement",
              "Tibetan plateau views",
              "Observatory visit",
              "Highest telescope site",
              "Scientific landmark",
            ],
            transfer: {
              type: "Group Peak Ride",
              vehicle: "Royal Enfield with Support Team",
              from: "Hanle",
              to: "MigLa Pass & return",
              stops: 1,
            },
            stay: {
              name: "Hanle Homestay",
              stars: 2,
              checkIn: "Check-in",
              checkOut: "Check-out",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F6c0a2d2f6a09420487f7587f45a690a4?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F6aa9bceb5e4e4bf1a1120e5849eac001?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F62d477c404d34375942af51d268da4f2?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 10,
            title: "The Monastery Trail (250 km, 8-9 Hours)",
            location: "Leh",
            description:
              "Follow Indus River back towards civilization dotted with iconic spiritual sites. Explore Potala-like architecture of Thiksey Monastery and innovative SECMOL campus inspired by 3 Idiots movie.",
            highlights: [
              "Nyoma passage",
              "Chumathang exploration",
              "Upshi gorge riding",
              "Indus River following",
              "Thiksey Monastery visit",
              "SECMOL campus",
              "3 Idiots movie location",
              "Leh Market return",
            ],
            transfer: {
              type: "Group Spiritual Route",
              vehicle: "Royal Enfield with Support Team",
              from: "Hanle",
              to: "Hotel in Leh",
              stops: 4,
            },
            stay: {
              name: "Hotel in Leh",
              stars: 3,
              checkIn: "4:00 PM",
              checkOut: "8:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F3a22643d47bc4479a35eddf47bd6058d?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 11,
            title: "The High Altitude Plains (250 km, 8-10 Hours)",
            location: "Sarchu",
            description:
              "Traverse vast, flat More Plains before tackling Twin Passes of Lachungla and Nakaela. Experience sheer isolation and grandeur of high-altitude plateau with endless mountain vistas.",
            highlights: [
              "Tanglang La Pass crossing",
              "More Plains traverse",
              "Twin Passes experience",
              "Lachungla Pass",
              "Nakaela Pass",
              "High-altitude plateau beauty",
              "Mountain isolation",
            ],
            transfer: {
              type: "Group High-Plateau Ride",
              vehicle: "Royal Enfield with Support Team",
              from: "Leh",
              to: "Sarchu",
              stops: 2,
            },
            stay: {
              name: "Camp in Sarchu",
              stars: 3,
              checkIn: "5:00 PM",
              checkOut: "7:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F47658ef78ca64a43820e2da750796eb1?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 12,
            title: "Through the Engineering Marvel (230 km, 6-7 Hours)",
            location: "Manali",
            description:
              "Cross treacherous Baralacha La and ride past emerald waters of Deepak Taal. The Atal Tunnel whisks you from barren cold desert to lush green Beas Valley. Celebrate completion of Great Loop entering pine-scented air of Manali.",
            highlights: [
              "Baralacha La Pass",
              "Deepak Taal emerald waters",
              "Atal Tunnel engineering marvel",
              "Cold desert to green valley transition",
              "Beas River valley",
              "Great Loop completion",
              "Manali arrival",
            ],
            transfer: {
              type: "Group Engineering Marvel Route",
              vehicle: "Royal Enfield with Support Team",
              from: "Sarchu",
              to: "Manali",
              stops: 3,
            },
            stay: {
              name: "Hotel in Manali",
              stars: 3,
              checkIn: "4:00 PM",
              checkOut: "8:00 AM",
              nights: 1,
              images: [
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F3a22643d47bc4479a35eddf47bd6058d?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2F4f8eae77624a4774856347e842dec48f?format=webp&width=800&height=1200",
                "https://cdn.builder.io/api/v1/image/assets%2Fb27f3e410ea149ba93fc486c96b7b7ff%2Fc8575a3dfc914c35b71d0851ddddef8f?format=webp&width=800&height=1200",
              ],
            },
          },
          {
            day: 13,
            title: "The Final Descent (270 km, 6-7 Hours)",
            description:
              "Scenic ride following Beas River. Wind down through hills of Himachal Pradesh back to plains. Reflect on 1,500+ km journey over final roadside chai before reaching Chandigarh, concluding your Himalayan odyssey.",
            highlights: [
              "Beas River following",
              "Kullu valley passage",
              "Aut Tunnel crossing",
              "Mandi exploration",
              "Kiratpur Sahib passage",
              "Final descent",
              "Journey reflection",
              "Chandigarh return",
            ],
            transfer: {
              type: "Group Final Ride",
              vehicle: "Royal Enfield with Support Team",
              from: "Manali",
              to: "Chandigarh",
              stops: 4,
            },
          },
        ],
        inclusions: [
          "12 nights accommodation dual/triple sharing (1 Night in Jammu, 1 Night in Srinagar, 1 Night in Kargil, 2 Night in Leh, 2 Night in Nubra Valley, 1 Night in Pangong, 2 Night in Hanle, 1 Night in Sarchu, 1 Night in Manali)",
          "24 Meals (Day 2nd to Day 13th Breakfast, Day 1st to Day 12th Dinner)",
          "Sightseeing (for complete trip as per itinerary)",
          "First-Aid kit for emergency",
          "Oxygen cylinder (1)",
          "Marshall",
          "Mechanic cum Sweep Rider (From Srinagar to Manali)",
          "Motorbike (RE Classic 350, RE Himalayan 411 & 452) if opted",
          "Backup Vehicle (throughout the trip)",
          "All inner line permits",
          "Bonfire & Music",
        ],
        exclusions: [
          "Any food or beverage expenses not covered in the package",
          "Any additional costs incurred due to natural calamities or unforeseen circumstances beyond our control",
          "Any other expense not mentioned in the inclusion column",
          "Fuel (for Motorbike)",
          "Motorbike",
          "GST 5%",
        ],
        bikes: [
          {
            id: "himalayan-452",
            name: "Royal Enfield Himalayan 452",
            description: "Premium adventure bike. Maximum power and capabilities.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fefb8a20ed2eb4fb5b67c675a044988d4%2Fc9aec4380fa04f2b8857068d6a997558?format=webp&width=800&height=1200",
            priceMultiplier: 1.35,
            cc: "452cc",
            features: ["Maximum power", "Advanced suspension", "Best for experts", "Handles all terrains"],
            seatingPrices: {
              solo: 73499,
              "dual-sharing": 50599,
              "seat-in-backup": 27999,
            },
          },
          {
            id: "himalayan-411",
            name: "Royal Enfield Himalayan 411",
            description: "Mid-range adventure bike. Great balance of power and comfort.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fe9a55513d7574416bb75353f3cc4131d%2F02706d30f1124e2ba7f98c9fd36e6894?format=webp&width=800&height=1200",
            priceMultiplier: 1.15,
            cc: "411cc",
            features: ["Better ground clearance", "Improved suspension", "More powerful engine", "Ideal for rough terrain"],
            seatingPrices: {
              solo: 55199,
              "dual-sharing": 41499,
              "seat-in-backup": 27999,
            },
          },
          {
            id: "classic-350",
            name: "Royal Enfield Classic 350",
            description: "Perfect for beginners. Smooth, lightweight, and easy to handle.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fefb8a20ed2eb4fb5b67c675a044988d4%2F3ce46e66d9b648498cebe69aaf9f207e?format=webp&width=800&height=1200",
            priceMultiplier: 1.0,
            cc: "350cc",
            features: ["Best for beginners", "Comfortable seating", "Excellent fuel efficiency", "Classic design"],
            seatingPrices: {
              solo: 52899,
              "dual-sharing": 40399,
              "seat-in-backup": 27999,
            },
          },
          {
            id: "seat-in-backup",
            name: "Seat in Backup",
            description: "Travel comfortably in a backup support vehicle.",
            image: "https://cdn.builder.io/api/v1/image/assets%2Fc5bcaa71489e4444b44e4bf32a26a570%2F03651deabdd94bccaee077d99e2caed7?format=webp&width=800&height=1200",
            isBackupVehicle: true,
            features: ["Comfortable seating", "Support vehicle", "Scenic viewing"],
            seatingPrices: {
              solo: 27499,
              "dual-sharing": 27499,
              "seat-in-backup": 27499,
            },
          },
        ],
        availableDates: [
          "2026-05-30",
          "2026-06-13", "2026-06-27",
          "2026-07-11", "2026-07-25",
          "2026-09-19",
        ],
      },
    ],
  },
  {
    slug: "tawang",
    name: "Tawang",
    region: "India",
    tagline: "Snow passes and sacred gompas",
    summary:
      "Explore Tawang's high-altitude monasteries, pristine passes, and traditional village life on a curated cultural circuit.",
    heroImage:
      "https://images.unsplash.com/photo-1558180079-7f0f7180a5ec?auto=format&fit=crop&w=1600&q=80",
    icon: "landmark",
    quickFacts: {
      bestTime: "October – April",
      startPoint: "Guwahati Airport",
      travelStyle: "Culture & monastery hopping",
    },
    packages: [
      {
        slug: "sacred-peaks-circuit",
        name: "Mystic Tawang",
        duration: "9 days · 8 nights",
        description:
          "Visit Tawang Monastery, cross Sela Pass, and experience local rituals with veteran cultural experts.",
        price: "₹46,700",
        rating: 4.8,
        reviews: 221,
        highlights: [
          "Sunrise at Tawang Gompa",
          "Sela Pass snow play",
          "Local monastery homestay",
          "Guided cultural interactions",
        ],
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F0c9f08f02c764866969402fd835478cb%2Faf28aeeed9944bfca81a00b8cdcdd8fb?format=webp&width=1600&height=2400",
        categories: ["Mountain", "Adventure"],
      },
    ],
  },
  {
    slug: "bhutan",
    name: "Bhutan",
    region: "Bhutan",
    tagline: "Dzongs, festivals, and Himalayan valleys",
    summary:
      "Discover Bhutan's fortress monasteries, colorful festivals, and serene valleys with local cultural guides.",
    heroImage:
      "https://images.unsplash.com/photo-1559112094-4137e19ff3a5?auto=format&fit=crop&w=1600&q=80",
    icon: "landmark",
    badge: "New",
    quickFacts: {
      bestTime: "October – April",
      startPoint: "Paro Airport",
      travelStyle: "Culture & festival experiences",
    },
    packages: [
      {
        slug: "bhutan-festive-escape",
        name: "Monk Trails",
        duration: "7 days · 6 nights",
        description:
          "Cheer for masked dancers, taste farmhouse feasts, and hike to hidden cliffside shrines across Western Bhutan.",
        price: "₹40,400",
        rating: 4.7,
        reviews: 189,
        highlights: [
          "Festival front-row seating",
          "Dzong architecture walk",
          "Farm-to-table dinners",
          "Dochula 108 chortens visit",
        ],
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F0c9f08f02c764866969402fd835478cb%2Fd0879b3f63dc4393ab28eb025eac97e7?format=webp&width=1600&height=2400",
        categories: ["Luxury", "Adventure", "Four-wheeler"],
      },
    ],
  },
  {
    slug: "meghalaya",
    name: "Meghalaya",
    region: "India",
    tagline: "Living root bridges and misty canyons",
    summary:
      "Meander through cloud forests, discover subterranean rivers, and unwind in the cleanest village in Asia.",
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    icon: "waves",
    quickFacts: {
      bestTime: "September – May",
      startPoint: "Shillong Airport",
      travelStyle: "Nature trails & soft adventure",
    },
    packages: [
      {
        slug: "azure-lagoons-trail",
        name: "Azure Lagoons Trail",
        duration: "6 days · 5 nights",
        description:
          "Kayak on Umngot, trek double-decker bridges, and chase waterfalls in the Laitkynsew region.",
        price: "₹24,500",
        rating: 4.7,
        reviews: 264,
        highlights: [
          "Clear-water boating at Dawki",
          "Living root bridge trek",
          "Caving at Mawsmai",
          "Campfire storytelling nights",
        ],
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F4a4b23c4a4604f318cabea6540b9b38b%2F36318bde1826458f8c22a7003aedd265?format=webp&width=1600&height=2400",
        categories: ["Beach", "Adventure", "Four-wheeler"],
      },
      {
        slug: "khasi-highlands-retreat",
        name: "Khasi Highlands Retreat",
        duration: "5 days · 4 nights",
        description:
          "A relaxed escape featuring Mawlynnong village walk, eco-resort stays, and Khasi culinary workshops.",
        price: "₹21,600",
        rating: 4.6,
        reviews: 198,
        highlights: [
          "Mawphlang sacred grove",
          "Traditional Khasi lunch",
          "Eco-resort stays",
          "Sunset at Laitlum canyon",
        ],
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F4a4b23c4a4604f318cabea6540b9b38b%2F107c2ff1e4bf414fa214bc78eaab88c0?format=webp&width=1600&height=2400",
        categories: ["Beach", "Luxury", "Four-wheeler"],
      },
    ],
  },
  {
    slug: "nepal",
    name: "Nepal",
    region: "Nepal",
    tagline: "Stupas, sherpas, and panoramic peaks",
    summary:
      "Circle Kathmandu's heritage squares, fly past Everest, and trek through rhododendron forests alive with birdsong.",
    heroImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
    icon: "flag",
    badge: "Classic",
    quickFacts: {
      bestTime: "March – May · Oct – Nov",
      startPoint: "Kathmandu Airport",
      travelStyle: "Trekking & culture",
    },
    packages: [
      {
        slug: "everest-panorama-trek",
        name: "Everest Panorama Trek",
        duration: "9 days · 8 nights",
        description:
          "Scenic trek to Tengboche monastery with Everest flight experience and sherpa-guided trails.",
        price: "₹55,800",
        rating: 4.9,
        reviews: 356,
        highlights: [
          "Everest mountain flight",
          "Sherpa village homestays",
          "Tengboche monastery visit",
          "Kala Patthar viewpoint",
        ],
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F4a4b23c4a4604f318cabea6540b9b38b%2F9f419557f45e49b18a9a1af4d0db408e?format=webp&width=1600&height=2400",
        categories: ["Mountain", "Adventure", "Four-wheeler"],
      },
      {
        slug: "kathmandu-heritage-chitwan",
        name: "Kathmandu Heritage & Chitwan",
        duration: "7 days · 6 nights",
        description:
          "Blend UNESCO heritage walks with wildlife safaris in Chitwan National Park and Tharu cultural nights.",
        price: "₹37,900",
        rating: 4.7,
        reviews: 284,
        highlights: [
          "Patan & Bhaktapur tours",
          "Jungle jeep safari",
          "Tharu stick dance evening",
          "Phewa Lake boating",
        ],
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F4a4b23c4a4604f318cabea6540b9b38b%2F3ba47243a6834d3eade8da3e45996207?format=webp&width=1600&height=2400",
        categories: ["City", "Adventure", "Four-wheeler"],
      },
    ],
  },
  {
    slug: "zanskar",
    name: "Zanskar",
    region: "India",
    tagline: "Frozen rivers and remote monasteries",
    summary:
      "Journey to Zanskar's cliff-hung gompas, raft sapphire rivers, and brave the legendary Chadar trail.",
    heroImage:
      "https://images.unsplash.com/photo-1512238701577-f182d9ef8af7?auto=format&fit=crop&w=1600&q=80",
    icon: "mountainSnow",
    quickFacts: {
      bestTime: "July – September",
      startPoint: "Kargil",
      travelStyle: "Remote expeditions",
    },
    packages: [
      {
        slug: "zanskar-river-rafting-quest",
        name: "Wild Zanskar",
        duration: "8 days · 7 nights",
        description:
          "Navigate Class III rapids, camp beside gorges, and explore Phuktal monastery tucked within a cave.",
        price: "₹44,600",
        rating: 4.8,
        reviews: 178,
        highlights: [
          "Expert rafting guides",
          "Clifftop monastery visits",
          "Riverside glamping",
          "Bonfire astronomy sessions",
        ],
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F0c9f08f02c764866969402fd835478cb%2F5eb306acdcb041aaa622522f123ba2e8?format=webp&width=1600&height=2400",
        categories: ["Mountain", "Adventure"],
      },
      {
        slug: "chadar-frozen-river-trek",
        name: "Chadar Frozen River Trek",
        duration: "9 days · 8 nights",
        description:
          "Walk over frozen Zanskar River, learn ice survival skills, and share stories with Zanskari porters.",
        price: "₹48,900",
        rating: 4.9,
        reviews: 246,
        highlights: [
          "Ice walking gear kit",
          "Warm dining domes",
          "Cultural evening at Nerak",
          "Certified mountain guides",
        ],
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F3005cb3e673a454989d4f95fc852f4e9%2Ff41b9a57ee954f3098ff1c1aefa34d0b?format=webp&width=1600&height=2400",
        categories: ["Mountain", "Adventure"],
      },
    ],
  },
];

export const destinationIconMap: Record<DestinationIcon, LucideIcon> = {
  mountain: Mountain,
  landmark: Landmark,
  waves: Waves,
  flag: Flag,
  mountainSnow: MountainSnow,
};

export const getDestinationBySlug = (slug: string) =>
  destinations.find((destination) => destination.slug === slug);

export const getPackageBySlug = (destinationSlug: string, packageSlug: string) => {
  const destination = getDestinationBySlug(destinationSlug);
  if (!destination) {
    return undefined;
  }

  return destination.packages.find((travelPackage) => travelPackage.slug === packageSlug);
};

// Category icon mapping
export const categoryIconMap: Record<string, string> = {
  "All": "🌍",
  "Adventure": "🧗",
  "Mountain": "⛰️",
  "Beach": "🏖️",
  "City": "🏙️",
  "Luxury": "✨",
  "Two-wheeler": "🏍️",
  "Four-wheeler": "🚙",
};

// Extract unique categories from all packages
export const getAvailableCategories = (): string[] => {
  const categoriesSet = new Set<string>();
  destinations.forEach((destination) => {
    destination.packages.forEach((pkg) => {
      pkg.categories?.forEach((cat) => {
        categoriesSet.add(cat);
      });
    });
  });
  // Return sorted categories
  return ["All", ...Array.from(categoriesSet).sort()];
};

// Get count of packages for each category
export const getCategoryPackageCounts = (): Record<string, number> => {
  const counts: Record<string, number> = {};
  let totalCount = 0;

  destinations.forEach((destination) => {
    destination.packages.forEach((pkg) => {
      totalCount++;
      pkg.categories?.forEach((cat) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
  });

  counts["All"] = totalCount;
  return counts;
};

export const findPackageAcrossDestinations = (packageSlug: string) => {
  for (const destination of destinations) {
    const travelPackage = destination.packages.find((item) => item.slug === packageSlug);
    if (travelPackage) {
      return {
        destination,
        travelPackage,
      };
    }
  }

  return undefined;
};
