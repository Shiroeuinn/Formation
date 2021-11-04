import { formatDistanceToNowStrict, parseISO } from 'date-fns';

export default function fromNow(value: string) {
  const date = parseISO(value);
  return formatDistanceToNowStrict(date, { addSuffix: true });
}
