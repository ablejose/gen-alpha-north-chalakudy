"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScrolled } from "@/hooks/useScrolled";
import { BRAND } from "@/config/brand";

// Links are absolute (with a leading "/") so they resolve from any page,
// including the /collections/{slug} pages, not just the homepage.
const LINKS = [
  { label: "Collections", href: "/#collections" },
  { label: "About", href: "/#about" },
  { label: "Visit Store", href: "/#visit-store" },
  { label: "Contact", href: "/#contact" },
];

/**
 * Sticky navigation. Scrolled state becomes more opaque with backdrop blur and
 * reduced padding. Mobile uses a full-screen overlay menu. Uses next/link so
 * navigation (including hash targets on the homepage) works from any route.
 */
export function Navbar() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  // While the mobile menu is open, lock the page scroll so a scroll gesture
  // first dismisses the menu ("goes back"); normal scrolling resumes only
  // after the menu has closed.
  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", close, { passive: true });
    window.addEventListener("touchmove", close, { passive: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("wheel", close);
      window.removeEventListener("touchmove", close);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-lux ${
        scrolled
          ? "border-b border-border bg-background/85 py-3 backdrop-blur-md"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="container-lux flex items-center justify-between" aria-label="Primary">
        <Link href="/" className="flex items-center leading-none" aria-label={`${BRAND.businessName} home`}>
          <Image
            src={BRAND.logo}
            alt={`${BRAND.businessName} logo`}
            width={375}
            height={407}
            priority
            className="h-11 w-auto md:h-12"
          />
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-sans text-sm tracking-wide text-muted transition-colors duration-300 hover:text-ivory"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-pill border border-border text-ivory md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-lg">{open ? "\u2715" : "\u2630"}</span>
        </button>
      </nav>

      {open ? (
        <div className="fixed inset-0 top-0 z-40 flex flex-col items-center justify-center gap-10 bg-background md:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-display text-display-m text-ivory"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
