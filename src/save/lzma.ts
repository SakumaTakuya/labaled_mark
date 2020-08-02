interface LZMA {
  compress(
    str: string | Buffer,
    mode: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
    on_finish?: (result: Buffer, error: Error) => void,
    on_progress?: (parcent: number) => void
  ): void;

  decompress(
    byte_arr: Buffer,
    on_finish?: (result: string, error: Error) => void,
    on_progress?: (parcent: number) => void
  ): void;
}
// tslint:disable-next-line:no-var-requires
export const lzma = require('./lzma_worker').LZMA as LZMA;
export function compress(
  str: string | Buffer,
  mode?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
  on_progress?: (parcent: number) => void
): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    lzma.compress(
      str,
      mode || 9,
      (result, error) => {
        if (result) {
          if (result instanceof Array) {
            result = Buffer.from(result);
          }
          resolve(result);
        } else {
          reject(error);
        }
      },
      on_progress
    );
  });
}
export function decompress(
  byte_arr: Buffer,
  on_progress?: (parcent: number) => void
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    lzma.decompress(
      byte_arr,
      (result, error) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
      on_progress
    );
  });
}
