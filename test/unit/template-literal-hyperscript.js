import templateLiteralHyperscript from '../../src/template-literal-hyperscript';

describe('templateLiteralHyperscript', () => {
  describe('Split lines function', () => {
    beforeEach(() => {
    });

    it('splits up a template into an array', () => {
      let output = templateLiteralHyperscript.splitLines`div`;
      expect(output).to.deep.equal([['div']]);
      output = templateLiteralHyperscript.splitLines`div
        span`;
      expect(output).to.deep.equal([['div'],['        span']]);
      output = templateLiteralHyperscript.splitLines`div${{class: 'test-class'}} cheese`;
      expect(output).to.deep.equal([['div',{class: 'test-class'}, ' cheese']]);
    });
    
    it('combines neighboring strings for its inputs', () => {
      let output = templateLiteralHyperscript.splitLines`div.${'test-class'}`;
      expect(output).to.deep.equal([['div.test-class']]);
    });
  });
});
