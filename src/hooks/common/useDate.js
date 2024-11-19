export default function useDate(date) {
  const formattedDate = new Date(date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24시간 형식 사용
  });
  return formattedDate;
}
