export const defaultConfig = {
  matcher: /^(\s*)(\S*)\s*(\S.*)?$/,
  textMatcher: /^(\s*)\$(.*)?$/
};

const appendOrConcatenate = (arr, item) => {
  if (arr.length) {
    if (typeof arr[arr.length-1] == 'string' && typeof item == 'string') {
      arr[arr.length-1] = arr[arr.length-1] + item;
      return arr;
    }
    if (typeof arr[arr.length-1] == 'object' && typeof item == 'object') {
      arr[arr.length-1] = Object.assign({}, arr[arr.length-1], item);
      return arr;
    }
  }
  arr.push(item);
  return arr;      
}

export const splitLines = function(strs, ...params) {      
  return strs.reduce((a, str, i) => {
    let pcs = str.split('\n')
    pcs.forEach((p,j) => {
      let t = a[a.length - 1];
      a[a.length - 1] = appendOrConcatenate(a[a.length - 1], p);
      if (j < pcs.length - 1) a.push([]);
    });
    if (params && i < params.length) {
      a[a.length - 1] = appendOrConcatenate(a[a.length - 1], params[i]);
    }
    return a;
  }, [[]]);
};

export const templateLiteralHyperscript = function(hyperscript) {
  return function lh(strs, ...params) {
    let lines = splitLines(strs, ...params);

    let stack = lines.map(getAttrs).reduce((stack, elem, i) => {
      //console.log(`${elem.whiteSpace} ${elem.element}-${elem.children.length}`, stack.map(l => `${l.whiteSpace} ${l.element}-${l.children.length}`))
      if (i && elem.whiteSpace < stack[stack.length-1].whiteSpace) {
        let chop = stack.findIndex(f => f.whiteSpace > elem.whiteSpace)
        let t = assembleAll(stack.slice(chop,stack.length));
        stack[chop-1].children.push(t);
        stack.length = chop;
        stack.push(elem);
      } else {
        //if (elem.whiteSpace == stack[stack.length-1].whiteSpace) {
        //  stack[stack.length-1] = assembleElement(stack[stack.length-1]);
        //}
        stack.push(elem);
      }
      return stack;
    }, []);
    return assembleAll(stack);
  };
  
  function assembleAll(stack) {
    
    return stack.reduceRight((a,elem, idx, arr) => {
      if (idx == 0) {
        elem.children.push(...a);
        return assembleElement(elem);
      }
      if (idx == arr.length - 1 || elem.whiteSpace == arr[idx+1].whiteSpace) {
        a.unshift(assembleElement(elem));
        return a;
      }
      elem.children.push(...a);
      return [assembleElement(elem)];
    }, []);
  }
    
  function assembleElement(elem) {
    if (elem.hasOwnProperty('whiteSpace')) {
      if (elem.hasOwnProperty('text')) {
        return elem.text;
      }
      if (elem.hasOwnProperty('element')) {
        return hyperscript(elem.element, ...elem.children);
      }
    }
    return elem;
  }
  
  function getAttrs(row) {
    let matches = row[0].match(defaultConfig.matcher);
    let attrs = {
      whiteSpace: matches[1].length,
      element: matches[2],
      children: []
    }
    if (matches[3]) attrs.children.push(matches[3]);
    attrs.children.push(...row.slice(1,row.length));
    return attrs;
  }
};
