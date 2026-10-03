import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "./SiteShell";

export const metadata: Metadata = {
  title: "Lightspark Canvas",
  description: "Draggable Lightspark hero canvas",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body><SiteShell />{children}</body>
    </html>
  );
}
