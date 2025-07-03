import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToRupiah(num: number): string {
  const units = ['', 'Ribu', 'Juta', 'Milyar', 'Triliun'];
  const digits = ['Nol', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan'];
  const teens = ['Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas', 'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas'];
  const tens = ['', 'Sepuluh', 'Dua Puluh', 'Tiga Puluh', 'Empat Puluh', 'Lima Puluh', 'Enam Puluh', 'Tujuh Puluh', 'Delapan Puluh', 'Sembilan Puluh'];

  if (num === 0) return 'Nol Rupiah';
  if (num < 0) return 'Minus ' + convertToRupiah(Math.abs(num));

  function convertGroup(n: number): string {
    let result = '';

    // Handle hundreds
    const hundreds = Math.floor(n / 100);
    if (hundreds > 0) {
      result += (hundreds === 1 ? 'Seratus' : digits[hundreds] + ' Ratus') + ' ';
    }

    // Handle tens and ones
    const remainder = n % 100;
    if (remainder > 0) {
      if (remainder < 10) {
        result += digits[remainder];
      } else if (remainder < 20) {
        result += teens[remainder - 10];
      } else {
        const tensDigit = Math.floor(remainder / 10);
        const onesDigit = remainder % 10;
        result += tens[tensDigit];
        if (onesDigit > 0) {
          result += ' ' + digits[onesDigit];
        }
      }
    }

    return result.trim();
  }

  let result = '';
  let groupIndex = 0;

  while (num > 0) {
    const group = num % 1000;
    if (group > 0) {
      const groupText = convertGroup(group);
      if (groupIndex > 0) {
        result = groupText + ' ' + units[groupIndex] + ' ' + result;
      } else {
        result = groupText + ' ' + result;
      }
    }
    num = Math.floor(num / 1000);
    groupIndex++;
  }

  return result.trim() + ' Rupiah';
}
