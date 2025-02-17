"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const MiniNavbar = () => {
  const pathname = usePathname();

  return (
    <nav className="relative flex justify-between p-5 gap-3">
      {[
        { href: "/swap", label: "Swap" },
        { href: "/send", label: "Send" },
        { href: "/airdrop", label: "Airdrop" },
        { href: "/token", label: "Create Token" },
      ].map(({ href, label }) => (
        <Link href={href} key={href} className="relative">
          <div
            className={`font-semibold text-center cursor-pointer px-4 py-2 rounded-2xl transition-colors duration-200 relative z-10 
              ${pathname === href ? "text-white" : "text-[#929292] hover:text-white"}`}
          >
            {label}
            {pathname === href && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-[#303030] rounded-2xl -z-10"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </div>
        </Link>
      ))}
    </nav>
  );
};

export default MiniNavbar;