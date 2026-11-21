import * as api from './index';

describe('@gentleslime/core', () => {
  it('loads its entry point', () => {
    expect(api).toBeTypeOf('object');
  });
});
