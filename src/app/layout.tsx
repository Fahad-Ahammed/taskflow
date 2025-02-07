import type { Metadata } from "next";
import "@/styles/globals.css";
import { Mulish } from "next/font/google";

export const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mulish.className}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
