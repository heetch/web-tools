export type FormRow<K extends string> = {
  cells: FormCell<K>[]
}

export type FormCell<K extends string> = {
  field: K;
  widthConstraint?: `${number}px` | number;
}
