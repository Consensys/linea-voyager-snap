import type { Payload } from './types';

const getData = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
  });

  return response.json();
};

const postData = async (url: string, data: unknown) => {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    mode: 'cors',
  });
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
    'https://lxp-snap-api.netlify.app/.netlify/functions/api',
  );
  return result.lxpActivations;
};

export const postAddressRegistration = async (
  signature: string,
  payload: Payload,
) => {
  const response = await postData(
    'https://lxp-snap-api.netlify.app/.netlify/functions/api',
    {
      signature,
      payload,
    },
  );

  if (response.status === 201) {
    return { status: 'ok' };
  }

  const body = await response.json();
  return { status: 'error', message: body.message ?? 'Unknown error' };
};
