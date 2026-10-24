import { auth } from "@/auth";
import { LandingClient } from "./LandingClient";
import { NewLandingPage } from "@/components/landing/NewLandingPage";

export default async function Page(props: {
  searchParams?: Promise<{ preview?: string; new?: string }>;
}) {
  const session = await auth();
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  
  // Default to the new landing page for this preview branch
  const showOldLanding = searchParams?.preview === "old";

  if (showOldLanding) {
    return (
      <LandingClient 
        hasSession={!!session?.user} 
        userName={session?.user?.name || ""}
        userEmail={session?.user?.email || ""}
      />
    );
  }

  return <NewLandingPage />;
}
