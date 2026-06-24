import Navbar from "@/components/Navbar";
import { getHomepageData } from "@/lib/db";
import HomeHero from "@/components/HomeHero";
import LatestTasks from "@/components/LatestTasks";
import TopFreelancers from "@/components/TopFreelancers";


function HomePage({ data }) {
  const { latestTasks, topFreelancers} = data;

  return (
    <main className="space-y-10">
      <Navbar/>
      <div className="container mx-auto py-4 md:py-6 lg:py-1">
        <HomeHero />
        <LatestTasks tasks={latestTasks} />
        <TopFreelancers freelancers={topFreelancers} />
      </div>
    </main>
  );
}

export default async function Home() {
  const data = await getHomepageData();
  return <HomePage data={data} />;
}
