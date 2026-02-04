import { PlatformInterface as Platform } from "@/interfaces/platform.interfaces";
import { LinkItem, ProfileInfo, TemplateConfig } from "@/interfaces/template.interface";
import {ImageIcon, PencilLineIcon, MapPinIcon} from "lucide-react";

export const sidebarNav = [
    {
        title: "Links",
        url: "/dashboard",
        icon: "/icons/link.svg"
    },
    {
        title: "Appearance",
        url: "/dashboard/appearance",
        icon: "/assets/icons/dashboard/appearance.svg",
    },
    {
        title: "Analytics",
        url: "/dashboard/statistics",
        icon: "/assets/icons/dashboard/statistics.svg",
    },
    {
        title: "Store",
        url: "/dashboard/store",
        icon: "/assets/icons/dashboard/store.svg",
    }
]

export const navLinks = [
    { label: "Template", href: "/template" },
    { label: "Store", href: "/store" },
    // { label: "Pricing", href: "/pricing" },
    { label: "Contact Us", href: "/contact-us" },
];

export const socialLinks = [
    { alt: "linkedin", src: "/icons/linkedin.svg", url: "https://www.linkedin.com/company/abio-profile" },
    { alt: "instagram", src: "/icons/instagram.svg", url: "https://www.instagram.com/abio_profile" },
    { alt: "tiktok", src: "/icons/tiktok.svg", url: "https://www.tiktok.com/@abio_profile" },
    { alt: "facebook", src: "/icons/facebook.svg", url: "https://www.facebook.com/abio_profile" },
];

export const testimonials = [
    {
        name: "Rea Thompson",
        role: "Influencer",
        quote:
            "Professional, responsive, and a total game-changer! A.bio has leveled up how I reach my fans and monetize my brand.",
        image: "/icons/avatar-1.svg",
    },
    {
        name: "Wole Shina",
        role: "Social Media enthusiast",
        quote:
            "My busy schedule needs simple tools. A.bio gives me total control and rich analytics in just a few clicks!",
        image: "/icons/avatar-2.svg",
    },
    {
        name: "Fehintun Mide",
        role: "Influencer",
        quote:
            "After switching to A.bio, my audience grew, and I could finally track what works best.",
        image: "/icons/avatar-3.svg",
    },
    {
        name: "Philip Jones",
        role: "Model",
        quote:
            "Professional, responsive, and a total game-changer! A.bio has leveled up how I reach my fans and monetize my brand.",
        image: "/icons/avatar-4.svg",
    },
];

export const offers = [
    // {
    //     plan: "₦55,000",
    //     description: "Start free. Upgrade anytime.",
    //     type: "Free",
    //     action: "handleButton1",
    //     benefits: [
    //         "1 Smart Profile Page.",
    //         "Access to basic templates.",
    //         "Add your bio, profile image & social links",
    //         "Basic design themes (limited)",
    //         "QR code generator",
    //         "Basic analytics (visits & clicks)",
    //         "Community Support"
    //     ]
    // },
    {
        plan: "Free",
        description: "Start free. Upgrade anytime.",
        type: "Free",
        benefits: [
            "1 Smart Profile Page.",
            "Access to basic templates.",
            "Add your bio, profile image & social links",
            "Basic design themes (limited)",
            "QR code generator",
            "Basic analytics (visits & clicks)",
            "Community Support",
            "Add up to 5 extra external links",
            "Advanced analytics (CTR, devices, traffic sources).",
            "Priority customer support.",
            // "One Branded NFC card included (standard design).",
            "Custom Analytics dashboard.",
            "Dedicated Support Manager",
            // "Premium NFC Card Included (Custom design with your logo/ colors).",
            "Full design customization (fonts, backgrounds, themes."
        ]
    },
    // {
    //     plan: "₦35,000",
    //     description: "Best if you’re building a real online presence. Everything in Lite and more",
    //     type: "Standard",
    //     action: "handleButton2",
    //     benefits: [
    //         "1 Smart Profile Page.",
    //         "Access to basic templates.",
    //         "Add your bio, profile image & social links",
    //         "Basic design themes (limited)",
    //         "QR code generator",
    //         "Basic analytics (visits & clicks)",
    //         "Community Support",
    //         "Add up to 5 extra external links",
    //         "Advanced analytics (CTR, devices, traffic sources).",
    //         "Priority customer support.",
    //         "One Branded NFC card included (standard design)."
    //     ]
    // }
];

