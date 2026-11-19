
// app/dashboard/page.tsx (Server Component)
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@/db.config';
import Report from '@/components/monthlyreports/report'; // Assuming you have a client component
import { TransactionInput } from "@/lib/validators";
import { DivideCircleIcon } from 'lucide-react';
import Link from 'next/link';
import redis from '@/lib/redis'


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

  //cache keys 
    const todayStr = new Date().toISOString().split("T")[0];

  const keys = {
    categories: `user:${curruserId}:agg:categories`,
    monthly:    `user:${curruserId}:agg:monthly`,
    today:      `user:${curruserId}:today:${todayStr}`,
  };


  //helper function.
  function mergeCategories(
  historical: { category: string; total: number }[],
  todayTxs: TransactionInput[]
) {
  const map = new Map(historical.map(c => [c.category, c.total]));
  for (const tx of todayTxs) {
    map.set(tx.category, (map.get(tx.category) || 0) + tx.amount);
  }
  return Array.from(map, ([category, total]) => ({ category, total }));
}

function mergeMonthly(
  historical: { month: string; total: number }[],
  todayTxs: TransactionInput[],
  todayStr: string
) {
  const monthKey = todayStr.substring(0, 7);
  const map = new Map(historical.map(m => [m.month, m.total]));
  const todayTotal = todayTxs.reduce((s, t) => s + t.amount, 0);
  map.set(monthKey, (map.get(monthKey) || 0) + todayTotal);

  return Array.from(map, ([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));
}
  

  try {
    // 2. Fetch all reports for this user
    // Since aggregations can't be done directly in Prisma on JSON fields, we fetch the data first.
    // const reports = await prisma.dailyanalyzedReport.findMany({
    //   where: { userId: curruserId },
    //   select: { date: true, transactions: true },
    // });

    // Helper to format today's date as YYYY-MM-DD (matching your schema)
   /// const todayStr = new Date().toISOString().split('T')[0];

    // 3. Process the data in JavaScript
    // let todayTransactions: TransactionInput[] = [];
    // const categoryMap = new Map<string, number>();
    // const monthlyMap = new Map<string, number>();

    // Iterate through all fetched reports to aggregate data
    // reports.forEach((report) => {
    //   // Typecast the JSON to your validator type
    //   const txs = report.transactions as unknown as TransactionInput[];

    //   txs.forEach((tx) => {
    //     // --- A. Today's Spending ---
    //     if (report.date === todayStr) {
    //       todayTransactions.push(tx);
    //     }
        

    //     // --- B. Bar Graph: Category Totals ---
    //     const currentCategoryTotal = categoryMap.get(tx.category) || 0;
    //     categoryMap.set(tx.category, currentCategoryTotal + tx.amount);

    //     // --- C. Line Graph: Monthly Spending ---
    //     // Extract YYYY-MM from the date (e.g., "2023-10-05" -> "2023-10")
    //     const monthKey = tx.date.substring(0, 7); 
    //     const currentMonthTotal = monthlyMap.get(monthKey) || 0;
    //     monthlyMap.set(monthKey, currentMonthTotal + tx.amount);
    //   });
    // });
    // let sum = 0;
    //   todayTransactions.forEach((tx)=>(
    //     sum += tx.amount
    //   ))
    //   console.log(sum);

   // Note-- ( version 2) using DB call each time for past data is significantly slower use redis 
       const todayStr = new Date().toISOString().split("T")[0];

  // ---------- 1. Try to load historical aggregates from cache ----------
  let [categoriesRaw, monthlyRaw] = await Promise.all([
    redis.get<{category:string; total: number} []>(keys.categories),
    redis.get<{month : string; total: number} []>(keys.monthly),
  ]);
  console.log("cache hit");
  let categories: { category: string; total: number }[] = [];
  let monthly: { month: string; total: number }[] = [];

  // ---------- 2. Cache miss → full rebuild from DB (happens rarely) ----------
  
  if (!categoriesRaw || !monthlyRaw) {
    console.log("Full historical rebuild... cache miss");
    const allReports = await prisma.dailyanalyzedReport.findMany({
      where: { userId: curruserId },
      select: { date: true, transactions: true },
    });

    const categoryMap = new Map<string, number>();
    const monthlyMap = new Map<string, number>();

    for (const report of allReports) {
      if (report.date === todayStr) continue; // skip today – we handle it separately

      const txs = report.transactions as TransactionInput[];
      for (const tx of txs) {
        categoryMap.set(tx.category, (categoryMap.get(tx.category) || 0) + tx.amount);
        const monthKey = tx.date.substring(0, 7);
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + tx.amount);
      }
    }

    categories = Array.from(categoryMap, ([category, total]) => ({ category, total }));
    monthly = Array.from(monthlyMap, ([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Cache forever (or very long TTL). Invalidate only when past data changes.
    // Cache the actual objects (Upstash handles serialization)
    await Promise.all([
      redis.set(keys.categories, categories),
      redis.set(keys.monthly, monthly),
    ]);
  } else {
    categories = categoriesRaw; 
    monthly = monthlyRaw;
  }

  // ---------- 3. Today’s data (always try cache first, then DB) ----------
  let todayTransactions: TransactionInput[] = [];
  let todaySum = 0;

  const todayCached = await redis.get<{transactions : TransactionInput[];
    sum : number;
  }>(keys.today);

  if (todayCached) {
    todayTransactions = todayCached.transactions;
    todaySum = todayCached.sum;
  } else {
    const todayReport = await prisma.dailyanalyzedReport.findFirst({
      where: { userId: curruserId, date: todayStr },
      select: { transactions: true },
    });

    if (todayReport) {
      todayTransactions = todayReport.transactions as TransactionInput[];
      todaySum = todayTransactions.reduce((acc, tx) => acc + tx.amount, 0);
    }

    // Cache today (TTL until end of day is ideal, or just 1–6 hours)
    await redis.set(
      keys.today,
      { transactions: todayTransactions, sum: todaySum },
      {ex : 60* 60*6} //6 hours
    );
  }

  // ---------- 4. Merge today into the historical aggregates for the charts ----------
  // (so the pie/bar/line also include today’s spending)
  const finalCategories = mergeCategories(categories, todayTransactions);
  const finalMonthly = mergeMonthly(monthly, todayTransactions, todayStr);

  
    // Format the maps into arrays for charting libraries (like Recharts)
    const chartData = {
      today: todayTransactions,
      categories: Array.from(finalCategories),
      monthly: Array.from(finalMonthly),
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