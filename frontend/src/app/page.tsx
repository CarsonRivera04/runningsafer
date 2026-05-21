// app/page.tsx
import { getActivityData, getCurrentUser } from "@/lib/api-client";
import { TestCard } from "@/components/testcard"
import { Header1 } from "@/components/ui/header";
import { Feature5 } from "@/components/ui/feature5";

interface PageProps {
  searchParams?: Promise<{
    page?: string | string[];
  }>;
}

function getPageNumber(pageParam?: string | string[]) {
  const value = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = getPageNumber(params?.page);
  const perPage = 6;
  let activityData = [];
  let name: string | undefined;

  try {
    const currentUser = await getCurrentUser();
    if (currentUser.isAuthenticated && currentUser.user) {
      const firstName = currentUser.user.firstname ?? "";
      name = `${firstName}`.trim();
    }
  } catch (error) {
    console.error("Failed to fetch current user:", error);
  }

  try {
    activityData = await getActivityData(page, perPage); 
  } catch (error) {
    console.error("Failed to fetch activity data:", error);
  }
  

  return (
    <main>
      <Header1/>
      <Feature5 activities={activityData} page={page} perPage={perPage} name={name} />
      <div><TestCard data={activityData} /></div>
    </main>
  );
}
