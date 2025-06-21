import { Readable } from 'stream';
import { BaseService } from './BaseService';
import { bufferToString, streamToBuffer } from '../helpers/converter';
import { hashStringWithMD5 } from '../helpers/hasher';
import { S3Repository } from '../repositories/S3Repository';

export class IconService extends BaseService<
  { s3Repository: S3Repository; },
  {}
> {
  static ICON_BUCKET = process.env.S3_BUCKET_ICONS;

  constructor (s3Repository: S3Repository) {
    super({ s3Repository }, {});
  }

  async getIcon(username: string): Promise<string> {
    const filename = hashStringWithMD5(username);
    try {
      const output = await this.repos.s3Repository.getObject(IconService.ICON_BUCKET, filename);

      const buffer = await streamToBuffer(output.Body as Readable);
      const iconImage = bufferToString(buffer);
      return iconImage;
    } catch (error) {
      if (error.Code === 'NoSuchKey') {
        return ""; // ファイルがない場合は、空文字を返す
      }
      throw error; // それ以外はもっかいthrowする
    }
  }

  async updateIcon(username: string, iconImage: string): Promise<string> {
    const filename = hashStringWithMD5(username);
    await this.repos.s3Repository.putObject(IconService.ICON_BUCKET, filename, iconImage);

    return iconImage;
  }
}
