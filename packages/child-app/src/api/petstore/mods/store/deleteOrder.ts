import { fetch } from '@/libs/fetch';

/**
     * @desc Delete purchase order by ID
For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors
     */
export function request(params, options) {
  const fetchOption = Object.assign(
    {
      url: '/petstore/store/order/{orderId}',
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      params: params,
    },
    options,
  );
  return fetch(fetchOption);
}
