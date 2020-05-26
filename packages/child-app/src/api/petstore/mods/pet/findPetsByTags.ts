import { fetch } from '@/libs/fetch';

/**
     * @desc Finds Pets by tags
Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
     */
export function request(params, options) {
  const fetchOption = Object.assign(
    {
      url: '/petstore/pet/findByTags',
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
