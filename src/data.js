const BASE_URL = "https://webinars.webdev.education-services.ru/sp7-api";

export function initData() {
  // кеш индексов
  let sellers;
  let customers;

  // кеш последнего запроса
  let lastResult;
  let lastQuery;

  // маппинг серверных records → формат таблицы
  const mapRecords = (data) =>
    data.map((item) => ({
      id: item.receipt_id,
      date: item.date,
      seller: sellers[item.seller_id],
      customer: customers[item.customer_id],
      total: item.total_amount,
    }));

  const getIndexes = async () => {
    if (!sellers || !customers) {
      const [sellersData, customersData] = await Promise.all([
        fetch(`${BASE_URL}/sellers`)
          .then((res) => res.json()),
        fetch(`${BASE_URL}/customers`)
          .then((res) => res.json()),
      ]);

      sellers = sellersData;
      customers = customersData;
    }

    return { sellers, customers };
  };

  const getRecords = async (query = {}, isUpdated = false) => {
    const qs = new URLSearchParams(query);
    const nextQuery = qs.toString();

    if (lastQuery === nextQuery && !isUpdated) {
      return lastResult;
    }

    const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
    const records = await response.json();

    const items = Array.isArray(records.items) ? mapRecords(records.items) : [];

    lastResult = {
      total: records.total ?? 0,
      items,
    };

    return lastResult;
  };

  return { getIndexes, getRecords };
}
