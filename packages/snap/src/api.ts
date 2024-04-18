const getData = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    console.error(`Call to ${url} failed with status ${response.status}`);
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

export const fetchBalanceFromLineascan = async (
  tokenBalance: string,
  address: string,
) => {
  const res = await getData(
    `https://api.lineascan.build/api?module=account&action=tokenbalance&contractaddress=${tokenBalance}&address=${address}&tag=latest`,
  );

  return res.result as string;
};

export const fetchPohStatus = async (address: string) => {
  return await getData(`https://linea-xp-poh-api.linea.build/poh/${address}`);
};

export const fetchLxpActivations = async () => {
  const result = await getData(
    'https://lxp-snap-api.netlify.app/.netlify/functions/api',
  );
  return result.lxpActivations;
};
