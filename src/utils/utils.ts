export class Utils {
  static random(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  static randomInt(min: number, max: number) {
    return parseInt(String(this.random(min, max)))
  }

  static delay(time: number) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(undefined), time)
    })
  }
}

export const utils = Utils
