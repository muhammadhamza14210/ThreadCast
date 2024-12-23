import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const LandingPageNavBar = (props: Props) => {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="text-3xl font-semibold flex items-center gap-x-3 text-white">
        <Menu className="w-6 h-6"></Menu>
        <Image alt="logo" src="/logo.svg" width={40} height={40} />
        ThreadCast
      </div>
      <div className="hidden gap-x-10 items-center lg:flex">
        <Link
          href="/"
          className="bg-[#7320DD] py-2 px-5 rounded-full font-semibold text-lg hover:bg-[#7320DD]/80 cursor-pointer text-white"
        >
          Home
        </Link>
        <Link href="/about" className="text-white">
          Pricing
        </Link>
        <Link href="/contact" className="text-white">
          Contact
        </Link>
      </div>
      <Link href="/auth/sign-in">
        <Button className="text-base flex gap-x-2">
          <User fill="#000" />
          Login
        </Button>
      </Link>
    </div>
  );
};

export default LandingPageNavBar;
