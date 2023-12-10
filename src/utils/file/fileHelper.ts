import fs from "fs";

export const deleteFile = (path: string) => {
  // cek apakah file exist
  if (fs.existsSync(path)) {
    // delete file
    fs.unlinkSync(path);
  }
};