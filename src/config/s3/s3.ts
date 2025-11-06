import { S3Client } from '@aws-sdk/client-s3';

const s3Config = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const s3Bucket = process.env.AWS_BUCKET_NAME as string;

export const accessControlRule = 'public-read';

export default s3Config;
