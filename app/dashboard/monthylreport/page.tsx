
// app/dashboard/page.tsx (Server Component)
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/db.config';
import Report from '@/components/monthlyreports/report'; // Assuming you have a client component
import { TransactionInput } from "@/lib/validators";
import { DivideCircleIcon } from 'lucide-react';
import Link from 'next/link';



export default async function MonthlyReports() {
  // 1. Authenticate using next/headers
  console.log("inside monthlyreport page.tsx")
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session-token')?.value;

  if (!sessionToken) {
    // In Server Components, we redirect instead of sending a 401 JSON response
    redirect('/login'); 
  }
       console.log("cookie verified inside monthly report");
  // Assuming you decode the session token to get the userId. 
  // Replacing with a placeholder for demonstration:
  let curruserId: string;
  try {
     const  parsed = JSON.parse(sessionToken);
    curruserId = parsed.id;
  } 
   catch(err) {
    console.log("error in authenticating user");
    curruserId = sessionToken;
  }
  console.log("user id from cokkie got it in monthly report ");
  try {
    // 2. Fetch all reports for this user
    // Since aggregations can't be done directly in Prisma on JSON fields, we fetch the data first.
    const reports = await prisma.dailyanalyzedReport.findMany({
      where: { userId: curruserId },
      select: { date: true, transactions: true },
    });

    // Helper to format today's date as YYYY-MM-DD (matching your schema)
    const todayStr = new Date().toISOString().split('T')[0];

    // 3. Process the data in JavaScript
    let todayTransactions: TransactionInput[] = [];
    const categoryMap = new Map<string, number>();
    const monthlyMap = new Map<string, number>();

    // Iterate through all fetched reports to aggregate data
    reports.forEach((report) => {
      // Typecast the JSON to your validator type
      const txs = report.transactions as unknown as TransactionInput[];

      txs.forEach((tx) => {
        // --- A. Today's Spending ---
        if (report.date === todayStr) {
          todayTransactions.push(tx);
        }

        // --- B. Bar Graph: Category Totals ---
        const currentCategoryTotal = categoryMap.get(tx.category) || 0;
        categoryMap.set(tx.category, currentCategoryTotal + tx.amount);

        // --- C. Line Graph: Monthly Spending ---
        // Extract YYYY-MM from the date (e.g., "2023-10-05" -> "2023-10")
        const monthKey = tx.date.substring(0, 7); 
        const currentMonthTotal = monthlyMap.get(monthKey) || 0;
        monthlyMap.set(monthKey, currentMonthTotal + tx.amount);
      });
    });

    // Format the maps into arrays for charting libraries (like Recharts)
    const chartData = {
      today: todayTransactions,
      categories: Array.from(categoryMap, ([category, total]) => ({ category, total })),
      monthly: Array.from(monthlyMap, ([month, total]) => ({ month, total })).sort((a, b) => a.month.localeCompare(b.month)),
    };

    return (
      <main className="p-8 text-amber-50 bg-neutral-700">
        <h1 className="text-xl font-bold mb-6">Financial Analysis
       <span>  <Link href='/dashboard/user' className='bg-green-200 p-4 rounded-2xl text-black text-sm hover:p-3 hover:bg-green-400'>Analyze now! </Link> </span> </h1>
        {/*<Link href='/dashboard/analyzereport'> analyze now </Link>*/}
        {/* Pass the processed data to your Client Component */}
        <Report data={chartData} />
      </main>
    );

  } catch (err) {
    console.error("Dashboard Fetch Error: ", err);
    return <div>Failed to load dashboard data.</div>;
  }
}