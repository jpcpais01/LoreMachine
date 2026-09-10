import "./globals.css";

export const metadata = {
  title: "Relics Generator",
  description: "Lore & image machine for the Relics TCG",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
