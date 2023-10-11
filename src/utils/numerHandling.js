export function approximateNumber(inputNumber) {
  const roundedNumber = Math.round(inputNumber);
  if (roundedNumber >= 0 && roundedNumber <= 25) {
      return 25;
  } else if (roundedNumber >= 26 && roundedNumber <= 50) {
      return 50;
  } else if (roundedNumber >= 51 && roundedNumber <= 75) {
      return 75;
  } else if (roundedNumber > 75) {
      return 100;
  } else {
      console.error('Input number is out of valid range (below 0)');
      return null; // or handle the error as appropriate for your application
  }
}