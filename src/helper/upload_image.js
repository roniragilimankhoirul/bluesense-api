import multer from "multer";
import ImageKit from "imagekit";

export const upload = multer({
  // dest: "images/",
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const imagekit = new ImageKit({
  publicKey: "public_9rmFWwNzjI9XVB2JdzaIyI10C+I=",
  privateKey: "private_jm1crOoYsIfCIiyEno50eAz7dXM=",
  urlEndpoint: "https://ik.imagekit.io/abazure/",
});
