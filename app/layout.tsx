import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Serif_KR, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./lib/AuthContext";
import PageTransition from "./components/PageTransition";
import VisitorTracker from "./components/VisitorTracker";

// Font Configuration
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "주성교회 | 쉼과 회복이 있는 따뜻한 연결",
  description: "충북 청주에 위치한 기독교 대한 성결교회 주성교회입니다. 하나님의 말씀으로 세워지고 복음으로 세상을 섬기는 아름다운 공동체에 여러분을 초대합니다.",
  keywords: ["주성교회", "청주교회", "성결교회", "기독교대한성결교회", "주일예배", "청주 봉명동 교회"],
  openGraph: {
    title: "주성교회 | 쉼과 회복이 있는 따뜻한 연결",
    description: "청주 봉명동에 위치한 주성교회. 말씀과 기도로 세상을 변화시키는 믿음의 공동체입니다.",
    url: "https://jusung-church.com",
    siteName: "주성교회",
    images: [
      {
        url: "/images/og-image.jpg", // Need to ensure this exists or use a valid path
        width: 1200,
        height: 630,
        alt: "주성교회 전경",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  "name": "주성교회",
  "image": "https://jusung-church.com/images/church-building.jpg", // Placeholder
  "description": "청주 봉명동에 위치한 기독교 대한 성결교회 주성교회입니다.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "흥덕구 봉명로 219번길 24",
    "addressLocality": "청주시",
    "addressRegion": "충청북도",
    "postalCode": "28456",
    "addressCountry": "KR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 36.6424, // Approximate coordinates
    "longitude": 127.466
  },
  "url": "https://jusung-church.com",
  "telephone": "+82-43-264-1111" // Placeholder
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfair.variable} ${notoSerifKr.variable} antialiased bg-[#fafafa] selection:bg-[#8B4513]/10 selection:text-[#8B4513] font-sans`}
      >
        <AuthProvider>
          <VisitorTracker />
          <Header />
          <PageTransition>
            {children}
          </PageTransition>
          <Footer />
        </AuthProvider>
      </body>
    </html >
  );
}
