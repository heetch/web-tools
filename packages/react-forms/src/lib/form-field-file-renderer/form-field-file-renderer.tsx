import styled from 'styled-components';
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
import { ErrorHelper } from '../styled-components';
import { useRef } from 'react';

const FileInputWrapper = styled.div`
  > input {
    visibility: hidden;
    width: 0;
  }

  > button {
    margin: 0;
    padding-left: 0;
    padding-right: 0;
    color: ${flamingo.color_v3.type.light};
    > span {
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
`;

const FileFieldWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const FileItem = styled(UiText).attrs({
  variant: 'subContent',
  textColor: flamingo.color_v3.type.default,
})`
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0;

  .f-Icon {
    margin: 0;
  }
`;

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
            <FileFieldWrapper className={classNames.field.file.list}>
              {files?.map((file) => (
                <FileItem
                  key={file.name}
                  className={classNames.field.file.item}
                >
                  <IconButton
                    icon="IconTrash"
                    onClick={() => deleteFile(file)}
                  />{' '}
                  <span>{file.name}</span>
                </FileItem>
              ))}

              <FileInputWrapper
                data-testid="file"
                className={classNames.field.file.input_wrapper}
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
              </FileInputWrapper>
            </FileFieldWrapper>
            {helper && <Helper>{helper}</Helper>}
            {errorHelper && <ErrorHelper>{errorHelper}</ErrorHelper>}
          </div>
        );
      }}
    />
  );
}
