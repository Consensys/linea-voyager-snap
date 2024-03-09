const getData = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
  });

  return response.json();
};

export const fetchBalanceFromLineascan = async (address: string) => {
  const res = await getData(
    `https://api.lineascan.build/api?module=account&action=tokenbalance&contractaddress=0xd83af4fbD77f3AB65C3B1Dc4B38D7e67AEcf599A&address=${address}&tag=latest`,
  );

  return res.result as string;
};

export const fetchPohStatus = async (address: string) => {
  return await getData(`https://linea-xp-poh-api.linea.build/poh/${address}`);
};

export const fetchLxpActivations = async () => {
  const result = await getData(
    'https://lxp-snap.netlify.app/.netlify/functions/api',
  );
  return result.lxpActivations;
};
