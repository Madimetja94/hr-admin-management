import { getServerAuthSession } from "~/server/auth";
import { redirect } from 'next/navigation';
import MainComponent from "./_components/mainComponent";



export default async function Home() {
  const session = await getServerAuthSession();
  
   if (!session) {
     redirect("/api/auth/signin");
   }
  return (
    <div>
      <MainComponent session={session}/>
    </div>
  );
}
