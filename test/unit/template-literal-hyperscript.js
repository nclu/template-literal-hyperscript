import {defaultConfig, splitLines, templateLiteralHyperscript} from '../../src/template-literal-hyperscript';
import hyperscript from 'hyperscript';

describe('templateLiteralHyperscript', () => {
  describe('Split lines function', () => {
    beforeEach(() => {
    });

    it('splits up a template into an array', () => {
      let output = splitLines`div`;
      expect(output).to.deep.equal([['div']]);
      output = splitLines`div
        span`;
      expect(output).to.deep.equal([['div'],['        span']]);
      output = splitLines`div${{class: 'test-class'}} cheese`;
      expect(output).to.deep.equal([['div',{class: 'test-class'}, ' cheese']]);
    });
    
    it('combines neighboring strings for its inputs', () => {
      let output = splitLines`div.${'test-class'}`;
      expect(output).to.deep.equal([['div.test-class']]);
    });
  });
  describe('the wrapper', () => {
    it('gets the same output as hyperscript', () => {      
      let t = templateLiteralHyperscript(hyperscript);
      
      expect(
        t`foo`.outerHTML
      ).to.eql(
        hyperscript('foo').outerHTML
      );
      
      expect(
        t`div hello world`.outerHTML
      ).to.eql(
        hyperscript('div', 'hello world').outerHTML
      );
      
      expect(
        t`div
            strong hello world`.outerHTML
      ).to.eql(
        hyperscript('div', 
          hyperscript('strong', 'hello world')
        ).outerHTML
      );
      
      expect(
        t`div${{class: 'nav-link'}}
            a${{href:'/home'}}hello world`.outerHTML
      ).to.eql(
        hyperscript('div', {class: 'nav-link'}, 
          hyperscript('a', {href:'/home'}, 'hello world')
        ).outerHTML
      );
      
      expect(
        t`ul
            li one
            li two`.outerHTML
      ).to.eql(
        hyperscript('ul', 
          hyperscript('li', 'one'),
          hyperscript('li', 'two')
        ).outerHTML
      );
      
      console.log('test multiple branches');
      expect(
        t`div
            h1 title
              small sub-title
                a ${{href:'/view/1'}}show
            ul
              li one
              li two`.outerHTML
      ).to.eql(
        hyperscript('div',
          hyperscript('h1', 'title',
            hyperscript('small','sub-title',
              hyperscript('a',{href:'/view/1'},'show')
            )
          ),
          hyperscript('ul', 
            hyperscript('li', 'one'),
            hyperscript('li', 'two')
          )
        ).outerHTML
      );
    });
  });
});
