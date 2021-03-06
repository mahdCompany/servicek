/*! pace 0.5.1 */
(function() {
  var a0, aZ, aY, aX, aW, aV, aU, aT, aS, aR, aQ, aP, aO, aN, aM, aL, aK, aJ, aI, aH, aG, aF, aE, aD, aC, aB, aA, az, ay, ax, aw, av, au, at, ar, aq, ap, ao, an, am, al, ak, aj, ai, ah, ag, af, ae, ad = [].slice,
    ac = {}.hasOwnProperty,
    ab = function(f, e) {
      function h() {
        this.constructor = f
      }
      for (var g in e) {
        ac.call(e, g) && (f[g] = e[g])
      }
      return h.prototype = e.prototype, f.prototype = new h, f.__super__ = e.prototype, f
    },
    aa = [].indexOf || function(e) {
      for (var d = 0, f = this.length; f > d; d++) {
        if (d in this && this[d] === e) {
          return d
        }
      }
      return -1
    };
  for (aH = {
      catchupTime: 500,
      initialRate: 0.03,
      minTime: 500,
      ghostTime: 500,
      maxProgressPerFrame: 10,
      easeFactor: 1.25,
      startOnPageLoad: !0,
      restartOnPushState: !0,
      restartOnRequestAfter: 500,
      target: ".pace-container",
      elements: {
        checkInterval: 100,
        selectors: [".pace-container"]
      },
      eventLag: {
        minSamples: 10,
        sampleCount: 3,
        lagThreshold: 3
      },
      ajax: {
        trackMethods: ["GET"],
        trackWebSockets: !0,
        ignoreURLs: []
      }
    }, az = function() {
      var b;
      return null != (b = "undefined" != typeof performance && null !== performance ? "function" == typeof performance.now ? performance.now() : void 0 : void 0) ? b : +new Date
    }, ax = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame, aI = window.cancelAnimationFrame || window.mozCancelAnimationFrame, null == ax && (ax = function(b) {
      return setTimeout(b, 50)
    }, aI = function(b) {
      return clearTimeout(b)
    }), av = function(e) {
      var d, f;
      return d = az(), (f = function() {
        var a;
        return a = az() - d, a >= 33 ? (d = az(), e(a, function() {
          return ax(f)
        })) : setTimeout(f, 33 - a)
      })()
    }, aw = function() {
      var e, d, f;
      return f = arguments[0], d = arguments[1], e = 3 <= arguments.length ? ad.call(arguments, 2) : [], "function" == typeof f[d] ? f[d].apply(f, e) : f[d]
    }, aG = function() {
      var i, h, n, m, l, k, j;
      for (h = arguments[0], m = 2 <= arguments.length ? ad.call(arguments, 1) : [], k = 0, j = m.length; j > k; k++) {
        if (n = m[k]) {
          for (i in n) {
            ac.call(n, i) && (l = n[i], null != h[i] && "object" == typeof h[i] && null != l && "object" == typeof l ? aG(h[i], l) : h[i] = l)
          }
        }
      }
      return h
    }, aL = function(h) {
      var g, l, k, j, i;
      for (l = g = 0, j = 0, i = h.length; i > j; j++) {
        k = h[j], l += Math.abs(k), g++
      }
      return l / g
    }, aE = function(h, g) {
      var l, k, j;
      if (null == h && (h = "options"), null == g && (g = !0), j = document.querySelector("[data-pace-" + h + "]")) {
        if (l = j.getAttribute("data-pace-" + h), !g) {
          return l
        }
        try {
          return JSON.parse(l)
        } catch (i) {
          return k = i, "undefined" != typeof console && null !== console ? console.error("Error parsing inline pace options", k) : void 0
        }
      }
    }, aU = function() {
      function b() {}
      return b.prototype.on = function(g, f, j, i) {
        var h;
        return null == i && (i = !1), null == this.bindings && (this.bindings = {}), null == (h = this.bindings)[g] && (h[g] = []), this.bindings[g].push({
          handler: f,
          ctx: j,
          once: i
        })
      }, b.prototype.once = function(e, d, f) {
        return this.on(e, d, f, !0)
      }, b.prototype.off = function(g, f) {
        var j, i, h;
        if (null != (null != (i = this.bindings) ? i[g] : void 0)) {
          if (null == f) {
            return delete this.bindings[g]
          }
          for (j = 0, h = []; j < this.bindings[g].length;) {
            this.bindings[g][j].handler === f ? h.push(this.bindings[g].splice(j, 1)) : h.push(j++)
          }
          return h
        }
      }, b.prototype.trigger = function() {
        var r, q, p, o, n, m, l, k, j;
        if (p = arguments[0], r = 2 <= arguments.length ? ad.call(arguments, 1) : [], null != (l = this.bindings) ? l[p] : void 0) {
          for (n = 0, j = []; n < this.bindings[p].length;) {
            k = this.bindings[p][n], o = k.handler, q = k.ctx, m = k.once, o.apply(null != q ? q : this, r), m ? j.push(this.bindings[p].splice(n, 1)) : j.push(n++)
          }
          return j
        }
      }, b
    }(), null == window.Pace && (window.Pace = {}), aG(Pace, aU.prototype), ay = Pace.options = aG({}, aH, window.paceOptions, aE()), ag = ["ajax", "document", "eventLag", "elements"], ak = 0, ai = ag.length; ai > ak; ak++) {
    aq = ag[ak], ay[aq] === !0 && (ay[aq] = aH[aq])
  }
  aS = function(d) {
    function c() {
      return af = c.__super__.constructor.apply(this, arguments)
    }
    return ab(c, d), c
  }(Error), aZ = function() {
    function b() {
      this.progress = 0
    }
    return b.prototype.getElement = function() {
      var c;
      if (null == this.el) {
        if (c = document.querySelector(ay.target), !c) {
          throw new aS
        }
        this.el = document.createElement("div"), this.el.className = "pace pace-active", document.body.className = document.body.className.replace(/pace-done/g, ""), document.body.className += " pace-running", this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>', null != c.firstChild ? c.insertBefore(this.el, c.firstChild) : c.appendChild(this.el)
      }
      return this.el
    }, b.prototype.finish = function() {
      var c;
      return c = this.getElement(), c.className = c.className.replace("pace-active", ""), c.className += " pace-inactive", document.body.className = document.body.className.replace("pace-running", ""), document.body.className += " pace-done"
    }, b.prototype.update = function(c) {
      return this.progress = c, this.render()
    }, b.prototype.destroy = function() {
      try {
        this.getElement().parentNode.removeChild(this.getElement())
      } catch (c) {
        aS = c
      }
      return this.el = void 0
    }, b.prototype.render = function() {
      var d, c;
      return null == document.querySelector(ay.target) ? !1 : (d = this.getElement(), d.children[0].style.width = "" + this.progress + "%", (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) && (d.children[0].setAttribute("data-progress-text", "" + (0 | this.progress) + "%"), this.progress >= 100 ? c = "99" : (c = this.progress < 10 ? "0" : "", c += 0 | this.progress), d.children[0].setAttribute("data-progress", "" + c)), this.lastRenderedProgress = this.progress)
    }, b.prototype.done = function() {
      return this.progress >= 100
    }, b
  }(), aT = function() {
    function b() {
      this.bindings = {}
    }
    return b.prototype.trigger = function(i, h) {
      var n, m, l, k, j;
      if (null != this.bindings[i]) {
        for (k = this.bindings[i], j = [], m = 0, l = k.length; l > m; m++) {
          n = k[m], j.push(n.call(this, h))
        }
        return j
      }
    }, b.prototype.on = function(e, d) {
      var f;
      return null == (f = this.bindings)[e] && (f[e] = []), this.bindings[e].push(d)
    }, b
  }(), al = window.XMLHttpRequest, am = window.XDomainRequest, an = window.WebSocket, aF = function(i, h) {
    var n, m, l, k;
    k = [];
    for (m in h.prototype) {
      try {
        l = h.prototype[m], null == i[m] && "function" != typeof l ? k.push(i[m] = l) : k.push(void 0)
      } catch (j) {
        n = j
      }
    }
    return k
  }, aB = [], Pace.ignore = function() {
    var e, d, f;
    return d = arguments[0], e = 2 <= arguments.length ? ad.call(arguments, 1) : [], aB.unshift("ignore"), f = d.apply(null, e), aB.shift(), f
  }, Pace.track = function() {
    var e, d, f;
    return d = arguments[0], e = 2 <= arguments.length ? ad.call(arguments, 1) : [], aB.unshift("track"), f = d.apply(null, e), aB.shift(), f
  }, ar = function(d) {
    var c;
    if (null == d && (d = "GET"), "track" === aB[0]) {
      return "force"
    }
    if (!aB.length && ay.ajax) {
      if ("socket" === d && ay.ajax.trackWebSockets) {
        return !0
      }
      if (c = d.toUpperCase(), aa.call(ay.ajax.trackMethods, c) >= 0) {
        return !0
      }
    }
    return !1
  }, aR = function(d) {
    function c() {
      var b, e = this;
      c.__super__.constructor.apply(this, arguments), b = function(g) {
        var f;
        return f = g.open, g.open = function(h, a) {
          return ar(h) && e.trigger("request", {
            type: h,
            url: a,
            request: g
          }), f.apply(g, arguments)
        }
      }, window.XMLHttpRequest = function(a) {
        var f;
        return f = new al(a), b(f), f
      }, aF(window.XMLHttpRequest, al), null != am && (window.XDomainRequest = function() {
        var a;
        return a = new am, b(a), a
      }, aF(window.XDomainRequest, am)), null != an && ay.ajax.trackWebSockets && (window.WebSocket = function(g, f) {
        var h;
        return h = null != f ? new an(g, f) : new an(g), ar("socket") && e.trigger("request", {
          type: "socket",
          url: g,
          protocols: f,
          request: h
        }), h
      }, aF(window.WebSocket, an))
    }
    return ab(c, d), c
  }(aT), aj = null, aD = function() {
    return null == aj && (aj = new aR), aj
  }, at = function(g) {
    var f, j, i, h;
    for (h = ay.ajax.ignoreURLs, j = 0, i = h.length; i > j; j++) {
      if (f = h[j], "string" == typeof f) {
        if (-1 !== g.indexOf(f)) {
          return !0
        }
      } else {
        if (f.test(g)) {
          return !0
        }
      }
    }
    return !1
  }, aD().on("request", function(a) {
    var l, k, j, i, h;
    return i = a.type, j = a.request, h = a.url, at(h) ? void 0 : Pace.running || ay.restartOnRequestAfter === !1 && "force" !== ar(i) ? void 0 : (k = arguments, l = ay.restartOnRequestAfter || 0, "boolean" == typeof l && (l = 0), setTimeout(function() {
      var d, o, n, m, f, e;
      if (d = "socket" === i ? j.readyState < 2 : 0 < (m = j.readyState) && 4 > m) {
        for (Pace.restart(), f = Pace.sources, e = [], o = 0, n = f.length; n > o; o++) {
          if (aq = f[o], aq instanceof a0) {
            aq.watch.apply(aq, k);
            break
          }
          e.push(void 0)
        }
        return e
      }
    }, l))
  }), a0 = function() {
    function b() {
      var c = this;
      this.elements = [], aD().on("request", function() {
        return c.watch.apply(c, arguments)
      })
    }
    return b.prototype.watch = function(g) {
      var f, j, i, h;
      return i = g.type, f = g.request, h = g.url, at(h) ? void 0 : (j = "socket" === i ? new aO(f) : new aN(f), this.elements.push(j))
    }, b
  }(), aN = function() {
    function b(j) {
      var i, p, o, n, m, l, k = this;
      if (this.progress = 0, null != window.ProgressEvent) {
        for (p = null, j.addEventListener("progress", function(c) {
            return k.progress = c.lengthComputable ? 100 * c.loaded / c.total : k.progress + (100 - k.progress) / 2
          }), l = ["load", "abort", "timeout", "error"], o = 0, n = l.length; n > o; o++) {
          i = l[o], j.addEventListener(i, function() {
            return k.progress = 100
          })
        }
      } else {
        m = j.onreadystatechange, j.onreadystatechange = function() {
          var a;
          return 0 === (a = j.readyState) || 4 === a ? k.progress = 100 : 3 === j.readyState && (k.progress = 50), "function" == typeof m ? m.apply(null, arguments) : void 0
        }
      }
    }
    return b
  }(), aO = function() {
    function b(h) {
      var g, l, k, j, i = this;
      for (this.progress = 0, j = ["error", "open"], l = 0, k = j.length; k > l; l++) {
        g = j[l], h.addEventListener(g, function() {
          return i.progress = 100
        })
      }
    }
    return b
  }(), aX = function() {
    function b(g) {
      var e, j, i, h;
      for (null == g && (g = {}), this.elements = [], null == g.selectors && (g.selectors = []), h = g.selectors, j = 0, i = h.length; i > j; j++) {
        e = h[j], this.elements.push(new aW(e))
      }
    }
    return b
  }(), aW = function() {
    function b(c) {
      this.selector = c, this.progress = 0, this.check()
    }
    return b.prototype.check = function() {
      var c = this;
      return document.querySelector(this.selector) ? this.done() : setTimeout(function() {
        return c.check()
      }, ay.elements.checkInterval)
    }, b.prototype.done = function() {
      return this.progress = 100
    }, b
  }(), aY = function() {
    function b() {
      var e, d, f = this;
      this.progress = null != (d = this.states[document.readyState]) ? d : 100, e = document.onreadystatechange, document.onreadystatechange = function() {
        return null != f.states[document.readyState] && (f.progress = f.states[document.readyState]), "function" == typeof e ? e.apply(null, arguments) : void 0
      }
    }
    return b.prototype.states = {
      loading: 0,
      interactive: 50,
      complete: 100
    }, b
  }(), aV = function() {
    function b() {
      var h, g, l, k, j, i = this;
      this.progress = 0, h = 0, j = [], k = 0, l = az(), g = setInterval(function() {
        var a;
        return a = az() - l - 50, l = az(), j.push(a), j.length > ay.eventLag.sampleCount && j.shift(), h = aL(j), ++k >= ay.eventLag.minSamples && h < ay.eventLag.lagThreshold ? (i.progress = 100, clearInterval(g)) : i.progress = 100 * (3 / (h + 3))
      }, 50)
    }
    return b
  }(), aP = function() {
    function b(c) {
      this.source = c, this.last = this.sinceLastUpdate = 0, this.rate = ay.initialRate, this.catchup = 0, this.progress = this.lastProgress = 0, null != this.source && (this.progress = aw(this.source, "progress"))
    }
    return b.prototype.tick = function(e, d) {
      var f;
      return null == d && (d = aw(this.source, "progress")), d >= 100 && (this.done = !0), d === this.last ? this.sinceLastUpdate += e : (this.sinceLastUpdate && (this.rate = (d - this.last) / this.sinceLastUpdate), this.catchup = (d - this.progress) / ay.catchupTime, this.sinceLastUpdate = 0, this.last = d), d > this.progress && (this.progress += this.catchup * e), f = 1 - Math.pow(this.progress / 100, ay.easeFactor), this.progress += f * this.rate * e, this.progress = Math.min(this.lastProgress + ay.maxProgressPerFrame, this.progress), this.progress = Math.max(0, this.progress), this.progress = Math.min(100, this.progress), this.lastProgress = this.progress, this.progress
    }, b
  }(), ap = null, au = null, aK = null, ao = null, aM = null, aJ = null, Pace.running = !1, aC = function() {
    return ay.restartOnPushState ? Pace.restart() : void 0
  }, null != window.history.pushState && (ah = window.history.pushState, window.history.pushState = function() {
    return aC(), ah.apply(window.history, arguments)
  }), null != window.history.replaceState && (ae = window.history.replaceState, window.history.replaceState = function() {
    return aC(), ae.apply(window.history, arguments)
  }), aQ = {
    ajax: a0,
    elements: aX,
    document: aY,
    eventLag: aV
  }, (aA = function() {
    var b, p, o, n, m, l, k, j;
    for (Pace.sources = ap = [], l = ["ajax", "elements", "document", "eventLag"], p = 0, n = l.length; n > p; p++) {
      b = l[p], ay[b] !== !1 && ap.push(new aQ[b](ay[b]))
    }
    for (j = null != (k = ay.extraSources) ? k : [], o = 0, m = j.length; m > o; o++) {
      aq = j[o], ap.push(new aq(ay))
    }
    return Pace.bar = aK = new aZ, au = [], ao = new aP
  })(), Pace.stop = function() {
    return Pace.trigger("stop"), Pace.running = !1, aK.destroy(), aJ = !0, null != aM && ("function" == typeof aI && aI(aM), aM = null), aA()
  }, Pace.restart = function() {
    return Pace.trigger("restart"), Pace.stop(), Pace.start()
  }, Pace.go = function() {
    var b;
    return Pace.running = !0, aK.render(), b = az(), aJ = !1, aM = av(function(J, I) {
      var H, G, F, E, D, C, B, A, z, y, x, w, r, q, l, a;
      for (A = 100 - aK.progress, G = x = 0, F = !0, C = w = 0, q = ap.length; q > w; C = ++w) {
        for (aq = ap[C], y = null != au[C] ? au[C] : au[C] = [], D = null != (a = aq.elements) ? a : [aq], B = r = 0, l = D.length; l > r; B = ++r) {
          E = D[B], z = null != y[B] ? y[B] : y[B] = new aP(E), F &= z.done, z.done || (G++, x += z.tick(J))
        }
      }
      return H = x / G, aK.update(ao.tick(J, H)), aK.done() || F || aJ ? (aK.update(100), Pace.trigger("done"), setTimeout(function() {
        return aK.finish(), Pace.running = !1, Pace.trigger("hide")
      }, Math.max(ay.ghostTime, Math.max(ay.minTime - (az() - b), 0)))) : I()
    })
  }, Pace.start = function(d) {
    aG(ay, d), Pace.running = !0;
    try {
      aK.render()
    } catch (c) {
      aS = c
    }
    return document.querySelector(".pace") ? (Pace.trigger("start"), Pace.go()) : setTimeout(Pace.start, 50)
  }, "function" == typeof define && define.amd ? define(function() {
    return Pace
  }) : "object" == typeof exports ? module.exports = Pace : ay.startOnPageLoad && Pace.start()
}).call(this);
