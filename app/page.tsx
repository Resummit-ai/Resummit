import { auth } from "@/auth";
import { LandingClient } from "./LandingClient";
import { NewLandingPage } from "@/components/landing/NewLandingPage";

export default async function Page(props: {
  searchParams?: Promise<{ preview?: string; new?: string }>;
}) {
  const session = await auth();
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const isNewLanding =
    process.env.NEXT_PUBLIC_NEW_LANDING === "true" ||
    searchParams?.preview === "new" ||
    searchParams?.new === "true";

  if (isNewLanding) {
    return <NewLandingPage />;
  }

  return (
    <LandingClient 
      hasSession={!!session?.user} 
      userName={session?.user?.name || ""}
      userEmail={session?.user?.email || ""}
    />
  );
}
