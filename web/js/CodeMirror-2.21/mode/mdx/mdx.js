/*
 *	MySQL Mode for CodeMirror 2 by MySQL-Tools
 *	@author James Thorne (partydroid)
 *	@link 	http://github.com/partydroid/MySQL-Tools
 * 	@link 	http://mysqltools.org
 *	@version 02/Jan/2012
*/
CodeMirror.defineMode("mdx", function(config) {
  var indentUnit = config.indentUnit;
  var curPunc;

  function wordRegexp(words) {
    return new RegExp("^(?:" + words.join("|") + ")$", "i");
  }
  
  var MDXParser = (function()
			{
			    return {
			        //List of functions will be dynamically loaded
			        functions : wordRegexp([]),
			        //List of custom links will be dynamically loaded
			        customLinks: wordRegexp([]),

			        setFunctionList: function (funcList)
			        {
			            this.functions = wordRegexp(funcList);
			        },

			        setCustomLinks: function (customLinksList)
			        {
			            this.customLinks = wordRegexp(customLinksList);
			        }
			    }
			})();
  
  
  var ops = wordRegexp(["<", ">", "=", "<>", ">=","<=", "is", "not", "and", "xor", "or"]);
  var keywords = wordRegexp([
                             "AS","AXIS","BEGIN","BY","CALCULATED",
                             "CASE","CELL","CHAPTERS","COLUMNS","COMMIT","CONST","CREATE","CUBE","ELSE","DRILLTHROUGH","DROP","DYNAMIC",
                             "EMPTY","END","EXISTING","FROM","FUNCTION","MAXROWS","MEMBER","NON","ON","PAGES","RETURN","ROLLBACK","ROWS",
                             "SECTIONS","SELECT","SESSION","SET","STATIC","THEN","TRANSACTION","UPDATE","VISUAL","WHEN","WHERE","WITH",

                             "USE_EQUAL_ALLOCATION","USE_EQUAL_INCREMENT","USE_WEIGHTED_ALLOCATION","USE_WEIGHTED_INCREMENT",

                             "AFTER","ALL","ASC","BASC","BDESC","BEFORE","BEFORE_AND_AFTER","CONSTRAINED","DESC","EXCLUDEEMPTY",
                             "INCLUDEEMPTY","LEAVES","POST","RECURSIVE","SELF","SELF_AND_AFTER","SELF_AND_BEFORE","SELF_BEFORE_AFTER","TYPED",

                             "DIMENSION","PROPERTIES"
                         ]);
  var operatorChars = /[*+\-<>=:\/\^]/;

  function tokenBase(stream, state)
  {
      var ch = stream.next();
      if (ch == "/" && (stream.eat("/") || stream.eat("*"))
              || ch == "-" && stream.eat("-"))
      {
          var commentSign = stream.current();
          state.tokenize = tokenComment(commentSign);
          return state.tokenize(stream, state);
      }
      else
      {
          if (ch == "\"" || ch == "'" || ch == "`")
          {
              state.tokenize = tokenString(ch);
              return state.tokenize(stream, state);
          }
          else
          {
              if (ch == "," || ch == ";")
              {
                  return ch;
              }
              else
              {
                  if (ch == '-')
                  {
                      if (stream.eatWhile(/\d/))
                      {
                          if (stream.eat("."))
                          {
                              stream.eatWhile(/\d/);
                          }
                          return "number";
                      }
                      else
                      {
                          return "operator";
                      }
                  }
                  else
                  {
                      if (operatorChars.test(ch))
                      {
                          stream.eatWhile(operatorChars);
                          return "operator";
                      }
                      else
                      {
                          if (/\d/.test(ch))
                          {
                              stream.eatWhile(/\d/);
                              if (stream.eat("."))
                              {
                                  stream.eatWhile(/\d/);
                              }
                              return  "number";
                          }
                          else
                          {
                              if (/[\(\)\{\}]/.test(ch))
                              {
                                  return ch;
                              }
                              else
                              {
                                  if (/[\.&]/.test(ch))
                                  {
                                      return  "entity";
                                  }
                                  else
                                  {
                                      if (/[\[\]]/.test(ch))
                                      {
                                          if (ch == '[')
                                          {
                                              state.tokenize = tokenBrackets;
                                          }
                                          return  "entity";
                                      }
                                      else
                                      {
                                          stream.eatWhile(/[_\w\d]/);
                                          var word = stream.current(), style, type;
                                          if (ops.test(word))
                                          {
                                              style = "mdx-operator";
                                              type = "operator";
                                          }
                                          else
                                          {
                                              if (keywords.test(word))
                                              {
                                                  style = "mdx-keyword";
                                                  type = "keyword";
                                              }
                                              else
                                              {
                                                  if (MDXParser.functions.test(word))
                                                  {
                                                      style = "mdx-function";
                                                      type = "function";
                                                  }
                                                  else
                                                  {
                                                      style = "mdx-entity";
                                                      type = "entity";
                                                  }
                                              }
                                          }
                                          return type;
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
          }
      }
  }  
  
  function tokenBrackets(stream, state)
  {
      if (stream.skipTo("]"))
      {
          state.tokenize = tokenBase;
      }
      else
      {
          stream.skipToEnd();
      }
      return "entity";
  }
  
  
  function tokenString(quote)
  {
      return function(stream, state)
      {
          var escaped = false, ch;
          while ((ch = stream.next()) != null)
          {
              if (ch == quote && !escaped)
              {
                  break;
              }
              escaped = !escaped && ch == "\\";
          }
          if (!escaped)
          {
              state.tokenize = tokenBase;
          }
          return "string";
      };
  }
  
//  function tokenBase(stream, state) {
//    var ch = stream.next();
//    curPunc = null;
//    if (ch == "$" || ch == "?") {
//      stream.match(/^[\w\d]*/);
//      return "variable-2";
//    }
//    else if (ch == "<" && !stream.match(/^[\s\u00a0=]/, false)) {
//      stream.match(/^[^\s\u00a0>]*>?/);
//      return "atom";
//    }
//    else if (ch == "\"" || ch == "'") {
//      state.tokenize = tokenLiteral(ch);
//      return state.tokenize(stream, state);
//    }
//    else if (ch == "`") {
//      state.tokenize = tokenOpLiteral(ch);
//      return state.tokenize(stream, state);
//    }
//    else if (/[{}\(\),\.;\[\]]/.test(ch)) {
//      curPunc = ch;
//      return null;
//    }
//    else if (ch == "-") {
//		ch2 = stream.next();
//		if(ch2=="-")
//		{
//			stream.skipToEnd();
//			return "comment";
//		}
//
//    }
//    else if (operatorChars.test(ch)) {
//      stream.eatWhile(operatorChars);
//      return null;
//    }
//    else if (ch == ":") {
//      stream.eatWhile(/[\w\d\._\-]/);
//      return "atom";
//    }
//    else {
//      stream.eatWhile(/[_\w\d]/);
//      if (stream.eat(":")) {
//        stream.eatWhile(/[\w\d_\-]/);
//        return "atom";
//      }
//      var word = stream.current(), type;
//      if (ops.test(word))
//        return null;
//      else if (keywords.test(word))
//        return "keyword";
//      else
//        return "variable";
//    }
//  }

  function tokenLiteral(quote) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          state.tokenize = tokenBase;
          break;
        }
        escaped = !escaped && ch == "\\";
      }
      return "string";
    };
  }

  function tokenOpLiteral(quote) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          state.tokenize = tokenBase;
          break;
        }
        escaped = !escaped && ch == "\\";
      }
      return "variable-2";
    };
  }


  function pushContext(state, type, col) {
    state.context = {prev: state.context, indent: state.indent, col: col, type: type};
  }
  function popContext(state) {
    state.indent = state.context.indent;
    state.context = state.context.prev;
  }

  return {
    startState: function(base) {
      return {tokenize: tokenBase,
              context: null,
              indent: 0,
              col: 0};
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (state.context && state.context.align == null) state.context.align = false;
        state.indent = stream.indentation();
      }
      if (stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);

      if (style != "comment" && state.context && state.context.align == null && state.context.type != "pattern") {
        state.context.align = true;
      }

      if (curPunc == "(") pushContext(state, ")", stream.column());
      else if (curPunc == "[") pushContext(state, "]", stream.column());
      else if (curPunc == "{") pushContext(state, "}", stream.column());
      else if (/[\]\}\)]/.test(curPunc)) {
        while (state.context && state.context.type == "pattern") popContext(state);
        if (state.context && curPunc == state.context.type) popContext(state);
      }
      else if (curPunc == "." && state.context && state.context.type == "pattern") popContext(state);
      else if (/atom|string|variable/.test(style) && state.context) {
        if (/[\}\]]/.test(state.context.type))
          pushContext(state, "pattern", stream.column());
        else if (state.context.type == "pattern" && !state.context.align) {
          state.context.align = true;
          state.context.col = stream.column();
        }
      }

      return style;
    },

    indent: function(state, textAfter) {
      var firstChar = textAfter && textAfter.charAt(0);
      var context = state.context;
      if (/[\]\}]/.test(firstChar))
        while (context && context.type == "pattern") context = context.prev;

      var closing = context && firstChar == context.type;
      if (!context)
        return 0;
      else if (context.type == "pattern")
        return context.col;
      else if (context.align)
        return context.col + (closing ? 0 : 1);
      else
        return context.indent + (closing ? 0 : indentUnit);
    }
  };
});




CodeMirror.defineMIME("text/x-mysql", "mysql");
