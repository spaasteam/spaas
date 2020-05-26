import { fetch } from '@/libs/fetch';

/**
     * @desc Find purchase order by ID
For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
     */
export function request(params, options) {
  const fetchOption = Object.assign(
    {
      url: '/petstore/store/order/{orderId}',
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    },
    options,
  );
  return fetch(fetchOption);
}
