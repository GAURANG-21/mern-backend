import Datauriparser from "datauri/parser.js";
import path from "path";

const parser = new Datauriparser();

export const dataURIParser = async (file) => {
  const extName = path.extname(file.originalname);
  // console.log(extName);
  const content = parser.format(extName, file.buffer);
  return content;
};
