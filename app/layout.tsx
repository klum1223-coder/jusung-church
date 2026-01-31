import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Serif_KR, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./lib/AuthContext";
import PageTransition from "./components/PageTransition";
import VisitorTracker from "./components/VisitorTracker";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const notoSerifKr = Noto_Serif_KR({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600", "700", "900"], variable: "--font-noto-serif-kr", display: "swap" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "주성교회 | 쉼과 회복이 있는 따뜻한 연결",
  description: "충북 청주에 위치한 기독교 대한 성결교회 주성교회입니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${playfair.variable} ${notoSerifKr.variable} antialiased bg-[#fafafa] font-sans`}>
        <AuthProvider>
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
