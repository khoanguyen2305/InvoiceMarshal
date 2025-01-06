import Image from "next/image";
import Link from "next/link";
import LogoImage from "@/public/logo-songtu.png"
import { RainbowButton } from "@/components/ui/rainbow-button";

export function Navbar(){
    return (
        <div className="flex items-center justify-between py-5">
            <Link href="/" className="flex items-center gap-2">
                <Image src={LogoImage} alt="Logo Image" className="size-20"/>
                <h3 className="text-3xl font-semibold">Invoice<span className="text-blue-500">Masrshal</span></h3>
            </Link>
            <Link href="/login">
                <RainbowButton>Get Start</RainbowButton>
            </Link>
        </div>
    )
}