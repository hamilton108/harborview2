var PS =
(() => {
  // output/Control.Semigroupoid/index.js
  var semigroupoidFn = {
    compose: function(f) {
      return function(g) {
        return function(x) {
          return f(g(x));
        };
      };
    }
  };

  // output/Control.Category/index.js
  var identity = function(dict) {
    return dict.identity;
  };
  var categoryFn = {
    identity: function(x) {
      return x;
    },
    Semigroupoid0: function() {
      return semigroupoidFn;
    }
  };

  // output/Data.Boolean/index.js
  var otherwise = true;

  // output/Data.Function/index.js
  var on = function(f) {
    return function(g) {
      return function(x) {
        return function(y) {
          return f(g(x))(g(y));
        };
      };
    };
  };
  var flip = function(f) {
    return function(b) {
      return function(a) {
        return f(a)(b);
      };
    };
  };
  var $$const = function(a) {
    return function(v) {
      return a;
    };
  };

  // output/Data.Functor/foreign.js
  var arrayMap = function(f) {
    return function(arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(arr[i]);
      }
      return result;
    };
  };

  // output/Data.Unit/foreign.js
  var unit = void 0;

  // output/Type.Proxy/index.js
  var $$Proxy = /* @__PURE__ */ function() {
    function $$Proxy2() {
    }
    ;
    $$Proxy2.value = new $$Proxy2();
    return $$Proxy2;
  }();

  // output/Data.Functor/index.js
  var map = function(dict) {
    return dict.map;
  };
  var mapFlipped = function(dictFunctor) {
    var map16 = map(dictFunctor);
    return function(fa) {
      return function(f) {
        return map16(f)(fa);
      };
    };
  };
  var $$void = function(dictFunctor) {
    return map(dictFunctor)($$const(unit));
  };
  var functorArray = {
    map: arrayMap
  };

  // output/Control.Apply/index.js
  var identity2 = /* @__PURE__ */ identity(categoryFn);
  var apply = function(dict) {
    return dict.apply;
  };
  var applySecond = function(dictApply) {
    var apply1 = apply(dictApply);
    var map16 = map(dictApply.Functor0());
    return function(a) {
      return function(b) {
        return apply1(map16($$const(identity2))(a))(b);
      };
    };
  };

  // output/Control.Applicative/index.js
  var pure = function(dict) {
    return dict.pure;
  };
  var liftA1 = function(dictApplicative) {
    var apply3 = apply(dictApplicative.Apply0());
    var pure13 = pure(dictApplicative);
    return function(f) {
      return function(a) {
        return apply3(pure13(f))(a);
      };
    };
  };

  // output/Control.Bind/index.js
  var bind = function(dict) {
    return dict.bind;
  };
  var bindFlipped = function(dictBind) {
    return flip(bind(dictBind));
  };
  var composeKleisliFlipped = function(dictBind) {
    var bindFlipped1 = bindFlipped(dictBind);
    return function(f) {
      return function(g) {
        return function(a) {
          return bindFlipped1(f)(g(a));
        };
      };
    };
  };

  // output/Control.Monad/index.js
  var ap = function(dictMonad) {
    var bind7 = bind(dictMonad.Bind1());
    var pure10 = pure(dictMonad.Applicative0());
    return function(f) {
      return function(a) {
        return bind7(f)(function(f$prime) {
          return bind7(a)(function(a$prime) {
            return pure10(f$prime(a$prime));
          });
        });
      };
    };
  };

  // output/Control.Monad.Reader.Class/index.js
  var ask = function(dict) {
    return dict.ask;
  };

  // output/Data.Semigroup/foreign.js
  var concatArray = function(xs) {
    return function(ys) {
      if (xs.length === 0)
        return ys;
      if (ys.length === 0)
        return xs;
      return xs.concat(ys);
    };
  };

  // output/Data.Symbol/index.js
  var reflectSymbol = function(dict) {
    return dict.reflectSymbol;
  };

  // output/Record.Unsafe/foreign.js
  var unsafeGet = function(label4) {
    return function(rec) {
      return rec[label4];
    };
  };
  var unsafeSet = function(label4) {
    return function(value13) {
      return function(rec) {
        var copy = {};
        for (var key in rec) {
          if ({}.hasOwnProperty.call(rec, key)) {
            copy[key] = rec[key];
          }
        }
        copy[label4] = value13;
        return copy;
      };
    };
  };

  // output/Data.Semigroup/index.js
  var semigroupArray = {
    append: concatArray
  };
  var append = function(dict) {
    return dict.append;
  };

  // output/Control.Alt/index.js
  var alt = function(dict) {
    return dict.alt;
  };

  // output/Data.Bounded/foreign.js
  var topChar = String.fromCharCode(65535);
  var bottomChar = String.fromCharCode(0);
  var topNumber = Number.POSITIVE_INFINITY;
  var bottomNumber = Number.NEGATIVE_INFINITY;

  // output/Data.Ord/foreign.js
  var unsafeCompareImpl = function(lt) {
    return function(eq4) {
      return function(gt) {
        return function(x) {
          return function(y) {
            return x < y ? lt : x === y ? eq4 : gt;
          };
        };
      };
    };
  };
  var ordIntImpl = unsafeCompareImpl;
  var ordNumberImpl = unsafeCompareImpl;
  var ordCharImpl = unsafeCompareImpl;

  // output/Data.Eq/foreign.js
  var refEq = function(r1) {
    return function(r2) {
      return r1 === r2;
    };
  };
  var eqBooleanImpl = refEq;
  var eqIntImpl = refEq;
  var eqNumberImpl = refEq;
  var eqCharImpl = refEq;
  var eqStringImpl = refEq;

  // output/Data.Eq/index.js
  var eqString = {
    eq: eqStringImpl
  };
  var eqRowNil = {
    eqRecord: function(v) {
      return function(v1) {
        return function(v2) {
          return true;
        };
      };
    }
  };
  var eqRecord = function(dict) {
    return dict.eqRecord;
  };
  var eqRec = function() {
    return function(dictEqRecord) {
      return {
        eq: eqRecord(dictEqRecord)($$Proxy.value)
      };
    };
  };
  var eqNumber = {
    eq: eqNumberImpl
  };
  var eqInt = {
    eq: eqIntImpl
  };
  var eqChar = {
    eq: eqCharImpl
  };
  var eqBoolean = {
    eq: eqBooleanImpl
  };
  var eq = function(dict) {
    return dict.eq;
  };
  var eq2 = /* @__PURE__ */ eq(eqBoolean);
  var eqRowCons = function(dictEqRecord) {
    var eqRecord1 = eqRecord(dictEqRecord);
    return function() {
      return function(dictIsSymbol) {
        var reflectSymbol2 = reflectSymbol(dictIsSymbol);
        return function(dictEq) {
          var eq32 = eq(dictEq);
          return {
            eqRecord: function(v) {
              return function(ra) {
                return function(rb) {
                  var tail2 = eqRecord1($$Proxy.value)(ra)(rb);
                  var key = reflectSymbol2($$Proxy.value);
                  var get3 = unsafeGet(key);
                  return eq32(get3(ra))(get3(rb)) && tail2;
                };
              };
            }
          };
        };
      };
    };
  };
  var notEq = function(dictEq) {
    var eq32 = eq(dictEq);
    return function(x) {
      return function(y) {
        return eq2(eq32(x)(y))(false);
      };
    };
  };

  // output/Data.Ordering/index.js
  var LT = /* @__PURE__ */ function() {
    function LT2() {
    }
    ;
    LT2.value = new LT2();
    return LT2;
  }();
  var GT = /* @__PURE__ */ function() {
    function GT2() {
    }
    ;
    GT2.value = new GT2();
    return GT2;
  }();
  var EQ = /* @__PURE__ */ function() {
    function EQ2() {
    }
    ;
    EQ2.value = new EQ2();
    return EQ2;
  }();
  var eqOrdering = {
    eq: function(v) {
      return function(v1) {
        if (v instanceof LT && v1 instanceof LT) {
          return true;
        }
        ;
        if (v instanceof GT && v1 instanceof GT) {
          return true;
        }
        ;
        if (v instanceof EQ && v1 instanceof EQ) {
          return true;
        }
        ;
        return false;
      };
    }
  };

  // output/Data.Ring/foreign.js
  var numSub = function(n1) {
    return function(n2) {
      return n1 - n2;
    };
  };

  // output/Data.Semiring/foreign.js
  var numAdd = function(n1) {
    return function(n2) {
      return n1 + n2;
    };
  };
  var numMul = function(n1) {
    return function(n2) {
      return n1 * n2;
    };
  };

  // output/Data.Semiring/index.js
  var zero = function(dict) {
    return dict.zero;
  };
  var semiringNumber = {
    add: numAdd,
    zero: 0,
    mul: numMul,
    one: 1
  };

  // output/Data.Ring/index.js
  var sub = function(dict) {
    return dict.sub;
  };
  var ringNumber = {
    sub: numSub,
    Semiring0: function() {
      return semiringNumber;
    }
  };
  var negate = function(dictRing) {
    var sub1 = sub(dictRing);
    var zero2 = zero(dictRing.Semiring0());
    return function(a) {
      return sub1(zero2)(a);
    };
  };

  // output/Data.Ord/index.js
  var ordNumber = /* @__PURE__ */ function() {
    return {
      compare: ordNumberImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqNumber;
      }
    };
  }();
  var ordInt = /* @__PURE__ */ function() {
    return {
      compare: ordIntImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqInt;
      }
    };
  }();
  var ordChar = /* @__PURE__ */ function() {
    return {
      compare: ordCharImpl(LT.value)(EQ.value)(GT.value),
      Eq0: function() {
        return eqChar;
      }
    };
  }();
  var compare = function(dict) {
    return dict.compare;
  };
  var greaterThanOrEq = function(dictOrd) {
    var compare3 = compare(dictOrd);
    return function(a1) {
      return function(a2) {
        var v = compare3(a1)(a2);
        if (v instanceof LT) {
          return false;
        }
        ;
        return true;
      };
    };
  };
  var max = function(dictOrd) {
    var compare3 = compare(dictOrd);
    return function(x) {
      return function(y) {
        var v = compare3(x)(y);
        if (v instanceof LT) {
          return y;
        }
        ;
        if (v instanceof EQ) {
          return x;
        }
        ;
        if (v instanceof GT) {
          return x;
        }
        ;
        throw new Error("Failed pattern match at Data.Ord (line 181, column 3 - line 184, column 12): " + [v.constructor.name]);
      };
    };
  };
  var min = function(dictOrd) {
    var compare3 = compare(dictOrd);
    return function(x) {
      return function(y) {
        var v = compare3(x)(y);
        if (v instanceof LT) {
          return x;
        }
        ;
        if (v instanceof EQ) {
          return x;
        }
        ;
        if (v instanceof GT) {
          return y;
        }
        ;
        throw new Error("Failed pattern match at Data.Ord (line 172, column 3 - line 175, column 12): " + [v.constructor.name]);
      };
    };
  };
  var clamp = function(dictOrd) {
    var min1 = min(dictOrd);
    var max1 = max(dictOrd);
    return function(low2) {
      return function(hi) {
        return function(x) {
          return min1(hi)(max1(low2)(x));
        };
      };
    };
  };
  var abs = function(dictOrd) {
    var greaterThanOrEq1 = greaterThanOrEq(dictOrd);
    return function(dictRing) {
      var zero2 = zero(dictRing.Semiring0());
      var negate1 = negate(dictRing);
      return function(x) {
        var $99 = greaterThanOrEq1(x)(zero2);
        if ($99) {
          return x;
        }
        ;
        return negate1(x);
      };
    };
  };

  // output/Data.Bounded/index.js
  var top = function(dict) {
    return dict.top;
  };
  var boundedChar = {
    top: topChar,
    bottom: bottomChar,
    Ord0: function() {
      return ordChar;
    }
  };
  var bottom = function(dict) {
    return dict.bottom;
  };

  // output/Data.Show/foreign.js
  var showIntImpl = function(n) {
    return n.toString();
  };
  var showNumberImpl = function(n) {
    var str = n.toString();
    return isNaN(str + ".0") ? str : str + ".0";
  };
  var showStringImpl = function(s) {
    var l = s.length;
    return '"' + s.replace(
      /[\0-\x1F\x7F"\\]/g,
      function(c, i) {
        switch (c) {
          case '"':
          case "\\":
            return "\\" + c;
          case "\x07":
            return "\\a";
          case "\b":
            return "\\b";
          case "\f":
            return "\\f";
          case "\n":
            return "\\n";
          case "\r":
            return "\\r";
          case "	":
            return "\\t";
          case "\v":
            return "\\v";
        }
        var k = i + 1;
        var empty4 = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
        return "\\" + c.charCodeAt(0).toString(10) + empty4;
      }
    ) + '"';
  };
  var showArrayImpl = function(f) {
    return function(xs) {
      var ss = [];
      for (var i = 0, l = xs.length; i < l; i++) {
        ss[i] = f(xs[i]);
      }
      return "[" + ss.join(",") + "]";
    };
  };

  // output/Data.Show/index.js
  var showString = {
    show: showStringImpl
  };
  var showRecordFields = function(dict) {
    return dict.showRecordFields;
  };
  var showRecord = function() {
    return function() {
      return function(dictShowRecordFields) {
        var showRecordFields1 = showRecordFields(dictShowRecordFields);
        return {
          show: function(record) {
            return "{" + (showRecordFields1($$Proxy.value)(record) + "}");
          }
        };
      };
    };
  };
  var showNumber = {
    show: showNumberImpl
  };
  var showInt = {
    show: showIntImpl
  };
  var showBoolean = {
    show: function(v) {
      if (v) {
        return "true";
      }
      ;
      if (!v) {
        return "false";
      }
      ;
      throw new Error("Failed pattern match at Data.Show (line 29, column 1 - line 31, column 23): " + [v.constructor.name]);
    }
  };
  var show = function(dict) {
    return dict.show;
  };
  var showArray = function(dictShow) {
    return {
      show: showArrayImpl(show(dictShow))
    };
  };
  var showRecordFieldsCons = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function(dictShowRecordFields) {
      var showRecordFields1 = showRecordFields(dictShowRecordFields);
      return function(dictShow) {
        var show16 = show(dictShow);
        return {
          showRecordFields: function(v) {
            return function(record) {
              var tail2 = showRecordFields1($$Proxy.value)(record);
              var key = reflectSymbol2($$Proxy.value);
              var focus2 = unsafeGet(key)(record);
              return " " + (key + (": " + (show16(focus2) + ("," + tail2))));
            };
          }
        };
      };
    };
  };
  var showRecordFieldsConsNil = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function(dictShow) {
      var show16 = show(dictShow);
      return {
        showRecordFields: function(v) {
          return function(record) {
            var key = reflectSymbol2($$Proxy.value);
            var focus2 = unsafeGet(key)(record);
            return " " + (key + (": " + (show16(focus2) + " ")));
          };
        }
      };
    };
  };

  // output/Data.Maybe/index.js
  var identity3 = /* @__PURE__ */ identity(categoryFn);
  var Nothing = /* @__PURE__ */ function() {
    function Nothing2() {
    }
    ;
    Nothing2.value = new Nothing2();
    return Nothing2;
  }();
  var Just = /* @__PURE__ */ function() {
    function Just2(value0) {
      this.value0 = value0;
    }
    ;
    Just2.create = function(value0) {
      return new Just2(value0);
    };
    return Just2;
  }();
  var showMaybe = function(dictShow) {
    var show11 = show(dictShow);
    return {
      show: function(v) {
        if (v instanceof Just) {
          return "(Just " + (show11(v.value0) + ")");
        }
        ;
        if (v instanceof Nothing) {
          return "Nothing";
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 223, column 1 - line 225, column 28): " + [v.constructor.name]);
      }
    };
  };
  var maybe = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Nothing) {
          return v;
        }
        ;
        if (v2 instanceof Just) {
          return v1(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  };
  var isNothing = /* @__PURE__ */ maybe(true)(/* @__PURE__ */ $$const(false));
  var functorMaybe = {
    map: function(v) {
      return function(v1) {
        if (v1 instanceof Just) {
          return new Just(v(v1.value0));
        }
        ;
        return Nothing.value;
      };
    }
  };
  var map2 = /* @__PURE__ */ map(functorMaybe);
  var fromMaybe = function(a) {
    return maybe(a)(identity3);
  };
  var fromJust = function() {
    return function(v) {
      if (v instanceof Just) {
        return v.value0;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 288, column 1 - line 288, column 46): " + [v.constructor.name]);
    };
  };
  var eqMaybe = function(dictEq) {
    var eq4 = eq(dictEq);
    return {
      eq: function(x) {
        return function(y) {
          if (x instanceof Nothing && y instanceof Nothing) {
            return true;
          }
          ;
          if (x instanceof Just && y instanceof Just) {
            return eq4(x.value0)(y.value0);
          }
          ;
          return false;
        };
      }
    };
  };
  var applyMaybe = {
    apply: function(v) {
      return function(v1) {
        if (v instanceof Just) {
          return map2(v.value0)(v1);
        }
        ;
        if (v instanceof Nothing) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorMaybe;
    }
  };
  var bindMaybe = {
    bind: function(v) {
      return function(v1) {
        if (v instanceof Just) {
          return v1(v.value0);
        }
        ;
        if (v instanceof Nothing) {
          return Nothing.value;
        }
        ;
        throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Apply0: function() {
      return applyMaybe;
    }
  };
  var applicativeMaybe = /* @__PURE__ */ function() {
    return {
      pure: Just.create,
      Apply0: function() {
        return applyMaybe;
      }
    };
  }();

  // output/Data.Either/index.js
  var Left = /* @__PURE__ */ function() {
    function Left2(value0) {
      this.value0 = value0;
    }
    ;
    Left2.create = function(value0) {
      return new Left2(value0);
    };
    return Left2;
  }();
  var Right = /* @__PURE__ */ function() {
    function Right2(value0) {
      this.value0 = value0;
    }
    ;
    Right2.create = function(value0) {
      return new Right2(value0);
    };
    return Right2;
  }();
  var note = function(a) {
    return maybe(new Left(a))(Right.create);
  };
  var functorEither = {
    map: function(f) {
      return function(m) {
        if (m instanceof Left) {
          return new Left(m.value0);
        }
        ;
        if (m instanceof Right) {
          return new Right(f(m.value0));
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
      };
    }
  };
  var map3 = /* @__PURE__ */ map(functorEither);
  var either = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Left) {
          return v(v2.value0);
        }
        ;
        if (v2 instanceof Right) {
          return v1(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 208, column 1 - line 208, column 64): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  };
  var applyEither = {
    apply: function(v) {
      return function(v1) {
        if (v instanceof Left) {
          return new Left(v.value0);
        }
        ;
        if (v instanceof Right) {
          return map3(v.value0)(v1);
        }
        ;
        throw new Error("Failed pattern match at Data.Either (line 70, column 1 - line 72, column 30): " + [v.constructor.name, v1.constructor.name]);
      };
    },
    Functor0: function() {
      return functorEither;
    }
  };
  var bindEither = {
    bind: /* @__PURE__ */ either(function(e) {
      return function(v) {
        return new Left(e);
      };
    })(function(a) {
      return function(f) {
        return f(a);
      };
    }),
    Apply0: function() {
      return applyEither;
    }
  };
  var applicativeEither = /* @__PURE__ */ function() {
    return {
      pure: Right.create,
      Apply0: function() {
        return applyEither;
      }
    };
  }();

  // output/Effect/foreign.js
  var pureE = function(a) {
    return function() {
      return a;
    };
  };
  var bindE = function(a) {
    return function(f) {
      return function() {
        return f(a())();
      };
    };
  };

  // output/Data.Monoid/index.js
  var mempty = function(dict) {
    return dict.mempty;
  };

  // output/Effect/index.js
  var $runtime_lazy = function(name16, moduleName, init3) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init3();
      state3 = 2;
      return val;
    };
  };
  var monadEffect = {
    Applicative0: function() {
      return applicativeEffect;
    },
    Bind1: function() {
      return bindEffect;
    }
  };
  var bindEffect = {
    bind: bindE,
    Apply0: function() {
      return $lazy_applyEffect(0);
    }
  };
  var applicativeEffect = {
    pure: pureE,
    Apply0: function() {
      return $lazy_applyEffect(0);
    }
  };
  var $lazy_functorEffect = /* @__PURE__ */ $runtime_lazy("functorEffect", "Effect", function() {
    return {
      map: liftA1(applicativeEffect)
    };
  });
  var $lazy_applyEffect = /* @__PURE__ */ $runtime_lazy("applyEffect", "Effect", function() {
    return {
      apply: ap(monadEffect),
      Functor0: function() {
        return $lazy_functorEffect(0);
      }
    };
  });
  var functorEffect = /* @__PURE__ */ $lazy_functorEffect(20);
  var applyEffect = /* @__PURE__ */ $lazy_applyEffect(23);

  // output/Effect.Exception/foreign.js
  function message(e) {
    return e.message;
  }

  // output/Control.Monad.Error.Class/index.js
  var throwError = function(dict) {
    return dict.throwError;
  };
  var catchError = function(dict) {
    return dict.catchError;
  };
  var $$try = function(dictMonadError) {
    var catchError1 = catchError(dictMonadError);
    var Monad0 = dictMonadError.MonadThrow0().Monad0();
    var map16 = map(Monad0.Bind1().Apply0().Functor0());
    var pure10 = pure(Monad0.Applicative0());
    return function(a) {
      return catchError1(map16(Right.create)(a))(function($52) {
        return pure10(Left.create($52));
      });
    };
  };

  // output/Data.Identity/index.js
  var Identity = function(x) {
    return x;
  };
  var functorIdentity = {
    map: function(f) {
      return function(m) {
        return f(m);
      };
    }
  };
  var applyIdentity = {
    apply: function(v) {
      return function(v1) {
        return v(v1);
      };
    },
    Functor0: function() {
      return functorIdentity;
    }
  };
  var bindIdentity = {
    bind: function(v) {
      return function(f) {
        return f(v);
      };
    },
    Apply0: function() {
      return applyIdentity;
    }
  };
  var applicativeIdentity = {
    pure: Identity,
    Apply0: function() {
      return applyIdentity;
    }
  };
  var monadIdentity = {
    Applicative0: function() {
      return applicativeIdentity;
    },
    Bind1: function() {
      return bindIdentity;
    }
  };

  // output/Data.HeytingAlgebra/foreign.js
  var boolConj = function(b1) {
    return function(b2) {
      return b1 && b2;
    };
  };
  var boolDisj = function(b1) {
    return function(b2) {
      return b1 || b2;
    };
  };
  var boolNot = function(b) {
    return !b;
  };

  // output/Data.HeytingAlgebra/index.js
  var not = function(dict) {
    return dict.not;
  };
  var ff = function(dict) {
    return dict.ff;
  };
  var disj = function(dict) {
    return dict.disj;
  };
  var heytingAlgebraBoolean = {
    ff: false,
    tt: true,
    implies: function(a) {
      return function(b) {
        return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a))(b);
      };
    },
    conj: boolConj,
    disj: boolDisj,
    not: boolNot
  };

  // output/Data.Tuple/index.js
  var Tuple = /* @__PURE__ */ function() {
    function Tuple2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Tuple2.create = function(value0) {
      return function(value1) {
        return new Tuple2(value0, value1);
      };
    };
    return Tuple2;
  }();
  var snd = function(v) {
    return v.value1;
  };
  var fst = function(v) {
    return v.value0;
  };

  // output/Control.Plus/index.js
  var empty = function(dict) {
    return dict.empty;
  };

  // output/Unsafe.Coerce/foreign.js
  var unsafeCoerce2 = function(x) {
    return x;
  };

  // output/Safe.Coerce/index.js
  var coerce = function() {
    return unsafeCoerce2;
  };

  // output/Data.Newtype/index.js
  var coerce2 = /* @__PURE__ */ coerce();
  var unwrap = function() {
    return coerce2;
  };
  var alaF = function() {
    return function() {
      return function() {
        return function() {
          return function(v) {
            return coerce2;
          };
        };
      };
    };
  };

  // output/Effect.Class/index.js
  var liftEffect = function(dict) {
    return dict.liftEffect;
  };

  // output/Control.Monad.Reader.Trans/index.js
  var ReaderT = function(x) {
    return x;
  };
  var mapReaderT = function(f) {
    return function(v) {
      return function($148) {
        return f(v($148));
      };
    };
  };
  var functorReaderT = function(dictFunctor) {
    return {
      map: function() {
        var $149 = map(dictFunctor);
        return function($150) {
          return mapReaderT($149($150));
        };
      }()
    };
  };
  var applyReaderT = function(dictApply) {
    var apply3 = apply(dictApply);
    var functorReaderT1 = functorReaderT(dictApply.Functor0());
    return {
      apply: function(v) {
        return function(v1) {
          return function(r) {
            return apply3(v(r))(v1(r));
          };
        };
      },
      Functor0: function() {
        return functorReaderT1;
      }
    };
  };
  var bindReaderT = function(dictBind) {
    var bind7 = bind(dictBind);
    var applyReaderT1 = applyReaderT(dictBind.Apply0());
    return {
      bind: function(v) {
        return function(k) {
          return function(r) {
            return bind7(v(r))(function(a) {
              var v1 = k(a);
              return v1(r);
            });
          };
        };
      },
      Apply0: function() {
        return applyReaderT1;
      }
    };
  };
  var applicativeReaderT = function(dictApplicative) {
    var applyReaderT1 = applyReaderT(dictApplicative.Apply0());
    return {
      pure: function() {
        var $154 = pure(dictApplicative);
        return function($155) {
          return ReaderT($$const($154($155)));
        };
      }(),
      Apply0: function() {
        return applyReaderT1;
      }
    };
  };
  var monadReaderT = function(dictMonad) {
    var applicativeReaderT1 = applicativeReaderT(dictMonad.Applicative0());
    var bindReaderT1 = bindReaderT(dictMonad.Bind1());
    return {
      Applicative0: function() {
        return applicativeReaderT1;
      },
      Bind1: function() {
        return bindReaderT1;
      }
    };
  };
  var monadAskReaderT = function(dictMonad) {
    var monadReaderT1 = monadReaderT(dictMonad);
    return {
      ask: pure(dictMonad.Applicative0()),
      Monad0: function() {
        return monadReaderT1;
      }
    };
  };

  // output/Control.Monad.Reader/index.js
  var unwrap2 = /* @__PURE__ */ unwrap();
  var runReader = function(v) {
    return function($4) {
      return unwrap2(v($4));
    };
  };

  // output/Data.Int/foreign.js
  var fromNumberImpl = function(just) {
    return function(nothing) {
      return function(n) {
        return (n | 0) === n ? just(n) : nothing;
      };
    };
  };
  var toNumber = function(n) {
    return n;
  };

  // output/Data.Int/index.js
  var fromNumber = /* @__PURE__ */ function() {
    return fromNumberImpl(Just.create)(Nothing.value);
  }();

  // output/Data.Number.Format/foreign.js
  function wrap(method2) {
    return function(d) {
      return function(num) {
        return method2.apply(num, [d]);
      };
    };
  }
  var toPrecisionNative = wrap(Number.prototype.toPrecision);
  var toFixedNative = wrap(Number.prototype.toFixed);
  var toExponentialNative = wrap(Number.prototype.toExponential);
  function toString(num) {
    return num.toString();
  }

  // output/Data.Number.Format/index.js
  var clamp2 = /* @__PURE__ */ clamp(ordInt);
  var Precision = /* @__PURE__ */ function() {
    function Precision2(value0) {
      this.value0 = value0;
    }
    ;
    Precision2.create = function(value0) {
      return new Precision2(value0);
    };
    return Precision2;
  }();
  var Fixed = /* @__PURE__ */ function() {
    function Fixed2(value0) {
      this.value0 = value0;
    }
    ;
    Fixed2.create = function(value0) {
      return new Fixed2(value0);
    };
    return Fixed2;
  }();
  var Exponential = /* @__PURE__ */ function() {
    function Exponential2(value0) {
      this.value0 = value0;
    }
    ;
    Exponential2.create = function(value0) {
      return new Exponential2(value0);
    };
    return Exponential2;
  }();
  var toStringWith = function(v) {
    if (v instanceof Precision) {
      return toPrecisionNative(v.value0);
    }
    ;
    if (v instanceof Fixed) {
      return toFixedNative(v.value0);
    }
    ;
    if (v instanceof Exponential) {
      return toExponentialNative(v.value0);
    }
    ;
    throw new Error("Failed pattern match at Data.Number.Format (line 59, column 1 - line 59, column 43): " + [v.constructor.name]);
  };
  var fixed = /* @__PURE__ */ function() {
    var $9 = clamp2(0)(20);
    return function($10) {
      return Fixed.create($9($10));
    };
  }();

  // output/Effect.Aff/foreign.js
  var Aff = function() {
    var EMPTY = {};
    var PURE = "Pure";
    var THROW = "Throw";
    var CATCH = "Catch";
    var SYNC = "Sync";
    var ASYNC = "Async";
    var BIND = "Bind";
    var BRACKET = "Bracket";
    var FORK = "Fork";
    var SEQ = "Sequential";
    var MAP = "Map";
    var APPLY = "Apply";
    var ALT = "Alt";
    var CONS = "Cons";
    var RESUME = "Resume";
    var RELEASE = "Release";
    var FINALIZER = "Finalizer";
    var FINALIZED = "Finalized";
    var FORKED = "Forked";
    var FIBER = "Fiber";
    var THUNK = "Thunk";
    function Aff2(tag, _1, _2, _3) {
      this.tag = tag;
      this._1 = _1;
      this._2 = _2;
      this._3 = _3;
    }
    function AffCtr(tag) {
      var fn = function(_1, _2, _3) {
        return new Aff2(tag, _1, _2, _3);
      };
      fn.tag = tag;
      return fn;
    }
    function nonCanceler2(error3) {
      return new Aff2(PURE, void 0);
    }
    function runEff(eff) {
      try {
        eff();
      } catch (error3) {
        setTimeout(function() {
          throw error3;
        }, 0);
      }
    }
    function runSync(left, right, eff) {
      try {
        return right(eff());
      } catch (error3) {
        return left(error3);
      }
    }
    function runAsync(left, eff, k) {
      try {
        return eff(k)();
      } catch (error3) {
        k(left(error3))();
        return nonCanceler2;
      }
    }
    var Scheduler = function() {
      var limit = 1024;
      var size5 = 0;
      var ix = 0;
      var queue = new Array(limit);
      var draining = false;
      function drain() {
        var thunk;
        draining = true;
        while (size5 !== 0) {
          size5--;
          thunk = queue[ix];
          queue[ix] = void 0;
          ix = (ix + 1) % limit;
          thunk();
        }
        draining = false;
      }
      return {
        isDraining: function() {
          return draining;
        },
        enqueue: function(cb) {
          var i, tmp;
          if (size5 === limit) {
            tmp = draining;
            drain();
            draining = tmp;
          }
          queue[(ix + size5) % limit] = cb;
          size5++;
          if (!draining) {
            drain();
          }
        }
      };
    }();
    function Supervisor(util) {
      var fibers = {};
      var fiberId = 0;
      var count = 0;
      return {
        register: function(fiber) {
          var fid = fiberId++;
          fiber.onComplete({
            rethrow: true,
            handler: function(result) {
              return function() {
                count--;
                delete fibers[fid];
              };
            }
          })();
          fibers[fid] = fiber;
          count++;
        },
        isEmpty: function() {
          return count === 0;
        },
        killAll: function(killError, cb) {
          return function() {
            if (count === 0) {
              return cb();
            }
            var killCount = 0;
            var kills = {};
            function kill(fid) {
              kills[fid] = fibers[fid].kill(killError, function(result) {
                return function() {
                  delete kills[fid];
                  killCount--;
                  if (util.isLeft(result) && util.fromLeft(result)) {
                    setTimeout(function() {
                      throw util.fromLeft(result);
                    }, 0);
                  }
                  if (killCount === 0) {
                    cb();
                  }
                };
              })();
            }
            for (var k in fibers) {
              if (fibers.hasOwnProperty(k)) {
                killCount++;
                kill(k);
              }
            }
            fibers = {};
            fiberId = 0;
            count = 0;
            return function(error3) {
              return new Aff2(SYNC, function() {
                for (var k2 in kills) {
                  if (kills.hasOwnProperty(k2)) {
                    kills[k2]();
                  }
                }
              });
            };
          };
        }
      };
    }
    var SUSPENDED = 0;
    var CONTINUE = 1;
    var STEP_BIND = 2;
    var STEP_RESULT = 3;
    var PENDING = 4;
    var RETURN = 5;
    var COMPLETED = 6;
    function Fiber(util, supervisor, aff) {
      var runTick = 0;
      var status = SUSPENDED;
      var step3 = aff;
      var fail3 = null;
      var interrupt = null;
      var bhead = null;
      var btail = null;
      var attempts = null;
      var bracketCount = 0;
      var joinId = 0;
      var joins = null;
      var rethrow = true;
      function run3(localRunTick) {
        var tmp, result, attempt;
        while (true) {
          tmp = null;
          result = null;
          attempt = null;
          switch (status) {
            case STEP_BIND:
              status = CONTINUE;
              try {
                step3 = bhead(step3);
                if (btail === null) {
                  bhead = null;
                } else {
                  bhead = btail._1;
                  btail = btail._2;
                }
              } catch (e) {
                status = RETURN;
                fail3 = util.left(e);
                step3 = null;
              }
              break;
            case STEP_RESULT:
              if (util.isLeft(step3)) {
                status = RETURN;
                fail3 = step3;
                step3 = null;
              } else if (bhead === null) {
                status = RETURN;
              } else {
                status = STEP_BIND;
                step3 = util.fromRight(step3);
              }
              break;
            case CONTINUE:
              switch (step3.tag) {
                case BIND:
                  if (bhead) {
                    btail = new Aff2(CONS, bhead, btail);
                  }
                  bhead = step3._2;
                  status = CONTINUE;
                  step3 = step3._1;
                  break;
                case PURE:
                  if (bhead === null) {
                    status = RETURN;
                    step3 = util.right(step3._1);
                  } else {
                    status = STEP_BIND;
                    step3 = step3._1;
                  }
                  break;
                case SYNC:
                  status = STEP_RESULT;
                  step3 = runSync(util.left, util.right, step3._1);
                  break;
                case ASYNC:
                  status = PENDING;
                  step3 = runAsync(util.left, step3._1, function(result2) {
                    return function() {
                      if (runTick !== localRunTick) {
                        return;
                      }
                      runTick++;
                      Scheduler.enqueue(function() {
                        if (runTick !== localRunTick + 1) {
                          return;
                        }
                        status = STEP_RESULT;
                        step3 = result2;
                        run3(runTick);
                      });
                    };
                  });
                  return;
                case THROW:
                  status = RETURN;
                  fail3 = util.left(step3._1);
                  step3 = null;
                  break;
                case CATCH:
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step3, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step3, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step3 = step3._1;
                  break;
                case BRACKET:
                  bracketCount++;
                  if (bhead === null) {
                    attempts = new Aff2(CONS, step3, attempts, interrupt);
                  } else {
                    attempts = new Aff2(CONS, step3, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                  }
                  bhead = null;
                  btail = null;
                  status = CONTINUE;
                  step3 = step3._1;
                  break;
                case FORK:
                  status = STEP_RESULT;
                  tmp = Fiber(util, supervisor, step3._2);
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
                  if (step3._1) {
                    tmp.run();
                  }
                  step3 = util.right(tmp);
                  break;
                case SEQ:
                  status = CONTINUE;
                  step3 = sequential2(util, supervisor, step3._1);
                  break;
              }
              break;
            case RETURN:
              bhead = null;
              btail = null;
              if (attempts === null) {
                status = COMPLETED;
                step3 = interrupt || fail3 || step3;
              } else {
                tmp = attempts._3;
                attempt = attempts._1;
                attempts = attempts._2;
                switch (attempt.tag) {
                  case CATCH:
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      status = RETURN;
                    } else if (fail3) {
                      status = CONTINUE;
                      step3 = attempt._2(util.fromLeft(fail3));
                      fail3 = null;
                    }
                    break;
                  case RESUME:
                    if (interrupt && interrupt !== tmp && bracketCount === 0 || fail3) {
                      status = RETURN;
                    } else {
                      bhead = attempt._1;
                      btail = attempt._2;
                      status = STEP_BIND;
                      step3 = util.fromRight(step3);
                    }
                    break;
                  case BRACKET:
                    bracketCount--;
                    if (fail3 === null) {
                      result = util.fromRight(step3);
                      attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                      if (interrupt === tmp || bracketCount > 0) {
                        status = CONTINUE;
                        step3 = attempt._3(result);
                      }
                    }
                    break;
                  case RELEASE:
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step3, fail3), attempts, interrupt);
                    status = CONTINUE;
                    if (interrupt && interrupt !== tmp && bracketCount === 0) {
                      step3 = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                    } else if (fail3) {
                      step3 = attempt._1.failed(util.fromLeft(fail3))(attempt._2);
                    } else {
                      step3 = attempt._1.completed(util.fromRight(step3))(attempt._2);
                    }
                    fail3 = null;
                    bracketCount++;
                    break;
                  case FINALIZER:
                    bracketCount++;
                    attempts = new Aff2(CONS, new Aff2(FINALIZED, step3, fail3), attempts, interrupt);
                    status = CONTINUE;
                    step3 = attempt._1;
                    break;
                  case FINALIZED:
                    bracketCount--;
                    status = RETURN;
                    step3 = attempt._1;
                    fail3 = attempt._2;
                    break;
                }
              }
              break;
            case COMPLETED:
              for (var k in joins) {
                if (joins.hasOwnProperty(k)) {
                  rethrow = rethrow && joins[k].rethrow;
                  runEff(joins[k].handler(step3));
                }
              }
              joins = null;
              if (interrupt && fail3) {
                setTimeout(function() {
                  throw util.fromLeft(fail3);
                }, 0);
              } else if (util.isLeft(step3) && rethrow) {
                setTimeout(function() {
                  if (rethrow) {
                    throw util.fromLeft(step3);
                  }
                }, 0);
              }
              return;
            case SUSPENDED:
              status = CONTINUE;
              break;
            case PENDING:
              return;
          }
        }
      }
      function onComplete(join3) {
        return function() {
          if (status === COMPLETED) {
            rethrow = rethrow && join3.rethrow;
            join3.handler(step3)();
            return function() {
            };
          }
          var jid = joinId++;
          joins = joins || {};
          joins[jid] = join3;
          return function() {
            if (joins !== null) {
              delete joins[jid];
            }
          };
        };
      }
      function kill(error3, cb) {
        return function() {
          if (status === COMPLETED) {
            cb(util.right(void 0))();
            return function() {
            };
          }
          var canceler = onComplete({
            rethrow: false,
            handler: function() {
              return cb(util.right(void 0));
            }
          })();
          switch (status) {
            case SUSPENDED:
              interrupt = util.left(error3);
              status = COMPLETED;
              step3 = interrupt;
              run3(runTick);
              break;
            case PENDING:
              if (interrupt === null) {
                interrupt = util.left(error3);
              }
              if (bracketCount === 0) {
                if (status === PENDING) {
                  attempts = new Aff2(CONS, new Aff2(FINALIZER, step3(error3)), attempts, interrupt);
                }
                status = RETURN;
                step3 = null;
                fail3 = null;
                run3(++runTick);
              }
              break;
            default:
              if (interrupt === null) {
                interrupt = util.left(error3);
              }
              if (bracketCount === 0) {
                status = RETURN;
                step3 = null;
                fail3 = null;
              }
          }
          return canceler;
        };
      }
      function join2(cb) {
        return function() {
          var canceler = onComplete({
            rethrow: false,
            handler: cb
          })();
          if (status === SUSPENDED) {
            run3(runTick);
          }
          return canceler;
        };
      }
      return {
        kill,
        join: join2,
        onComplete,
        isSuspended: function() {
          return status === SUSPENDED;
        },
        run: function() {
          if (status === SUSPENDED) {
            if (!Scheduler.isDraining()) {
              Scheduler.enqueue(function() {
                run3(runTick);
              });
            } else {
              run3(runTick);
            }
          }
        }
      };
    }
    function runPar(util, supervisor, par, cb) {
      var fiberId = 0;
      var fibers = {};
      var killId = 0;
      var kills = {};
      var early = new Error("[ParAff] Early exit");
      var interrupt = null;
      var root = EMPTY;
      function kill(error3, par2, cb2) {
        var step3 = par2;
        var head4 = null;
        var tail2 = null;
        var count = 0;
        var kills2 = {};
        var tmp, kid;
        loop:
          while (true) {
            tmp = null;
            switch (step3.tag) {
              case FORKED:
                if (step3._3 === EMPTY) {
                  tmp = fibers[step3._1];
                  kills2[count++] = tmp.kill(error3, function(result) {
                    return function() {
                      count--;
                      if (count === 0) {
                        cb2(result)();
                      }
                    };
                  });
                }
                if (head4 === null) {
                  break loop;
                }
                step3 = head4._2;
                if (tail2 === null) {
                  head4 = null;
                } else {
                  head4 = tail2._1;
                  tail2 = tail2._2;
                }
                break;
              case MAP:
                step3 = step3._2;
                break;
              case APPLY:
              case ALT:
                if (head4) {
                  tail2 = new Aff2(CONS, head4, tail2);
                }
                head4 = step3;
                step3 = step3._1;
                break;
            }
          }
        if (count === 0) {
          cb2(util.right(void 0))();
        } else {
          kid = 0;
          tmp = count;
          for (; kid < tmp; kid++) {
            kills2[kid] = kills2[kid]();
          }
        }
        return kills2;
      }
      function join2(result, head4, tail2) {
        var fail3, step3, lhs, rhs, tmp, kid;
        if (util.isLeft(result)) {
          fail3 = result;
          step3 = null;
        } else {
          step3 = result;
          fail3 = null;
        }
        loop:
          while (true) {
            lhs = null;
            rhs = null;
            tmp = null;
            kid = null;
            if (interrupt !== null) {
              return;
            }
            if (head4 === null) {
              cb(fail3 || step3)();
              return;
            }
            if (head4._3 !== EMPTY) {
              return;
            }
            switch (head4.tag) {
              case MAP:
                if (fail3 === null) {
                  head4._3 = util.right(head4._1(util.fromRight(step3)));
                  step3 = head4._3;
                } else {
                  head4._3 = fail3;
                }
                break;
              case APPLY:
                lhs = head4._1._3;
                rhs = head4._2._3;
                if (fail3) {
                  head4._3 = fail3;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill(early, fail3 === lhs ? head4._2 : head4._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail2 === null) {
                        join2(fail3, null, null);
                      } else {
                        join2(fail3, tail2._1, tail2._2);
                      }
                    };
                  });
                  if (tmp) {
                    tmp = false;
                    return;
                  }
                } else if (lhs === EMPTY || rhs === EMPTY) {
                  return;
                } else {
                  step3 = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                  head4._3 = step3;
                }
                break;
              case ALT:
                lhs = head4._1._3;
                rhs = head4._2._3;
                if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                  return;
                }
                if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                  fail3 = step3 === lhs ? rhs : lhs;
                  step3 = null;
                  head4._3 = fail3;
                } else {
                  head4._3 = step3;
                  tmp = true;
                  kid = killId++;
                  kills[kid] = kill(early, step3 === lhs ? head4._2 : head4._1, function() {
                    return function() {
                      delete kills[kid];
                      if (tmp) {
                        tmp = false;
                      } else if (tail2 === null) {
                        join2(step3, null, null);
                      } else {
                        join2(step3, tail2._1, tail2._2);
                      }
                    };
                  });
                  if (tmp) {
                    tmp = false;
                    return;
                  }
                }
                break;
            }
            if (tail2 === null) {
              head4 = null;
            } else {
              head4 = tail2._1;
              tail2 = tail2._2;
            }
          }
      }
      function resolve(fiber) {
        return function(result) {
          return function() {
            delete fibers[fiber._1];
            fiber._3 = result;
            join2(result, fiber._2._1, fiber._2._2);
          };
        };
      }
      function run3() {
        var status = CONTINUE;
        var step3 = par;
        var head4 = null;
        var tail2 = null;
        var tmp, fid;
        loop:
          while (true) {
            tmp = null;
            fid = null;
            switch (status) {
              case CONTINUE:
                switch (step3.tag) {
                  case MAP:
                    if (head4) {
                      tail2 = new Aff2(CONS, head4, tail2);
                    }
                    head4 = new Aff2(MAP, step3._1, EMPTY, EMPTY);
                    step3 = step3._2;
                    break;
                  case APPLY:
                    if (head4) {
                      tail2 = new Aff2(CONS, head4, tail2);
                    }
                    head4 = new Aff2(APPLY, EMPTY, step3._2, EMPTY);
                    step3 = step3._1;
                    break;
                  case ALT:
                    if (head4) {
                      tail2 = new Aff2(CONS, head4, tail2);
                    }
                    head4 = new Aff2(ALT, EMPTY, step3._2, EMPTY);
                    step3 = step3._1;
                    break;
                  default:
                    fid = fiberId++;
                    status = RETURN;
                    tmp = step3;
                    step3 = new Aff2(FORKED, fid, new Aff2(CONS, head4, tail2), EMPTY);
                    tmp = Fiber(util, supervisor, tmp);
                    tmp.onComplete({
                      rethrow: false,
                      handler: resolve(step3)
                    })();
                    fibers[fid] = tmp;
                    if (supervisor) {
                      supervisor.register(tmp);
                    }
                }
                break;
              case RETURN:
                if (head4 === null) {
                  break loop;
                }
                if (head4._1 === EMPTY) {
                  head4._1 = step3;
                  status = CONTINUE;
                  step3 = head4._2;
                  head4._2 = EMPTY;
                } else {
                  head4._2 = step3;
                  step3 = head4;
                  if (tail2 === null) {
                    head4 = null;
                  } else {
                    head4 = tail2._1;
                    tail2 = tail2._2;
                  }
                }
            }
          }
        root = step3;
        for (fid = 0; fid < fiberId; fid++) {
          fibers[fid].run();
        }
      }
      function cancel(error3, cb2) {
        interrupt = util.left(error3);
        var innerKills;
        for (var kid in kills) {
          if (kills.hasOwnProperty(kid)) {
            innerKills = kills[kid];
            for (kid in innerKills) {
              if (innerKills.hasOwnProperty(kid)) {
                innerKills[kid]();
              }
            }
          }
        }
        kills = null;
        var newKills = kill(error3, root, cb2);
        return function(killError) {
          return new Aff2(ASYNC, function(killCb) {
            return function() {
              for (var kid2 in newKills) {
                if (newKills.hasOwnProperty(kid2)) {
                  newKills[kid2]();
                }
              }
              return nonCanceler2;
            };
          });
        };
      }
      run3();
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            return cancel(killError, killCb);
          };
        });
      };
    }
    function sequential2(util, supervisor, par) {
      return new Aff2(ASYNC, function(cb) {
        return function() {
          return runPar(util, supervisor, par, cb);
        };
      });
    }
    Aff2.EMPTY = EMPTY;
    Aff2.Pure = AffCtr(PURE);
    Aff2.Throw = AffCtr(THROW);
    Aff2.Catch = AffCtr(CATCH);
    Aff2.Sync = AffCtr(SYNC);
    Aff2.Async = AffCtr(ASYNC);
    Aff2.Bind = AffCtr(BIND);
    Aff2.Bracket = AffCtr(BRACKET);
    Aff2.Fork = AffCtr(FORK);
    Aff2.Seq = AffCtr(SEQ);
    Aff2.ParMap = AffCtr(MAP);
    Aff2.ParApply = AffCtr(APPLY);
    Aff2.ParAlt = AffCtr(ALT);
    Aff2.Fiber = Fiber;
    Aff2.Supervisor = Supervisor;
    Aff2.Scheduler = Scheduler;
    Aff2.nonCanceler = nonCanceler2;
    return Aff2;
  }();
  var _pure = Aff.Pure;
  var _throwError = Aff.Throw;
  function _catchError(aff) {
    return function(k) {
      return Aff.Catch(aff, k);
    };
  }
  function _map(f) {
    return function(aff) {
      if (aff.tag === Aff.Pure.tag) {
        return Aff.Pure(f(aff._1));
      } else {
        return Aff.Bind(aff, function(value13) {
          return Aff.Pure(f(value13));
        });
      }
    };
  }
  function _bind(aff) {
    return function(k) {
      return Aff.Bind(aff, k);
    };
  }
  var _liftEffect = Aff.Sync;
  var makeAff = Aff.Async;
  function _makeFiber(util, aff) {
    return function() {
      return Aff.Fiber(util, null, aff);
    };
  }
  var _delay = function() {
    function setDelay(n, k) {
      if (n === 0 && typeof setImmediate !== "undefined") {
        return setImmediate(k);
      } else {
        return setTimeout(k, n);
      }
    }
    function clearDelay(n, t) {
      if (n === 0 && typeof clearImmediate !== "undefined") {
        return clearImmediate(t);
      } else {
        return clearTimeout(t);
      }
    }
    return function(right, ms) {
      return Aff.Async(function(cb) {
        return function() {
          var timer = setDelay(ms, cb(right()));
          return function() {
            return Aff.Sync(function() {
              return right(clearDelay(ms, timer));
            });
          };
        };
      });
    };
  }();
  var _sequential = Aff.Seq;

  // output/Control.Monad.Except.Trans/index.js
  var map4 = /* @__PURE__ */ map(functorEither);
  var ExceptT = function(x) {
    return x;
  };
  var runExceptT = function(v) {
    return v;
  };
  var mapExceptT = function(f) {
    return function(v) {
      return f(v);
    };
  };
  var functorExceptT = function(dictFunctor) {
    var map16 = map(dictFunctor);
    return {
      map: function(f) {
        return mapExceptT(map16(map4(f)));
      }
    };
  };
  var monadExceptT = function(dictMonad) {
    return {
      Applicative0: function() {
        return applicativeExceptT(dictMonad);
      },
      Bind1: function() {
        return bindExceptT(dictMonad);
      }
    };
  };
  var bindExceptT = function(dictMonad) {
    var bind7 = bind(dictMonad.Bind1());
    var pure10 = pure(dictMonad.Applicative0());
    return {
      bind: function(v) {
        return function(k) {
          return bind7(v)(either(function($187) {
            return pure10(Left.create($187));
          })(function(a) {
            var v1 = k(a);
            return v1;
          }));
        };
      },
      Apply0: function() {
        return applyExceptT(dictMonad);
      }
    };
  };
  var applyExceptT = function(dictMonad) {
    var functorExceptT1 = functorExceptT(dictMonad.Bind1().Apply0().Functor0());
    return {
      apply: ap(monadExceptT(dictMonad)),
      Functor0: function() {
        return functorExceptT1;
      }
    };
  };
  var applicativeExceptT = function(dictMonad) {
    return {
      pure: function() {
        var $188 = pure(dictMonad.Applicative0());
        return function($189) {
          return ExceptT($188(Right.create($189)));
        };
      }(),
      Apply0: function() {
        return applyExceptT(dictMonad);
      }
    };
  };
  var monadThrowExceptT = function(dictMonad) {
    var monadExceptT1 = monadExceptT(dictMonad);
    return {
      throwError: function() {
        var $198 = pure(dictMonad.Applicative0());
        return function($199) {
          return ExceptT($198(Left.create($199)));
        };
      }(),
      Monad0: function() {
        return monadExceptT1;
      }
    };
  };
  var altExceptT = function(dictSemigroup) {
    var append3 = append(dictSemigroup);
    return function(dictMonad) {
      var Bind1 = dictMonad.Bind1();
      var bind7 = bind(Bind1);
      var pure10 = pure(dictMonad.Applicative0());
      var functorExceptT1 = functorExceptT(Bind1.Apply0().Functor0());
      return {
        alt: function(v) {
          return function(v1) {
            return bind7(v)(function(rm) {
              if (rm instanceof Right) {
                return pure10(new Right(rm.value0));
              }
              ;
              if (rm instanceof Left) {
                return bind7(v1)(function(rn) {
                  if (rn instanceof Right) {
                    return pure10(new Right(rn.value0));
                  }
                  ;
                  if (rn instanceof Left) {
                    return pure10(new Left(append3(rm.value0)(rn.value0)));
                  }
                  ;
                  throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 86, column 9 - line 88, column 49): " + [rn.constructor.name]);
                });
              }
              ;
              throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 82, column 5 - line 88, column 49): " + [rm.constructor.name]);
            });
          };
        },
        Functor0: function() {
          return functorExceptT1;
        }
      };
    };
  };

  // output/Data.Foldable/foreign.js
  var foldrArray = function(f) {
    return function(init3) {
      return function(xs) {
        var acc = init3;
        var len = xs.length;
        for (var i = len - 1; i >= 0; i--) {
          acc = f(xs[i])(acc);
        }
        return acc;
      };
    };
  };
  var foldlArray = function(f) {
    return function(init3) {
      return function(xs) {
        var acc = init3;
        var len = xs.length;
        for (var i = 0; i < len; i++) {
          acc = f(acc)(xs[i]);
        }
        return acc;
      };
    };
  };

  // output/Data.Bifunctor/index.js
  var identity4 = /* @__PURE__ */ identity(categoryFn);
  var bimap = function(dict) {
    return dict.bimap;
  };
  var lmap = function(dictBifunctor) {
    var bimap1 = bimap(dictBifunctor);
    return function(f) {
      return bimap1(f)(identity4);
    };
  };
  var bifunctorEither = {
    bimap: function(v) {
      return function(v1) {
        return function(v2) {
          if (v2 instanceof Left) {
            return new Left(v(v2.value0));
          }
          ;
          if (v2 instanceof Right) {
            return new Right(v1(v2.value0));
          }
          ;
          throw new Error("Failed pattern match at Data.Bifunctor (line 32, column 1 - line 34, column 36): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        };
      };
    }
  };

  // output/Data.Monoid.Disj/index.js
  var Disj = function(x) {
    return x;
  };
  var semigroupDisj = function(dictHeytingAlgebra) {
    var disj2 = disj(dictHeytingAlgebra);
    return {
      append: function(v) {
        return function(v1) {
          return disj2(v)(v1);
        };
      }
    };
  };
  var monoidDisj = function(dictHeytingAlgebra) {
    var semigroupDisj1 = semigroupDisj(dictHeytingAlgebra);
    return {
      mempty: ff(dictHeytingAlgebra),
      Semigroup0: function() {
        return semigroupDisj1;
      }
    };
  };

  // output/Data.Foldable/index.js
  var eq12 = /* @__PURE__ */ eq(eqOrdering);
  var alaF2 = /* @__PURE__ */ alaF()()()();
  var foldr = function(dict) {
    return dict.foldr;
  };
  var traverse_ = function(dictApplicative) {
    var applySecond6 = applySecond(dictApplicative.Apply0());
    var pure10 = pure(dictApplicative);
    return function(dictFoldable) {
      var foldr22 = foldr(dictFoldable);
      return function(f) {
        return foldr22(function($449) {
          return applySecond6(f($449));
        })(pure10(unit));
      };
    };
  };
  var foldl = function(dict) {
    return dict.foldl;
  };
  var maximumBy = function(dictFoldable) {
    var foldl2 = foldl(dictFoldable);
    return function(cmp) {
      var max$prime = function(v) {
        return function(v1) {
          if (v instanceof Nothing) {
            return new Just(v1);
          }
          ;
          if (v instanceof Just) {
            return new Just(function() {
              var $298 = eq12(cmp(v.value0)(v1))(GT.value);
              if ($298) {
                return v.value0;
              }
              ;
              return v1;
            }());
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 441, column 3 - line 441, column 27): " + [v.constructor.name, v1.constructor.name]);
        };
      };
      return foldl2(max$prime)(Nothing.value);
    };
  };
  var maximum = function(dictOrd) {
    var compare3 = compare(dictOrd);
    return function(dictFoldable) {
      return maximumBy(dictFoldable)(compare3);
    };
  };
  var minimumBy = function(dictFoldable) {
    var foldl2 = foldl(dictFoldable);
    return function(cmp) {
      var min$prime = function(v) {
        return function(v1) {
          if (v instanceof Nothing) {
            return new Just(v1);
          }
          ;
          if (v instanceof Just) {
            return new Just(function() {
              var $302 = eq12(cmp(v.value0)(v1))(LT.value);
              if ($302) {
                return v.value0;
              }
              ;
              return v1;
            }());
          }
          ;
          throw new Error("Failed pattern match at Data.Foldable (line 454, column 3 - line 454, column 27): " + [v.constructor.name, v1.constructor.name]);
        };
      };
      return foldl2(min$prime)(Nothing.value);
    };
  };
  var minimum = function(dictOrd) {
    var compare3 = compare(dictOrd);
    return function(dictFoldable) {
      return minimumBy(dictFoldable)(compare3);
    };
  };
  var foldMapDefaultR = function(dictFoldable) {
    var foldr22 = foldr(dictFoldable);
    return function(dictMonoid) {
      var append3 = append(dictMonoid.Semigroup0());
      var mempty2 = mempty(dictMonoid);
      return function(f) {
        return foldr22(function(x) {
          return function(acc) {
            return append3(f(x))(acc);
          };
        })(mempty2);
      };
    };
  };
  var foldableArray = {
    foldr: foldrArray,
    foldl: foldlArray,
    foldMap: function(dictMonoid) {
      return foldMapDefaultR(foldableArray)(dictMonoid);
    }
  };
  var foldMap = function(dict) {
    return dict.foldMap;
  };
  var any = function(dictFoldable) {
    var foldMap2 = foldMap(dictFoldable);
    return function(dictHeytingAlgebra) {
      return alaF2(Disj)(foldMap2(monoidDisj(dictHeytingAlgebra)));
    };
  };

  // output/Data.Traversable/foreign.js
  var traverseArrayImpl = function() {
    function array1(a) {
      return [a];
    }
    function array2(a) {
      return function(b) {
        return [a, b];
      };
    }
    function array3(a) {
      return function(b) {
        return function(c) {
          return [a, b, c];
        };
      };
    }
    function concat2(xs) {
      return function(ys) {
        return xs.concat(ys);
      };
    }
    return function(apply3) {
      return function(map16) {
        return function(pure10) {
          return function(f) {
            return function(array) {
              function go2(bot, top2) {
                switch (top2 - bot) {
                  case 0:
                    return pure10([]);
                  case 1:
                    return map16(array1)(f(array[bot]));
                  case 2:
                    return apply3(map16(array2)(f(array[bot])))(f(array[bot + 1]));
                  case 3:
                    return apply3(apply3(map16(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                  default:
                    var pivot = bot + Math.floor((top2 - bot) / 4) * 2;
                    return apply3(map16(concat2)(go2(bot, pivot)))(go2(pivot, top2));
                }
              }
              return go2(0, array.length);
            };
          };
        };
      };
    };
  }();

  // output/Data.Traversable/index.js
  var identity5 = /* @__PURE__ */ identity(categoryFn);
  var traverse = function(dict) {
    return dict.traverse;
  };
  var sequenceDefault = function(dictTraversable) {
    var traverse22 = traverse(dictTraversable);
    return function(dictApplicative) {
      return traverse22(dictApplicative)(identity5);
    };
  };
  var traversableArray = {
    traverse: function(dictApplicative) {
      var Apply0 = dictApplicative.Apply0();
      return traverseArrayImpl(apply(Apply0))(map(Apply0.Functor0()))(pure(dictApplicative));
    },
    sequence: function(dictApplicative) {
      return sequenceDefault(traversableArray)(dictApplicative);
    },
    Functor0: function() {
      return functorArray;
    },
    Foldable1: function() {
      return foldableArray;
    }
  };
  var sequence = function(dict) {
    return dict.sequence;
  };

  // output/Partial.Unsafe/foreign.js
  var _unsafePartial = function(f) {
    return f();
  };

  // output/Partial/foreign.js
  var _crashWith = function(msg) {
    throw new Error(msg);
  };

  // output/Partial/index.js
  var crashWith = function() {
    return _crashWith;
  };

  // output/Partial.Unsafe/index.js
  var crashWith2 = /* @__PURE__ */ crashWith();
  var unsafePartial = _unsafePartial;
  var unsafeCrashWith = function(msg) {
    return unsafePartial(function() {
      return crashWith2(msg);
    });
  };

  // output/Effect.Aff/index.js
  var $runtime_lazy2 = function(name16, moduleName, init3) {
    var state3 = 0;
    var val;
    return function(lineNumber) {
      if (state3 === 2)
        return val;
      if (state3 === 1)
        throw new ReferenceError(name16 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
      state3 = 1;
      val = init3();
      state3 = 2;
      return val;
    };
  };
  var $$void2 = /* @__PURE__ */ $$void(functorEffect);
  var functorAff = {
    map: _map
  };
  var ffiUtil = /* @__PURE__ */ function() {
    var unsafeFromRight = function(v) {
      if (v instanceof Right) {
        return v.value0;
      }
      ;
      if (v instanceof Left) {
        return unsafeCrashWith("unsafeFromRight: Left");
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 412, column 21 - line 414, column 54): " + [v.constructor.name]);
    };
    var unsafeFromLeft = function(v) {
      if (v instanceof Left) {
        return v.value0;
      }
      ;
      if (v instanceof Right) {
        return unsafeCrashWith("unsafeFromLeft: Right");
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 407, column 20 - line 409, column 55): " + [v.constructor.name]);
    };
    var isLeft = function(v) {
      if (v instanceof Left) {
        return true;
      }
      ;
      if (v instanceof Right) {
        return false;
      }
      ;
      throw new Error("Failed pattern match at Effect.Aff (line 402, column 12 - line 404, column 21): " + [v.constructor.name]);
    };
    return {
      isLeft,
      fromLeft: unsafeFromLeft,
      fromRight: unsafeFromRight,
      left: Left.create,
      right: Right.create
    };
  }();
  var makeFiber = function(aff) {
    return _makeFiber(ffiUtil, aff);
  };
  var launchAff = function(aff) {
    return function __do2() {
      var fiber = makeFiber(aff)();
      fiber.run();
      return fiber;
    };
  };
  var launchAff_ = function($74) {
    return $$void2(launchAff($74));
  };
  var monadAff = {
    Applicative0: function() {
      return applicativeAff;
    },
    Bind1: function() {
      return bindAff;
    }
  };
  var bindAff = {
    bind: _bind,
    Apply0: function() {
      return $lazy_applyAff(0);
    }
  };
  var applicativeAff = {
    pure: _pure,
    Apply0: function() {
      return $lazy_applyAff(0);
    }
  };
  var $lazy_applyAff = /* @__PURE__ */ $runtime_lazy2("applyAff", "Effect.Aff", function() {
    return {
      apply: ap(monadAff),
      Functor0: function() {
        return functorAff;
      }
    };
  });
  var applyAff = /* @__PURE__ */ $lazy_applyAff(73);
  var pure2 = /* @__PURE__ */ pure(applicativeAff);
  var monadEffectAff = {
    liftEffect: _liftEffect,
    Monad0: function() {
      return monadAff;
    }
  };
  var monadThrowAff = {
    throwError: _throwError,
    Monad0: function() {
      return monadAff;
    }
  };
  var monadErrorAff = {
    catchError: _catchError,
    MonadThrow0: function() {
      return monadThrowAff;
    }
  };
  var nonCanceler = /* @__PURE__ */ $$const(/* @__PURE__ */ pure2(unit));

  // output/Effect.Console/foreign.js
  var log2 = function(s) {
    return function() {
      console.log(s);
    };
  };

  // output/Effect.Console/index.js
  var logShow = function(dictShow) {
    var show11 = show(dictShow);
    return function(a) {
      return log2(show11(a));
    };
  };

  // output/Graphics.Canvas/foreign.js
  function getCanvasElementByIdImpl(id3, Just2, Nothing2) {
    return function() {
      var el = document.getElementById(id3);
      if (el && el instanceof HTMLCanvasElement) {
        return Just2(el);
      } else {
        return Nothing2;
      }
    };
  }
  function getContext2D(c) {
    return function() {
      return c.getContext("2d");
    };
  }
  function clearRect(ctx) {
    return function(r) {
      return function() {
        ctx.clearRect(r.x, r.y, r.width, r.height);
      };
    };
  }

  // output/Graphics.Canvas/index.js
  var getCanvasElementById = function(elId) {
    return getCanvasElementByIdImpl(elId, Just.create, Nothing.value);
  };

  // output/HarborView.Maunaloa.Candlestick/foreign.js
  var fi_paint = function(xaxis) {
    return function(candlestix) {
      return function(ctx) {
        return function() {
          ctx.strokeStyle = "#000000";
          ctx.fillStyle = "#ffaa00";
          ctx.lineWidth = 0.5;
          const numCandlestix = candlestix.length;
          for (var i = 0; i < numCandlestix; ++i) {
            paintCandlestick(xaxis[i], candlestix[i], ctx);
          }
        };
      };
    };
  };
  var paintCandlestick = function(x, cndl, ctx) {
    const x0 = x - 4;
    ctx.beginPath();
    if (cndl.c > cndl.o) {
      ctx.moveTo(x, cndl.h);
      ctx.lineTo(x, cndl.o);
      ctx.moveTo(x, cndl.c);
      ctx.lineTo(x, cndl.l);
      const cndlHeight2 = cndl.c - cndl.o;
      ctx.rect(x0, cndl.o, 8, cndlHeight2);
      ctx.fillRect(x0, cndl.o, 8, cndlHeight2);
    } else {
      var cndlHeight = cndl.o - cndl.c;
      if (cndlHeight === 0) {
        cndlHeight = 1;
        const x12 = x + 4;
        ctx.moveTo(x, cndl.h);
        ctx.lineTo(x, cndl.l);
        ctx.moveTo(x0, cndl.c);
        ctx.lineTo(x12, cndl.c);
      } else {
        ctx.moveTo(x, cndl.h);
        ctx.lineTo(x, cndl.c);
        ctx.moveTo(x, cndl.o);
        ctx.lineTo(x, cndl.l);
        ctx.rect(x0, cndl.c, 8, cndlHeight);
      }
    }
    ctx.stroke();
  };

  // output/HarborView.Maunaloa.VRuler/foreign.js
  var fi_lines = function(ctx) {
    return function(boundary) {
      return function(lines3) {
        return function() {
          const x12 = boundary.p1;
          const x2 = boundary.p2;
          ctx.strokeStyle = "#000000";
          ctx.fillStyle = "#000000";
          ctx.lineWidth = 0.25;
          ctx.beginPath();
          for (var i = 0; i < lines3.length; ++i) {
            const y = lines3[i].p0;
            ctx.moveTo(x12, y);
            ctx.lineTo(x2, y);
            ctx.fillText(lines3[i].tx, x12 + 5, y + 15);
          }
          ctx.stroke();
        };
      };
    };
  };

  // output/Data.Array/foreign.js
  var range = function(start2) {
    return function(end) {
      var step3 = start2 > end ? -1 : 1;
      var result = new Array(step3 * (end - start2) + 1);
      var i = start2, n = 0;
      while (i !== end) {
        result[n++] = i;
        i += step3;
      }
      result[n] = i;
      return result;
    };
  };
  var replicateFill = function(count) {
    return function(value13) {
      if (count < 1) {
        return [];
      }
      var result = new Array(count);
      return result.fill(value13);
    };
  };
  var replicatePolyfill = function(count) {
    return function(value13) {
      var result = [];
      var n = 0;
      for (var i = 0; i < count; i++) {
        result[n++] = value13;
      }
      return result;
    };
  };
  var replicate = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
  var fromFoldableImpl = function() {
    function Cons3(head4, tail2) {
      this.head = head4;
      this.tail = tail2;
    }
    var emptyList = {};
    function curryCons(head4) {
      return function(tail2) {
        return new Cons3(head4, tail2);
      };
    }
    function listToArray(list) {
      var result = [];
      var count = 0;
      var xs = list;
      while (xs !== emptyList) {
        result[count++] = xs.head;
        xs = xs.tail;
      }
      return result;
    }
    return function(foldr3) {
      return function(xs) {
        return listToArray(foldr3(curryCons)(emptyList)(xs));
      };
    };
  }();
  var length = function(xs) {
    return xs.length;
  };
  var indexImpl = function(just) {
    return function(nothing) {
      return function(xs) {
        return function(i) {
          return i < 0 || i >= xs.length ? nothing : just(xs[i]);
        };
      };
    };
  };
  var findIndexImpl = function(just) {
    return function(nothing) {
      return function(f) {
        return function(xs) {
          for (var i = 0, l = xs.length; i < l; i++) {
            if (f(xs[i]))
              return just(i);
          }
          return nothing;
        };
      };
    };
  };
  var concat = function(xss) {
    if (xss.length <= 1e4) {
      return Array.prototype.concat.apply([], xss);
    }
    var result = [];
    for (var i = 0, l = xss.length; i < l; i++) {
      var xs = xss[i];
      for (var j = 0, m = xs.length; j < m; j++) {
        result.push(xs[j]);
      }
    }
    return result;
  };
  var filter = function(f) {
    return function(xs) {
      return xs.filter(f);
    };
  };
  var sortByImpl = function() {
    function mergeFromTo(compare3, fromOrdering, xs1, xs2, from2, to) {
      var mid;
      var i;
      var j;
      var k;
      var x;
      var y;
      var c;
      mid = from2 + (to - from2 >> 1);
      if (mid - from2 > 1)
        mergeFromTo(compare3, fromOrdering, xs2, xs1, from2, mid);
      if (to - mid > 1)
        mergeFromTo(compare3, fromOrdering, xs2, xs1, mid, to);
      i = from2;
      j = mid;
      k = from2;
      while (i < mid && j < to) {
        x = xs2[i];
        y = xs2[j];
        c = fromOrdering(compare3(x)(y));
        if (c > 0) {
          xs1[k++] = y;
          ++j;
        } else {
          xs1[k++] = x;
          ++i;
        }
      }
      while (i < mid) {
        xs1[k++] = xs2[i++];
      }
      while (j < to) {
        xs1[k++] = xs2[j++];
      }
    }
    return function(compare3) {
      return function(fromOrdering) {
        return function(xs) {
          var out;
          if (xs.length < 2)
            return xs;
          out = xs.slice(0);
          mergeFromTo(compare3, fromOrdering, out, xs.slice(0), 0, xs.length);
          return out;
        };
      };
    };
  }();
  var slice = function(s) {
    return function(e) {
      return function(l) {
        return l.slice(s, e);
      };
    };
  };
  var zipWith = function(f) {
    return function(xs) {
      return function(ys) {
        var l = xs.length < ys.length ? xs.length : ys.length;
        var result = new Array(l);
        for (var i = 0; i < l; i++) {
          result[i] = f(xs[i])(ys[i]);
        }
        return result;
      };
    };
  };
  var unsafeIndexImpl = function(xs) {
    return function(n) {
      return xs[n];
    };
  };

  // output/Data.Array.ST/foreign.js
  var pushAll = function(as) {
    return function(xs) {
      return function() {
        return xs.push.apply(xs, as);
      };
    };
  };
  var unsafeFreeze = function(xs) {
    return function() {
      return xs;
    };
  };
  function copyImpl(xs) {
    return function() {
      return xs.slice();
    };
  }
  var thaw = copyImpl;
  var sortByImpl2 = function() {
    function mergeFromTo(compare3, fromOrdering, xs1, xs2, from2, to) {
      var mid;
      var i;
      var j;
      var k;
      var x;
      var y;
      var c;
      mid = from2 + (to - from2 >> 1);
      if (mid - from2 > 1)
        mergeFromTo(compare3, fromOrdering, xs2, xs1, from2, mid);
      if (to - mid > 1)
        mergeFromTo(compare3, fromOrdering, xs2, xs1, mid, to);
      i = from2;
      j = mid;
      k = from2;
      while (i < mid && j < to) {
        x = xs2[i];
        y = xs2[j];
        c = fromOrdering(compare3(x)(y));
        if (c > 0) {
          xs1[k++] = y;
          ++j;
        } else {
          xs1[k++] = x;
          ++i;
        }
      }
      while (i < mid) {
        xs1[k++] = xs2[i++];
      }
      while (j < to) {
        xs1[k++] = xs2[j++];
      }
    }
    return function(compare3) {
      return function(fromOrdering) {
        return function(xs) {
          return function() {
            if (xs.length < 2)
              return xs;
            mergeFromTo(compare3, fromOrdering, xs, xs.slice(0), 0, xs.length);
            return xs;
          };
        };
      };
    };
  }();

  // output/Data.Array.ST/index.js
  var withArray = function(f) {
    return function(xs) {
      return function __do2() {
        var result = thaw(xs)();
        f(result)();
        return unsafeFreeze(result)();
      };
    };
  };
  var push = function(a) {
    return pushAll([a]);
  };

  // output/Data.Unfoldable/foreign.js
  var unfoldrArrayImpl = function(isNothing2) {
    return function(fromJust6) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b) {
              var result = [];
              var value13 = b;
              while (true) {
                var maybe2 = f(value13);
                if (isNothing2(maybe2))
                  return result;
                var tuple = fromJust6(maybe2);
                result.push(fst2(tuple));
                value13 = snd2(tuple);
              }
            };
          };
        };
      };
    };
  };

  // output/Data.Unfoldable1/foreign.js
  var unfoldr1ArrayImpl = function(isNothing2) {
    return function(fromJust6) {
      return function(fst2) {
        return function(snd2) {
          return function(f) {
            return function(b) {
              var result = [];
              var value13 = b;
              while (true) {
                var tuple = f(value13);
                result.push(fst2(tuple));
                var maybe2 = snd2(tuple);
                if (isNothing2(maybe2))
                  return result;
                value13 = fromJust6(maybe2);
              }
            };
          };
        };
      };
    };
  };

  // output/Data.Unfoldable1/index.js
  var fromJust2 = /* @__PURE__ */ fromJust();
  var unfoldable1Array = {
    unfoldr1: /* @__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust2)(fst)(snd)
  };

  // output/Data.Unfoldable/index.js
  var fromJust3 = /* @__PURE__ */ fromJust();
  var unfoldr = function(dict) {
    return dict.unfoldr;
  };
  var unfoldableArray = {
    unfoldr: /* @__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust3)(fst)(snd),
    Unfoldable10: function() {
      return unfoldable1Array;
    }
  };

  // output/Data.Array/index.js
  var map1 = /* @__PURE__ */ map(functorMaybe);
  var append2 = /* @__PURE__ */ append(semigroupArray);
  var unsafeIndex = function() {
    return unsafeIndexImpl;
  };
  var unsafeIndex1 = /* @__PURE__ */ unsafeIndex();
  var take = function(n) {
    return function(xs) {
      var $146 = n < 1;
      if ($146) {
        return [];
      }
      ;
      return slice(0)(n)(xs);
    };
  };
  var snoc = function(xs) {
    return function(x) {
      return withArray(push(x))(xs)();
    };
  };
  var index = /* @__PURE__ */ function() {
    return indexImpl(Just.create)(Nothing.value);
  }();
  var last = function(xs) {
    return index(xs)(length(xs) - 1 | 0);
  };
  var head = function(xs) {
    return index(xs)(0);
  };
  var findIndex = /* @__PURE__ */ function() {
    return findIndexImpl(Just.create)(Nothing.value);
  }();
  var find2 = function(f) {
    return function(xs) {
      return map1(unsafeIndex1(xs))(findIndex(f)(xs));
    };
  };
  var drop = function(n) {
    return function(xs) {
      var $170 = n < 1;
      if ($170) {
        return xs;
      }
      ;
      return slice(n)(length(xs))(xs);
    };
  };
  var cons = function(x) {
    return function(xs) {
      return append2([x])(xs);
    };
  };

  // output/HarborView.Maunaloa.Common/foreign.js
  var alert = function(msg) {
    return function() {
      alert(msg);
    };
  };

  // output/HarborView.Maunaloa.Common/index.js
  var showRecord2 = /* @__PURE__ */ showRecord()();
  var show1 = /* @__PURE__ */ show(showNumber);
  var show3 = /* @__PURE__ */ show(/* @__PURE__ */ showRecord2(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "bottom";
    }
  })(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "left";
    }
  })(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "right";
    }
  })(/* @__PURE__ */ showRecordFieldsConsNil({
    reflectSymbol: function() {
      return "top";
    }
  })(showNumber))(showNumber))(showNumber))(showNumber)));
  var compare2 = /* @__PURE__ */ compare(ordNumber);
  var DayChart = /* @__PURE__ */ function() {
    function DayChart2() {
    }
    ;
    DayChart2.value = new DayChart2();
    return DayChart2;
  }();
  var WeekChart = /* @__PURE__ */ function() {
    function WeekChart2() {
    }
    ;
    WeekChart2.value = new WeekChart2();
    return WeekChart2;
  }();
  var MonthChart = /* @__PURE__ */ function() {
    function MonthChart2() {
    }
    ;
    MonthChart2.value = new MonthChart2();
    return MonthChart2;
  }();
  var valueRange = function(minv) {
    return function(maxv) {
      return {
        minVal: minv,
        maxVal: maxv
      };
    };
  };
  var showPix = {
    show: function(v) {
      return "(Pix " + (show1(v) + ")");
    }
  };
  var showPadding = {
    show: function(v) {
      return "(Padding " + (show3(v) + ")");
    }
  };
  var showOptionTicker = {
    show: function(v) {
      return "(OptionTicker : " + (v + ")");
    }
  };
  var showHtmlId = {
    show: function(v) {
      return "(HtmlId : " + (v + ")");
    }
  };
  var showChartWidth = {
    show: function(v) {
      return "(ChartWidth: " + (show1(v) + ")");
    }
  };
  var showChartHeight = {
    show: function(v) {
      return "(ChartHeight: " + (show1(v) + ")");
    }
  };
  var mainURL = "/maunaloa";
  var eqValueRange = {
    eq: function(x) {
      return function(y) {
        return x.maxVal === y.maxVal && x.minVal === y.minVal;
      };
    }
  };
  var eqUnixTime = {
    eq: function(x) {
      return function(y) {
        return x === y;
      };
    }
  };
  var ordUnixTime = {
    compare: function(v) {
      return function(v1) {
        return compare2(v)(v1);
      };
    },
    Eq0: function() {
      return eqUnixTime;
    }
  };
  var eqHtmlId = {
    eq: function(x) {
      return function(y) {
        return x === y;
      };
    }
  };
  var dayInMillis = 864e5;
  var chartTypeAsInt = function(v) {
    if (v instanceof DayChart) {
      return 1;
    }
    ;
    if (v instanceof WeekChart) {
      return 2;
    }
    ;
    if (v instanceof MonthChart) {
      return 3;
    }
    ;
    throw new Error("Failed pattern match at HarborView.Maunaloa.Common (line 225, column 1 - line 225, column 36): " + [v.constructor.name]);
  };
  var calcPpy = function(v) {
    return function(v1) {
      return function(v2) {
        var padding_justified_h = v - v2.top - v2.bottom;
        return padding_justified_h / (v1.maxVal - v1.minVal);
      };
    };
  };
  var calcPpx = function(v) {
    return function(v1) {
      return function(v2) {
        var padding_w = v - v2.left - v2.right;
        var diffDays = toNumber((v1.oHead - v1.oLast | 0) + 1 | 0);
        return padding_w / diffDays;
      };
    };
  };
  var asChartType = function(v) {
    if (v === 1) {
      return DayChart.value;
    }
    ;
    if (v === 2) {
      return WeekChart.value;
    }
    ;
    if (v === 3) {
      return MonthChart.value;
    }
    ;
    return DayChart.value;
  };

  // output/HarborView.Maunaloa.VRuler/index.js
  var map5 = /* @__PURE__ */ map(functorArray);
  var show2 = /* @__PURE__ */ show(/* @__PURE__ */ showRecord()()(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "h";
    }
  })(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "maxVal";
    }
  })(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "padding";
    }
  })(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "ppy";
    }
  })(/* @__PURE__ */ showRecordFieldsConsNil({
    reflectSymbol: function() {
      return "w";
    }
  })(showChartWidth))(showPix))(showPadding))(showNumber))(showChartHeight)));
  var valueToPix = function(v) {
    return function(value13) {
      return (v.maxVal - value13) * v.ppy + v.padding.top;
    };
  };
  var showHRuler = {
    show: function(v) {
      return "(VRuler " + (show2(v) + ")");
    }
  };
  var pixToValue = function(v) {
    return function(v1) {
      return v.maxVal - (v1 - v.padding.top) / v.ppy;
    };
  };
  var createLine = function(vruler2) {
    return function(vpix) {
      return function(padTop) {
        return function(n) {
          var curPix = padTop + vpix * toNumber(n);
          var val = pixToValue(vruler2)(curPix);
          var tx = toStringWith(fixed(2))(val);
          return {
            p0: curPix,
            tx
          };
        };
      };
    };
  };
  var lines = function(v) {
    return function(num) {
      var vpix = (v.h - v.padding.top - v.padding.bottom) / toNumber(num);
      var sections = range(0)(num);
      return map5(createLine(v)(vpix)(v.padding.top))(sections);
    };
  };
  var paint = function(v) {
    return function(ctx) {
      var curLines = lines(v)(4);
      var linesX = {
        p1: 0,
        p2: v.w
      };
      return fi_lines(ctx)(linesX)(curLines);
    };
  };
  var create = function(v) {
    return function(w) {
      return function(h) {
        return function(pad) {
          return {
            ppy: calcPpy(h)(v)(pad),
            maxVal: v.maxVal,
            w,
            h,
            padding: pad
          };
        };
      };
    };
  };

  // output/HarborView.Maunaloa.Candlestick/index.js
  var show4 = /* @__PURE__ */ show(/* @__PURE__ */ showRecord()()(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "c";
    }
  })(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "h";
    }
  })(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "l";
    }
  })(/* @__PURE__ */ showRecordFieldsConsNil({
    reflectSymbol: function() {
      return "o";
    }
  })(showNumber))(showNumber))(showNumber))(showNumber)));
  var showCandlestick = {
    show: function(v) {
      return "(Candlestick " + (show4(v) + ")");
    }
  };
  var paint2 = function(v) {
    return function(cndls) {
      return function(ctx) {
        return fi_paint(v.xaxis)(cndls)(ctx);
      };
    };
  };
  var candleToPix = function(vr) {
    return function(v) {
      var po = valueToPix(vr)(v.o);
      var pl = valueToPix(vr)(v.l);
      var ph = valueToPix(vr)(v.h);
      var pc = valueToPix(vr)(v.c);
      return {
        o: po,
        h: ph,
        l: pl,
        c: pc
      };
    };
  };

  // output/HarborView.Maunaloa.HRuler/foreign.js
  var fi_incMonths = function(startTime) {
    return function(numMonths) {
      var stm = new Date(startTime);
      return Date.UTC(stm.getFullYear(), stm.getMonth() + numMonths, 1);
    };
  };
  var fi_dateToString = function(tm) {
    var d = new Date(tm);
    var m = d.getMonth() + 1;
    if (m < 10) {
      return "0" + m + "." + d.getFullYear();
    } else {
      return m + "." + d.getFullYear();
    }
  };
  var fi_lines2 = function(ctx) {
    return function(boundary) {
      return function(lines3) {
        return function() {
          const y1 = boundary.p1;
          const y2 = boundary.p2;
          ctx.strokeStyle = "#000000";
          ctx.fillStyle = "#000000";
          ctx.lineWidth = 0.25;
          ctx.beginPath();
          for (var i = 0; i < lines3.length; ++i) {
            const x = lines3[i].p0;
            ctx.moveTo(x, y1);
            ctx.lineTo(x, y2);
            ctx.fillText(lines3[i].tx, x + 5, y1 + 15);
          }
          ctx.stroke();
        };
      };
    };
  };
  var fi_startOfNextMonth = function(tm) {
    const curDate = new Date(tm);
    return Date.UTC(curDate.getFullYear(), curDate.getMonth() + 1, 1);
  };

  // output/HarborView.Util.DateUtil/index.js
  var dateRangeOf = function(v) {
    return function(lx) {
      var lo = v + dayInMillis * toNumber(fromMaybe(0)(last(lx)));
      var hi = v + dayInMillis * toNumber(fromMaybe(0)(head(lx)));
      return new Tuple(lo, hi);
    };
  };

  // output/HarborView.Maunaloa.HRuler/index.js
  var map6 = /* @__PURE__ */ map(functorArray);
  var greaterThanOrEq2 = /* @__PURE__ */ greaterThanOrEq(ordUnixTime);
  var bind2 = /* @__PURE__ */ bind(bindMaybe);
  var timeStampToPix = function(v) {
    return function(v1) {
      var days = (v1 - v.startTime) / dayInMillis;
      return v.padding.left + days * v.ppx;
    };
  };
  var startOfNextMonth = function(v) {
    return fi_startOfNextMonth(v);
  };
  var offsetsToPix = function(startOffset) {
    return function(offsets) {
      return function(v) {
        return function(padLeft) {
          return map6(function(x) {
            return padLeft + toNumber(x - startOffset | 0) * v;
          })(offsets);
        };
      };
    };
  };
  var incMonths = function(v) {
    return function(numMonths) {
      return fi_incMonths(v)(numMonths);
    };
  };
  var dateToString = function(v) {
    return fi_dateToString(v);
  };
  var lines_ = function($copy_timestampFn) {
    return function($copy_endTime) {
      return function($copy_numMonths) {
        return function($copy_curLines) {
          return function($copy_curTime) {
            var $tco_var_timestampFn = $copy_timestampFn;
            var $tco_var_endTime = $copy_endTime;
            var $tco_var_numMonths = $copy_numMonths;
            var $tco_var_curLines = $copy_curLines;
            var $tco_done = false;
            var $tco_result;
            function $tco_loop(timestampFn, endTime, numMonths, curLines, curTime) {
              if (greaterThanOrEq2(curTime)(endTime)) {
                $tco_done = true;
                return curLines;
              }
              ;
              if (otherwise) {
                var nextTime = incMonths(curTime)(numMonths);
                var newCurLines = cons({
                  p0: timestampFn(curTime),
                  tx: dateToString(curTime)
                })(curLines);
                $tco_var_timestampFn = timestampFn;
                $tco_var_endTime = endTime;
                $tco_var_numMonths = numMonths;
                $tco_var_curLines = newCurLines;
                $copy_curTime = nextTime;
                return;
              }
              ;
              throw new Error("Failed pattern match at HarborView.Maunaloa.HRuler (line 81, column 1 - line 81, column 108): " + [timestampFn.constructor.name, endTime.constructor.name, numMonths.constructor.name, curLines.constructor.name, curTime.constructor.name]);
            }
            ;
            while (!$tco_done) {
              $tco_result = $tco_loop($tco_var_timestampFn, $tco_var_endTime, $tco_var_numMonths, $tco_var_curLines, $copy_curTime);
            }
            ;
            return $tco_result;
          };
        };
      };
    };
  };
  var lines2 = function(v) {
    var timestampFn = timeStampToPix(v);
    var snm = startOfNextMonth(v.startTime);
    return lines_(timestampFn)(v.endTime)(v.myIncMonths)([])(snm);
  };
  var paint3 = function(hruler) {
    return function(v) {
      return function(ctx) {
        var curLines = lines2(hruler);
        var linesX = {
          p1: 0,
          p2: v
        };
        return fi_lines2(ctx)(linesX)(curLines);
      };
    };
  };
  var create2 = function(w) {
    return function(minDx) {
      return function(offsets) {
        return function(v) {
          return function(myIncMonths) {
            return bind2(head(offsets))(function(offset0) {
              return bind2(last(offsets))(function(offsetN) {
                var v1 = dateRangeOf(minDx)(offsets);
                var offsetBoundary = {
                  oHead: offset0,
                  oLast: offsetN
                };
                var pix = calcPpx(w)(offsetBoundary)(v);
                return new Just({
                  startTime: v1.value0,
                  endTime: v1.value1,
                  xaxis: offsetsToPix(offsetN)(offsets)(pix)(v.left),
                  ppx: pix,
                  padding: v,
                  myIncMonths
                });
              });
            });
          };
        };
      };
    };
  };

  // output/HarborView.Maunaloa.Line/foreign.js
  var fi_paint2 = function(lines3) {
    return function(ctx) {
      return function() {
        for (var i = 0; i < lines3.length; ++i) {
          paintLine(ctx, lines3[i]);
        }
      };
    };
  };
  var paintLine = function(ctx, line) {
    ctx.strokeStyle = line.strokeStyle;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    const y = line.yaxis;
    const x = line.xaxis;
    ctx.moveTo(x[0], y[0]);
    for (var i = 1; i < x.length; ++i) {
      ctx.lineTo(x[i], y[i]);
    }
    ctx.stroke();
  };

  // output/HarborView.Maunaloa.Line/index.js
  var map7 = /* @__PURE__ */ map(functorArray);
  var strokes = ["#ff0000", "#aa00ff"];
  var lineToPix = function(vr) {
    return function(line) {
      var vfun = valueToPix(vr);
      return map7(vfun)(line);
    };
  };
  var createJsLine = function(xaxis) {
    return function(line) {
      return function(strokeStyle) {
        return {
          xaxis,
          yaxis: line,
          strokeStyle
        };
      };
    };
  };
  var paint4 = function(v) {
    return function(lx) {
      return function(ctx) {
        var fn = createJsLine(v.xaxis);
        var jsLines = zipWith(fn)(lx)(strokes);
        return fi_paint2(jsLines)(ctx);
      };
    };
  };

  // output/HarborView.Maunaloa.Chart/index.js
  var show5 = /* @__PURE__ */ show(/* @__PURE__ */ showArray(/* @__PURE__ */ showArray(showNumber)));
  var show12 = /* @__PURE__ */ show(/* @__PURE__ */ showArray(showCandlestick));
  var show22 = /* @__PURE__ */ show(showHtmlId);
  var show32 = /* @__PURE__ */ show(showHRuler);
  var show42 = /* @__PURE__ */ show(showChartWidth);
  var show52 = /* @__PURE__ */ show(showChartHeight);
  var addLevelIdIsSymbol = {
    reflectSymbol: function() {
      return "addLevelId";
    }
  };
  var fetchLevelIdIsSymbol = {
    reflectSymbol: function() {
      return "fetchLevelId";
    }
  };
  var levelCanvasIdIsSymbol = {
    reflectSymbol: function() {
      return "levelCanvasId";
    }
  };
  var show6 = /* @__PURE__ */ show(/* @__PURE__ */ showMaybe(/* @__PURE__ */ showRecord()()(/* @__PURE__ */ showRecordFieldsCons(addLevelIdIsSymbol)(/* @__PURE__ */ showRecordFieldsCons(fetchLevelIdIsSymbol)(/* @__PURE__ */ showRecordFieldsConsNil(levelCanvasIdIsSymbol)(showHtmlId))(showHtmlId))(showHtmlId))));
  var logShow2 = /* @__PURE__ */ logShow(showString);
  var applySecond2 = /* @__PURE__ */ applySecond(applyEffect);
  var pure3 = /* @__PURE__ */ pure(applicativeEffect);
  var Chart = /* @__PURE__ */ function() {
    function Chart2(value0) {
      this.value0 = value0;
    }
    ;
    Chart2.create = function(value0) {
      return new Chart2(value0);
    };
    return Chart2;
  }();
  var ChartWithoutTicker = /* @__PURE__ */ function() {
    function ChartWithoutTicker2(value0) {
      this.value0 = value0;
    }
    ;
    ChartWithoutTicker2.create = function(value0) {
      return new ChartWithoutTicker2(value0);
    };
    return ChartWithoutTicker2;
  }();
  var EmptyChart = /* @__PURE__ */ function() {
    function EmptyChart2() {
    }
    ;
    EmptyChart2.value = new EmptyChart2();
    return EmptyChart2;
  }();
  var toRectangle = function(v) {
    if (v instanceof Chart) {
      return {
        x: 0,
        y: 0,
        width: v.value0.w,
        height: v.value0.h
      };
    }
    ;
    if (v instanceof ChartWithoutTicker) {
      return {
        x: 0,
        y: 0,
        width: v.value0.w,
        height: v.value0.h
      };
    }
    ;
    if (v instanceof EmptyChart) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };
    }
    ;
    throw new Error("Failed pattern match at HarborView.Maunaloa.Chart (line 119, column 1 - line 119, column 41): " + [v.constructor.name]);
  };
  var showChart = {
    show: function(v) {
      if (v instanceof Chart) {
        return "(Chart lines: " + (show5(v.value0.lines) + (", candlesticks: " + (show12(v.value0.candlesticks) + (", canvasId: " + (show22(v.value0.canvasId) + (", vruler: " + (show32(v.value0.vruler) + (", w: " + (show42(v.value0.w) + (", h: " + (show52(v.value0.h) + (", chartLevel: " + (show6(v.value0.chartLevel) + ")")))))))))))));
      }
      ;
      if (v instanceof ChartWithoutTicker) {
        return "(ChartWithoutTicker : " + (", canvasId: " + (show22(v.value0.canvasId) + (", w: " + (show42(v.value0.w) + (", h: " + (show52(v.value0.h) + ")"))))));
      }
      ;
      if (v instanceof EmptyChart) {
        return "(EmptyChart)";
      }
      ;
      throw new Error("Failed pattern match at HarborView.Maunaloa.Chart (line 85, column 1 - line 100, column 23): " + [v.constructor.name]);
    }
  };
  var paintEmpty = function(v) {
    if (v instanceof ChartWithoutTicker) {
      return function __do2() {
        var canvas = getCanvasElementById(v.value0.canvasId)();
        if (canvas instanceof Nothing) {
          return logShow2("CanvasId " + (v.value0.canvasId + " does not exist!"))();
        }
        ;
        if (canvas instanceof Just) {
          var ctx = applySecond2(logShow2("Drawing canvas: " + v.value0.canvasId))(getContext2D(canvas.value0))();
          var r = toRectangle(v);
          return clearRect(ctx)(r)();
        }
        ;
        throw new Error("Failed pattern match at HarborView.Maunaloa.Chart (line 150, column 9 - line 159, column 43): " + [canvas.constructor.name]);
      };
    }
    ;
    return pure3(unit);
  };
  var paint5 = function(v) {
    return function(v1) {
      if (v1 instanceof Chart) {
        return function __do2() {
          var canvas = getCanvasElementById(v1.value0.canvasId)();
          if (canvas instanceof Nothing) {
            return logShow2("CanvasId " + (v1.value0.canvasId + " does not exist!"))();
          }
          ;
          if (canvas instanceof Just) {
            var ctx = applySecond2(logShow2("Drawing canvas: " + v1.value0.canvasId))(getContext2D(canvas.value0))();
            var r = toRectangle(v1);
            return applySecond2(applySecond2(applySecond2(applySecond2(clearRect(ctx)(r))(paint(v1.value0.vruler)(ctx)))(paint3(v)(v1.value0.vruler.h)(ctx)))(paint4(v)(v1.value0.lines)(ctx)))(paint2(v)(v1.value0.candlesticks)(ctx))();
          }
          ;
          throw new Error("Failed pattern match at HarborView.Maunaloa.Chart (line 130, column 9 - line 143, column 55): " + [canvas.constructor.name]);
        };
      }
      ;
      return pure3(unit);
    };
  };
  var padding = {
    left: 50,
    top: 0,
    right: 50,
    bottom: 0
  };
  var vruler = function(vr) {
    return function(w) {
      return function(h) {
        return create(vr)(w)(h)(padding);
      };
    };
  };

  // output/Data.String.CodePoints/foreign.js
  var hasArrayFrom = typeof Array.from === "function";
  var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
  var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
  var hasCodePointAt = typeof String.prototype.codePointAt === "function";
  var _unsafeCodePointAt0 = function(fallback) {
    return hasCodePointAt ? function(str) {
      return str.codePointAt(0);
    } : fallback;
  };
  var _toCodePointArray = function(fallback) {
    return function(unsafeCodePointAt02) {
      if (hasArrayFrom) {
        return function(str) {
          return Array.from(str, unsafeCodePointAt02);
        };
      }
      return fallback;
    };
  };

  // output/Data.Enum/foreign.js
  function toCharCode(c) {
    return c.charCodeAt(0);
  }
  function fromCharCode(c) {
    return String.fromCharCode(c);
  }

  // output/Data.Enum/index.js
  var bottom1 = /* @__PURE__ */ bottom(boundedChar);
  var top1 = /* @__PURE__ */ top(boundedChar);
  var fromEnum = function(dict) {
    return dict.fromEnum;
  };
  var defaultSucc = function(toEnum$prime) {
    return function(fromEnum$prime) {
      return function(a) {
        return toEnum$prime(fromEnum$prime(a) + 1 | 0);
      };
    };
  };
  var defaultPred = function(toEnum$prime) {
    return function(fromEnum$prime) {
      return function(a) {
        return toEnum$prime(fromEnum$prime(a) - 1 | 0);
      };
    };
  };
  var charToEnum = function(v) {
    if (v >= toCharCode(bottom1) && v <= toCharCode(top1)) {
      return new Just(fromCharCode(v));
    }
    ;
    return Nothing.value;
  };
  var enumChar = {
    succ: /* @__PURE__ */ defaultSucc(charToEnum)(toCharCode),
    pred: /* @__PURE__ */ defaultPred(charToEnum)(toCharCode),
    Ord0: function() {
      return ordChar;
    }
  };
  var boundedEnumChar = /* @__PURE__ */ function() {
    return {
      cardinality: toCharCode(top1) - toCharCode(bottom1) | 0,
      toEnum: charToEnum,
      fromEnum: toCharCode,
      Bounded0: function() {
        return boundedChar;
      },
      Enum1: function() {
        return enumChar;
      }
    };
  }();

  // output/Data.String.CodeUnits/foreign.js
  var length2 = function(s) {
    return s.length;
  };
  var drop2 = function(n) {
    return function(s) {
      return s.substring(n);
    };
  };

  // output/Data.String.Unsafe/foreign.js
  var charAt = function(i) {
    return function(s) {
      if (i >= 0 && i < s.length)
        return s.charAt(i);
      throw new Error("Data.String.Unsafe.charAt: Invalid index.");
    };
  };

  // output/Data.String.Common/foreign.js
  var joinWith = function(s) {
    return function(xs) {
      return xs.join(s);
    };
  };

  // output/Data.String.CodePoints/index.js
  var fromEnum2 = /* @__PURE__ */ fromEnum(boundedEnumChar);
  var map8 = /* @__PURE__ */ map(functorMaybe);
  var unfoldr2 = /* @__PURE__ */ unfoldr(unfoldableArray);
  var unsurrogate = function(lead) {
    return function(trail) {
      return (((lead - 55296 | 0) * 1024 | 0) + (trail - 56320 | 0) | 0) + 65536 | 0;
    };
  };
  var isTrail = function(cu) {
    return 56320 <= cu && cu <= 57343;
  };
  var isLead = function(cu) {
    return 55296 <= cu && cu <= 56319;
  };
  var uncons = function(s) {
    var v = length2(s);
    if (v === 0) {
      return Nothing.value;
    }
    ;
    if (v === 1) {
      return new Just({
        head: fromEnum2(charAt(0)(s)),
        tail: ""
      });
    }
    ;
    var cu1 = fromEnum2(charAt(1)(s));
    var cu0 = fromEnum2(charAt(0)(s));
    var $42 = isLead(cu0) && isTrail(cu1);
    if ($42) {
      return new Just({
        head: unsurrogate(cu0)(cu1),
        tail: drop2(2)(s)
      });
    }
    ;
    return new Just({
      head: cu0,
      tail: drop2(1)(s)
    });
  };
  var unconsButWithTuple = function(s) {
    return map8(function(v) {
      return new Tuple(v.head, v.tail);
    })(uncons(s));
  };
  var toCodePointArrayFallback = function(s) {
    return unfoldr2(unconsButWithTuple)(s);
  };
  var unsafeCodePointAt0Fallback = function(s) {
    var cu0 = fromEnum2(charAt(0)(s));
    var $46 = isLead(cu0) && length2(s) > 1;
    if ($46) {
      var cu1 = fromEnum2(charAt(1)(s));
      var $47 = isTrail(cu1);
      if ($47) {
        return unsurrogate(cu0)(cu1);
      }
      ;
      return cu0;
    }
    ;
    return cu0;
  };
  var unsafeCodePointAt0 = /* @__PURE__ */ _unsafeCodePointAt0(unsafeCodePointAt0Fallback);
  var toCodePointArray = /* @__PURE__ */ _toCodePointArray(toCodePointArrayFallback)(unsafeCodePointAt0);
  var length3 = function($73) {
    return length(toCodePointArray($73));
  };

  // output/HarborView.Maunaloa.LevelLine/foreign.js
  var x1 = 45;
  var STD_LINE = 1;
  var RISC_LINE = 2;
  var BREAK_EVEN_LINE = 3;
  var NO_SUCH_LINE = 99;
  var getLin = (chartType) => {
    switch (chartType) {
      case 1:
        return linDay;
      case 2:
        return linWeek;
      case 3:
        return linMonth;
    }
  };
  var lineShapeOf = (line) => {
    return line.value0.lt;
  };
  var createPilotLine = function(y, strokeStyle) {
    return { y, strokeStyle };
  };
  var closestLine = function(items, y) {
    var dist = 1e8;
    var index4 = null;
    for (var i = 0; i < items.length; ++i) {
      if (lineShapeOf(items[i]) === BREAK_EVEN_LINE) {
        continue;
      }
      const curRec = items[i].value0;
      const dy = curRec.y - y;
      const thisDist = dy * dy;
      if (thisDist < dist) {
        index4 = i;
        dist = thisDist;
      }
    }
    if (index4 === null) {
      return null;
    } else {
      return items[index4];
    }
  };
  var initLines = function() {
    return {
      items: [],
      pilotLine: null
    };
  };
  var randomBetween = function(min5, max7) {
    return Math.floor(Math.random() * (max7 - min5 + 1) + min5);
  };
  var LevelLineInternal = class {
    constructor() {
      this.ctx = null;
      this.v = null;
      this.lines = initLines();
      this.eventListeners = [];
    }
    paint(x2, y, displayValue, strokeStyle) {
      const _ctx = this.ctx;
      _ctx.lineWidth = 2;
      _ctx.strokeStyle = strokeStyle;
      _ctx.beginPath();
      _ctx.moveTo(x1, y);
      _ctx.lineTo(x2, y);
      _ctx.stroke();
      _ctx.font = "16px Arial";
      _ctx.fillStyle = "#000000";
      _ctx.fillText(displayValue, x1, y - 10);
    }
    clearRect() {
      this.ctx.clearRect(0, 0, this.v.w, this.v.h);
    }
    draw() {
      this.clearRect();
      const items = this.lines.items;
      for (var i = 0; i < items.length; ++i) {
        const curLine = items[i];
        const adtShape = lineShapeOf(curLine);
        switch (adtShape) {
          case STD_LINE:
            this.paintStdLine(curLine);
            break;
          case RISC_LINE:
            this.paintRiscLine(curLine);
            break;
          case BREAK_EVEN_LINE:
            this.paintBreakEvenLine(curLine);
            break;
          case NO_SUCH_LINE:
            break;
        }
      }
      this.paintPilotLine();
    }
    paintStdLine(line) {
      const rec = line.value0;
      if (rec.selected === true) {
        return;
      }
      const y = rec.y;
      const displayValue = this.pixToValue(y).toFixed(2);
      const x2 = this.v.w - x1;
      this.paint(x2, y, displayValue, rec.color);
    }
    paintRiscLine(line) {
      const rec = line.value0;
      if (rec.selected === true) {
        return;
      }
      const displayValue = this.pixToValue(rec.y).toFixed(2) + " - " + rec.ticker + ", bid: " + rec.bid.toFixed(2) + ", risc: " + rec.risc.toFixed(2) + ", risc price: " + rec.riscPrice.toFixed(2);
      const x2 = this.v.w - x1;
      this.paint(x2, rec.y, displayValue, "red");
    }
    paintBreakEvenLine(line) {
      const rec = line.value0;
      if (rec.selected === true) {
        return;
      }
      const y = rec.y;
      const displayValue = rec.breakEven.toFixed(2) + " - " + rec.ticker + ", ask: " + rec.ask.toFixed(2);
      const x2 = this.v.w - x1;
      this.paint(x2, y, displayValue, "green");
    }
    paintPilotLine() {
      if (this.lines.pilotLine === null) {
        return;
      }
      const y = this.lines.pilotLine.y;
      const displayValue = this.pixToValue(y).toFixed(2);
      const x2 = this.v.w - x1;
      this.paint(x2, y, displayValue, "black");
    }
    pixToValue(pix) {
      const _v = this.v;
      return _v.maxVal - (pix - _v.padding.top) / _v.ppy;
    }
    valueToPix(value13) {
      const _v = this.v;
      return (_v.maxVal - value13) * _v.ppy + _v.padding.top;
    }
    addListener(listener) {
      this.eventListeners.push(listener);
    }
    resetListeners() {
      this.eventListeners = [];
      this.lines = initLines();
    }
    getListeners() {
      return this.eventListeners;
    }
    onMouseDown(evt) {
      const items = this.lines.items;
      if (items.length === 0) {
        return;
      }
      if (items.length === 1) {
        const curLine = items[0].value0;
        curLine.selected = true;
        this.lines.pilotLine = createPilotLine(curLine.y, "black");
      } else {
        const cl = closestLine(items, evt.offsetY);
        if (cl !== null) {
          cl.value0.selected = true;
          this.lines.pilotLine = createPilotLine(cl.y, "black");
        }
      }
    }
    onMouseDrag(evt) {
      if (this.lines.pilotLine === null) {
        return;
      }
      this.lines.pilotLine.y = evt.offsetY;
      this.draw();
    }
    onMouseUpImpl(just, nothing) {
      var result = nothing;
      const items = this.lines.items;
      for (var i = 0; i < items.length; ++i) {
        const curLine = items[i];
        const adtShape = lineShapeOf(curLine);
        if (adtShape === BREAK_EVEN_LINE) {
          continue;
        }
        const curRec = curLine.value0;
        if (curRec.selected == true) {
          curRec.y = this.lines.pilotLine.y;
          curRec.selected = false;
          if (adtShape === RISC_LINE) {
            result = just(curLine);
          }
        }
      }
      this.lines.pilotLine = null;
      if (result === nothing) {
        this.draw();
      }
      return result;
    }
    updateRiscLine(riscLine, newValue) {
      console.log(riscLine);
      const items = this.lines.items;
      for (var i = 0; i < items.length; ++i) {
        const item = items[i];
        var obj = item.value0;
        if (item === riscLine) {
          obj.riscPrice = newValue;
          obj.risc = obj.ask - newValue;
          break;
        }
      }
      this.draw();
    }
    redraw(ctx, vruler2) {
      ctx.clearRect(0, 0, vruler2.w, vruler2.h);
      this.ctx = ctx;
      this.v = vruler2;
    }
    clearCanvas() {
      if (this.ctx === null) {
        return;
      }
      if (this.v === null) {
        return;
      }
      this.clearRect();
      this.lines = initLines();
    }
    clearLines() {
      this.lines = initLines();
      this.clearRect();
    }
    addLine(line) {
      this.lines.items.push(line);
      const adtShape = lineShapeOf(line);
      switch (adtShape) {
        case STD_LINE:
          this.paintStdLine(line);
          break;
        case RISC_LINE:
          this.paintRiscLine(line);
          break;
        case BREAK_EVEN_LINE:
          this.paintBreakEvenLine(line);
          break;
        default:
          console.log("No such class: " + adtShape);
      }
    }
  };
  var linDay = new LevelLineInternal();
  var linWeek = new LevelLineInternal();
  var linMonth = new LevelLineInternal();
  var addListener = (chartType) => (listener) => () => {
    const lin = getLin(chartType);
    lin.addListener(listener);
  };
  var resetListeners = (chartType) => () => {
    const lin = getLin(chartType);
    lin.resetListeners();
  };
  var getListeners = (chartType) => () => {
    const lin = getLin(chartType);
    return lin.getListeners();
  };
  var onMouseDown = (chartType) => (evt) => () => {
    const lin = getLin(chartType);
    lin.onMouseDown(evt);
  };
  var onMouseDrag = (chartType) => (evt) => () => {
    const lin = getLin(chartType);
    lin.onMouseDrag(evt);
  };
  var onMouseUpImpl = (chartType) => (just) => (nothing) => () => {
    const lin = getLin(chartType);
    return lin.onMouseUpImpl(just, nothing);
  };
  var updateRiscLine = (chartType) => (riscLine) => (newValue) => () => {
    const lin = getLin(chartType);
    lin.updateRiscLine(riscLine, newValue);
  };
  var redraw = (chartType) => (ctx) => (vruler2) => () => {
    const lin = getLin(chartType);
    lin.redraw(ctx, vruler2);
  };
  var clearCanvas = (chartType) => () => {
    const lin = getLin(chartType);
    lin.clearCanvas();
  };
  var clearLines = (chartType) => () => {
    const lin = getLin(chartType);
    lin.clearLines();
  };
  var addLine = (chartType) => (line) => () => {
    const lin = getLin(chartType);
    lin.addLine(line);
  };
  var randomRgb = () => {
    const r = randomBetween(0, 220);
    const g = randomBetween(0, 220);
    const b = randomBetween(0, 220);
    return `rgb(${r},${g},${b})`;
  };

  // output/Affjax/foreign.js
  function _ajax(platformSpecificDriver, timeoutErrorMessageIdent, requestFailedMessageIdent, mkHeader, options2) {
    return function(errback, callback) {
      var xhr = platformSpecificDriver.newXHR();
      var fixedUrl = platformSpecificDriver.fixupUrl(options2.url, xhr);
      xhr.open(options2.method || "GET", fixedUrl, true, options2.username, options2.password);
      if (options2.headers) {
        try {
          for (var i = 0, header; (header = options2.headers[i]) != null; i++) {
            xhr.setRequestHeader(header.field, header.value);
          }
        } catch (e) {
          errback(e);
        }
      }
      var onerror = function(msgIdent) {
        return function() {
          errback(new Error(msgIdent));
        };
      };
      xhr.onerror = onerror(requestFailedMessageIdent);
      xhr.ontimeout = onerror(timeoutErrorMessageIdent);
      xhr.onload = function() {
        callback({
          status: xhr.status,
          statusText: xhr.statusText,
          headers: xhr.getAllResponseHeaders().split("\r\n").filter(function(header2) {
            return header2.length > 0;
          }).map(function(header2) {
            var i2 = header2.indexOf(":");
            return mkHeader(header2.substring(0, i2))(header2.substring(i2 + 2));
          }),
          body: xhr.response
        });
      };
      xhr.responseType = options2.responseType;
      xhr.withCredentials = options2.withCredentials;
      xhr.timeout = options2.timeout;
      xhr.send(options2.content);
      return function(error3, cancelErrback, cancelCallback) {
        try {
          xhr.abort();
        } catch (e) {
          return cancelErrback(e);
        }
        return cancelCallback();
      };
    };
  }

  // output/Data.MediaType.Common/index.js
  var applicationJSON = "application/json";
  var applicationFormURLEncoded = "application/x-www-form-urlencoded";

  // output/Affjax.RequestBody/index.js
  var ArrayView = /* @__PURE__ */ function() {
    function ArrayView2(value0) {
      this.value0 = value0;
    }
    ;
    ArrayView2.create = function(value0) {
      return new ArrayView2(value0);
    };
    return ArrayView2;
  }();
  var Blob = /* @__PURE__ */ function() {
    function Blob3(value0) {
      this.value0 = value0;
    }
    ;
    Blob3.create = function(value0) {
      return new Blob3(value0);
    };
    return Blob3;
  }();
  var Document = /* @__PURE__ */ function() {
    function Document3(value0) {
      this.value0 = value0;
    }
    ;
    Document3.create = function(value0) {
      return new Document3(value0);
    };
    return Document3;
  }();
  var $$String = /* @__PURE__ */ function() {
    function $$String3(value0) {
      this.value0 = value0;
    }
    ;
    $$String3.create = function(value0) {
      return new $$String3(value0);
    };
    return $$String3;
  }();
  var FormData = /* @__PURE__ */ function() {
    function FormData2(value0) {
      this.value0 = value0;
    }
    ;
    FormData2.create = function(value0) {
      return new FormData2(value0);
    };
    return FormData2;
  }();
  var FormURLEncoded = /* @__PURE__ */ function() {
    function FormURLEncoded2(value0) {
      this.value0 = value0;
    }
    ;
    FormURLEncoded2.create = function(value0) {
      return new FormURLEncoded2(value0);
    };
    return FormURLEncoded2;
  }();
  var Json = /* @__PURE__ */ function() {
    function Json3(value0) {
      this.value0 = value0;
    }
    ;
    Json3.create = function(value0) {
      return new Json3(value0);
    };
    return Json3;
  }();
  var toMediaType = function(v) {
    if (v instanceof FormURLEncoded) {
      return new Just(applicationFormURLEncoded);
    }
    ;
    if (v instanceof Json) {
      return new Just(applicationJSON);
    }
    ;
    return Nothing.value;
  };

  // output/Affjax.RequestHeader/index.js
  var unwrap3 = /* @__PURE__ */ unwrap();
  var Accept = /* @__PURE__ */ function() {
    function Accept2(value0) {
      this.value0 = value0;
    }
    ;
    Accept2.create = function(value0) {
      return new Accept2(value0);
    };
    return Accept2;
  }();
  var ContentType = /* @__PURE__ */ function() {
    function ContentType2(value0) {
      this.value0 = value0;
    }
    ;
    ContentType2.create = function(value0) {
      return new ContentType2(value0);
    };
    return ContentType2;
  }();
  var RequestHeader = /* @__PURE__ */ function() {
    function RequestHeader2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    RequestHeader2.create = function(value0) {
      return function(value1) {
        return new RequestHeader2(value0, value1);
      };
    };
    return RequestHeader2;
  }();
  var value = function(v) {
    if (v instanceof Accept) {
      return unwrap3(v.value0);
    }
    ;
    if (v instanceof ContentType) {
      return unwrap3(v.value0);
    }
    ;
    if (v instanceof RequestHeader) {
      return v.value1;
    }
    ;
    throw new Error("Failed pattern match at Affjax.RequestHeader (line 26, column 1 - line 26, column 33): " + [v.constructor.name]);
  };
  var name2 = function(v) {
    if (v instanceof Accept) {
      return "Accept";
    }
    ;
    if (v instanceof ContentType) {
      return "Content-Type";
    }
    ;
    if (v instanceof RequestHeader) {
      return v.value0;
    }
    ;
    throw new Error("Failed pattern match at Affjax.RequestHeader (line 21, column 1 - line 21, column 32): " + [v.constructor.name]);
  };

  // output/Affjax.ResponseFormat/index.js
  var identity6 = /* @__PURE__ */ identity(categoryFn);
  var $$ArrayBuffer = /* @__PURE__ */ function() {
    function $$ArrayBuffer2(value0) {
      this.value0 = value0;
    }
    ;
    $$ArrayBuffer2.create = function(value0) {
      return new $$ArrayBuffer2(value0);
    };
    return $$ArrayBuffer2;
  }();
  var Blob2 = /* @__PURE__ */ function() {
    function Blob3(value0) {
      this.value0 = value0;
    }
    ;
    Blob3.create = function(value0) {
      return new Blob3(value0);
    };
    return Blob3;
  }();
  var Document2 = /* @__PURE__ */ function() {
    function Document3(value0) {
      this.value0 = value0;
    }
    ;
    Document3.create = function(value0) {
      return new Document3(value0);
    };
    return Document3;
  }();
  var Json2 = /* @__PURE__ */ function() {
    function Json3(value0) {
      this.value0 = value0;
    }
    ;
    Json3.create = function(value0) {
      return new Json3(value0);
    };
    return Json3;
  }();
  var $$String2 = /* @__PURE__ */ function() {
    function $$String3(value0) {
      this.value0 = value0;
    }
    ;
    $$String3.create = function(value0) {
      return new $$String3(value0);
    };
    return $$String3;
  }();
  var Ignore = /* @__PURE__ */ function() {
    function Ignore2(value0) {
      this.value0 = value0;
    }
    ;
    Ignore2.create = function(value0) {
      return new Ignore2(value0);
    };
    return Ignore2;
  }();
  var toResponseType = function(v) {
    if (v instanceof $$ArrayBuffer) {
      return "arraybuffer";
    }
    ;
    if (v instanceof Blob2) {
      return "blob";
    }
    ;
    if (v instanceof Document2) {
      return "document";
    }
    ;
    if (v instanceof Json2) {
      return "text";
    }
    ;
    if (v instanceof $$String2) {
      return "text";
    }
    ;
    if (v instanceof Ignore) {
      return "";
    }
    ;
    throw new Error("Failed pattern match at Affjax.ResponseFormat (line 44, column 3 - line 50, column 19): " + [v.constructor.name]);
  };
  var toMediaType2 = function(v) {
    if (v instanceof Json2) {
      return new Just(applicationJSON);
    }
    ;
    return Nothing.value;
  };
  var json = /* @__PURE__ */ function() {
    return new Json2(identity6);
  }();
  var ignore = /* @__PURE__ */ function() {
    return new Ignore(identity6);
  }();

  // output/Affjax.ResponseHeader/index.js
  var ResponseHeader = /* @__PURE__ */ function() {
    function ResponseHeader2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    ResponseHeader2.create = function(value0) {
      return function(value1) {
        return new ResponseHeader2(value0, value1);
      };
    };
    return ResponseHeader2;
  }();

  // output/Control.Monad.Except/index.js
  var unwrap4 = /* @__PURE__ */ unwrap();
  var runExcept = function($3) {
    return unwrap4(runExceptT($3));
  };

  // output/Data.Argonaut.Core/foreign.js
  function id(x) {
    return x;
  }
  function stringify(j) {
    return JSON.stringify(j);
  }
  function _caseJson(isNull3, isBool, isNum, isStr, isArr, isObj, j) {
    if (j == null)
      return isNull3();
    else if (typeof j === "boolean")
      return isBool(j);
    else if (typeof j === "number")
      return isNum(j);
    else if (typeof j === "string")
      return isStr(j);
    else if (Object.prototype.toString.call(j) === "[object Array]")
      return isArr(j);
    else
      return isObj(j);
  }

  // output/Foreign.Object/foreign.js
  var empty2 = {};
  function _lookup(no, yes, k, m) {
    return k in m ? yes(m[k]) : no;
  }
  function toArrayWithKey(f) {
    return function(m) {
      var r = [];
      for (var k in m) {
        if (hasOwnProperty.call(m, k)) {
          r.push(f(k)(m[k]));
        }
      }
      return r;
    };
  }
  var keys = Object.keys || toArrayWithKey(function(k) {
    return function() {
      return k;
    };
  });

  // output/Data.Function.Uncurried/foreign.js
  var runFn3 = function(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return fn(a, b, c);
        };
      };
    };
  };
  var runFn4 = function(fn) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return fn(a, b, c, d);
          };
        };
      };
    };
  };

  // output/Data.FunctorWithIndex/foreign.js
  var mapWithIndexArray = function(f) {
    return function(xs) {
      var l = xs.length;
      var result = Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(i)(xs[i]);
      }
      return result;
    };
  };

  // output/Data.FunctorWithIndex/index.js
  var mapWithIndex = function(dict) {
    return dict.mapWithIndex;
  };
  var functorWithIndexArray = {
    mapWithIndex: mapWithIndexArray,
    Functor0: function() {
      return functorArray;
    }
  };

  // output/Data.FoldableWithIndex/index.js
  var foldr8 = /* @__PURE__ */ foldr(foldableArray);
  var mapWithIndex2 = /* @__PURE__ */ mapWithIndex(functorWithIndexArray);
  var foldl8 = /* @__PURE__ */ foldl(foldableArray);
  var foldrWithIndex = function(dict) {
    return dict.foldrWithIndex;
  };
  var foldMapWithIndexDefaultR = function(dictFoldableWithIndex) {
    var foldrWithIndex1 = foldrWithIndex(dictFoldableWithIndex);
    return function(dictMonoid) {
      var append3 = append(dictMonoid.Semigroup0());
      var mempty2 = mempty(dictMonoid);
      return function(f) {
        return foldrWithIndex1(function(i) {
          return function(x) {
            return function(acc) {
              return append3(f(i)(x))(acc);
            };
          };
        })(mempty2);
      };
    };
  };
  var foldableWithIndexArray = {
    foldrWithIndex: function(f) {
      return function(z) {
        var $289 = foldr8(function(v) {
          return function(y) {
            return f(v.value0)(v.value1)(y);
          };
        })(z);
        var $290 = mapWithIndex2(Tuple.create);
        return function($291) {
          return $289($290($291));
        };
      };
    },
    foldlWithIndex: function(f) {
      return function(z) {
        var $292 = foldl8(function(y) {
          return function(v) {
            return f(v.value0)(y)(v.value1);
          };
        })(z);
        var $293 = mapWithIndex2(Tuple.create);
        return function($294) {
          return $292($293($294));
        };
      };
    },
    foldMapWithIndex: function(dictMonoid) {
      return foldMapWithIndexDefaultR(foldableWithIndexArray)(dictMonoid);
    },
    Foldable0: function() {
      return foldableArray;
    }
  };

  // output/Data.TraversableWithIndex/index.js
  var traverseWithIndexDefault = function(dictTraversableWithIndex) {
    var sequence2 = sequence(dictTraversableWithIndex.Traversable2());
    var mapWithIndex4 = mapWithIndex(dictTraversableWithIndex.FunctorWithIndex0());
    return function(dictApplicative) {
      var sequence12 = sequence2(dictApplicative);
      return function(f) {
        var $174 = mapWithIndex4(f);
        return function($175) {
          return sequence12($174($175));
        };
      };
    };
  };
  var traverseWithIndex = function(dict) {
    return dict.traverseWithIndex;
  };
  var traversableWithIndexArray = {
    traverseWithIndex: function(dictApplicative) {
      return traverseWithIndexDefault(traversableWithIndexArray)(dictApplicative);
    },
    FunctorWithIndex0: function() {
      return functorWithIndexArray;
    },
    FoldableWithIndex1: function() {
      return foldableWithIndexArray;
    },
    Traversable2: function() {
      return traversableArray;
    }
  };

  // output/Foreign.Object/index.js
  var lookup = /* @__PURE__ */ function() {
    return runFn4(_lookup)(Nothing.value)(Just.create);
  }();

  // output/Data.Argonaut.Core/index.js
  var verbJsonType = function(def) {
    return function(f) {
      return function(g) {
        return g(def)(f);
      };
    };
  };
  var toJsonType = /* @__PURE__ */ function() {
    return verbJsonType(Nothing.value)(Just.create);
  }();
  var jsonEmptyObject = /* @__PURE__ */ id(empty2);
  var isJsonType = /* @__PURE__ */ verbJsonType(false)(/* @__PURE__ */ $$const(true));
  var caseJsonString = function(d) {
    return function(f) {
      return function(j) {
        return _caseJson($$const(d), $$const(d), $$const(d), f, $$const(d), $$const(d), j);
      };
    };
  };
  var caseJsonObject = function(d) {
    return function(f) {
      return function(j) {
        return _caseJson($$const(d), $$const(d), $$const(d), $$const(d), $$const(d), f, j);
      };
    };
  };
  var toObject = /* @__PURE__ */ toJsonType(caseJsonObject);
  var caseJsonNumber = function(d) {
    return function(f) {
      return function(j) {
        return _caseJson($$const(d), $$const(d), f, $$const(d), $$const(d), $$const(d), j);
      };
    };
  };
  var caseJsonNull = function(d) {
    return function(f) {
      return function(j) {
        return _caseJson(f, $$const(d), $$const(d), $$const(d), $$const(d), $$const(d), j);
      };
    };
  };
  var isNull = /* @__PURE__ */ isJsonType(caseJsonNull);
  var caseJsonArray = function(d) {
    return function(f) {
      return function(j) {
        return _caseJson($$const(d), $$const(d), $$const(d), $$const(d), f, $$const(d), j);
      };
    };
  };
  var toArray = /* @__PURE__ */ toJsonType(caseJsonArray);

  // output/Data.Argonaut.Parser/foreign.js
  function _jsonParser(fail3, succ, s) {
    try {
      return succ(JSON.parse(s));
    } catch (e) {
      return fail3(e.message);
    }
  }

  // output/Data.Argonaut.Parser/index.js
  var jsonParser = function(j) {
    return _jsonParser(Left.create, Right.create, j);
  };

  // output/JSURI/foreign.js
  function encodeURIComponent_to_RFC3986(input) {
    return input.replace(/[!'()*]/g, function(c) {
      return "%" + c.charCodeAt(0).toString(16);
    });
  }
  function _encodeFormURLComponent(fail3, succeed, input) {
    try {
      return succeed(encodeURIComponent_to_RFC3986(encodeURIComponent(input)).replace(/%20/g, "+"));
    } catch (err) {
      return fail3(err);
    }
  }

  // output/JSURI/index.js
  var encodeFormURLComponent = /* @__PURE__ */ function() {
    return runFn3(_encodeFormURLComponent)($$const(Nothing.value))(Just.create);
  }();

  // output/Data.FormURLEncoded/index.js
  var apply2 = /* @__PURE__ */ apply(applyMaybe);
  var map9 = /* @__PURE__ */ map(functorMaybe);
  var traverse2 = /* @__PURE__ */ traverse(traversableArray)(applicativeMaybe);
  var toArray2 = function(v) {
    return v;
  };
  var encode = /* @__PURE__ */ function() {
    var encodePart = function(v) {
      if (v.value1 instanceof Nothing) {
        return encodeFormURLComponent(v.value0);
      }
      ;
      if (v.value1 instanceof Just) {
        return apply2(map9(function(key) {
          return function(val) {
            return key + ("=" + val);
          };
        })(encodeFormURLComponent(v.value0)))(encodeFormURLComponent(v.value1.value0));
      }
      ;
      throw new Error("Failed pattern match at Data.FormURLEncoded (line 37, column 16 - line 39, column 114): " + [v.constructor.name]);
    };
    var $37 = map9(joinWith("&"));
    var $38 = traverse2(encodePart);
    return function($39) {
      return $37($38(toArray2($39)));
    };
  }();

  // output/Data.HTTP.Method/index.js
  var OPTIONS = /* @__PURE__ */ function() {
    function OPTIONS2() {
    }
    ;
    OPTIONS2.value = new OPTIONS2();
    return OPTIONS2;
  }();
  var GET = /* @__PURE__ */ function() {
    function GET2() {
    }
    ;
    GET2.value = new GET2();
    return GET2;
  }();
  var HEAD = /* @__PURE__ */ function() {
    function HEAD2() {
    }
    ;
    HEAD2.value = new HEAD2();
    return HEAD2;
  }();
  var POST = /* @__PURE__ */ function() {
    function POST2() {
    }
    ;
    POST2.value = new POST2();
    return POST2;
  }();
  var PUT = /* @__PURE__ */ function() {
    function PUT2() {
    }
    ;
    PUT2.value = new PUT2();
    return PUT2;
  }();
  var DELETE = /* @__PURE__ */ function() {
    function DELETE2() {
    }
    ;
    DELETE2.value = new DELETE2();
    return DELETE2;
  }();
  var TRACE = /* @__PURE__ */ function() {
    function TRACE2() {
    }
    ;
    TRACE2.value = new TRACE2();
    return TRACE2;
  }();
  var CONNECT = /* @__PURE__ */ function() {
    function CONNECT2() {
    }
    ;
    CONNECT2.value = new CONNECT2();
    return CONNECT2;
  }();
  var PROPFIND = /* @__PURE__ */ function() {
    function PROPFIND2() {
    }
    ;
    PROPFIND2.value = new PROPFIND2();
    return PROPFIND2;
  }();
  var PROPPATCH = /* @__PURE__ */ function() {
    function PROPPATCH2() {
    }
    ;
    PROPPATCH2.value = new PROPPATCH2();
    return PROPPATCH2;
  }();
  var MKCOL = /* @__PURE__ */ function() {
    function MKCOL2() {
    }
    ;
    MKCOL2.value = new MKCOL2();
    return MKCOL2;
  }();
  var COPY = /* @__PURE__ */ function() {
    function COPY2() {
    }
    ;
    COPY2.value = new COPY2();
    return COPY2;
  }();
  var MOVE = /* @__PURE__ */ function() {
    function MOVE2() {
    }
    ;
    MOVE2.value = new MOVE2();
    return MOVE2;
  }();
  var LOCK = /* @__PURE__ */ function() {
    function LOCK2() {
    }
    ;
    LOCK2.value = new LOCK2();
    return LOCK2;
  }();
  var UNLOCK = /* @__PURE__ */ function() {
    function UNLOCK2() {
    }
    ;
    UNLOCK2.value = new UNLOCK2();
    return UNLOCK2;
  }();
  var PATCH = /* @__PURE__ */ function() {
    function PATCH2() {
    }
    ;
    PATCH2.value = new PATCH2();
    return PATCH2;
  }();
  var unCustomMethod = function(v) {
    return v;
  };
  var showMethod = {
    show: function(v) {
      if (v instanceof OPTIONS) {
        return "OPTIONS";
      }
      ;
      if (v instanceof GET) {
        return "GET";
      }
      ;
      if (v instanceof HEAD) {
        return "HEAD";
      }
      ;
      if (v instanceof POST) {
        return "POST";
      }
      ;
      if (v instanceof PUT) {
        return "PUT";
      }
      ;
      if (v instanceof DELETE) {
        return "DELETE";
      }
      ;
      if (v instanceof TRACE) {
        return "TRACE";
      }
      ;
      if (v instanceof CONNECT) {
        return "CONNECT";
      }
      ;
      if (v instanceof PROPFIND) {
        return "PROPFIND";
      }
      ;
      if (v instanceof PROPPATCH) {
        return "PROPPATCH";
      }
      ;
      if (v instanceof MKCOL) {
        return "MKCOL";
      }
      ;
      if (v instanceof COPY) {
        return "COPY";
      }
      ;
      if (v instanceof MOVE) {
        return "MOVE";
      }
      ;
      if (v instanceof LOCK) {
        return "LOCK";
      }
      ;
      if (v instanceof UNLOCK) {
        return "UNLOCK";
      }
      ;
      if (v instanceof PATCH) {
        return "PATCH";
      }
      ;
      throw new Error("Failed pattern match at Data.HTTP.Method (line 43, column 1 - line 59, column 23): " + [v.constructor.name]);
    }
  };
  var print = /* @__PURE__ */ either(/* @__PURE__ */ show(showMethod))(unCustomMethod);

  // output/Data.NonEmpty/index.js
  var NonEmpty = /* @__PURE__ */ function() {
    function NonEmpty2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    NonEmpty2.create = function(value0) {
      return function(value1) {
        return new NonEmpty2(value0, value1);
      };
    };
    return NonEmpty2;
  }();
  var singleton4 = function(dictPlus) {
    var empty4 = empty(dictPlus);
    return function(a) {
      return new NonEmpty(a, empty4);
    };
  };

  // output/Data.List.Types/index.js
  var Nil = /* @__PURE__ */ function() {
    function Nil3() {
    }
    ;
    Nil3.value = new Nil3();
    return Nil3;
  }();
  var Cons = /* @__PURE__ */ function() {
    function Cons3(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Cons3.create = function(value0) {
      return function(value1) {
        return new Cons3(value0, value1);
      };
    };
    return Cons3;
  }();
  var NonEmptyList = function(x) {
    return x;
  };
  var toList = function(v) {
    return new Cons(v.value0, v.value1);
  };
  var listMap = function(f) {
    var chunkedRevMap = function($copy_chunksAcc) {
      return function($copy_v) {
        var $tco_var_chunksAcc = $copy_chunksAcc;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(chunksAcc, v) {
          if (v instanceof Cons && (v.value1 instanceof Cons && v.value1.value1 instanceof Cons)) {
            $tco_var_chunksAcc = new Cons(v, chunksAcc);
            $copy_v = v.value1.value1.value1;
            return;
          }
          ;
          var unrolledMap = function(v1) {
            if (v1 instanceof Cons && (v1.value1 instanceof Cons && v1.value1.value1 instanceof Nil)) {
              return new Cons(f(v1.value0), new Cons(f(v1.value1.value0), Nil.value));
            }
            ;
            if (v1 instanceof Cons && v1.value1 instanceof Nil) {
              return new Cons(f(v1.value0), Nil.value);
            }
            ;
            return Nil.value;
          };
          var reverseUnrolledMap = function($copy_v1) {
            return function($copy_acc) {
              var $tco_var_v1 = $copy_v1;
              var $tco_done1 = false;
              var $tco_result2;
              function $tco_loop2(v1, acc) {
                if (v1 instanceof Cons && (v1.value0 instanceof Cons && (v1.value0.value1 instanceof Cons && v1.value0.value1.value1 instanceof Cons))) {
                  $tco_var_v1 = v1.value1;
                  $copy_acc = new Cons(f(v1.value0.value0), new Cons(f(v1.value0.value1.value0), new Cons(f(v1.value0.value1.value1.value0), acc)));
                  return;
                }
                ;
                $tco_done1 = true;
                return acc;
              }
              ;
              while (!$tco_done1) {
                $tco_result2 = $tco_loop2($tco_var_v1, $copy_acc);
              }
              ;
              return $tco_result2;
            };
          };
          $tco_done = true;
          return reverseUnrolledMap(chunksAcc)(unrolledMap(v));
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_chunksAcc, $copy_v);
        }
        ;
        return $tco_result;
      };
    };
    return chunkedRevMap(Nil.value);
  };
  var functorList = {
    map: listMap
  };
  var foldableList = {
    foldr: function(f) {
      return function(b) {
        var rev3 = function() {
          var go2 = function($copy_acc) {
            return function($copy_v) {
              var $tco_var_acc = $copy_acc;
              var $tco_done = false;
              var $tco_result;
              function $tco_loop(acc, v) {
                if (v instanceof Nil) {
                  $tco_done = true;
                  return acc;
                }
                ;
                if (v instanceof Cons) {
                  $tco_var_acc = new Cons(v.value0, acc);
                  $copy_v = v.value1;
                  return;
                }
                ;
                throw new Error("Failed pattern match at Data.List.Types (line 107, column 7 - line 107, column 23): " + [acc.constructor.name, v.constructor.name]);
              }
              ;
              while (!$tco_done) {
                $tco_result = $tco_loop($tco_var_acc, $copy_v);
              }
              ;
              return $tco_result;
            };
          };
          return go2(Nil.value);
        }();
        var $281 = foldl(foldableList)(flip(f))(b);
        return function($282) {
          return $281(rev3($282));
        };
      };
    },
    foldl: function(f) {
      var go2 = function($copy_b) {
        return function($copy_v) {
          var $tco_var_b = $copy_b;
          var $tco_done1 = false;
          var $tco_result;
          function $tco_loop(b, v) {
            if (v instanceof Nil) {
              $tco_done1 = true;
              return b;
            }
            ;
            if (v instanceof Cons) {
              $tco_var_b = f(b)(v.value0);
              $copy_v = v.value1;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.List.Types (line 111, column 12 - line 113, column 30): " + [v.constructor.name]);
          }
          ;
          while (!$tco_done1) {
            $tco_result = $tco_loop($tco_var_b, $copy_v);
          }
          ;
          return $tco_result;
        };
      };
      return go2;
    },
    foldMap: function(dictMonoid) {
      var append22 = append(dictMonoid.Semigroup0());
      var mempty2 = mempty(dictMonoid);
      return function(f) {
        return foldl(foldableList)(function(acc) {
          var $283 = append22(acc);
          return function($284) {
            return $283(f($284));
          };
        })(mempty2);
      };
    }
  };
  var foldr2 = /* @__PURE__ */ foldr(foldableList);
  var semigroupList = {
    append: function(xs) {
      return function(ys) {
        return foldr2(Cons.create)(ys)(xs);
      };
    }
  };
  var append1 = /* @__PURE__ */ append(semigroupList);
  var semigroupNonEmptyList = {
    append: function(v) {
      return function(as$prime) {
        return new NonEmpty(v.value0, append1(v.value1)(toList(as$prime)));
      };
    }
  };
  var altList = {
    alt: append1,
    Functor0: function() {
      return functorList;
    }
  };
  var plusList = /* @__PURE__ */ function() {
    return {
      empty: Nil.value,
      Alt0: function() {
        return altList;
      }
    };
  }();

  // output/Data.List.NonEmpty/index.js
  var singleton5 = /* @__PURE__ */ function() {
    var $199 = singleton4(plusList);
    return function($200) {
      return NonEmptyList($199($200));
    };
  }();
  var head2 = function(v) {
    return v.value0;
  };

  // output/Data.Nullable/foreign.js
  var nullImpl = null;
  function nullable(a, r, f) {
    return a == null ? r : f(a);
  }
  function notNull(x) {
    return x;
  }

  // output/Data.Nullable/index.js
  var toNullable = /* @__PURE__ */ maybe(nullImpl)(notNull);
  var toMaybe = function(n) {
    return nullable(n, Nothing.value, Just.create);
  };

  // output/Effect.Aff.Compat/index.js
  var fromEffectFnAff = function(v) {
    return makeAff(function(k) {
      return function __do2() {
        var v1 = v(function($9) {
          return k(Left.create($9))();
        }, function($10) {
          return k(Right.create($10))();
        });
        return function(e) {
          return makeAff(function(k2) {
            return function __do3() {
              v1(e, function($11) {
                return k2(Left.create($11))();
              }, function($12) {
                return k2(Right.create($12))();
              });
              return nonCanceler;
            };
          });
        };
      };
    });
  };

  // output/Foreign/foreign.js
  function tagOf(value13) {
    return Object.prototype.toString.call(value13).slice(8, -1);
  }
  var isArray = Array.isArray || function(value13) {
    return Object.prototype.toString.call(value13) === "[object Array]";
  };

  // output/Foreign/index.js
  var show7 = /* @__PURE__ */ show(showString);
  var show13 = /* @__PURE__ */ show(showInt);
  var ForeignError = /* @__PURE__ */ function() {
    function ForeignError2(value0) {
      this.value0 = value0;
    }
    ;
    ForeignError2.create = function(value0) {
      return new ForeignError2(value0);
    };
    return ForeignError2;
  }();
  var TypeMismatch = /* @__PURE__ */ function() {
    function TypeMismatch3(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    TypeMismatch3.create = function(value0) {
      return function(value1) {
        return new TypeMismatch3(value0, value1);
      };
    };
    return TypeMismatch3;
  }();
  var ErrorAtIndex = /* @__PURE__ */ function() {
    function ErrorAtIndex2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    ErrorAtIndex2.create = function(value0) {
      return function(value1) {
        return new ErrorAtIndex2(value0, value1);
      };
    };
    return ErrorAtIndex2;
  }();
  var ErrorAtProperty = /* @__PURE__ */ function() {
    function ErrorAtProperty2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    ErrorAtProperty2.create = function(value0) {
      return function(value1) {
        return new ErrorAtProperty2(value0, value1);
      };
    };
    return ErrorAtProperty2;
  }();
  var unsafeToForeign = unsafeCoerce2;
  var unsafeFromForeign = unsafeCoerce2;
  var renderForeignError = function(v) {
    if (v instanceof ForeignError) {
      return v.value0;
    }
    ;
    if (v instanceof ErrorAtIndex) {
      return "Error at array index " + (show13(v.value0) + (": " + renderForeignError(v.value1)));
    }
    ;
    if (v instanceof ErrorAtProperty) {
      return "Error at property " + (show7(v.value0) + (": " + renderForeignError(v.value1)));
    }
    ;
    if (v instanceof TypeMismatch) {
      return "Type mismatch: expected " + (v.value0 + (", found " + v.value1));
    }
    ;
    throw new Error("Failed pattern match at Foreign (line 78, column 1 - line 78, column 45): " + [v.constructor.name]);
  };
  var fail = function(dictMonad) {
    var $153 = throwError(monadThrowExceptT(dictMonad));
    return function($154) {
      return $153(singleton5($154));
    };
  };
  var unsafeReadTagged = function(dictMonad) {
    var pure13 = pure(applicativeExceptT(dictMonad));
    var fail1 = fail(dictMonad);
    return function(tag) {
      return function(value13) {
        if (tagOf(value13) === tag) {
          return pure13(unsafeFromForeign(value13));
        }
        ;
        if (otherwise) {
          return fail1(new TypeMismatch(tag, tagOf(value13)));
        }
        ;
        throw new Error("Failed pattern match at Foreign (line 123, column 1 - line 123, column 104): " + [tag.constructor.name, value13.constructor.name]);
      };
    };
  };

  // output/Affjax/index.js
  var pure4 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeExceptT(monadIdentity));
  var fail2 = /* @__PURE__ */ fail(monadIdentity);
  var unsafeReadTagged2 = /* @__PURE__ */ unsafeReadTagged(monadIdentity);
  var alt2 = /* @__PURE__ */ alt(/* @__PURE__ */ altExceptT(semigroupNonEmptyList)(monadIdentity));
  var composeKleisliFlipped2 = /* @__PURE__ */ composeKleisliFlipped(/* @__PURE__ */ bindExceptT(monadIdentity));
  var map10 = /* @__PURE__ */ map(functorMaybe);
  var any3 = /* @__PURE__ */ any(foldableArray)(heytingAlgebraBoolean);
  var eq3 = /* @__PURE__ */ eq(eqString);
  var bindFlipped2 = /* @__PURE__ */ bindFlipped(bindMaybe);
  var map12 = /* @__PURE__ */ map(functorArray);
  var mapFlipped2 = /* @__PURE__ */ mapFlipped(functorAff);
  var $$try2 = /* @__PURE__ */ $$try(monadErrorAff);
  var pure1 = /* @__PURE__ */ pure(applicativeAff);
  var RequestContentError = /* @__PURE__ */ function() {
    function RequestContentError2(value0) {
      this.value0 = value0;
    }
    ;
    RequestContentError2.create = function(value0) {
      return new RequestContentError2(value0);
    };
    return RequestContentError2;
  }();
  var ResponseBodyError = /* @__PURE__ */ function() {
    function ResponseBodyError2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    ResponseBodyError2.create = function(value0) {
      return function(value1) {
        return new ResponseBodyError2(value0, value1);
      };
    };
    return ResponseBodyError2;
  }();
  var TimeoutError = /* @__PURE__ */ function() {
    function TimeoutError2() {
    }
    ;
    TimeoutError2.value = new TimeoutError2();
    return TimeoutError2;
  }();
  var RequestFailedError = /* @__PURE__ */ function() {
    function RequestFailedError2() {
    }
    ;
    RequestFailedError2.value = new RequestFailedError2();
    return RequestFailedError2;
  }();
  var XHROtherError = /* @__PURE__ */ function() {
    function XHROtherError2(value0) {
      this.value0 = value0;
    }
    ;
    XHROtherError2.create = function(value0) {
      return new XHROtherError2(value0);
    };
    return XHROtherError2;
  }();
  var request = function(driver2) {
    return function(req) {
      var parseJSON = function(v2) {
        if (v2 === "") {
          return pure4(jsonEmptyObject);
        }
        ;
        return either(function($74) {
          return fail2(ForeignError.create($74));
        })(pure4)(jsonParser(v2));
      };
      var fromResponse = function() {
        if (req.responseFormat instanceof $$ArrayBuffer) {
          return unsafeReadTagged2("ArrayBuffer");
        }
        ;
        if (req.responseFormat instanceof Blob2) {
          return unsafeReadTagged2("Blob");
        }
        ;
        if (req.responseFormat instanceof Document2) {
          return function(x) {
            return alt2(unsafeReadTagged2("Document")(x))(alt2(unsafeReadTagged2("XMLDocument")(x))(unsafeReadTagged2("HTMLDocument")(x)));
          };
        }
        ;
        if (req.responseFormat instanceof Json2) {
          return composeKleisliFlipped2(function($75) {
            return req.responseFormat.value0(parseJSON($75));
          })(unsafeReadTagged2("String"));
        }
        ;
        if (req.responseFormat instanceof $$String2) {
          return unsafeReadTagged2("String");
        }
        ;
        if (req.responseFormat instanceof Ignore) {
          return $$const(req.responseFormat.value0(pure4(unit)));
        }
        ;
        throw new Error("Failed pattern match at Affjax (line 274, column 18 - line 283, column 57): " + [req.responseFormat.constructor.name]);
      }();
      var extractContent = function(v2) {
        if (v2 instanceof ArrayView) {
          return new Right(v2.value0(unsafeToForeign));
        }
        ;
        if (v2 instanceof Blob) {
          return new Right(unsafeToForeign(v2.value0));
        }
        ;
        if (v2 instanceof Document) {
          return new Right(unsafeToForeign(v2.value0));
        }
        ;
        if (v2 instanceof $$String) {
          return new Right(unsafeToForeign(v2.value0));
        }
        ;
        if (v2 instanceof FormData) {
          return new Right(unsafeToForeign(v2.value0));
        }
        ;
        if (v2 instanceof FormURLEncoded) {
          return note("Body contains values that cannot be encoded as application/x-www-form-urlencoded")(map10(unsafeToForeign)(encode(v2.value0)));
        }
        ;
        if (v2 instanceof Json) {
          return new Right(unsafeToForeign(stringify(v2.value0)));
        }
        ;
        throw new Error("Failed pattern match at Affjax (line 235, column 20 - line 250, column 69): " + [v2.constructor.name]);
      };
      var addHeader = function(mh) {
        return function(hs) {
          if (mh instanceof Just && !any3(on(eq3)(name2)(mh.value0))(hs)) {
            return snoc(hs)(mh.value0);
          }
          ;
          return hs;
        };
      };
      var headers = function(reqContent) {
        return addHeader(map10(ContentType.create)(bindFlipped2(toMediaType)(reqContent)))(addHeader(map10(Accept.create)(toMediaType2(req.responseFormat)))(req.headers));
      };
      var ajaxRequest = function(v2) {
        return {
          method: print(req.method),
          url: req.url,
          headers: map12(function(h) {
            return {
              field: name2(h),
              value: value(h)
            };
          })(headers(req.content)),
          content: v2,
          responseType: toResponseType(req.responseFormat),
          username: toNullable(req.username),
          password: toNullable(req.password),
          withCredentials: req.withCredentials,
          timeout: fromMaybe(0)(map10(function(v1) {
            return v1;
          })(req.timeout))
        };
      };
      var send = function(content3) {
        return mapFlipped2($$try2(fromEffectFnAff(_ajax(driver2, "AffjaxTimeoutErrorMessageIdent", "AffjaxRequestFailedMessageIdent", ResponseHeader.create, ajaxRequest(content3)))))(function(v2) {
          if (v2 instanceof Right) {
            var v1 = runExcept(fromResponse(v2.value0.body));
            if (v1 instanceof Left) {
              return new Left(new ResponseBodyError(head2(v1.value0), v2.value0));
            }
            ;
            if (v1 instanceof Right) {
              return new Right({
                body: v1.value0,
                headers: v2.value0.headers,
                status: v2.value0.status,
                statusText: v2.value0.statusText
              });
            }
            ;
            throw new Error("Failed pattern match at Affjax (line 209, column 9 - line 211, column 52): " + [v1.constructor.name]);
          }
          ;
          if (v2 instanceof Left) {
            return new Left(function() {
              var message2 = message(v2.value0);
              var $61 = message2 === "AffjaxTimeoutErrorMessageIdent";
              if ($61) {
                return TimeoutError.value;
              }
              ;
              var $62 = message2 === "AffjaxRequestFailedMessageIdent";
              if ($62) {
                return RequestFailedError.value;
              }
              ;
              return new XHROtherError(v2.value0);
            }());
          }
          ;
          throw new Error("Failed pattern match at Affjax (line 207, column 144 - line 219, column 28): " + [v2.constructor.name]);
        });
      };
      if (req.content instanceof Nothing) {
        return send(toNullable(Nothing.value));
      }
      ;
      if (req.content instanceof Just) {
        var v = extractContent(req.content.value0);
        if (v instanceof Right) {
          return send(toNullable(new Just(v.value0)));
        }
        ;
        if (v instanceof Left) {
          return pure1(new Left(new RequestContentError(v.value0)));
        }
        ;
        throw new Error("Failed pattern match at Affjax (line 199, column 7 - line 203, column 48): " + [v.constructor.name]);
      }
      ;
      throw new Error("Failed pattern match at Affjax (line 195, column 3 - line 203, column 48): " + [req.content.constructor.name]);
    };
  };
  var printError = function(v) {
    if (v instanceof RequestContentError) {
      return "There was a problem with the request content: " + v.value0;
    }
    ;
    if (v instanceof ResponseBodyError) {
      return "There was a problem with the response body: " + renderForeignError(v.value0);
    }
    ;
    if (v instanceof TimeoutError) {
      return "There was a problem making the request: timeout";
    }
    ;
    if (v instanceof RequestFailedError) {
      return "There was a problem making the request: request failed";
    }
    ;
    if (v instanceof XHROtherError) {
      return "There was a problem making the request: " + message(v.value0);
    }
    ;
    throw new Error("Failed pattern match at Affjax (line 113, column 14 - line 123, column 66): " + [v.constructor.name]);
  };
  var defaultRequest = /* @__PURE__ */ function() {
    return {
      method: new Left(GET.value),
      url: "/",
      headers: [],
      content: Nothing.value,
      username: Nothing.value,
      password: Nothing.value,
      withCredentials: false,
      responseFormat: ignore,
      timeout: Nothing.value
    };
  }();
  var get = function(driver2) {
    return function(rf) {
      return function(u) {
        return request(driver2)({
          method: defaultRequest.method,
          url: u,
          headers: defaultRequest.headers,
          content: defaultRequest.content,
          username: defaultRequest.username,
          password: defaultRequest.password,
          withCredentials: defaultRequest.withCredentials,
          responseFormat: rf,
          timeout: defaultRequest.timeout
        });
      };
    };
  };

  // output/Affjax.Web/foreign.js
  var driver = {
    newXHR: function() {
      return new XMLHttpRequest();
    },
    fixupUrl: function(url) {
      return url || "/";
    }
  };

  // output/Affjax.Web/index.js
  var get2 = /* @__PURE__ */ get(driver);

  // output/Data.Argonaut.Decode.Error/index.js
  var show8 = /* @__PURE__ */ show(showString);
  var show14 = /* @__PURE__ */ show(showInt);
  var TypeMismatch2 = /* @__PURE__ */ function() {
    function TypeMismatch3(value0) {
      this.value0 = value0;
    }
    ;
    TypeMismatch3.create = function(value0) {
      return new TypeMismatch3(value0);
    };
    return TypeMismatch3;
  }();
  var UnexpectedValue = /* @__PURE__ */ function() {
    function UnexpectedValue2(value0) {
      this.value0 = value0;
    }
    ;
    UnexpectedValue2.create = function(value0) {
      return new UnexpectedValue2(value0);
    };
    return UnexpectedValue2;
  }();
  var AtIndex = /* @__PURE__ */ function() {
    function AtIndex2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    AtIndex2.create = function(value0) {
      return function(value1) {
        return new AtIndex2(value0, value1);
      };
    };
    return AtIndex2;
  }();
  var AtKey = /* @__PURE__ */ function() {
    function AtKey2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    AtKey2.create = function(value0) {
      return function(value1) {
        return new AtKey2(value0, value1);
      };
    };
    return AtKey2;
  }();
  var Named = /* @__PURE__ */ function() {
    function Named2(value0, value1) {
      this.value0 = value0;
      this.value1 = value1;
    }
    ;
    Named2.create = function(value0) {
      return function(value1) {
        return new Named2(value0, value1);
      };
    };
    return Named2;
  }();
  var MissingValue = /* @__PURE__ */ function() {
    function MissingValue2() {
    }
    ;
    MissingValue2.value = new MissingValue2();
    return MissingValue2;
  }();
  var showJsonDecodeError = {
    show: function(v) {
      if (v instanceof TypeMismatch2) {
        return "(TypeMismatch " + (show8(v.value0) + ")");
      }
      ;
      if (v instanceof UnexpectedValue) {
        return "(UnexpectedValue " + (stringify(v.value0) + ")");
      }
      ;
      if (v instanceof AtIndex) {
        return "(AtIndex " + (show14(v.value0) + (" " + (show(showJsonDecodeError)(v.value1) + ")")));
      }
      ;
      if (v instanceof AtKey) {
        return "(AtKey " + (show8(v.value0) + (" " + (show(showJsonDecodeError)(v.value1) + ")")));
      }
      ;
      if (v instanceof Named) {
        return "(Named " + (show8(v.value0) + (" " + (show(showJsonDecodeError)(v.value1) + ")")));
      }
      ;
      if (v instanceof MissingValue) {
        return "MissingValue";
      }
      ;
      throw new Error("Failed pattern match at Data.Argonaut.Decode.Error (line 24, column 10 - line 30, column 35): " + [v.constructor.name]);
    }
  };

  // output/Data.Array.NonEmpty.Internal/foreign.js
  var traverse1Impl = function() {
    function Cont(fn) {
      this.fn = fn;
    }
    var emptyList = {};
    var ConsCell = function(head4, tail2) {
      this.head = head4;
      this.tail = tail2;
    };
    function finalCell(head4) {
      return new ConsCell(head4, emptyList);
    }
    function consList(x) {
      return function(xs) {
        return new ConsCell(x, xs);
      };
    }
    function listToArray(list) {
      var arr = [];
      var xs = list;
      while (xs !== emptyList) {
        arr.push(xs.head);
        xs = xs.tail;
      }
      return arr;
    }
    return function(apply3) {
      return function(map16) {
        return function(f) {
          var buildFrom = function(x, ys) {
            return apply3(map16(consList)(f(x)))(ys);
          };
          var go2 = function(acc, currentLen, xs) {
            if (currentLen === 0) {
              return acc;
            } else {
              var last3 = xs[currentLen - 1];
              return new Cont(function() {
                var built = go2(buildFrom(last3, acc), currentLen - 1, xs);
                return built;
              });
            }
          };
          return function(array) {
            var acc = map16(finalCell)(f(array[array.length - 1]));
            var result = go2(acc, array.length - 1, array);
            while (result instanceof Cont) {
              result = result.fn();
            }
            return map16(listToArray)(result);
          };
        };
      };
    };
  }();

  // output/Data.Argonaut.Decode.Decoders/index.js
  var pure5 = /* @__PURE__ */ pure(applicativeEither);
  var map11 = /* @__PURE__ */ map(functorEither);
  var lmap2 = /* @__PURE__ */ lmap(bifunctorEither);
  var composeKleisliFlipped3 = /* @__PURE__ */ composeKleisliFlipped(bindEither);
  var traverseWithIndex2 = /* @__PURE__ */ traverseWithIndex(traversableWithIndexArray)(applicativeEither);
  var decodeString = /* @__PURE__ */ function() {
    return caseJsonString(new Left(new TypeMismatch2("String")))(Right.create);
  }();
  var decodeNumber = /* @__PURE__ */ function() {
    return caseJsonNumber(new Left(new TypeMismatch2("Number")))(Right.create);
  }();
  var decodeMaybe = function(decoder) {
    return function(json2) {
      if (isNull(json2)) {
        return pure5(Nothing.value);
      }
      ;
      if (otherwise) {
        return map11(Just.create)(decoder(json2));
      }
      ;
      throw new Error("Failed pattern match at Data.Argonaut.Decode.Decoders (line 37, column 1 - line 41, column 38): " + [decoder.constructor.name, json2.constructor.name]);
    };
  };
  var decodeJArray = /* @__PURE__ */ function() {
    var $52 = note(new TypeMismatch2("Array"));
    return function($53) {
      return $52(toArray($53));
    };
  }();
  var decodeInt = /* @__PURE__ */ composeKleisliFlipped3(/* @__PURE__ */ function() {
    var $84 = note(new TypeMismatch2("Integer"));
    return function($85) {
      return $84(fromNumber($85));
    };
  }())(decodeNumber);
  var decodeArray = function(decoder) {
    return composeKleisliFlipped3(function() {
      var $89 = lmap2(Named.create("Array"));
      var $90 = traverseWithIndex2(function(i) {
        var $92 = lmap2(AtIndex.create(i));
        return function($93) {
          return $92(decoder($93));
        };
      });
      return function($91) {
        return $89($90($91));
      };
    }())(decodeJArray);
  };

  // output/Record/index.js
  var insert3 = function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function() {
      return function() {
        return function(l) {
          return function(a) {
            return function(r) {
              return unsafeSet(reflectSymbol2(l))(a)(r);
            };
          };
        };
      };
    };
  };

  // output/Data.Argonaut.Decode.Class/index.js
  var bind3 = /* @__PURE__ */ bind(bindEither);
  var lmap3 = /* @__PURE__ */ lmap(bifunctorEither);
  var map13 = /* @__PURE__ */ map(functorMaybe);
  var gDecodeJsonNil = {
    gDecodeJson: function(v) {
      return function(v1) {
        return new Right({});
      };
    }
  };
  var gDecodeJson = function(dict) {
    return dict.gDecodeJson;
  };
  var decodeRecord = function(dictGDecodeJson) {
    var gDecodeJson1 = gDecodeJson(dictGDecodeJson);
    return function() {
      return {
        decodeJson: function(json2) {
          var v = toObject(json2);
          if (v instanceof Just) {
            return gDecodeJson1(v.value0)($$Proxy.value);
          }
          ;
          if (v instanceof Nothing) {
            return new Left(new TypeMismatch2("Object"));
          }
          ;
          throw new Error("Failed pattern match at Data.Argonaut.Decode.Class (line 103, column 5 - line 105, column 46): " + [v.constructor.name]);
        }
      };
    };
  };
  var decodeJsonString = {
    decodeJson: decodeString
  };
  var decodeJsonNumber = {
    decodeJson: decodeNumber
  };
  var decodeJsonInt = {
    decodeJson: decodeInt
  };
  var decodeJsonField = function(dict) {
    return dict.decodeJsonField;
  };
  var gDecodeJsonCons = function(dictDecodeJsonField) {
    var decodeJsonField1 = decodeJsonField(dictDecodeJsonField);
    return function(dictGDecodeJson) {
      var gDecodeJson1 = gDecodeJson(dictGDecodeJson);
      return function(dictIsSymbol) {
        var reflectSymbol2 = reflectSymbol(dictIsSymbol);
        var insert4 = insert3(dictIsSymbol)()();
        return function() {
          return function() {
            return {
              gDecodeJson: function(object) {
                return function(v) {
                  var fieldName = reflectSymbol2($$Proxy.value);
                  var fieldValue = lookup(fieldName)(object);
                  var v1 = decodeJsonField1(fieldValue);
                  if (v1 instanceof Just) {
                    return bind3(lmap3(AtKey.create(fieldName))(v1.value0))(function(val) {
                      return bind3(gDecodeJson1(object)($$Proxy.value))(function(rest) {
                        return new Right(insert4($$Proxy.value)(val)(rest));
                      });
                    });
                  }
                  ;
                  if (v1 instanceof Nothing) {
                    return new Left(new AtKey(fieldName, MissingValue.value));
                  }
                  ;
                  throw new Error("Failed pattern match at Data.Argonaut.Decode.Class (line 127, column 5 - line 134, column 44): " + [v1.constructor.name]);
                };
              }
            };
          };
        };
      };
    };
  };
  var decodeJson = function(dict) {
    return dict.decodeJson;
  };
  var decodeJsonMaybe = function(dictDecodeJson) {
    return {
      decodeJson: decodeMaybe(decodeJson(dictDecodeJson))
    };
  };
  var decodeFieldMaybe = function(dictDecodeJson) {
    var decodeJson1 = decodeJson(decodeJsonMaybe(dictDecodeJson));
    return {
      decodeJsonField: function(v) {
        if (v instanceof Nothing) {
          return new Just(new Right(Nothing.value));
        }
        ;
        if (v instanceof Just) {
          return new Just(decodeJson1(v.value0));
        }
        ;
        throw new Error("Failed pattern match at Data.Argonaut.Decode.Class (line 139, column 1 - line 143, column 49): " + [v.constructor.name]);
      }
    };
  };
  var decodeFieldId = function(dictDecodeJson) {
    var decodeJson1 = decodeJson(dictDecodeJson);
    return {
      decodeJsonField: function(j) {
        return map13(decodeJson1)(j);
      }
    };
  };
  var decodeArray2 = function(dictDecodeJson) {
    return {
      decodeJson: decodeArray(decodeJson(dictDecodeJson))
    };
  };

  // output/HarborView.Maunaloa.MaunaloaError/index.js
  var liftEffect2 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var logShow3 = /* @__PURE__ */ logShow(showString);
  var AffjaxError = /* @__PURE__ */ function() {
    function AffjaxError2(value0) {
      this.value0 = value0;
    }
    ;
    AffjaxError2.create = function(value0) {
      return new AffjaxError2(value0);
    };
    return AffjaxError2;
  }();
  var JsonError = /* @__PURE__ */ function() {
    function JsonError2(value0) {
      this.value0 = value0;
    }
    ;
    JsonError2.create = function(value0) {
      return new JsonError2(value0);
    };
    return JsonError2;
  }();
  var handleErrorAff = function(v) {
    if (v instanceof AffjaxError) {
      return liftEffect2(logShow3("AffjaxError: " + v.value0));
    }
    ;
    if (v instanceof JsonError) {
      return liftEffect2(logShow3("JsonError: " + v.value0));
    }
    ;
    throw new Error("Failed pattern match at HarborView.Maunaloa.MaunaloaError (line 23, column 1 - line 23, column 44): " + [v.constructor.name]);
  };

  // output/Web.DOM.Element/foreign.js
  var getProp = function(name16) {
    return function(doctype) {
      return doctype[name16];
    };
  };
  var _namespaceURI = getProp("namespaceURI");
  var _prefix = getProp("prefix");
  var localName = getProp("localName");
  var tagName = getProp("tagName");

  // output/Web.DOM.ParentNode/foreign.js
  var getEffProp = function(name16) {
    return function(node) {
      return function() {
        return node[name16];
      };
    };
  };
  var children = getEffProp("children");
  var _firstElementChild = getEffProp("firstElementChild");
  var _lastElementChild = getEffProp("lastElementChild");
  var childElementCount = getEffProp("childElementCount");

  // output/Web.DOM.Element/index.js
  var toEventTarget = unsafeCoerce2;

  // output/Web.DOM.NonElementParentNode/foreign.js
  function _getElementById(id3) {
    return function(node) {
      return function() {
        return node.getElementById(id3);
      };
    };
  }

  // output/Web.DOM.NonElementParentNode/index.js
  var map14 = /* @__PURE__ */ map(functorEffect);
  var getElementById = function(eid) {
    var $2 = map14(toMaybe);
    var $3 = _getElementById(eid);
    return function($4) {
      return $2($3($4));
    };
  };

  // output/Web.Event.Event/foreign.js
  function preventDefault(e) {
    return function() {
      return e.preventDefault();
    };
  }
  function stopPropagation(e) {
    return function() {
      return e.stopPropagation();
    };
  }

  // output/Web.Event.EventTarget/foreign.js
  function eventListener(fn) {
    return function() {
      return function(event) {
        return fn(event)();
      };
    };
  }
  function addEventListener(type) {
    return function(listener) {
      return function(useCapture) {
        return function(target5) {
          return function() {
            return target5.addEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }
  function removeEventListener(type) {
    return function(listener) {
      return function(useCapture) {
        return function(target5) {
          return function() {
            return target5.removeEventListener(type, listener, useCapture);
          };
        };
      };
    };
  }

  // output/Web.HTML/foreign.js
  var windowImpl = function() {
    return window;
  };

  // output/Web.HTML.HTMLDocument/index.js
  var toNonElementParentNode = unsafeCoerce2;

  // output/Web.HTML.Window/foreign.js
  function document2(window2) {
    return function() {
      return window2.document;
    };
  }

  // output/HarborView.Maunaloa.LevelLine/index.js
  var pure6 = /* @__PURE__ */ pure(applicativeEffect);
  var gDecodeJsonCons2 = /* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldId(decodeJsonNumber));
  var applySecond3 = /* @__PURE__ */ applySecond(applyEffect);
  var traverse_2 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableArray);
  var showRecord3 = /* @__PURE__ */ showRecord()();
  var showRecordFieldsCons2 = /* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "lt";
    }
  });
  var showRecordFieldsCons1 = /* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "selected";
    }
  });
  var showRecordFieldsConsNil2 = /* @__PURE__ */ showRecordFieldsConsNil({
    reflectSymbol: function() {
      return "y";
    }
  })(showNumber);
  var show9 = /* @__PURE__ */ show(/* @__PURE__ */ showRecord3(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "color";
    }
  })(/* @__PURE__ */ showRecordFieldsCons2(/* @__PURE__ */ showRecordFieldsCons1(showRecordFieldsConsNil2)(showBoolean))(showInt))(showString)));
  var askIsSymbol = {
    reflectSymbol: function() {
      return "ask";
    }
  };
  var showRecordFieldsCons22 = /* @__PURE__ */ showRecordFieldsCons(askIsSymbol);
  var bidIsSymbol = {
    reflectSymbol: function() {
      return "bid";
    }
  };
  var showRecordFieldsCons3 = /* @__PURE__ */ showRecordFieldsCons(bidIsSymbol);
  var riscIsSymbol = {
    reflectSymbol: function() {
      return "risc";
    }
  };
  var showRecordFieldsCons4 = /* @__PURE__ */ showRecordFieldsCons(riscIsSymbol);
  var tickerIsSymbol = {
    reflectSymbol: function() {
      return "ticker";
    }
  };
  var showRecordFieldsCons5 = /* @__PURE__ */ showRecordFieldsCons(tickerIsSymbol)(showRecordFieldsConsNil2)(showOptionTicker);
  var show15 = /* @__PURE__ */ show(/* @__PURE__ */ showRecord3(/* @__PURE__ */ showRecordFieldsCons22(/* @__PURE__ */ showRecordFieldsCons3(/* @__PURE__ */ showRecordFieldsCons2(/* @__PURE__ */ showRecordFieldsCons4(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "riscPrice";
    }
  })(/* @__PURE__ */ showRecordFieldsCons1(showRecordFieldsCons5)(showBoolean))(showNumber))(showNumber))(showInt))(showNumber))(showNumber)));
  var show23 = /* @__PURE__ */ show(/* @__PURE__ */ showRecord3(/* @__PURE__ */ showRecordFieldsCons22(/* @__PURE__ */ showRecordFieldsCons({
    reflectSymbol: function() {
      return "breakEven";
    }
  })(/* @__PURE__ */ showRecordFieldsCons2(showRecordFieldsCons5)(showInt))(showNumber))(showNumber)));
  var riscStockPriceIsSymbol = {
    reflectSymbol: function() {
      return "riscStockPrice";
    }
  };
  var riscOptionPriceIsSymbol = {
    reflectSymbol: function() {
      return "riscOptionPrice";
    }
  };
  var beIsSymbol = {
    reflectSymbol: function() {
      return "be";
    }
  };
  var bind1 = /* @__PURE__ */ bind(bindMaybe);
  var bind22 = /* @__PURE__ */ bind(bindAff);
  var show33 = /* @__PURE__ */ show(showJsonDecodeError);
  var pure12 = /* @__PURE__ */ pure(applicativeAff);
  var applySecond1 = /* @__PURE__ */ applySecond(applyAff);
  var liftEffect3 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var logShow4 = /* @__PURE__ */ logShow(showString);
  var show43 = /* @__PURE__ */ show(showInt);
  var logShow1 = /* @__PURE__ */ logShow(/* @__PURE__ */ showArray(/* @__PURE__ */ showRecord3(/* @__PURE__ */ showRecordFieldsCons22(/* @__PURE__ */ showRecordFieldsCons(beIsSymbol)(/* @__PURE__ */ showRecordFieldsCons3(/* @__PURE__ */ showRecordFieldsCons4(/* @__PURE__ */ showRecordFieldsCons(riscOptionPriceIsSymbol)(/* @__PURE__ */ showRecordFieldsCons(riscStockPriceIsSymbol)(/* @__PURE__ */ showRecordFieldsConsNil(tickerIsSymbol)(showString))(showNumber))(showNumber))(showNumber))(showNumber))(showNumber))(showNumber))));
  var StdLine = /* @__PURE__ */ function() {
    function StdLine2(value0) {
      this.value0 = value0;
    }
    ;
    StdLine2.create = function(value0) {
      return new StdLine2(value0);
    };
    return StdLine2;
  }();
  var RiscLine = /* @__PURE__ */ function() {
    function RiscLine2(value0) {
      this.value0 = value0;
    }
    ;
    RiscLine2.create = function(value0) {
      return new RiscLine2(value0);
    };
    return RiscLine2;
  }();
  var BreakEvenLine = /* @__PURE__ */ function() {
    function BreakEvenLine2(value0) {
      this.value0 = value0;
    }
    ;
    BreakEvenLine2.create = function(value0) {
      return new BreakEvenLine2(value0);
    };
    return BreakEvenLine2;
  }();
  var validateMaybe = function(desc) {
    return function(el) {
      if (el instanceof Nothing) {
        return alert("ERROR!: " + desc);
      }
      ;
      if (el instanceof Just) {
        return pure6(unit);
      }
      ;
      throw new Error("Failed pattern match at HarborView.Maunaloa.LevelLine (line 443, column 3 - line 445, column 24): " + [el.constructor.name]);
    };
  };
  var updOptionPriceFromJson = /* @__PURE__ */ decodeJson(/* @__PURE__ */ decodeRecord(/* @__PURE__ */ gDecodeJsonCons2(gDecodeJsonNil)({
    reflectSymbol: function() {
      return "value";
    }
  })()())());
  var unlisten = function(v) {
    return removeEventListener(v.eventType)(v.listener)(false)(toEventTarget(v.target));
  };
  var unlistenEvents = function(ct) {
    var cti = chartTypeAsInt(ct);
    return function __do2() {
      var listeners = getListeners(cti)();
      return applySecond3(traverse_2(unlisten)(listeners))(resetListeners(cti))();
    };
  };
  var showLine = {
    show: function(v) {
      if (v instanceof StdLine) {
        return "StdLine: " + show9(v.value0);
      }
      ;
      if (v instanceof RiscLine) {
        return "RiscLine: " + show15(v.value0);
      }
      ;
      if (v instanceof BreakEvenLine) {
        return "BreakEvenLine: " + show23(v.value0);
      }
      ;
      throw new Error("Failed pattern match at HarborView.Maunaloa.LevelLine (line 132, column 1 - line 135, column 55): " + [v.constructor.name]);
    }
  };
  var logShow22 = /* @__PURE__ */ logShow(showLine);
  var riscLinesFromJson = /* @__PURE__ */ decodeJson(/* @__PURE__ */ decodeArray2(/* @__PURE__ */ decodeRecord(/* @__PURE__ */ gDecodeJsonCons2(/* @__PURE__ */ gDecodeJsonCons2(/* @__PURE__ */ gDecodeJsonCons2(/* @__PURE__ */ gDecodeJsonCons2(/* @__PURE__ */ gDecodeJsonCons2(/* @__PURE__ */ gDecodeJsonCons2(/* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldId(decodeJsonString))(gDecodeJsonNil)(tickerIsSymbol)()())(riscStockPriceIsSymbol)()())(riscOptionPriceIsSymbol)()())(riscIsSymbol)()())(bidIsSymbol)()())(beIsSymbol)()())(askIsSymbol)()())()));
  var optionPriceURL = function(v) {
    return function(curStockPrice) {
      return mainURL + ("/stockoption/price/" + (v + ("/" + toStringWith(fixed(2))(curStockPrice))));
    };
  };
  var onMouseUp = function(ct) {
    return function(v) {
      return onMouseUpImpl(chartTypeAsInt(ct))(Just.create)(Nothing.value);
    };
  };
  var ltSTD = 1;
  var ltRISC = 2;
  var ltBREAK_EVEN = 3;
  var initEvent = function(ct) {
    return function(toListener) {
      return function(element) {
        return function(eventType) {
          return function __do2() {
            var e1 = eventListener(toListener)();
            var info2 = {
              target: element,
              listener: e1,
              eventType
            };
            var cti = chartTypeAsInt(ct);
            return applySecond3(addListener(cti)(info2))(addEventListener(eventType)(e1)(false)(toEventTarget(element)))();
          };
        };
      };
    };
  };
  var getHtmlContext1 = function(prm) {
    return bind1(prm.canvas)(function(canvas1) {
      return bind1(prm.add)(function(addLlBtn1) {
        return bind1(prm.fetch)(function(fetchLlBtn1) {
          return bind1(prm.ctx)(function(ctx1) {
            return new Just({
              canvasContext: ctx1,
              canvasElement: canvas1,
              addLevelLineBtn: addLlBtn1,
              fetchLevelLinesBtn: fetchLlBtn1
            });
          });
        });
      });
    });
  };
  var getDoc = function __do() {
    var win = windowImpl();
    var doc = document2(win)();
    return toNonElementParentNode(doc);
  };
  var getHtmlContext = function(v) {
    return function __do2() {
      var doc = getDoc();
      var canvasElement = getElementById(v.levelCanvasId)(doc)();
      var addLevelId2 = getElementById(v.addLevelId)(doc)();
      var fetchLevelId2 = getElementById(v.fetchLevelId)(doc)();
      var canvas = getCanvasElementById(v.levelCanvasId)();
      return applySecond3(applySecond3(applySecond3(applySecond3(validateMaybe("canvasElement")(canvasElement))(validateMaybe("addLevelId2")(addLevelId2)))(validateMaybe("fetchLevelId2")(fetchLevelId2)))(validateMaybe("canvas")(canvas)))(pure6(getHtmlContext1({
        canvas: canvasElement,
        add: addLevelId2,
        fetch: fetchLevelId2,
        ctx: canvas
      })))();
    };
  };
  var fetchUpdatedOptionPrice = function(ticker) {
    return function(curStockPrice) {
      return bind22(get2(json)(optionPriceURL(ticker)(curStockPrice)))(function(res) {
        var result = function() {
          if (res instanceof Left) {
            return new Left(new AffjaxError(printError(res.value0)));
          }
          ;
          if (res instanceof Right) {
            var json2 = updOptionPriceFromJson(res.value0.body);
            if (json2 instanceof Left) {
              return new Left(new JsonError(show33(json2.value0)));
            }
            ;
            if (json2 instanceof Right) {
              return new Right(json2.value0.value);
            }
            ;
            throw new Error("Failed pattern match at HarborView.Maunaloa.LevelLine (line 372, column 13 - line 376, column 34): " + [json2.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at HarborView.Maunaloa.LevelLine (line 365, column 9 - line 376, column 34): " + [res.constructor.name]);
        }();
        return pure12(result);
      });
    };
  };
  var handleUpdateOptionPrice = function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof RiscLine) {
          return launchAff_(function() {
            var sp = pixToValue(v1)(v2.value0.y);
            var cti = chartTypeAsInt(v);
            return bind22(applySecond1(liftEffect3(logShow22(v2)))(fetchUpdatedOptionPrice(v2.value0.ticker)(sp)))(function(n) {
              if (n instanceof Left) {
                return handleErrorAff(n.value0);
              }
              ;
              if (n instanceof Right) {
                return liftEffect3(updateRiscLine(cti)(v2)(n.value0));
              }
              ;
              throw new Error("Failed pattern match at HarborView.Maunaloa.LevelLine (line 389, column 7 - line 393, column 55): " + [n.constructor.name]);
            });
          }());
        }
        ;
        return pure6(unit);
      };
    };
  };
  var handleMouseEventUpLine = function(ct) {
    return function(vr) {
      return function(line) {
        if (line instanceof Nothing) {
          return pure6(unit);
        }
        ;
        if (line instanceof Just) {
          return handleUpdateOptionPrice(ct)(vr)(line.value0);
        }
        ;
        throw new Error("Failed pattern match at HarborView.Maunaloa.LevelLine (line 399, column 3 - line 403, column 42): " + [line.constructor.name]);
      };
    };
  };
  var fetchLevelLinesURL = function(v) {
    return mainURL + ("/risclines/" + v);
  };
  var fetchLevelLines = function(ticker) {
    return bind22(get2(json)(fetchLevelLinesURL(ticker)))(function(res) {
      var result = function() {
        if (res instanceof Left) {
          return new Left(new AffjaxError(printError(res.value0)));
        }
        ;
        if (res instanceof Right) {
          var lines3 = riscLinesFromJson(res.value0.body);
          if (lines3 instanceof Left) {
            return new Left(new JsonError(show33(lines3.value0)));
          }
          ;
          if (lines3 instanceof Right) {
            return new Right(lines3.value0);
          }
          ;
          throw new Error("Failed pattern match at HarborView.Maunaloa.LevelLine (line 320, column 13 - line 324, column 29): " + [lines3.constructor.name]);
        }
        ;
        throw new Error("Failed pattern match at HarborView.Maunaloa.LevelLine (line 313, column 9 - line 324, column 29): " + [res.constructor.name]);
      }();
      return pure12(result);
    });
  };
  var defaultEventHandling = function(event) {
    return applySecond3(stopPropagation(event))(preventDefault(event));
  };
  var mouseEventDown = function(ct) {
    return function(evt) {
      return applySecond3(defaultEventHandling(evt))(onMouseDown(chartTypeAsInt(ct))(evt));
    };
  };
  var mouseEventDrag = function(ct) {
    return function(evt) {
      return applySecond3(defaultEventHandling(evt))(onMouseDrag(chartTypeAsInt(ct))(evt));
    };
  };
  var mouseEventUp = function(ct) {
    return function(vruler2) {
      return function(evt) {
        return function __do2() {
          var line = applySecond3(defaultEventHandling(evt))(onMouseUp(ct)(evt))();
          return handleMouseEventUpLine(ct)(vruler2)(line)();
        };
      };
    };
  };
  var clear2 = function(cti) {
    return clearCanvas(cti);
  };
  var addRiscLine = function(ct) {
    return function(vr) {
      return function(line) {
        var rl = new RiscLine({
          y: valueToPix(vr)(line.riscStockPrice),
          selected: false,
          ticker: line.ticker,
          ask: line.ask,
          bid: line.bid,
          risc: line.risc,
          riscPrice: line.riscOptionPrice,
          lt: ltRISC
        });
        var cti = chartTypeAsInt(ct);
        var bl = new BreakEvenLine({
          y: valueToPix(vr)(line.be),
          ticker: line.ticker,
          ask: line.ask,
          breakEven: line.be,
          lt: ltBREAK_EVEN
        });
        return applySecond3(addLine(cti)(rl))(addLine(cti)(bl));
      };
    };
  };
  var addRiscLines = function(ct) {
    return function(vr) {
      return function(lines3) {
        var addRiscLine1 = addRiscLine(ct)(vr);
        return traverse_2(addRiscLine1)(lines3);
      };
    };
  };
  var fetchLevelLineButtonClick = function(ct) {
    return function(ticker) {
      return function(vruler2) {
        return function(evt) {
          return applySecond3(defaultEventHandling(evt))(launchAff_(bind22(fetchLevelLines(ticker))(function(lines3) {
            if (lines3 instanceof Left) {
              return applySecond1(liftEffect3(logShow4("ERROR")))(handleErrorAff(lines3.value0));
            }
            ;
            if (lines3 instanceof Right) {
              return liftEffect3(applySecond3(applySecond3(applySecond3(logShow4("Number of lines: " + show43(length(lines3.value0))))(logShow1(lines3.value0)))(clearLines(chartTypeAsInt(ct))))(addRiscLines(ct)(vruler2)(lines3.value0)));
            }
            ;
            throw new Error("Failed pattern match at HarborView.Maunaloa.LevelLine (line 334, column 7 - line 345, column 12): " + [lines3.constructor.name]);
          })));
        };
      };
    };
  };
  var addLevelLineButtonClick = function(ct) {
    return function(v) {
      return function __do2() {
        var curColor = randomRgb();
        var line = new StdLine({
          y: 200,
          selected: false,
          lt: ltSTD,
          color: curColor
        });
        return addLine(chartTypeAsInt(ct))(line)();
      };
    };
  };
  var initEvents = function(ct) {
    return function(ticker) {
      return function(vruler2) {
        return function(chartLevel) {
          return function __do2() {
            var context = applySecond3(unlistenEvents(ct))(getHtmlContext(chartLevel))();
            if (context instanceof Nothing) {
              return applySecond3(alert("ERROR! (initEvents) No getHtmlContext chartLevel!"))(pure6(unit))();
            }
            ;
            if (context instanceof Just) {
              var ctx = getContext2D(context.value0.canvasContext)();
              return applySecond3(applySecond3(applySecond3(applySecond3(applySecond3(redraw(chartTypeAsInt(ct))(ctx)(vruler2))(initEvent(ct)(addLevelLineButtonClick(ct))(context.value0.addLevelLineBtn)("click")))(initEvent(ct)(fetchLevelLineButtonClick(ct)(ticker)(vruler2))(context.value0.fetchLevelLinesBtn)("click")))(initEvent(ct)(mouseEventDown(ct))(context.value0.canvasElement)("mousedown")))(initEvent(ct)(mouseEventDrag(ct))(context.value0.canvasElement)("mousemove")))(initEvent(ct)(mouseEventUp(ct)(vruler2))(context.value0.canvasElement)("mouseup"))();
            }
            ;
            throw new Error("Failed pattern match at HarborView.Maunaloa.LevelLine (line 483, column 5 - line 497, column 95): " + [context.constructor.name]);
          };
        };
      };
    };
  };

  // output/HarborView.Maunaloa.ChartCollection/index.js
  var showArray2 = /* @__PURE__ */ showArray(showChart);
  var applySecond4 = /* @__PURE__ */ applySecond(applyEffect);
  var logShow5 = /* @__PURE__ */ logShow(showArray2);
  var traverse_3 = /* @__PURE__ */ traverse_(applicativeEffect)(foldableArray);
  var notEq2 = /* @__PURE__ */ notEq(/* @__PURE__ */ eqMaybe(/* @__PURE__ */ eqRec()(/* @__PURE__ */ eqRowCons(/* @__PURE__ */ eqRowCons(/* @__PURE__ */ eqRowCons(eqRowNil)()({
    reflectSymbol: function() {
      return "levelCanvasId";
    }
  })(eqHtmlId))()({
    reflectSymbol: function() {
      return "fetchLevelId";
    }
  })(eqHtmlId))()({
    reflectSymbol: function() {
      return "addLevelId";
    }
  })(eqHtmlId))));
  var logShow12 = /* @__PURE__ */ logShow(showString);
  var pure7 = /* @__PURE__ */ pure(applicativeEffect);
  var fromJust4 = /* @__PURE__ */ fromJust();
  var liftEffect4 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var paintEmpty2 = function(v) {
    return applySecond4(logShow5(v))(traverse_3(paintEmpty)(v));
  };
  var mappingToChartLevel = function(v) {
    var $54 = length3(v.levelCanvasId) === 0;
    if ($54) {
      return Nothing.value;
    }
    ;
    return new Just({
      levelCanvasId: v.levelCanvasId,
      addLevelId: v.addLevelId,
      fetchLevelId: v.fetchLevelId
    });
  };
  var findChartPredicate = function(v) {
    if (v instanceof Chart) {
      return notEq2(v.value0.chartLevel)(Nothing.value);
    }
    ;
    if (v instanceof ChartWithoutTicker) {
      return true;
    }
    ;
    if (v instanceof EmptyChart) {
      return false;
    }
    ;
    throw new Error("Failed pattern match at HarborView.Maunaloa.ChartCollection (line 78, column 1 - line 78, column 39): " + [v.constructor.name]);
  };
  var levelLines = function(ct) {
    return function(ticker) {
      return function(charts) {
        var levelLine = find2(findChartPredicate)(charts);
        if (levelLine instanceof Nothing) {
          return applySecond4(logShow12("ERROR! (levelLines) No levelLine!"))(pure7(unit));
        }
        ;
        if (levelLine instanceof Just && levelLine.value0 instanceof Chart) {
          var caid = fromJust4(levelLine.value0.value0.chartLevel);
          return initEvents(ct)(ticker)(levelLine.value0.value0.vruler)(caid);
        }
        ;
        return pure7(unit);
      };
    };
  };
  var paint6 = function(ct) {
    return function(v) {
      var paint_ = paint5(v.hruler);
      return applySecond4(traverse_3(paint_)(v.charts))(levelLines(ct)(v.ticker)(v.charts));
    };
  };
  var paintAff = function(ct) {
    return function(coll) {
      return liftEffect4(paint6(ct)(coll));
    };
  };

  // output/HarborView.Maunaloa.ChartTransform/index.js
  var map15 = /* @__PURE__ */ map(functorArray);
  var bind4 = /* @__PURE__ */ bind(/* @__PURE__ */ bindReaderT(bindIdentity));
  var ask2 = /* @__PURE__ */ ask(/* @__PURE__ */ monadAskReaderT(monadIdentity));
  var pure8 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeReaderT(applicativeIdentity));
  var notEq3 = /* @__PURE__ */ notEq(/* @__PURE__ */ eqMaybe(eqValueRange));
  var bind12 = /* @__PURE__ */ bind(bindMaybe);
  var minimumBy2 = /* @__PURE__ */ minimumBy(foldableArray);
  var maximumBy2 = /* @__PURE__ */ maximumBy(foldableArray);
  var minimum2 = /* @__PURE__ */ minimum(ordNumber)(foldableArray);
  var maximum2 = /* @__PURE__ */ maximum(ordNumber)(foldableArray);
  var max6 = /* @__PURE__ */ max(ordNumber);
  var abs3 = /* @__PURE__ */ abs(ordNumber)(ringNumber);
  var fromJust5 = /* @__PURE__ */ fromJust();
  var transformMappingEmpty = function(chartWidth) {
    return function(v) {
      return new ChartWithoutTicker({
        canvasId: v.canvasId,
        w: chartWidth,
        h: v.chartHeight
      });
    };
  };
  var transformMapping1 = function(chartWidth) {
    return function(v) {
      return function(ec) {
        var vr = vruler(ec.valueRange)(chartWidth)(v.chartHeight);
        var linesToPix = map15(lineToPix(vr))(ec.lines);
        var cndlToPix = map15(candleToPix(vr))(ec.candlesticks);
        var clevel = mappingToChartLevel(v);
        return new Chart({
          lines: linesToPix,
          candlesticks: cndlToPix,
          canvasId: v.canvasId,
          vruler: vr,
          w: chartWidth,
          h: v.chartHeight,
          chartLevel: clevel
        });
      };
    };
  };
  var transformEmpty = /* @__PURE__ */ bind4(ask2)(function(v) {
    var charts = map15(transformMappingEmpty(v.globalChartWidth))(v.mappings);
    return pure8(charts);
  });
  var slice3 = function(v) {
    return function(v1) {
      return function(vals) {
        var $51 = v === 0;
        if ($51) {
          return take(v1)(vals);
        }
        ;
        return take(v1)(drop(v)(vals));
      };
    };
  };
  var nullValueRange = {
    minVal: 0,
    maxVal: 0
  };
  var minMaxRanges = function(v) {
    return function(vals) {
      var mmas = map15(function(y) {
        return fromMaybe(nullValueRange)(y);
      })(filter(function(x) {
        return notEq3(x)(Nothing.value);
      })(vals));
      var result = fromMaybe(nullValueRange)(bind12(minimumBy2(function(v1) {
        return function(v2) {
          var $56 = v1.minVal < v2.minVal;
          if ($56) {
            return LT.value;
          }
          ;
          return GT.value;
        };
      })(mmas))(function(mib) {
        return bind12(maximumBy2(function(v1) {
          return function(v2) {
            var $59 = v1.maxVal > v2.maxVal;
            if ($59) {
              return GT.value;
            }
            ;
            return LT.value;
          };
        })(mmas))(function(mab) {
          return new Just({
            minVal: mib.minVal / v,
            maxVal: mab.maxVal * v
          });
        });
      }));
      return result;
    };
  };
  var minMaxCndl = function(cndl) {
    return bind12(minimumBy2(function(x) {
      return function(y) {
        var $62 = x.l < y.l;
        if ($62) {
          return LT.value;
        }
        ;
        return GT.value;
      };
    })(cndl))(function(mib) {
      return bind12(maximumBy2(function(x) {
        return function(y) {
          var $63 = x.h > y.h;
          if ($63) {
            return GT.value;
          }
          ;
          return LT.value;
        };
      })(cndl))(function(mab) {
        return new Just({
          minVal: mib.l,
          maxVal: mab.h
        });
      });
    });
  };
  var minMaxArray = function(ar) {
    return bind12(minimum2(ar))(function(mib) {
      return bind12(maximum2(ar))(function(mab) {
        return new Just({
          minVal: mib,
          maxVal: mab
        });
      });
    });
  };
  var normalizeLine = function(line) {
    var v = fromMaybe(valueRange(-1)(1))(minMaxArray(line));
    var scalingFactor = max6(abs3(v.minVal))(v.maxVal);
    var scalingFn = function(x) {
      return x / scalingFactor;
    };
    return map15(scalingFn)(line);
  };
  var incMonths2 = function(v) {
    if (v instanceof DayChart) {
      return 1;
    }
    ;
    if (v instanceof WeekChart) {
      return 3;
    }
    ;
    if (v instanceof MonthChart) {
      return 6;
    }
    ;
    throw new Error("Failed pattern match at HarborView.Maunaloa.ChartTransform (line 253, column 1 - line 253, column 30): " + [v.constructor.name]);
  };
  var chartValueRange = function(lx) {
    return function(bars) {
      return function(cx) {
        return function(scaling) {
          var minMaxLines = map15(minMaxArray)(lx);
          var minMaxCandlesticks = minMaxCndl(cx);
          var minMaxBars = map15(minMaxArray)(bars);
          var allVr = cons(minMaxCandlesticks)(concat([minMaxLines, minMaxBars]));
          return minMaxRanges(scaling)(allVr);
        };
      };
    };
  };
  var chartWindow = function(dropAmt) {
    return function(takeAmt) {
      return function(c) {
        return function(scaling) {
          return function(doNormalizeLines) {
            return function(numVlines) {
              var lines_2 = function() {
                var tmp = map15(slice3(dropAmt)(takeAmt))(fromMaybe([])(c.lines));
                var $66 = doNormalizeLines === true;
                if ($66) {
                  return map15(normalizeLine)(tmp);
                }
                ;
                return tmp;
              }();
              var cndl_ = slice3(dropAmt)(takeAmt)(fromMaybe([])(c.candlesticks));
              var bars_ = map15(slice3(dropAmt)(takeAmt))(fromMaybe([])(c.bars));
              var valueRange2 = chartValueRange(lines_2)(bars_)(cndl_)(scaling);
              return {
                lines: lines_2,
                bars: bars_,
                candlesticks: cndl_,
                valueRange: valueRange2,
                numVlines
              };
            };
          };
        };
      };
    };
  };
  var transformMapping = function(env) {
    return function(response) {
      return function(v) {
        if (v.chartId === "chart") {
          var cw = chartWindow(env.dropAmt)(env.takeAmt)(response.chart)(env.scaling)(false)(10);
          return transformMapping1(env.globalChartWidth)(v)(cw);
        }
        ;
        if (v.chartId === "chart2") {
          var cw = chartWindow(env.dropAmt)(env.takeAmt)(response.chart2)(1)(true)(10);
          return transformMapping1(env.globalChartWidth)(v)(cw);
        }
        ;
        if (v.chartId === "chart3") {
          var cw = chartWindow(env.dropAmt)(env.takeAmt)(response.chart3)(1)(false)(10);
          return transformMapping1(env.globalChartWidth)(v)(cw);
        }
        ;
        return EmptyChart.value;
      };
    };
  };
  var transform2 = function(response) {
    return bind4(ask2)(function(v) {
      var xaxis = slice3(v.dropAmt)(v.takeAmt)(response.xAxis);
      var ruler = create2(v.globalChartWidth)(response.minDx)(xaxis)(padding)(incMonths2(v.chartType));
      var ruler1 = fromJust5(ruler);
      var charts1 = map15(transformMapping(v)(response))(v.mappings);
      return pure8({
        ticker: response.ticker,
        charts: charts1,
        hruler: ruler1
      });
    });
  };

  // output/HarborView.Maunaloa.JsonCharts/index.js
  var gDecodeJsonCons3 = /* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldMaybe(/* @__PURE__ */ decodeArray2(/* @__PURE__ */ decodeArray2(decodeJsonNumber))));
  var gDecodeJsonCons1 = /* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldId(decodeJsonNumber));
  var gDecodeJsonCons22 = /* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldId(/* @__PURE__ */ decodeRecord(/* @__PURE__ */ gDecodeJsonCons3(/* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldMaybe(/* @__PURE__ */ decodeArray2(/* @__PURE__ */ decodeRecord(/* @__PURE__ */ gDecodeJsonCons1(/* @__PURE__ */ gDecodeJsonCons1(/* @__PURE__ */ gDecodeJsonCons1(/* @__PURE__ */ gDecodeJsonCons1(gDecodeJsonNil)({
    reflectSymbol: function() {
      return "o";
    }
  })()())({
    reflectSymbol: function() {
      return "l";
    }
  })()())({
    reflectSymbol: function() {
      return "h";
    }
  })()())({
    reflectSymbol: function() {
      return "c";
    }
  })()())())))(/* @__PURE__ */ gDecodeJsonCons3(gDecodeJsonNil)({
    reflectSymbol: function() {
      return "lines";
    }
  })()())({
    reflectSymbol: function() {
      return "candlesticks";
    }
  })()())({
    reflectSymbol: function() {
      return "bars";
    }
  })()())()));
  var bind5 = /* @__PURE__ */ bind(bindAff);
  var show10 = /* @__PURE__ */ show(showJsonDecodeError);
  var pure9 = /* @__PURE__ */ pure(applicativeAff);
  var chartsFromJson = /* @__PURE__ */ decodeJson(/* @__PURE__ */ decodeRecord(/* @__PURE__ */ gDecodeJsonCons22(/* @__PURE__ */ gDecodeJsonCons22(/* @__PURE__ */ gDecodeJsonCons22(/* @__PURE__ */ gDecodeJsonCons1(/* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldId(decodeJsonString))(/* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldId(/* @__PURE__ */ decodeArray2(decodeJsonInt)))(gDecodeJsonNil)({
    reflectSymbol: function() {
      return "xAxis";
    }
  })()())({
    reflectSymbol: function() {
      return "ticker";
    }
  })()())({
    reflectSymbol: function() {
      return "minDx";
    }
  })()())({
    reflectSymbol: function() {
      return "chart3";
    }
  })()())({
    reflectSymbol: function() {
      return "chart2";
    }
  })()())({
    reflectSymbol: function() {
      return "chart";
    }
  })()())());
  var chartUrl = function(v) {
    return function(v1) {
      if (v instanceof DayChart) {
        return "/maunaloa/stockprice/days/" + v1;
      }
      ;
      if (v instanceof WeekChart) {
        return "/maunaloa/stockprice/weeks/" + v1;
      }
      ;
      if (v instanceof MonthChart) {
        return "/maunaloa/stockprice/months/" + v1;
      }
      ;
      throw new Error("Failed pattern match at HarborView.Maunaloa.JsonCharts (line 82, column 1 - line 82, column 44): " + [v.constructor.name, v1.constructor.name]);
    };
  };
  var fetchCharts = function(ticker) {
    return function(chartType) {
      return bind5(get2(json)(chartUrl(chartType)(ticker)))(function(res) {
        var result = function() {
          if (res instanceof Left) {
            return new Left(new AffjaxError(printError(res.value0)));
          }
          ;
          if (res instanceof Right) {
            var charts = chartsFromJson(res.value0.body);
            if (charts instanceof Left) {
              return new Left(new JsonError(show10(charts.value0)));
            }
            ;
            if (charts instanceof Right) {
              return new Right(charts.value0);
            }
            ;
            throw new Error("Failed pattern match at HarborView.Maunaloa.JsonCharts (line 103, column 25 - line 107, column 46): " + [charts.constructor.name]);
          }
          ;
          throw new Error("Failed pattern match at HarborView.Maunaloa.JsonCharts (line 96, column 17 - line 107, column 46): " + [res.constructor.name]);
        }();
        return pure9(result);
      });
    };
  };

  // output/HarborView.Maunaloa.Repository/foreign.js
  var _charts = {};
  var setJsonResponse = (key) => (charts) => () => {
    _charts[key] = charts;
  };
  var getJsonResponseImpl = (just) => (nothing) => (key) => {
    if (key in _charts) {
      return just(_charts[key]);
    } else {
      return nothing;
    }
  };
  var resetCharts = () => {
    _charts = {};
  };

  // output/HarborView.Maunaloa.Repository/index.js
  var getJsonResponse = function(key) {
    return getJsonResponseImpl(Just.create)(Nothing.value)(key);
  };

  // output/Main/index.js
  var applySecond5 = /* @__PURE__ */ applySecond(applyEffect);
  var logShow6 = /* @__PURE__ */ logShow(showString);
  var logShow13 = /* @__PURE__ */ logShow(/* @__PURE__ */ showArray(showChart));
  var bind6 = /* @__PURE__ */ bind(bindAff);
  var applySecond12 = /* @__PURE__ */ applySecond(applyAff);
  var liftEffect5 = /* @__PURE__ */ liftEffect(monadEffectAff);
  var resetCharts2 = resetCharts;
  var reposIdFor = function(chartTypeId) {
    return function(ticker) {
      return ticker + (":" + toString(toNumber(chartTypeId)));
    };
  };
  var createEnvEmpty = function(mappings) {
    return {
      ticker: "-",
      dropAmt: 0,
      takeAmt: 0,
      chartType: asChartType(1),
      mappings,
      globalChartWidth: 1750,
      scaling: 1
    };
  };
  var paintEmpty3 = function(mappings) {
    var curEnv = createEnvEmpty(mappings);
    var collection = runReader(transformEmpty)(curEnv);
    return applySecond5(applySecond5(logShow6("__paintEmpty__"))(logShow13(collection)))(paintEmpty2(collection));
  };
  var createEnv = function(ctype) {
    return function(tik) {
      return function(curDrop) {
        return function(curTake) {
          return function(mappings) {
            return {
              ticker: tik,
              dropAmt: curDrop,
              takeAmt: curTake,
              chartType: ctype,
              mappings,
              globalChartWidth: 1750,
              scaling: 1.1
            };
          };
        };
      };
    };
  };
  var paint7 = function(chartTypeId) {
    return function(mappings) {
      return function(ticker) {
        return function(dropAmt) {
          return function(takeAmt) {
            var reposId = reposIdFor(chartTypeId)(ticker);
            var curChartType = asChartType(chartTypeId);
            var curEnv = createEnv(curChartType)(ticker)(dropAmt)(takeAmt)(mappings);
            var cachedResponse = getJsonResponse(reposId);
            return applySecond5(logShow6("StockTicker: " + ticker))(function() {
              if (cachedResponse instanceof Just) {
                var collection = runReader(transform2(cachedResponse.value0))(curEnv);
                return applySecond5(logShow6("Fetched response from repository"))(paint6(curChartType)(collection));
              }
              ;
              if (cachedResponse instanceof Nothing) {
                return launchAff_(bind6(fetchCharts(ticker)(curChartType))(function(charts) {
                  if (charts instanceof Left) {
                    return handleErrorAff(charts.value0);
                  }
                  ;
                  if (charts instanceof Right) {
                    var collection2 = runReader(transform2(charts.value0))(curEnv);
                    return applySecond12(liftEffect5(setJsonResponse(reposId)(charts.value0)))(paintAff(curChartType)(collection2));
                  }
                  ;
                  throw new Error("Failed pattern match at Main (line 102, column 21 - line 110, column 77): " + [charts.constructor.name]);
                }));
              }
              ;
              throw new Error("Failed pattern match at Main (line 92, column 5 - line 110, column 77): " + [cachedResponse.constructor.name]);
            }());
          };
        };
      };
    };
  };
  var clearLevelLines = function(cti) {
    return applySecond5(logShow6("clearLevelLines"))(clear2(cti));
  };
  var main = /* @__PURE__ */ applySecond5(/* @__PURE__ */ applySecond5(/* @__PURE__ */ applySecond5(/* @__PURE__ */ paint7(4)([])("-")(0)(0))(/* @__PURE__ */ paintEmpty3([])))(/* @__PURE__ */ clearLevelLines(1)))(resetCharts2);

  // <stdin>
  return {
           paint: paint7,
           paintEmpty: paintEmpty3,
           resetCharts: resetCharts2,
           clearLevelLines:  clearLevelLines }
})();
