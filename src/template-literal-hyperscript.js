const templateLiteralHyperscript = {
  greet() {
    return 'hello';
  },
  splitLines(strs, ...params) {
    let appendOrConcatenate = (arr, item) => {
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
  }
};

export default templateLiteralHyperscript;
