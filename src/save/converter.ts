import { compress, decompress } from './lzma';

export async function encodeDataToUrl(data: string): Promise<string> {
  const compressed = await compress(data);
  const location = document.location;
  const str = compressed.toString('base64');
  console.log(str);
  return Promise.resolve(`${location.origin}${location.pathname}?${str}`);
}

export async function decodeUrlToData(): Promise<string> {
  const data = document.location.search.substring(1);
  if (!data) {
    return '';
  }

  const decompressed = await decompress(Buffer.from(data, 'base64'));
  return decompressed;
}
