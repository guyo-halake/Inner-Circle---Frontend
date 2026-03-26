import { DashboardLayout } from "@/components/dashboard-layout";
import { PortfolioAllocation } from "@/components/portfolio-allocation";
import { SummaryCard } from "@/components/summary-card";
import { formatKSh } from "@/lib/utils";

const categories = [
  { name: "Forex", allocation: "45%", profit: 145212.50, trend: "+12.4%" },
  { name: "Stocks", allocation: "30%", profit: 92450.00, trend: "+8.2%" },
  { name: "Funds", allocation: "25%", profit: 86850.00, trend: "+6.8%" },
];

export default function PortfolioPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">Detailed breakdown of your asset allocation and performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard label="Total Assets" value={formatKSh(1824512.50)} />
          <SummaryCard label="Active Categories" value="3" />
          <SummaryCard label="Risk Profile" value="Moderate" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <PortfolioAllocation />
          
          <div className="bg-card border rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-8">Category Performance</h3>
            <div className="space-y-6">
              {categories.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-bold text-lg">{cat.name}</p>
                    <p className="text-sm text-muted-foreground">{cat.allocation} allocation</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-numbers">+{formatKSh(cat.profit)}</p>
                    <p className="text-sm text-green-500 font-medium">{cat.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-8">Historical Returns per Category</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b">
                <tr>
                  <th className="pb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Category</th>
                  <th className="pb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">1 Month</th>
                  <th className="pb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">3 Months</th>
                  <th className="pb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">YTD</th>
                  <th className="pb-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">All Time</th>
                </tr>
              </thead>
              <tbody className="divide-y font-numbers">
                {categories.map((cat) => (
                  <tr key={cat.name} className="hover:bg-accent/50 transition-colors">
                    <td className="py-4 font-sans font-medium">{cat.name}</td>
                    <td className="py-4 text-green-500 font-medium">+2.4%</td>
                    <td className="py-4 text-green-500 font-medium">+6.8%</td>
                    <td className="py-4 text-green-500 font-medium">+10.2%</td>
                    <td className="py-4 text-green-500 font-medium">{cat.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
