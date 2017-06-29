/* eslint-disable no-unused-expressions */

import { compilePattern, normalizeRoutes, compileMatchMount } from '../src/utils';

describe('micro-router', () => {
  describe('compilePattern', () => {
    describe('Match all pattern: *', () => {
      const matcher = compilePattern('*');
      it('should match /toto', () => {
        expect(matcher('/toto')).toEqual({});
      });
      it('should match anything', () => {
        expect(matcher('anything')).toEqual({});
      });
    });
    describe('RegExp pattern: /^\\/posts\\/(\\w+)\\/(\\w+)\\/edit$/', () => {
      const matcher = compilePattern(/^\/posts\/(\w+)\/(\w+)\/edit$/);
      it('should match /posts/foo/bar/edit', () => {
        expect(matcher('/posts/foo/bar/edit')).toEqual({});
      });
      it('should NOT match /posts/foo/bar/editNO', () => {
        expect(matcher('/posts/foo/bar/editNO')).toBe(false);
      });
      it('should NOT match /posts/foo/bar/edit/NO', () => {
        expect(matcher('/posts/foo/bar/editNO')).toBe(false);
      });
      it('should NOT match /posts/foo/bar', () => {
        expect(matcher('/posts/foo/bar')).toBe(false);
      });
    });
    describe('Params pattern: /repos/:owner/:name/edit', () => {
      const matcher = compilePattern('/repos/:owner/:name/edit');
      it('should match /repos/topheman/rsjs-experiments/edit', () => {
        expect(matcher('/repos/topheman/rsjs-experiments/edit')).toBeTruthy();
      });
      it('should match the params from /repos/topheman/rsjs-experiments/edit', () => {
        expect(matcher('/repos/topheman/rxjs-experiments/edit')).toEqual({
          owner: 'topheman',
          name: 'rxjs-experiments'
        });
      });
      it('should NOT match /repo/reactjs/redux', () => {
        expect(matcher('/repo/reactjs/redux')).toBe(false);
      });
      it('should NOT match /repo/reactjs/redux/display', () => {
        expect(matcher('/repo/reactjs/redux/display')).toBe(false);
      });
      it('should NOT match /repo/reactjs', () => {
        expect(matcher('/repo/reactjs')).toBe(false);
      });
      it('should NOT match /repo', () => {
        expect(matcher('/repo/reactjs')).toBe(false);
      });
    });
    describe('Plain string patter: /hello/world', () => {
      const matcher = compilePattern('/hello/world');
      it('should match /hello/world', () => {
        expect(matcher('/hello/world')).toEqual({});
      });
      it('should NOT match /hello/world/NOT', () => {
        expect(matcher('/hello/world/NOT')).toBe(false);
      });
      it('should NOT match /hello', () => {
        expect(matcher('/hello')).toBe(false);
      });
    });
  });
  describe('normalizeRoutes', () => {
    describe('sanity checks', () => {
      it('should NOT throw when pattern and handler attribute are present', () => {
        expect(() => normalizeRoutes([
          { pattern: 'foo', handler: () => ({}) }
        ])).not.toThrowError();
      });
      it('should throw when handler attribute is missing', () => {
        expect(() => normalizeRoutes([
          { pattern: 'foo' }
        ])).toThrowError();
      });
      it('should throw when pattern attribute is missing', () => {
        expect(() => normalizeRoutes([
          { handler: () => ({}) }
        ])).toThrowError();
      });
      it('should throw if resolve attribute is not a promise', () => {
        expect(() => normalizeRoutes([
          { pattern: 'foo', handler: () => ({}), resolve: {} }
        ])).toThrowError();
      });
      it('should NOT throw if resolve attribute is a promise', () => {
        expect(() => normalizeRoutes([
          { pattern: 'foo', handler: () => ({}), resolve: { then: () => ({}) } }
        ])).not.toThrowError();
      });
    });
    describe('mapping - normalizeRoutes(routes)', () => {
      const routes = [
        { pattern: '/hello/world', handler: () => ({}) },
        { pattern: /^\/hie\/universe/, handler: () => ({}) },
        { pattern: '/hello/:name', handler: () => ({}) },
        { pattern: '*', handler: () => ({}) }
      ];
      it('should return a array', () => {
        expect(normalizeRoutes(routes)).toHaveLength(4);
      });
      it('should return a populated array', () => {
        const normalizedRoutes = normalizeRoutes(routes);
        expect(normalizedRoutes[0]).toMatchSnapshot();
        expect(normalizedRoutes[1]).toMatchSnapshot();
        expect(normalizedRoutes[2]).toMatchSnapshot();
        expect(normalizedRoutes[3]).toMatchSnapshot();
      });
    });
  });
  describe('compileMatchMount', () => {
    const routes = [
      { pattern: '/hello/world', handler: () => ({}) },
      { pattern: /^\/hie\/universe/, handler: () => ({}) },
      { pattern: '/hello/:name', handler: () => ({}) },
      { pattern: '*', handler: () => ({}) }
    ];
    const matchMount = compileMatchMount(normalizeRoutes(routes));
    it('should match /hello/world', () => {
      expect(matchMount('/hello/world')).toMatchSnapshot();
      expect(matchMount('/hello/world').params).toEqual({});
    });
    it('should match /hie/universe', () => {
      expect(matchMount('/hie/universe')).toMatchSnapshot();
      expect(matchMount('/hie/universe').params).toEqual({});
    });
    it('should match /hello/topheman', () => {
      expect(matchMount('/hello/topheman')).toMatchSnapshot();
      expect(matchMount('/hello/topheman').params).toEqual({ name: 'topheman' });
    });
    it('should match /whatever', () => {
      expect(matchMount('/whatever')).toMatchSnapshot();
      expect(matchMount('/whatever').params).toEqual({});
    });
  });
});
