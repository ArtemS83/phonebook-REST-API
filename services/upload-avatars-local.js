const fs = require('fs/promises');
const path = require('path');
const createFolderIsNotExist = require('../helpers/create-dir');
const jimp = require('jimp');

class Upload {
  constructor(AVATARS_OF_USERS) {
    this.AVATARS_OF_USERS = AVATARS_OF_USERS;
  }

  async transformAvatar(pathFile) {
    try {
      const img = await jimp.read(pathFile);
      await img
        .autocrop()
        .cover(
          250,
          250,
          jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE, // отцентровка по центру прсле обрезки на 250*250
        )
        .writeAsync(pathFile);
    } catch (error) {
      console.error(error.message);
    }
  }

  async saveAvatarToStatic({ idUser, pathFile, name, oldFile }) {
    try {
      // console.log(pathFile); // uploads\1622836494426-photo.jpg
      await this.transformAvatar(pathFile);
      const folderUserAvatar = path.join(this.AVATARS_OF_USERS, idUser);
      await createFolderIsNotExist(folderUserAvatar);
      await fs.rename(pathFile, path.join(folderUserAvatar, name));

      await this.deleteOldAvatar(
        path.join(process.cwd(), this.AVATARS_OF_USERS, oldFile), // process.cwd() возвращает текущий рабочий каталог,
        // т.е. каталог, из которого вызвали команду node
      );
      const avatarUrl = path.normalize(path.join(idUser, name));
      return avatarUrl;
    } catch (error) {
      console.error(error.message);
    }
  }

  async deleteOldAvatar(pathFile) {
    try {
      if (pathFile.includes('s.gravatar.com')) return;
      await fs.unlink(pathFile);
    } catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = Upload;
