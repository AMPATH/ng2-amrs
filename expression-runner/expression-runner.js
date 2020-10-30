var def = {
  run: run
};

module.exports = def;

function run(expression, scope) {
  var paramList = '';
  var argList = '';

  for (var o in scope) {
    paramList = paramList === '' ? paramList + o : paramList + ',' + o;
    argList =
      argList === ''
        ? argList + "scope['" + o + "']"
        : argList + ",scope['" + o + "']";
  }

  // prevent more than one return statements
  if (expression.indexOf('return') === -1) {
    expression = '"return ' + expression + '"';
  }

  var funcDeclarationCode =
    'var afeDynamicFunc = new Function("' +
    paramList +
    '", ' +
    expression +
    ');';
  var funcCallCode =
    'afeDynamicFunc.call(this ' + (argList === '' ? '' : ',' + argList) + ');';

  try {
    if (Object.keys(scope).indexOf('undefined') >= 0) {
      console.warn('Missing reference found', expression, scope);
      return false;
    }
    // console.info('results: ', expression, eval(funcDeclarationCode + funcCallCode));
    return eval(funcDeclarationCode + funcCallCode);
  } catch (e) {
    console.error('error occured running epxression', e);
    return undefined;
  }
}
