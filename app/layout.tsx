import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vine Solutions | Client Onboarding & Employee Academy",
  description:
    "A guided onboarding and employee training portal for Vine Solutions and Amazon Delivery Service Partners.",
  icons: {
    icon: "/vine-solutions-logo.png",
    shortcut: "/vine-solutions-logo.png",
  },
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
