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
      expect(
        t`div#page
            div#header
              h1.classy ${{style: {'background-color': '#22f'}}}h
            div#menu${{style: {'background-color': '#2f2'}}}
              ul
                li one
                li two
                li three
            h2 ${{style: {'background-color': '#f22'}}}content title
            p
              $so it's just like a templating engine,${'\n'}
              $but easy to use inline with javascript
            p
              $the intention is for this to be used to create${'\n'}
              $reusable, interactive html widgets.`.outerHTML
      ).to.eql(
        hyperscript(
            'div#page',
            hyperscript(
                'div#header',
                hyperscript(
                    'h1.classy',
                    'h',
                    {style: {'background-color': '#22f'}}
                )
            ),
            hyperscript(
                'div#menu',
                {style: {'background-color': '#2f2'}},
                hyperscript(
                    'ul',
                    hyperscript('li', 'one'),
                    hyperscript('li', 'two'),
                    hyperscript('li', 'three')
                )
            ),
            hyperscript(
                'h2',
                'content title',
                {style: {'background-color': '#f22'}}
            ),
            hyperscript(
                'p',
                'so it\'s just like a templating engine,\n',
                'but easy to use inline with javascript'
            ),
            hyperscript(
                'p',
                'the intention is for this to be used to create\n',
                'reusable, interactive html widgets.'
            )
        ).outerHTML
      );
    });
    it('Is pretty chill with escaping a line of raw text using $', () => {      
      let t = templateLiteralHyperscript(hyperscript);
    
      expect(
        t`p
            $This is my content`.outerHTML
      ).to.eql(
        hyperscript('p', 'This is my content').outerHTML
      );
    });
  });
});
