const fs = require('fs/promises');

class Upload {
  constructor(uploadCloud) {
    this.uploadCloud = uploadCloud;
  }

  async saveAvatarToCloud(pathFile, userImgId) {
    try {
      const { public_id: publicId, secure_url: secureUrl } =
        await this.uploadCloud(pathFile, {
          public_id: userImgId?.replace('AvatarsPhoto/', ''), // .replace для избежания folders hell
          folder: 'AvatarsPhoto',
          transformation: { width: 250, crop: 'pad' },
        });
      await this.deleteTemporyFile(pathFile);
      return { userImgId: publicId, avatarURL: secureUrl };
    } catch (error) {
      console.error('Error saveAvatarToCloud', error.message);
    }
  }

  async deleteTemporyFile(pathFile) {
    // удаление avatar с временной папки uploads
    try {
      await fs.unlink(pathFile);
    } catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = Upload;
