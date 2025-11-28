import { beforeAll, afterAll } from 'vitest';
import { existsSync, unlinkSync } from 'fs';

const TEST_DB_PATH = './data/test.db';

beforeAll(() => {
  // Set test database URL
  process.env.DATABASE_URL = TEST_DB_PATH;
});

afterAll(() => {
  // Clean up test database
  if (existsSync(TEST_DB_PATH)) {
    unlinkSync(TEST_DB_PATH);
  }
});
