import thabo from "@/assets/barber-thabo.jpg";
import mike from "@/assets/barber-mike.jpg";
import ravi from "@/assets/barber-ravi.jpg";
import jayden from "@/assets/barber-jayden.jpg";

export type Service = {
  id: string;
  name: string;
  price: number;
  duration: number; // minutes
  description: string;
};

export type Barber = {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  photo: string;
  bio: string;
};

export const SHOP = {
  name: "FreshCut AI Barbershop",
  address: "112 Bree Street, Cape Town City Centre, 8001",
  phone: "+27 21 555 0142",
  email: "hello@freshcut.co.za",
  hours: [
    { day: "Monday – Friday", open: "09:00", close: "18:00" },
    { day: "Saturday", open: "08:00", close: "16:00" },
    { day: "Sunday", open: "Closed", close: "" },
  ],
  bookingRules: [
    "Bookings can be made up to 30 days ahead.",
    "Free cancellation or rescheduling up to 2 hours before your appointment.",
    "Please arrive 5 minutes early. Late arrivals over 15 minutes may need to reschedule.",
    "Payment by card, cash or SnapScan in-store.",
  ],
};

export const SERVICES: Service[] = [
  { id: "classic", name: "Classic Haircut", price: 180, duration: 30, description: "Scissor or clipper cut, wash and style." },
  { id: "skin-fade", name: "Skin Fade", price: 220, duration: 45, description: "Seamless fade down to the skin with a sharp finish." },
  { id: "low-taper", name: "Low Taper Fade", price: 200, duration: 40, description: "Subtle taper at the temples and neckline. Office-ready." },
  { id: "cut-beard", name: "Haircut + Beard", price: 280, duration: 60, description: "Any cut plus beard shape, line-up and hot towel." },
  { id: "beard", name: "Beard Trim", price: 120, duration: 20, description: "Shape, line-up and beard oil finish." },
  { id: "kids", name: "Kids Haircut", price: 130, duration: 30, description: "For under-12s. Patient barbers, sharp results." },
  { id: "premium", name: "Premium Grooming Package", price: 450, duration: 90, description: "Cut, beard, hot towel shave, facial scrub and scalp massage." },
];

export const BARBERS: Barber[] = [
  { id: "thabo", name: "Thabo Mokoena", specialty: "Skin fades & designs", experience: 9, rating: 4.9, photo: thabo, bio: "Head barber. Known for razor-sharp fades and freehand designs." },
  { id: "mike", name: "Mike van der Berg", specialty: "Classic & textured cuts", experience: 7, rating: 4.8, photo: mike, bio: "Scissor specialist with a love for textured crops and pompadours." },
  { id: "ravi", name: "Ravi Naidoo", specialty: "Beards & hot towel shaves", experience: 15, rating: 5.0, photo: ravi, bio: "Old-school craft. The man to see for a straight-razor shave." },
  { id: "jayden", name: "Jayden Adams", specialty: "Curly & coily hair", experience: 5, rating: 4.8, photo: jayden, bio: "High-tops, sponge twists and tapers for curly and coily hair." },
];

export const REVIEWS = [
  { name: "Sipho M.", text: "Booked through the site in under a minute. Thabo's skin fade is the cleanest in Cape Town.", rating: 5 },
  { name: "Daniel K.", text: "The style finder suggested a low taper and honestly it was spot on. Mike nailed it.", rating: 5 },
  { name: "Aaron P.", text: "Ravi's hot towel shave is an experience. Premium package is worth every rand.", rating: 5 },
  { name: "Luthando N.", text: "Finally a barber who understands coily hair. Jayden is the man.", rating: 4 },
];

export const getService = (id: string) => SERVICES.find((s) => s.id === id);
export const getBarber = (id: string) => BARBERS.find((b) => b.id === id);
export const formatRand = (n: number) => `R${n.toLocaleString("en-ZA")}`;
