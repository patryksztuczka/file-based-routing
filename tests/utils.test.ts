import { extractParameterName } from '../src/utils/helpers';
import { DYNAMIC_ROUTE_REGEX } from '../src/utils/regex';

describe('Dynamic Route Regex', () => {
  it('should match dynamic route patterns', () => {
    expect('[userId]').toMatch(DYNAMIC_ROUTE_REGEX);
    expect('[bookId]').toMatch(DYNAMIC_ROUTE_REGEX);
    expect('[id]').toMatch(DYNAMIC_ROUTE_REGEX);
    expect('[productId]').toMatch(DYNAMIC_ROUTE_REGEX);
  });

  it('should not match non-dynamic patterns', () => {
    expect('userId').not.toMatch(DYNAMIC_ROUTE_REGEX);
    expect('index.ts').not.toMatch(DYNAMIC_ROUTE_REGEX);
    expect('users').not.toMatch(DYNAMIC_ROUTE_REGEX);
    expect('[123]').not.toMatch(DYNAMIC_ROUTE_REGEX); // numbers not allowed
    expect('[user-id]').not.toMatch(DYNAMIC_ROUTE_REGEX); // hyphens not allowed
  });

  it('should extract parameter names correctly', () => {
    const testCases = [
      { input: '[userId]', expected: 'userId' },
      { input: '[bookId]', expected: 'bookId' },
      { input: '[id]', expected: 'id' }
    ];

    testCases.forEach(({ input, expected }) => {
      const result = extractParameterName(input);
      expect(result).toBe(expected);
    });
  });
});
