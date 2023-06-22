const generateMockImageData = (width: number, height: number): string => {
  const buffer = Buffer.alloc(width * height * 3); // 3 bytes per pixel (RGB)
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = base64Chars.charCodeAt(Math.floor(Math.random() * base64Chars.length));
  }

  const imageData = buffer.toString('base64');
  const dataUri = `data:image/jpeg;base64,${imageData}`;

  return dataUri;
};

export const createMockImage = (): Express.Multer.File => {
  const imageData = generateMockImageData(30, 30); // Adjust the width and height as needed

  return {
    fieldname: 'image',
    originalname: 'mock-image.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from(imageData, 'base64'),
    size: Buffer.byteLength(imageData, 'base64'),
  } as Express.Multer.File;
};
