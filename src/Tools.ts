
const isDevelopment = process.env.NODE_ENV !== 'production';

export class Logger {
  public static log(...values: any[]) {
    if (isDevelopment) {
      console.log(...values);
    }
  }

  public static time(...values: any[]) {
    if (isDevelopment) {
      console.time(...values);
    }
  }

  public static timeEnd(...values: any[]) {
    if (isDevelopment) {
      console.timeEnd(...values);
    }
  }
}

export default { Logger };
