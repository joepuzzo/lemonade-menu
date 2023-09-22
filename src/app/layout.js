"use client";
import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";
import React, { useEffect, useState } from "react";

export const AppContext = React.createContext();

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  // Check user's preferred color scheme to set the initial theme
  // const prefersDarkScheme = window.matchMedia(
  //   "(prefers-color-scheme: dark)"
  // ).matches;

  const [theme, setTheme] = useState("theme-dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "theme-dark" ? "theme-light" : "theme-dark"));
    document.querySelector("html").classList.toggle("theme-dark");
    document.querySelector("html").classList.toggle("theme-light");
  };

  return (
    <AppContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <html lang="en" className="theme-dark">
        <body className={inter.className}>
          <aside></aside>
          <div className="container">
            <header className="header sticky top-0 z-40 w-full p-5 flex flex-row pl-20 pr-20 aligh-center justify-between">
              <nav className="text-sm leading-6 font-semibold text-slate-700 dark:text-slate-200 mr-200">
                <ul className="flex space-x-8">
                  <li>
                    <Link href="/" className="nav-link p-4 rounded-sm">
                      Menu
                    </Link>
                  </li>
                  <li>
                    <Link href="/drinks" className="nav-link p-4 rounded-sm">
                      Drinks
                    </Link>
                  </li>
                </ul>
              </nav>
              <button className="emoji-button" onClick={toggleTheme}>
                {theme === "theme-dark" ? `☀️` : `🌕`}
              </button>{" "}
            </header>
            <main className="overflow-scroll flex flex-col items-center gap-4 p-5 h-full">
              {children}
            </main>
          </div>
        </body>
      </html>
    </AppContext.Provider>
  );
}
