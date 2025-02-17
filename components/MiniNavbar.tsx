"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MiniNavbar = () => {
  const pathname = usePathname();

  const getLinkStyle = (path: string) => {
    return `cursor-pointer px-4 py-2 rounded-md transition-colors duration-200 ${
      pathname === path
        ? "bg-[#1b1b1b] text-white hover:bg[#393939]"
        : "hover:text-white text-[#929292]"
    }`;
  };

  return (
    <div className="flex justify-between p-5 gap-3">
      <Link href="/swap">
        <div className={getLinkStyle("/swap")}>Swap</div>
      </Link>
      <Link href="/send">
        <div className={getLinkStyle("/send")}>Send</div>
      </Link>
      <Link href="/airdrop">
        <div className={getLinkStyle("/airdrop")}>Airdrop</div>
      </Link>
      <Link href="/token">
        <div className={getLinkStyle("/token")}>Create Token</div>
      </Link>
    </div>
  );
};

export default MiniNavbar;
