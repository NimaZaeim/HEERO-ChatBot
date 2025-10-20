// This function converts a File object to a Base64 encoded string.
// It reads the file as a Data URL and resolves with an object containing the file name and Base64 string.
// It uses the FileReader API to read the file asynchronously.

export const convertFileToBase64 = (
  file: File
): Promise<{ name: string; base64: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ name: file.name, base64: reader.result as string });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
