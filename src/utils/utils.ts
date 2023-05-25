export class Utils {
  static random(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  static randomInt(min: number, max: number) {
    return parseInt(String(this.random(min, max)))
  }

  static randomNumber(n: number): string {
    if (n <= 0 || typeof n !== 'number') {
      return ''
    }

    if (n <= 16) {
      return String(Math.random()).replace('0.', '').substring(0, n);
    } else {
      return String(Math.random()).replace('0.', '') + this.randomNumber(n - 16);
    }
  }

  static delay(time: number) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(undefined), time)
    })
  }
}

export const utils = Utils
