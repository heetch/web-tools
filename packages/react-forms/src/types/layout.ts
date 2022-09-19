export type FormRow<K extends string = string> = {
  cells: FormCell<K>[];
};

export type FormCell<K extends string = string> = {
  field: K;
  widthConstraint?: `${number}px` | number;
};
