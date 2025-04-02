import { applyDecorators, Type } from '@nestjs/common';
import { ApiQuery, ApiExtraModels } from '@nestjs/swagger';

export function ApiQueries(...models: Type<any>[]) {
  const decorators: any[] = [];

  decorators.push(ApiExtraModels(...models));

  for (const model of models) {
    const properties =
      Reflect.getMetadata('swagger/apiModelPropertiesArray', model.prototype) ||
      [];
    console.log(properties);
    for (const property of properties) {
      const options =
        Reflect.getMetadata(
          'swagger/apiModelProperties',
          model.prototype,
          property.slice(1),
        ) || {};
      decorators.push(
        ApiQuery({
          name: property.slice(1),
          type: options.type || String,
          required: options.required ?? false,
          description: options.description || '',
          example: options.example,
        }),
      );
    }
  }

  return applyDecorators(...decorators);
}
