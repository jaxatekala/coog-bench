var BENCH_MODEL = 'bench';

function parseBenchRes(value) {
  var newlst = [];
  var ret = {};
  var lst = value.split(',');
  if (lst.length != 4) {
    return;
  }
  var removeChar = function (str, start, stop) {
    if (!stop) {
      stop = start;
    }
    if (str.startsWith(start)) {
      str = str.substr(1, str.length - 1);
    }
    if (str.endsWith(stop)) {
      str = str.substr(0, str.length - 1);
    }
    return str;
  };
  lst.forEach((str) => {
    newlst.push(removeChar(str, ' '));
  });
  ret.iter = newlst[0].split(' ')[0];
  ret.avg = newlst[1].split(' : ')[1];
  ret.min = removeChar(newlst[2].split(' ')[2], '(', ')');
  ret.max = removeChar(newlst[3].split(' ')[1], '(', ')');
  return ret;
}
var call = exports.call = function (session, method) {
  return session.rpc('model.' + BENCH_MODEL + '.' + method);
};
exports.list = function (session) {
  return call(session, 'list');
};
exports.execute = function (session, method, conserveData) {
  return call(session, method)
    .then((ret) => {
      if (!conserveData) {
        return parseBenchRes(ret);
      }
    });
};
