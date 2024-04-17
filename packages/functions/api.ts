import type { Activation } from '@consensys/linea-voyager/src/types';

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
