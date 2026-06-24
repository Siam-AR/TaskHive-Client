import Navbar from "@/components/Navbar";
import { getHomepageData } from "@/lib/db";
import HomeHero from "@/components/HomeHero";
import LatestTasks from "@/components/LatestTasks";


function HomePage({ data }) {
  const { latestTasks } = data;

  return (
    <main className="space-y-10">
      <Navbar/>
      <div className="container mx-auto py-4 md:py-6 lg:py-1">
        <HomeHero />
        <LatestTasks tasks={latestTasks} />
      </div>
    </main>
  );
}

export default async function Home() {
  const data = await getHomepageData();
  return <HomePage data={data} />;
}
