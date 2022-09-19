import {
  FormFieldBoolean,
  FormFieldDate,
  FormFieldFile,
  FormFieldNumber,
  FormFieldString,
} from './types/fields';
import { buildValidationRules } from './utils';

describe('buildValidationRules', () => {
  it('builds rules for booleans', () => {
    const field: FormFieldBoolean = {
      id: 'boolean',
      type: 'boolean',
      label: 'Boolean',
      validators: [
        { type: 'required', error_message: 'Mandatory' },
        { type: 'function', parameter: (value) => value || 'Not unchecked' },
      ],
    };
    const rules = buildValidationRules(field);
    expect(rules).toMatchObject({
      required: { value: true, message: 'Mandatory' },
      validate: {
        custom: expect.any(Function),
      },
    });
  });

  it('builds rules for integers', () => {
    const field: FormFieldNumber = {
      id: 'number',
      type: 'number',
      format: 'integer',
      label: 'Number',
      validators: [
        { type: 'required' },
        { type: 'min', parameter: 0, error_message: '>= 0' },
        { type: 'max', parameter: 100, error_message: '<= 100' },
      ],
    };
    const rules = buildValidationRules(field);
    expect(rules).toMatchObject({
      required: true,
      min: { value: 0, message: '>= 0' },
      max: { value: 100, message: '<= 100' },
      validate: {
        integer: expect.any(Function),
      },
    });
  });

  it('builds rules for decimals', () => {
    const field: FormFieldNumber = {
      id: 'number',
      type: 'number',
      format: 'decimal',
      label: 'Number',
      validators: [{ type: 'required' }],
    };
    const rules = buildValidationRules(field);
    expect(rules).toMatchObject({
      required: true,
      validate: {
        number: expect.any(Function),
      },
    });
  });

  it('builds rules for dates', () => {
    const field: FormFieldDate = {
      id: 'date',
      type: 'date',
      format: 'date',
      label: 'Date',
      validators: [
        { type: 'min', parameter: '2022-01-01', error_message: 'In 2022' },
        {
          type: 'max',
          parameter: new Date('2022-12-31'),
          error_message: 'In 2022',
        },
      ],
    };
    const rules = buildValidationRules(field);
    expect(rules).toMatchObject({
      min: { value: new Date('2022-01-01'), message: 'In 2022' },
      max: { value: new Date('2022-12-31'), message: 'In 2022' },
    });
  });

  it('builds rules for files', () => {
    const field: FormFieldFile = {
      id: 'file',
      type: 'file',
      label: 'File',
      accepts: 'image/*',
      validators: [
        { type: 'max_size', parameter: 50, error_message: 'Max. 50 MB' },
        { type: 'max', parameter: 2 },
      ],
    };
    const rules = buildValidationRules(field);
    expect(rules).toMatchObject({
      validate: {
        file_max_size: expect.any(Function),
        file_max: expect.any(Function),
      },
    });
  });

  it('builds rules for text', () => {
    const field: FormFieldString = {
      id: 'text',
      type: 'string',
      label: 'Text',
      format: 'line',
      validators: [
        {
          type: 'max_size',
          parameter: 100,
          error_message: 'Max. 100 characters',
        },
      ],
    };
    const rules = buildValidationRules(field);
    expect(rules).toMatchObject({
      maxLength: { value: 100, message: 'Max. 100 characters' },
    });
  });

  it('builds rules for uuid', () => {
    const field: FormFieldString = {
      id: 'uuid',
      type: 'string',
      label: 'UUID',
      format: 'uuid',
    };
    const rules = buildValidationRules(field);
    expect(rules).toMatchObject({
      validate: {
        uuid: expect.any(Function),
      },
    });
  });

  it('builds rules for email', () => {
    const field: FormFieldString = {
      id: 'email',
      type: 'string',
      label: 'E-mail',
      format: 'email',
    };
    const rules = buildValidationRules(field);
    expect(rules).toMatchObject({
      validate: {
        email: expect.any(Function),
      },
    });
  });
});
