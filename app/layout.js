import "./globals.css";

export const metadata = {
  title: "Constelação Ralf",
  description: "Live constellation of Marcelo's Ralf agents",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
