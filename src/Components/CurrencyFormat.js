
const CurrencyFormat = (number) => {
  const formattedNumber = new Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
  return formattedNumber;
}

export default CurrencyFormat;