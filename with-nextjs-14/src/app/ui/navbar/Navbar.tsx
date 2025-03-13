import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export interface NavLinkProps {
  href: string;
  text: string;
}

const Navbar = ({ links }: { links: NavLinkProps[] }) => {
  return (
    <NavigationMenu className="min-w-full  m-4">
      <NavigationMenuList>
        {links.map(({ href, text }) => (
          <NavigationMenuItem>
            <Link href={href} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {text}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
