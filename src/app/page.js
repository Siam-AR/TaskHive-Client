import HomeHero from "@/components/HomeHero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="space-y-10">
      <Navbar />
      <div className="container mx-auto py-4 md:py-6 lg:py-1">
        <HomeHero />
      </div>
    </main>
  );
}