import Ajv, { AnySchema, ErrorObject } from 'ajv';
import ajvErrors from 'ajv-errors';
import addFormats from 'ajv-formats'
import jsonSchemaFilter from 'uber-json-schema-filter';

type ValidateResult<T> = {
  isValid: boolean;
  message: string;
  errors: ErrorObject[];
  values: T | null;
}

export type ParametersSchema<T extends Record<string, any>> = Record<keyof T, any>;

const JsonSchema = new Ajv({
  allErrors: true
});
addFormats(JsonSchema);
ajvErrors(JsonSchema);

export const validate = <T>(schema: AnySchema, data: Partial<T>): ValidateResult<T> => {
  const validate = JsonSchema.compile(schema);
  const isValid = validate(data);

  if (isValid) {
    return {
      isValid: true,
      message: '',
      errors: [],
      values: jsonSchemaFilter(schema, data),
    };
  }

  return {
    isValid: false,
    message: JsonSchema.errorsText(validate.errors, { separator: '\n' }),
    errors: validate.errors,
    values: null,
  };
};
