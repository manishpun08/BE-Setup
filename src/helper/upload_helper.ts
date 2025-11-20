// import s3Config from '@config/s3/s3';
// import multer from 'multer';
// import multerS3 from 'multer-s3';
import uploadImage from 'helper/server_image_upload';
export interface CustomFile extends Express.Multer.File {
  key: string;
  location: string;
}
// export const uploadImage = multer({
//   storage: multerS3({
//     s3: s3Config,
//     bucket: process.env.AWS_BUCKET_NAME!,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, `file/${Date.now()}-${file.originalname}`);
//     },
//   }),
//   limits: { fileSize: 30 * 1024 * 1024 },
// });

// export const uploadVideo = multer({
//   storage: multerS3({
//     s3: s3Config,
//     bucket: process.env.AWS_BUCKET_NAME!,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, `video/${Date.now()}-${file.originalname}`);
//     },
//   }),
//   limits: { fileSize: 200 * 1024 * 1024 },
// });

// export const videoFile = uploadVideo.single('video');
export const imageFile = uploadImage.single('icon');
export const authorityImageFile = uploadImage.single('image');

export const projectImageFile = uploadImage.fields([
  { name: 'image', maxCount: 1 },
  { name: 'iconImages', maxCount: 20 },
]);

export const galleryImagesUpload = uploadImage.fields([
  { name: 'image', maxCount: 50 },
]);

export const testimonialImageFile = uploadImage.fields([
  { name: 'image', maxCount: 1 },
]);

export const HowWorkImageFile = uploadImage.fields([
  { name: 'icon[url]', maxCount: 1 },
]);
export const teamImageFile = uploadImage.fields([
  { name: 'image', maxCount: 1 },
]);

export const uploadServiceMultiple = uploadImage.fields([
  { name: 'mainImage[url]', maxCount: 1 },
  { name: 'images', maxCount: 20 },
]);

export const settingServiceMultiple = uploadImage.fields([
  { name: 'headerLogo[url]', maxCount: 1 },
  { name: 'footerLogo[url]', maxCount: 1 },
]);
export const ImageFileUpload = uploadImage.fields([
  { name: 'image', maxCount: 1 },
]);

// export const galleryImagesUpload = uploadImage.fields([
//   { name: 'images', maxCount: 30 },
// ]);

export const homePageImageUpload = uploadImage.fields([
  { name: 'approvalPartnerImage', maxCount: 1 },
  { name: 'whoWeAreImages', maxCount: 4 },
]);

export const brandImageUpload = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
]);
export const homeImage = uploadImage.fields([
  { name: 'footerImage[url]', maxCount: 1 },
  { name: 'videoFile[url]', maxCount: 1 },
]);

export const aboutUsSectionImage = uploadImage.fields([
  { name: 'leftImage[url]', maxCount: 1 },
  { name: 'rightImage[url]', maxCount: 1 },
  { name: 'image[url]', maxCount: 1 },
]);

export const aboutUsImageFile = uploadImage.fields([
  { name: 'images', maxCount: 2 },
]);

export const blogImageFile = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
  { name: 'mainImage[url]', maxCount: 1 },
]);

export const breadcrumImageUpload = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
]);

export const projectsImageUpload = uploadImage.fields([
  { name: 'mainImage', maxCount: 10 },
  { name: 'images', maxCount: 20 },
  { name: 'image[url]', maxCount: 1 },
]);

export const projectsSectionImageUpload = uploadImage.fields([
  { name: 'firstImage[url]', maxCount: 1 },
  { name: 'secondImage[url]', maxCount: 1 },
]);

export const serviceSectionImageUpload = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
]);

export const designduildImageUpload = uploadImage.fields([
  { name: 'icon[url]', maxCount: 1 },
]);

export const designbuildGallaryImage = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
]);

export const missionIconUpload = uploadImage.fields([
  { name: 'icon[url]', maxCount: 1 },
]);

export const behindVisionImage = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
]);
export const projectGalleryImage = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
]);

export const whuchooseusIconUpload = uploadImage.fields([
  { name: 'icon[url]', maxCount: 1 },
]);

export const buildDesignImage = uploadImage.fields([
  { name: 'image[url]', maxCount: 1 },
]);
