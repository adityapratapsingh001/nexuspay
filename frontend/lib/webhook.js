import axios from "axios";

export async function fetchTransactions(timestamp) {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://payments-tesseract.bharatpe.in/api/v1/merchant/transactions?module=PAYMENT_QR&merchantId=25540696&sDate=${timestamp}&eDate=${timestamp + 5 * 60 * 1000}&pageSize=10&pageCount=0&isFromOtDashboard=1`,
    headers: {
      Accept: "application/json, text/javascript, */*; q=0.01",
      Origin: "https://enterprise.bharatpe.in",
      Referer: "https://enterprise.bharatpe.in/",
      "Accept-Language": "en-US,en;q=0.9",
      token: "63494edbdee441e7809c2b4f8b7f743f",
    },
  };

  try {
    const response = await axios.request(config);
    const transactions = response.data.data.transactions;

    return transactions.map((tx) => ({
      timestamp: tx.createdAt || tx.paymentTimestamp || null,
      amount: tx.amount || null,
    }));

  } catch (err) {
    console.error("Error fetching transactions:", err.message);
    return [];
  }
}
