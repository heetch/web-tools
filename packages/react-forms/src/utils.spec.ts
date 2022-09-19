import {
  FormFieldBoolean,
  FormFieldDate,
  FormFieldFile,
  FormFieldNumber,
  FormFieldString,
} from './types/fields';
import {
  buildValidationRules,
  DEFAULT_TEXTS,
  injectDefaultTexts,
} from './utils';

const fieldBoolean: FormFieldBoolean = {
  id: 'boolean',
  type: 'boolean',
  label: 'Boolean',
  validators: [
    { type: 'required', error_message: 'Mandatory' },
    { type: 'function', parameter: (value) => value || 'Not unchecked' },
  ],
};

const fieldInteger: FormFieldNumber = {
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

const fieldDecimal: FormFieldNumber = {
  id: 'number',
  type: 'number',
  format: 'decimal',
  label: 'Number',
  validators: [{ type: 'required' }],
};

const fieldDate: FormFieldDate = {
  id: 'date',
  type: 'date',
  format: 'date',
  label: 'Date',
  validators: [
    { type: 'min', parameter: '2022-01-01', error_message: 'In 2022' },
    {
      type: 'max',
      parameter: new Date('2022-12-31'),
    },
  ],
};

const fieldFile: FormFieldFile = {
  id: 'file',
  type: 'file',
  label: 'File',
  accepts: 'image/*',
  validators: [
    { type: 'max_size', parameter: 50, error_message: 'Max. 50 MB' },
    { type: 'max', parameter: 2 },
  ],
};

const fieldText: FormFieldString = {
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

const fieldUuid: FormFieldString = {
  id: 'uuid',
  type: 'string',
  label: 'UUID',
  format: 'uuid',
};

const fieldEmail: FormFieldString = {
  id: 'email',
  type: 'string',
  label: 'E-mail',
  format: 'email',
};

describe('buildValidationRules', () => {
  it('builds rules for booleans', () => {
    const rules = buildValidationRules(fieldBoolean, DEFAULT_TEXTS);
    expect(rules).toMatchObject({
      required: { value: true, message: 'Mandatory' },
      validate: {
        custom: expect.any(Function),
      },
    });
  });

  it('builds rules for integers', () => {
    const rules = buildValidationRules(fieldInteger, DEFAULT_TEXTS);
    expect(rules).toMatchObject({
      required: true,
      min: { value: 0, message: '>= 0' },
      max: { value: 100, message: '<= 100' },
      validate: {
        integer: expect.any(Function),
      },
    });
    const validate = rules?.validate || {};
    if ('integer' in validate && validate['integer'] instanceof Function) {
      expect(validate['integer'](3.14)).toEqual('Expected: integer');
    } else {
      throw new Error('Expected validation function');
    }
  });

  it('builds rules for decimals', () => {
    const rules = buildValidationRules(fieldDecimal, DEFAULT_TEXTS);
    expect(rules).toMatchObject({
      required: true,
      validate: {
        number: expect.any(Function),
      },
    });
    const validate = rules?.validate || {};
    if ('number' in validate && validate['number'] instanceof Function) {
      expect(validate['number']('foo')).toEqual('Expected: number');
    } else {
      throw new Error('Expected validation function');
    }
  });

  it('builds rules for dates', () => {
    const rules = buildValidationRules(fieldDate, DEFAULT_TEXTS);
    expect(rules).toMatchObject({
      min: { value: new Date('2022-01-01'), message: 'In 2022' },
      max: new Date('2022-12-31'),
    });
  });

  it('builds rules for files', () => {
    const rules = buildValidationRules(fieldFile, DEFAULT_TEXTS);
    expect(rules).toMatchObject({
      validate: {
        file_max_size: expect.any(Function),
        file_max: expect.any(Function),
      },
    });
  });

  it('builds rules for text', () => {
    const rules = buildValidationRules(fieldText, DEFAULT_TEXTS);
    expect(rules).toMatchObject({
      maxLength: { value: 100, message: 'Max. 100 characters' },
    });
  });

  it('builds rules for uuid', () => {
    const rules = buildValidationRules(fieldUuid, DEFAULT_TEXTS);
    expect(rules).toMatchObject({
      validate: {
        uuid: expect.any(Function),
      },
    });
    const validate = rules?.validate || {};
    if ('uuid' in validate && validate['uuid'] instanceof Function) {
      expect(validate['uuid']('foo')).toEqual('Expected: valid UUID');
    } else {
      throw new Error('Expected validation function');
    }
  });

  it('builds rules for email', () => {
    const rules = buildValidationRules(fieldEmail, DEFAULT_TEXTS);
    expect(rules).toMatchObject({
      validate: {
        email: expect.any(Function),
      },
    });
    const validate = rules?.validate || {};
    if ('email' in validate && validate['email'] instanceof Function) {
      expect(validate['email']('foo')).toEqual('Expected: valid e-mail');
    } else {
      throw new Error('Expected validation function');
    }
  });
});

describe('injectDefaultTexts', () => {
  it('inject texts into validators missing custom error messages', () => {
    expect(injectDefaultTexts(DEFAULT_TEXTS, fieldDecimal)).toEqual({
      id: 'number',
      type: 'number',
      format: 'decimal',
      label: 'Number',
      validators: [
        { type: 'required', error_message: 'This field is mandatory' },
      ],
    });

    expect(injectDefaultTexts(DEFAULT_TEXTS, fieldText)).toEqual({
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
    });

    expect(injectDefaultTexts(DEFAULT_TEXTS, fieldDate)).toEqual({
      id: 'date',
      type: 'date',
      format: 'date',
      label: 'Date',
      validators: [
        { type: 'min', parameter: '2022-01-01', error_message: 'In 2022' },
        {
          type: 'max',
          parameter: new Date('2022-12-31'),
          error_message: 'Maximum: 31/12/2022',
        },
      ],
    });
  });
});
