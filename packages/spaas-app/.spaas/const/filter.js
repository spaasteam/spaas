import dayjs from 'dayjs';

export default function formatDate(time, format) {
  if (!time) {
    return '';
  }
  return dayjs(time).format(format);
}
