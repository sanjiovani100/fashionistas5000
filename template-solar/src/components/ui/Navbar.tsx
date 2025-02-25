"use client"

import { siteConfig } from "@/app/siteConfig"
import useScroll from "@/lib/useScroll"
import { cx } from "@/lib/utils"
import Link from "next/link"
import React from "react"
import { FashionistasLogo } from "../../../public/FashionistasLogo"
import { Button } from "../Button"

export function NavBar() {
  const [open, setOpen] = React.useState(false)
  const scrolled = useScroll(15)

  return (
    <header
      className={cx(
        "fixed inset-x-4 top-4 z-50 mx-auto flex max-w-6xl justify-center rounded-lg border border-transparent px-3 py-3 transition duration-300",
        scrolled || open
          ? "border-gray-200/50 bg-white/80 shadow-2xl shadow-black/5 backdrop-blur-sm"
          : "bg-white/0",
      )}
    >
      <div className="w-full md:my-auto">
        <div className="relative flex items-center justify-between">
          <Link href={siteConfig.baseLinks.home} aria-label="Home">
            <span className="sr-only">Fashionistas Logo</span>
            <FashionistasLogo className="w-22" />
          </Link>
          <nav className="hidden sm:block md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:transform">
            <div className="flex items-center gap-10 font-medium">
              <Link className="px-2 py-1 text-gray-900" href="#events">
                Events
              </Link>
              <Link className="px-2 py-1 text-gray-900" href="#designers">
                Designers
              </Link>
              <Link className="px-2 py-1 text-gray-900" href="#models">
                Models
              </Link>
              <Link className="px-2 py-1 text-gray-900" href="#sponsors">
                Sponsors
              </Link>
              <Link className="px-2 py-1 text-gray-900" href="#venues">
                Venues
              </Link>
            </div>
          </nav>
          <Button className="hidden h-10 font-semibold sm:block">
            Sign Up
          </Button>
          <button
            onClick={() => setOpen(!open)}
            className="p-1.5 rounded-sm border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 sm:hidden"
            aria-label={open ? "Close Navigation Menu" : "Open Navigation Menu"}
          >
            {!open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 shrink-0 text-gray-900"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 shrink-0 text-gray-900"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 10.586L16.95 5.636L18.364 7.05L13.414 12L18.364 16.95L16.95 18.364L12 13.414L7.05 18.364L5.636 16.95L10.586 12L5.636 7.05L7.05 5.636L12 10.586Z" />
              </svg>
            )}
          </button>
        </div>
        <nav
          className={cx(
            "mt-6 flex flex-col gap-6 text-lg ease-in-out will-change-transform sm:hidden",
            open ? "" : "hidden",
          )}
        >
          <ul className="space-y-4 font-medium">
            <li onClick={() => setOpen(false)}>
              <Link href="#events">Events</Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href="#designers">Designers</Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href="#models">Models</Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href="#sponsors">Sponsors</Link>
            </li>
            <li onClick={() => setOpen(false)}>
              <Link href="#venues">Venues</Link>
            </li>
          </ul>
          <Button className="text-lg">
            Sign Up
          </Button>
        </nav>
      </div>
    </header>
  )
}
