import dayjs from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);

export const timeFrom = (timestamp, compact) => {
  const string = dayjs.unix(timestamp).from(dayjs.utc(), compact);

  if (!compact) return string;
  return string
    .replace(/ minutes?/, 'm')
    .replace(/ hours?/, 'h')
    .replace(/ days?/, 'd')
    .replace(/an?/, 1);
};

export const compactNumber = (number, options) => {
  const formatter = Intl.NumberFormat(
    navigator.language,
    {
      notation: 'compact',
      ...options,
    },
  );
  return formatter.format(number);
};