export const PLATFORMS: Platform[] = [
    { id: "youtube", name: "YouTube", icon: "/assets/icons/youtube.svg" },
    { id: "tiktok", name: "Tiktok", icon: "/assets/icons/tiktok.svg" },
    { id: "instagram", name: "Instagram", icon: "/assets/icons/instagram.svg" },
    { id: "snapchat", name: "Snapchat", icon: "/assets/icons/snapchat.svg" },
    { id: "facebook", name: "Facebook", icon: "/assets/icons/facebook.svg" },
    { id: "pinterest", name: "Pinterest", icon: "/assets/icons/pinterest.svg" },
    { id: "whatsapp", name: "WhatsApp", icon: "/assets/icons/whatsapp.svg" },
    { id: "telegram", name: "Telegram", icon: "/assets/icons/telegram.svg" },
    { id: "linkedin", name: "LinkedIn", icon: "/assets/icons/linkedin.svg" },
]

// Sample profile for templates
const defaultProfile: ProfileInfo = {
    name: "Mary Godwin",
    username: "Mayeetee",
    bio: "Unleashing creativity, one link at a time.",
    avatar: "/icons/osh.svg",
    location: "Embu, Kenya"
}

// Sample links for templates
const defaultLinks: LinkItem[] = [
    { text: "Instagram", url: "#" },
    { text: "Behance", url: "#" },
    { text: "Snapchat", url: "#" },
    { text: "Twitter", url: "#" },
    { text: "My Portfolio", url: "#" },
]

export const templates: TemplateConfig[] = [
    {
        id: "minimal-pink",
        name: "Minimal Pink",
        profile: defaultProfile,
        links: defaultLinks,
        style: {
            textColor: "#333333",
            buttonColor: "#ffffff",
            buttonTextColor: "#333333",
            accentColor: "#ff6b8b",
            fontFamily: "'Inter', sans-serif",
            buttonStyle: "pill",
            buttonBorder: false,
            buttonEffect: "flat",
            backgroundImage: "url('/images/template-image.svg')",
        },
    },
    // {
    //     id: "dark-gold-3d",
    //     name: "Dark Gold 3D",
    //     profile: defaultProfile,
    //     links: defaultLinks,
    //     style: {
    //         backgroundColor: "#121212",
    //         textColor: "#ffffff",
    //         buttonColor: "#1a1a1a",
    //         buttonTextColor: "#ffd700",
    //         accentColor: "#ffd700",
    //         fontFamily: "'Playfair Display', serif",
    //         buttonStyle: "pill",
    //         buttonBorder: false,
    //         buttonEffect: "3d",
    //         backgroundImage: "url('/images/template-image-2.svg')",
    //         // overlay: true,
    //     },
    // },
    // {
    //     id: "earthy-brown-shadow",
    //     name: "Earthy Brown Shadow",
    //     profile: defaultProfile,
    //     links: defaultLinks,
    //     style: {
    //         backgroundColor: "#f5f5f5",
    //         textColor: "#333333",
    //         buttonColor: "#959595",
    //         buttonTextColor: "#fffffe",
    //         accentColor: "#777777",
    //         fontFamily: "'Roboto Mono', monospace",
    //         buttonStyle: "square",
    //         buttonBorder: true,
    //         buttonEffect: "minimal",
    //         backgroundImage: "url('/images/template-image-3.svg')",
    //     },
    // },
]
export const dropdownLinks = [
  { label: "Edit Image", action: "editImage", icon: ImageIcon },
  { label: "Edit Name and Bio", action: "editBio", icon: PencilLineIcon },
  { label: "Location", action: "editLocation", icon: MapPinIcon },
];  

