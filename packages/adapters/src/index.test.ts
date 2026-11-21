import * as api from './index';

describe('@gentleslime/adapters', () => {
  it('loads its entry point', () => {
    expect(api).toBeTypeOf('object');
  });
});
