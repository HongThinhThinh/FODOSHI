// Calculate today's revenue from the revenueData
const todayRevenueValue = revenueData?.revenueData
  ? Object.values(revenueData.revenueData)[
      Object.values(revenueData.revenueData).length - 1
    ]
  : 0;
