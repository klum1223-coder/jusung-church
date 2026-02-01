import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Noto_Serif_KR, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./lib/AuthContext";
import PageTransition from "./components/PageTransition";
import VisitorTracker from "./components/VisitorTracker";
import SplashScreen from "./components/SplashScreen";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const notoSerifKr = Noto_Serif_KR({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600", "700", "900"], variable: "--font-noto-serif-kr", display: "swap" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "주성교회 | 쉼과 회복이 있는 따뜻한 연결",
  description: "충북 청주에 위치한 기독교 대한 성결교회 주성교회입니다. 세상을 비추는 거룩한 울림, 평안과 회복이 있는 신앙 공동체입니다.",
  keywords: ["주성교회", "청주교회", "성결교회", "기독교", "예배", "설교", "성경공부"],
  authors: [{ name: "주성교회" }],
  creator: "주성교회",
  publisher: "주성교회",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://jusung-church.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "주성교회 | Joosung Holiness Church",
    description: "세상을 비추는 거룩한 울림, 평안과 회복이 있는 신앙 공동체",
    url: "https://jusung-church.vercel.app",
    siteName: "주성교회",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "주성교회 - Joosung Holiness Church",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "주성교회 | Joosung Holiness Church",
    description: "세상을 비추는 거룩한 울림, 평안과 회복이 있는 신앙 공동체",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfair.variable} ${notoSerifKr.variable} antialiased bg-[#fafafa] font-sans`}>
        <AuthProvider>
          <SplashScreen />
          <VisitorTracker />
          <Header />
          <PageTransition>
            {children}
          </PageTransition>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

