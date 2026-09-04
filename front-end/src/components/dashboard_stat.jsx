function RevenueCard({ stats }) {
  return (
    <div key={""} className="rounded-lg border border-black/6 bg-[#FFF8F0] p-5">
      <p className="text-[12px] text-[#4B2E2B]">Revenue Today</p>
      <p className="mt-1 text-2xl font-semibold text-[#8C5A3C]">
        {stats.today_revenue}
      </p>
      {/* {stat.delta && (
            <div
              className={`mt-1.5 flex items-center gap-1 text-[12px] ${stat.up ? "text-emerald-600" : "text-[#B5432D]"}`}>
              {stat.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {stat.delta}% vs yesterday
            </div>
          )} */}
    </div>
  );
}

function OrdersCard({ stats }) {
  return (
    <div key={""} className="rounded-lg border border-black/6 bg-[#FFF8F0] p-5">
      <p className="text-[12px] text-[#4B2E2B]">Orders Today</p>
      <p className="mt-1 text-2xl font-semibold text-[#8C5A3C]">
        {stats.today_orders}
      </p>
    </div>
  );
}

function TablesAvailability({ stats }) {
  return (
    <div className="rounded-lg border border-black/6 bg-[#FFF8F0] p-5">
      <p className="text-[12px] text-[#4B2E2B]">Available Tables</p>
      <div className="mt-1 flex items-center gap-3 text-xl font-semibold text-[#8C5A3C]">
        <span className="flex items-center gap-1.5">
          <span aria-label="available" className="status status-success"></span>
          <span>{stats.available_tables}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-label="unavailable" className="status status-error"></span>
          <span>{stats.unavailable_tables}</span>
        </span>
      </div>
    </div>
  );
}

function PendingPayment({ stats }) {
  return (
    <div key={""} className="rounded-lg border border-black/6 bg-[#FFF8F0] p-5">
      <p className="text-[12px] text-[#4B2E2B]">Pending Payments</p>
      <p className="mt-1 text-2xl font-semibold text-[#8C5A3C]">
        {stats.pending_payments}
      </p>
    </div>
  );
}

export default function DashBoardStatsCard({ stats }) {
  return (
    <>
      {stats.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="skeleton h-32 w-32"></div>
          <div className="skeleton h-32 w-32"></div>
          <div className="skeleton h-32 w-32"></div>
          <div className="skeleton h-32 w-32"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <RevenueCard stats={stats} />
          <OrdersCard stats={stats} />
          <TablesAvailability stats={stats} />
          <PendingPayment stats={stats} />
        </div>
      )}
    </>
  );
}
