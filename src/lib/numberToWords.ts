const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const thousands = ['', 'thousand', 'million', 'billion'];

function convertHundreds(num: number): string {
  let result = '';
  
  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + ' hundred';
    num %= 100;
    if (num > 0) result += ' ';
  }
  
  if (num >= 20) {
    result += tens[Math.floor(num / 10)];
    num %= 10;
    if (num > 0) result += '-' + ones[num];
  } else if (num >= 10) {
    result += teens[num - 10];
  } else if (num > 0) {
    result += ones[num];
  }
  
  return result;
}

export function numberToWords(num: number): string {
  if (num === 0) return 'zero';
  
  let result = '';
  let chunkIndex = 0;
  
  while (num > 0) {
    const chunk = num % 1000;
    if (chunk !== 0) {
      const chunkWords = convertHundreds(chunk);
      if (thousands[chunkIndex]) {
        result = chunkWords + ' ' + thousands[chunkIndex] + (result ? ' ' + result : '');
      } else {
        result = chunkWords + (result ? ' ' + result : '');
      }
    }
    num = Math.floor(num / 1000);
    chunkIndex++;
  }
  
  return result.trim();
}

export function formatAmountInWords(amount: number): string {
  const wholePart = Math.floor(amount);
  const decimalPart = Math.round((amount - wholePart) * 100);
  
  let result = numberToWords(wholePart) + ' naira';
  
  if (decimalPart > 0) {
    result += ' and ' + numberToWords(decimalPart) + ' kobo';
  }
  
  return result.charAt(0).toUpperCase() + result.slice(1) + ' only';
}