import { getUserSession } from '@/lib/core/session';
import { redirect } from 'next/navigation';

const DashboardPage = async() => {
    const user = await getUserSession();
    // if(!user){
    //     redirect("/auth/login?redirect=/dashboard")
    // }
    redirect(`/dashboard/${user?.role}`)
};

export default DashboardPage;