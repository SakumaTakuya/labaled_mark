export function readFileAsDataURL(blob: Blob): Promise<string | DOMException> {
  return new Promise<string>((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsDataURL(blob);
  });
}
