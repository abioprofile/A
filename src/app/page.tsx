import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {
  return (
    <main className="flex justify-center items-center h-screen">
      <Link href='/sign-in'>
        <Button className="max-w-40 max-h-9 rounded-md">Continue</Button>
      </Link>
    </main>
  );
}
