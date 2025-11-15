import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm();

  await new Promise<void>((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        if (!res.headersSent) res.status(500).json({ error: 'Upload failed' });
        return resolve();
      }
      if (!files.file) {
        if (!res.headersSent) res.status(400).json({ error: 'No file uploaded' });
        return resolve();
      }
      const fileArr = Array.isArray(files.file) ? files.file : [files.file];
      const urls: string[] = [];
      for (const file of fileArr) {
        const fileStream = fs.createReadStream(file.filepath);
        const fileName = file.originalFilename || file.newFilename;
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: fileName,
          Body: fileStream,
          ContentType: file.mimetype || undefined,
        };
        try {
          await s3.send(new PutObjectCommand(uploadParams));
          const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
          urls.push(fileUrl);
        } catch (uploadErr) {
          console.error('S3 upload error:', uploadErr);
          if (!res.headersSent) res.status(500).json({ error: 'Error uploading file to S3' });
          return resolve();
        }
      }
      if (!res.headersSent) res.status(200).json({ urls });
      resolve();
    });
  });
} 