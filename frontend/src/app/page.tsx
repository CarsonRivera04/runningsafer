// app/page.tsx
import { Suspense } from "react";
import { getActivityData, getCurrentUser } from "@/lib/api-client";
import { TestCard } from "@/components/testcard"
import { Header1 } from "@/components/ui/header";
import { Feature5, Feature5Loading } from "@/components/ui/feature5";
import { CTA1 } from "@/components/ui/cta1";

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

async function ActivitiesSection({
  page,
  perPage,
  name,
}: {
  page: number;
  perPage: number;
  name?: string;
}) {
  let activityData = [];

  try {
    activityData = await getActivityData(page, perPage);
  } catch (error) {
    console.error("Failed to fetch activity data:", error);
  }

  let firstname: string = "";

  if (activityData.length === 0) {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser.isAuthenticated && currentUser.user) {
        firstname = currentUser.user.firstname ?? "";
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
    return (
      <>
        <CTA1 firstname={firstname} />
      </>
    );
  }

  return (
    <>
      <Feature5 activities={activityData} page={page} perPage={perPage} name={name} />
      <div><TestCard data={activityData} /></div>
    </>
  );
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = getPageNumber(params?.page);
  const perPage = 6;
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

  return (
    <main>
      <Header1/>
      <Suspense key={page} fallback={<Feature5Loading name={name} />}>
        <ActivitiesSection page={page} perPage={perPage} name={name} />
      </Suspense>
    </main>
  );
}
