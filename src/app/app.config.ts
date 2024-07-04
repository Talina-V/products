export enum TITLES_FORM {
  NAME = 'Name',
  EXPIRATION_TYPE = 'Expiration type',
  MANUFACTURE_DATE = 'Manufacture date',
  EXPIRATION_DATE = 'Expiration date',
  COMMENT = 'Comment',
}

export const REGEXP_PATTERNS = {
  name: /^[a-zA-Z|'|-]{2,50}$/,
  dateFormat: /^\d{4}\-\d{2}\-\d{2}$/,
};
