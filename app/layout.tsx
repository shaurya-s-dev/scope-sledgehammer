import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SCOPE SLEDGEHAMMER // MVP Ticket Generator",
  description: "A brutalist AI tool that slashes bloated product ideas into prioritized MVP tickets using the Gemini API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔨</text></svg>" />
        <Script id="pendo-init" strategy="afterInteractive">
          {`(function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
          v=['initialize','identify','updateOptions','pageLoad','track'];for(w=0,x=v.length;w<x;++w)(function(m){
          o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
          y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/a96a3cfd-9610-4c28-56df-71717d576b9f/pendo.js';
          z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');

          pendo.initialize({
            visitor: {
              id: (function () {
                try {
                  var k = 'novus_visitor_id';
                  var id = localStorage.getItem(k);
                  if (!id) {
                    id = 'anon-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
                    localStorage.setItem(k, id);
                  }
                  return id;
                } catch (e) {
                  return 'anon-' + Date.now();
                }
              })()
            }
          });`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
