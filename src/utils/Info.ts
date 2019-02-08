import { remote } from 'electron';

/**
 * 提供软件运行信息的辅助类
 *
 * @export
 * @class Info
 */
export default class Info {
  public static isDevelopment = process.env.NODE_ENV !== 'production';
  public static APP_PATH = remote.app.getPath('userData');
}
