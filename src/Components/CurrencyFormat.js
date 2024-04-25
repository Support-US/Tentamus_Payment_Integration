
const CurrencyFormat = (number) => {
  const formattedNumber = new Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }).format(number);
  return formattedNumber;
}

export default CurrencyFormat;