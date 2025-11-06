#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('src', 'modules');
const moduleName = process.argv[2];

if (!moduleName) {
  console.error(
    '❌ Please provide a folder name.\nExample: node generate.js user',
  );
  process.exit(1);
}

const modulePath = path.join(baseDir, moduleName);

function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

const snakeCaseName = toSnakeCase(moduleName);

const structure = {
  controller: `${snakeCaseName}_controller.ts`,
  services: `${snakeCaseName}_service.ts`,
  repository: `${snakeCaseName}_repository.ts`,
  routes: `${snakeCaseName}_routes.ts`,
  validator: `${snakeCaseName}_validator.ts`,
  model: `${snakeCaseName}_model.ts`,
};

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

ensureDir(modulePath);

Object.entries(structure).forEach(([folder, file]) => {
  const folderPath = path.join(modulePath, folder);
  ensureDir(folderPath);

  const filePath = path.join(folderPath, file);

  if (!fs.existsSync(filePath)) {
    const fileContent = generateTemplate(folder, moduleName);
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    console.log(`✅ Created: ${filePath}`);
  } else {
    console.log(`⚠️  Already exists: ${filePath}`);
  }
});

console.log(`\n✨ Module '${moduleName}' generated successfully! ✨`);

function generateTemplate(type, name) {
  const className = capitalize(name);
  const snakeName = toSnakeCase(name);

  switch (type) {
    case 'controller':
      return `import { Request, Response, NextFunction } from 'express';
import ${className}Service from '../services/${snakeName}_service';

class ${className}Controller {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    const result = await ${className}Service.getAll();
    res.json({ success: true, data: result });
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const result = await ${className}Service.getById(id);
    res.json({ success: true, data: result });
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    const result = await ${className}Service.create(req.body);
    res.status(201).json({ success: true, data: result });
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const result = await ${className}Service.update(id, req.body);
    res.json({ success: true, data: result });
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    await ${className}Service.delete(id);
    res.json({ success: true, message: '${className} deleted successfully' });
  }
}

export default new ${className}Controller();
`;
    case 'services':
      return `import ${className}Repository from '../repository/${snakeName}_repository';

class ${className}Service {
  public async getAll() {
    return await ${className}Repository.findAll();
  }

  public async getById(id: string) {
    const result = await ${className}Repository.findById(id);
    if (!result) {
      throw new Error('${className} not found');
    }
    return result;
  }

  public async create(data: any) {
    return await ${className}Repository.create(data);
  }

  public async update(id: string, data: any) {
    return await ${className}Repository.update(id, data);
  }

  public async delete(id: string) {
    return await ${className}Repository.delete(id);
  }
}

export default new ${className}Service();
`;
    case 'repository':
      return `import ${className}Model from '../model/${snakeName}_model';

class ${className}Repository {
  public async findAll() {
    return await ${className}Model.find();
  }

  public async findById(id: string) {
    return await ${className}Model.findById(id);
  }

  public async create(data: any) {
    const ${name} = new ${className}Model(data);
    return await ${name}.save();
  }

  public async update(id: string, data: any) {
    return await ${className}Model.findByIdAndUpdate(id, data, { new: true });
  }

  public async delete(id: string) {
    return await ${className}Model.findByIdAndDelete(id);
  }
}

export default new ${className}Repository();
`;
    case 'routes':
      return `import { Router } from 'express';
import ${snakeName}Controller from '../controller/${snakeName}_controller';
import { authenticateToken } from '@middleware/auth';
import { checkValidId, validateSchema } from 'helper/validation_helper';
import { create${className}Validator } from '../validator/${snakeName}_validator';

const router = Router();

router.post(
  '/',
  authenticateToken,
  validateSchema(create${className}Validator),
  ${snakeName}Controller.create,
);

router.get('/', authenticateToken, ${snakeName}Controller.getAll);

router.get('/:id', authenticateToken, checkValidId, ${snakeName}Controller.getById);

router.put(
  '/:id',
  authenticateToken,
  checkValidId,
  validateSchema(create${className}Validator),
  ${snakeName}Controller.update,
);

router.delete('/:id', authenticateToken, checkValidId, ${snakeName}Controller.delete);

export default router;
`;
    case 'validator':
      return `import { z } from 'zod';

export const create${className}Validator = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
});
`;
    case 'model':
      return `import mongoose, { Schema, Document } from 'mongoose';

export interface I${className} extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const ${className}Schema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<I${className}>('${className}', ${className}Schema);
`;
    default:
      return '';
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
