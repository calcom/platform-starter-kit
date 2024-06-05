import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function DashboardButton() {
  return (
    <Link href="/dashboard">
      <Button className="w-full">
        Dashboard
        <LogIn className="ml-1 size-4" />
      </Button>
    </Link>
  );
}
