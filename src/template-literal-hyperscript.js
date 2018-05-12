const matcher = /^(\s*)(\S*)\s*(\S.*[\n]?)?$/;
const textMatcher = /^(\s*)\$(.*[\n]?)?$/;

const appendOrConcatenate = (arr, item) => {
  if (arr.length && typeof arr[arr.length-1] == 'string' && typeof item == 'string') {
    arr[arr.length-1] = arr[arr.length-1] + item;
    return arr;
  }
  return arr.concat(item);      
}

export const splitLines = (strs, ...params) => strs.reduce((a, str, i) => {
    str.split('\n').forEach((p, j, pcs) => {
      a[a.length - 1] = appendOrConcatenate(a[a.length - 1], p);
      if (j < pcs.length - 1) a.push([]);
    });
    if (params && i < params.length) {
      a[a.length - 1] = appendOrConcatenate(a[a.length - 1], params[i]);
    }
    return a;
  }, [[]]);
  
let getAttrs = row => {
  let matches = row[0].match(matcher);
  let tms = row[0].match(textMatcher);
  let attrs = {
    _wsl: (tms?tms[1]:matches[1]).length,
    children: []
  }
  if (tms) {
    attrs.text = tms[2];
    return attrs;
  }
  attrs.element = matches[2];
  if (matches[3]) attrs.children.push(matches[3]);
  attrs.children.push(...row.slice(1,row.length));
  return attrs;
};
  
const assembleAll = (hyperscript, stack) => stack.reduceRight((a,elem, idx, arr) => {
    if (idx == arr.length - 1 || elem._wsl == arr[idx+1]._wsl) {
      return [assembleElement(hyperscript, elem)].concat(a);
    }
    elem.children.push(...a);
    return [assembleElement(hyperscript, elem)];
  }, []);
  
const assembleElement = (hyperscript, elem) => {
  if (elem.hasOwnProperty('_wsl')) {
    if (elem.hasOwnProperty('text')) {
      return elem.text;
    }
    if (elem.hasOwnProperty('element')) {
      return hyperscript(elem.element, ...elem.children);
    }
  }
  return elem;
};

export const templateLiteralHyperscript = hyperscript => function(strs, ...params) {
  let stack = splitLines(strs, ...params).map(getAttrs).reduce((stack, elem, i) => {
    if (i && elem._wsl < stack[stack.length-1]._wsl) {
      let chop = stack.findIndex(f => f._wsl > elem._wsl);
      stack[chop-1].children.push(assembleAll(hyperscript, stack.slice(chop,stack.length)));
      stack.length = chop;
    }
    return stack.concat(elem);
  }, []);
  let total = assembleAll(hyperscript, stack);
  return typeof total == 'array' ? total : total[0];
};