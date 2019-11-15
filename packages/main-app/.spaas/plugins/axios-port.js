import {setClient} from '@/services/apiClient';

export default ({app}) => {
  setClient(app.$axios);
};
