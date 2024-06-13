import Link from "next/link";

interface LogoProps {
  href?: string;
}

export const Logo = ({ href }: LogoProps) => {
  return (
    <Link href={href ?? "/"} className="flex font-display text-2xl">
      Cal.com <span className="font-display text-sm">®</span>
    </Link>
  );
};
