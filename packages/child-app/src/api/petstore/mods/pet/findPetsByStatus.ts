import { fetch } from '@/libs/fetch';

/**
     * @desc Finds Pets by status
Multiple status values can be provided with comma separated strings
     */
export function request(params, options) {
  const fetchOption = Object.assign(
    {
      url: '/petstore/pet/findByStatus',
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
