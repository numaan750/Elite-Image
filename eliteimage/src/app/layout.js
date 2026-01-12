import { Manrope } from "next/font/google";
import "./globals.css";
import AppProvider from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import StripeWrapper from "@/components/StripeWrapper";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  // Base URL - change if your production domain is different
  metadataBase: new URL("https://elite-image-8wei.vercel.app/"),

  title: {
    default: "Elite Image — Professional Photo & Design Services",
    template: "%s | Elite Image",
  },

  description:
    "Elite Image — High-quality photo editing, retouching & design services for e-commerce, portraits and marketing. Fast turnaround, premium results.",

  keywords: [
    "photo editing",
    "image retouching",
    "product photography",
    "e-commerce images",
    "photo restoration",
    "graphic design",
    "Elite Image",
  ],

  authors: [
    { name: "Elite Image", url: "https://elite-image-8wei.vercel.app/" },
  ],
  creator: "Elite Image",
  publisher: "Elite Image",

  // Open Graph (Facebook, LinkedIn, WhatsApp previews)
  openGraph: {
    title: "Elite Image — Professional Photo & Design Services",
    description:
      "High-quality photo editing & retouching for e-commerce, portraits and marketing. Fast turnaround & premium results.",
    url: "https://elite-image-8wei.vercel.app/",
    siteName: "Elite Image",
    images: [
      {
        url: "https://elite-image-8wei.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Elite Image — Photo Editing Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter card
  twitter: {
    card: "summary_large_image",
    title: "Elite Image — Professional Photo & Design Services",
    description:
      "High-quality photo editing & retouching for e-commerce, portraits and marketing.",
    images: ["https://elite-image-8wei.vercel.app/og-image.jpg"],
    creator: "@your_twitter_handle", // replace or remove
    site: "@your_twitter_handle",
  },

  // Robots rules for crawlers
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical / alternates (for multi-language sites)
  alternates: {
    canonical: "https://elite-image-8wei.vercel.app/",
    languages: {
      "en-US": "/",
      "ur-PK": "/ur", // if you add Urdu pages
    },
  },

  // Favicons / icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // Theme colors (helps mobile browsers)
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ PRECONNECT (NETWORK WARNING FIX) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${manrope.className} antialiased`}>
        <AppProvider>
          <StripeWrapper>{children}</StripeWrapper>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />
        </AppProvider>
      </body>
    </html>
  );
}
