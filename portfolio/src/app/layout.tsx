import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ilona Kuznetsova | Data Scientist",
  description:
    "Professional portfolio for Ilona Kuznetsova, a data scientist specializing in machine learning, computer vision, NLP, and applied mathematics.",
  keywords: [
    "Ilona Kuznetsova",
    "Data Scientist",
    "Machine Learning",
    "Computer Vision",
    "NLP",
    "Applied Mathematics",
    "PyTorch",
    "Python",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
