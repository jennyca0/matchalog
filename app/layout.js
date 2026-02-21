import "./globals.css";

export const metadata = {
  title: "MatchaLog",
  description: "Track your collection",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
