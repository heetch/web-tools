import { FormFieldRendererProps } from '../../types/renderer';
import { FormFieldFile } from '../../types/fields';
import { buildValidationRules, classNames, isRequired } from '../../utils';
import { Controller } from 'react-hook-form';
import {
  Button,
  Helper,
  Icon,
  IconButton,
  Label,
  theme as flamingo,
  UiText,
} from '@heetch/flamingo-react';
import { ErrorHelper } from '../error-helper/error-helper';
import { useRef } from 'react';
import styles from './form-field-file-renderer.module.scss';

export function FormFieldFileRenderer({
  field,
  control,
  setValue,
  options,
  texts,
}: FormFieldRendererProps<FormFieldFile>) {
  const rules = buildValidationRules(field, texts, setValue);
  const showAsterisk = options?.showRequiredAsterisk && isRequired(field);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      control={control}
      name={field.id}
      rules={rules}
      render={({ field: fieldProps, fieldState }) => {
        let label: string | undefined =
          field.label + (showAsterisk ? ' *' : '');
        let placeholder: string | undefined = field.placeholder;
        if (options?.showLabelsAsPlaceholders) {
          placeholder = label;
          label = undefined;
        }

        const helper = fieldState?.error ? undefined : field.helper;

        const errorHelper = fieldState?.error?.message;

        const files = Array.isArray(fieldProps.value)
          ? (fieldProps.value as File[])
          : undefined;

        const showAddButton = field.multiple || (files || []).length < 1;

        const deleteFile = (file: File) => {
          const remainingFiles = files?.filter((f) => f !== file) || [];
          fieldProps.onChange(
            remainingFiles.length > 0 ? remainingFiles : undefined
          );
        };

        const addFiles = (filesList: FileList | null) => {
          const newFiles = filesList ? Array.from(filesList) : [];
          fieldProps.onChange(files ? [...files, ...newFiles] : newFiles);
        };

        return (
          <div className={classNames.field.file.base}>
            {label && <Label htmlFor={fieldProps.name}>{label}</Label>}
            <div className={classNames.field.file.list}>
              {files?.map((file) => (
                <UiText
                  key={file.name}
                  variant="subContent"
                  textColor={flamingo.color_v3.type.default}
                  className={[
                    styles['FileItem'],
                    classNames.field.file.item,
                  ].join(' ')}
                >
                  <IconButton
                    icon="IconTrash"
                    onClick={() => deleteFile(file)}
                  />{' '}
                  <span>{file.name}</span>
                </UiText>
              ))}

              <div
                data-testid="file"
                className={[
                  styles['FileInputWrapper'],
                  classNames.field.file.input_wrapper,
                ].join(' ')}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={field.accepts}
                  onChange={(e) => addFiles(e.target.files)}
                  className={classNames.field.file.input}
                />
                {showAddButton && (
                  <Button
                    variant="text"
                    onClick={() => fileInputRef.current?.click()}
                    className={classNames.field.file.add_button}
                  >
                    <Icon icon="IconPlus" size="s" />
                    {placeholder}
                  </Button>
                )}
              </div>
            </div>
            {helper && <Helper>{helper}</Helper>}
            {errorHelper && <ErrorHelper>{errorHelper}</ErrorHelper>}
          </div>
        );
      }}
    />
  );
}
