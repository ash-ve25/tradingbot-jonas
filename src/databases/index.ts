import { DB_PASSWORD, DB_URL, DB_USERNAME, LOCAL_DB_URL, NODE_ENV } from '@config';

export const dbConnection = {
  url: NODE_ENV == 'local' ? LOCAL_DB_URL : `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}${DB_URL}`,
  options: {},
};
