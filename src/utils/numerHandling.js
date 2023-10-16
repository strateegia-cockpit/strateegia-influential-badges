export function approximateNumber(inputNumber) {
  const roundedNumber = Math.round(inputNumber);
  if (roundedNumber >= 0 && roundedNumber <= 10) {
      return 25;
  } else if (roundedNumber >= 11 && roundedNumber <= 30) {
      return 50;
  } else if (roundedNumber >= 31 && roundedNumber <= 50) {
      return 75;
  } else if (roundedNumber > 51) {
      return 100;
  } else {
      console.error('Input number is out of valid range (below 0)');
      return null; // or handle the error as appropriate for your application
  }
}