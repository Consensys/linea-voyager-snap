import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import type { Activation } from 'lxp-snap/src/types';
import type { Address, Hex } from 'viem';
import { verifyMessage } from 'viem';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

/**
 * This function is called on every network call.
 * @param event - The event object.
 * @param event.httpMethod - The HTTP method used by the caller.
 * @param event.body - The HTTP request body.
 * @returns The response object.
 */
export async function handler(event: { body: string; httpMethod: string }) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  if (event.httpMethod === 'GET') {
    return getActivations();
  } else if (event.httpMethod === 'POST') {
    return checkSignature(event.body);
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({
      message: 'Method not allowed',
    }),
  };
}

/**
 * Get current active activations from Contentful.
 * @returns The activations object.
 */
async function getActivations() {
  const { CONTENTFUL_API_KEY } = process.env;
  const GET_XP_TAG = '4WJBpV24ju4wlbr6Kvi2pt';

  if (!CONTENTFUL_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Contentful API key not set',
      }),
    };
  }

  const response = await fetch(
    'https://api.contentful.com/spaces/64upluvbiuck/environments/master/entries/?content_type=activationsCard',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: CONTENTFUL_API_KEY,
      },
    },
  );

  const result = await response.json();

  const allActivations = result?.items ?? [];
  const lxpActivations = allActivations.filter((activation: Activation) => {
    const isCurrent =
      new Date(activation?.fields?.endDate?.['en-US']) > new Date();
    const hasXpTag = activation?.fields?.tags?.['en-US']?.find(
      (tag) => tag?.sys?.id === GET_XP_TAG,
    );
    return isCurrent && hasXpTag;
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      lxpActivations,
    }),
  };
}

/**
 * Check the signature and register the corresponding address.
 * @param body - The request body.
 * @returns The response object.
 */
async function checkSignature(body: string) {
  const { CLIENT_EMAIL, PRIVATE_KEY, GSHEET_ID } = process.env;

  if (!CLIENT_EMAIL || !PRIVATE_KEY || !GSHEET_ID) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Google IDs not set',
      }),
    };
  }

  const { signature, address }: { signature: Hex; address: Address } =
    JSON.parse(body);

  if (!signature || !address) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: 'Signature or address not provided',
      }),
    };
  }

  const valid = await verifyMessage({
    address,
    message: 'Example message.',
    signature,
  });

  if (!valid) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: 'Invalid signature',
      }),
    };
  }

  const response = await fetch(
    `https://linea-xp-poh-api.linea.build/poh/${address}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const result = await response.json();

  if (!result.poh) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: "Doesn't have a valid POH",
      }),
    };
  }

  try {
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

    const jwt = new JWT({
      email: CLIENT_EMAIL,
      key: PRIVATE_KEY.replace(/\\n/gu, '\n'),
      scopes: SCOPES,
    });

    const doc = new GoogleSpreadsheet(GSHEET_ID, jwt);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    if (!sheet) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: 'Sheet not found',
        }),
      };
    }

    await sheet.addRow([Date.now(), address as string]);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ message: 'Address successfully registered' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: `Something went wrong: ${JSON.stringify(error, null, 2)}`,
      }),
    };
  }
}
