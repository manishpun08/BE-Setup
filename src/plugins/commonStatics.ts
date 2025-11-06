import { Schema, Model, Document } from 'mongoose';
import mongoose from 'mongoose';

// Define a type for the model with statics
interface CommonStatics<T extends Document> extends Model<T> {
  findByEmail(email: string): Promise<T | null>;
  findByIdString(id: string): Promise<T | null>;
}

// Define the plugin function
export default function schemaMetadataPlugin(
  schema: Schema,
  options?: {
    defaultComponentOverrides?: Record<string, string | Record<string, string>>;
    refFieldMapping?: Record<string, { model: string; strField: string }>;
  },
) {
  const runtimeOverrides: Record<string, string> = {};

  const inferComponentType = (field: any) => {
    if (field.instance === 'String') return 'TextField';
    if (field.instance === 'Array' && field.caster?.instance === 'String')
      return 'MultiSelect';
    return 'TextField'; // Default fallback
  };

  const getOverride = (fieldName: string, overrides: Record<string, any>) => {
    const keys = fieldName.split('.');
    let current = overrides;

    for (const key of keys) {
      if (current[key] !== undefined) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return typeof current === 'string' ? current : undefined;
  };

  schema.statics.getFieldMetadata = function () {
    const metadata: Record<string, any> = {};

    const processSchema = (subSchema: Schema, prefix = '') => {
      const result: Record<string, any> = {};

      Object.keys(subSchema.paths).forEach((fieldName) => {
        if (
          [
            'createdAt',
            'updatedAt',
            'deletedAt',
            'deleted',
            'author',
            '__v',
            '_id',
            'isDeleted',
            '--v',
            'favorites',
            'comments',
            'readTime',
            'displayPosition',
          ].includes(fieldName)
        ) {
          return;
        }

        const field = subSchema.paths[fieldName];
        const fullFieldName = prefix ? `${prefix}.${fieldName}` : fieldName; // For nested fields like "seo.metaTitle"

        if (field.instance === 'Embedded' || field.schema) {
          // Handle nested objects
          if (
            field.instance === 'Array' &&
            Array.isArray(field.options?.type)
          ) {
            const subSchema = field.options.type[0].type; // This is the object inside the array

            if (subSchema && subSchema.paths) {
              const subFields = subSchema.paths; // Get all fields of the inner object
              console.log(subFields, 'subFields');

              // Extract and process fields like listItemTitle and listItemDescription
              Object.keys(subFields).forEach((subFieldName) => {
                const subField = subFields[subFieldName];
                console.log(`Subfield: ${subFieldName}`, subField);
                // You can now access subField properties like instance, options, etc.
              });
              console.log(
                fullFieldName,
                options?.defaultComponentOverrides,
                'log',
              );

              result[fieldName] = {
                componentType:
                  runtimeOverrides[fullFieldName] ||
                  getOverride(
                    fullFieldName,
                    options?.defaultComponentOverrides ?? {},
                  ) ||
                  inferComponentType(field),
                required: field.isRequired || false,
                ref: field.options?.ref
                  ? options?.refFieldMapping?.[field.options.ref] || {
                      model: field.options.ref,
                      strField: '',
                    }
                  : '', // Add ref field (empty string for non-reference fields)
                type: field.instance, // 'String', 'Array', 'ObjectID', etc.
                isArray: field.instance === 'Array',
                questionField: Object.keys(subFields)[0],
                descriptionField: Object.keys(subFields)[1],
              };
              return;
              console.log(Object.keys(subFields), 'keys');
            } else {
              console.warn('subSchema or subSchema.paths is undefined or null');
            }
          }

          result[fieldName] = processSchema(field.schema, fullFieldName);
        } else {
          // Apply override if exists, else infer from type
          result[fieldName] = {
            componentType:
              runtimeOverrides[fullFieldName] ||
              getOverride(
                fullFieldName,
                options?.defaultComponentOverrides ?? {},
              ) ||
              inferComponentType(field),
            required: field.isRequired || false,
            ref: field.options?.ref
              ? options?.refFieldMapping?.[field.options.ref] || {
                  model: field.options.ref,
                  strField: '',
                }
              : '', // Add ref field (empty string for non-reference fields)
            type: field.instance, // 'String', 'Array', 'ObjectID', etc.
            isArray: field.instance === 'Array',
            enumValues: field.options.enum || [],
          };
        }
      });

      return result;
    };

    Object.assign(metadata, processSchema(this.schema));

    return metadata;
  };
}