export const MENU = {
  "DON JULIO": [
    { name: "Don Julio Blanco", price: "₦600,000" },
    { name: "Don Julio Respasado", price: "₦600,000" },
    { name: "Don Julio 1942", price: "₦1,300,000" },
    { name: "Don Julio 1942 Magnum", price: "₦2,600,000" },
  ],
  "TEQUILA": [
    { name: "Volcan XA", price: "₦1,000,000" },
    { name: "Clase Azul", price: "₦1,300,000" },
    { name: "Clase Azul Magnum", price: "₦2,500,000" },
    { name: "Clase Mescal Green", price: "₦2,600,000" },
    { name: "Clase Azul Mescal Gold", price: "₦2,400,000" },
    { name: "Clase Azul Mescal", price: "₦2,300,000" },
    { name: "Clase Azul Anejo", price: "₦2,600,000" },
    { name: "Casamigo 75CL", price: "₦800,000" },
    { name: "Casamigo 1LTR", price: "₦900,000" },
    { name: "Casamigo Magnum", price: "₦2,500,000" },
    { name: "Komos Rosa", price: "₦700,000" },
    { name: "Komos Resavo", price: "₦1,350,000" },
    { name: "Olmeca Gold", price: "₦100,000" },
  ],

  "COGNAC": [
    { name: "Martell Blue Swift", price: "₦350,000" },
    { name: "Martell XO", price: "₦1,000,000" },
    { name: "Martell XXO", price: "₦1,400,000" },
    { name: "Hennessy VSOP", price: "₦350,000" },
    { name: "Hennessy XO", price: "₦1,100,000" },
    { name: "Hennessy Paradis", price: "₦5,000,000" },
    { name: "Remy VSOP", price: "₦350,000" },
    { name: "Remy Martin 1738", price: "₦360,000" },
    { name: "Remy Martin XO", price: "₦1,000,000" },
    { name: "Remy Martin Louis XIII", price: "₦12,500,000" },
  ],

  "ROSE CHAMPAGNE": [
    { name: "Veuve Clicquot Rosé", price: "₦350,000" },
    { name: "Moët Brut", price: "₦300,000" },
    { name: "Veuve Brut", price: "₦400,000" },
    { name: "Veuve Rich", price: "₦450,000" },
    { name: "Ruinart Rosé", price: "₦450,000" },
    { name: "Laurent Perrier Rosé", price: "₦450,000" },
    { name: "Canard Duchéné", price: "₦200,000" },
  ],

  "VODKA": [
    { name: "Belvedere", price: "₦200,000" },
    { name: "Ciroc", price: "₦350,000" },
  ],

  "VINTAGE BLANCE CHAMPAIGNES": [
    { name: "Don Perignon Rosé", price: "₦1,700,000" },
    { name: "Don Perignon Brut", price: "₦1,300,000" },
    { name: "Cristal Brut 75CL", price: "₦1,300,000" },
    { name: "Cristal Rosé 75CL", price: "₦1,700,000" },
    { name: "Cristal Magnum", price: "₦2,400,000" },
    { name: "Laurent Perrier G.S", price: "₦1,300,000" },
    { name: "Ace of Spade Brut", price: "₦1,400,000" },
    { name: "Ace of Spade Rosé", price: "₦1,700,000" },
  ],

  "NON VINATGE BLANCE CHAMPAGNE": [
    { name: "GH Mumm Brut", price: "₦235,000" },
    { name: "GH Mumm Demi-Sec", price: "₦280,000" },
    { name: "Moet Brut", price: "₦300,000" },
    { name: "Moet Nectar Imperial", price: "₦350,000" },
    { name: "Moet Ice Imperial", price: "₦400,000" },
    { name: "Veuve Clicquot Brut", price: "₦400,000" },
    { name: "Veuve Clicquot Rich", price: "₦450,000" },
    { name: "Ruinart Brut", price: "₦300,000" },
    { name: "Ruinart Blanc de Blanc", price: "₦470,000" },
    { name: "Laurent Perrier La Brut", price: "₦300,000" },
    { name: "Laurent Perrier Demi-Sec", price: "₦350,000" },
  ],

  "BLENDED WHISKEY": [
    { name: "Blue Label", price: "₦1,300,000" },
    { name: "Black Label", price: "₦200,000" },
    { name: "Chivas XV", price: "₦250,000" },
    { name: "Chivas 18YRS", price: "₦300,000" },
    { name: "Chivas 25YRS", price: "₦1,100,000" },
    { name: "Hibiki Harmony", price: "₦750,000" },
  ],

  "SINGLE MALT WHISKEY": [
    { name: "Glenmorangie Signet", price: "₦800,000" },
    { name: "Glenmorangie Original", price: "₦365,000" },
    { name: "Glenfiddich 18YRS", price: "₦400,000" },
    { name: "Glenfiddich 21YRS", price: "₦1,000,000" },
    { name: "Glenfiddich 23YRS", price: "₦1,300,000" },
    { name: "Glenfiddich 26YRS", price: "₦2,600,000" },
    { name: "Glenfiddich 30YRS", price: "₦5,000,000" },
  ],

  "SOFT DRINKS": [
    { name: "Coke", price: "₦3,000" },
    { name: "Water", price: "₦3,000" },
    { name: "Soda Water", price: "₦3,500" },
    { name: "Tonic Water", price: "₦3,500" },
    { name: "Cranberry Juice", price: "₦25,000" },
    { name: "Orange Juice", price: "₦20,000" },
    { name: "Apple Juice", price: "₦20,000" },
    { name: "Small Voss/Fiji Water", price: "₦7,000" },
    { name: "Big Voss/Fiji Water", price: "₦12,000" },
  ],

  "ENERGY DRINKS": [
    { name: "Red Bull", price: "₦6,000" },
  ],
  "GIN": [
    { name: "Monkey47", price: "₦200,000" },
    { name: "Gin Mare", price: "₦200,000" },
    { name: "Hendrick", price: "₦250,000" },
  ],
  "OTHERS": [
    { name: "Cocktail", price: "₦30,000" },
    { name: "Wine", price: "₦160,000" },
    { name: "Small Vape", price: "₦120,000" },
  ],
}