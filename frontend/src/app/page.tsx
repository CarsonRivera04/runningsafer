export default async function MyNextFastAPIApp() {
  const role = await fetchEngineerRole('data scientist');

  if (!role) {
    return <div>Failed to load engineer role data.</div>;
  }

  return (
    <>
      <div>{`The main skill of a ${role.title} is ${role.mainskill}.`}</div>
    </>
  );
}

async function fetchEngineerRole(title: string) {
 
  const baseUrl: string = "http://localhost:3000";

  try {
    const response = await fetch(
      `${baseUrl}/api/py/engineer-roles?title=${title}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const role = await response.json();
    return role;
  } catch (error) {
    console.error("Error fetching engineer role:", error);
    return null;
  }
}