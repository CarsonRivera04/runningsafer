import { DetailedView } from "@/components/DetailedView";
export default async function Page({ searchParams }: { searchParams: Promise<{ activityId: string }> }) {
    const { activityId } = await searchParams;

  return (
    <main>
        <div>DETAILED VIEW PAGE</div>
        <div>{activityId}</div>
    </main>
  );
}