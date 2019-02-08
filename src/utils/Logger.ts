import Info from './Info';

/**
 * 处理调试输出的辅助类
 *
 * @export
 * @class Logger
 */
export default class Logger {
  public static log(...values: any[]) {
    if (Info.isDevelopment) {
      console.log(...values);
    }
  }
  public static error(...values: any[]) {
    if (Info.isDevelopment) {
      console.error(...values);
    }
  }
  public static time(...values: any[]) {
    if (Info.isDevelopment) {
      console.time(...values);
    }
  }
  public static timeEnd(...values: any[]) {
    if (Info.isDevelopment) {
      console.timeEnd(...values);
    }
  }
}
