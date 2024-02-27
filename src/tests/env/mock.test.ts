import { NODE_ENV } from '../../config';

describe('environmental variables', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  test('will receive process.env variables', () => {
    // Set the variables
    expect(process.env.NODE_ENV).toBe(NODE_ENV);
  });
});
