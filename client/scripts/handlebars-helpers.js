var Handlebars = require('hbsfy/runtime');
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

Handlebars.registerHelper('join', function (array, separator) {
  return array.join(separator);
});

Handlebars.registerHelper('upperCase', function (content) {
  return content.toUpperCase();
});

Handlebars.registerHelper('addCommas', function (content) {
  return content.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

Handlebars.registerHelper('capitalLetter', function (content) {
  return content.charAt(0).toUpperCase() + content.slice(1);
});

// Handlebars.registerHelper('delegateCheck', function (num) {
//   if (num > 0);
//     return num;
// });

Handlebars.registerHelper('formatdateclass', function (date) {
  var newDate = new Date(date);

  if (isNaN(Number(newDate))) {
    newDate = null;
  }

  var html = '';

  if (newDate !== null) {
    html = months[newDate.getUTCMonth()];
    html += newDate.getUTCDate();
  }

  return new Handlebars.SafeString(html);
});

Handlebars.registerHelper('formatdatedisplay', function (date) {
  var newDate = new Date(date);

  if (isNaN(Number(newDate))) {
    newDate = null;
  }

  var html = '';

  if (newDate !== null) {
    html = months[newDate.getUTCMonth()];
    html += ' ' + newDate.getUTCDate();
  }
  // console.log(newDate.getUTCDate())
  return new Handlebars.SafeString(html);
});

Handlebars.registerHelper('href', function (text) {
  if (!text) {
    return '';
  }

  var uuid = /^uuid\:\/{2}/;

  if (uuid.test(text)) {
    return 'http://www.ft.com/cms/0/' + text.split(uuid)[1] + '.html';
  }

  return text;
});

Handlebars.createGlobalHelper = function (name, hash, commands) {
  commands = commands || {};
  Handlebars.registerHelper(name, function (context) {
    if (!context) {
      return '';
    }

    var c = context.toString();
    var val = hash[c];
    var fn = typeof commands[c] === 'function' ? commands[c] : null;

    if (fn) {
      context = val;
      val = fn.apply(this, arguments);
    }

    return val;
  });
};

// Handlebars.createOptionsHelper = function(options, commands) {
//   var isAbsURL = /^https?:\/\//;
//   var o = {
//     'image.baseURL': function(baseURL, filename) {
//       baseURL = baseURL || 'images/content';
//       return isAbsURL.test(filename) ? filename : (baseURL + '/' + filename).replace(/[^:]\/{2,}/, '/');
//     }
//   };
//   Handlebars.Utils.extend(o, commands);
//   Handlebars.createGlobalHelper('options', options, o);
// };

Handlebars.createOptionsHelpers = function (options) {
  Handlebars.registerHelper('option', function (optName) {
    return options[optName];
  });
};

Handlebars.registerHelper('linebreaks', function (text) {
  if (!text) {
    return '';
  }

  var html = text.replace(/\n/g, '<br><br>');

  return new Handlebars.SafeString(html);
});
