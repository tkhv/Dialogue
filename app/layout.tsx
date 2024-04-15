import { GlobalContextProvider } from "./context/authContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dialogue",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ overflow: "hidden" }}>
        <GlobalContextProvider>
          <Navbar />
          <div
            style={{
              backgroundColor: "#15181D",
              height: "100vh",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                flex: 1,
                overflow: "scroll",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                maxWidth: "70vw",
              }}
            >
              {children}
            </div>
          </div>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
