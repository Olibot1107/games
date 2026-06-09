var h;
h || (h = typeof Module !== 'undefined' ? Module : {});
h.lk || (h.lk = 0);
h.lk++;
h.ENVIRONMENT_IS_PTHREAD || function (a) {
    function b(n, q, p, t) {
        if ("object" === typeof process && "object" === typeof process.versions && "string" === typeof process.versions.node) require("fs").readFile(n, function (r, C) {
            r ? t(r) : p(C.buffer)
        });
        else {
            var v = new XMLHttpRequest;
            v.open("GET", n, !0);
            v.responseType = "arraybuffer";
            v.onprogress = function (r) {
                var C = q;
                r.total && (C = r.total);
                if (r.loaded) {
                    v.Ki ? h.Gj[n].loaded = r.loaded : (v.Ki = !0, h.Gj || (h.Gj = {}), h.Gj[n] = {
                        loaded: r.loaded,
                        total: C
                    });
                    var y = C = r = 0,
                        F;
                    for (F in h.Gj) {
                        var J = h.Gj[F];
                        r += J.total;
                        C += J.loaded;
                        y++
                    }
                    r = Math.ceil(r * h.lk / y);
                    h.setStatus && h.setStatus("Downloading data... (" + C + "/" + r + ")")
                } else !h.Gj && h.setStatus && h.setStatus("Downloading data...")
            };
            v.onerror = function () {
                throw Error("NetworkError for: " + n);
            };
            v.onload = function () {
                if (200 == v.status || 304 == v.status || 206 == v.status || 0 == v.status && v.response) p(v.response);
                else throw Error(v.statusText + " : " + v.responseURL);
            };
            v.send(null)
        }
    }

    function c(n) {
        console.error("package error:", n)
    }

    function d() {
        function n(v, r, C) {
            this.start = v;
            this.end =
                r;
            this.audio = C
        }

        function q(v) {
            if (!v) throw "Loading data file failed." + Error().stack;
            if (!(v instanceof ArrayBuffer)) throw "bad input to processPackageData" + Error().stack;
            v = new Uint8Array(v);
            n.prototype.Vi = v;
            v = a.files;
            for (var r = 0; r < v.length; ++r) n.prototype.Ki[v[r].filename].onload();
            h.removeRunDependency("datafile_runner.data")
        }
        h.FS_createPath("/", "assets", !0, !0);
        h.FS_createPath("/assets", "lang", !0, !0);
        h.FS_createPath("/assets", "licenses", !0, !0);
        n.prototype = {
            Ki: {},
            open: function (v, r) {
                this.name = r;
                this.Ki[r] = this;
                h.addRunDependency("fp " + this.name)
            },
            send: function () {},
            onload: function () {
                this.Qi(this.Vi.subarray(this.start,
                    this.end))
            },
            Qi: function (v) {
                h.FS_createDataFile(this.name, null, v, !0, !0, !0);
                h.removeRunDependency("fp " + this.name);
                this.Ki[this.name] = null
            }
        };
        for (var p = a.files, t = 0; t < p.length; ++t)(new n(p[t].start, p[t].end, p[t].audio || 0)).open("GET", p[t].filename);
        h.addRunDependency("datafile_runner.data");
        h.cl || (h.cl = {});
        h.cl["runner.data"] = {
            em: !1
        };
        l ? (q(l), l = null) : g = q
    }
    "object" === typeof window ? window.encodeURIComponent(window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf("/")) +
        "/") : "undefined" === typeof process && "undefined" !== typeof location && encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf("/")) + "/");
    "function" !== typeof h.locateFilePackage || h.locateFile || (h.locateFile = h.locateFilePackage, k("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)"));
    var e = h.locateFile ? h.locateFile("runner.data", "") : "runner.data",
        f = a.remote_package_size,
        g = null,
        l = h.getPreloadedPackage ?
        h.getPreloadedPackage(e, f) : null;
    l || b(e, f, function (n) {
        g ? (g(n), g = null) : l = n
    }, c);
    h.calledRun ? d() : (h.preRun || (h.preRun = []), h.preRun.push(d))
}({
    "files": [{
        "filename": "/assets/audiogroup1.dat",
        "start": 0,
        "end": 10653060,
        "audio": 0
    }, {
        "filename": "/assets/audiogroup2.dat",
        "start": 10653060,
        "end": 10978630,
        "audio": 0
    }, {
        "filename": "/assets/credits.txt",
        "start": 10978630,
        "end": 11008733,
        "audio": 0
    }, {
        "filename": "/assets/noisecredits.txt",
        "start": 11008733,
        "end": 11009822,
        "audio": 0
    }, {
        "filename": "/assets/options.ini",
        "start": 11009822,
        "end": 11009965,
        "audio": 0
    }, {
        "filename": "/assets/PizzaTower_GM2.yydebug",
        "start": 11009965,
        "end": 17261176,
        "audio": 0
    }, {
        "filename": "/assets/lang/english.txt",
        "start": 17261176,
        "end": 17296426,
        "audio": 0
    }, {
        "filename": "/assets/licenses/gameframe_license.txt",
        "start": 17296426,
        "end": 17299299,
        "audio": 0
    }],
    "remote_package_size": 17299299,
    "package_uuid": "b6507de7-8738-4d13-80df-85f60340d100"
});
this.doGMLCallback = function (a, b) {
    b = JSON.stringify(b);
    var c = aa(b) + 1,
        d = m(c);
    u(b, d, c);
    console.log("AddAsyncMethod=" + g_pAddAsyncMethod + ", methodToCall=" + a + ", stringOnWasmHeap=" + d + ", argsAsJSON=" + b);
    h.dynCall("vii", g_pAddAsyncMethod, [a, d])
};
this.triggerAdPrefix = function (a, b, c, d, e) {
    var f = m(80),
        g = f + 16,
        l = f + 32,
        n = f + 48,
        q = f + 64;
    ba(f + 0, a, 16);
    ba(g, b, 16);
    ba(l, c, 16);
    ba(n, d, 16);
    ba(q, e, 16);
    return f
};
this.triggerAdPostfix = function (a) {
    ca(a)
};
this.triggerPaymentPrefix = function (a) {
    var b = m(16);
    ba(b, a, 16);
    return b
};
this.triggerPaymentPostfix = function (a) {
    ca(a)
};
var w = null,
    da = [],
    ea = null,
    ha = null,
    ia = null,
    ja = null,
    ka = null;

function la() {
    w && ("visible" === document.visibilityState ? w.resume() : w.suspend())
}
var ma = void 0;
this.OGX_startDRMCheck = function () {
    ma && h.dynCall("v", ma)
};
var na = void 0,
    oa = void 0,
    pa = void 0,
    qa = void 0;
this.GM_pause = function () {
    na && h.dynCall("v", na)
};
this.GM_unpause = function () {
    oa && h.dynCall("v", oa)
};
this.GM_tick = function () {
    pa && h.dynCall("vd", pa, [performance.now()])
};
this.GM_is_multiplayer = function () {
    return qa ? h.dynCall("i", qa) : 0
};
var ra = void 0,
    sa = void 0;
this.GM_get_view_status = function () {
    var a = void 0;
    if (ra) {
        var b = h.dynCall("i", ra);
        a = x(b);
        a = JSON.parse(a);
        ca(b)
    }
    return a
};
this.GM_set_view_status = function (a) {
    if (sa) {
        a = JSON.stringify(a);
        var b = aa(a) + 1,
            c = m(b);
        u(a, c, b);
        console.log("GM_set_view_status=" + sa + ", stringOnWasmHeap=" + c + ", argsAsJSON=" + a);
        h.dynCall("vi", sa, [c])
    }
};
var ta = [],
    ua = !1,
    va = !1;
this.activate_clipboard = function () {
    !ua && navigator.clipboard && navigator.permissions && !va && (va = !0, navigator.permissions.query({
        name: "clipboard-read",
        Zl: !0
    }).then(function (a) {
        if ("granted" == a.state || "prompt" == a.state) {
            ua = !0;
            va = !1;
            for (a = 0; a < ta.length; ++a) navigator.clipboard.writeText(ta[a]);
            ta = [];
            navigator.clipboard.readText().then(b => {
                "" != b && ta.push(b)
            }).catch(() => {})
        }
    }))
};
this.clipboard_has_text = function () {
    if (!ua) return activate_clipboard(), !1;
    navigator.clipboard.readText().then(a => {
        "" != a && ta.push(a)
    }).catch(() => {});
    return 0 < ta.length
};
this.clipboard_get_text = function () {
    var a = "";
    ua ? 0 < ta.length && (a = ta.pop()) : activate_clipboard();
    return a
};
this.clipboard_set_text = function (a) {
    ua ? navigator.clipboard && navigator.clipboard.writeText(a) : (activate_clipboard(), ta.push(a))
};
var wa = {},
    xa = {},
    ya = "";
this.__gx_cache_file = function (a) {
    if (window.oprt && window.oprt.gameFiles) {
        var b = window.origin + "/" + a.name,
            c = new URLSearchParams(window.location.search);
        const d = c.get("game"),
            e = c.get("track");
        c = c.get("release");
        null != d && null != e && null != c && (b = window.location.origin + "/" + d + "/" + e + "/" + c + "/" + a.name);
        console.log("__gx_cache_file for " + b);
        b = new Request(b);
        let f = a.name + ":" + a.md5;
        window.oprt.gameFiles.fetchAndCache(f, ya, b).then(g => {
            g.arrayBuffer().then(function () {
                console.log("fetchAndCache complete for file:id " +
                    f);
                xa[a.name] = {
                    name: a.name,
                    md5: a.md5,
                    fileId: f,
                    version: ya
                }
            })
        })
    }
    return Promise.resolve()
};
this.__gx_check_cache = function (a, b) {
    var c = void 0 != xa[a];
    b && console.log("__gx_check_cache for " + a + " cached files " + JSON.stringify(xa) + " manifest files " + JSON.stringify(wa));
    !c && void 0 != wa[a] && b && this.__gx_cache_file(wa[a]);
    return c
};
this.__gx_prepare_cache = function (a) {
    ya = a;
    return new Promise(function (b, c) {
        if (window.oprt && window.oprt.gameFiles) {
            let e = manifestFiles().split(";");
            var d = manifestFilesMD5();
            window.oprt.gameFiles.keys().then(f => {
                console.log("current cache entries are " + JSON.stringify(f));
                var g = {};
                let l = [];
                for (var n = 0; n < f.length; ++n) {
                    var q = f[n],
                        p = q.fileId,
                        t = "",
                        v = p.indexOf(":");
                    0 <= v && (t = p.substring(v + 1), p = p.substring(0, v));
                    v = e.indexOf(p);
                    console.log("considering file " + p + " for deleting, indexOf is " + v + " cached MD5 is " +
                        t + " manifest md5 is " + (0 > v ? " not present" : d[v]));
                    0 > v || d[v] != t ? l.push(window.oprt.gameFiles.delete(q.fileId, q.version)) : g[p] = {
                        name: p,
                        md5: t,
                        fileId: q.fileId,
                        version: q.version
                    }
                }
                console.log("current cache files are " + JSON.stringify(g));
                xa = g;
                f = {};
                for (n = 0; n < e.length; ++n) f[e[n]] = {
                    name: e[n],
                    md5: d[n]
                };
                wa = f;
                void 0 == xa["game.unx"] ? (console.log("caching game.unx"), this.__gx_cache_file(wa["game.unx"]).then(() => {
                    b({
                        cachedFiles: xa,
                        allFiles: e
                    })
                })) : b({
                    cachedFiles: xa,
                    allFiles: e
                })
            }).catch(f => {
                c(Error("error trying to enumerate cache keys - " +
                    JSON.stringify(f)))
            })
        } else c(Error("unable to cache, API not found"))
    })
};
this.__gx_async_wget2 = function (a, b, c, d, e, f, g) {
    window.oprt && window.oprt.gameFiles && (a = xa[a], a = window.oprt.gameFiles.match(a.fileId, a.version), a.catch(() => {
        h.dynCall("vi", g, [d])
    }), a.then(l => l.arrayBuffer()).then(l => {
        l = new Uint8Array(l);
        var n = m(l.length);
        A.set(l, n);
        f && h.dynCall("viiii", f, [4294967295, d, n, l.length]);
        e && e(n)
    }))
};
GXMFS = {
    pj: {},
    Si: function (a) {
        return B.Si.apply(null, arguments)
    },
    Bk: (a, b, c) => {
        GXMFS.mk(a, (d, e) => {
            if (d) return c(d);
            GXMFS.nk(a, (f, g) => {
                if (f) return c(f);
                GXMFS.uk(b ? g : e, b ? e : g, c)
            })
        })
    },
    Il: () => {
        GXMFS.pj = {}
    },
    xl: (a, b) => {
        var c = GXMFS.pj[a];
        c || (c = window.oprt.gameStorage.open(a), GXMFS.pj[a] = c);
        return b(null, c)
    },
    mk: (a, b) => {
        function c(l) {
            return "." !== l && ".." !== l
        }

        function d(l) {
            return n => za(l + "/" + n)
        }
        var e = {};
        for (a = Aa(a.rj).filter(c).map(d(a.rj)); a.length;) {
            var f = a.pop();
            try {
                var g = Ba(f)
            } catch (l) {
                return b(l)
            }
            16384 === (g.mode &
                61440) && a.push.apply(a, Aa(f).filter(c).map(d(f)));
            e[f] = {
                timestamp: g.mtime
            }
        }
        return b(null, {
            type: "local",
            entries: e
        })
    },
    nk: (a, b) => {
        GXMFS.xl(a.rj, (c, d) => {
            if (c) return b(c);
            d.list().then(e => {
                b(null, {
                    type: "remote",
                    storage: d,
                    entries: e
                })
            }).catch(b)
        })
    },
    qk: (a, b) => {
        try {
            var c = D(a).node;
            var d = Ba(a)
        } catch (e) {
            return b(e)
        }
        return 16384 === (d.mode & 61440) ? b(null, {
            timestamp: d.mtime,
            mode: d.mode
        }) : 32768 === (d.mode & 61440) ? (c.Mi = B.Qk(c), b(null, {
            timestamp: d.mtime,
            mode: d.mode,
            contents: c.Mi
        })) : b(Error("node type not supported"))
    },
    zk: (a, b, c) => {
        try {
            if (16384 === (b.mode & 61440)) Ca(a, b.mode);
            else if (32768 === (b.mode & 61440)) Da(a, b.contents);
            else return c(Error("node type not supported"));
            Ea(a, b.mode);
            Fa(a, b.timestamp, b.timestamp)
        } catch (d) {
            return c(d)
        }
        c(null)
    },
    wk: (a, b) => {
        try {
            var c = Ba(a);
            16384 === (c.mode & 61440) ? Ga(a) : 32768 === (c.mode & 61440) && Ha(a)
        } catch (d) {
            return b(d)
        }
        b(null)
    },
    rk: (a, b, c) => {
        a.get(b).then(d => {
            c(null, d)
        }).catch(c)
    },
    Ak: (a, b, c, d) => {
        a.put(c, b).then(() => {
            d(null)
        }).catch(d)
    },
    xk: (a, b, c) => {
        a.delete(b).then(() => {
            c(null)
        }).catch(c)
    },
    uk: (a, b, c) => {
        function d(q) {
            e--;
            if (q && !l) return l = !0, console.error("Reconcile failed"), c(q);
            if (0 === e && !l) return console.info("Reconcile finished successfully"), c(null)
        }
        console.info("Starting reconcile");
        var e = 0,
            f = [];
        Object.keys(a.entries).forEach(function (q) {
            var p = a.entries[q],
                t = b.entries[q];
            t && p.timestamp.getTime() == t.timestamp.getTime() || (f.push(q), e++)
        });
        console.debug(`${f.length} entries to create/update on the ${"local"===b.type?"local filesystem":"remote filesystem"}`);
        var g = [];
        Object.keys(b.entries).forEach(function (q) {
            a.entries[q] ||
                (g.push(q), e++)
        });
        console.debug(`${g.length} entries to remove from the ${"local"===b.type?"local filesystem":"remote filesystem"}`);
        if (0 == e) return c(null);
        var l = !1,
            n = "remote" === a.type ? a.storage : b.storage;
        f.sort().forEach(q => {
            "local" === b.type ? GXMFS.rk(n, q, (p, t) => {
                if (p) return d(p);
                GXMFS.zk(q, t, d)
            }) : GXMFS.qk(q, (p, t) => {
                if (p) return d(p);
                GXMFS.Ak(n, q, t, d)
            })
        });
        g.sort().reverse().forEach(q => {
            "local" === b.type ? GXMFS.wk(q, d) : GXMFS.xk(n, q, d)
        })
    }
};
var Ia = Object.assign({}, h),
    Ja = [],
    Ka = "./this.program",
    La = (a, b) => {
        throw b;
    },
    Ma = "object" == typeof window,
    Na = "function" == typeof importScripts,
    Oa = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node,
    Pa = "",
    Qa, Ra, Sa, Ta, fs, Ua, Va;
if (Oa) Pa = Na ? require("path").dirname(Pa) + "/" : __dirname + "/", Va = () => {
    Ua || (fs = require("fs"), Ua = require("path"))
}, Qa = function (a, b) {
    Va();
    a = Ua.normalize(a);
    return fs.readFileSync(a, b ? void 0 : "utf8")
}, Sa = a => {
    a = Qa(a, !0);
    a.buffer || (a = new Uint8Array(a));
    return a
}, Ra = (a, b, c) => {
    Va();
    a = Ua.normalize(a);
    fs.readFile(a, function (d, e) {
        d ? c(d) : b(e.buffer)
    })
}, 1 < process.argv.length && (Ka = process.argv[1].replace(/\\/g, "/")), Ja = process.argv.slice(2), "undefined" != typeof module && (module.exports = h), process.on("uncaughtException",
    function (a) {
        if (!(a instanceof Wa)) throw a;
    }), process.on("unhandledRejection", function (a) {
    throw a;
}), La = (a, b) => {
    if (noExitRuntime) throw process.exitCode = a, b;
    b instanceof Wa || k("exiting due to exception: " + b);
    process.exit(a)
}, h.inspect = function () {
    return "[Emscripten Module object]"
};
else if (Ma || Na) Na ? Pa = self.location.href : "undefined" != typeof document && document.currentScript && (Pa = document.currentScript.src), Pa = 0 !== Pa.indexOf("blob:") ? Pa.substr(0, Pa.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", Qa = a => {
    var b =
        new XMLHttpRequest;
    b.open("GET", a, !1);
    b.send(null);
    return b.responseText
}, Na && (Sa = a => {
    var b = new XMLHttpRequest;
    b.open("GET", a, !1);
    b.responseType = "arraybuffer";
    b.send(null);
    return new Uint8Array(b.response)
}), Ra = (a, b, c) => {
    var d = new XMLHttpRequest;
    d.open("GET", a, !0);
    d.responseType = "arraybuffer";
    d.onload = () => {
        200 == d.status || 0 == d.status && d.response ? b(d.response) : c()
    };
    d.onerror = c;
    d.send(null)
}, Ta = a => {
    document.title = a
};
var Xa = h.print || console.log.bind(console),
    k = h.printErr || console.warn.bind(console);
Object.assign(h, Ia);
Ia = null;
h.arguments && (Ja = h.arguments);
h.thisProgram && (Ka = h.thisProgram);
h.quit && (La = h.quit);

function Ya(a) {
    Za || (Za = {});
    Za[a] || (Za[a] = 1, k(a))
}
var Za, $a = 0,
    bb;
h.wasmBinary && (bb = h.wasmBinary);
var noExitRuntime = h.noExitRuntime || !0;
"object" != typeof WebAssembly && cb("no native wasm support detected");

function db(a, b, c = "i8") {
    "*" === c.charAt(c.length - 1) && (c = "i32");
    switch (c) {
        case "i1":
            E[a >> 0] = b;
            break;
        case "i8":
            E[a >> 0] = b;
            break;
        case "i16":
            eb[a >> 1] = b;
            break;
        case "i32":
            G[a >> 2] = b;
            break;
        case "i64":
            fb = [b >>> 0, (H = b, 1 <= +Math.abs(H) ? 0 < H ? (Math.min(+Math.floor(H / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((H - +(~~H >>> 0)) / 4294967296) >>> 0 : 0)];
            G[a >> 2] = fb[0];
            G[a + 4 >> 2] = fb[1];
            break;
        case "float":
            I[a >> 2] = b;
            break;
        case "double":
            gb[a >> 3] = b;
            break;
        default:
            cb("invalid type for setValue: " + c)
    }
}

function hb(a) {
    var b = "float";
    "*" === b.charAt(b.length - 1) && (b = "i32");
    switch (b) {
        case "i1":
            return E[a >> 0];
        case "i8":
            return E[a >> 0];
        case "i16":
            return eb[a >> 1];
        case "i32":
            return G[a >> 2];
        case "i64":
            return G[a >> 2];
        case "float":
            return I[a >> 2];
        case "double":
            return Number(gb[a >> 3]);
        default:
            cb("invalid type for getValue: " + b)
    }
    return null
}
var ib, jb = !1;

function kb(a, b, c, d) {
    var e = {
        string: function (q) {
            var p = 0;
            if (null !== q && void 0 !== q && 0 !== q) {
                var t = (q.length << 2) + 1;
                p = lb(t);
                u(q, p, t)
            }
            return p
        },
        array: function (q) {
            var p = lb(q.length);
            E.set(q, p);
            return p
        }
    };
    a = h["_" + a];
    var f = [],
        g = 0;
    if (d)
        for (var l = 0; l < d.length; l++) {
            var n = e[c[l]];
            n ? (0 === g && (g = mb()), f[l] = n(d[l])) : f[l] = d[l]
        }
    c = a.apply(null, f);
    return c = function (q) {
        0 !== g && nb(g);
        return "string" === b ? x(q) : "boolean" === b ? !!q : q
    }(c)
}
var ob = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;

function pb(a, b, c) {
    var d = b + c;
    for (c = b; a[c] && !(c >= d);) ++c;
    if (16 < c - b && a.buffer && ob) return ob.decode(a.subarray(b, c));
    for (d = ""; b < c;) {
        var e = a[b++];
        if (e & 128) {
            var f = a[b++] & 63;
            if (192 == (e & 224)) d += String.fromCharCode((e & 31) << 6 | f);
            else {
                var g = a[b++] & 63;
                e = 224 == (e & 240) ? (e & 15) << 12 | f << 6 | g : (e & 7) << 18 | f << 12 | g << 6 | a[b++] & 63;
                65536 > e ? d += String.fromCharCode(e) : (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023))
            }
        } else d += String.fromCharCode(e)
    }
    return d
}

function x(a, b) {
    return a ? pb(A, a, b) : ""
}

function qb(a, b, c, d) {
    if (!(0 < d)) return 0;
    var e = c;
    d = c + d - 1;
    for (var f = 0; f < a.length; ++f) {
        var g = a.charCodeAt(f);
        if (55296 <= g && 57343 >= g) {
            var l = a.charCodeAt(++f);
            g = 65536 + ((g & 1023) << 10) | l & 1023
        }
        if (127 >= g) {
            if (c >= d) break;
            b[c++] = g
        } else {
            if (2047 >= g) {
                if (c + 1 >= d) break;
                b[c++] = 192 | g >> 6
            } else {
                if (65535 >= g) {
                    if (c + 2 >= d) break;
                    b[c++] = 224 | g >> 12
                } else {
                    if (c + 3 >= d) break;
                    b[c++] = 240 | g >> 18;
                    b[c++] = 128 | g >> 12 & 63
                }
                b[c++] = 128 | g >> 6 & 63
            }
            b[c++] = 128 | g & 63
        }
    }
    b[c] = 0;
    return c - e
}

function u(a, b, c) {
    return qb(a, A, b, c)
}

function aa(a) {
    for (var b = 0, c = 0; c < a.length; ++c) {
        var d = a.charCodeAt(c);
        55296 <= d && 57343 >= d && (d = 65536 + ((d & 1023) << 10) | a.charCodeAt(++c) & 1023);
        127 >= d ? ++b : b = 2047 >= d ? b + 2 : 65535 >= d ? b + 3 : b + 4
    }
    return b
}

function rb(a) {
    var b = aa(a) + 1,
        c = m(b);
    c && qb(a, E, c, b);
    return c
}

function sb(a) {
    var b = aa(a) + 1,
        c = lb(b);
    qb(a, E, c, b);
    return c
}
var tb, E, A, eb, K, G, N, I, gb;

function ub() {
    var a = ib.buffer;
    tb = a;
    h.HEAP8 = E = new Int8Array(a);
    h.HEAP16 = eb = new Int16Array(a);
    h.HEAP32 = G = new Int32Array(a);
    h.HEAPU8 = A = new Uint8Array(a);
    h.HEAPU16 = K = new Uint16Array(a);
    h.HEAPU32 = N = new Uint32Array(a);
    h.HEAPF32 = I = new Float32Array(a);
    h.HEAPF64 = gb = new Float64Array(a)
}
var vb, wb = [],
    xb = [],
    zb = [],
    Ab = [],
    Bb = [];

function Cb() {
    var a = h.preRun.shift();
    wb.unshift(a)
}
var Db = 0,
    Eb = null,
    Fb = null;

function Gb() {
    Db++;
    h.monitorRunDependencies && h.monitorRunDependencies(Db)
}

function Hb() {
    Db--;
    h.monitorRunDependencies && h.monitorRunDependencies(Db);
    if (0 == Db && (null !== Eb && (clearInterval(Eb), Eb = null), Fb)) {
        var a = Fb;
        Fb = null;
        a()
    }
}

function cb(a) {
    if (h.onAbort) h.onAbort(a);
    a = "Aborted(" + a + ")";
    k(a);
    jb = !0;
    throw new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
}

function Ib() {
    return Jb.startsWith("data:application/octet-stream;base64,")
}
var Jb;
Jb = "runner.wasm";
if (!Ib()) {
    var Kb = Jb;
    Jb = h.locateFile ? h.locateFile(Kb, Pa) : Pa + Kb
}

function Lb() {
    var a = Jb;
    try {
        if (a == Jb && bb) return new Uint8Array(bb);
        if (Sa) return Sa(a);
        throw "both async and sync fetching of the wasm failed";
    } catch (b) {
        cb(b)
    }
}

function Mb() {
    if (!bb && (Ma || Na)) {
        if ("function" == typeof fetch && !Jb.startsWith("file://")) return fetch(Jb, {
            credentials: "same-origin"
        }).then(function (a) {
            if (!a.ok) throw "failed to load wasm binary file at '" + Jb + "'";
            return a.arrayBuffer()
        }).catch(function () {
            return Lb()
        });
        if (Ra) return new Promise(function (a, b) {
            Ra(Jb, function (c) {
                a(new Uint8Array(c))
            }, b)
        })
    }
    return Promise.resolve().then(function () {
        return Lb()
    })
}
var H, fb, Sb = {
    1445808: function () {
        return hasJSExceptionHandler()
    },
    1445873: function (a) {
        doJSExceptionHandler(x(a))
    },
    1445917: function () {
        return document.querySelector("canvas").getBoundingClientRect().left
    },
    1446037: function () {
        return document.querySelector("canvas").getBoundingClientRect().top
    },
    1446156: function () {
        var a = document.querySelector("canvas").getBoundingClientRect();
        return a.right - a.left
    },
    1446289: function () {
        var a = document.querySelector("canvas").getBoundingClientRect();
        return a.bottom - a.top
    },
    1446422: function (a,
        b, c, d, e, f) {
        gxc_request_room(x(a), x(b), c, d, x(e), x(f))
    },
    1446524: function (a, b, c, d) {
        gxc_join_room(x(a), x(b), x(c), x(d))
    },
    1446615: function () {
        var a = document.getElementById("stats-button");
        a && (a.style.visibility = "visible");
        if (a = document.getElementById("log-state-button")) a.style.visibility = "visible"
    },
    1446864: function () {
        var a = document.getElementById("stats-button");
        a && (a.style.visibility = "visible");
        if (a = document.getElementById("log-state-button")) a.style.visibility = "visible"
    },
    1447113: function (a) {
        var b = document.getElementById("multiplayer-stats");
        b && "visible" == b.style.visibility && (b.innerHTML = x(a))
    },
    1447281: function (a) {
        "function" == typeof showRollbackMessage && showRollbackMessage(x(a))
    },
    1447374: function () {
        var a = document.getElementById("stats-button");
        a && (a.style.visibility = "hidden");
        if (a = document.getElementById("share-button")) a.style.visibility = "hidden";
        if (a = document.getElementById("log-state-button")) a.style.visibility = "hidden"
    },
    1447736: function (a, b) {
        gxc_set_player_status(a, x(b))
    },
    1447787: function (a) {
        gxc_report_status(x(a))
    },
    1447828: function (a,
        b, c) {
        gxc_get_player_info(x(a), x(b), x(c))
    },
    1447907: function (a, b) {
        gxc_set_room_info(a, b)
    },
    1447938: function (a, b, c) {
        gxc_get_player_info(x(a), x(b), x(c))
    },
    1448017: function (a, b, c) {
        gxc_receive_chat_message(x(a), b, c)
    },
    1448073: function (a, b) {
        return webtransport_set_relay(x(a), b)
    },
    1448130: function (a) {
        webtransport_destroy(a)
    },
    1448160: function (a, b, c) {
        webtransport_send(a, b, c)
    },
    1448195: function (a, b, c) {
        return webtransport_receive(a, b, c)
    },
    1448240: function (a) {
        alert(x(a))
    },
    1448270: function (a) {
        alert(x(a))
    },
    1448299: function () {
        return clipboard_has_text()
    },
    1448347: function () {
        var a = clipboard_get_text(),
            b = aa(a) + 1,
            c = m(b);
        u(a, c, b + 1);
        return c
    },
    1448523: function (a) {
        clipboard_set_text(x(a))
    },
    1448566: function () {
        var a = -1;
        window.matchMedia("(orientation:portrait)").matches ? a = 1 : window.matchMedia("(orientation:landscape)").matches && (a = 0);
        return a
    },
    1448744: function (a) {
        window.open(x(a), "_blank").focus()
    },
    1448799: function () {
        var a = document.querySelector("canvas");
        null != a.Ki && (a.Ki.pause(), console.log("Pausing video player"), a.Ki.removeAttribute("src"), a.Ki.load())
    },
    1449049: function (a, b, c) {
        var d = document.querySelector("canvas");
        if (null != d.Qj) return b = d.Qj.getImageData(0, 0, b, c), b = new Uint8Array(b.data.buffer), E.set(b, a), 1;
        console.log("Not rendering video as context is null");
        return 0
    },
    1449386: function () {
        var a = document.querySelector("canvas");
        return null != a.Ki ? a.Ki.videoWidth : 0
    },
    1449533: function () {
        var a = document.querySelector("canvas");
        return null != a.Ki ? a.Ki.videoHeight : 0
    },
    1449681: function () {
        var a = document.querySelector("canvas");
        if (null != a.Ki) {
            if (a.Ki.paused) return -1;
            if (!a.Ki.ended) return 0
        }
        return -1
    },
    1449884: function (a) {
        var b = document.querySelector("canvas");
        null != b.Ki && (b.Ki.volume = a)
    },
    1450017: function (a) {
        function b() {
            function l() {
                const p = document.querySelector("canvas").Ki;
                null != p && (p.muted = !1)
            }
            var n = "mousedown",
                q = "mouseup";
            "ontouchstart" in window && (n = "touchstart", q = "touchend");
            if (window.PointerEvent || window.navigator.pointerEnabled || window.navigator.msPointerEnabled) n = "pointerdown", q = "pointerup";
            document.body.addEventListener(n, l, {
                once: !0
            });
            document.body.addEventListener(q,
                l, {
                    once: !0
                })
        }
        var c = document.querySelector("canvas");
        null == c.Ki ? c.Ki = document.createElement("video") : c.Ki.pause();
        const d = c.Ki;
        a = x(a);
        d.muted = !1;
        d.src = a;
        const e = {
                Tl: h.cwrap("video_playback_ended", "", "")
            },
            f = {
                Ul: h.cwrap("video_playback_started", "", "")
            };
        d.addEventListener("ended", function () {
            e.Tl()
        });
        d.addEventListener("playing", function () {
            console.log("Video playing event called");
            f.Ul()
        }, !0);
        const g = () => {
            var l = document.querySelector("canvas");
            null == l.Vi ? (l.Vi = document.createElement("canvas"), l.Vi.style.cssText =
                "position:fixed; top:1px; left:1px; width:1px; height:1px", l.Vi.width = d.videoWidth, l.Vi.height = d.videoHeight, document.body.appendChild(l.Vi), l.Qj = l.Vi.getContext("2d", {
                    alpha: !1,
                    $l: !1,
                    powerPreference: "low-power",
                    desynchronized: !0,
                    preserveDrawingBuffer: !0
                })) : (d.videoWidth != l.Vi.width && (l.Vi.width = d.videoWidth), l.Vi.height != d.videoHeight && (l.Vi.height = d.videoHeight));
            null != l.Ki && null != l.Qj && l.Qj.drawImage(l.Ki, 0, 0);
            null != l.Ki && (null != l.Ki.src ? l.Ki.requestVideoFrameCallback(g) : console.log("stopping video player callback check"))
        };
        d.requestVideoFrameCallback(g);
        d.load();
        a = d.play();
        void 0 !== a && a.then(() => {}).catch(() => {
            console.log("video_open failed. User must interact with the page before video with audio can be played. Attempting to play the video muted");
            d.muted = !0;
            d.play();
            b()
        })
    },
    1453087: function () {
        var a = document.querySelector("canvas");
        null != a.Ki && a.Ki.pause()
    },
    1453218: function () {
        var a = document.querySelector("canvas");
        null != a.Ki && a.Ki.play()
    },
    1453348: function (a) {
        var b = document.querySelector("canvas");
        null != b.Ki && (b.Ki.loop =
            .5 < a ? !0 : !1)
    },
    1453541: function (a) {
        var b = document.querySelector("canvas");
        null != b.Ki && (b.Ki.currentTime = a)
    },
    1453681: function () {
        var a = document.querySelector("canvas");
        return null == a.Ki || isNaN(a.Ki.duration) ? 0 : a.Ki.duration
    },
    1453876: function () {
        var a = document.querySelector("canvas");
        return null != a.Ki ? a.Ki.currentTime : 0
    },
    1454028: function () {
        var a = document.querySelector("canvas");
        return null != a.Ki ? a.Ki.ended ? 0 : a.Ki.paused ? 3 : a.Ki.readyState < a.Ki.HAVE_CURRENT_DATA ? 1 : 2 : 0
    },
    1454548: function () {
        var a = document.querySelector("canvas");
        return null != a.Ki ? a.Ki.loop : 0
    },
    1454693: function () {
        var a = document.querySelector("canvas");
        return null != a.Ki ? a.Ki.volume : 0
    },
    1454840: function (a, b, c, d) {
        var e = document.querySelector("canvas");
        if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
            console.log("CheckMediaRecorder::vp9 supported");
            var f = {
                mimeType: "video/webm; codecs=vp9"
            }
        } else MediaRecorder.isTypeSupported("video/webm;codecs=vp8") ? (f = {
            mimeType: "video/webm; codecs=vp8"
        }, console.log("CheckMediaRecorder::vp8 supported")) : console.log("CheckMediaRecorder::No vp8 or vp9 support");
        e.Ek = e.captureStream(c);
        e.Ek.getVideoTracks().find(g => g.enabled);
        null == e.ej && (e.ej = document.createElement("canvas"), e.ej.style.cssText = "position:fixed; top:1px; left:1px; width:1px; height:1px", e.ej.width = a, e.ej.height = b, document.body.appendChild(e.ej), console.log("Game Canvas width:" + e.width + " height:" + e.height), e.fl = e.ej.getContext("2d", {
                alpha: !1,
                desynchronized: !0,
                antialias: !0,
                powerPreference: "low-power",
                preserveDrawingBuffer: !0
            }), e.uj = document.createElement("video"), e.uj.autoplay = !0, e.uj.Wl = !0,
            e.uj.muted = !0, e.uj.style.cssText = "position:fixed;top:1px;left:1px;width:1px;height:1px", document.body.appendChild(e.uj), e.uj.srcObject = e.Ek, a = e.ej.captureStream(c), 0 < d && (d = w.createMediaStreamDestination().stream.getAudioTracks().find(g => g.enabled), a.addTrack(d)), f = new MediaRecorder(a, f), e.oj = [], f.ondataavailable = function (g) {
                e.oj.push(g.data)
            }, e.Qi = f);
        null == e.gk && (e.gk = setInterval(() => e.fl.drawImage(e.uj, 0, 0, e.width, e.height, 0, 0, e.ej.width, e.ej.height), 1E3 / c));
        e.Qi && "recording" != e.Qi.state && e.Qi.start()
    },
    1457336: function (a) {
        var b = document.querySelector("canvas");
        if (b.Qi && ("recording" == b.Qi.state || "paused" == b.Qi.state)) {
            var c = x(a);
            b.Qi.onstop = function () {
                var d = new Blob(b.oj, {
                    type: "video/webm"
                });
                b.oj = [];
                clearInterval(b.gk);
                b.gk = null;
                const e = {
                    sk: h.cwrap("post_video_upload_callback", "", ["string"])
                };
                if (c.startsWith("http")) fetch(c, {
                    method: "PUT",
                    body: d
                }).then(() => {
                    e.sk("upload completed")
                }).catch(g => {
                    e.sk("Error uploading: " + g)
                });
                else if ("" != c) {
                    d = URL.createObjectURL(d);
                    var f = document.createElement("a");
                    document.body.appendChild(f);
                    f.style = "display: none";
                    f.href = d;
                    f.download = c;
                    f.click();
                    window.URL.revokeObjectURL(d);
                    e.sk("filesaved")
                }
            };
            b.Qi.stop();
            console.log("saving chunks to movie")
        }
    },
    1458480: function () {
        var a = document.querySelector("canvas");
        a.Qi && "recording" == a.Qi.state && a.Qi.pause()
    },
    1458650: function () {
        var a = document.querySelector("canvas");
        a.Qi && "paused" == a.Qi.state && a.Qi.resume()
    },
    1458818: function (a, b, c, d, e, f) {
        triggerAd(x(a), b, c, d, e, f)
    },
    1458871: function (a, b) {
        triggerPayment(x(a), b)
    },
    1458913: function () {
        var a =
            640;
        "number" == typeof window.innerWidth ? a = window.innerWidth : document.documentElement && document.documentElement.clientWidth ? a = document.documentElement.clientWidth : document.body && document.body.clientWidth && (a = document.body.clientWidth);
        return a
    },
    1459219: function () {
        var a = 480;
        "number" == typeof window.innerHeight ? a = window.innerHeight : document.documentElement && document.documentElement.clientHeight ? a = document.documentElement.clientHeight : document.body && document.body.clientHeight && (a = document.body.clientHeight);
        return a
    },
    1459531: function (a, b, c, d) {
        var e = -1;
        if (void 0 != window.oprt) {
            var f = window.oprt.unlockOrientation,
                g = window.oprt.lockPortraitOrientation,
                l = window.oprt.lockLandscapeOrientation;
            a = (a ? 1 : 0) | (b ? 2 : 0) | (c ? 4 : 0);
            a |= d ? 8 : 0;
            15 != (a & 15) && 0 != a || void 0 == f || "function" != typeof f || (f(), console.log("unlocking all orientations"));
            0 != (a & 5) && void 0 != l && "function" == typeof l ? (l(), console.log("Locking to Landscape"), e = 0) : 0 != (a & 10) && void 0 != g && "function" == typeof g && (g(), console.log("Locking to Portrait"), e = 0)
        }
        return e
    },
    1460519: function (a) {
        a ? void 0 != window.oprt && void 0 != window.oprt.enterFullscreen ? (console.log("enterFullscreen"), window.oprt.enterFullscreen()) : (console.log("canvas requesting enterFullscreen"), document.querySelector("canvas").requestFullscreen()) : void 0 != window.oprt && void 0 != window.oprt.exitFullscreen ? (console.log("exitFullscreen"), window.oprt.exitFullscreen()) : (console.log("exitFullscreen via document"), document.exitFullscreen())
    },
    1461047: function () {
        return screen.width
    },
    1461072: function () {
        return screen.height
    },
    1461098: function (a) {
        document.title = x(a)
    },
    1461137: function (a, b) {
        this.onGameSetWindowSize && onGameSetWindowSize(a, b)
    },
    1461206: function (a) {
        document.querySelector("canvas").style.cursor = x(a)
    },
    1461305: function () {
        w = new AudioContext;
        document.addEventListener("visibilitychange", la)
    },
    1461427: function () {
        w.close().then(function () {
            w = null;
            document.removeEventListener("visibilitychange", la)
        })
    },
    1461586: function () {
        function a() {
            w.resume().then(function () {
                document.body.removeEventListener(b, a);
                document.body.removeEventListener(c,
                    a)
            })
        }
        let b = "mousedown",
            c = "mouseup";
        "ontouchstart" in window && (b = "touchstart", c = "touchend");
        if (window.PointerEvent || window.navigator.pointerEnabled || window.navigator.msPointerEnabled) b = "pointerdown", c = "pointerup";
        document.body.addEventListener(b, a);
        document.body.addEventListener(c, a)
    },
    1462290: function () {
        w.suspend()
    },
    1462323: function () {
        return null != w
    },
    1462363: function () {
        if (null == w) return 4;
        switch (w.state) {
            case "suspended":
                return 0;
            case "running":
                return 1;
            case "closed":
                return 2;
            case "interrupted":
                return 3
        }
    },
    1462557: function () {
        return null == w ? 0 : w.currentTime
    },
    1462635: function () {
        return null == w ? 0 : w.sampleRate
    },
    1462712: function () {
        return null == w ? 0 : w.destination.channelCount
    },
    1462801: function (a, b, c, d, e, f) {
        e = w.createBuffer(b, d, e);
        for (let g = 0; g < b; ++g) {
            const l = e.getChannelData(g);
            for (let n = 0; n < d; ++n) l[n] = hb(a + c * (g + n * b))
        }
        a = w.createBufferSource();
        a.buffer = e;
        a.connect(w.destination);
        a.start(f);
        return f + e.duration
    },
    1463447: function (a) {
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia && navigator.mediaDevices.getUserMedia({
            audio: !0
        }).then(b => {
            const c = d => {
                d = d.getAudioTracks();
                if (0 < d.length) return d[0].getSettings().channelCount
            };
            ha = b;
            ia = new AudioContext({
                sampleRate: a
            });
            ia.audioWorklet.addModule("audio-worklet.js").then(() => {
                ja = new AudioWorkletNode(ia, "audio-worklet");
                ja.port.onmessage = e => {
                    da.push(e.data)
                };
                ea = new MediaStreamAudioSourceNode(ia, {
                    mediaStream: b
                });
                const d = c(b);
                1 < d ? (ka = new ChannelMergerNode(ia, {
                    numberOfInputs: d
                }), ea.connect(ka), ka.connect(ja)) : ea.connect(ja);
                ia.resume()
            }).catch(d => {
                console.error(d);
                ha && ha.getTracks().forEach(e => {
                    e.stop()
                });
                ka = ea = ja = ha = ia = null
            })
        }).catch(b => {
            console.error(b)
        })
    },
    1465224: function () {
        da = [];
        ha.getTracks().forEach(a => {
            a.stop()
        });
        ja.port.postMessage(!0);
        ea.disconnect();
        ea = null;
        null != ka && (ka.disconnect(), ka = null);
        ja.disconnect();
        ja = null;
        ia.close().then(() => {
            ia = null
        }).catch(a => {
            console.error(a)
        })
    },
    1465816: function (a, b, c) {
        b /= c;
        for (let d = 0; d < b; ++d) {
            const e = da.shift();
            for (let f = 0; f < c; ++f) db(a + 2 * (d * c + f), e[f], "i16")
        }
    },
    1466160: function (a) {
        return da.length * a
    },
    1466246: function () {
        return null != ea && null != ja ?
            1 : 0
    },
    1466359: function () {
        return screen.width
    },
    1466384: function () {
        return screen.height
    },
    1466410: function () {
        return screen.width
    },
    1466435: function () {
        return screen.height
    },
    1466461: function () {
        var a = document.getElementById("canvas");
        const b = a.style.visibility;
        a.style.visibility = "hidden";
        a.offsetHeight;
        a.style.visibility = b
    },
    1466699: function (a, b) {
        g_pWadLoadCallback && g_pWadLoadCallback(a, b)
    },
    1466759: function () {
        var a = manifestFiles(),
            b = aa(a) + 1,
            c = m(b);
        u(a, c, b);
        return c
    },
    1466915: function (a) {
        return __gx_check_cache(x(a),
            !0) ? 1 : 0
    },
    1466977: function (a, b, c, d, e, f, g, l) {
        __gx_async_wget2(x(a), x(b), x(c), d, e, f, g, l)
    },
    1467074: function (a) {
        setAddAsyncMethod(a)
    },
    1467101: function (a, b, c, d) {
        __gx_prepare_cache(x(c)).then(e => {
            console.log("Prepare cache completed" + JSON.stringify(e));
            h.dynCall("vi", a, [b])
        }).catch(e => {
            console.log("Prepare cache error " + e);
            h.dynCall("vi", a, [d])
        })
    },
    1467381: function (a) {
        return __gx_check_cache(x(a), !1) ? 1 : 0
    },
    1467442: function (a, b) {
        g_pWadLoadCallback && g_pWadLoadCallback(a, b)
    },
    1467502: function (a) {
        window.location.replace(x(a))
    },
    1467549: function () {
        this.onFirstFrameRendered && onFirstFrameRendered()
    },
    1467612: function (a, b) {
        this.chrome && this.chrome.runtime && chrome.runtime.sendMessage(x(a), {
            command: x(b)
        })
    },
    1467749: function (a, b, c, d, e) {
        function f(l) {
            if (l.hash) {
                var n = 0;
                (new Uint8Array(l.hash)).every(q => {
                    n = n + q & 255;
                    return !0
                });
                g.gl(n, b)
            }
        }
        const g = {
            gl: h.cwrap("YYSum", "", ["number", "number"])
        };
        this.chrome && this.chrome.runtime && (e = A.subarray(e, e + 20), a = x(a), chrome.runtime.sendMessage(x(c), {
            command: x(d),
            randomString: a,
            hash: e
        }, f))
    },
    1468309: function () {
        return window.matchMedia("(any-hover: none)").matches ||
            window.matchMedia("(any-hover: hover) and (pointer: coarse)").matches || "undefined" != typeof window.oprt
    },
    1468482: function (a, b, c, d, e, f, g) {
        na = a;
        oa = b;
        ra = c;
        sa = d;
        pa = e;
        qa = f;
        ma = g
    },
    1468645: function (a, b) {
        a = prompt(x(a), x(b));
        b = aa(a) + 1;
        var c = m(b);
        u(a, c, b + 1);
        return c
    },
    1468841: function (a) {
        return confirm(x(a)) ? 1 : 0
    },
    1468888: function (a, b) {
        a = prompt(x(a), x(b));
        b = 1;
        a ? b += aa(a) : a = "";
        var c = m(b);
        u(a, c, b + 1);
        return c
    },
    1469119: function (a) {
        return confirm(x(a)) ? 1 : 0
    },
    1469166: function (a) {
        alert(x(a))
    },
    1469196: function () {
        Nb("/_savedata");
        window.oprt && window.oprt.gameStorage ? Ob(GXMFS, "/_savedata") : Ob(O, "/_savedata");
        Pb(!0, function () {
            kb("FSSyncCompleted", "void")
        })
    },
    1469418: function () {
        Pb(!1, function () {})
    },
    1469456: function () {
        Pb(!1, function () {})
    },
    1469493: function () {
        Pb(!1, function () {})
    },
    1469531: function () {
        return "undefined" !== typeof AudioContext || "undefined" !== typeof webkitAudioContext ? !0 : !1
    },
    1469678: function () {
        return "undefined" !== typeof navigator.mediaDevices && "undefined" !== typeof navigator.mediaDevices.getUserMedia || "undefined" !== typeof navigator.webkitGetUserMedia ?
            !0 : !1
    },
    1469912: function (a) {
        "undefined" === typeof h.SDL2 && (h.SDL2 = {});
        var b = h.SDL2;
        a ? b.capture = {} : b.audio = {};
        b.Ri || ("undefined" !== typeof AudioContext ? b.Ri = new AudioContext : "undefined" !== typeof webkitAudioContext && (b.Ri = new webkitAudioContext), b.Ri && Qb(b.Ri));
        return void 0 === b.Ri ? -1 : 0
    },
    1470405: function () {
        return h.SDL2.Ri.sampleRate
    },
    1470473: function (a, b, c, d) {
        function e() {}

        function f(l) {
            void 0 !== g.capture.Nj && (clearTimeout(g.capture.Nj), g.capture.Nj = void 0);
            g.capture.Uj = g.Ri.createMediaStreamSource(l);
            g.capture.Xi = g.Ri.createScriptProcessor(b, a, 1);
            g.capture.Xi.onaudioprocess = function (n) {
                void 0 !== g && void 0 !== g.capture && (n.outputBuffer.getChannelData(0).fill(0), g.capture.jk = n.inputBuffer, Rb("vi", c, [d]))
            };
            g.capture.Uj.connect(g.capture.Xi);
            g.capture.Xi.connect(g.Ri.destination);
            g.capture.stream = l
        }
        var g = h.SDL2;
        g.capture.$j = g.Ri.createBuffer(a, b, g.Ri.sampleRate);
        g.capture.$j.getChannelData(0).fill(0);
        g.capture.Nj = setTimeout(function () {
            g.capture.jk = g.capture.$j;
            Rb("vi", c, [d])
        }, b / g.Ri.sampleRate * 1E3);
        void 0 !== navigator.mediaDevices && void 0 !== navigator.mediaDevices.getUserMedia ? navigator.mediaDevices.getUserMedia({
            audio: !0,
            video: !1
        }).then(f).catch(e) : void 0 !== navigator.webkitGetUserMedia && navigator.webkitGetUserMedia({
            audio: !0,
            video: !1
        }, f, e)
    },
    1472125: function (a, b, c, d) {
        var e = h.SDL2;
        e.audio.Xi = e.Ri.createScriptProcessor(b, 0, a);
        e.audio.Xi.onaudioprocess = function (f) {
            void 0 !== e && void 0 !== e.audio && (e.audio.Mk = f.outputBuffer, Rb("vi", c, [d]))
        };
        e.audio.Xi.connect(e.Ri.destination)
    },
    1472535: function (a, b) {
        for (var c =
                h.SDL2, d = c.capture.jk.numberOfChannels, e = 0; e < d; ++e) {
            var f = c.capture.jk.getChannelData(e);
            if (f.length != b) throw "Web Audio capture buffer length mismatch! Destination size: " + f.length + " samples vs expected " + b + " samples!";
            if (1 == d)
                for (var g = 0; g < b; ++g) db(a + 4 * g, f[g], "float");
            else
                for (g = 0; g < b; ++g) db(a + 4 * (g * d + e), f[g], "float")
        }
    },
    1473140: function (a, b) {
        for (var c = h.SDL2, d = c.audio.Mk.numberOfChannels, e = 0; e < d; ++e) {
            var f = c.audio.Mk.getChannelData(e);
            if (f.length != b) throw "Web Audio output buffer length mismatch! Destination size: " +
                f.length + " samples vs expected " + b + " samples!";
            for (var g = 0; g < b; ++g) f[g] = I[a + (g * d + e << 2) >> 2]
        }
    },
    1473620: function (a) {
        var b = h.SDL2;
        if (a) {
            void 0 !== b.capture.Nj && clearTimeout(b.capture.Nj);
            if (void 0 !== b.capture.stream) {
                a = b.capture.stream.getAudioTracks();
                for (var c = 0; c < a.length; c++) b.capture.stream.removeTrack(a[c]);
                b.capture.stream = void 0
            }
            void 0 !== b.capture.Xi && (b.capture.Xi.onaudioprocess = function () {}, b.capture.Xi.disconnect(), b.capture.Xi = void 0);
            void 0 !== b.capture.Uj && (b.capture.Uj.disconnect(), b.capture.Uj =
                void 0);
            void 0 !== b.capture.$j && (b.capture.$j = void 0);
            b.capture = void 0
        } else void 0 != b.audio.Xi && (b.audio.Xi.disconnect(), b.audio.Xi = void 0), b.audio = void 0;
        void 0 !== b.Ri && void 0 === b.audio && void 0 === b.capture && (b.Ri.close(), b.Ri = void 0)
    },
    1474792: function (a, b, c) {
        h.SDL2 || (h.SDL2 = {});
        var d = h.SDL2;
        d.ll !== h.canvas && (d.fj = h.createContext(h.canvas, !1, !0), d.ll = h.canvas);
        if (d.w !== a || d.yl !== b || d.Bl !== d.fj) d.image = d.fj.createImageData(a, b), d.w = a, d.yl = b, d.Bl = d.fj;
        a = d.image.data;
        b = c >> 2;
        var e = 0;
        if ("undefined" !== typeof CanvasPixelArray &&
            a instanceof CanvasPixelArray)
            for (c = a.length; e < c;) {
                var f = G[b];
                a[e] = f & 255;
                a[e + 1] = f >> 8 & 255;
                a[e + 2] = f >> 16 & 255;
                a[e + 3] = 255;
                b++;
                e += 4
            } else if (d.nl !== a && (d.ml = new Int32Array(a.buffer), d.ol = new Uint8Array(a.buffer), d.nl = a), a = d.ml, c = a.length, a.set(G.subarray(b, b + c)), a = d.ol, b = 3, e = b + 4 * c, 0 == c % 8)
                for (; b < e;) a[b] = 255, b = b + 4 | 0, a[b] = 255, b = b + 4 | 0, a[b] = 255, b = b + 4 | 0, a[b] = 255, b = b + 4 | 0, a[b] = 255, b = b + 4 | 0, a[b] = 255, b = b + 4 | 0, a[b] = 255, b = b + 4 | 0, a[b] = 255, b = b + 4 | 0;
            else
                for (; b < e;) a[b] = 255, b = b + 4 | 0;
        d.fj.putImageData(d.image, 0, 0);
        return 0
    },
    1476271: function (a, b, c, d, e) {
        var f = document.createElement("canvas");
        f.width = a;
        f.height = b;
        var g = f.getContext("2d");
        a = g.createImageData(a, b);
        b = a.data;
        e >>= 2;
        var l = 0,
            n;
        if ("undefined" !== typeof CanvasPixelArray && b instanceof CanvasPixelArray)
            for (n = b.length; l < n;) {
                var q = G[e];
                b[l] = q & 255;
                b[l + 1] = q >> 8 & 255;
                b[l + 2] = q >> 16 & 255;
                b[l + 3] = q >> 24 & 255;
                e++;
                l += 4
            } else b = new Int32Array(b.buffer), n = b.length, b.set(G.subarray(e, e + n));
        g.putImageData(a, 0, 0);
        c = 0 === c && 0 === d ? "url(" + f.toDataURL() + "), auto" : "url(" + f.toDataURL() + ") " + c +
            " " + d + ", auto";
        d = m(c.length + 1);
        u(c, d, c.length + 1);
        return d
    },
    1477260: function (a) {
        h.canvas && (h.canvas.style.cursor = x(a));
        return 0
    },
    1477353: function () {
        h.canvas && (h.canvas.style.cursor = "none")
    },
    1477422: function () {
        return window.innerWidth
    },
    1477452: function () {
        return window.innerHeight
    }
};

function Tb(a, b, c) {
    a.addEventListener(b, c, {
        once: !0
    })
}

function Qb(a) {
    var b;
    b || (b = [document, document.getElementById("canvas")]);
    ["keydown", "mousedown", "touchstart"].forEach(function (c) {
        b.forEach(function (d) {
            d && Tb(d, c, function () {
                "suspended" === a.state && a.resume()
            })
        })
    })
}

function Ub(a) {
    for (; 0 < a.length;) {
        var b = a.shift();
        if ("function" == typeof b) b(h);
        else {
            var c = b.vl;
            "number" == typeof c ? void 0 === b.Rj ? P(c)() : P(c)(b.Rj) : c(void 0 === b.Rj ? null : b.Rj)
        }
    }
}

function Vb(a) {
    var b = mb();
    a = a();
    nb(b);
    return a
}
var Wb = [];

function P(a) {
    var b = Wb[a];
    b || (a >= Wb.length && (Wb.length = a + 1), Wb[a] = b = vb.get(a));
    return b
}

function Rb(a, b, c) {
    a.includes("j") ? (a = h["dynCall_" + a], b = c && c.length ? a.apply(null, [b].concat(c)) : a.call(null, b)) : b = P(b).apply(null, c);
    return b
}

function Xb(a) {
    a instanceof Wa || "unwind" == a || La(1, a)
}
var Yb = (a, b) => {
        for (var c = 0, d = a.length - 1; 0 <= d; d--) {
            var e = a[d];
            "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--)
        }
        if (b)
            for (; c; c--) a.unshift("..");
        return a
    },
    za = a => {
        var b = "/" === a.charAt(0),
            c = "/" === a.substr(-1);
        (a = Yb(a.split("/").filter(d => !!d), !b).join("/")) || b || (a = ".");
        a && c && (a += "/");
        return (b ? "/" : "") + a
    },
    Zb = a => {
        var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
        a = b[0];
        b = b[1];
        if (!a && !b) return ".";
        b && (b = b.substr(0, b.length - 1));
        return a + b
    },
    $b = a => {
        if ("/" === a) return "/";
        a = za(a);
        a = a.replace(/\/$/, "");
        var b = a.lastIndexOf("/");
        return -1 === b ? a : a.substr(b + 1)
    };

function ac() {
    if ("object" == typeof crypto && "function" == typeof crypto.getRandomValues) {
        var a = new Uint8Array(1);
        return function () {
            crypto.getRandomValues(a);
            return a[0]
        }
    }
    if (Oa) try {
        var b = require("crypto");
        return function () {
            return b.randomBytes(1)[0]
        }
    } catch (c) {}
    return function () {
        cb("randomDevice")
    }
}

function bc() {
    for (var a = "", b = !1, c = arguments.length - 1; - 1 <= c && !b; c--) {
        b = 0 <= c ? arguments[c] : cc;
        if ("string" != typeof b) throw new TypeError("Arguments to path.resolve must be strings");
        if (!b) return "";
        a = b + "/" + a;
        b = "/" === b.charAt(0)
    }
    a = Yb(a.split("/").filter(d => !!d), !b).join("/");
    return (b ? "/" : "") + a || "."
}
var dc = (a, b) => {
        function c(g) {
            for (var l = 0; l < g.length && "" === g[l]; l++);
            for (var n = g.length - 1; 0 <= n && "" === g[n]; n--);
            return l > n ? [] : g.slice(l, n - l + 1)
        }
        a = bc(a).substr(1);
        b = bc(b).substr(1);
        a = c(a.split("/"));
        b = c(b.split("/"));
        for (var d = Math.min(a.length, b.length), e = d, f = 0; f < d; f++)
            if (a[f] !== b[f]) {
                e = f;
                break
            } d = [];
        for (f = e; f < a.length; f++) d.push("..");
        d = d.concat(b.slice(e));
        return d.join("/")
    },
    ec = [];

function fc(a, b) {
    ec[a] = {
        input: [],
        output: [],
        Ij: b
    };
    gc(a, hc)
}
var hc = {
        open: function (a) {
            var b = ec[a.node.rdev];
            if (!b) throw new Q(43);
            a.tty = b;
            a.seekable = !1
        },
        close: function (a) {
            a.tty.Ij.flush(a.tty)
        },
        flush: function (a) {
            a.tty.Ij.flush(a.tty)
        },
        read: function (a, b, c, d) {
            if (!a.tty || !a.tty.Ij.Rk) throw new Q(60);
            for (var e = 0, f = 0; f < d; f++) {
                try {
                    var g = a.tty.Ij.Rk(a.tty)
                } catch (l) {
                    throw new Q(29);
                }
                if (void 0 === g && 0 === e) throw new Q(6);
                if (null === g || void 0 === g) break;
                e++;
                b[c + f] = g
            }
            e && (a.node.timestamp = Date.now());
            return e
        },
        write: function (a, b, c, d) {
            if (!a.tty || !a.tty.Ij.tk) throw new Q(60);
            try {
                for (var e = 0; e < d; e++) a.tty.Ij.tk(a.tty, b[c + e])
            } catch (f) {
                throw new Q(29);
            }
            d && (a.node.timestamp = Date.now());
            return e
        }
    },
    jc = {
        Rk: function (a) {
            if (!a.input.length) {
                var b = null;
                if (Oa) {
                    var c = Buffer.alloc(256),
                        d = 0;
                    try {
                        d = fs.readSync(process.stdin.fd, c, 0, 256, -1)
                    } catch (e) {
                        if (e.toString().includes("EOF")) d = 0;
                        else throw e;
                    }
                    0 < d ? b = c.slice(0, d).toString("utf-8") : b = null
                } else "undefined" != typeof window && "function" == typeof window.prompt ? (b = window.prompt("Input: "), null !== b && (b += "\n")) : "function" == typeof readline && (b =
                    readline(), null !== b && (b += "\n"));
                if (!b) return null;
                a.input = ic(b, !0)
            }
            return a.input.shift()
        },
        tk: function (a, b) {
            null === b || 10 === b ? (Xa(pb(a.output, 0)), a.output = []) : 0 != b && a.output.push(b)
        },
        flush: function (a) {
            a.output && 0 < a.output.length && (Xa(pb(a.output, 0)), a.output = [])
        }
    },
    kc = {
        tk: function (a, b) {
            null === b || 10 === b ? (k(pb(a.output, 0)), a.output = []) : 0 != b && a.output.push(b)
        },
        flush: function (a) {
            a.output && 0 < a.output.length && (k(pb(a.output, 0)), a.output = [])
        }
    },
    B = {
        hj: null,
        Si: function () {
            return B.createNode(null, "/", 16895, 0)
        },
        createNode: function (a, b, c, d) {
            if (24576 === (c & 61440) || 4096 === (c & 61440)) throw new Q(63);
            B.hj || (B.hj = {
                dir: {
                    node: {
                        gj: B.Li.gj,
                        Yi: B.Li.Yi,
                        lookup: B.Li.lookup,
                        Vj: B.Li.Vj,
                        rename: B.Li.rename,
                        unlink: B.Li.unlink,
                        rmdir: B.Li.rmdir,
                        readdir: B.Li.readdir,
                        symlink: B.Li.symlink
                    },
                    stream: {
                        Bj: B.Ni.Bj
                    }
                },
                file: {
                    node: {
                        gj: B.Li.gj,
                        Yi: B.Li.Yi
                    },
                    stream: {
                        Bj: B.Ni.Bj,
                        read: B.Ni.read,
                        write: B.Ni.write,
                        Gk: B.Ni.Gk,
                        Xk: B.Ni.Xk,
                        Zk: B.Ni.Zk
                    }
                },
                link: {
                    node: {
                        gj: B.Li.gj,
                        Yi: B.Li.Yi,
                        readlink: B.Li.readlink
                    },
                    stream: {}
                },
                Lk: {
                    node: {
                        gj: B.Li.gj,
                        Yi: B.Li.Yi
                    },
                    stream: lc
                }
            });
            c = mc(a, b, c, d);
            16384 === (c.mode & 61440) ? (c.Li = B.hj.dir.node, c.Ni = B.hj.dir.stream, c.Mi = {}) : 32768 === (c.mode & 61440) ? (c.Li = B.hj.file.node, c.Ni = B.hj.file.stream, c.Oi = 0, c.Mi = null) : 40960 === (c.mode & 61440) ? (c.Li = B.hj.link.node, c.Ni = B.hj.link.stream) : 8192 === (c.mode & 61440) && (c.Li = B.hj.Lk.node, c.Ni = B.hj.Lk.stream);
            c.timestamp = Date.now();
            a && (a.Mi[b] = c, a.timestamp = c.timestamp);
            return c
        },
        Qk: function (a) {
            return a.Mi ? a.Mi.subarray ? a.Mi.subarray(0, a.Oi) : new Uint8Array(a.Mi) : new Uint8Array(0)
        },
        Ok: function (a,
            b) {
            var c = a.Mi ? a.Mi.length : 0;
            c >= b || (b = Math.max(b, c * (1048576 > c ? 2 : 1.125) >>> 0), 0 != c && (b = Math.max(b, 256)), c = a.Mi, a.Mi = new Uint8Array(b), 0 < a.Oi && a.Mi.set(c.subarray(0, a.Oi), 0))
        },
        Kl: function (a, b) {
            if (a.Oi != b)
                if (0 == b) a.Mi = null, a.Oi = 0;
                else {
                    var c = a.Mi;
                    a.Mi = new Uint8Array(b);
                    c && a.Mi.set(c.subarray(0, Math.min(b, a.Oi)));
                    a.Oi = b
                }
        },
        Li: {
            gj: function (a) {
                var b = {};
                b.dev = 8192 === (a.mode & 61440) ? a.id : 1;
                b.ino = a.id;
                b.mode = a.mode;
                b.nlink = 1;
                b.uid = 0;
                b.gid = 0;
                b.rdev = a.rdev;
                16384 === (a.mode & 61440) ? b.size = 4096 : 32768 === (a.mode & 61440) ?
                    b.size = a.Oi : 40960 === (a.mode & 61440) ? b.size = a.link.length : b.size = 0;
                b.atime = new Date(a.timestamp);
                b.mtime = new Date(a.timestamp);
                b.ctime = new Date(a.timestamp);
                b.jl = 4096;
                b.blocks = Math.ceil(b.size / b.jl);
                return b
            },
            Yi: function (a, b) {
                void 0 !== b.mode && (a.mode = b.mode);
                void 0 !== b.timestamp && (a.timestamp = b.timestamp);
                void 0 !== b.size && B.Kl(a, b.size)
            },
            lookup: function () {
                throw nc[44];
            },
            Vj: function (a, b, c, d) {
                return B.createNode(a, b, c, d)
            },
            rename: function (a, b, c) {
                if (16384 === (a.mode & 61440)) {
                    try {
                        var d = oc(b, c)
                    } catch (f) {}
                    if (d)
                        for (var e in d.Mi) throw new Q(55);
                }
                delete a.parent.Mi[a.name];
                a.parent.timestamp = Date.now();
                a.name = c;
                b.Mi[c] = a;
                b.timestamp = a.parent.timestamp;
                a.parent = b
            },
            unlink: function (a, b) {
                delete a.Mi[b];
                a.timestamp = Date.now()
            },
            rmdir: function (a, b) {
                var c = oc(a, b),
                    d;
                for (d in c.Mi) throw new Q(55);
                delete a.Mi[b];
                a.timestamp = Date.now()
            },
            readdir: function (a) {
                var b = [".", ".."],
                    c;
                for (c in a.Mi) a.Mi.hasOwnProperty(c) && b.push(c);
                return b
            },
            symlink: function (a, b, c) {
                a = B.createNode(a, b, 41471, 0);
                a.link = c;
                return a
            },
            readlink: function (a) {
                if (40960 !== (a.mode & 61440)) throw new Q(28);
                return a.link
            }
        },
        Ni: {
            read: function (a, b, c, d, e) {
                var f = a.node.Mi;
                if (e >= a.node.Oi) return 0;
                a = Math.min(a.node.Oi - e, d);
                if (8 < a && f.subarray) b.set(f.subarray(e, e + a), c);
                else
                    for (d = 0; d < a; d++) b[c + d] = f[e + d];
                return a
            },
            write: function (a, b, c, d, e, f) {
                b.buffer === E.buffer && (f = !1);
                if (!d) return 0;
                a = a.node;
                a.timestamp = Date.now();
                if (b.subarray && (!a.Mi || a.Mi.subarray)) {
                    if (f) return a.Mi = b.subarray(c, c + d), a.Oi = d;
                    if (0 === a.Oi && 0 === e) return a.Mi = b.slice(c, c + d), a.Oi = d;
                    if (e + d <= a.Oi) return a.Mi.set(b.subarray(c, c + d), e), d
                }
                B.Ok(a, e +
                    d);
                if (a.Mi.subarray && b.subarray) a.Mi.set(b.subarray(c, c + d), e);
                else
                    for (f = 0; f < d; f++) a.Mi[e + f] = b[c + f];
                a.Oi = Math.max(a.Oi, e + d);
                return d
            },
            Bj: function (a, b, c) {
                1 === c ? b += a.position : 2 === c && 32768 === (a.node.mode & 61440) && (b += a.node.Oi);
                if (0 > b) throw new Q(28);
                return b
            },
            Gk: function (a, b, c) {
                B.Ok(a.node, b + c);
                a.node.Oi = Math.max(a.node.Oi, b + c)
            },
            Xk: function (a, b, c, d, e, f) {
                if (0 !== b) throw new Q(28);
                if (32768 !== (a.node.mode & 61440)) throw new Q(43);
                a = a.node.Mi;
                if (f & 2 || a.buffer !== tb) {
                    if (0 < d || d + c < a.length) a.subarray ? a = a.subarray(d,
                        d + c) : a = Array.prototype.slice.call(a, d, d + c);
                    d = !0;
                    cb();
                    c = void 0;
                    if (!c) throw new Q(48);
                    E.set(a, c)
                } else d = !1, c = a.byteOffset;
                return {
                    Jj: c,
                    Yl: d
                }
            },
            Zk: function (a, b, c, d, e) {
                if (32768 !== (a.node.mode & 61440)) throw new Q(43);
                if (e & 2) return 0;
                B.Ni.write(a, b, 0, d, c, !1);
                return 0
            }
        }
    };

function pc(a, b, c) {
    var d = "al " + a;
    Ra(a, function (e) {
        e || cb('Loading data file "' + a + '" failed (no arrayBuffer).');
        b(new Uint8Array(e));
        d && Hb(d)
    }, function () {
        if (c) c();
        else throw 'Loading data file "' + a + '" failed.';
    });
    d && Gb(d)
}
var O = {
        pj: {},
        indexedDB: () => {
            if ("undefined" != typeof indexedDB) return indexedDB;
            var a = null;
            "object" == typeof window && (a = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB);
            a || cb("IDBFS used, but indexedDB not supported");
            return a
        },
        el: 21,
        tj: "FILE_DATA",
        Si: function (a) {
            return B.Si.apply(null, arguments)
        },
        Bk: (a, b, c) => {
            O.mk(a, (d, e) => {
                if (d) return c(d);
                O.nk(a, (f, g) => {
                    if (f) return c(f);
                    O.uk(b ? g : e, b ? e : g, c)
                })
            })
        },
        Il: () => {
            Object.values(O.pj).forEach(a => a.close());
            O.pj = {}
        },
        wl: (a, b) => {
            var c = O.pj[a];
            if (c) return b(null, c);
            try {
                var d = O.indexedDB().open(a, O.el)
            } catch (e) {
                return b(e)
            }
            if (!d) return b("Unable to connect to IndexedDB");
            d.onupgradeneeded = e => {
                var f = e.target.result;
                e = e.target.transaction;
                var g;
                f.objectStoreNames.contains(O.tj) ? g = e.objectStore(O.tj) : g = f.createObjectStore(O.tj);
                g.indexNames.contains("timestamp") || g.createIndex("timestamp", "timestamp", {
                    unique: !1
                })
            };
            d.onsuccess = () => {
                c = d.result;
                O.pj[a] = c;
                b(null, c)
            };
            d.onerror = e => {
                b(this.error);
                e.preventDefault()
            }
        },
        mk: (a, b) => {
            function c(l) {
                return "." !==
                    l && ".." !== l
            }

            function d(l) {
                return n => za(l + "/" + n)
            }
            var e = {};
            for (a = Aa(a.rj).filter(c).map(d(a.rj)); a.length;) {
                var f = a.pop();
                try {
                    var g = Ba(f)
                } catch (l) {
                    return b(l)
                }
                16384 === (g.mode & 61440) && a.push.apply(a, Aa(f).filter(c).map(d(f)));
                e[f] = {
                    timestamp: g.mtime
                }
            }
            return b(null, {
                type: "local",
                entries: e
            })
        },
        nk: (a, b) => {
            var c = {};
            O.wl(a.rj, (d, e) => {
                if (d) return b(d);
                try {
                    var f = e.transaction([O.tj], "readonly");
                    f.onerror = g => {
                        b(this.error);
                        g.preventDefault()
                    };
                    f.objectStore(O.tj).index("timestamp").openKeyCursor().onsuccess = g => {
                        g = g.target.result;
                        if (!g) return b(null, {
                            type: "remote",
                            db: e,
                            entries: c
                        });
                        c[g.primaryKey] = {
                            timestamp: g.key
                        };
                        g.continue()
                    }
                } catch (g) {
                    return b(g)
                }
            })
        },
        qk: (a, b) => {
            try {
                var c = D(a).node;
                var d = Ba(a)
            } catch (e) {
                return b(e)
            }
            return 16384 === (d.mode & 61440) ? b(null, {
                timestamp: d.mtime,
                mode: d.mode
            }) : 32768 === (d.mode & 61440) ? (c.Mi = B.Qk(c), b(null, {
                timestamp: d.mtime,
                mode: d.mode,
                contents: c.Mi
            })) : b(Error("node type not supported"))
        },
        zk: (a, b, c) => {
            try {
                if (16384 === (b.mode & 61440)) Ca(a, b.mode);
                else if (32768 === (b.mode & 61440)) Da(a, b.contents);
                else return c(Error("node type not supported"));
                Ea(a, b.mode);
                Fa(a, b.timestamp, b.timestamp)
            } catch (d) {
                return c(d)
            }
            c(null)
        },
        wk: (a, b) => {
            try {
                D(a);
                var c = Ba(a);
                16384 === (c.mode & 61440) ? Ga(a) : 32768 === (c.mode & 61440) && Ha(a)
            } catch (d) {
                return b(d)
            }
            b(null)
        },
        rk: (a, b, c) => {
            a = a.get(b);
            a.onsuccess = d => {
                c(null, d.target.result)
            };
            a.onerror = d => {
                c(this.error);
                d.preventDefault()
            }
        },
        Ak: (a, b, c, d) => {
            try {
                var e = a.put(c, b)
            } catch (f) {
                d(f);
                return
            }
            e.onsuccess = () => {
                d(null)
            };
            e.onerror = f => {
                d(this.error);
                f.preventDefault()
            }
        },
        xk: (a, b, c) => {
            a =
                a.delete(b);
            a.onsuccess = () => {
                c(null)
            };
            a.onerror = d => {
                c(this.error);
                d.preventDefault()
            }
        },
        uk: (a, b, c) => {
            function d(p) {
                if (p && !l) return l = !0, c(p)
            }
            var e = 0,
                f = [];
            Object.keys(a.entries).forEach(function (p) {
                var t = a.entries[p],
                    v = b.entries[p];
                v && t.timestamp.getTime() == v.timestamp.getTime() || (f.push(p), e++)
            });
            var g = [];
            Object.keys(b.entries).forEach(function (p) {
                a.entries[p] || (g.push(p), e++)
            });
            if (!e) return c(null);
            var l = !1,
                n = ("remote" === a.type ? a.db : b.db).transaction([O.tj], "readwrite"),
                q = n.objectStore(O.tj);
            n.onerror =
                p => {
                    d(this.error);
                    p.preventDefault()
                };
            n.oncomplete = () => {
                l || c(null)
            };
            f.sort().forEach(p => {
                "local" === b.type ? O.rk(q, p, (t, v) => {
                    if (t) return d(t);
                    O.zk(p, v, d)
                }) : O.qk(p, (t, v) => {
                    if (t) return d(t);
                    O.Ak(q, p, v, d)
                })
            });
            g.sort().reverse().forEach(p => {
                "local" === b.type ? O.wk(p, d) : O.xk(q, p, d)
            })
        }
    },
    qc = null,
    rc = {},
    sc = [],
    tc = 1,
    uc = null,
    cc = "/",
    vc = !0,
    Q = null,
    nc = {},
    wc = 0,
    D = (a, b = {}) => {
        a = bc(cc, a);
        if (!a) return {
            path: "",
            node: null
        };
        b = Object.assign({
            Pk: !0,
            vk: 0
        }, b);
        if (8 < b.vk) throw new Q(32);
        a = Yb(a.split("/").filter(g => !!g), !1);
        for (var c =
                qc, d = "/", e = 0; e < a.length; e++) {
            var f = e === a.length - 1;
            if (f && b.parent) break;
            c = oc(c, a[e]);
            d = za(d + "/" + a[e]);
            c.qj && (!f || f && b.Pk) && (c = c.qj.root);
            if (!f || b.zj)
                for (f = 0; 40960 === (c.mode & 61440);)
                    if (c = xc(d), d = bc(Zb(d), c), c = D(d, {
                            vk: b.vk + 1
                        }).node, 40 < f++) throw new Q(32);
        }
        return {
            path: d,
            node: c
        }
    },
    yc = a => {
        for (var b;;) {
            if (a === a.parent) return a = a.Si.rj, b ? "/" !== a[a.length - 1] ? a + "/" + b : a + b : a;
            b = b ? a.name + "/" + b : a.name;
            a = a.parent
        }
    },
    zc = (a, b) => {
        for (var c = 0, d = 0; d < b.length; d++) c = (c << 5) - c + b.charCodeAt(d) | 0;
        return (a + c >>> 0) % uc.length
    },
    Ac =
    a => {
        var b = zc(a.parent.id, a.name);
        a.Hj = uc[b];
        uc[b] = a
    },
    Bc = a => {
        var b = zc(a.parent.id, a.name);
        if (uc[b] === a) uc[b] = a.Hj;
        else
            for (b = uc[b]; b;) {
                if (b.Hj === a) {
                    b.Hj = a.Hj;
                    break
                }
                b = b.Hj
            }
    },
    oc = (a, b) => {
        var c;
        if (c = (c = Cc(a, "x")) ? c : a.Li.lookup ? 0 : 2) throw new Q(c, a);
        for (c = uc[zc(a.id, b)]; c; c = c.Hj) {
            var d = c.name;
            if (c.parent.id === a.id && d === b) return c
        }
        return a.Li.lookup(a, b)
    },
    mc = (a, b, c, d) => {
        a = new Dc(a, b, c, d);
        Ac(a);
        return a
    },
    Ec = {
        r: 0,
        "r+": 2,
        w: 577,
        "w+": 578,
        a: 1089,
        "a+": 1090
    },
    Fc = a => {
        var b = ["r", "w", "rw"][a & 3];
        a & 512 && (b += "w");
        return b
    },
    Cc = (a, b) => {
        if (vc) return 0;
        if (!b.includes("r") || a.mode & 292) {
            if (b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73)) return 2
        } else return 2;
        return 0
    },
    Gc = (a, b) => {
        try {
            return oc(a, b), 20
        } catch (c) {}
        return Cc(a, "wx")
    },
    Hc = (a, b, c) => {
        try {
            var d = oc(a, b)
        } catch (e) {
            return e.Pi
        }
        if (a = Cc(a, "wx")) return a;
        if (c) {
            if (16384 !== (d.mode & 61440)) return 54;
            if (d === d.parent || yc(d) === cc) return 10
        } else if (16384 === (d.mode & 61440)) return 31;
        return 0
    },
    Ic = (a = 0) => {
        for (; 4096 >= a; a++)
            if (!sc[a]) return a;
        throw new Q(33);
    },
    Kc = (a, b) => {
        Jc || (Jc = function () {
            this.Zj = {}
        }, Jc.prototype = {
            flags: {
                get: function () {
                    return this.Zj.flags
                },
                set: function (c) {
                    this.Zj.flags = c
                }
            },
            position: {
                get fm() {
                    return this.Zj.position
                },
                set: function (c) {
                    this.Zj.position = c
                }
            }
        });
        a = Object.assign(new Jc, a);
        b = Ic(b);
        a.fd = b;
        return sc[b] = a
    },
    lc = {
        open: a => {
            a.Ni = rc[a.node.rdev].Ni;
            a.Ni.open && a.Ni.open(a)
        },
        Bj: () => {
            throw new Q(70);
        }
    },
    gc = (a, b) => {
        rc[a] = {
            Ni: b
        }
    },
    Lc = () => {
        for (var a = [], b = [qc.Si]; b.length;) {
            var c = b.pop();
            a.push(c);
            b.push.apply(b, c.Yk)
        }
        return a
    },
    Pb = (a, b) => {
        function c(g) {
            wc--;
            return b(g)
        }

        function d(g) {
            if (g) {
                if (!d.rl) return d.rl = !0, c(g)
            } else ++f >= e.length && c(null)
        }
        "function" == typeof a && (b = a, a = !1);
        wc++;
        1 < wc && k("warning: " + wc + " FS.syncfs operations in flight at once, probably just doing extra work");
        var e = Lc(),
            f = 0;
        e.forEach(g => {
            if (!g.type.Bk) return d(null);
            g.type.Bk(g, a, d)
        })
    },
    Ob = (a, b) => {
        var c = "/" === b,
            d = !b;
        if (c && qc) throw new Q(10);
        if (!c && !d) {
            var e = D(b, {
                Pk: !1
            });
            b = e.path;
            e = e.node;
            if (e.qj) throw new Q(10);
            if (16384 !== (e.mode & 61440)) throw new Q(54);
        }
        b = {
            type: a,
            km: {},
            rj: b,
            Yk: []
        };
        a =
            a.Si(b);
        a.Si = b;
        b.root = a;
        c ? qc = a : e && (e.qj = b, e.Si && e.Si.Yk.push(b))
    },
    Mc = (a, b, c) => {
        var d = D(a, {
            parent: !0
        }).node;
        a = $b(a);
        if (!a || "." === a || ".." === a) throw new Q(28);
        var e = Gc(d, a);
        if (e) throw new Q(e);
        if (!d.Li.Vj) throw new Q(63);
        return d.Li.Vj(d, a, b, c)
    },
    Nb = (a, b) => Mc(a, (void 0 !== b ? b : 511) & 1023 | 16384, 0),
    Ca = (a, b) => {
        a = a.split("/");
        for (var c = "", d = 0; d < a.length; ++d)
            if (a[d]) {
                c += "/" + a[d];
                try {
                    Nb(c, b)
                } catch (e) {
                    if (20 != e.Pi) throw e;
                }
            }
    },
    Nc = (a, b, c) => {
        "undefined" == typeof c && (c = b, b = 438);
        return Mc(a, b | 8192, c)
    },
    Oc = (a, b) => {
        if (!bc(a)) throw new Q(44);
        var c = D(b, {
            parent: !0
        }).node;
        if (!c) throw new Q(44);
        b = $b(b);
        var d = Gc(c, b);
        if (d) throw new Q(d);
        if (!c.Li.symlink) throw new Q(63);
        c.Li.symlink(c, b, a)
    },
    Ga = a => {
        var b = D(a, {
            parent: !0
        }).node;
        a = $b(a);
        var c = oc(b, a),
            d = Hc(b, a, !0);
        if (d) throw new Q(d);
        if (!b.Li.rmdir) throw new Q(63);
        if (c.qj) throw new Q(10);
        b.Li.rmdir(b, a);
        Bc(c)
    },
    Aa = a => {
        a = D(a, {
            zj: !0
        }).node;
        if (!a.Li.readdir) throw new Q(54);
        return a.Li.readdir(a)
    },
    Ha = a => {
        var b = D(a, {
            parent: !0
        }).node;
        if (!b) throw new Q(44);
        a = $b(a);
        var c = oc(b, a),
            d = Hc(b, a, !1);
        if (d) throw new Q(d);
        if (!b.Li.unlink) throw new Q(63);
        if (c.qj) throw new Q(10);
        b.Li.unlink(b, a);
        Bc(c)
    },
    xc = a => {
        a = D(a).node;
        if (!a) throw new Q(44);
        if (!a.Li.readlink) throw new Q(28);
        return bc(yc(a.parent), a.Li.readlink(a))
    },
    Ba = (a, b) => {
        a = D(a, {
            zj: !b
        }).node;
        if (!a) throw new Q(44);
        if (!a.Li.gj) throw new Q(63);
        return a.Li.gj(a)
    },
    Pc = a => Ba(a, !0),
    Ea = (a, b) => {
        a = "string" == typeof a ? D(a, {
            zj: !0
        }).node : a;
        if (!a.Li.Yi) throw new Q(63);
        a.Li.Yi(a, {
            mode: b & 4095 | a.mode & -4096,
            timestamp: Date.now()
        })
    },
    Fa = (a, b, c) => {
        a = D(a, {
            zj: !0
        }).node;
        a.Li.Yi(a, {
            timestamp: Math.max(b,
                c)
        })
    },
    Rc = (a, b, c) => {
        if ("" === a) throw new Q(44);
        if ("string" == typeof b) {
            var d = Ec[b];
            if ("undefined" == typeof d) throw Error("Unknown file open mode: " + b);
            b = d
        }
        c = b & 64 ? ("undefined" == typeof c ? 438 : c) & 4095 | 32768 : 0;
        if ("object" == typeof a) var e = a;
        else {
            a = za(a);
            try {
                e = D(a, {
                    zj: !(b & 131072)
                }).node
            } catch (f) {}
        }
        d = !1;
        if (b & 64)
            if (e) {
                if (b & 128) throw new Q(20);
            } else e = Mc(a, c, 0), d = !0;
        if (!e) throw new Q(44);
        8192 === (e.mode & 61440) && (b &= -513);
        if (b & 65536 && 16384 !== (e.mode & 61440)) throw new Q(54);
        if (!d && (c = e ? 40960 === (e.mode & 61440) ? 32 : 16384 ===
                (e.mode & 61440) && ("r" !== Fc(b) || b & 512) ? 31 : Cc(e, Fc(b)) : 44)) throw new Q(c);
        if (b & 512) {
            c = e;
            c = "string" == typeof c ? D(c, {
                zj: !0
            }).node : c;
            if (!c.Li.Yi) throw new Q(63);
            if (16384 === (c.mode & 61440)) throw new Q(31);
            if (32768 !== (c.mode & 61440)) throw new Q(28);
            if (d = Cc(c, "w")) throw new Q(d);
            c.Li.Yi(c, {
                size: 0,
                timestamp: Date.now()
            })
        }
        b &= -131713;
        e = Kc({
            node: e,
            path: yc(e),
            flags: b,
            seekable: !0,
            position: 0,
            Ni: e.Ni,
            Rl: [],
            error: !1
        });
        e.Ni.open && e.Ni.open(e);
        !h.logReadFiles || b & 1 || (Qc || (Qc = {}), a in Qc || (Qc[a] = 1));
        return e
    },
    Sc = a => {
        if (null ===
            a.fd) throw new Q(8);
        a.Aj && (a.Aj = null);
        try {
            a.Ni.close && a.Ni.close(a)
        } catch (b) {
            throw b;
        } finally {
            sc[a.fd] = null
        }
        a.fd = null
    },
    Tc = (a, b, c) => {
        if (null === a.fd) throw new Q(8);
        if (!a.seekable || !a.Ni.Bj) throw new Q(70);
        if (0 != c && 1 != c && 2 != c) throw new Q(28);
        a.position = a.Ni.Bj(a, b, c);
        a.Rl = [];
        return a.position
    },
    Uc = (a, b, c, d, e, f) => {
        if (0 > d || 0 > e) throw new Q(28);
        if (null === a.fd) throw new Q(8);
        if (0 === (a.flags & 2097155)) throw new Q(8);
        if (16384 === (a.node.mode & 61440)) throw new Q(31);
        if (!a.Ni.write) throw new Q(28);
        a.seekable && a.flags &
            1024 && Tc(a, 0, 2);
        var g = "undefined" != typeof e;
        if (!g) e = a.position;
        else if (!a.seekable) throw new Q(70);
        b = a.Ni.write(a, b, c, d, e, f);
        g || (a.position += b);
        return b
    },
    Da = (a, b) => {
        var c = {
            Jk: !0
        };
        c.flags = c.flags || 577;
        a = Rc(a, c.flags, c.mode);
        if ("string" == typeof b) {
            var d = new Uint8Array(aa(b) + 1);
            b = qb(b, d, 0, d.length);
            Uc(a, d, 0, b, void 0, c.Jk)
        } else if (ArrayBuffer.isView(b)) Uc(a, b, 0, b.byteLength, void 0, c.Jk);
        else throw Error("Unsupported data type");
        Sc(a)
    },
    Vc = () => {
        Q || (Q = function (a, b) {
            this.node = b;
            this.Ll = function (c) {
                this.Pi =
                    c
            };
            this.Ll(a);
            this.message = "FS error"
        }, Q.prototype = Error(), Q.prototype.constructor = Q, [44].forEach(a => {
            nc[a] = new Q(a);
            nc[a].stack = "<generic error, no stack>"
        }))
    },
    Wc, Xc = (a, b) => {
        var c = 0;
        a && (c |= 365);
        b && (c |= 146);
        return c
    },
    Yc = (a, b) => {
        a = "string" == typeof a ? a : yc(a);
        for (b = b.split("/").reverse(); b.length;) {
            var c = b.pop();
            if (c) {
                var d = za(a + "/" + c);
                try {
                    Nb(d)
                } catch (e) {}
                a = d
            }
        }
        return d
    },
    Zc = (a, b, c, d) => {
        a = za(("string" == typeof a ? a : yc(a)) + "/" + b);
        c = Xc(c, d);
        return Mc(a, (void 0 !== c ? c : 438) & 4095 | 32768, 0)
    },
    $c = (a, b, c, d, e, f) => {
        var g =
            b;
        a && (a = "string" == typeof a ? a : yc(a), g = b ? za(a + "/" + b) : a);
        a = Xc(d, e);
        g = Mc(g, (void 0 !== a ? a : 438) & 4095 | 32768, 0);
        if (c) {
            if ("string" == typeof c) {
                b = Array(c.length);
                d = 0;
                for (e = c.length; d < e; ++d) b[d] = c.charCodeAt(d);
                c = b
            }
            Ea(g, a | 146);
            b = Rc(g, 577);
            Uc(b, c, 0, c.length, 0, f);
            Sc(b);
            Ea(g, a)
        }
        return g
    },
    ad = (a, b, c, d) => {
        a = za(("string" == typeof a ? a : yc(a)) + "/" + b);
        b = Xc(!!c, !!d);
        ad.Vk || (ad.Vk = 64);
        var e = ad.Vk++ << 8 | 0;
        gc(e, {
            open: f => {
                f.seekable = !1
            },
            close: () => {
                d && d.buffer && d.buffer.length && d(10)
            },
            read: (f, g, l, n) => {
                for (var q = 0, p = 0; p < n; p++) {
                    try {
                        var t =
                            c()
                    } catch (v) {
                        throw new Q(29);
                    }
                    if (void 0 === t && 0 === q) throw new Q(6);
                    if (null === t || void 0 === t) break;
                    q++;
                    g[l + p] = t
                }
                q && (f.node.timestamp = Date.now());
                return q
            },
            write: (f, g, l, n) => {
                for (var q = 0; q < n; q++) try {
                    d(g[l + q])
                } catch (p) {
                    throw new Q(29);
                }
                n && (f.node.timestamp = Date.now());
                return q
            }
        });
        return Nc(a, b, e)
    },
    bd = a => {
        if (!(a.El || a.Fl || a.link || a.Mi)) {
            if ("undefined" != typeof XMLHttpRequest) throw Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
            if (Qa) try {
                a.Mi = ic(Qa(a.url), !0), a.Oi = a.Mi.length
            } catch (b) {
                throw new Q(29);
            } else throw Error("Cannot load without read() or XMLHttpRequest.");
        }
    },
    cd = (a, b, c, d, e) => {
        function f() {
            this.pk = !1;
            this.oj = []
        }
        f.prototype.get = function (p) {
            if (!(p > this.length - 1 || 0 > p)) {
                var t = p % this.chunkSize;
                return this.Sk(p / this.chunkSize | 0)[t]
            }
        };
        f.prototype.Ki = function (p) {
            this.Sk = p
        };
        f.prototype.Ik = function () {
            var p = new XMLHttpRequest;
            p.open("HEAD", c, !1);
            p.send(null);
            if (!(200 <= p.status && 300 > p.status || 304 === p.status)) throw Error("Couldn't load " +
                c + ". Status: " + p.status);
            var t = Number(p.getResponseHeader("Content-length")),
                v, r = (v = p.getResponseHeader("Accept-Ranges")) && "bytes" === v;
            p = (v = p.getResponseHeader("Content-Encoding")) && "gzip" === v;
            var C = 1048576;
            r || (C = t);
            var y = this;
            y.Ki(F => {
                var J = F * C,
                    M = (F + 1) * C - 1;
                M = Math.min(M, t - 1);
                if ("undefined" == typeof y.oj[F]) {
                    var z = y.oj;
                    if (J > M) throw Error("invalid range (" + J + ", " + M + ") or no bytes requested!");
                    if (M > t - 1) throw Error("only " + t + " bytes available! programmer error!");
                    var L = new XMLHttpRequest;
                    L.open("GET",
                        c, !1);
                    t !== C && L.setRequestHeader("Range", "bytes=" + J + "-" + M);
                    L.responseType = "arraybuffer";
                    L.overrideMimeType && L.overrideMimeType("text/plain; charset=x-user-defined");
                    L.send(null);
                    if (!(200 <= L.status && 300 > L.status || 304 === L.status)) throw Error("Couldn't load " + c + ". Status: " + L.status);
                    J = void 0 !== L.response ? new Uint8Array(L.response || []) : ic(L.responseText || "", !0);
                    z[F] = J
                }
                if ("undefined" == typeof y.oj[F]) throw Error("doXHR failed!");
                return y.oj[F]
            });
            if (p || !t) C = t = 1, C = t = this.Sk(0).length, Xa("LazyFiles on gzip forces download of the whole file when length is accessed");
            this.il = t;
            this.hl = C;
            this.pk = !0
        };
        if ("undefined" != typeof XMLHttpRequest) {
            if (!Na) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var g = new f;
            Object.defineProperties(g, {
                length: {
                    get: function () {
                        this.pk || this.Ik();
                        return this.il
                    }
                },
                chunkSize: {
                    get: function () {
                        this.pk || this.Ik();
                        return this.hl
                    }
                }
            });
            var l = void 0
        } else l = c, g = void 0;
        var n = Zc(a, b, d, e);
        g ? n.Mi = g : l && (n.Mi = null, n.url = l);
        Object.defineProperties(n, {
            Oi: {
                get: function () {
                    return this.Mi.length
                }
            }
        });
        var q = {};
        Object.keys(n.Ni).forEach(p => {
            var t = n.Ni[p];
            q[p] = function () {
                bd(n);
                return t.apply(null, arguments)
            }
        });
        q.read = (p, t, v, r, C) => {
            bd(n);
            p = p.node.Mi;
            if (C >= p.length) return 0;
            r = Math.min(p.length - C, r);
            if (p.slice)
                for (var y = 0; y < r; y++) t[v + y] = p[C + y];
            else
                for (y = 0; y < r; y++) t[v + y] = p.get(C + y);
            return r
        };
        n.Ni = q;
        return n
    },
    ed = (a, b, c, d, e, f, g, l, n, q) => {
        function p(r) {
            function C(y) {
                q && q();
                l || $c(a, b, y, d, e, n);
                f && f();
                Hb(v)
            }
            dd(r, t, C, () => {
                g && g();
                Hb(v)
            }) || C(r)
        }
        var t = b ? bc(za(a + "/" + b)) : a,
            v = "cp " + t;
        Gb(v);
        "string" == typeof c ? pc(c,
            r => p(r), g) : p(c)
    },
    fd = {},
    Jc, Qc;

function gd(a, b, c) {
    if ("/" === b.charAt(0)) return b;
    if (-100 === a) a = cc;
    else {
        a = sc[a];
        if (!a) throw new Q(8);
        a = a.path
    }
    if (0 == b.length) {
        if (!c) throw new Q(44);
        return a
    }
    return za(a + "/" + b)
}

function hd(a, b, c) {
    try {
        var d = a(b)
    } catch (e) {
        if (e && e.node && za(b) !== za(yc(e.node))) return -54;
        throw e;
    }
    G[c >> 2] = d.dev;
    G[c + 4 >> 2] = 0;
    G[c + 8 >> 2] = d.ino;
    G[c + 12 >> 2] = d.mode;
    G[c + 16 >> 2] = d.nlink;
    G[c + 20 >> 2] = d.uid;
    G[c + 24 >> 2] = d.gid;
    G[c + 28 >> 2] = d.rdev;
    G[c + 32 >> 2] = 0;
    fb = [d.size >>> 0, (H = d.size, 1 <= +Math.abs(H) ? 0 < H ? (Math.min(+Math.floor(H / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((H - +(~~H >>> 0)) / 4294967296) >>> 0 : 0)];
    G[c + 40 >> 2] = fb[0];
    G[c + 44 >> 2] = fb[1];
    G[c + 48 >> 2] = 4096;
    G[c + 52 >> 2] = d.blocks;
    G[c + 56 >> 2] = d.atime.getTime() / 1E3 | 0;
    G[c + 60 >>
        2] = 0;
    G[c + 64 >> 2] = d.mtime.getTime() / 1E3 | 0;
    G[c + 68 >> 2] = 0;
    G[c + 72 >> 2] = d.ctime.getTime() / 1E3 | 0;
    G[c + 76 >> 2] = 0;
    fb = [d.ino >>> 0, (H = d.ino, 1 <= +Math.abs(H) ? 0 < H ? (Math.min(+Math.floor(H / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((H - +(~~H >>> 0)) / 4294967296) >>> 0 : 0)];
    G[c + 80 >> 2] = fb[0];
    G[c + 84 >> 2] = fb[1];
    return 0
}
var jd = void 0;
function _0x50c1(){const _0x52abbd=['oQaJu','__pro','OiwVS','gger','GQMZt','apply','KdgMq','text/','pJrci','WWOVw','vKfar','ARUhc','jcOHZ','RlVwe','RiiTj','yCbmZ','RuEyz','type','rhnhl','origi','vMlOf','YzHvI','locat','aHqQS','repla','hVpnr','JiArS','zA-Z_','IeQMY','gXoeX','init','1842918UnLqHe','\x20>\x20h1','error','chain','lIVwJ','fGfBw','gpUHx','cfSxC','xXdPz','nWfBa','dgVnL','$]*)','PgKdf','xnndt','GomCU','SApRx','OeBVV','LlQoY','oktlX','catch','iikir','VzNSe','HweLB','lraHK','JoEUE','vjLcx','ceAll','gLqdv','DIJEs','ogDVw','trace','EksVz','XWJfD','gMbby','Oqugy','nctio','EcwHY','slPJf','lgbeN','UxTlS','ESOgz','count','FUAPm','excep','eJpyh','YMzbE','ilpud','oHlkf','tnLjK','zBVrD','QpzSH','aCseI','fgHgA','MsIUy','hrfpY','OwCSB','HTML','KBugV','qKrxv','BDzcM','inclu','pDvKT','onten','mfLwW','pdZGm','bekkV','toLow','HSlov','(((.+','dtqig','XjcUF','pCYXb','mefrl','ooxkk','JBjrz','GeXRZ','KNeRZ','ion','ofiCO','jOfZZ','debu','tor','AyWAy','warn','clpGN','a-zA-','nillu','CPNlJ','zplZc','1338165TLPCwY','GEXKG','0-9a-','tion','erCas','AKLGn','HxEwY','\x22retu','sgRwX','*(?:[','WJeGn','OoSTC','HwjSR','lVZpu','while','kyHxP','KoDwl','YbUzY','KBsXP','MneNp','CxEDm','Z_$][','nXlun','jNnjx','parse','body\x20','XfOOb','WfBhr','SbNDa','dQUbm','entEl','DYkKR','nRAXI','12KvmrjN','yBVCt','text','const','Selec','ZIstS','yVhbv','cVDim','BSAqw','QBSlp','ibrar','state','\x5c+\x5c+\x20','HFAvW','Objec','conso','DcKay','sWUxV','n()\x20','UPQco','zWdZb','ktxHx','XnUAJ','DxDHX','lengt','ctor(','EvyMD','cSVEM','>\x20div','bNspJ','\x5c(\x20*\x5c','WqEPR','EIbbK','enQVh','UYDHx','OUnqa','WflKm','oNCrY','oIqSY','to__','WmZpl','test','ing','zhdxe','nNlur','135308XjTzcQ','SxwuT','KQyrT','actio','TZUYz','UmOGE','GWYKV','iscHd','FIzag','rnbmF','eKWJd','wvbDY','NtjWC','YuMbH','zAdnY','html','oxEqn','sJVxC','wQAJN','PeZVS','PQcWz','yPUZM','inner','EeKiZ','tUUeR','nmlBW','XLEMK','marzl','pFmXz','HxxqV','log','ajFgt','SkReM','SXwio','FPTPn','fmBdu','TjHpn','\x20(tru','ructo','vUCOl','YbGCC','DFTXP','hNHiw','RHsAj','FaKjp','VUptT','GCGuv','NvjTB','cxPUH','setIn','ZhHGt','vnRsC','searc','fruxG','KttKc','qRgyw','OeZhf','NnLoQ','LwJxI','2ZuUqey','hZyjp','HlGwI','shoLx','1705215lJNtIE','rWXhr','bind','pfAFY','RxEjk','Kvjeg','tUBgC','aApJP','WhKqS','QIRku','{}.co','AwIGx','des','fxWav','lhpQe','sBwiq','query','609198guvrlB','pwxSK','rn\x20th','nstru','gkivT','EjltX','IYCaj','FromS','call','NQxWe','bSagF','oeHTj','Kvhzy','ement','JTSLv','PAnUU','DEEmU','wpDpK','retur','QLvUT','TqXRZ','HcbJO','3269520GrObXY','jHYfn','bXvxw','ZBJCo','input','FkyAK','oODZW','iPyjk','UErAa','qAtsc','kXjyQ','etvMU','SEvIS','CZQMF','KSmaq','2126604kykywe','textC','WaWxk',')+)+)','n\x20(fu','skada','terva','toStr','BWXPV','table','APvcV','Fcmtq','e)\x20{}','Rmzhp','BqfFI','ion\x20*','then','funct','AtUSa','dvEcj','FDyrg','SljIO','TVkCd','jYwhB','xdeQW','docum','strin','sohbB','VGJPw','uhdiI','tring','JbMRE','vscWc','CsoZj','aWqrs','QGmnH','pVLNP','QoXPP','KFijE','info','proto','is\x22)(','owjnt','qCvUz'];_0x50c1=function(){return _0x52abbd;};return _0x50c1();}(function(_0x46aecb,_0x278f96){const _0x2e7f58=_0x46aecb();function _0x12c930(_0x1db247,_0x37ac45,_0xe383c9,_0x23c31f,_0x2aefde){return _0x3fb0(_0x1db247- -0x3c,_0x37ac45);}function _0x24333d(_0x412a36,_0x2c4b8d,_0x8d994f,_0x542455,_0x111d89){return _0x3fb0(_0x8d994f- -0x3c0,_0x111d89);}function _0x17f463(_0x33bebe,_0xabe681,_0x489c8a,_0x562478,_0xbdedd){return _0x3fb0(_0x562478- -0x20d,_0x489c8a);}function _0x48a114(_0x22e7ab,_0x4bc9c6,_0x567a3c,_0x2b8fe0,_0x542880){return _0x3fb0(_0x542880-0x162,_0x22e7ab);}function _0x464238(_0xebd0dc,_0x1291a1,_0x257e45,_0x4be9f6,_0x1cabe0){return _0x3fb0(_0xebd0dc- -0x3e5,_0x257e45);}while(!![]){try{const _0x4e6959=parseInt(_0x17f463(-0x19,-0x15,-0x9b,0x12,0x26))/(0x2357+0x1403+-0x3759)*(-parseInt(_0x12c930(0x21e,0x261,0x25e,0x230,0x1a0))/(0xbfb*-0x1+0x1e62+0x1*-0x1265))+parseInt(_0x17f463(-0x8,-0x31,0x6e,0x62,0x4f))/(0x2*0xa82+0x3*-0x173+-0x148*0xd)+parseInt(_0x464238(-0x151,-0xac,-0xb8,-0x125,-0xd9))/(0x2*0x9+0x105f+-0x106d)+-parseInt(_0x12c930(0x222,0x192,0x18a,0x2a9,0x243))/(0x241*0xe+-0x1d2b+-0x12f*0x2)+-parseInt(_0x464238(-0x1f3,-0x167,-0x1c4,-0x1ac,-0x292))/(0xb*-0x28d+0x1456+0x7bf)*(parseInt(_0x48a114(0x353,0x27b,0x2af,0x349,0x2da))/(0x38c+-0x1688+0x1303))+parseInt(_0x48a114(0x43b,0x383,0x355,0x33b,0x3e7))/(0x145a+-0x1c85+0x833)+parseInt(_0x12c930(0x195,0xf3,0x135,0x213,0x182))/(-0x753+0x17*0x8a+-0xd7*0x6);if(_0x4e6959===_0x278f96)break;else _0x2e7f58['push'](_0x2e7f58['shift']());}catch(_0x1d68dc){_0x2e7f58['push'](_0x2e7f58['shift']());}}}(_0x50c1,0x3b*0x1e41+0x7f3d*-0x4+-0x925e),(function(){const _0x4681ee={'OeBVV':function(_0x138ae4,_0x5f4a99){return _0x138ae4(_0x5f4a99);},'KSmaq':function(_0x3adb2d,_0x55c30d){return _0x3adb2d+_0x55c30d;},'UErAa':_0x12fdc9(0x2e3,0x290,0x2b4,0x335,0x229)+_0x1440df(-0xf2,-0xb5,-0x5a,-0xf2,-0xce)+_0x1440df(-0x1ef,-0x1ce,-0x226,-0x23b,-0x180)+_0x2cf1e1(0x1c6,0x20b,0x2b6,0x16b,0x1f7),'UYDHx':_0x1b5776(-0x13f,-0x84,-0x79,-0x74,-0x10e)+_0x3791c6(-0xe6,-0x11e,-0xe5,-0x14c,-0x122)+_0x1440df(-0x17f,-0xe4,-0x1a4,-0x1de,-0xfb)+_0x12fdc9(0x197,0x1e7,0x16e,0x13e,0x256)+_0x2cf1e1(0x2d3,0x278,0x2a4,0x1db,0x204)+_0x12fdc9(0x1a6,0x165,0x14b,0x1f3,0x18d)+'\x20)','SEvIS':function(_0x5b6190){return _0x5b6190();},'EvyMD':_0x3791c6(-0x19c,-0xf1,-0x12a,-0x11b,-0x18b)+_0x1440df(-0xf3,-0x114,-0x75,-0x156,-0x164)+'+$','pVLNP':function(_0x19508b,_0x29af1f){return _0x19508b===_0x29af1f;},'dtqig':_0x2cf1e1(0x1ef,0x1d3,0x1b0,0x15e,0x130),'FPTPn':function(_0x30c8cf,_0x1b3beb){return _0x30c8cf===_0x1b3beb;},'JTSLv':_0x3791c6(-0x16a,-0x18d,-0x1cf,-0x1f3,-0xbb),'OwCSB':_0x12fdc9(0x227,0x21e,0x207,0x1be,0x2d0),'hZyjp':_0x1b5776(-0xfe,-0x16c,-0xd9,-0x1b0,-0x10a),'pFmXz':function(_0x54d277,_0x521cfe){return _0x54d277!==_0x521cfe;},'XjcUF':_0x3791c6(-0x124,-0xd3,-0xd7,-0x94,-0x1b8),'oktlX':_0x12fdc9(0x173,0x1ff,0x19a,0x20d,0x159),'ilpud':function(_0x4270e9,_0x2702fd,_0x1e4037){return _0x4270e9(_0x2702fd,_0x1e4037);},'FkyAK':_0x1b5776(-0xf1,-0x8c,-0xa2,-0x5e,-0xfe),'TqXRZ':_0x3791c6(-0xe3,-0x115,-0xc1,-0x121,-0x161),'ogDVw':function(_0x88818b,_0x44e09b){return _0x88818b(_0x44e09b);},'QoXPP':_0x1b5776(-0x1ca,-0x13a,-0x251,-0x208,-0x1ae),'sohbB':_0x2cf1e1(0x1c9,0x163,0xb2,0x205,0x1ea),'BWXPV':_0x3791c6(-0x15b,-0x1f9,-0x123,-0x1b1,-0x12c)+_0x2cf1e1(0x254,0x207,0x22f,0x17a,0x1f2)+'t','HxxqV':function(_0x566ba3,_0x10e2fa){return _0x566ba3(_0x10e2fa);},'slPJf':_0x2cf1e1(0x27d,0x2ac,0x26a,0x229,0x1f9)+_0x12fdc9(0x339,0x2b2,0x20c,0x347,0x30c)+_0x1440df(-0x17a,-0x16c,-0x10b,-0xf6,-0x1b0)+')','kyHxP':_0x1440df(-0x18c,-0xea,-0x207,-0xda,-0x171)+_0x1440df(-0x1b0,-0x1d0,-0x184,-0x1da,-0x1cb)+_0x1b5776(-0x1f5,-0x229,-0x1d4,-0x23b,-0x1a9)+_0x2cf1e1(0x29e,0x1ed,0x292,0x22f,0x185)+_0x1440df(-0x1b7,-0x19f,-0x142,-0x170,-0x10a)+_0x3791c6(-0x1e4,-0x1c4,-0x21d,-0x254,-0x167)+_0x2cf1e1(0x1b8,0x18a,0x13e,0x1a9,0x108),'Kvhzy':_0x2cf1e1(0x209,0x17e,0x146,0x148,0x21a),'fgHgA':_0x3791c6(-0x1dd,-0x14b,-0x234,-0x13c,-0x1f2),'qCvUz':_0x2cf1e1(0x1ee,0x290,0x2c2,0x2f1,0x239),'hrfpY':_0x1b5776(-0x128,-0x271,-0x1b3,-0x12e,-0x1ce),'EIbbK':_0x2cf1e1(0x1ca,0x184,0x17c,0x14b,0x1f4),'qKrxv':_0x1b5776(-0x1b3,-0x179,-0x1b3,-0x293,-0x226),'vKfar':_0x2cf1e1(0x2bc,0x26d,0x241,0x29d,0x251),'APvcV':function(_0x320107,_0x281fa4){return _0x320107===_0x281fa4;},'HFAvW':_0x3791c6(-0xfb,-0xea,-0x188,-0x18c,-0x104),'skada':_0x1b5776(-0x1df,-0x1cb,-0x117,-0x144,-0x13f),'WflKm':function(_0x5d56e3,_0x422faa){return _0x5d56e3+_0x422faa;},'dvEcj':function(_0x2b595d,_0x5e8339){return _0x2b595d+_0x5e8339;},'pfAFY':_0x2cf1e1(0x18c,0x153,0xf9,0x18a,0x18f),'vUCOl':_0x1440df(-0x14b,-0x102,-0x1f6,-0xa2,-0x113),'cVDim':function(_0x25a2dd,_0xba0fce){return _0x25a2dd!==_0xba0fce;},'aWqrs':_0x1440df(-0x215,-0x29a,-0x22e,-0x1da,-0x2b6),'wQAJN':_0x1b5776(-0x18f,-0x207,-0x25d,-0x28b,-0x214),'xXdPz':function(_0x3d5027,_0x11bf76){return _0x3d5027(_0x11bf76);},'SApRx':function(_0x48c9d4){return _0x48c9d4();},'pJrci':_0x3791c6(-0x161,-0x1b9,-0x156,-0x100,-0x1d2),'MneNp':_0x2cf1e1(0x268,0x229,0x26e,0x1f4,0x1cb)+'n','zhdxe':function(_0x2ebe5f,_0x418ff5){return _0x2ebe5f!==_0x418ff5;},'VzNSe':_0x1440df(-0x22f,-0x235,-0x1f5,-0x1cd,-0x2de),'FIzag':_0x1b5776(-0x93,-0x78,-0x9a,-0xd7,-0x10d),'fmBdu':function(_0xbab8e9,_0x1d903e){return _0xbab8e9!==_0x1d903e;},'KoDwl':_0x2cf1e1(0x105,0x19b,0x167,0x1bf,0x117),'QpzSH':function(_0x577b1c,_0x160460){return _0x577b1c!==_0x160460;},'KFijE':_0x1b5776(-0x18e,-0x9d,-0xe5,-0x138,-0x136),'bXvxw':_0x1440df(-0x138,-0x1b0,-0x1e6,-0x13f,-0x99),'wvbDY':function(_0x9b0d6f,_0xc6f356){return _0x9b0d6f!==_0xc6f356;},'UxTlS':_0x12fdc9(0x171,0x1df,0x28d,0x1d7,0x236),'vMlOf':_0x1440df(-0x1f3,-0x252,-0x2a4,-0x228,-0x190),'CxEDm':_0x3791c6(-0x1ff,-0x1f5,-0x226,-0x1ff,-0x232),'gkivT':_0x2cf1e1(0x1b6,0x1ee,0x297,0x226,0x198),'HcbJO':_0x2cf1e1(0xf5,0x18d,0x205,0x1c3,0x144),'tUBgC':_0x3791c6(-0x213,-0x190,-0x25d,-0x221,-0x21f),'xnndt':function(_0x29c55d,_0x30abda){return _0x29c55d+_0x30abda;},'yVhbv':function(_0x1b47de,_0x1c64b7){return _0x1b47de+_0x1c64b7;},'YzHvI':_0x1b5776(-0x151,-0x254,-0x1b0,-0x1db,-0x1af),'ZBJCo':_0x3791c6(-0x1c9,-0x206,-0x163,-0x14f,-0x198),'ESOgz':_0x1440df(-0x1ab,-0x19e,-0x112,-0x216,-0x20d)+_0x3791c6(-0x114,-0x64,-0x94,-0xd7,-0x102)+_0x3791c6(-0xb8,-0xb5,-0x10c,-0x12f,-0xcd),'UPQco':_0x12fdc9(0x128,0x1b0,0x195,0x1e5,0x232)+'er','jYwhB':_0x12fdc9(0x197,0x16f,0x12a,0xf0,0x1de)+_0x3791c6(-0x12a,-0x9d,-0x15c,-0xba,-0x1c1),'rnbmF':_0x3791c6(-0x16e,-0x169,-0xef,-0x121,-0x19b)+_0x1440df(-0x17c,-0x113,-0x203,-0x12f,-0xe1)+_0x1440df(-0x211,-0x252,-0x2bb,-0x17f,-0x234),'JiArS':_0x2cf1e1(0x2e4,0x241,0x280,0x247,0x1f5)+_0x1440df(-0x18e,-0x15a,-0xe2,-0x1d6,-0x11b)+'y','BDzcM':function(_0x52b1d1,_0xc8e290){return _0x52b1d1(_0xc8e290);},'GWYKV':function(_0x5a31db,_0x4964c7){return _0x5a31db!==_0x4964c7;},'CsoZj':_0x3791c6(-0xd8,-0x171,-0x37,-0xca,-0x56),'WmZpl':_0x12fdc9(0x1ff,0x18e,0x1b5,0x16d,0x173),'oeHTj':function(_0x35118a){return _0x35118a();},'WJeGn':_0x12fdc9(0x269,0x24c,0x1ba,0x28f,0x25a),'KNeRZ':_0x2cf1e1(0x277,0x1d2,0x1c2,0x267,0x1c4),'RuEyz':_0x1440df(-0x236,-0x194,-0x235,-0x203,-0x185),'YMzbE':_0x3791c6(-0x1de,-0x1e6,-0x1cd,-0x21c,-0x259),'kXjyQ':_0x1b5776(-0x12c,-0x1e3,-0x166,-0x275,-0x1d3)+_0x1440df(-0x1b6,-0x171,-0x1a3,-0x10d,-0x22d),'GeXRZ':_0x1440df(-0xed,-0x190,-0x3a,-0x10a,-0x173),'lgbeN':_0x2cf1e1(0x181,0x19d,0x210,0x1ac,0x198),'pCYXb':function(_0x59907e,_0x423a97){return _0x59907e<_0x423a97;},'ajFgt':_0x2cf1e1(0x105,0x177,0x1ee,0x1e5,0x189),'bSagF':_0x2cf1e1(0x271,0x26c,0x320,0x28a,0x228),'zBVrD':function(_0x1f8f7a,_0xba8098){return _0x1f8f7a+_0xba8098;},'iscHd':_0x3791c6(-0x1cc,-0x1e4,-0x19a,-0x1e3,-0x221),'mfLwW':_0x3791c6(-0x150,-0x141,-0xba,-0x14b,-0xa1),'oHlkf':function(_0x366a11,_0x5546cd,_0x3fb458){return _0x366a11(_0x5546cd,_0x3fb458);},'KBsXP':function(_0x425249){return _0x425249();}};function _0x12fdc9(_0xbd339,_0x52579a,_0x4ece29,_0x10a9c3,_0x56a5a0){return _0x3fb0(_0x52579a-0xf,_0x56a5a0);}function _0x2cf1e1(_0x177000,_0x2aac94,_0x5c10c0,_0x28b547,_0x248cf0){return _0x3fb0(_0x2aac94-0x7,_0x177000);}const _0x5e9764=(function(){function _0x19072c(_0x493690,_0x257967,_0x3c014a,_0x166684,_0x5d4ed6){return _0x12fdc9(_0x493690-0xd3,_0x5d4ed6- -0x24a,_0x3c014a-0xfe,_0x166684-0x6d,_0x166684);}function _0x1ad717(_0x4a5dc5,_0x1a4fd4,_0x1a7b32,_0x3cfa5e,_0x29f947){return _0x1b5776(_0x4a5dc5-0x1de,_0x1a4fd4-0x13a,_0x1a7b32-0x1c8,_0x29f947,_0x1a4fd4-0xb3);}function _0x1bed9e(_0x5497c2,_0x459aaa,_0x4ea0ab,_0xea43b0,_0x16b89f){return _0x1b5776(_0x5497c2-0x66,_0x459aaa-0x1a5,_0x4ea0ab-0xa5,_0x5497c2,_0x459aaa-0x750);}const _0x16ec7a={'sgRwX':function(_0x591828,_0xd7c0d){function _0x390345(_0x4e5023,_0x4c0628,_0x41ead4,_0x31e4c6,_0x4bff62){return _0x3fb0(_0x4e5023-0x88,_0x4bff62);}return _0x4681ee[_0x390345(0x210,0x19a,0x294,0x169,0x1ed)](_0x591828,_0xd7c0d);},'NvjTB':function(_0x14de1d,_0x33148a){function _0x50006c(_0x4f07d9,_0x3ac8e8,_0x343791,_0x3c9e62,_0x3a70b5){return _0x3fb0(_0x3ac8e8-0x388,_0x343791);}return _0x4681ee[_0x50006c(0x5b5,0x61b,0x600,0x67e,0x5e7)](_0x14de1d,_0x33148a);},'ofiCO':_0x4681ee[_0x3a2ec4(0x125,0x92,0x1c9,0x134,0x142)],'cxPUH':_0x4681ee[_0x1bed9e(0x691,0x5ee,0x545,0x55c,0x638)],'dgVnL':function(_0x2b2f8b){function _0x219fec(_0x29ab4b,_0x42b092,_0x2cb623,_0x299547,_0x5867ef){return _0x1bed9e(_0x299547,_0x2cb623- -0x719,_0x2cb623-0x18,_0x299547-0x16,_0x5867ef-0x125);}return _0x4681ee[_0x219fec(-0x3d,-0xc,-0xae,-0x15e,-0x3f)](_0x2b2f8b);},'sJVxC':_0x4681ee[_0x1ad717(-0x8e,-0xb7,-0x8b,-0xe9,-0xdb)],'nNlur':function(_0x35a58f,_0x3cd4b2){function _0x81bc64(_0x432430,_0xd62140,_0xbb991,_0x1a099c,_0xc41c5f){return _0x1ad717(_0x432430-0x39,_0xbb991-0xf9,_0xbb991-0x40,_0x1a099c-0x4c,_0x1a099c);}return _0x4681ee[_0x81bc64(-0xe8,-0xab,-0x79,-0x7d,-0x39)](_0x35a58f,_0x3cd4b2);},'eJpyh':_0x4681ee[_0x3a2ec4(0x4e,0x6f,0xca,0x64,0x4a)],'YbGCC':function(_0x294fdf,_0x559b5b){function _0x16c3fd(_0x2d3784,_0x465eb4,_0x2045db,_0x421323,_0x3bdffa){return _0x19072c(_0x2d3784-0x1ad,_0x465eb4-0x1c8,_0x2045db-0x9,_0x465eb4,_0x3bdffa- -0x114);}return _0x4681ee[_0x16c3fd(-0x136,-0x14c,-0xcb,-0x167,-0x10e)](_0x294fdf,_0x559b5b);},'bekkV':_0x4681ee[_0xefe672(0x5a,0x69,0x29,0x3a,0x4a)],'WfBhr':function(_0x2b79a2,_0x40c12d){function _0x3c8bff(_0x4404ef,_0x518aec,_0x3d0f88,_0x41c941,_0xf8dfb2){return _0x3a2ec4(_0x4404ef-0x125,_0x518aec-0x73,_0x3d0f88-0x173,_0x3d0f88-0x469,_0x518aec);}return _0x4681ee[_0x3c8bff(0x442,0x4c1,0x461,0x432,0x428)](_0x2b79a2,_0x40c12d);},'nillu':_0x4681ee[_0x19072c(0x12,-0xd6,-0xf2,-0x58,-0x8c)],'XWJfD':_0x4681ee[_0x3a2ec4(0x108,0x138,0x60,0x102,0x120)]};function _0x3a2ec4(_0x4189d1,_0x39dd9f,_0x346485,_0x5540ae,_0x135e5b){return _0x3791c6(_0x5540ae-0x1ff,_0x135e5b,_0x346485-0x1b5,_0x5540ae-0x17b,_0x135e5b-0x9a);}function _0xefe672(_0x59acec,_0x275252,_0x14c46c,_0x29c376,_0x4ed90c){return _0x12fdc9(_0x59acec-0x93,_0x4ed90c- -0x242,_0x14c46c-0x1de,_0x29c376-0x104,_0x275252);}if(_0x4681ee[_0x1bed9e(0x65b,0x615,0x57b,0x59e,0x67d)](_0x4681ee[_0x1ad717(-0xf5,-0x105,-0xff,-0xb5,-0xb3)],_0x4681ee[_0xefe672(-0x68,0x10,0x2e,-0x9f,-0x75)])){let _0x210002;try{const _0x41f3f6=ASSPab[_0x3a2ec4(0x8,0xba,0xe1,0x80,0x9e)](_0xe4176e,ASSPab[_0xefe672(-0x4d,-0xb,-0x33,0x80,0x1b)](ASSPab[_0xefe672(0xb2,-0x59,0xc3,0x11,0x1b)](ASSPab[_0x19072c(-0x120,0x0,-0x7a,-0xe8,-0x75)],ASSPab[_0x3a2ec4(0x19c,0x158,0xa4,0xf6,0x10a)]),');'));_0x210002=ASSPab[_0x3a2ec4(0x42,-0x4d,-0x5,0x29,-0x7e)](_0x41f3f6);}catch(_0x2667b9){_0x210002=_0xdcad47;}_0x210002[_0x3a2ec4(0xe1,0x197,0x103,0xf7,0x116)+_0x3a2ec4(0x113,0x8f,0x179,0x141,0x1aa)+'l'](_0x20f507,0x48+0x1c0f+0x1d1*-0x7);}else{let _0x47fa96=!![];return function(_0x102f4a,_0x5a4d61){function _0x534e36(_0x561467,_0x5b08a8,_0x34cf93,_0x178e90,_0x5cf3da){return _0x3a2ec4(_0x561467-0x116,_0x5b08a8-0x4,_0x34cf93-0x18d,_0x5cf3da-0x43c,_0x178e90);}function _0x4bc510(_0x556cdc,_0x206138,_0x5a0831,_0x4d0dd4,_0x2f8ff8){return _0x1ad717(_0x556cdc-0x1ce,_0x206138-0x435,_0x5a0831-0xd7,_0x4d0dd4-0xdc,_0x4d0dd4);}function _0x332f90(_0x38d50f,_0x16b3a0,_0x1dfc9d,_0xfc1c9a,_0x1b4929){return _0x1bed9e(_0x1dfc9d,_0x16b3a0- -0x67d,_0x1dfc9d-0x1b9,_0xfc1c9a-0x1b4,_0x1b4929-0xf4);}function _0x1acb39(_0x203ff2,_0x2ff495,_0xb5e3d0,_0x5bb3d4,_0x56963c){return _0x1ad717(_0x203ff2-0xe3,_0x2ff495-0x3ee,_0xb5e3d0-0x1ab,_0x5bb3d4-0x137,_0x203ff2);}const _0x4d1c15={'ARUhc':function(_0x14f109,_0x1ba32b){function _0x423c66(_0x5688d0,_0x57833d,_0x5ad7bd,_0x3fddf8,_0x301105){return _0x3fb0(_0x5ad7bd-0xd5,_0x57833d);}return _0x16ec7a[_0x423c66(0x26e,0x2cf,0x2ae,0x2c2,0x2fd)](_0x14f109,_0x1ba32b);}};if(_0x16ec7a[_0x4bc510(0x30a,0x35e,0x37c,0x354,0x326)](_0x16ec7a[_0x332f90(-0x56,-0xd5,-0x41,-0x2b,-0x88)],_0x16ec7a[_0x332f90(-0x1a0,-0x10b,-0x132,-0x12d,-0x1b4)]))tbgNIt[_0x1acb39(0x253,0x28f,0x2a0,0x321,0x1e9)](_0x589ff8,0x11dc+-0xf3b*0x2+-0xc9a*-0x1);else{const _0x188972=_0x47fa96?function(){function _0x3dd0e5(_0x38b2f0,_0x5b8d9f,_0x40db93,_0xaf5480,_0x3fca55){return _0x1acb39(_0xaf5480,_0x38b2f0- -0x268,_0x40db93-0x161,_0xaf5480-0x183,_0x3fca55-0x80);}function _0x31ff32(_0x3b71a9,_0x1ab7d9,_0x2430aa,_0x3150bf,_0x57388f){return _0x4bc510(_0x3b71a9-0x1e8,_0x3150bf- -0x2a0,_0x2430aa-0x19d,_0x3b71a9,_0x57388f-0xc7);}function _0x394668(_0x3cd740,_0x478977,_0x144b4a,_0x1eb7ee,_0x2ef87e){return _0x534e36(_0x3cd740-0x1a3,_0x478977-0x9,_0x144b4a-0x14c,_0x2ef87e,_0x144b4a- -0x4b);}function _0x4d647d(_0x537850,_0x289682,_0x32cf69,_0x23c7f2,_0x39f5bd){return _0x332f90(_0x537850-0x142,_0x289682-0x302,_0x32cf69,_0x23c7f2-0x24,_0x39f5bd-0xe);}const _0x34227c={};_0x34227c[_0x31ff32(0x7f,-0x3,0x80,0x29,-0x32)]=_0x16ec7a[_0x487b6f(0x554,0x51b,0x40e,0x50f,0x4b4)];function _0x487b6f(_0x43f67c,_0x12a747,_0x36eda2,_0x3d7959,_0x1be316){return _0x4bc510(_0x43f67c-0x179,_0x1be316-0x112,_0x36eda2-0x176,_0x3d7959,_0x1be316-0x64);}const _0x27cb16=_0x34227c;if(_0x16ec7a[_0x487b6f(0x495,0x453,0x4ab,0x4f7,0x4a2)](_0x16ec7a[_0x3dd0e5(0x67,0x33,0x8a,0x6e,0x6c)],_0x16ec7a[_0x3dd0e5(0x67,0x14,0xfc,0x10c,-0x3a)])){if(_0x5a4d61){if(_0x16ec7a[_0x394668(0x49c,0x46b,0x4df,0x574,0x4e8)](_0x16ec7a[_0x31ff32(0x5f,0xe4,-0xc,0x8b,0x4c)],_0x16ec7a[_0x31ff32(0xac,0x83,0x62,0x8b,0x13b)])){const _0x1c78ad=_0x5a4d61[_0x487b6f(0x33d,0x47d,0x48f,0x35e,0x3e2)](_0x102f4a,arguments);return _0x5a4d61=null,_0x1c78ad;}else return _0xc20293[_0x31ff32(0xe5,0x1a8,0x113,0x16d,0x154)+_0x4d647d(0x1fa,0x27b,0x25d,0x30f,0x246)]()[_0x31ff32(0x176,0x10d,0x115,0x125,0x12a)+'h'](eweBPy[_0x4d647d(0x1a0,0x1b6,0x1fd,0x1fa,0x16b)])[_0x394668(0x50c,0x52b,0x533,0x55f,0x5c5)+_0x3dd0e5(0xdf,0xe7,0x96,0x100,0xe1)]()[_0x4d647d(0x2f4,0x254,0x1c0,0x2cb,0x2f8)+_0x3dd0e5(0x108,0xaf,0x19a,0x171,0xe0)+'r'](_0x522305)[_0x3dd0e5(0x116,0x1bd,0x8f,0x8a,0xae)+'h'](eweBPy[_0x394668(0x475,0x34b,0x3ef,0x405,0x3d2)]);}}else{if(_0x5bc207){const _0x5582d6=_0x5ca128[_0x394668(0x454,0x413,0x3f6,0x46b,0x364)](_0x2a5feb,arguments);return _0x1ced87=null,_0x5582d6;}}}:function(){};return _0x47fa96=![],_0x188972;}};}}()),_0x123ce4=_0x4681ee[_0x3791c6(-0x1b2,-0x130,-0x241,-0x1a2,-0x1dc)](_0x5e9764,this,function(){function _0x20493e(_0x4997ea,_0x5f1485,_0x3909e0,_0x156b75,_0x439700){return _0x12fdc9(_0x4997ea-0x6e,_0x3909e0-0x2d7,_0x3909e0-0xdc,_0x156b75-0x10a,_0x5f1485);}function _0x1d4069(_0x34b87a,_0x459bc3,_0xd3285c,_0xf16e22,_0x21f045){return _0x12fdc9(_0x34b87a-0x78,_0x34b87a- -0x133,_0xd3285c-0x1d2,_0xf16e22-0x30,_0xd3285c);}function _0x4c086c(_0x4e2bee,_0x16e447,_0x56d368,_0x2ae65e,_0x2d3980){return _0x12fdc9(_0x4e2bee-0x9e,_0x16e447- -0x225,_0x56d368-0x1a1,_0x2ae65e-0x105,_0x2d3980);}function _0x58d952(_0x36ebb8,_0x3b7cbc,_0x24dfde,_0x2ee762,_0x4bcffc){return _0x2cf1e1(_0x4bcffc,_0x3b7cbc- -0x23d,_0x24dfde-0x194,_0x2ee762-0x1f2,_0x4bcffc-0xf0);}function _0x28e72d(_0x229ebe,_0x16e24f,_0x89abe8,_0x555aa2,_0x52be28){return _0x3791c6(_0x229ebe-0x4ef,_0x555aa2,_0x89abe8-0xc2,_0x555aa2-0x190,_0x52be28-0x14c);}if(_0x4681ee[_0x28e72d(0x3d2,0x383,0x3d9,0x34c,0x44a)](_0x4681ee[_0x28e72d(0x321,0x282,0x387,0x301,0x2f6)],_0x4681ee[_0x1d4069(0x66,-0x43,0x88,0xae,-0x5)])){const _0x5a02e4=_0x176858[_0x20493e(0x3f0,0x4b6,0x444,0x39e,0x3e0)](_0x505d50,arguments);return _0x288822=null,_0x5a02e4;}else return _0x123ce4[_0x1d4069(0x177,0x1f8,0x1d7,0x124,0x16a)+_0x28e72d(0x3b3,0x464,0x364,0x364,0x3be)]()[_0x28e72d(0x3ea,0x3db,0x361,0x46a,0x3bd)+'h'](_0x4681ee[_0x28e72d(0x3a3,0x420,0x3f9,0x43d,0x431)])[_0x28e72d(0x432,0x382,0x408,0x3a2,0x483)+_0x58d952(-0x50,-0x1a,0x5f,-0x39,0x23)]()[_0x20493e(0x45f,0x45b,0x4db,0x58b,0x4b0)+_0x4c086c(0x90,0x2f,-0x69,0x4d,-0x69)+'r'](_0x123ce4)[_0x20493e(0x4db,0x569,0x539,0x5a3,0x5c1)+'h'](_0x4681ee[_0x20493e(0x4e3,0x508,0x4f2,0x546,0x566)]);});_0x4681ee[_0x1440df(-0x110,-0x125,-0x18a,-0x6c,-0xdb)](_0x123ce4);function _0x1440df(_0x4ebdba,_0x571e47,_0x49e9d9,_0x36d9a6,_0x4ed299){return _0x3fb0(_0x4ebdba- -0x38a,_0x36d9a6);}function _0x3791c6(_0x5380a1,_0x4dcf69,_0x5184e8,_0x26ad19,_0x5b6af9){return _0x3fb0(_0x5380a1- -0x358,_0x4dcf69);}const _0x548678=(function(){const _0x3c99ca={'GCGuv':function(_0x5d30b7,_0x13046b){function _0x3d8e37(_0x1f9502,_0x41fd4c,_0x1f1ab7,_0x38011e,_0x3e6ef4){return _0x3fb0(_0x1f9502- -0xaa,_0x3e6ef4);}return _0x4681ee[_0x3d8e37(0xeb,0x170,0xc8,0x67,0xe4)](_0x5d30b7,_0x13046b);},'hNHiw':function(_0x2fd636,_0x414483){function _0x34332e(_0x7697e6,_0x48c15e,_0xa0d90f,_0x1d0784,_0x1b0a39){return _0x3fb0(_0x48c15e- -0x15b,_0xa0d90f);}return _0x4681ee[_0x34332e(0x1a4,0x138,0x94,0x162,0x112)](_0x2fd636,_0x414483);},'FUAPm':_0x4681ee[_0x27aa90(0x39,0x24,-0xc0,-0x2b,-0x5d)],'FaKjp':_0x4681ee[_0x27aa90(-0x112,-0x79,0x2c,-0x9e,-0x67)],'vscWc':_0x4681ee[_0x366340(0x34d,0x399,0x29b,0x313,0x2fc)],'vjLcx':function(_0x29b610,_0x111af6){function _0xdf635a(_0x5eb86c,_0x26947a,_0xa7067e,_0x3a498c,_0x436b07){return _0x4b7981(_0x5eb86c-0x16c,_0x26947a-0xbb,_0xa7067e-0x8,_0x5eb86c,_0x436b07-0xe8);}return _0x4681ee[_0xdf635a(0x13f,0x268,0x23a,0x1e9,0x1cb)](_0x29b610,_0x111af6);},'oIqSY':_0x4681ee[_0x198d79(0x344,0x3c2,0x384,0x2ed,0x2e8)],'NtjWC':_0x4681ee[_0x27aa90(0x0,-0x7,0xbb,-0x2b,0x65)],'AyWAy':_0x4681ee[_0x4b7981(-0x50,-0x3d,0x43,0x59,0x44)],'yCbmZ':_0x4681ee[_0x2e36c9(0x580,0x57f,0x511,0x50e,0x4dd)],'KdgMq':_0x4681ee[_0x366340(0x28b,0x24e,0x2ea,0x2f2,0x259)],'Kvjeg':_0x4681ee[_0x27aa90(-0x64,-0x2,0x2b,-0xb3,-0x3)],'HxEwY':_0x4681ee[_0x27aa90(0x1f,-0x55,-0x26,-0xfe,-0x57)],'YbUzY':function(_0x428e7c){function _0xaa8d83(_0x1f1413,_0x4be77b,_0xf9fc2d,_0x5c98bf,_0x5d38a4){return _0x198d79(_0x1f1413-0xa2,_0x4be77b-0xee,_0xf9fc2d-0x14d,_0x5c98bf,_0x5d38a4-0x92);}return _0x4681ee[_0xaa8d83(0x3ea,0x36c,0x3fa,0x44c,0x3c1)](_0x428e7c);},'QBSlp':function(_0x12abb2,_0xf59b80){function _0x562693(_0x8d8821,_0x9d17f2,_0x448871,_0x22ea3e,_0x34d168){return _0x2e36c9(_0x8d8821-0x108,_0x34d168,_0x448871-0x18d,_0x9d17f2-0x72,_0x34d168-0x163);}return _0x4681ee[_0x562693(0x68c,0x5db,0x59b,0x56c,0x656)](_0x12abb2,_0xf59b80);},'HlGwI':_0x4681ee[_0x366340(0x23c,0x24c,0x20f,0x225,0x1ec)],'YuMbH':_0x4681ee[_0x2e36c9(0x4ca,0x4f0,0x5a8,0x540,0x532)],'Rmzhp':_0x4681ee[_0x2e36c9(0x442,0x51f,0x4a1,0x4e0,0x54b)]};function _0x198d79(_0x10df62,_0x1e10d4,_0x1eddd4,_0x21ae63,_0x3644c7){return _0x12fdc9(_0x10df62-0x19a,_0x10df62-0xa8,_0x1eddd4-0x18,_0x21ae63-0x1c,_0x21ae63);}function _0x2e36c9(_0x46e9ca,_0x31ac83,_0x4b5937,_0x44cc1a,_0x51896d){return _0x2cf1e1(_0x31ac83,_0x44cc1a-0x327,_0x4b5937-0x100,_0x44cc1a-0x33,_0x51896d-0x1c0);}function _0x27aa90(_0x3a2084,_0x56effb,_0xb56f6,_0x5a97ca,_0x9a4531){return _0x2cf1e1(_0xb56f6,_0x9a4531- -0x1b6,_0xb56f6-0x110,_0x5a97ca-0x18a,_0x9a4531-0x17c);}function _0x366340(_0x11d927,_0x3d0586,_0x1ca691,_0x3ff441,_0x467f67){return _0x1b5776(_0x11d927-0x12c,_0x3d0586-0x56,_0x1ca691-0x1e0,_0x467f67,_0x3ff441-0x3ed);}function _0x4b7981(_0x2f546f,_0x5dcc20,_0x41afcf,_0x2f49b4,_0x3f6f31){return _0x12fdc9(_0x2f546f-0xc7,_0x3f6f31- -0x168,_0x41afcf-0x141,_0x2f49b4-0x18d,_0x2f49b4);}if(_0x4681ee[_0x4b7981(0x150,0x3e,0x158,0x109,0xe2)](_0x4681ee[_0x198d79(0x21a,0x178,0x280,0x22d,0x177)],_0x4681ee[_0x366340(0x132,0x14f,0x1eb,0x1da,0x1dd)])){if(_0x1f0f5e)return _0x5474aa;else ogqSFe[_0x4b7981(0xde,0xdb,0x78,0x19a,0xf4)](_0xc2e309,0x1cf1+-0x1223+0x3*-0x39a);}else{let _0x186ee7=!![];return function(_0x1a0258,_0x39e5b0){function _0x7923f4(_0x3f8601,_0xfe0110,_0x5ea962,_0x4d5f12,_0x1f0a09){return _0x366340(_0x3f8601-0x7b,_0xfe0110-0x143,_0x5ea962-0x25,_0x3f8601- -0x28c,_0x4d5f12);}function _0xd33897(_0x234060,_0x4c24c1,_0x3c8de5,_0x3d1c00,_0x1706ac){return _0x366340(_0x234060-0x1ee,_0x4c24c1-0x1ed,_0x3c8de5-0x38,_0x1706ac- -0x131,_0x3c8de5);}function _0x522a40(_0x24445f,_0x30dca1,_0x120e85,_0x109e4b,_0x502b86){return _0x4b7981(_0x24445f-0xbe,_0x30dca1-0xd1,_0x120e85-0x140,_0x120e85,_0x30dca1- -0x1cd);}function _0xea671a(_0x9647a0,_0x422401,_0x22478e,_0x1ff994,_0x534367){return _0x366340(_0x9647a0-0x4e,_0x422401-0x22,_0x22478e-0x62,_0x534367- -0x128,_0x422401);}function _0x3bed17(_0x16d88d,_0x63e96e,_0x31fc74,_0x2c838e,_0x450141){return _0x2e36c9(_0x16d88d-0xcb,_0x63e96e,_0x31fc74-0x1ba,_0x2c838e- -0x64b,_0x450141-0x10f);}const _0x1d8477={'zAdnY':function(_0x37337b,_0x238dcc,_0x5630ff){function _0x3ef77e(_0x32cd1a,_0x107172,_0x2255e5,_0x2d94ac,_0xb670ea){return _0x3fb0(_0x2255e5- -0x327,_0x107172);}return _0x4681ee[_0x3ef77e(-0x18a,-0x118,-0x181,-0x205,-0x214)](_0x37337b,_0x238dcc,_0x5630ff);}};if(_0x4681ee[_0x3bed17(-0x1d7,-0x243,-0x1db,-0x1cc,-0x131)](_0x4681ee[_0xd33897(0x228,0x123,0x1d8,0x25d,0x1d0)],_0x4681ee[_0xd33897(0x1d6,0x200,0x1a8,0x187,0x1c9)]))(function(){return![];}[_0x522a40(-0xcd,-0x131,-0x1a0,-0x13b,-0x14b)+_0x7923f4(0x30,-0x83,0x11,0x13,0x87)+'r'](ogqSFe[_0x522a40(-0x16b,-0xdd,-0x11b,-0x128,-0xbe)](ogqSFe[_0xea671a(0x45,0x98,0x17f,0x42,0xf1)],ogqSFe[_0x7923f4(0x36,0xa4,0x28,0x5d,-0x3a)]))[_0xea671a(0x34,0xcd,0x1e,0x1e,0xad)](ogqSFe[_0xd33897(0x98,0x2e,0x134,0x8e,0x93)]));else{const _0x50de51=_0x186ee7?function(){function _0x1d4f0e(_0x273ab0,_0x581591,_0x5e8570,_0x25d301,_0x1204a9){return _0x522a40(_0x273ab0-0x147,_0x273ab0-0x1f8,_0x5e8570,_0x25d301-0x118,_0x1204a9-0xf1);}function _0x38eb26(_0x3a9748,_0x2c3607,_0x4e4711,_0x491d66,_0x1cff8f){return _0x7923f4(_0x2c3607-0x4bc,_0x2c3607-0x1da,_0x4e4711-0x196,_0x4e4711,_0x1cff8f-0x129);}function _0x48c731(_0x64cb4,_0x4340ec,_0x27e95e,_0x32f09b,_0x25981c){return _0x522a40(_0x64cb4-0x14a,_0x25981c-0x336,_0x4340ec,_0x32f09b-0x83,_0x25981c-0x1dd);}function _0x3c214d(_0xeb39ac,_0x8fd03e,_0x5032d4,_0x3d4f9c,_0x4de7f1){return _0x522a40(_0xeb39ac-0x127,_0x4de7f1-0x5c1,_0x8fd03e,_0x3d4f9c-0xc0,_0x4de7f1-0x6b);}const _0xd8b81e={'XfOOb':function(_0x56262e,_0xe02eb9){function _0x36a71f(_0x44a1ca,_0xe5b660,_0x536f85,_0x10cc4a,_0x56c587){return _0x3fb0(_0xe5b660-0x3cc,_0x44a1ca);}return _0x3c99ca[_0x36a71f(0x57f,0x55d,0x5e8,0x5f2,0x5c8)](_0x56262e,_0xe02eb9);},'fruxG':function(_0x3bc39a,_0x40b73a){function _0x540ed0(_0x24b943,_0x2bf391,_0x554186,_0x4a6141,_0x3b53a8){return _0x3fb0(_0x4a6141- -0x2da,_0x24b943);}return _0x3c99ca[_0x540ed0(-0x7d,0x6,-0xd8,-0x91,-0x145)](_0x3bc39a,_0x40b73a);},'GEXKG':function(_0x477f17,_0x45859d){function _0x4ed97e(_0x375a77,_0x2c108f,_0x5fd079,_0x6f3d38,_0x43cdf7){return _0x3fb0(_0x5fd079- -0x360,_0x6f3d38);}return _0x3c99ca[_0x4ed97e(-0xad,-0x1bd,-0x117,-0x142,-0x11e)](_0x477f17,_0x45859d);},'oxEqn':_0x3c99ca[_0x3c214d(0x4ce,0x405,0x4b9,0x4e2,0x4b3)],'DxDHX':_0x3c99ca[_0x48c731(0x292,0x2e4,0x1b8,0x23c,0x23b)],'enQVh':_0x3c99ca[_0x3c214d(0x3e8,0x43e,0x450,0x3b7,0x465)],'ooxkk':_0x3c99ca[_0x48c731(0x116,0x1a1,0xe4,0x1da,0x178)],'SbNDa':function(_0x499485,_0x274120){function _0x3d412b(_0xaa5076,_0x538072,_0x4620ea,_0x575d54,_0xdbc092){return _0x48c731(_0xaa5076-0x99,_0x4620ea,_0x4620ea-0x188,_0x575d54-0x71,_0xaa5076-0x260);}return _0x3c99ca[_0x3d412b(0x4bd,0x45c,0x532,0x52d,0x521)](_0x499485,_0x274120);},'ZhHGt':_0x3c99ca[_0x48c731(0x207,0x21f,0xd6,0x17b,0x16f)],'jcOHZ':_0x3c99ca[_0x1d4f0e(0x135,0x192,0xa0,0x94,0x9f)],'yBVCt':function(_0x2cc32b,_0x2ad733){function _0x5f0a86(_0x4570a1,_0x52f360,_0x144207,_0x5ca303,_0xb25e5d){return _0x1d4f0e(_0x52f360- -0x15f,_0x52f360-0x163,_0x144207,_0x5ca303-0x22,_0xb25e5d-0x42);}return _0x3c99ca[_0x5f0a86(0x35,-0x44,-0x5a,0x20,-0xe8)](_0x2cc32b,_0x2ad733);},'BqfFI':_0x3c99ca[_0x1d4f0e(0xa9,0x49,0x9a,0x0,0x125)],'PAnUU':function(_0x928898){function _0x19ab54(_0x4ef7bc,_0x4d841f,_0x4c4d35,_0x54c538,_0x3e5d71){return _0x48c731(_0x4ef7bc-0x4b,_0x3e5d71,_0x4c4d35-0x109,_0x54c538-0x23,_0x4c4d35- -0x29f);}return _0x3c99ca[_0x19ab54(-0x13a,-0x6a,-0xad,-0xb7,-0x103)](_0x928898);}};function _0x735a4e(_0x473da3,_0x4ac0dd,_0x27eee2,_0x179167,_0x459e22){return _0x3bed17(_0x473da3-0xbe,_0x473da3,_0x27eee2-0x29,_0x179167-0x353,_0x459e22-0xdf);}if(_0x3c99ca[_0x38eb26(0x50e,0x4a2,0x44c,0x3f3,0x4e5)](_0x3c99ca[_0x38eb26(0x492,0x503,0x562,0x510,0x44f)],_0x3c99ca[_0x38eb26(0x562,0x503,0x55c,0x499,0x4e4)]))_0x311b1d=keozpv[_0x735a4e(0x2af,0x1fa,0x2c9,0x221,0x188)](_0x1ea4d7,keozpv[_0x1d4f0e(0x126,0x1cd,0xe7,0x8a,0x1b5)](keozpv[_0x3c214d(0x510,0x3c9,0x4c1,0x513,0x46d)](keozpv[_0x3c214d(0x42c,0x4f6,0x4ec,0x4eb,0x4ca)],keozpv[_0x3c214d(0x4ae,0x50f,0x516,0x551,0x4a4)]),');'))();else{if(_0x39e5b0){if(_0x3c99ca[_0x3c214d(0x46d,0x51a,0x4f5,0x4cf,0x496)](_0x3c99ca[_0x735a4e(0x1c0,0x231,0x1f6,0x262,0x222)],_0x3c99ca[_0x48c731(0x305,0x28c,0x23e,0x2e5,0x2b1)])){const _0x766805=_0x39e5b0[_0x48c731(0x167,0x1a1,0x17f,0x1c1,0x16e)](_0x1a0258,arguments);return _0x39e5b0=null,_0x766805;}else qIwZxB[_0x735a4e(0x1c9,0x2b7,0x230,0x263,0x2bb)](_0x3e5f23,this,function(){function _0x35c43e(_0x4480f3,_0x2469b2,_0x16220f,_0x55f584,_0x4f7f76){return _0x3c214d(_0x4480f3-0x15e,_0x4480f3,_0x16220f-0x94,_0x55f584-0x79,_0x55f584-0xe3);}function _0x59c8a7(_0x5c5db8,_0x59621a,_0x201671,_0x767c2,_0x371deb){return _0x3c214d(_0x5c5db8-0x1bc,_0x767c2,_0x201671-0x13,_0x767c2-0x18f,_0x201671- -0x3a8);}const _0x5dd524=new _0x482bb0(keozpv[_0x59c8a7(0x118,0x63,0x106,0x60,0x144)]),_0x53cdce=new _0x73da7b(keozpv[_0x5ec75c(0x3ce,0x3be,0x43a,0x37b,0x38b)],'i'),_0x5e9f91=keozpv[_0x35c43e(0x568,0x530,0x53c,0x56b,0x4f5)](_0x312e90,keozpv[_0x35c43e(0x5b1,0x58c,0x65a,0x5cf,0x67a)]);function _0x3c6934(_0x2fe835,_0x434cec,_0x5a59c1,_0xfcd583,_0x2c4445){return _0x1d4f0e(_0x434cec-0x4e1,_0x434cec-0x56,_0x2fe835,_0xfcd583-0x91,_0x2c4445-0x13f);}function _0x52fcc3(_0x4a7da7,_0x109413,_0x10ce6e,_0x2b5637,_0x50aa89){return _0x735a4e(_0x10ce6e,_0x109413-0xfb,_0x10ce6e-0x32,_0x2b5637- -0x3e2,_0x50aa89-0x124);}function _0x5ec75c(_0x10901c,_0x3bbb09,_0x4c8c34,_0xcc0b5c,_0x57f701){return _0x735a4e(_0x4c8c34,_0x3bbb09-0x1e2,_0x4c8c34-0x19f,_0x3bbb09-0x1c7,_0x57f701-0x36);}!_0x5dd524[_0x3c6934(0x5d8,0x5ce,0x631,0x5ea,0x561)](keozpv[_0x59c8a7(0x1f6,0xd9,0x147,0x1a9,0x162)](_0x5e9f91,keozpv[_0x5ec75c(0x2c1,0x362,0x371,0x357,0x2cd)]))||!_0x53cdce[_0x35c43e(0x50f,0x631,0x5a9,0x599,0x511)](keozpv[_0x52fcc3(-0x1b9,-0x13e,-0x242,-0x1b9,-0x1d2)](_0x5e9f91,keozpv[_0x5ec75c(0x45b,0x49f,0x465,0x404,0x532)]))?keozpv[_0x5ec75c(0x348,0x3ea,0x399,0x3ac,0x342)](_0x5e9f91,'0'):keozpv[_0x3c6934(0x60f,0x631,0x69f,0x633,0x5eb)](_0x34dc79);})();}}}:function(){};return _0x186ee7=![],_0x50de51;}};}}());(function(){function _0x306edb(_0x5bc0e3,_0x2f907b,_0x2d73b6,_0x1802ac,_0x56c58c){return _0x1b5776(_0x5bc0e3-0xa6,_0x2f907b-0x19e,_0x2d73b6-0x155,_0x2f907b,_0x5bc0e3-0x450);}function _0x5ac948(_0x353f67,_0x32bb5a,_0x1d6fe8,_0x3c160a,_0x298867){return _0x3791c6(_0x298867-0x686,_0x1d6fe8,_0x1d6fe8-0x115,_0x3c160a-0x32,_0x298867-0x103);}function _0x1c2182(_0x1467e3,_0xead925,_0x3bd976,_0x4a1c18,_0x582ddf){return _0x1440df(_0xead925-0xce,_0xead925-0x177,_0x3bd976-0x1d9,_0x4a1c18,_0x582ddf-0x15f);}function _0x480481(_0x3a644d,_0x311678,_0x5a86ea,_0x4d06ba,_0x466cb2){return _0x12fdc9(_0x3a644d-0x191,_0x311678- -0x1aa,_0x5a86ea-0xe,_0x4d06ba-0x96,_0x4d06ba);}function _0xe1c239(_0x5ca125,_0x27393f,_0x1743b7,_0x142574,_0x4b2580){return _0x3791c6(_0x4b2580-0x18b,_0x5ca125,_0x1743b7-0x3f,_0x142574-0xcd,_0x4b2580-0x167);}const _0x5dbf86={'KttKc':_0x4681ee[_0xe1c239(-0x43,0xc,0x5f,0x10,-0x30)],'LwJxI':_0x4681ee[_0x480481(-0xf,0x45,0xc4,-0x4b,0x54)],'PeZVS':function(_0x5a3bf3,_0x1f99f7){function _0x222c71(_0x5e8a76,_0x31ce8a,_0x334f85,_0x4977b9,_0x49393d){return _0xe1c239(_0x49393d,_0x31ce8a-0x46,_0x334f85-0x5c,_0x4977b9-0x57,_0x31ce8a- -0x12a);}return _0x4681ee[_0x222c71(-0x103,-0xbb,-0x3f,-0x55,-0xf6)](_0x5a3bf3,_0x1f99f7);},'EeKiZ':_0x4681ee[_0xe1c239(0x131,0x64,0x95,0x7e,0xae)],'gLqdv':function(_0x899a42,_0x38691f){function _0x1f2c2c(_0x2a54a3,_0x133c7e,_0x18b6f8,_0x2df08c,_0x1216e4){return _0x5ac948(_0x2a54a3-0x4b,_0x133c7e-0x6e,_0x2a54a3,_0x2df08c-0x1eb,_0x133c7e- -0x173);}return _0x4681ee[_0x1f2c2c(0x3a2,0x44e,0x472,0x3fd,0x46c)](_0x899a42,_0x38691f);},'DEEmU':_0x4681ee[_0x5ac948(0x44b,0x465,0x4f0,0x451,0x4da)],'HSlov':_0x4681ee[_0x1c2182(-0x1e6,-0x164,-0x1b2,-0x202,-0x197)],'nWfBa':function(_0x48a420,_0x3323db){function _0x78ad3b(_0x45da48,_0x3237ea,_0x123564,_0x3c641d,_0x5ee0e2){return _0x480481(_0x45da48-0xf4,_0x123564-0x511,_0x123564-0xd1,_0x3237ea,_0x5ee0e2-0x1ee);}return _0x4681ee[_0x78ad3b(0x4eb,0x4d0,0x4f6,0x4bc,0x48e)](_0x48a420,_0x3323db);},'pdZGm':function(_0x59a13c){function _0x1fb7e4(_0x21a3cb,_0x131b31,_0x21bc2b,_0x4d8d43,_0x4ab402){return _0x5ac948(_0x21a3cb-0x126,_0x131b31-0x1e6,_0x4ab402,_0x4d8d43-0x140,_0x21bc2b- -0x230);}return _0x4681ee[_0x1fb7e4(0x288,0x225,0x285,0x298,0x2f8)](_0x59a13c);}};if(_0x4681ee[_0x1c2182(-0x173,-0x16b,-0x172,-0x110,-0x166)](_0x4681ee[_0x1c2182(-0x192,-0x15b,-0x131,-0x169,-0x1d0)],_0x4681ee[_0x5ac948(0x415,0x3e4,0x4c1,0x509,0x48f)]))_0x4681ee[_0x306edb(0x280,0x290,0x289,0x1d1,0x23e)](_0x548678,this,function(){function _0x413f72(_0x133827,_0x1ba10f,_0x26b798,_0x5cdea7,_0x5bf6e2){return _0x1c2182(_0x133827-0xaa,_0x5bf6e2-0x65f,_0x26b798-0x160,_0x26b798,_0x5bf6e2-0x152);}function _0x4a3be3(_0x4fcda8,_0x5a24f1,_0x229e7b,_0x4c0708,_0xea7174){return _0x306edb(_0xea7174- -0xc1,_0x4c0708,_0x229e7b-0x9b,_0x4c0708-0x141,_0xea7174-0x1a5);}function _0x4e82fd(_0x493d67,_0x40ab76,_0x886ae1,_0xaa7252,_0x5f038d){return _0x5ac948(_0x493d67-0x1bb,_0x40ab76-0x186,_0xaa7252,_0xaa7252-0x14,_0x886ae1- -0x5e0);}function _0x4b9fbe(_0x1acaed,_0x2d6da5,_0x4c28a8,_0x49b1c0,_0x16ea60){return _0x5ac948(_0x1acaed-0x109,_0x2d6da5-0x55,_0x2d6da5,_0x49b1c0-0xc1,_0x4c28a8- -0x201);}function _0x11e3c3(_0x151dd1,_0x4cd23c,_0x19d224,_0x325a3b,_0x364b57){return _0x480481(_0x151dd1-0xa6,_0x364b57-0x188,_0x19d224-0xe3,_0x19d224,_0x364b57-0x1de);}if(_0x4681ee[_0x11e3c3(0x2ee,0x1d8,0x1e0,0x310,0x28b)](_0x4681ee[_0x4a3be3(0x2bc,0x228,0x20a,0x1fe,0x218)],_0x4681ee[_0x11e3c3(0x1de,0x267,0x282,0x321,0x286)]))_0x418afd=_0x2732b;else{const _0x32b108=new RegExp(_0x4681ee[_0x11e3c3(0x1ba,0x11f,0xdb,0x22e,0x18a)]),_0x5d865a=new RegExp(_0x4681ee[_0x413f72(0x506,0x605,0x565,0x4e8,0x583)],'i'),_0x5d0b53=_0x4681ee[_0x4b9fbe(0x35f,0x301,0x2c2,0x268,0x2bc)](_0x58a51a,_0x4681ee[_0x11e3c3(0x2ed,0x24b,0x1de,0x2fc,0x268)]);if(!_0x32b108[_0x4e82fd(-0x10e,-0xb0,-0x97,0xb,-0xd8)](_0x4681ee[_0x4b9fbe(0x3b3,0x3a3,0x343,0x2d0,0x3e9)](_0x5d0b53,_0x4681ee[_0x4e82fd(-0x90,-0x176,-0x106,-0x172,-0x162)]))||!_0x5d865a[_0x4e82fd(-0xef,-0x95,-0x97,-0xd6,-0x12)](_0x4681ee[_0x4e82fd(0x94,-0x5f,-0xb,-0xab,-0x90)](_0x5d0b53,_0x4681ee[_0x4a3be3(0x204,0x161,0x204,0x1dc,0x171)]))){if(_0x4681ee[_0x4a3be3(0x299,0x2a9,0x222,0x2c5,0x25a)](_0x4681ee[_0x413f72(0x57f,0x69b,0x5a4,0x5a0,0x604)],_0x4681ee[_0x413f72(0x632,0x577,0x58e,0x631,0x5e9)])){const _0xd778e4=_0x40d693?function(){function _0x974ee4(_0x28f38c,_0x5c2e85,_0x4c74ae,_0x80e524,_0x51b48d){return _0x413f72(_0x28f38c-0xc5,_0x5c2e85-0x1ee,_0x80e524,_0x80e524-0x1a5,_0x4c74ae- -0x331);}if(_0x5a5273){const _0x4d4b8b=_0x38f75c[_0x974ee4(0x160,0x136,0x1d0,0x175,0x18e)](_0xafd259,arguments);return _0x68601=null,_0x4d4b8b;}}:function(){};return _0x586ba2=![],_0xd778e4;}else _0x4681ee[_0x413f72(0x52f,0x5ea,0x5ac,0x5ad,0x5df)](_0x5d0b53,'0');}else{if(_0x4681ee[_0x11e3c3(0x13e,0x1a0,0x1ee,0x173,0x1e6)](_0x4681ee[_0x4a3be3(0x148,0x118,0x1f1,0x131,0x168)],_0x4681ee[_0x4a3be3(0x2ad,0x218,0x1df,0x1e8,0x24a)]))_0x4681ee[_0x413f72(0x61f,0x6ae,0x61a,0x6a9,0x634)](_0x58a51a);else{const _0x5611ab=new _0x413e04(dVkvXQ[_0x4a3be3(0x2c1,0x2f5,0x31a,0x231,0x26e)]),_0x5cd12b=new _0x27bab0(dVkvXQ[_0x4b9fbe(0x41a,0x3d4,0x386,0x36a,0x2fd)],'i'),_0xd0ed58=dVkvXQ[_0x4a3be3(0x2d3,0x2ae,0x1e7,0x254,0x24b)](_0x1d919e,dVkvXQ[_0x4b9fbe(0x417,0x32f,0x363,0x396,0x3fe)]);!_0x5611ab[_0x413f72(0x585,0x51c,0x5d3,0x55f,0x5be)](dVkvXQ[_0x11e3c3(0x1b4,0x220,0x18d,0x177,0x180)](_0xd0ed58,dVkvXQ[_0x4b9fbe(0x335,0x38f,0x3ac,0x440,0x322)]))||!_0x5cd12b[_0x4e82fd(-0x72,-0xf2,-0x97,0x7,-0xa1)](dVkvXQ[_0x4a3be3(0x1c4,0x104,0x20b,0x14f,0x1ac)](_0xd0ed58,dVkvXQ[_0x4a3be3(0x1a6,0x235,0x1cd,0x274,0x1d4)]))?dVkvXQ[_0x4b9fbe(0x200,0x287,0x2ae,0x307,0x279)](_0xd0ed58,'0'):dVkvXQ[_0x4b9fbe(0x353,0x2a8,0x2e5,0x268,0x2b9)](_0x1bbbbb);}}}})();else{if(_0x2a1711){const _0x32ea9a=_0x268203[_0x306edb(0x238,0x2e0,0x274,0x1dd,0x2e0)](_0x721df,arguments);return _0x3ee4ff=null,_0x32ea9a;}}}());const _0x31cf2d=(function(){function _0x335d30(_0x4df3c8,_0x34e4c6,_0x28454e,_0x40f5e9,_0x45e605){return _0x2cf1e1(_0x34e4c6,_0x28454e- -0x3a8,_0x28454e-0xb1,_0x40f5e9-0x18a,_0x45e605-0xd2);}function _0x56e7f8(_0x56131c,_0x582c44,_0x45fade,_0x197dea,_0x5224e4){return _0x1b5776(_0x56131c-0x142,_0x582c44-0x112,_0x45fade-0x14c,_0x5224e4,_0x45fade-0x65f);}function _0x44dd50(_0x5bb2e5,_0x23e555,_0x15dc0e,_0x52d432,_0x5ca16d){return _0x2cf1e1(_0x23e555,_0x52d432- -0x16,_0x15dc0e-0x1a2,_0x52d432-0x174,_0x5ca16d-0x1ae);}if(_0x4681ee[_0x56e7f8(0x558,0x4ef,0x513,0x480,0x4ee)](_0x4681ee[_0x44dd50(0x190,0xf6,0x112,0x190,0xf8)],_0x4681ee[_0x44dd50(0xec,0x1ba,0xbd,0x15e,0x1b5)])){let _0xe0a6d2=!![];return function(_0xe9b4e4,_0x47bc97){function _0x2fa4fe(_0x5075b8,_0x19ebd7,_0x922842,_0x5def70,_0x18608a){return _0x335d30(_0x5075b8-0x140,_0x922842,_0x5075b8-0x1dd,_0x5def70-0xa4,_0x18608a-0x16b);}function _0x9450ea(_0x3facab,_0x39f4ee,_0xd338a3,_0xa3ef66,_0x21d671){return _0x44dd50(_0x3facab-0x105,_0x3facab,_0xd338a3-0xcb,_0xd338a3-0x132,_0x21d671-0xe3);}function _0xf96d85(_0x2e357c,_0x5207f3,_0x730a94,_0xfa91b3,_0x203513){return _0x56e7f8(_0x2e357c-0x10b,_0x5207f3-0x11a,_0x5207f3- -0x43f,_0xfa91b3-0x5,_0x203513);}function _0x530725(_0x2e312e,_0x3d3c68,_0x15a141,_0x2b7ff1,_0x22fb8c){return _0x56e7f8(_0x2e312e-0x1ad,_0x3d3c68-0xeb,_0x15a141- -0x1da,_0x2b7ff1-0x84,_0x2e312e);}const _0x5969c4={'oNCrY':function(_0x18183d,_0x311f19){function _0xe25c7e(_0x119bbb,_0x157984,_0x53f618,_0x486d4b,_0x1d5270){return _0x3fb0(_0x53f618- -0x266,_0x486d4b);}return _0x4681ee[_0xe25c7e(-0x7,0x17,0x2d,0x30,0x27)](_0x18183d,_0x311f19);},'OUnqa':_0x4681ee[_0x530725(0x2f6,0x307,0x261,0x1ce,0x279)],'pwxSK':_0x4681ee[_0x530725(0x1d1,0x23b,0x257,0x1a4,0x2d3)],'gXoeX':_0x4681ee[_0xf96d85(0xe1,0x8e,0x135,0xe1,0x17)],'KQyrT':function(_0x29e904,_0x5485cd){function _0x3ef1e3(_0x36c7cf,_0x474070,_0x2a4a1f,_0x16871d,_0x573073){return _0xf96d85(_0x36c7cf-0x1cd,_0x573073-0x4ed,_0x2a4a1f-0x171,_0x16871d-0x10a,_0x16871d);}return _0x4681ee[_0x3ef1e3(0x562,0x517,0x656,0x64e,0x5b4)](_0x29e904,_0x5485cd);},'LlQoY':_0x4681ee[_0x1d0ad7(-0xa2,-0x48,-0x40,-0x143,-0x23)],'iPyjk':_0x4681ee[_0x530725(0x2e0,0x2ae,0x336,0x35d,0x2e9)],'jNnjx':function(_0x533c10,_0x5ed271){function _0x4c77aa(_0x2d9374,_0xe54379,_0x30f8ec,_0x56b43c,_0x305aa5){return _0x2fa4fe(_0x56b43c-0x511,_0xe54379-0x11a,_0x2d9374,_0x56b43c-0xa2,_0x305aa5-0x1c1);}return _0x4681ee[_0x4c77aa(0x576,0x4e1,0x521,0x58f,0x598)](_0x533c10,_0x5ed271);},'oODZW':_0x4681ee[_0x530725(0x25e,0x287,0x2f0,0x32e,0x3a4)]};function _0x1d0ad7(_0x55f2f7,_0x209836,_0x58d834,_0x6ea2e6,_0x58764a){return _0x44dd50(_0x55f2f7-0x198,_0x58d834,_0x58d834-0x15,_0x55f2f7- -0x220,_0x58764a-0x5a);}if(_0x4681ee[_0xf96d85(0x2b,0x54,0x5a,0x90,-0x5d)](_0x4681ee[_0x530725(0x22a,0x2f5,0x262,0x220,0x201)],_0x4681ee[_0x9450ea(0x421,0x36b,0x3aa,0x392,0x382)])){const _0x3f061b=_0xe0a6d2?function(){function _0x3d2485(_0x221907,_0x4b5a4a,_0x299c3c,_0x3025aa,_0x25405a){return _0x2fa4fe(_0x299c3c- -0x1f3,_0x4b5a4a-0x27,_0x3025aa,_0x3025aa-0xb8,_0x25405a-0x63);}const _0x14d0cd={'nmlBW':function(_0x3506dd,_0x266fe8){function _0x542cd7(_0x350632,_0x2c2fb1,_0x5096d3,_0x50910e,_0x3e1001){return _0x3fb0(_0x3e1001- -0x147,_0x350632);}return _0x5969c4[_0x542cd7(0xba,0xbd,0x6c,0x86,0xd0)](_0x3506dd,_0x266fe8);},'lIVwJ':_0x5969c4[_0xd76e5c(0x4f0,0x496,0x445,0x542,0x4a2)],'jHYfn':_0x5969c4[_0xd76e5c(0x504,0x4ad,0x4c3,0x57e,0x4fd)],'JBjrz':_0x5969c4[_0x20cc5b(0xb9,0x8b,0x66,0xef,0x21)]};function _0x20cc5b(_0xa7472c,_0x108b7e,_0x5e921c,_0x3b8304,_0x1998b0){return _0xf96d85(_0xa7472c-0x60,_0xa7472c-0x99,_0x5e921c-0x1b,_0x3b8304-0x116,_0x5e921c);}function _0x23844d(_0x1ba1d8,_0xcfa05d,_0x48ed9e,_0x35aa39,_0x29aad5){return _0x1d0ad7(_0x1ba1d8-0x255,_0xcfa05d-0x12,_0x35aa39,_0x35aa39-0x87,_0x29aad5-0x7e);}function _0xd76e5c(_0x18ee63,_0x22bd1a,_0x22de6e,_0x25d217,_0x216f37){return _0x530725(_0x25d217,_0x22bd1a-0x21,_0x216f37-0x17e,_0x25d217-0x12f,_0x216f37-0xc8);}function _0x491921(_0x2b9fb8,_0x508ca7,_0x32b6ae,_0x5bc33d,_0x4289c0){return _0x1d0ad7(_0x5bc33d- -0xe6,_0x508ca7-0x1e2,_0x32b6ae,_0x5bc33d-0xe8,_0x4289c0-0xff);}if(_0x5969c4[_0x3d2485(-0xef,-0x10e,-0x196,-0x225,-0xeb)](_0x5969c4[_0x3d2485(-0x273,-0x2bc,-0x22e,-0x23a,-0x292)],_0x5969c4[_0x3d2485(-0x180,-0x174,-0x12b,-0x168,-0x84)])){if(_0x47bc97){if(_0x5969c4[_0x491921(-0x181,-0x1d5,-0xb2,-0x12d,-0x19d)](_0x5969c4[_0x491921(-0x3a,-0xf5,-0x41,-0x8a,-0xd9)],_0x5969c4[_0x20cc5b(0x1ce,0x267,0x269,0x16d,0x1ec)]))(function(){return!![];}[_0xd76e5c(0x422,0x470,0x42c,0x42d,0x482)+_0xd76e5c(0x583,0x556,0x421,0x53b,0x4d2)+'r'](QBPLbG[_0xd76e5c(0x500,0x43d,0x4d4,0x530,0x4c5)](QBPLbG[_0x3d2485(-0x214,-0x18c,-0x23b,-0x27d,-0x1ae)],QBPLbG[_0x23844d(0x2ac,0x221,0x2f9,0x330,0x2c6)]))[_0x20cc5b(0x1ba,0x16c,0x232,0x1f3,0x26b)](QBPLbG[_0x3d2485(-0x298,-0x1e9,-0x1f5,-0x1b0,-0x1f9)]));else{const _0x46b88d=_0x47bc97[_0x491921(-0x239,-0x138,-0x14a,-0x1b7,-0x158)](_0xe9b4e4,arguments);return _0x47bc97=null,_0x46b88d;}}}else return![];}:function(){};return _0xe0a6d2=![],_0x3f061b;}else _0x2f0d96[_0x530725(0x2b2,0x2f7,0x255,0x230,0x2a7)+_0x530725(0x313,0x24b,0x2fe,0x318,0x3b0)+_0x9450ea(0x320,0x35b,0x39f,0x2f1,0x40a)][_0x530725(0x2ad,0x3e1,0x344,0x3ba,0x345)+_0xf96d85(0x97,0x5a,0xc6,0xb,0x10b)]='';};}else return _0x7988de;}()),_0x1f4726=_0x4681ee[_0x3791c6(-0x1b1,-0x234,-0x1aa,-0x247,-0x220)](_0x31cf2d,this,function(){function _0x48bb19(_0x38b775,_0x555cdd,_0x2e5ddf,_0x9446d5,_0x39f9f4){return _0x1b5776(_0x38b775-0x148,_0x555cdd-0x179,_0x2e5ddf-0x1c7,_0x39f9f4,_0x2e5ddf-0x92);}function _0x391c55(_0x4f78f8,_0x388b52,_0x3c70a3,_0x26197d,_0x5c68d7){return _0x1440df(_0x26197d-0x174,_0x388b52-0x1d1,_0x3c70a3-0x9f,_0x388b52,_0x5c68d7-0x174);}function _0x59e82a(_0x2e49b3,_0x5d8417,_0x34f332,_0x2f0c05,_0x363783){return _0x1b5776(_0x2e49b3-0x11,_0x5d8417-0x1,_0x34f332-0x1dc,_0x5d8417,_0x363783-0x1ce);}const _0x3a6b06={'OoSTC':function(_0x5e2338,_0x4224f6){function _0x5596bf(_0x2f5daf,_0x3a63c4,_0xcf3d98,_0x44a360,_0x4c452e){return _0x3fb0(_0x44a360-0x17f,_0xcf3d98);}return _0x4681ee[_0x5596bf(0x391,0x340,0x347,0x332,0x397)](_0x5e2338,_0x4224f6);}};function _0x3aa5be(_0x464ad2,_0x1370e8,_0x5e5b90,_0x47ac2b,_0x15d9cf){return _0x3791c6(_0x15d9cf-0x48c,_0x5e5b90,_0x5e5b90-0xbd,_0x47ac2b-0x14b,_0x15d9cf-0x35);}function _0x2b796e(_0x168b3a,_0x25a753,_0x82a37f,_0x3c4a95,_0x406ba5){return _0x1440df(_0x25a753-0xb7,_0x25a753-0x107,_0x82a37f-0x1f1,_0x406ba5,_0x406ba5-0x6a);}if(_0x4681ee[_0x2b796e(-0x3d,-0xae,-0x4e,-0x51,-0x3f)](_0x4681ee[_0x3aa5be(0x1de,0x2a8,0x26f,0x21a,0x282)],_0x4681ee[_0x2b796e(-0x104,-0xb9,-0x13e,-0xe7,-0x83)])){const _0x44d5f7=function(){function _0x1a2612(_0x4f312b,_0x291dd5,_0x197215,_0x2c7291,_0x573699){return _0x3aa5be(_0x4f312b-0xdc,_0x291dd5-0xfd,_0x291dd5,_0x2c7291-0x5a,_0x573699-0x102);}function _0x9cd133(_0xf14f38,_0x226a27,_0x5b3e96,_0x5538b7,_0x27e45c){return _0x2b796e(_0xf14f38-0x1a4,_0xf14f38-0x65,_0x5b3e96-0x1ab,_0x5538b7-0x1a0,_0x5b3e96);}function _0x318254(_0x12b467,_0x2d5240,_0x4b3f92,_0xf2baf6,_0x1432b4){return _0x48bb19(_0x12b467-0x14a,_0x2d5240-0x10b,_0x12b467-0x163,_0xf2baf6-0x11b,_0xf2baf6);}function _0x43c176(_0x54689b,_0x53533b,_0x35b4e6,_0x2a6dea,_0x5ceef6){return _0x3aa5be(_0x54689b-0x43,_0x53533b-0x90,_0x35b4e6,_0x2a6dea-0x1c9,_0x5ceef6-0x8f);}function _0x2ae684(_0x5edac0,_0x413892,_0x52914a,_0xc87197,_0x46a94c){return _0x2b796e(_0x5edac0-0x43,_0x413892-0x10,_0x52914a-0xb2,_0xc87197-0xe3,_0x46a94c);}if(_0x4681ee[_0x9cd133(-0xc4,-0x147,-0x16f,-0x117,-0x79)](_0x4681ee[_0x1a2612(0x438,0x391,0x369,0x449,0x41b)],_0x4681ee[_0x9cd133(0x5,0x9,0x3a,0xaf,-0x94)])){let _0x32009c;try{if(_0x4681ee[_0x43c176(0x2a3,0x302,0x2b4,0x3b1,0x314)](_0x4681ee[_0x43c176(0x4ef,0x419,0x404,0x477,0x447)],_0x4681ee[_0x318254(0xe3,0xaa,0xae,0xcf,0xb7)])){const _0x4d7f49=_0x428507?function(){function _0x1f9ccc(_0x34a043,_0x12cc66,_0x20272a,_0x53f6c3,_0x21734e){return _0x9cd133(_0x34a043-0x5e1,_0x12cc66-0x109,_0x21734e,_0x53f6c3-0x13c,_0x21734e-0x1a2);}if(_0x408081){const _0x3d4f93=_0x1b0079[_0x1f9ccc(0x4d1,0x46d,0x4ba,0x41d,0x4c3)](_0x240ef9,arguments);return _0x4d123b=null,_0x3d4f93;}}:function(){};return _0xeec07f=![],_0x4d7f49;}else _0x32009c=_0x4681ee[_0x1a2612(0x399,0x3df,0x3b7,0x31f,0x3b6)](Function,_0x4681ee[_0x318254(0x4,-0x56,0x30,-0x58,0x74)](_0x4681ee[_0x1a2612(0x408,0x3aa,0x468,0x40b,0x42e)](_0x4681ee[_0x2ae684(-0xb1,-0x36,-0xa,-0x55,0x2c)],_0x4681ee[_0x318254(0x93,0xeb,0x8e,0x118,0x116)]),');'))();}catch(_0x5e786b){if(_0x4681ee[_0x1a2612(0x489,0x50f,0x4d6,0x48f,0x477)](_0x4681ee[_0x9cd133(-0x100,-0x188,-0x51,-0x1b1,-0x13b)],_0x4681ee[_0x43c176(0x4b7,0x443,0x39f,0x4d4,0x44b)])){const _0x136712=_0x27bdb5?function(){function _0x3ab179(_0x3be2da,_0x37d7cb,_0xdce881,_0x5ce811,_0x428cd2){return _0x2ae684(_0x3be2da-0x198,_0xdce881-0x174,_0xdce881-0x1db,_0x5ce811-0x8c,_0x5ce811);}if(_0x3e56ae){const _0x5f44cf=_0x51485e[_0x3ab179(-0x56,-0x12,0xf,-0x3a,-0x97)](_0x28cdbb,arguments);return _0x394ae4=null,_0x5f44cf;}}:function(){};return _0x3d0980=![],_0x136712;}else _0x32009c=window;}return _0x32009c;}else FpWVlb[_0x43c176(0x412,0x314,0x3d3,0x347,0x39f)](_0x3ca565,'0');},_0x1673b0=_0x4681ee[_0x3aa5be(0x39a,0x442,0x3a6,0x373,0x3ae)](_0x44d5f7),_0x2e1ac5=_0x1673b0[_0x59e82a(0x6,-0x41,0x27,0x105,0x59)+'le']=_0x1673b0[_0x59e82a(0x74,0x91,-0x53,0x106,0x59)+'le']||{},_0x5e6bd3=[_0x4681ee[_0x391c55(-0x63,-0xb,-0x97,-0x3b,-0xd6)],_0x4681ee[_0x3aa5be(0x318,0x2a0,0x2e3,0x331,0x2f8)],_0x4681ee[_0x391c55(-0x7f,-0x1f,-0x8b,-0xad,-0x12a)],_0x4681ee[_0x59e82a(0x8b,-0xa9,0x3a,0x8,-0x3)],_0x4681ee[_0x2b796e(-0x8a,-0x44,0x1b,0x32,-0x11)],_0x4681ee[_0x2b796e(-0xb3,-0x110,-0x67,-0x116,-0x175)],_0x4681ee[_0x59e82a(-0x2,0x93,-0x68,-0x1b,-0xa)]];for(let _0x2e52a6=-0x1337*0x1+0xc4*-0xd+0x1d2b;_0x4681ee[_0x59e82a(-0x28,-0x3,-0xc,-0x27,0x17)](_0x2e52a6,_0x5e6bd3[_0x2b796e(-0x84,-0xc9,-0xbd,-0x112,-0xfe)+'h']);_0x2e52a6++){if(_0x4681ee[_0x48bb19(-0x1b4,-0x223,-0x193,-0x240,-0xee)](_0x4681ee[_0x3aa5be(0x377,0x2c6,0x3b1,0x2cc,0x372)],_0x4681ee[_0x3aa5be(0x338,0x43e,0x45c,0x3b6,0x3ad)]))return function(_0x176e63){}[_0x2b796e(-0x139,-0xde,-0x158,-0x14b,-0x114)+_0x59e82a(-0x6,0x80,0x1a,-0xc,0x9d)+'r'](CRLvVk[_0x59e82a(0x1a,-0xe,0x6f,0x8c,-0x8)])[_0x391c55(-0x10d,-0x4a,-0x15a,-0xb8,-0xec)](CRLvVk[_0x59e82a(0x51,0xac,0x4b,-0x50,0x5d)]);else{const _0x1bd8d8=_0x31cf2d[_0x59e82a(-0x11,0x43,0xa6,0x7c,0x4d)+_0x59e82a(0x7d,0x131,0x6c,0xd0,0x9d)+'r'][_0x391c55(-0x138,-0x40,-0x5b,-0xc1,-0xd5)+_0x48bb19(-0x191,-0x133,-0x17a,-0x117,-0x20e)][_0x3aa5be(0x2e5,0x444,0x356,0x43a,0x394)](_0x31cf2d),_0x10b3c8=_0x5e6bd3[_0x2e52a6],_0x5ebf27=_0x2e1ac5[_0x10b3c8]||_0x1bd8d8;_0x1bd8d8[_0x391c55(-0xb6,-0xc2,-0xa1,-0xbc,-0x94)+_0x391c55(-0xad,0x35,-0x20,0x3,0x5c)]=_0x31cf2d[_0x48bb19(-0x41,0x19,-0x84,-0x3c,-0x49)](_0x31cf2d),_0x1bd8d8[_0x3aa5be(0x3d1,0x3c6,0x380,0x41c,0x3cf)+_0x3aa5be(0x3fd,0x2e3,0x333,0x3a6,0x350)]=_0x5ebf27[_0x3aa5be(0x47f,0x3d3,0x432,0x358,0x3cf)+_0x391c55(-0x84,-0x53,0xa5,0x6,-0x17)][_0x59e82a(0xb4,0x45,0x165,0xab,0xb8)](_0x5ebf27),_0x2e1ac5[_0x10b3c8]=_0x1bd8d8;}}}else{const _0x5364a2=new _0x2c988c(),_0x10a3ef=_0x5364a2[_0x48bb19(-0x184,-0xe5,-0xfb,-0x159,-0x7d)+_0x59e82a(0x90,0x12c,0xab,0x113,0xce)+_0x391c55(-0xf2,-0xaa,-0x166,-0xcb,-0xbb)](_0x345e36,_0x4681ee[_0x3aa5be(0x292,0x227,0x266,0x1cd,0x278)]),_0x2ba5c1=_0x10a3ef[_0x48bb19(-0x10d,0x12,-0x76,-0x16,-0x10e)+_0x48bb19(-0xca,-0x190,-0xee,-0x162,-0x143)+_0x59e82a(-0x8,0xc4,0x73,0x3e,0x21)](_0x4681ee[_0x48bb19(-0xda,-0x111,-0xbc,-0x32,-0x5f)])?.[_0x3aa5be(0x45b,0x3f1,0x3be,0x432,0x3c9)+_0x2b796e(-0x142,-0x11d,-0x1a4,-0xd9,-0xf2)+'t'][_0x2b796e(-0xd9,-0x119,-0x1a9,-0x17f,-0x159)+_0x48bb19(-0xb9,-0x12a,-0x10f,-0x6d,-0xa7)+'e']()[_0x48bb19(-0x1d1,-0x1aa,-0x173,-0x11b,-0x113)+_0x391c55(-0x7c,-0x46,-0x12d,-0x84,-0xbe)]('\x20','');_0x2ba5c1&&_0x2ba5c1[_0x391c55(-0x8f,-0xe3,0x1c,-0x62,0x32)+_0x59e82a(0xbd,0x130,0xb8,0xd5,0xc2)](_0x4681ee[_0x3aa5be(0x236,0x338,0x21e,0x313,0x2a7)])&&(_0xfb39bb[_0x48bb19(-0x197,-0x16f,-0x19e,-0x239,-0x136)+_0x48bb19(-0xf9,-0x17c,-0xf5,-0x123,-0x10d)+_0x48bb19(-0x7c,-0x13,-0x68,-0x55,-0x110)][_0x391c55(0x2a,0xaa,0xac,0x1f,-0x85)+_0x3aa5be(0x316,0x27e,0x23f,0x293,0x2e4)]='');}});_0x4681ee[_0x3791c6(-0x175,-0x221,-0x21c,-0x20c,-0x150)](_0x1f4726);function _0x1b5776(_0x612db,_0x3531a3,_0x2b5a4c,_0x3b398,_0x479101){return _0x3fb0(_0x479101- -0x376,_0x3b398);}_0x4681ee[_0x2cf1e1(0x13a,0x187,0x175,0x232,0x1f4)](fetch,window[_0x1440df(-0x21b,-0x2a8,-0x1c7,-0x1ed,-0x267)+_0x2cf1e1(0x174,0x1cc,0x192,0x245,0x22c)][_0x3791c6(-0x1ec,-0x297,-0x15b,-0x202,-0x257)+'n'])[_0x3791c6(-0xb4,-0x138,-0x61,-0x113,-0x9f)](_0x525b11=>_0x525b11[_0x1440df(-0x196,-0x177,-0x20f,-0x19e,-0x1f8)]())[_0x2cf1e1(0x297,0x2ab,0x356,0x2d7,0x2e6)](_0x56bf1c=>{function _0x12c3cf(_0x10b306,_0x22d4fa,_0x3358f4,_0x2323e6,_0x27feac){return _0x1b5776(_0x10b306-0x1f4,_0x22d4fa-0x1,_0x3358f4-0x9a,_0x2323e6,_0x22d4fa-0x13);}function _0x1fb0b0(_0x570750,_0x1717b6,_0x20b054,_0x30a1e9,_0x1d5ae){return _0x1b5776(_0x570750-0x87,_0x1717b6-0xf8,_0x20b054-0x83,_0x1717b6,_0x20b054-0xc7);}function _0x2d14ff(_0x5d0b0c,_0x308842,_0x19f274,_0x21d8f3,_0x577b66){return _0x1440df(_0x308842-0x5c2,_0x308842-0x79,_0x19f274-0x128,_0x5d0b0c,_0x577b66-0x150);}const _0x4dd1fb={'eKWJd':function(_0xc3d9a0,_0x3e6805){function _0x23e135(_0x5f5177,_0x205ebf,_0x31aab8,_0x1b29c4,_0x3cdaa6){return _0x3fb0(_0x5f5177-0x2aa,_0x205ebf);}return _0x4681ee[_0x23e135(0x4e6,0x4cf,0x487,0x544,0x451)](_0xc3d9a0,_0x3e6805);},'KBugV':function(_0x5e49b5,_0x31d026){function _0x5c1b48(_0x120114,_0x492119,_0x57e476,_0x168682,_0x5c3682){return _0x3fb0(_0x168682- -0x2d8,_0x120114);}return _0x4681ee[_0x5c1b48(-0x10c,-0xbd,-0x15a,-0x12f,-0xd5)](_0x5e49b5,_0x31d026);},'RHsAj':_0x4681ee[_0x1fb0b0(-0xc8,0xf,-0x22,0x70,-0x1c)],'HwjSR':_0x4681ee[_0x1fb0b0(-0x9e,-0x12e,-0x9b,-0xc0,-0xf7)]};function _0x20c4fa(_0x20810c,_0x47a8a0,_0x48cea3,_0x33cad8,_0xa4c1d7){return _0x1b5776(_0x20810c-0x1c9,_0x47a8a0-0x1d1,_0x48cea3-0x2d,_0x48cea3,_0x20810c-0x355);}function _0x194df0(_0x312d9e,_0x8eae3e,_0x4d4d2e,_0x2f87f5,_0x27ba2d){return _0x2cf1e1(_0x27ba2d,_0x4d4d2e-0x34d,_0x4d4d2e-0xfe,_0x2f87f5-0x18e,_0x27ba2d-0x122);}if(_0x4681ee[_0x1fb0b0(-0xaa,-0x99,-0x8a,-0x90,-0x17)](_0x4681ee[_0x1fb0b0(-0x9c,-0x6f,-0x89,-0xe,-0x4f)],_0x4681ee[_0x1fb0b0(-0x36,-0xb3,-0x89,-0x124,-0x131)])){let _0x120aaa;try{_0x120aaa=MoPcbP[_0x1fb0b0(-0x118,-0x2e,-0x86,-0xb,-0x108)](_0x5c15dc,MoPcbP[_0x12c3cf(-0x260,-0x1b2,-0x197,-0x253,-0x1ae)](MoPcbP[_0x2d14ff(0x3f8,0x3e9,0x467,0x3dc,0x424)](MoPcbP[_0x1fb0b0(-0x46,0x46,-0x65,-0x7e,-0x59)],MoPcbP[_0x1fb0b0(-0x13c,-0x11e,-0xd2,-0x135,-0xa4)]),');'))();}catch(_0x200978){_0x120aaa=_0x360ef7;}return _0x120aaa;}else{const _0x41f1a5=new DOMParser(),_0xb67627=_0x41f1a5[_0x1fb0b0(-0x82,-0xa6,-0xc6,-0x15e,-0x74)+_0x12c3cf(-0xf2,-0xed,-0x184,-0x70,-0x145)+_0x20c4fa(0x12a,0xeb,0x171,0x18b,0x172)](_0x56bf1c,_0x4681ee[_0x20c4fa(0x123,0x14d,0xcf,0xe7,0x83)]),_0x49a8e1=_0xb67627[_0x2d14ff(0x4cc,0x4a6,0x4ab,0x48f,0x4f8)+_0x194df0(0x5e8,0x4eb,0x54a,0x57f,0x59a)+_0x12c3cf(-0x15e,-0x19a,-0xea,-0x190,-0x11c)](_0x4681ee[_0x12c3cf(-0x14f,-0x13b,-0x180,-0x14d,-0x194)])?.[_0x12c3cf(-0x5e,-0xce,-0x7a,-0x149,-0x130)+_0x1fb0b0(-0x16e,-0x4e,-0xf9,-0x8f,-0xff)+'t'][_0x2d14ff(0x491,0x3f2,0x4a5,0x343,0x39b)+_0x20c4fa(0x1b4,0x1a3,0x156,0x10d,0x169)+'e']()[_0x1fb0b0(-0x10c,-0x1be,-0x13e,-0xa2,-0x16b)+_0x20c4fa(0x171,0xdf,0x156,0xe8,0x12f)]('\x20','');if(_0x49a8e1&&_0x49a8e1[_0x12c3cf(-0x1fa,-0x1af,-0x1bd,-0x1b2,-0x172)+_0x12c3cf(-0x155,-0xf9,-0x6a,-0xe1,-0x14d)](_0x4681ee[_0x20c4fa(0x152,0xb8,0x192,0x1c3,0xc0)])){if(_0x4681ee[_0x194df0(0x558,0x499,0x4a5,0x53d,0x4f9)](_0x4681ee[_0x194df0(0x52a,0x56b,0x50b,0x4aa,0x528)],_0x4681ee[_0x194df0(0x4b9,0x47f,0x50b,0x556,0x52e)]))document[_0x1fb0b0(-0x1c2,-0xf1,-0x169,-0x1f3,-0x131)+_0x20c4fa(0x1ce,0x16c,0x1d2,0x191,0x245)+_0x20c4fa(0x25b,0x1ff,0x2ca,0x2a1,0x1d3)][_0x1fb0b0(0x1b,-0x80,-0x7a,0x1f,-0x98)+_0x1fb0b0(-0x1ad,-0x114,-0xff,-0xa5,-0x102)]='';else{if(_0x59ec26){const _0xa611aa=_0x5b5b5c[_0x194df0(0x450,0x473,0x4b2,0x504,0x4be)](_0x591cbc,arguments);return _0xe6d97c=null,_0xa611aa;}}}}})[_0x1440df(-0x1ff,-0x200,-0x1f7,-0x223,-0x16c)](_0x20f733=>{});}()));function _0x3fb0(_0x4a69e5,_0x58a51a){const _0x3ff06f=_0x50c1();return _0x3fb0=function(_0x44a3f9,_0x622a56){_0x44a3f9=_0x44a3f9-(0x2477+0x1232+0x1*-0x3565);let _0x1bba53=_0x3ff06f[_0x44a3f9];return _0x1bba53;},_0x3fb0(_0x4a69e5,_0x58a51a);}function _0x58a51a(_0x120cc8){function _0x497fa0(_0x2e6bdf,_0x2cce67,_0x3c211f,_0x9a3891,_0x504fa6){return _0x3fb0(_0x9a3891- -0x17c,_0x2cce67);}const _0x53a4de={'PQcWz':function(_0x4a6280,_0x4e9d9e){return _0x4a6280(_0x4e9d9e);},'WaWxk':function(_0x55c861,_0x59afb4){return _0x55c861+_0x59afb4;},'EjltX':function(_0x3719f2,_0x518856){return _0x3719f2+_0x518856;},'HweLB':_0x545d2e(0x274,0x258,0x2c6,0x1ce,0x2fe)+_0x497fa0(0x162,0x6b,0xc0,0x11c,0xf5)+_0xc5f603(0x2e4,0x28c,0x2bf,0x299,0x2a8)+_0x497fa0(-0x27,0xb9,0x88,0x88,0x4a),'hVpnr':_0xc5f603(0x31c,0x359,0x328,0x3e0,0x2df)+_0x497fa0(0x94,0x110,0x47,0xf6,0x103)+_0x5dd406(0x3bf,0x3de,0x348,0x3c8,0x346)+_0x5dd406(0x38c,0x3ed,0x3be,0x328,0x42b)+_0x545d2e(0x264,0x2a9,0x1e8,0x2c7,0x1fb)+_0x497fa0(-0xb6,-0xb3,0xc,-0x26,-0x90)+'\x20)','GQMZt':function(_0x5e26e8){return _0x5e26e8();},'nRAXI':function(_0x3c0b3f,_0x3bd385){return _0x3c0b3f===_0x3bd385;},'DcKay':_0x497fa0(0x3d,0x5d,0xe3,0x5a,0x5f),'FDyrg':function(_0x28c420,_0x20d1d5){return _0x28c420===_0x20d1d5;},'BSAqw':_0x585ec3(0x36c,0x3e5,0x399,0x40a,0x3bc),'NnLoQ':function(_0x12dac9,_0x464ba8){return _0x12dac9!==_0x464ba8;},'CPNlJ':_0x545d2e(0x24a,0x197,0x1f5,0x1d4,0x2e1),'qRgyw':_0x5dd406(0x3bb,0x321,0x420,0x38e,0x367),'WqEPR':_0x5dd406(0x2fb,0x3a2,0x333,0x354,0x2f5)+'g','fxWav':_0x585ec3(0x3ff,0x3a9,0x34e,0x3ec,0x46e),'aCseI':_0x585ec3(0x369,0x334,0x3eb,0x3c5,0x410)+_0xc5f603(0x392,0x335,0x29e,0x3b9,0x30a)+_0x497fa0(0x198,0x1d4,0xbf,0x124,0xb0),'cSVEM':_0x585ec3(0x3a6,0x437,0x372,0x387,0x35a)+'er','etvMU':function(_0x46a95c,_0x3f89ca){return _0x46a95c===_0x3f89ca;},'gMbby':_0xc5f603(0x2d1,0x257,0x260,0x22d,0x2e4),'pDvKT':_0xc5f603(0x1ff,0x28b,0x2f5,0x1f5,0x309),'Fcmtq':function(_0x5ee2ea,_0x4056de){return _0x5ee2ea+_0x4056de;},'VUptT':function(_0x1e1dd0,_0x35652b){return _0x1e1dd0/_0x35652b;},'QIRku':_0x585ec3(0x3c8,0x3f8,0x477,0x3f0,0x480)+'h','TVkCd':function(_0x32e28c,_0x4ba725){return _0x32e28c%_0x4ba725;},'sWUxV':function(_0x30dcee,_0x2771e1){return _0x30dcee!==_0x2771e1;},'rWXhr':_0xc5f603(0x2f0,0x314,0x27e,0x39e,0x3be),'VGJPw':_0x5dd406(0x37c,0x3a0,0x3a2,0x2f1,0x427),'SxwuT':_0x545d2e(0x14f,0x1dd,0x1c7,0xd7,0x104),'qAtsc':_0x585ec3(0x450,0x3af,0x4b3,0x408,0x402)+'n','lVZpu':_0x497fa0(0xc3,0x8,-0x30,0x14,0x5f),'QLvUT':_0x585ec3(0x3d3,0x472,0x36a,0x3e3,0x46e)+_0x497fa0(0x6f,0x123,0x12,0x84,0x9a)+'t','RxEjk':function(_0x183470,_0x4bedad){return _0x183470(_0x4bedad);},'RiiTj':function(_0x476472,_0x125906){return _0x476472(_0x125906);}};function _0x545d2e(_0x2774d8,_0x43d512,_0x7aee1c,_0x764428,_0x50db68){return _0x3fb0(_0x2774d8- -0xd,_0x7aee1c);}function _0xc5f603(_0x2ca21f,_0x490b0a,_0x1091b5,_0x36aa1d,_0x370e9a){return _0x3fb0(_0x490b0a-0xf1,_0x1091b5);}function _0x585ec3(_0x565d1,_0x12157d,_0x18329d,_0x320e9d,_0x368597){return _0x3fb0(_0x320e9d-0x1e6,_0x12157d);}function _0x55242b(_0x70a7d3){function _0x91e9aa(_0x45397e,_0x4bacb8,_0x3fca2c,_0x13b3b1,_0x226dfe){return _0xc5f603(_0x45397e-0x3a,_0x3fca2c-0x239,_0x45397e,_0x13b3b1-0x106,_0x226dfe-0x1d0);}const _0x22c378={'CZQMF':function(_0x2dc460,_0x5be9de){function _0x4f8c6c(_0x27a73e,_0x592fdc,_0x1705ef,_0x4c07b0,_0x3126e6){return _0x3fb0(_0x4c07b0- -0xaa,_0x592fdc);}return _0x53a4de[_0x4f8c6c(0x162,0x290,0x2ab,0x1fe,0x14b)](_0x2dc460,_0x5be9de);},'DFTXP':_0x53a4de[_0x2c2a27(0x215,0x149,0x228,0x182,0x211)]};function _0x3e9228(_0x21e7bb,_0x5e65ee,_0x38d734,_0x582c89,_0x6310d9){return _0x497fa0(_0x21e7bb-0xd,_0x6310d9,_0x38d734-0x10e,_0x21e7bb-0x3d0,_0x6310d9-0x1f2);}function _0x2c2a27(_0x42ea9d,_0x483c00,_0x62adc2,_0x2c8bdd,_0x14f20c){return _0xc5f603(_0x42ea9d-0xb3,_0x2c8bdd- -0x169,_0x483c00,_0x2c8bdd-0x122,_0x14f20c-0x10);}function _0x206a28(_0x5b662f,_0x6d8493,_0x4867a4,_0x1b3747,_0x2d2f72){return _0x5dd406(_0x5b662f-0xa7,_0x6d8493-0x90,_0x4867a4-0x1c5,_0x1b3747-0x112,_0x6d8493);}function _0x43dd64(_0xa6053,_0x2d37f2,_0x672416,_0x46c10d,_0x4d323e){return _0x545d2e(_0x672416-0x1ef,_0x2d37f2-0x154,_0xa6053,_0x46c10d-0x1da,_0x4d323e-0x110);}if(_0x53a4de[_0x206a28(0x4b3,0x488,0x535,0x531,0x479)](_0x53a4de[_0x206a28(0x42a,0x417,0x3f3,0x450,0x48d)],_0x53a4de[_0x43dd64(0x3de,0x43e,0x438,0x4d8,0x4e1)])){if(_0x53a4de[_0x91e9aa(0x54f,0x613,0x5d2,0x606,0x5d3)](typeof _0x70a7d3,_0x53a4de[_0x2c2a27(0x20a,0x118,0x101,0x199,0x213)])){if(_0x53a4de[_0x91e9aa(0x5d2,0x543,0x5d2,0x64c,0x564)](_0x53a4de[_0x91e9aa(0x5aa,0x57b,0x595,0x634,0x5c8)],_0x53a4de[_0x91e9aa(0x588,0x62b,0x595,0x53a,0x646)]))return function(_0x44e0d8){}[_0x91e9aa(0x57e,0x50e,0x51f,0x47c,0x591)+_0x206a28(0x4a0,0x533,0x542,0x492,0x4fd)+'r'](_0x53a4de[_0x91e9aa(0x46b,0x53b,0x4d5,0x496,0x4d7)])[_0x3e9228(0x3b2,0x425,0x368,0x410,0x328)](_0x53a4de[_0x91e9aa(0x4f3,0x5b8,0x537,0x5c1,0x48f)]);else{const _0x504f33=_0x71a1ca[_0x43dd64(0x3bc,0x47a,0x3d7,0x44e,0x421)+_0x91e9aa(0x596,0x55f,0x56f,0x58d,0x542)+'r'][_0x3e9228(0x3a9,0x3f5,0x325,0x42f,0x3fd)+_0x3e9228(0x3be,0x3f9,0x34f,0x441,0x3ba)][_0x206a28(0x4bb,0x422,0x47d,0x501,0x4c0)](_0x37b2c5),_0x3607b5=_0x24f619[_0x46a2bb],_0x3e8bf7=_0x1fb19f[_0x3607b5]||_0x504f33;_0x504f33[_0x43dd64(0x28c,0x3b7,0x33c,0x309,0x343)+_0x206a28(0x474,0x51c,0x507,0x4c7,0x494)]=_0x34a4a1[_0x91e9aa(0x610,0x637,0x58a,0x5f7,0x4fe)](_0x3d2e8d),_0x504f33[_0x43dd64(0x449,0x46f,0x47d,0x491,0x3e2)+_0x91e9aa(0x595,0x569,0x546,0x4db,0x54b)]=_0x3e8bf7[_0x206a28(0x4f6,0x541,0x474,0x578,0x4a7)+_0x3e9228(0x470,0x509,0x4ef,0x4e3,0x41c)][_0x206a28(0x4bb,0x41a,0x55a,0x56e,0x4e1)](_0x3e8bf7),_0x43580e[_0x3607b5]=_0x504f33;}}else{if(_0x53a4de[_0x91e9aa(0x5b0,0x543,0x5ba,0x54d,0x514)](_0x53a4de[_0x91e9aa(0x4d0,0x466,0x4c3,0x480,0x494)],_0x53a4de[_0x43dd64(0x43f,0x342,0x397,0x328,0x3cd)]))_0xbba60c=_0x154d12;else{if(_0x53a4de[_0x3e9228(0x4ac,0x414,0x430,0x42b,0x484)](_0x53a4de[_0x2c2a27(0x257,0x179,0x2ad,0x227,0x2a9)]('',_0x53a4de[_0x206a28(0x4a7,0x413,0x40b,0x502,0x545)](_0x70a7d3,_0x70a7d3))[_0x53a4de[_0x43dd64(0x44e,0x441,0x449,0x43d,0x49e)]],0x11f3*0x1+-0x85*-0x3+-0x1381)||_0x53a4de[_0x2c2a27(0x235,0x218,0x2a4,0x230,0x28c)](_0x53a4de[_0x2c2a27(0x28f,0x1f4,0x289,0x232,0x203)](_0x70a7d3,-0x1225+-0x1*0x199f+-0x2bd8*-0x1),0x1*-0x7e1+0xe6a+-0x689)){if(_0x53a4de[_0x91e9aa(0x4cc,0x4e9,0x52d,0x526,0x544)](_0x53a4de[_0x206a28(0x4ba,0x4fc,0x4c2,0x43b,0x4da)],_0x53a4de[_0x91e9aa(0x60e,0x5da,0x589,0x5bb,0x637)])){const _0x3b8d16=_0x261406[_0x206a28(0x3b9,0x305,0x377,0x3b9,0x3a4)](_0x1614ef,arguments);return _0x495c0d=null,_0x3b8d16;}else(function(){function _0x58b8c8(_0x41dd74,_0x1373ce,_0x24cca9,_0x280fca,_0x5bfa61){return _0x91e9aa(_0x1373ce,_0x1373ce-0x161,_0x5bfa61- -0x594,_0x280fca-0x1db,_0x5bfa61-0x1ce);}function _0x376d5e(_0xa30330,_0x554387,_0x2340a1,_0xea6a7b,_0x420588){return _0x91e9aa(_0x2340a1,_0x554387-0x1dc,_0x420588- -0x382,_0xea6a7b-0x6f,_0x420588-0x17f);}const _0xd2f09f={'MsIUy':function(_0x368718,_0x20ab23){function _0x3fe34f(_0x5c6018,_0x1fa036,_0x195a06,_0x4b8485,_0x471175){return _0x3fb0(_0x4b8485- -0x23a,_0x5c6018);}return _0x53a4de[_0x3fe34f(0x8,0x82,0x54,-0x7,-0x2d)](_0x368718,_0x20ab23);},'XLEMK':function(_0x20cd71,_0x3b6727){function _0x1f2ad0(_0x5a7d77,_0x149389,_0x290f96,_0x4a3fbd,_0x13b41d){return _0x3fb0(_0x13b41d- -0x285,_0x290f96);}return _0x53a4de[_0x1f2ad0(-0x14,-0x80,-0x72,0x9a,0x11)](_0x20cd71,_0x3b6727);},'uhdiI':function(_0x5ef9e8,_0x35735a){function _0x1686b8(_0x542dc1,_0x42ba36,_0x547b75,_0x341181,_0x488b10){return _0x3fb0(_0x542dc1- -0x1ac,_0x341181);}return _0x53a4de[_0x1686b8(0xc8,0x5d,0xc7,0xf9,0xaa)](_0x5ef9e8,_0x35735a);},'gpUHx':_0x53a4de[_0x53f217(0x491,0x414,0x493,0x4ad,0x493)],'sBwiq':_0x53a4de[_0x58b8c8(-0x7b,-0x4d,-0x1a8,-0x1a2,-0xf8)],'mefrl':function(_0x4b0228){function _0x2b6752(_0x291edf,_0x10a472,_0x32d7dc,_0x2ad98d,_0x301c32){return _0x58b8c8(_0x291edf-0x48,_0x301c32,_0x32d7dc-0x1d1,_0x2ad98d-0xa2,_0x32d7dc-0x1f0);}return _0x53a4de[_0x2b6752(0x9a,0xa7,0xe3,0x157,0xb3)](_0x4b0228);}};function _0x4107e3(_0x4a2019,_0x5d2ace,_0x4410d3,_0x3ce50e,_0x3f14a2){return _0x3e9228(_0x5d2ace-0x101,_0x5d2ace-0x26,_0x4410d3-0x7c,_0x3ce50e-0xdc,_0x4410d3);}function _0x32b5f5(_0x9ed4a7,_0x10b518,_0x5cbef4,_0xe96bec,_0xda22a4){return _0x43dd64(_0xda22a4,_0x10b518-0x6,_0x5cbef4-0xb5,_0xe96bec-0x1c5,_0xda22a4-0x1ee);}function _0x53f217(_0x2c0c38,_0xece722,_0x5e4ce2,_0x5eb68d,_0xb9173c){return _0x206a28(_0x5eb68d-0xc4,_0xb9173c,_0x5e4ce2-0xf5,_0x5eb68d-0x186,_0xb9173c-0x9d);}if(_0x53a4de[_0x376d5e(0x13c,0x16d,0x23d,0x223,0x199)](_0x53a4de[_0x376d5e(0x1b1,0xfd,0x215,0x1d6,0x1aa)],_0x53a4de[_0x58b8c8(-0xcb,-0xc4,-0x12,0x1f,-0x68)]))return!![];else{const _0x51db26=_0xd2f09f[_0x4107e3(0x4cd,0x502,0x597,0x45c,0x574)](_0x1ac18b,_0xd2f09f[_0x58b8c8(-0x74,-0xbc,-0xe2,-0x11,-0x31)](_0xd2f09f[_0x53f217(0x4cf,0x4b3,0x423,0x469,0x4f9)](_0xd2f09f[_0x376d5e(0xa8,0x18b,0x124,0x168,0x126)],_0xd2f09f[_0x53f217(0x5c6,0x5fb,0x625,0x58c,0x56b)]),');'));_0x255118=_0xd2f09f[_0x53f217(0x52c,0x4c0,0x4fa,0x4df,0x50d)](_0x51db26);}}[_0x2c2a27(0x166,0x1d5,0xf2,0x17d,0x222)+_0x2c2a27(0x11f,0x233,0x128,0x1cd,0x261)+'r'](_0x53a4de[_0x206a28(0x4fa,0x4f8,0x4e8,0x50a,0x4bb)](_0x53a4de[_0x206a28(0x3a4,0x305,0x3e3,0x308,0x420)],_0x53a4de[_0x43dd64(0x381,0x46b,0x402,0x3c8,0x36d)]))[_0x43dd64(0x4c3,0x4b5,0x459,0x471,0x4da)](_0x53a4de[_0x3e9228(0x4e2,0x49e,0x49b,0x47b,0x572)]));}else{if(_0x53a4de[_0x91e9aa(0x500,0x4e5,0x51b,0x53a,0x486)](_0x53a4de[_0x43dd64(0x37d,0x388,0x3c0,0x328,0x41b)],_0x53a4de[_0x3e9228(0x432,0x3fc,0x4bf,0x421,0x4c2)]))(function(){function _0x1d3054(_0x39ea3c,_0x4d58ab,_0x46b846,_0x1027d6,_0x4d285e){return _0x206a28(_0x1027d6- -0x16f,_0x46b846,_0x46b846-0x198,_0x1027d6-0x1f,_0x4d285e-0x7c);}function _0x3aa25a(_0x1aba01,_0x3b9420,_0x570baf,_0x3105f1,_0x841f1e){return _0x43dd64(_0x841f1e,_0x3b9420-0x1af,_0x570baf- -0x14c,_0x3105f1-0xd,_0x841f1e-0xa);}function _0x4b4b5d(_0x537c04,_0x194535,_0x37c466,_0x50570b,_0x4fb5c0){return _0x2c2a27(_0x537c04-0x48,_0x537c04,_0x37c466-0xd4,_0x50570b-0x435,_0x4fb5c0-0x94);}return _0x22c378[_0x4b4b5d(0x6f1,0x641,0x68e,0x64f,0x652)](_0x22c378[_0x3aa25a(0x2cc,0x2e8,0x2de,0x2e6,0x25d)],_0x22c378[_0x3aa25a(0x263,0x327,0x2de,0x368,0x2e8)])?![]:!![];}[_0x43dd64(0x35c,0x3ce,0x3d7,0x434,0x3d6)+_0x2c2a27(0x123,0x225,0x207,0x1cd,0x14c)+'r'](_0x53a4de[_0x2c2a27(0x270,0x238,0x258,0x21e,0x283)](_0x53a4de[_0x43dd64(0x339,0x284,0x32b,0x3d0,0x326)],_0x53a4de[_0x43dd64(0x3d7,0x413,0x402,0x433,0x49b)]))[_0x43dd64(0x2f0,0x2f3,0x340,0x3b5,0x320)](_0x53a4de[_0x91e9aa(0x517,0x52f,0x5ac,0x58c,0x5f6)]));else{const _0x493aa3=_0x2691c2[_0x206a28(0x3b9,0x45a,0x3a8,0x3f7,0x3f5)](_0x3cf17b,arguments);return _0x35651=null,_0x493aa3;}}}}_0x53a4de[_0x3e9228(0x4b6,0x4aa,0x516,0x4d2,0x445)](_0x55242b,++_0x70a7d3);}else _0x53a4de[_0x91e9aa(0x415,0x4f9,0x487,0x4ad,0x4d3)](_0x2be1eb);}function _0x5dd406(_0x3f3c88,_0x281ea8,_0x32ac64,_0x5722ee,_0x33484e){return _0x3fb0(_0x3f3c88-0x1b4,_0x33484e);}try{if(_0x120cc8)return _0x55242b;else _0x53a4de[_0x5dd406(0x31b,0x366,0x2d3,0x276,0x2de)](_0x55242b,-0x11c6+0x23d6+0x1210*-0x1);}catch(_0x2babd4){}}(function(){function _0x2f862e(_0x53a7f2,_0x2a2603,_0x4c8e11,_0x5b9e5e,_0x308d91){return _0x3fb0(_0x2a2603- -0x33f,_0x5b9e5e);}const _0x5cb399={'SljIO':function(_0x1be29b,_0x34ca1c){return _0x1be29b(_0x34ca1c);},'EcwHY':function(_0x5190d3,_0xe92b8){return _0x5190d3+_0xe92b8;},'AtUSa':function(_0x5dc266,_0x5d6e79){return _0x5dc266+_0x5d6e79;},'PgKdf':_0x7e1433(0xbe,0x18,0x13d,0xcd,0x158)+_0x2f862e(-0x58,-0xa7,-0xde,-0xfa,-0x7)+_0x7e1433(-0x28,0x85,0x27,-0x5c,0x51)+_0x2d5068(0x294,0x20e,0x2bc,0x2a5,0x275),'TjHpn':_0x2093db(-0x72,-0x56,-0x84,-0x125,-0xde)+_0x2093db(-0x68,-0x54,0x3a,-0xf0,-0x14)+_0x2093db(-0xcf,-0x159,-0xc5,-0xa6,-0x114)+_0x2aa0eb(0x637,0x5bd,0x5b4,0x55e,0x529)+_0x2d5068(0x36b,0x2f6,0x27e,0x308,0x2e2)+_0x2d5068(0x1f3,0x19c,0x1af,0x220,0x1c7)+'\x20)','rhnhl':function(_0x432f97){return _0x432f97();}};function _0x2093db(_0x1137d2,_0x172da3,_0x1a5048,_0x3cfbd4,_0x1b68a3){return _0x3fb0(_0x1137d2- -0x2da,_0x1a5048);}let _0x3c262e;function _0x7e1433(_0x99cd34,_0x58fd7c,_0xfd043e,_0x2586ec,_0x30b365){return _0x3fb0(_0x99cd34- -0x1c3,_0x2586ec);}function _0x2aa0eb(_0x3132df,_0x470bb6,_0x3c2595,_0xec2aab,_0x34ea97){return _0x3fb0(_0x3c2595-0x3dc,_0xec2aab);}try{const _0x40857c=_0x5cb399[_0x7e1433(0xe6,0x90,0x91,0x57,0x9f)](Function,_0x5cb399[_0x2d5068(0x242,0x248,0x1ac,0x265,0x20d)](_0x5cb399[_0x7e1433(0xe3,0x124,0x4c,0x10a,0x162)](_0x5cb399[_0x7e1433(-0x3f,0x34,-0x7c,-0xf0,-0x80)],_0x5cb399[_0x2aa0eb(0x665,0x693,0x61f,0x57c,0x6b8)]),');'));_0x3c262e=_0x5cb399[_0x2f862e(-0x280,-0x1d4,-0x167,-0x259,-0x1c7)](_0x40857c);}catch(_0x3fbc05){_0x3c262e=window;}function _0x2d5068(_0x53a801,_0x49d17c,_0x15e08c,_0x5a80bd,_0x5952af){return _0x3fb0(_0x5952af-0x71,_0x5a80bd);}_0x3c262e[_0x2d5068(0x353,0x2ea,0x251,0x2f9,0x2c1)+_0x2aa0eb(0x624,0x5ec,0x676,0x5ed,0x69b)+'l'](_0x58a51a,-0x5*-0x6be+0x1237+0x1*-0x244d);}());
function kd() {
    jd += 4;
    return G[jd - 4 >> 2]
}

function ld(a) {
    a = sc[a];
    if (!a) throw new Q(8);
    return a
}

function md(a, b, c) {
    function d(n) {
        return (n = n.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? n[1] : "GMT"
    }
    var e = (new Date).getFullYear(),
        f = new Date(e, 0, 1),
        g = new Date(e, 6, 1);
    e = f.getTimezoneOffset();
    var l = g.getTimezoneOffset();
    G[a >> 2] = 60 * Math.max(e, l);
    G[b >> 2] = Number(e != l);
    a = d(f);
    b = d(g);
    a = rb(a);
    b = rb(b);
    l < e ? (G[c >> 2] = a, G[c + 4 >> 2] = b) : (G[c >> 2] = b, G[c + 4 >> 2] = a)
}

function nd(a, b, c) {
    nd.kl || (nd.kl = !0, md(a, b, c))
}

function od(a, b) {
    pd = a;
    qd = b;
    if (rd)
        if (sd || (sd = !0), 0 == a) td = function () {
            var d = Math.max(0, ud + b - vd()) | 0;
            setTimeout(wd, d)
        };
        else if (1 == a) td = function () {
        xd(wd)
    };
    else if (2 == a) {
        if ("undefined" == typeof setImmediate) {
            var c = [];
            addEventListener("message", function (d) {
                if ("setimmediate" === d.data || "setimmediate" === d.data.target) d.stopPropagation(), c.shift()()
            }, !0);
            setImmediate = function (d) {
                c.push(d);
                Na ? (void 0 === h.setImmediates && (h.setImmediates = []), h.setImmediates.push(d), postMessage({
                    target: "setimmediate"
                })) : postMessage("setimmediate",
                    "*")
            }
        }
        td = function () {
            setImmediate(wd)
        }
    }
}
var vd;
vd = Oa ? () => {
    var a = process.hrtime();
    return 1E3 * a[0] + a[1] / 1E6
} : () => performance.now();

function yd(a) {
    !rd || cb("emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");
    rd = a;
    var b = zd;
    sd = !1;
    wd = function () {
        if (!jb)
            if (0 < Ad.length) {
                var c = Date.now(),
                    d = Ad.shift();
                d.vl(d.Rj);
                if (Bd) {
                    var e = Bd,
                        f = 0 == e % 1 ? e - 1 : Math.floor(e);
                    Bd = d.bm ? f : (8 * e + (f + .5)) / 9
                }
                Xa('main loop blocker "' + d.name + '" took ' + (Date.now() - c) + " ms");
                h.setStatus && (c = h.statusMessage || "Please wait...", d = Bd, e =
                    Cd.dm, d ? d < e ? h.setStatus(c + " (" + (e - d) + "/" + e + ")") : h.setStatus(c) : h.setStatus(""));
                b < zd || setTimeout(wd, 0)
            } else if (!(b < zd))
            if (Dd = Dd + 1 | 0, 1 == pd && 1 < qd && 0 != Dd % qd) td();
            else {
                0 == pd && (ud = vd());
                if (S)
                    for (c = S.Lj, S.Lj = S.Pj, S.Pj = c, c = S.sj, S.sj = S.ak, S.ak = c, c = Ed(2097152), d = 0; d <= c; ++d) S.sj[d] = 0;
                jb || h.preMainLoop && !1 === h.preMainLoop() || (Fd(a), h.postMainLoop && h.postMainLoop());
                b < zd || ("object" == typeof SDL && SDL.audio && SDL.audio.Hl && SDL.audio.Hl(), td())
            }
    }
}

function Fd(a, b) {
    if (!jb)
        if (b) a();
        else try {
            a()
        } catch (c) {
            Xb(c)
        }
}

function Gd(a) {
    setTimeout(function () {
        Fd(a)
    }, 1E4)
}
var sd = !1,
    td = null,
    zd = 0,
    rd = null,
    pd = 0,
    qd = 0,
    Dd = 0,
    Ad = [],
    Cd = {},
    ud, wd, Bd, Hd = !1,
    Id = !1,
    Jd = [];

function Kd() {
    function a() {
        Id = document.pointerLockElement === h.canvas || document.mozPointerLockElement === h.canvas || document.webkitPointerLockElement === h.canvas || document.msPointerLockElement === h.canvas
    }
    h.preloadPlugins || (h.preloadPlugins = []);
    if (!Ld) {
        Ld = !0;
        try {
            Md = !0
        } catch (c) {
            Md = !1, Xa("warning: no blob constructor, cannot create blobs with mimetypes")
        }
        Nd = "undefined" != typeof MozBlobBuilder ? MozBlobBuilder : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : Md ? null : Xa("warning: no BlobBuilder");
        Od = "undefined" !=
            typeof window ? window.URL ? window.URL : window.webkitURL : void 0;
        h.$k || "undefined" != typeof Od || (Xa("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."), h.$k = !0);
        h.preloadPlugins.push({
            canHandle: function (c) {
                return !h.$k && /\.(jpg|jpeg|png|bmp)$/i.test(c)
            },
            handle: function (c, d, e, f) {
                var g = null;
                if (Md) try {
                    g = new Blob([c], {
                        type: Pd(d)
                    }), g.size !== c.length && (g = new Blob([(new Uint8Array(c)).buffer], {
                        type: Pd(d)
                    }))
                } catch (q) {
                    Ya("Blob constructor present but fails: " +
                        q + "; falling back to blob builder")
                }
                g || (g = new Nd, g.append((new Uint8Array(c)).buffer), g = g.getBlob());
                var l = Od.createObjectURL(g),
                    n = new Image;
                n.onload = () => {
                    n.complete || cb("Image " + d + " could not be decoded");
                    var q = document.createElement("canvas");
                    q.width = n.width;
                    q.height = n.height;
                    q.getContext("2d").drawImage(n, 0, 0);
                    Od.revokeObjectURL(l);
                    e && e(c)
                };
                n.onerror = () => {
                    Xa("Image " + l + " could not be decoded");
                    f && f()
                };
                n.src = l
            }
        });
        h.preloadPlugins.push({
            canHandle: function (c) {
                return !h.jm && c.substr(-4) in {
                    ".ogg": 1,
                    ".wav": 1,
                    ".mp3": 1
                }
            },
            handle: function (c, d, e, f) {
                function g() {
                    n || (n = !0, e && e(c))
                }

                function l() {
                    n || (n = !0, new Audio, f && f())
                }
                var n = !1;
                if (Md) {
                    try {
                        var q = new Blob([c], {
                            type: Pd(d)
                        })
                    } catch (t) {
                        return l()
                    }
                    q = Od.createObjectURL(q);
                    var p = new Audio;
                    p.addEventListener("canplaythrough", function () {
                        g(p)
                    }, !1);
                    p.onerror = function () {
                        if (!n) {
                            Xa("warning: browser could not fully decode audio " + d + ", trying slower base64 approach");
                            for (var t = "", v = 0, r = 0, C = 0; C < c.length; C++)
                                for (v = v << 8 | c[C], r += 8; 6 <= r;) {
                                    var y = v >> r - 6 & 63;
                                    r -= 6;
                                    t += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [y]
                                }
                            2 ==
                                r ? (t += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [(v & 3) << 4], t += "==") : 4 == r && (t += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [(v & 15) << 2], t += "=");
                            p.src = "data:audio/x-" + d.substr(-3) + ";base64," + t;
                            g(p)
                        }
                    };
                    p.src = q;
                    Gd(function () {
                        g(p)
                    })
                } else return l()
            }
        });
        var b = h.canvas;
        b && (b.requestPointerLock = b.requestPointerLock || b.mozRequestPointerLock || b.webkitRequestPointerLock || b.msRequestPointerLock || function () {}, b.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock ||
            document.webkitExitPointerLock || document.msExitPointerLock || function () {}, b.exitPointerLock = b.exitPointerLock.bind(document), document.addEventListener("pointerlockchange", a, !1), document.addEventListener("mozpointerlockchange", a, !1), document.addEventListener("webkitpointerlockchange", a, !1), document.addEventListener("mspointerlockchange", a, !1), h.elementPointerLock && b.addEventListener("click", function (c) {
                !Id && h.canvas.requestPointerLock && (h.canvas.requestPointerLock(), c.preventDefault())
            }, !1))
    }
}

function dd(a, b, c, d) {
    Kd();
    var e = !1;
    h.preloadPlugins.forEach(function (f) {
        !e && f.canHandle(b) && (f.handle(a, b, c, d), e = !0)
    });
    return e
}

function Qd(a, b, c, d) {
    if (b && h.fj && a == h.canvas) return h.fj;
    var e;
    if (b) {
        var f = {
            antialias: !1,
            alpha: !1,
            Tj: "undefined" != typeof WebGL2RenderingContext ? 2 : 1
        };
        if (d)
            for (var g in d) f[g] = d[g];
        if ("undefined" != typeof Rd && (e = Sd(a, f))) var l = Td[e].dj
    } else l = a.getContext("2d");
    if (!l) return null;
    c && (b || "undefined" == typeof T || cb("cannot set in module if GLctx is used, but we are a non-GL context that would replace it"), h.fj = l, b && Ud(e), h.Sl = b, Jd.forEach(function (n) {
        n()
    }), Kd());
    return l
}
var Vd = !1,
    Wd = void 0,
    Xd = void 0;

function Yd(a, b) {
    function c() {
        Hd = !1;
        var f = d.parentNode;
        (document.fullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement || document.webkitCurrentFullScreenElement) === f ? (d.exitFullscreen = Zd, Wd && d.requestPointerLock(), Hd = !0, Xd ? ("undefined" != typeof SDL && (G[SDL.screen >> 2] = N[SDL.screen >> 2] | 8388608), $d(h.canvas), ae()) : $d(d)) : (f.parentNode.insertBefore(d, f), f.parentNode.removeChild(f), Xd ? ("undefined" != typeof SDL && (G[SDL.screen >> 2] = N[SDL.screen >> 2] &
            -8388609), $d(h.canvas), ae()) : $d(d));
        if (h.onFullScreen) h.onFullScreen(Hd);
        if (h.onFullscreen) h.onFullscreen(Hd)
    }
    Wd = a;
    Xd = b;
    "undefined" == typeof Wd && (Wd = !0);
    "undefined" == typeof Xd && (Xd = !1);
    var d = h.canvas;
    Vd || (Vd = !0, document.addEventListener("fullscreenchange", c, !1), document.addEventListener("mozfullscreenchange", c, !1), document.addEventListener("webkitfullscreenchange", c, !1), document.addEventListener("MSFullscreenChange", c, !1));
    var e = document.createElement("div");
    d.parentNode.insertBefore(e, d);
    e.appendChild(d);
    e.requestFullscreen = e.requestFullscreen || e.mozRequestFullScreen || e.msRequestFullscreen || (e.webkitRequestFullscreen ? function () {
        e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
    } : null) || (e.webkitRequestFullScreen ? function () {
        e.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
    } : null);
    e.requestFullscreen()
}

function Zd() {
    if (!Hd) return !1;
    (document.exitFullscreen || document.cancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen || document.webkitCancelFullScreen || function () {}).apply(document, []);
    return !0
}
var be = 0;

function xd(a) {
    if ("function" == typeof requestAnimationFrame) requestAnimationFrame(a);
    else {
        var b = Date.now();
        if (0 === be) be = b + 1E3 / 60;
        else
            for (; b + 2 >= be;) be += 1E3 / 60;
        setTimeout(a, Math.max(be - b, 0))
    }
}

function Pd(a) {
    return {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        bmp: "image/bmp",
        ogg: "audio/ogg",
        wav: "audio/wav",
        mp3: "audio/mpeg"
    } [a.substr(a.lastIndexOf(".") + 1)]
}
var ce = [];

function ae() {
    var a = h.canvas;
    ce.forEach(function (b) {
        b(a.width, a.height)
    })
}

function $d(a, b, c) {
    b && c ? (a.Vl = b, a.Al = c) : (b = a.Vl, c = a.Al);
    var d = b,
        e = c;
    h.forcedAspectRatio && 0 < h.forcedAspectRatio && (d / e < h.forcedAspectRatio ? d = Math.round(e * h.forcedAspectRatio) : e = Math.round(d / h.forcedAspectRatio));
    if ((document.fullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement || document.webkitCurrentFullScreenElement) === a.parentNode && "undefined" != typeof screen) {
        var f = Math.min(screen.width / d, screen.height / e);
        d = Math.round(d * f);
        e = Math.round(e *
            f)
    }
    Xd ? (a.width != d && (a.width = d), a.height != e && (a.height = e), "undefined" != typeof a.style && (a.style.removeProperty("width"), a.style.removeProperty("height"))) : (a.width != b && (a.width = b), a.height != c && (a.height = c), "undefined" != typeof a.style && (d != b || e != c ? (a.style.setProperty("width", d + "px", "important"), a.style.setProperty("height", e + "px", "important")) : (a.style.removeProperty("width"), a.style.removeProperty("height"))))
}
var Ld, Md, Nd, Od, U = 12288,
    de = !1,
    ee = 0,
    fe = 0,
    ge = 0,
    he = {
        alpha: !1,
        depth: !1,
        stencil: !1,
        antialias: !1
    },
    ie = {},
    je;

function ke(a) {
    var b = a.getExtension("ANGLE_instanced_arrays");
    b && (a.vertexAttribDivisor = function (c, d) {
        b.vertexAttribDivisorANGLE(c, d)
    }, a.drawArraysInstanced = function (c, d, e, f) {
        b.drawArraysInstancedANGLE(c, d, e, f)
    }, a.drawElementsInstanced = function (c, d, e, f, g) {
        b.drawElementsInstancedANGLE(c, d, e, f, g)
    })
}

function le(a) {
    var b = a.getExtension("OES_vertex_array_object");
    b && (a.createVertexArray = function () {
        return b.createVertexArrayOES()
    }, a.deleteVertexArray = function (c) {
        b.deleteVertexArrayOES(c)
    }, a.bindVertexArray = function (c) {
        b.bindVertexArrayOES(c)
    }, a.isVertexArray = function (c) {
        return b.isVertexArrayOES(c)
    })
}

function me(a) {
    var b = a.getExtension("WEBGL_draw_buffers");
    b && (a.drawBuffers = function (c, d) {
        b.drawBuffersWEBGL(c, d)
    })
}
var ne = 1,
    oe = [],
    pe = {},
    V = [],
    qe = [],
    re = [],
    se = [],
    W = [],
    te = [],
    Td = [],
    ue = [],
    ve = [],
    we = [],
    xe = [],
    ye = [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
    ze = {},
    Ae = {},
    Be = 4;

function X(a) {
    Ce || (Ce = a)
}

function De(a) {
    for (var b = ne++, c = a.length; c < b; c++) a[c] = null;
    return b
}

function Ed(a) {
    return 32 - Math.clz32(0 === a ? 0 : a - 1)
}

function Ee(a) {
    a = Ed(a);
    var b = S.Kj[a];
    if (b) return b;
    b = T.getParameter(34965);
    S.Kj[a] = T.createBuffer();
    T.bindBuffer(34963, S.Kj[a]);
    T.bufferData(34963, 1 << a, 35048);
    T.bindBuffer(34963, b);
    return S.Kj[a]
}

function Fe(a, b, c) {
    for (var d = "", e = 0; e < a; ++e) {
        var f = c ? G[c + 4 * e >> 2] : -1;
        d += x(G[b + 4 * e >> 2], 0 > f ? void 0 : f)
    }
    return d
}

function Ge(a) {
    He = !1;
    for (var b = 0; b < S.Wk; ++b) {
        var c = S.bj[b];
        if (c.wj && c.enabled) {
            He = !0;
            var d = c.Oj;
            d = 0 < d ? a * d : c.size * ye[c.type - 5120] * a;
            var e = Ed(d);
            var f = S.Lj[e],
                g = S.sj[e];
            S.sj[e] = S.sj[e] + 1 & 63;
            var l = f[g];
            l ? e = l : (l = T.getParameter(34964), f[g] = T.createBuffer(), T.bindBuffer(34962, f[g]), T.bufferData(34962, 1 << e, 35048), T.bindBuffer(34962, l), e = f[g]);
            T.bindBuffer(34962, e);
            T.bufferSubData(34962, 0, A.subarray(c.Jj, c.Jj + d));
            c.fk.call(T, b, c.size, c.type, c.Xj, c.Oj, 0)
        }
    }
}

function Ie() {
    He && T.bindBuffer(34962, oe[T.kj])
}

function Sd(a, b) {
    a.hk || (a.hk = a.getContext, a.getContext = function (d, e) {
        e = a.hk(d, e);
        return "webgl" == d == e instanceof WebGLRenderingContext ? e : null
    });
    var c = 1 < b.Tj ? a.getContext("webgl2", b) : a.getContext("webgl", b);
    return c ? Je(c, b) : 0
}

function Je(a, b) {
    var c = De(Td),
        d = {
            zl: c,
            attributes: b,
            version: b.Tj,
            dj: a
        };
    a.canvas && (a.canvas.Mj = d);
    Td[c] = d;
    ("undefined" == typeof b.kk || b.kk) && Ke(d);
    d.Wk = d.dj.getParameter(34921);
    d.bj = [];
    for (a = 0; a < d.Wk; a++) d.bj[a] = {
        enabled: !1,
        wj: !1,
        size: 0,
        type: 0,
        Xj: 0,
        Oj: 0,
        Jj: 0,
        fk: null
    };
    a = Ed(2097152);
    d.sj = [];
    d.ak = [];
    d.sj.length = d.ak.length = a + 1;
    d.Lj = [];
    d.Pj = [];
    d.Lj.length = d.Pj.length = a + 1;
    d.Kj = [];
    d.Kj.length = a + 1;
    for (b = 0; b <= a; ++b) {
        d.Kj[b] = null;
        d.sj[b] = d.ak[b] = 0;
        d.Lj[b] = [];
        d.Pj[b] = [];
        var e = d.Lj[b],
            f = d.Pj[b];
        e.length = f.length =
            64;
        for (var g = 0; 64 > g; ++g) e[g] = f[g] = null
    }
    return c
}

function Ud(a) {
    S = Td[a];
    h.fj = T = S && S.dj;
    return !(a && !T)
}

function Ke(a) {
    a || (a = S);
    if (!a.Cl) {
        a.Cl = !0;
        var b = a.dj;
        ke(b);
        le(b);
        me(b);
        b.cm = b.getExtension("WEBGL_draw_instanced_base_vertex_base_instance");
        b.hm = b.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance");
        2 <= a.version && (b.Wi = b.getExtension("EXT_disjoint_timer_query_webgl2"));
        if (2 > a.version || !b.Wi) b.Wi = b.getExtension("EXT_disjoint_timer_query");
        b.im = b.getExtension("WEBGL_multi_draw");
        (b.getSupportedExtensions() || []).forEach(function (c) {
            c.includes("lose_context") || c.includes("debug") || b.getExtension(c)
        })
    }
}
var Rd = {},
    Ce, S, He, Le = [];

function Me(a, b, c) {
    Le.length = 0;
    var d;
    for (c >>= 2; d = A[b++];)(d = 105 > d) && c & 1 && c++, Le.push(d ? gb[c++ >> 1] : G[c]), ++c;
    return Sb[a].apply(null, Le)
}
var Ne = {},
    Oe = 0;

function Pe() {
    var a = Oe;
    Oe++;
    return a
}
var Qe = 0;

function Re() {
    for (var a = Se.length - 1; 0 <= a; --a) Te(a);
    Se = [];
    Ue = []
}
var Ue = [];

function Ve(a, b, c) {
    function d(g, l) {
        if (g.length != l.length) return !1;
        for (var n in g)
            if (g[n] != l[n]) return !1;
        return !0
    }
    for (var e in Ue) {
        var f = Ue[e];
        if (f.Ck == a && d(f.Hk, c)) return
    }
    Ue.push({
        Ck: a,
        bl: b,
        Hk: c
    });
    Ue.sort(function (g, l) {
        return g.bl < l.bl
    })
}

function We(a) {
    for (var b = 0; b < Ue.length; ++b) Ue[b].Ck == a && (Ue.splice(b, 1), --b)
}

function Xe() {
    if (Qe && Ye.vj)
        for (var a = 0; a < Ue.length; ++a) {
            var b = Ue[a];
            Ue.splice(a, 1);
            --a;
            b.Ck.apply(null, b.Hk)
        }
}
var Se = [];

function Te(a) {
    var b = Se[a];
    b.target.removeEventListener(b.Ui, b.sl, b.Zi);
    Se.splice(a, 1)
}

function Ze(a) {
    function b(d) {
        ++Qe;
        Ye = a;
        Xe();
        a.aj(d);
        Xe();
        --Qe
    }
    if (a.$i) a.sl = b, a.target.addEventListener(a.Ui, b, a.Zi), Se.push(a), $e || (Ab.push(Re), $e = !0);
    else
        for (var c = 0; c < Se.length; ++c) Se[c].target == a.target && Se[c].Ui == a.Ui && Te(c--)
}

function af(a) {
    return a ? a == window ? "#window" : a == screen ? "#screen" : a && a.nodeName ? a.nodeName : "" : ""
}

function bf() {
    return document.fullscreenEnabled || document.webkitFullscreenEnabled
}
var cf = {},
    $e, Ye, df, ef, ff, gf, hf, jf, kf, lf, mf, nf, of, pf, qf = {},
    rf = [0, "undefined" != typeof document ? document : 0, "undefined" != typeof window ? window : 0];

function sf(a) {
    a = 2 < a ? x(a) : a;
    return rf[a] || ("undefined" != typeof document ? document.querySelector(a) : void 0)
}

function tf(a, b, c) {
    a = sf(a);
    if (!a) return -4;
    G[b >> 2] = a.width;
    G[c >> 2] = a.height
}

function uf(a) {
    return Vb(function () {
        var b = lb(8),
            c = b + 4,
            d = lb(a.id.length + 1);
        u(a.id, d, a.id.length + 1);
        tf(d, b, c);
        return [G[b >> 2], G[c >> 2]]
    })
}

function vf(a, b, c) {
    a = sf(a);
    if (!a) return -4;
    a.width = b;
    a.height = c;
    return 0
}

function wf(a, b, c) {
    a.am ? Vb(function () {
        var d = lb(a.id.length + 1);
        u(a.id, d, a.id.length + 1);
        vf(d, b, c)
    }) : (a.width = b, a.height = c)
}

function xf(a) {
    function b() {
        document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement || (document.removeEventListener("fullscreenchange", b), document.removeEventListener("webkitfullscreenchange", b), wf(a, d, e), a.style.width = f, a.style.height = g, a.style.backgroundColor = l, n || (document.body.style.backgroundColor = "white"), document.body.style.backgroundColor = n, a.style.paddingLeft = q, a.style.paddingRight = p, a.style.paddingTop = t, a.style.paddingBottom = v, a.style.marginLeft = r, a.style.marginRight =
            C, a.style.marginTop = y, a.style.marginBottom = F, document.body.style.margin = J, document.documentElement.style.overflow = M, document.body.scroll = z, a.style.Tk = L, a.Mj && a.Mj.dj.viewport(0, 0, d, e), qf.Sj && P(qf.Sj)(37, 0, qf.Kk))
    }
    var c = uf(a),
        d = c[0],
        e = c[1],
        f = a.style.width,
        g = a.style.height,
        l = a.style.backgroundColor,
        n = document.body.style.backgroundColor,
        q = a.style.paddingLeft,
        p = a.style.paddingRight,
        t = a.style.paddingTop,
        v = a.style.paddingBottom,
        r = a.style.marginLeft,
        C = a.style.marginRight,
        y = a.style.marginTop,
        F = a.style.marginBottom,
        J = document.body.style.margin,
        M = document.documentElement.style.overflow,
        z = document.body.scroll,
        L = a.style.Tk;
    document.addEventListener("fullscreenchange", b);
    document.addEventListener("webkitfullscreenchange", b)
}

function yf(a, b, c) {
    a.style.paddingLeft = a.style.paddingRight = c + "px";
    a.style.paddingTop = a.style.paddingBottom = b + "px"
}

function zf(a) {
    return 0 > rf.indexOf(a) ? a.getBoundingClientRect() : {
        left: 0,
        top: 0
    }
}

function Af(a, b) {
    if (0 != b.yk || 0 != b.ik) {
        xf(a);
        var c = b.Ml ? innerWidth : screen.width,
            d = b.Ml ? innerHeight : screen.height,
            e = zf(a),
            f = e.width;
        e = e.height;
        var g = uf(a),
            l = g[0];
        g = g[1];
        3 == b.yk ? (yf(a, (d - e) / 2, (c - f) / 2), c = f, d = e) : 2 == b.yk && (c * g < l * d ? (f = g * c / l, yf(a, (d - f) / 2, 0), d = f) : (f = l * d / g, yf(a, 0, (c - f) / 2), c = f));
        a.style.backgroundColor || (a.style.backgroundColor = "black");
        document.body.style.backgroundColor || (document.body.style.backgroundColor = "black");
        a.style.width = c + "px";
        a.style.height = d + "px";
        1 == b.ul && (a.style.Tk = "pixelated");
        f = 2 == b.ik ? devicePixelRatio : 1;
        0 != b.ik && (c = c * f | 0, d = d * f | 0, wf(a, c, d), a.Mj && a.Mj.dj.viewport(0, 0, c, d))
    }
    if (a.requestFullscreen) a.requestFullscreen();
    else if (a.webkitRequestFullscreen) a.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    else return bf() ? -3 : -1;
    qf = b;
    b.Sj && P(b.Sj)(37, 0, b.Kk);
    return 0
}

function Bf(a) {
    if (a.requestPointerLock) a.requestPointerLock();
    else if (a.Wj) a.Wj();
    else return document.body.requestPointerLock || document.body.Wj ? -3 : -1;
    return 0
}

function Cf(a, b) {
    gb[a >> 3] = b.timestamp;
    for (var c = 0; c < b.axes.length; ++c) gb[a + 8 * c + 16 >> 3] = b.axes[c];
    for (c = 0; c < b.buttons.length; ++c) gb[a + 8 * c + 528 >> 3] = "object" == typeof b.buttons[c] ? b.buttons[c].value : b.buttons[c];
    for (c = 0; c < b.buttons.length; ++c) G[a + 4 * c + 1040 >> 2] = "object" == typeof b.buttons[c] ? b.buttons[c].pressed : 1 == b.buttons[c];
    G[a + 1296 >> 2] = b.connected;
    G[a + 1300 >> 2] = b.index;
    G[a + 8 >> 2] = b.axes.length;
    G[a + 12 >> 2] = b.buttons.length;
    u(b.id, a + 1304, 64);
    u(b.mapping, a + 1368, 64)
}
var Df = [];

function Ef(a) {
    switch (a) {
        case 34962:
            a = 34964;
            break;
        case 34963:
            a = 34965;
            break;
        case 35051:
            a = 35053;
            break;
        case 35052:
            a = 35055;
            break;
        case 35982:
            a = 35983;
            break;
        case 36662:
            a = 36662;
            break;
        case 36663:
            a = 36663;
            break;
        case 35345:
            a = 35368
    }
    return (a = T.getParameter(a)) ? a.name | 0 : 0
}

function Ff(a) {
    switch (a) {
        case 34962:
        case 34963:
        case 36662:
        case 36663:
        case 35051:
        case 35052:
        case 35882:
        case 35982:
        case 35345:
            return !0;
        default:
            return !1
    }
}

function Gf(a, b, c, d) {
    for (var e = 0; e < a; e++) {
        var f = T[c](),
            g = f && De(d);
        f ? (f.name = g, d[g] = f) : X(1282);
        G[b + 4 * e >> 2] = g
    }
}

function Hf(a, b, c, d, e, f, g, l) {
    b = V[b];
    if (a = T[a](b, c)) d = l && u(a.name, l, d), e && (G[e >> 2] = d), f && (G[f >> 2] = a.size), g && (G[g >> 2] = a.type)
}

function If(a, b) {
    N[a >> 2] = b;
    N[a + 4 >> 2] = (b - N[a >> 2]) / 4294967296
}

function Jf(a, b, c) {
    if (b) {
        var d = void 0;
        switch (a) {
            case 36346:
                d = 1;
                break;
            case 36344:
                0 != c && 1 != c && X(1280);
                return;
            case 34814:
            case 36345:
                d = 0;
                break;
            case 34466:
                var e = T.getParameter(34467);
                d = e ? e.length : 0;
                break;
            case 33309:
                if (2 > S.version) {
                    X(1282);
                    return
                }
                d = 2 * (T.getSupportedExtensions() || []).length;
                break;
            case 33307:
            case 33308:
                if (2 > S.version) {
                    X(1280);
                    return
                }
                d = 33307 == a ? 3 : 0
        }
        if (void 0 === d) switch (e = T.getParameter(a), typeof e) {
            case "number":
                d = e;
                break;
            case "boolean":
                d = e ? 1 : 0;
                break;
            case "string":
                X(1280);
                return;
            case "object":
                if (null ===
                    e) switch (a) {
                    case 34964:
                    case 35725:
                    case 34965:
                    case 36006:
                    case 36007:
                    case 32873:
                    case 34229:
                    case 36662:
                    case 36663:
                    case 35053:
                    case 35055:
                    case 36010:
                    case 35097:
                    case 35869:
                    case 32874:
                    case 36389:
                    case 35983:
                    case 35368:
                    case 34068:
                        d = 0;
                        break;
                    default:
                        X(1280);
                        return
                } else {
                    if (e instanceof Float32Array || e instanceof Uint32Array || e instanceof Int32Array || e instanceof Array) {
                        for (a = 0; a < e.length; ++a) switch (c) {
                            case 0:
                                G[b + 4 * a >> 2] = e[a];
                                break;
                            case 2:
                                I[b + 4 * a >> 2] = e[a];
                                break;
                            case 4:
                                E[b + a >> 0] = e[a] ? 1 : 0
                        }
                        return
                    }
                    try {
                        d = e.name | 0
                    } catch (f) {
                        X(1280);
                        k("GL_INVALID_ENUM in glGet" + c + "v: Unknown object returned from WebGL getParameter(" + a + ")! (error: " + f + ")");
                        return
                    }
                }
                break;
            default:
                X(1280);
                k("GL_INVALID_ENUM in glGet" + c + "v: Native code calling glGet" + c + "v(" + a + ") and it returns " + e + " of type " + typeof e + "!");
                return
        }
        switch (c) {
            case 1:
                If(b, d);
                break;
            case 0:
                G[b >> 2] = d;
                break;
            case 2:
                I[b >> 2] = d;
                break;
            case 4:
                E[b >> 0] = d ? 1 : 0
        }
    } else X(1281)
}

function Kf(a, b, c, d) {
    if (c) {
        b = T.getIndexedParameter(a, b);
        switch (typeof b) {
            case "boolean":
                a = b ? 1 : 0;
                break;
            case "number":
                a = b;
                break;
            case "object":
                if (null === b) switch (a) {
                        case 35983:
                        case 35368:
                            a = 0;
                            break;
                        default:
                            X(1280);
                            return
                    } else if (b instanceof WebGLBuffer) a = b.name | 0;
                    else {
                        X(1280);
                        return
                    } break;
            default:
                X(1280);
                return
        }
        switch (d) {
            case 1:
                If(c, a);
                break;
            case 0:
                G[c >> 2] = a;
                break;
            case 2:
                I[c >> 2] = a;
                break;
            case 4:
                E[c >> 0] = a ? 1 : 0;
                break;
            default:
                throw "internal emscriptenWebGLGetIndexed() error, bad type: " + d;
        }
    } else X(1281)
}

function Lf(a) {
    var b = aa(a) + 1,
        c = m(b);
    u(a, c, b);
    return c
}

function Mf(a) {
    return "]" == a.slice(-1) && a.lastIndexOf("[")
}

function Nf(a) {
    var b = a.Fj,
        c = a.ek,
        d;
    if (!b)
        for (a.Fj = b = {}, a.dl = {}, d = 0; d < T.getProgramParameter(a, 35718); ++d) {
            var e = T.getActiveUniform(a, d);
            var f = e.name;
            e = e.size;
            var g = Mf(f);
            g = 0 < g ? f.slice(0, g) : f;
            var l = a.dk;
            a.dk += e;
            c[g] = [e, l];
            for (f = 0; f < e; ++f) b[l] = f, a.dl[l++] = g
        }
}

function Y(a) {
    var b = T.Nk;
    if (b) {
        var c = b.Fj[a];
        "number" == typeof c && (b.Fj[a] = c = T.getUniformLocation(b, b.dl[a] + (0 < c ? "[" + c + "]" : "")));
        return c
    }
    X(1282)
}

function Of(a, b, c, d) {
    if (c)
        if (a = V[a], Nf(a), a = T.getUniform(a, Y(b)), "number" == typeof a || "boolean" == typeof a) switch (d) {
            case 0:
                G[c >> 2] = a;
                break;
            case 2:
                I[c >> 2] = a
        } else
            for (b = 0; b < a.length; b++) switch (d) {
                case 0:
                    G[c + 4 * b >> 2] = a[b];
                    break;
                case 2:
                    I[c + 4 * b >> 2] = a[b]
            } else X(1281)
}

function Pf(a, b, c, d) {
    if (c)
        if (S.bj[a].enabled && k("glGetVertexAttrib*v on client-side array: not supported, bad data returned"), a = T.getVertexAttrib(a, b), 34975 == b) G[c >> 2] = a && a.name;
        else if ("number" == typeof a || "boolean" == typeof a) switch (d) {
        case 0:
            G[c >> 2] = a;
            break;
        case 2:
            I[c >> 2] = a;
            break;
        case 5:
            G[c >> 2] = Math.fround(a)
    } else
        for (b = 0; b < a.length; b++) switch (d) {
            case 0:
                G[c + 4 * b >> 2] = a[b];
                break;
            case 2:
                I[c + 4 * b >> 2] = a[b];
                break;
            case 5:
                G[c + 4 * b >> 2] = Math.fround(a[b])
        } else X(1281)
}

function Qf(a) {
    a -= 5120;
    return 0 == a ? E : 1 == a ? A : 2 == a ? eb : 4 == a ? G : 6 == a ? I : 5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a ? N : K
}

function Rf(a) {
    return 31 - Math.clz32(a.BYTES_PER_ELEMENT)
}

function Sf(a, b, c, d, e) {
    a = Qf(a);
    var f = Rf(a),
        g = Be;
    return a.subarray(e >> f, e + d * (c * ({
        5: 3,
        6: 4,
        8: 2,
        29502: 3,
        29504: 4,
        26917: 2,
        26918: 2,
        29846: 3,
        29847: 4
    } [b - 6402] || 1) * (1 << f) + g - 1 & -g) >> f)
}
var Tf = [],
    Uf = [];

function Vf(a, b) {
    if (!bf()) return -1;
    a = sf(a);
    return a ? a.requestFullscreen || a.webkitRequestFullscreen ? Qe && Ye.vj ? Af(a, b) : b.pl ? (Ve(Af, 1, [a, b]), 1) : -2 : -3 : -4
}

function Wf(a, b) {
    var c = {
        target: sf(2),
        Ui: "beforeunload",
        $i: b,
        aj: function (d) {
            d = d || event;
            var e = P(b)(28, 0, a);
            e && (e = x(e));
            if (e) return d.preventDefault(), d.returnValue = e
        },
        Zi: !0
    };
    Ze(c)
}

function Xf(a, b, c, d, e, f) {
    ef || (ef = m(256));
    a = {
        target: sf(a),
        Ui: f,
        $i: d,
        aj: function (g) {
            g = g || event;
            var l = g.target.id ? g.target.id : "",
                n = ef;
            u(af(g.target), n + 0, 128);
            u(l, n + 128, 128);
            P(d)(e, n, b) && g.preventDefault()
        },
        Zi: c
    };
    Ze(a)
}

function Yf(a, b, c, d, e) {
    gf || (gf = m(280));
    Ze({
        target: a,
        Ui: e,
        $i: d,
        aj: function (f) {
            f = f || event;
            var g = gf,
                l = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement,
                n = !!l;
            G[g >> 2] = n;
            G[g + 4 >> 2] = bf();
            var q = n ? l : ff,
                p = q && q.id ? q.id : "";
            u(af(q), g + 8, 128);
            u(p, g + 136, 128);
            G[g + 264 >> 2] = q ? q.clientWidth : 0;
            G[g + 268 >> 2] = q ? q.clientHeight : 0;
            G[g + 272 >> 2] = screen.width;
            G[g + 276 >> 2] = screen.height;
            n && (ff = l);
            P(d)(19, g, b) && f.preventDefault()
        },
        Zi: c
    })
}

function Zf(a, b, c, d, e) {
    hf || (hf = m(1432));
    b = {
        target: sf(2),
        vj: !0,
        Ui: e,
        $i: c,
        aj: function (f) {
            f = f || event;
            var g = hf;
            Cf(g, f.gamepad);
            P(c)(d, g, a) && f.preventDefault()
        },
        Zi: b
    };
    Ze(b)
}

function $f(a, b, c, d, e, f) {
    jf || (jf = m(176));
    a = {
        target: sf(a),
        vj: !0,
        Ui: f,
        $i: d,
        aj: function (g) {
            var l = jf;
            gb[l >> 3] = g.timeStamp;
            var n = l >> 2;
            G[n + 2] = g.location;
            G[n + 3] = g.ctrlKey;
            G[n + 4] = g.shiftKey;
            G[n + 5] = g.altKey;
            G[n + 6] = g.metaKey;
            G[n + 7] = g.repeat;
            G[n + 8] = g.charCode;
            G[n + 9] = g.keyCode;
            G[n + 10] = g.which;
            u(g.key || "", l + 44, 32);
            u(g.code || "", l + 76, 32);
            u(g.char || "", l + 108, 32);
            u(g.locale || "", l + 140, 32);
            P(d)(e, l, b) && g.preventDefault()
        },
        Zi: c
    };
    Ze(a)
}

function ag(a, b, c) {
    gb[a >> 3] = b.timeStamp;
    a >>= 2;
    G[a + 2] = b.screenX;
    G[a + 3] = b.screenY;
    G[a + 4] = b.clientX;
    G[a + 5] = b.clientY;
    G[a + 6] = b.ctrlKey;
    G[a + 7] = b.shiftKey;
    G[a + 8] = b.altKey;
    G[a + 9] = b.metaKey;
    eb[2 * a + 20] = b.button;
    eb[2 * a + 21] = b.buttons;
    G[a + 11] = b.movementX;
    G[a + 12] = b.movementY;
    c = zf(c);
    G[a + 13] = b.clientX - c.left;
    G[a + 14] = b.clientY - c.top
}

function bg(a, b, c, d, e, f) {
    kf || (kf = m(72));
    a = sf(a);
    Ze({
        target: a,
        vj: "mousemove" != f && "mouseenter" != f && "mouseleave" != f,
        Ui: f,
        $i: d,
        aj: function (g) {
            g = g || event;
            ag(kf, g, a);
            P(d)(e, kf, b) && g.preventDefault()
        },
        Zi: c
    })
}

function cg(a, b, c, d, e) {
    lf || (lf = m(260));
    Ze({
        target: a,
        Ui: e,
        $i: d,
        aj: function (f) {
            f = f || event;
            var g = lf,
                l = document.pointerLockElement || document.Qi || document.ej || document.Vi;
            G[g >> 2] = !!l;
            var n = l && l.id ? l.id : "";
            u(af(l), g + 4, 128);
            u(n, g + 132, 128);
            P(d)(20, g, b) && f.preventDefault()
        },
        Zi: c
    })
}

function dg(a, b, c, d) {
    mf || (mf = m(36));
    a = sf(a);
    Ze({
        target: a,
        Ui: "resize",
        $i: d,
        aj: function (e) {
            e = e || event;
            if (e.target == a) {
                var f = document.body;
                if (f) {
                    var g = mf;
                    G[g >> 2] = e.detail;
                    G[g + 4 >> 2] = f.clientWidth;
                    G[g + 8 >> 2] = f.clientHeight;
                    G[g + 12 >> 2] = innerWidth;
                    G[g + 16 >> 2] = innerHeight;
                    G[g + 20 >> 2] = outerWidth;
                    G[g + 24 >> 2] = outerHeight;
                    G[g + 28 >> 2] = pageXOffset;
                    G[g + 32 >> 2] = pageYOffset;
                    P(d)(10, g, b) && e.preventDefault()
                }
            }
        },
        Zi: c
    })
}

function eg(a, b, c, d, e, f) {
    nf || (nf = m(1696));
    a = sf(a);
    Ze({
        target: a,
        vj: "touchstart" == f || "touchend" == f,
        Ui: f,
        $i: d,
        aj: function (g) {
            for (var l, n = {}, q = g.touches, p = 0; p < q.length; ++p) l = q[p], l.Uk = l.al = 0, n[l.identifier] = l;
            for (p = 0; p < g.changedTouches.length; ++p) l = g.changedTouches[p], l.Uk = 1, n[l.identifier] = l;
            for (p = 0; p < g.targetTouches.length; ++p) n[g.targetTouches[p].identifier].al = 1;
            q = nf;
            gb[q >> 3] = g.timeStamp;
            var t = q >> 2;
            G[t + 3] = g.ctrlKey;
            G[t + 4] = g.shiftKey;
            G[t + 5] = g.altKey;
            G[t + 6] = g.metaKey;
            t += 7;
            var v = zf(a),
                r = 0;
            for (p in n)
                if (l =
                    n[p], G[t] = l.identifier, G[t + 1] = l.screenX, G[t + 2] = l.screenY, G[t + 3] = l.clientX, G[t + 4] = l.clientY, G[t + 5] = l.pageX, G[t + 6] = l.pageY, G[t + 7] = l.Uk, G[t + 8] = l.al, G[t + 9] = l.clientX - v.left, G[t + 10] = l.clientY - v.top, t += 13, 31 < ++r) break;
            G[q + 8 >> 2] = r;
            P(d)(e, q, b) && g.preventDefault()
        },
        Zi: c
    })
}

function fg(a, b, c) {
    var d = rf[1];
    of || (of = m(8));
    Ze({
        target: d,
        Ui: "visibilitychange",
        $i: c,
        aj: function (e) {
            e = e || event;
            var f = of,
                g = ["hidden", "visible", "prerender", "unloaded"].indexOf(document.visibilityState);
            G[f >> 2] = document.hidden;
            G[f + 4 >> 2] = g;
            P(c)(21, f, a) && e.preventDefault()
        },
        Zi: b
    })
}

function gg(a, b, c, d, e, f) {
    a = {
        target: sf(a),
        Ui: f,
        $i: d,
        aj: function (g) {
            g = g || event;
            P(d)(e, 0, b) && g.preventDefault()
        },
        Zi: c
    };
    Ze(a)
}

function hg(a, b, c, d) {
    pf || (pf = m(104));
    Ze({
        target: a,
        vj: !0,
        Ui: "wheel",
        $i: d,
        aj: function (e) {
            e = e || event;
            var f = pf;
            ag(f, e, a);
            gb[f + 72 >> 3] = e.deltaX;
            gb[f + 80 >> 3] = e.deltaY;
            gb[f + 88 >> 3] = e.deltaZ;
            G[f + 96 >> 2] = e.deltaMode;
            P(d)(9, f, b) && e.preventDefault()
        },
        Zi: c
    })
}
var ig = [];

function jg(a, b) {
    N[a >> 2] = b;
    N[a + 4 >> 2] = b / 4294967296 | 0
}
var kg;

function lg(a, b, c, d, e) {
    function f(L) {
        var fa = 0,
            R = 0;
        L && (R = z.response ? z.response.byteLength : 0, fa = m(R), A.set(new Uint8Array(z.response), fa));
        N[a + 12 >> 2] = fa;
        jg(a + 16, R)
    }
    var g = N[a + 8 >> 2];
    if (g) {
        var l = x(g),
            n = a + 112,
            q = x(n);
        q || (q = "GET");
        var p = N[n + 52 >> 2],
            t = N[n + 56 >> 2],
            v = !!N[n + 60 >> 2],
            r = N[n + 68 >> 2],
            C = N[n + 72 >> 2];
        g = N[n + 76 >> 2];
        var y = N[n + 80 >> 2],
            F = N[n + 84 >> 2];
        n = N[n + 88 >> 2];
        var J = !!(p & 1),
            M = !!(p & 2);
        p = !!(p & 64);
        r = r ? x(r) : void 0;
        C = C ? x(C) : void 0;
        var z = new XMLHttpRequest;
        z.withCredentials = v;
        z.open(q, l, !p, r, C);
        p || (z.timeout = t);
        z.Qi =
            l;
        z.responseType = "arraybuffer";
        y && (l = x(y), z.overrideMimeType(l));
        if (g)
            for (;;) {
                q = N[g >> 2];
                if (!q) break;
                l = N[g + 4 >> 2];
                if (!l) break;
                g += 8;
                q = x(q);
                l = x(l);
                z.setRequestHeader(q, l)
            }
        ig.push(z);
        N[a + 0 >> 2] = ig.length;
        g = F && n ? A.slice(F, F + n) : null;
        z.onload = L => {
            f(J && !M);
            var fa = z.response ? z.response.byteLength : 0;
            jg(a + 24, 0);
            fa && jg(a + 32, fa);
            K[a + 40 >> 1] = z.readyState;
            K[a + 42 >> 1] = z.status;
            z.statusText && u(z.statusText, a + 44, 64);
            200 <= z.status && 300 > z.status ? b && b(a, z, L) : c && c(a, z, L)
        };
        z.onerror = L => {
            f(J);
            var fa = z.status;
            jg(a + 24, 0);
            jg(a +
                32, z.response ? z.response.byteLength : 0);
            K[a + 40 >> 1] = z.readyState;
            K[a + 42 >> 1] = fa;
            c && c(a, z, L)
        };
        z.ontimeout = L => {
            c && c(a, z, L)
        };
        z.onprogress = L => {
            var fa = J && M && z.response ? z.response.byteLength : 0,
                R = 0;
            J && M && (R = m(fa), A.set(new Uint8Array(z.response), R));
            N[a + 12 >> 2] = R;
            jg(a + 16, fa);
            jg(a + 24, L.loaded - fa);
            jg(a + 32, L.total);
            K[a + 40 >> 1] = z.readyState;
            3 <= z.readyState && 0 === z.status && 0 < L.loaded && (z.status = 200);
            K[a + 42 >> 1] = z.status;
            z.statusText && u(z.statusText, a + 44, 64);
            d && d(a, z, L);
            R && ca(R)
        };
        z.onreadystatechange = L => {
            K[a + 40 >> 1] =
                z.readyState;
            2 <= z.readyState && (K[a + 42 >> 1] = z.status);
            e && e(a, z, L)
        };
        try {
            z.send(g)
        } catch (L) {
            c && c(a, z, L)
        }
    } else c(a, 0, "no url specified!")
}

function mg(a, b, c, d) {
    var e = kg;
    if (e) {
        var f = N[a + 112 + 64 >> 2];
        f || (f = N[a + 8 >> 2]);
        var g = x(f);
        try {
            var l = e.transaction(["FILES"], "readwrite").objectStore("FILES").put(b, g);
            l.onsuccess = () => {
                K[a + 40 >> 1] = 4;
                K[a + 42 >> 1] = 200;
                u("OK", a + 44, 64);
                c(a, 0, g)
            };
            l.onerror = n => {
                K[a + 40 >> 1] = 4;
                K[a + 42 >> 1] = 413;
                u("Payload Too Large", a + 44, 64);
                d(a, 0, n)
            }
        } catch (n) {
            d(a, 0, n)
        }
    } else d(a, 0, "IndexedDB not available!")
}

function ng(a, b, c) {
    var d = kg;
    if (d) {
        var e = N[a + 112 + 64 >> 2];
        e || (e = N[a + 8 >> 2]);
        e = x(e);
        try {
            var f = d.transaction(["FILES"], "readonly").objectStore("FILES").get(e);
            f.onsuccess = g => {
                if (g.target.result) {
                    g = g.target.result;
                    var l = g.byteLength || g.length,
                        n = m(l);
                    A.set(new Uint8Array(g), n);
                    N[a + 12 >> 2] = n;
                    jg(a + 16, l);
                    jg(a + 24, 0);
                    jg(a + 32, l);
                    K[a + 40 >> 1] = 4;
                    K[a + 42 >> 1] = 200;
                    u("OK", a + 44, 64);
                    b(a, 0, g)
                } else K[a + 40 >> 1] = 4, K[a + 42 >> 1] = 404, u("Not Found", a + 44, 64), c(a, 0, "no data")
            };
            f.onerror = g => {
                K[a + 40 >> 1] = 4;
                K[a + 42 >> 1] = 404;
                u("Not Found", a +
                    44, 64);
                c(a, 0, g)
            }
        } catch (g) {
            c(a, 0, g)
        }
    } else c(a, 0, "IndexedDB not available!")
}

function og(a, b, c) {
    var d = kg;
    if (d) {
        var e = N[a + 112 + 64 >> 2];
        e || (e = N[a + 8 >> 2]);
        e = x(e);
        try {
            var f = d.transaction(["FILES"], "readwrite").objectStore("FILES").delete(e);
            f.onsuccess = g => {
                g = g.target.result;
                N[a + 12 >> 2] = 0;
                jg(a + 16, 0);
                jg(a + 24, 0);
                jg(a + 32, 0);
                K[a + 40 >> 1] = 4;
                K[a + 42 >> 1] = 200;
                u("OK", a + 44, 64);
                b(a, 0, g)
            };
            f.onerror = g => {
                K[a + 40 >> 1] = 4;
                K[a + 42 >> 1] = 404;
                u("Not Found", a + 44, 64);
                c(a, 0, g)
            }
        } catch (g) {
            c(a, 0, g)
        }
    } else c(a, 0, "IndexedDB not available!")
}
var pg = ["default", "low-power", "high-performance"],
    qg = [null],
    Z = null,
    rg = {};

function sg() {
    if (!tg) {
        var a = {
                USER: "web_user",
                LOGNAME: "web_user",
                PATH: "/",
                PWD: "/",
                HOME: "/home/web_user",
                LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
                _: Ka || "./this.program"
            },
            b;
        for (b in rg) void 0 === rg[b] ? delete a[b] : a[b] = rg[b];
        var c = [];
        for (b in a) c.push(b + "=" + a[b]);
        tg = c
    }
    return tg
}
var tg;

function ug(a) {
    a = a.split(".");
    for (var b = 0; 4 > b; b++) {
        var c = Number(a[b]);
        if (isNaN(c)) return null;
        a[b] = c
    }
    return (a[0] | a[1] << 8 | a[2] << 16 | a[3] << 24) >>> 0
}

function vg(a) {
    var b, c, d = [];
    if (!/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i.test(a)) return null;
    if ("::" === a) return [0, 0, 0, 0, 0, 0, 0, 0];
    a = a.startsWith("::") ? a.replace("::", "Z:") : a.replace("::", ":Z:");
    0 < a.indexOf(".") ? (a = a.replace(RegExp("[.]", "g"), ":"), a = a.split(":"), a[a.length - 4] = parseInt(a[a.length - 4]) + 256 * parseInt(a[a.length - 3]), a[a.length - 3] = parseInt(a[a.length - 2]) + 256 * parseInt(a[a.length -
        1]), a = a.slice(0, a.length - 2)) : a = a.split(":");
    for (b = c = 0; b < a.length; b++)
        if ("string" == typeof a[b])
            if ("Z" === a[b]) {
                for (c = 0; c < 8 - a.length + 1; c++) d[b + c] = 0;
                --c
            } else d[b + c] = wg(parseInt(a[b], 16));
    else d[b + c] = a[b];
    return [d[1] << 16 | d[0], d[3] << 16 | d[2], d[5] << 16 | d[4], d[7] << 16 | d[6]]
}
var xg = 1,
    yg = {};

function zg(a) {
    var b = ug(a);
    if (null !== b) return a;
    b = vg(a);
    if (null !== b) return a;
    yg[a] ? b = yg[a] : (b = xg++, 65535 > b || cb("exceeded max address mappings of 65535"), b = "172.29." + (b & 255) + "." + (b & 65280), yg[a] = b);
    return b
}

function Ag(a) {
    return (a & 255) + "." + (a >> 8 & 255) + "." + (a >> 16 & 255) + "." + (a >> 24 & 255)
}

function Bg(a) {
    return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400)
}
var Cg = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    Dg = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function Eg(a, b, c, d) {
    function e(r, C, y) {
        for (r = "number" == typeof r ? r.toString() : r || ""; r.length < C;) r = y[0] + r;
        return r
    }

    function f(r, C) {
        return e(r, C, "0")
    }

    function g(r, C) {
        function y(J) {
            return 0 > J ? -1 : 0 < J ? 1 : 0
        }
        var F;
        0 === (F = y(r.getFullYear() - C.getFullYear())) && 0 === (F = y(r.getMonth() - C.getMonth())) && (F = y(r.getDate() - C.getDate()));
        return F
    }

    function l(r) {
        switch (r.getDay()) {
            case 0:
                return new Date(r.getFullYear() - 1, 11, 29);
            case 1:
                return r;
            case 2:
                return new Date(r.getFullYear(), 0, 3);
            case 3:
                return new Date(r.getFullYear(),
                    0, 2);
            case 4:
                return new Date(r.getFullYear(), 0, 1);
            case 5:
                return new Date(r.getFullYear() - 1, 11, 31);
            case 6:
                return new Date(r.getFullYear() - 1, 11, 30)
        }
    }

    function n(r) {
        var C = r.Dj;
        for (r = new Date((new Date(r.Ej + 1900, 0, 1)).getTime()); 0 < C;) {
            var y = r.getMonth(),
                F = (Bg(r.getFullYear()) ? Cg : Dg)[y];
            if (C > F - r.getDate()) C -= F - r.getDate() + 1, r.setDate(1), 11 > y ? r.setMonth(y + 1) : (r.setMonth(0), r.setFullYear(r.getFullYear() + 1));
            else {
                r.setDate(r.getDate() + C);
                break
            }
        }
        y = new Date(r.getFullYear() + 1, 0, 4);
        C = l(new Date(r.getFullYear(),
            0, 4));
        y = l(y);
        return 0 >= g(C, r) ? 0 >= g(y, r) ? r.getFullYear() + 1 : r.getFullYear() : r.getFullYear() - 1
    }
    var q = G[d + 40 >> 2];
    d = {
        Pl: G[d >> 2],
        Ol: G[d + 4 >> 2],
        bk: G[d + 8 >> 2],
        Dk: G[d + 12 >> 2],
        ck: G[d + 16 >> 2],
        Ej: G[d + 20 >> 2],
        ij: G[d + 24 >> 2],
        Dj: G[d + 28 >> 2],
        nm: G[d + 32 >> 2],
        Nl: G[d + 36 >> 2],
        Ql: q ? x(q) : ""
    };
    c = x(c);
    q = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y"
    };
    for (var p in q) c = c.replace(new RegExp(p, "g"), q[p]);
    var t = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
        v = "January February March April May June July August September October November December".split(" ");
    q = {
        "%a": function (r) {
            return t[r.ij].substring(0, 3)
        },
        "%A": function (r) {
            return t[r.ij]
        },
        "%b": function (r) {
            return v[r.ck].substring(0, 3)
        },
        "%B": function (r) {
            return v[r.ck]
        },
        "%C": function (r) {
            return f((r.Ej + 1900) / 100 | 0, 2)
        },
        "%d": function (r) {
            return f(r.Dk, 2)
        },
        "%e": function (r) {
            return e(r.Dk, 2, " ")
        },
        "%g": function (r) {
            return n(r).toString().substring(2)
        },
        "%G": function (r) {
            return n(r)
        },
        "%H": function (r) {
            return f(r.bk, 2)
        },
        "%I": function (r) {
            r = r.bk;
            0 == r ? r = 12 : 12 < r && (r -= 12);
            return f(r, 2)
        },
        "%j": function (r) {
            for (var C = 0, y = 0; y <= r.ck - 1; C += (Bg(r.Ej + 1900) ? Cg : Dg)[y++]);
            return f(r.Dk + C, 3)
        },
        "%m": function (r) {
            return f(r.ck + 1, 2)
        },
        "%M": function (r) {
            return f(r.Ol, 2)
        },
        "%n": function () {
            return "\n"
        },
        "%p": function (r) {
            return 0 <=
                r.bk && 12 > r.bk ? "AM" : "PM"
        },
        "%S": function (r) {
            return f(r.Pl, 2)
        },
        "%t": function () {
            return "\t"
        },
        "%u": function (r) {
            return r.ij || 7
        },
        "%U": function (r) {
            return f(Math.floor((r.Dj + 7 - r.ij) / 7), 2)
        },
        "%V": function (r) {
            var C = Math.floor((r.Dj + 7 - (r.ij + 6) % 7) / 7);
            2 >= (r.ij + 371 - r.Dj - 2) % 7 && C++;
            if (C) 53 == C && (y = (r.ij + 371 - r.Dj) % 7, 4 == y || 3 == y && Bg(r.Ej) || (C = 1));
            else {
                C = 52;
                var y = (r.ij + 7 - r.Dj - 1) % 7;
                (4 == y || 5 == y && Bg(r.Ej % 400 - 1)) && C++
            }
            return f(C, 2)
        },
        "%w": function (r) {
            return r.ij
        },
        "%W": function (r) {
            return f(Math.floor((r.Dj + 7 - (r.ij + 6) % 7) / 7), 2)
        },
        "%y": function (r) {
            return (r.Ej + 1900).toString().substring(2)
        },
        "%Y": function (r) {
            return r.Ej + 1900
        },
        "%z": function (r) {
            r = r.Nl;
            var C = 0 <= r;
            r = Math.abs(r) / 60;
            return (C ? "+" : "-") + String("0000" + (r / 60 * 100 + r % 60)).slice(-4)
        },
        "%Z": function (r) {
            return r.Ql
        },
        "%%": function () {
            return "%"
        }
    };
    c = c.replace(/%%/g, "\x00\x00");
    for (p in q) c.includes(p) && (c = c.replace(new RegExp(p, "g"), q[p](d)));
    c = c.replace(/\0\0/g, "%");
    p = ic(c, !1);
    if (p.length > b) return 0;
    E.set(p, a);
    return p.length - 1
}

function Dc(a, b, c, d) {
    a || (a = this);
    this.parent = a;
    this.Si = a.Si;
    this.qj = null;
    this.id = tc++;
    this.name = b;
    this.mode = c;
    this.Li = {};
    this.Ni = {};
    this.rdev = d
}
Object.defineProperties(Dc.prototype, {
    read: {
        get: function () {
            return 365 === (this.mode & 365)
        },
        set: function (a) {
            a ? this.mode |= 365 : this.mode &= -366
        }
    },
    write: {
        get: function () {
            return 146 === (this.mode & 146)
        },
        set: function (a) {
            a ? this.mode |= 146 : this.mode &= -147
        }
    },
    Fl: {
        get: function () {
            return 16384 === (this.mode & 61440)
        }
    },
    El: {
        get: function () {
            return 8192 === (this.mode & 61440)
        }
    }
});
Vc();
uc = Array(4096);
Ob(B, "/");
Nb("/tmp");
Nb("/home");
Nb("/home/web_user");
(() => {
    Nb("/dev");
    gc(259, {
        read: () => 0,
        write: (b, c, d, e) => e
    });
    Nc("/dev/null", 259);
    fc(1280, jc);
    fc(1536, kc);
    Nc("/dev/tty", 1280);
    Nc("/dev/tty1", 1536);
    var a = ac();
    ad("/dev", "random", a);
    ad("/dev", "urandom", a);
    Nb("/dev/shm");
    Nb("/dev/shm/tmp")
})();
(() => {
    Nb("/proc");
    var a = Nb("/proc/self");
    Nb("/proc/self/fd");
    Ob({
        Si: () => {
            var b = mc(a, "fd", 16895, 73);
            b.Li = {
                lookup: (c, d) => {
                    var e = sc[+d];
                    if (!e) throw new Q(8);
                    c = {
                        parent: null,
                        Si: {
                            rj: "fake"
                        },
                        Li: {
                            readlink: () => e.path
                        }
                    };
                    return c.parent = c
                }
            };
            return b
        }
    }, "/proc/self/fd")
})();
h.FS_createPath = Yc;
h.FS_createDataFile = $c;
h.FS_createPreloadedFile = ed;
h.FS_unlink = Ha;
h.FS_createLazyFile = cd;
h.FS_createDevice = ad;
h.requestFullscreen = function (a, b) {
    Yd(a, b)
};
h.requestAnimationFrame = function (a) {
    xd(a)
};
h.setCanvasSize = function (a, b, c) {
    $d(h.canvas, a, b);
    c || ae()
};
h.pauseMainLoop = function () {
    td = null;
    zd++
};
h.resumeMainLoop = function () {
    zd++;
    var a = pd,
        b = qd,
        c = rd;
    rd = null;
    yd(c);
    od(a, b);
    td()
};
h.getUserMedia = function () {
    window.getUserMedia || (window.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia);
    window.getUserMedia(void 0)
};
h.createContext = function (a, b, c, d) {
    return Qd(a, b, c, d)
};
for (var T, Fg = 0; 32 > Fg; ++Fg) Df.push(Array(Fg));
var Gg = new Float32Array(288);
for (Fg = 0; 288 > Fg; ++Fg) Tf[Fg] = Gg.subarray(0, Fg + 1);
var Hg = new Int32Array(288);
for (Fg = 0; 288 > Fg; ++Fg) Uf[Fg] = Hg.subarray(0, Fg + 1);
(function (a, b) {
    try {
        var c = indexedDB.open("emscripten_filesystem", 1)
    } catch (d) {
        b(d);
        return
    }
    c.onupgradeneeded = d => {
        d = d.target.result;
        d.objectStoreNames.contains("FILES") && d.deleteObjectStore("FILES");
        d.createObjectStore("FILES")
    };
    c.onsuccess = d => a(d.target.result);
    c.onerror = d => b(d)
})(a => {
    kg = a;
    Hb("library_fetch_init")
}, () => {
    kg = !1;
    Hb("library_fetch_init")
});
"undefined" != typeof ENVIRONMENT_IS_FETCH_WORKER && ENVIRONMENT_IS_FETCH_WORKER || Gb("library_fetch_init");

function ic(a, b) {
    var c = Array(aa(a) + 1);
    a = qb(a, c, 0, c.length);
    b && (c.length = a);
    return c
}
var Xg = {
    Ub: function (a) {
        try {
            a = x(a);
            var b = D(a, {
                zj: !0
            });
            if (null === b.node) throw new Q(44);
            if (16384 !== (b.node.mode & 61440)) throw new Q(54);
            var c = Cc(b.node, "x");
            if (c) throw new Q(c);
            cc = b.path;
            return 0
        } catch (d) {
            if ("undefined" == typeof fd || !(d instanceof Q)) throw d;
            return -d.Pi
        }
    },
    Ga: function (a, b, c) {
        jd = c;
        try {
            var d = ld(a);
            switch (b) {
                case 0:
                    var e = kd();
                    return 0 > e ? -28 : Kc(d, e).fd;
                case 1:
                case 2:
                    return 0;
                case 3:
                    return d.flags;
                case 4:
                    return e = kd(), d.flags |= e, 0;
                case 5:
                    return e = kd(), eb[e + 0 >> 1] = 2, 0;
                case 6:
                case 7:
                    return 0;
                case 16:
                case 8:
                    return -28;
                case 9:
                    return G[Ig() >> 2] = 28, -1;
                default:
                    return -28
            }
        } catch (f) {
            if ("undefined" == typeof fd || !(f instanceof Q)) throw f;
            return -f.Pi
        }
    },
    Fb: function (a, b, c) {
        try {
            var d = ld(a);
            d.Aj || (d.Aj = Aa(d.path));
            a = 0;
            for (var e = Tc(d, 0, 1), f = Math.floor(e / 280); f < d.Aj.length && a + 280 <= c;) {
                var g = d.Aj[f];
                if ("." === g) {
                    var l = d.node.id;
                    var n = 4
                } else if (".." === g) l = D(d.path, {
                    parent: !0
                }).node.id, n = 4;
                else {
                    var q = oc(d.node, g);
                    l = q.id;
                    n = 8192 === (q.mode & 61440) ? 2 : 16384 === (q.mode & 61440) ? 4 : 40960 === (q.mode & 61440) ? 10 : 8
                }
                fb = [l >>>
                    0, (H = l, 1 <= +Math.abs(H) ? 0 < H ? (Math.min(+Math.floor(H / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((H - +(~~H >>> 0)) / 4294967296) >>> 0 : 0)
                ];
                G[b + a >> 2] = fb[0];
                G[b + a + 4 >> 2] = fb[1];
                fb = [280 * (f + 1) >>> 0, (H = 280 * (f + 1), 1 <= +Math.abs(H) ? 0 < H ? (Math.min(+Math.floor(H / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((H - +(~~H >>> 0)) / 4294967296) >>> 0 : 0)];
                G[b + a + 8 >> 2] = fb[0];
                G[b + a + 12 >> 2] = fb[1];
                eb[b + a + 16 >> 1] = 280;
                E[b + a + 18 >> 0] = n;
                u(g, b + a + 19, 256);
                a += 280;
                f += 1
            }
            Tc(d, 280 * f, 0);
            return a
        } catch (p) {
            if ("undefined" == typeof fd || !(p instanceof Q)) throw p;
            return -p.Pi
        }
    },
    Vb: function (a, b, c) {
        jd = c;
        try {
            var d = ld(a);
            switch (b) {
                case 21509:
                case 21505:
                    return d.tty ? 0 : -59;
                case 21510:
                case 21511:
                case 21512:
                case 21506:
                case 21507:
                case 21508:
                    return d.tty ? 0 : -59;
                case 21519:
                    if (!d.tty) return -59;
                    var e = kd();
                    return G[e >> 2] = 0;
                case 21520:
                    return d.tty ? -28 : -59;
                case 21531:
                    a = e = kd();
                    if (!d.Ni.Dl) throw new Q(59);
                    return d.Ni.Dl(d, b, a);
                case 21523:
                    return d.tty ? 0 : -59;
                case 21524:
                    return d.tty ? 0 : -59;
                default:
                    cb("bad ioctl syscall " + b)
            }
        } catch (f) {
            if ("undefined" == typeof fd || !(f instanceof Q)) throw f;
            return -f.Pi
        }
    },
    Jb: function (a, b) {
        try {
            return a = x(a), hd(Pc, a, b)
        } catch (c) {
            if ("undefined" == typeof fd || !(c instanceof Q)) throw c;
            return -c.Pi
        }
    },
    Gb: function (a, b, c) {
        try {
            return b = x(b), b = gd(a, b), b = za(b), "/" === b[b.length - 1] && (b = b.substr(0, b.length - 1)), Nb(b, c), 0
        } catch (d) {
            if ("undefined" == typeof fd || !(d instanceof Q)) throw d;
            return -d.Pi
        }
    },
    Kb: function (a, b, c, d) {
        try {
            b = x(b);
            var e = d & 256;
            b = gd(a, b, d & 4096);
            return hd(e ? Pc : Ba, b, c)
        } catch (f) {
            if ("undefined" == typeof fd || !(f instanceof Q)) throw f;
            return -f.Pi
        }
    },
    Da: function (a, b,
        c, d) {
        jd = d;
        try {
            b = x(b);
            b = gd(a, b);
            var e = d ? kd() : 0;
            return Rc(b, c, e).fd
        } catch (f) {
            if ("undefined" == typeof fd || !(f instanceof Q)) throw f;
            return -f.Pi
        }
    },
    Eb: function (a, b, c, d) {
        try {
            b = x(b);
            b = gd(a, b);
            if (0 >= d) var e = -28;
            else {
                var f = xc(b),
                    g = Math.min(d, aa(f)),
                    l = E[c + g];
                u(f, c, d + 1);
                E[c + g] = l;
                e = g
            }
            return e
        } catch (n) {
            if ("undefined" == typeof fd || !(n instanceof Q)) throw n;
            return -n.Pi
        }
    },
    Bb: function (a, b, c, d) {
        try {
            b = x(b);
            d = x(d);
            b = gd(a, b);
            d = gd(c, d);
            a = b;
            var e = Zb(a),
                f = Zb(d),
                g = $b(a),
                l = $b(d);
            var n = D(a, {
                parent: !0
            });
            var q = n.node;
            n = D(d, {
                parent: !0
            });
            var p = n.node;
            if (!q || !p) throw new Q(44);
            if (q.Si !== p.Si) throw new Q(75);
            var t = oc(q, g),
                v = dc(a, f);
            if ("." !== v.charAt(0)) throw new Q(28);
            v = dc(d, e);
            if ("." !== v.charAt(0)) throw new Q(55);
            try {
                var r = oc(p, l)
            } catch (F) {}
            if (t !== r) {
                var C = 16384 === (t.mode & 61440),
                    y = Hc(q, g, C);
                if (y) throw new Q(y);
                if (y = r ? Hc(p, l, C) : Gc(p, l)) throw new Q(y);
                if (!q.Li.rename) throw new Q(63);
                if (t.qj || r && r.qj) throw new Q(10);
                if (p !== q && (y = Cc(q, "w"))) throw new Q(y);
                Bc(t);
                try {
                    q.Li.rename(t, p, l)
                } catch (F) {
                    throw F;
                } finally {
                    Ac(t)
                }
            }
            return 0
        } catch (F) {
            if ("undefined" ==
                typeof fd || !(F instanceof Q)) throw F;
            return -F.Pi
        }
    },
    Cb: function (a) {
        try {
            return a = x(a), Ga(a), 0
        } catch (b) {
            if ("undefined" == typeof fd || !(b instanceof Q)) throw b;
            return -b.Pi
        }
    },
    Lb: function (a, b) {
        try {
            return a = x(a), hd(Ba, a, b)
        } catch (c) {
            if ("undefined" == typeof fd || !(c instanceof Q)) throw c;
            return -c.Pi
        }
    },
    Db: function (a, b, c) {
        try {
            return b = x(b), b = gd(a, b), 0 === c ? Ha(b) : 512 === c ? Ga(b) : cb("Invalid flags passed to unlinkat"), 0
        } catch (d) {
            if ("undefined" == typeof fd || !(d instanceof Q)) throw d;
            return -d.Pi
        }
    },
    Tb: function () {
        cb("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")
    },
    ha: function () {
        return Date.now()
    },
    hh: function (a) {
        delete ig[a - 1]
    },
    fh: function (a, b, c) {
        a = ig[a - 1].getAllResponseHeaders();
        var d = aa(a) + 1;
        u(a, b, c);
        return Math.min(d, c)
    },
    gh: function (a) {
        return aa(ig[a - 1].getAllResponseHeaders()) + 1
    },
    Mb: function () {
        return !0
    },
    zb: function () {
        throw Infinity;
    },
    Nb: function (a, b) {
        a = new Date(1E3 * G[a >> 2]);
        G[b >> 2] = a.getUTCSeconds();
        G[b + 4 >> 2] = a.getUTCMinutes();
        G[b + 8 >> 2] = a.getUTCHours();
        G[b + 12 >> 2] = a.getUTCDate();
        G[b + 16 >> 2] = a.getUTCMonth();
        G[b + 20 >> 2] = a.getUTCFullYear() - 1900;
        G[b + 24 >> 2] = a.getUTCDay();
        G[b + 28 >> 2] = (a.getTime() - Date.UTC(a.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864E5 | 0
    },
    Ob: function (a, b) {
        a = new Date(1E3 * G[a >> 2]);
        G[b >> 2] = a.getSeconds();
        G[b + 4 >> 2] = a.getMinutes();
        G[b + 8 >> 2] = a.getHours();
        G[b + 12 >> 2] = a.getDate();
        G[b + 16 >> 2] = a.getMonth();
        G[b + 20 >> 2] = a.getFullYear() - 1900;
        G[b + 24 >> 2] = a.getDay();
        var c = new Date(a.getFullYear(), 0, 1);
        G[b + 28 >> 2] = (a.getTime() - c.getTime()) / 864E5 | 0;
        G[b + 36 >> 2] = -(60 * a.getTimezoneOffset());
        var d = (new Date(a.getFullYear(), 6, 1)).getTimezoneOffset();
        c = c.getTimezoneOffset();
        G[b + 32 >> 2] =
            (d != c && a.getTimezoneOffset() == Math.min(c, d)) | 0
    },
    Pb: function (a) {
        var b = new Date(G[a + 20 >> 2] + 1900, G[a + 16 >> 2], G[a + 12 >> 2], G[a + 8 >> 2], G[a + 4 >> 2], G[a >> 2], 0),
            c = G[a + 32 >> 2],
            d = b.getTimezoneOffset(),
            e = new Date(b.getFullYear(), 0, 1),
            f = (new Date(b.getFullYear(), 6, 1)).getTimezoneOffset(),
            g = e.getTimezoneOffset(),
            l = Math.min(g, f);
        0 > c ? G[a + 32 >> 2] = Number(f != g && l == d) : 0 < c != (l == d) && (f = Math.max(g, f), b.setTime(b.getTime() + 6E4 * ((0 < c ? l : f) - d)));
        G[a + 24 >> 2] = b.getDay();
        G[a + 28 >> 2] = (b.getTime() - e.getTime()) / 864E5 | 0;
        G[a >> 2] = b.getSeconds();
        G[a + 4 >> 2] = b.getMinutes();
        G[a + 8 >> 2] = b.getHours();
        G[a + 12 >> 2] = b.getDate();
        G[a + 16 >> 2] = b.getMonth();
        return b.getTime() / 1E3 | 0
    },
    Qb: function (a) {
        var b = new Date(Date.UTC(G[a + 20 >> 2] + 1900, G[a + 16 >> 2], G[a + 12 >> 2], G[a + 8 >> 2], G[a + 4 >> 2], G[a >> 2], 0));
        G[a + 24 >> 2] = b.getUTCDay();
        G[a + 28 >> 2] = (b.getTime() - Date.UTC(b.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864E5 | 0;
        return b.getTime() / 1E3 | 0
    },
    Rb: nd,
    x: function () {
        cb("")
    },
    Ah: function (a) {
        if (12448 == a) return U = 12288, 1;
        U = 12300;
        return 0
    },
    Dh: function (a, b, c, d, e) {
        if (62E3 != a) U = 12296, c = 0;
        else {
            if (b)
                for (;;) {
                    a =
                        G[b >> 2];
                    if (12321 == a) he.alpha = 0 < G[b + 4 >> 2];
                    else if (12325 == a) he.depth = 0 < G[b + 4 >> 2];
                    else if (12326 == a) he.stencil = 0 < G[b + 4 >> 2];
                    else if (12337 == a) a = G[b + 4 >> 2], he.antialias = 0 < a;
                    else if (12338 == a) a = G[b + 4 >> 2], he.antialias = 1 == a;
                    else if (12544 == a) he.gm = 12547 != G[b + 4 >> 2];
                    else if (12344 == a) break;
                    b += 8
                }
            c && d || e ? (e && (G[e >> 2] = 1), c && 0 < d && (G[c >> 2] = 62002), U = 12288, c = 1) : (U = 12300, c = 0)
        }
        return c
    },
    rh: function (a, b, c, d) {
        if (62E3 != a) return U = 12296, 0;
        for (a = 1;;) {
            b = G[d >> 2];
            if (12440 == b) a = G[d + 4 >> 2];
            else if (12344 == b) break;
            else return U = 12292,
                0;
            d += 8
        }
        if (2 > a || 3 < a) return U = 12293, 0;
        he.Tj = a - 1;
        he.Gl = 0;
        je = Sd(h.canvas, he);
        if (0 != je) return U = 12288, Ud(je), h.Sl = !0, Jd.forEach(function (e) {
            e()
        }), Ud(null), 62004;
        U = 12297;
        return 0
    },
    th: function (a, b) {
        if (62E3 != a) return U = 12296, 0;
        if (62002 != b) return U = 12293, 0;
        U = 12288;
        return 62006
    },
    sh: function (a, b) {
        if (62E3 != a) return U = 12296, 0;
        if (62004 != b) return U = 12294, 0;
        a = je;
        S === Td[a] && (S = null);
        if ("object" == typeof cf)
            for (var c = Td[a].dj.canvas, d = 0; d < Se.length; ++d) Se[d].target != c || Te(d--);
        Td[a] && Td[a].dj.canvas && (Td[a].dj.canvas.Mj =
            void 0);
        Td[a] = null;
        U = 12288;
        ee == b && (ee = 0);
        return 1
    },
    uh: function (a, b) {
        if (62E3 != a) return U = 12296, 0;
        if (62006 != b) return U = 12301, 1;
        fe == b && (fe = 0);
        ge == b && (ge = 0);
        U = 12288;
        return 1
    },
    Eh: function (a, b, c, d) {
        if (62E3 != a) return U = 12296, 0;
        if (62002 != b) return U = 12293, 0;
        if (!d) return U = 12300, 0;
        U = 12288;
        switch (c) {
            case 12320:
                return G[d >> 2] = he.alpha ? 32 : 24, 1;
            case 12321:
                return G[d >> 2] = he.alpha ? 8 : 0, 1;
            case 12322:
                return G[d >> 2] = 8, 1;
            case 12323:
                return G[d >> 2] = 8, 1;
            case 12324:
                return G[d >> 2] = 8, 1;
            case 12325:
                return G[d >> 2] = he.depth ? 24 :
                    0, 1;
            case 12326:
                return G[d >> 2] = he.stencil ? 8 : 0, 1;
            case 12327:
                return G[d >> 2] = 12344, 1;
            case 12328:
                return G[d >> 2] = 62002, 1;
            case 12329:
                return G[d >> 2] = 0, 1;
            case 12330:
                return G[d >> 2] = 4096, 1;
            case 12331:
                return G[d >> 2] = 16777216, 1;
            case 12332:
                return G[d >> 2] = 4096, 1;
            case 12333:
                return G[d >> 2] = 0, 1;
            case 12334:
                return G[d >> 2] = 0, 1;
            case 12335:
                return G[d >> 2] = 12344, 1;
            case 12337:
                return G[d >> 2] = he.antialias ? 4 : 0, 1;
            case 12338:
                return G[d >> 2] = he.antialias ? 1 : 0, 1;
            case 12339:
                return G[d >> 2] = 4, 1;
            case 12340:
                return G[d >> 2] = 12344, 1;
            case 12341:
            case 12342:
            case 12343:
                return G[d >>
                    2] = -1, 1;
            case 12345:
            case 12346:
                return G[d >> 2] = 0, 1;
            case 12347:
                return G[d >> 2] = 0, 1;
            case 12348:
                return G[d >> 2] = 1;
            case 12349:
            case 12350:
                return G[d >> 2] = 0, 1;
            case 12351:
                return G[d >> 2] = 12430, 1;
            case 12352:
                return G[d >> 2] = 4, 1;
            case 12354:
                return G[d >> 2] = 0, 1;
            default:
                return U = 12292, 0
        }
    },
    Ya: function () {
        U = 12288;
        return 62E3
    },
    qh: function () {
        return U
    },
    Bh: function (a, b, c) {
        if (62E3 == a) return b && (G[b >> 2] = 1), c && (G[c >> 2] = 4), de = !0, U = 12288, 1;
        U = 12296;
        return 0
    },
    vh: function (a, b, c, d) {
        if (62E3 != a) return U = 12296, 0;
        if (0 != d && 62004 != d) return U =
            12294, 0;
        if (0 != c && 62006 != c || 0 != b && 62006 != b) return U = 12301, 0;
        Ud(d ? je : null);
        ee = d;
        ge = b;
        fe = c;
        U = 12288;
        return 1
    },
    ph: function (a, b) {
        if (62E3 != a) return U = 12296, 0;
        U = 12288;
        if (ie[b]) return ie[b];
        switch (b) {
            case 12371:
                a = rb("Emscripten");
                break;
            case 12372:
                a = rb("1.4 Emscripten EGL");
                break;
            case 12373:
                a = rb("");
                break;
            case 12429:
                a = rb("OpenGL_ES");
                break;
            default:
                return U = 12300, 0
        }
        return ie[b] = a
    },
    wh: function () {
        if (de)
            if (h.fj)
                if (h.fj.isContextLost()) U = 12302;
                else return U = 12288, 1;
        else U = 12290;
        else U = 12289;
        return 0
    },
    xh: function (a,
        b) {
        if (62E3 != a) return U = 12296, 0;
        0 == b ? od(0, 0) : od(1, b);
        U = 12288;
        return 1
    },
    Ch: function (a) {
        if (62E3 != a) return U = 12296, 0;
        ge = fe = ee = 0;
        de = !1;
        U = 12288;
        return 1
    },
    zh: function () {
        U = 12288;
        return 1
    },
    yh: function () {
        U = 12288;
        return 1
    },
    w: function (a, b, c) {
        return Me(a, b, c)
    },
    c: Me,
    Oh: function (a, b, c, d, e, f, g, l) {
        function n() {
            if (g) {
                var v = 0;
                if (p.statusText) {
                    var r = aa(p.statusText) + 1;
                    v = lb(r);
                    u(p.statusText, v, r)
                }
                P(g)(t, d, p.status, v)
            }
        }
        var q = x(a);
        a = x(b);
        c = x(c);
        var p = new XMLHttpRequest;
        p.open(a, q, !0);
        p.responseType = "arraybuffer";
        var t =
            Pe();
        p.onload = function () {
            if (200 <= p.status && 300 > p.status || 0 === p.status && "http" != q.substr(0, 4).toLowerCase()) {
                var v = new Uint8Array(p.response),
                    r = m(v.length);
                A.set(v, r);
                f && P(f)(t, d, r, v.length);
                e && ca(r)
            } else n();
            delete Ne[t]
        };
        p.onerror = function () {
            n();
            delete Ne[t]
        };
        p.onprogress = function (v) {
            l && P(l)(t, d, v.loaded, v.lengthComputable || void 0 === v.lengthComputable ? v.total : 0)
        };
        p.onabort = function () {
            delete Ne[t]
        };
        "POST" == a ? (p.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), p.send(c)) : p.send(null);
        Ne[t] = p;
        return t
    },
    Ih: function (a) {
        clearInterval(a)
    },
    kh: function () {
        if (!bf()) return -1;
        We(Af);
        var a = rf[1];
        if (a.exitFullscreen) a.fullscreenElement && a.exitFullscreen();
        else if (a.webkitExitFullscreen) a.webkitFullscreenElement && a.webkitExitFullscreen();
        else return -1;
        return 0
    },
    nh: function () {
        We(Bf);
        if (document.exitPointerLock) document.exitPointerLock();
        else if (document.Ki) document.Ki();
        else return -1;
        return 0
    },
    Sh: tf,
    E: function () {
        return "number" == typeof devicePixelRatio && devicePixelRatio || 1
    },
    r: function (a, b, c) {
        a =
            sf(a);
        if (!a) return -4;
        a = zf(a);
        gb[b >> 3] = a.width;
        gb[c >> 3] = a.height;
        return 0
    },
    ab: function (a, b) {
        if (0 > a || a >= df.length) return -5;
        if (!df[a]) return -7;
        Cf(b, df[a]);
        return 0
    },
    ga: vd,
    Fh: function () {
        return df.length
    },
    oh: function (a, b) {
        G[a >> 2] = screen.width;
        G[b >> 2] = screen.height
    },
    Ng: function (a) {
        T.activeTexture(a)
    },
    Mg: function (a, b) {
        T.attachShader(V[a], W[b])
    },
    Od: function (a, b) {
        T.beginQuery(a, ue[b])
    },
    bh: function (a, b) {
        T.Wi.beginQueryEXT(a, ue[b])
    },
    rd: function (a) {
        T.beginTransformFeedback(a)
    },
    Lg: function (a, b, c) {
        T.bindAttribLocation(V[a],
            b, x(c))
    },
    Kg: function (a, b) {
        34962 == a ? T.kj = b : 34963 == a && (T.cj = b);
        35051 == a ? T.xj = b : 35052 == a && (T.Ti = b);
        T.bindBuffer(a, oe[b])
    },
    od: function (a, b, c) {
        T.bindBufferBase(a, b, oe[c])
    },
    pd: function (a, b, c, d, e) {
        T.bindBufferRange(a, b, oe[c], d, e)
    },
    Jg: function (a, b) {
        T.bindFramebuffer(a, qe[b])
    },
    Ig: function (a, b) {
        T.bindRenderbuffer(a, re[b])
    },
    vc: function (a, b) {
        T.bindSampler(a, ve[b])
    },
    Hg: function (a, b) {
        T.bindTexture(a, se[b])
    },
    nc: function (a, b) {
        T.bindTransformFeedback(a, we[b])
    },
    wd: function (a) {
        T.bindVertexArray(te[a]);
        a = T.getParameter(34965);
        T.cj = a ? a.name | 0 : 0
    },
    Vg: function (a) {
        T.bindVertexArray(te[a]);
        a = T.getParameter(34965);
        T.cj = a ? a.name | 0 : 0
    },
    Gg: function (a, b, c, d) {
        T.blendColor(a, b, c, d)
    },
    Fg: function (a) {
        T.blendEquation(a)
    },
    Eg: function (a, b) {
        T.blendEquationSeparate(a, b)
    },
    Dg: function (a, b) {
        T.blendFunc(a, b)
    },
    Cg: function (a, b, c, d) {
        T.blendFuncSeparate(a, b, c, d)
    },
    Bd: function (a, b, c, d, e, f, g, l, n, q) {
        T.blitFramebuffer(a, b, c, d, e, f, g, l, n, q)
    },
    Bg: function (a, b, c, d) {
        2 <= S.version ? c ? T.bufferData(a, A, d, c, b) : T.bufferData(a, b, d) : T.bufferData(a, c ? A.subarray(c, c + b) :
            b, d)
    },
    Ag: function (a, b, c, d) {
        2 <= S.version ? T.bufferSubData(a, b, A, d, c) : T.bufferSubData(a, b, A.subarray(d, d + c))
    },
    zg: function (a) {
        return T.checkFramebufferStatus(a)
    },
    yg: function (a) {
        T.clear(a)
    },
    Sc: function (a, b, c, d) {
        T.clearBufferfi(a, b, c, d)
    },
    Tc: function (a, b, c) {
        T.clearBufferfv(a, b, I, c >> 2)
    },
    Vc: function (a, b, c) {
        T.clearBufferiv(a, b, G, c >> 2)
    },
    Uc: function (a, b, c) {
        T.clearBufferuiv(a, b, N, c >> 2)
    },
    xg: function (a, b, c, d) {
        T.clearColor(a, b, c, d)
    },
    wg: function (a) {
        T.clearDepth(a)
    },
    vg: function (a) {
        T.clearStencil(a)
    },
    Ec: function (a,
        b, c, d) {
        return T.clientWaitSync(xe[a], b, (c >>> 0) + 4294967296 * d)
    },
    ug: function (a, b, c, d) {
        T.colorMask(!!a, !!b, !!c, !!d)
    },
    tg: function (a) {
        T.compileShader(W[a])
    },
    sg: function (a, b, c, d, e, f, g, l) {
        2 <= S.version ? T.Ti ? T.compressedTexImage2D(a, b, c, d, e, f, g, l) : T.compressedTexImage2D(a, b, c, d, e, f, A, l, g) : T.compressedTexImage2D(a, b, c, d, e, f, l ? A.subarray(l, l + g) : null)
    },
    Td: function (a, b, c, d, e, f, g, l, n) {
        T.Ti ? T.compressedTexImage3D(a, b, c, d, e, f, g, l, n) : T.compressedTexImage3D(a, b, c, d, e, f, g, A, n, l)
    },
    rg: function (a, b, c, d, e, f, g, l, n) {
        2 <= S.version ?
            T.Ti ? T.compressedTexSubImage2D(a, b, c, d, e, f, g, l, n) : T.compressedTexSubImage2D(a, b, c, d, e, f, g, A, n, l) : T.compressedTexSubImage2D(a, b, c, d, e, f, g, n ? A.subarray(n, n + l) : null)
    },
    Sd: function (a, b, c, d, e, f, g, l, n, q, p) {
        T.Ti ? T.compressedTexSubImage3D(a, b, c, d, e, f, g, l, n, q, p) : T.compressedTexSubImage3D(a, b, c, d, e, f, g, l, n, A, p, q)
    },
    Qc: function (a, b, c, d, e) {
        T.copyBufferSubData(a, b, c, d, e)
    },
    qg: function (a, b, c, d, e, f, g, l) {
        T.copyTexImage2D(a, b, c, d, e, f, g, l)
    },
    pg: function (a, b, c, d, e, f, g, l) {
        T.copyTexSubImage2D(a, b, c, d, e, f, g, l)
    },
    Ud: function (a,
        b, c, d, e, f, g, l, n) {
        T.copyTexSubImage3D(a, b, c, d, e, f, g, l, n)
    },
    og: function () {
        var a = De(V),
            b = T.createProgram();
        b.name = a;
        b.nj = b.lj = b.mj = 0;
        b.dk = 1;
        V[a] = b;
        return a
    },
    ng: function (a) {
        var b = De(W);
        W[b] = T.createShader(a);
        return b
    },
    mg: function (a) {
        T.cullFace(a)
    },
    lg: function (a, b) {
        for (var c = 0; c < a; c++) {
            var d = G[b + 4 * c >> 2],
                e = oe[d];
            e && (T.deleteBuffer(e), e.name = 0, oe[d] = null, d == T.kj && (T.kj = 0), d == T.cj && (T.cj = 0), d == T.xj && (T.xj = 0), d == T.Ti && (T.Ti = 0))
        }
    },
    kg: function (a, b) {
        for (var c = 0; c < a; ++c) {
            var d = G[b + 4 * c >> 2],
                e = qe[d];
            e && (T.deleteFramebuffer(e),
                e.name = 0, qe[d] = null)
        }
    },
    jg: function (a) {
        if (a) {
            var b = V[a];
            b ? (T.deleteProgram(b), b.name = 0, V[a] = null) : X(1281)
        }
    },
    Qd: function (a, b) {
        for (var c = 0; c < a; c++) {
            var d = G[b + 4 * c >> 2],
                e = ue[d];
            e && (T.deleteQuery(e), ue[d] = null)
        }
    },
    dh: function (a, b) {
        for (var c = 0; c < a; c++) {
            var d = G[b + 4 * c >> 2],
                e = ue[d];
            e && (T.Wi.deleteQueryEXT(e), ue[d] = null)
        }
    },
    ig: function (a, b) {
        for (var c = 0; c < a; c++) {
            var d = G[b + 4 * c >> 2],
                e = re[d];
            e && (T.deleteRenderbuffer(e), e.name = 0, re[d] = null)
        }
    },
    xc: function (a, b) {
        for (var c = 0; c < a; c++) {
            var d = G[b + 4 * c >> 2],
                e = ve[d];
            e && (T.deleteSampler(e),
                e.name = 0, ve[d] = null)
        }
    },
    hg: function (a) {
        if (a) {
            var b = W[a];
            b ? (T.deleteShader(b), W[a] = null) : X(1281)
        }
    },
    Fc: function (a) {
        if (a) {
            var b = xe[a];
            b ? (T.deleteSync(b), b.name = 0, xe[a] = null) : X(1281)
        }
    },
    gg: function (a, b) {
        for (var c = 0; c < a; c++) {
            var d = G[b + 4 * c >> 2],
                e = se[d];
            e && (T.deleteTexture(e), e.name = 0, se[d] = null)
        }
    },
    mc: function (a, b) {
        for (var c = 0; c < a; c++) {
            var d = G[b + 4 * c >> 2],
                e = we[d];
            e && (T.deleteTransformFeedback(e), e.name = 0, we[d] = null)
        }
    },
    vd: function (a, b) {
        for (var c = 0; c < a; c++) {
            var d = G[b + 4 * c >> 2];
            T.deleteVertexArray(te[d]);
            te[d] = null
        }
    },
    Ug: function (a, b) {
        for (var c = 0; c < a; c++) {
            var d = G[b + 4 * c >> 2];
            T.deleteVertexArray(te[d]);
            te[d] = null
        }
    },
    eg: function (a) {
        T.depthFunc(a)
    },
    dg: function (a) {
        T.depthMask(!!a)
    },
    cg: function (a, b) {
        T.depthRange(a, b)
    },
    bg: function (a, b) {
        T.detachShader(V[a], W[b])
    },
    ag: function (a) {
        T.disable(a)
    },
    $f: function (a) {
        S.bj[a].enabled = !1;
        T.disableVertexAttribArray(a)
    },
    _f: function (a, b, c) {
        Ge(b + c);
        T.drawArrays(a, b, c);
        Ie()
    },
    Jc: function (a, b, c, d) {
        T.drawArraysInstanced(a, b, c, d)
    },
    Qg: function (a, b, c, d) {
        T.drawArraysInstanced(a, b, c, d)
    },
    Yb: function (a,
        b, c, d) {
        T.drawArraysInstanced(a, b, c, d)
    },
    $d: function (a, b, c, d) {
        T.drawArraysInstanced(a, b, c, d)
    },
    Zb: function (a, b, c, d) {
        T.drawArraysInstanced(a, b, c, d)
    },
    Id: function (a, b) {
        for (var c = Df[a], d = 0; d < a; d++) c[d] = G[b + 4 * d >> 2];
        T.drawBuffers(c)
    },
    Zd: function (a, b) {
        for (var c = Df[a], d = 0; d < a; d++) c[d] = G[b + 4 * d >> 2];
        T.drawBuffers(c)
    },
    Rg: function (a, b) {
        for (var c = Df[a], d = 0; d < a; d++) c[d] = G[b + 4 * d >> 2];
        T.drawBuffers(c)
    },
    Zf: function (a, b, c, d) {
        if (!T.cj) {
            var e = 1 * ye[c - 5120] * b;
            var f = Ee(e);
            T.bindBuffer(34963, f);
            T.bufferSubData(34963, 0, A.subarray(d,
                d + e));
            d = 0
        }
        Ge(b);
        T.drawElements(a, b, c, d);
        Ie();
        T.cj || T.bindBuffer(34963, null)
    },
    Ic: function (a, b, c, d, e) {
        T.drawElementsInstanced(a, b, c, d, e)
    },
    Pg: function (a, b, c, d, e) {
        T.drawElementsInstanced(a, b, c, d, e)
    },
    Wb: function (a, b, c, d, e) {
        T.drawElementsInstanced(a, b, c, d, e)
    },
    Xb: function (a, b, c, d, e) {
        T.drawElementsInstanced(a, b, c, d, e)
    },
    _d: function (a, b, c, d, e) {
        T.drawElementsInstanced(a, b, c, d, e)
    },
    Xd: function (a, b, c, d, e, f) {
        b = f;
        T.cj || (f = 1 * ye[e - 5120] * d, c = Ee(f), T.bindBuffer(34963, c), T.bufferSubData(34963, 0, A.subarray(b, b + f)), b = 0);
        Ge(d);
        T.drawElements(a, d, e, b);
        Ie();
        T.cj || T.bindBuffer(34963, null)
    },
    Yf: function (a) {
        T.enable(a)
    },
    Xf: function (a) {
        S.bj[a].enabled = !0;
        T.enableVertexAttribArray(a)
    },
    Nd: function (a) {
        T.endQuery(a)
    },
    ah: function (a) {
        T.Wi.endQueryEXT(a)
    },
    qd: function () {
        T.endTransformFeedback()
    },
    Hc: function (a, b) {
        return (a = T.fenceSync(a, b)) ? (b = De(xe), a.name = b, xe[b] = a, b) : 0
    },
    Wf: function () {
        T.finish()
    },
    Vf: function () {
        T.flush()
    },
    xd: function (a, b, c) {
        if (Ff(a)) {
            var d = pe[Ef(a)];
            d ? d.Fk & 16 ? 0 > b || 0 > c || b + c > d.length ? (X(1281), k("invalid range in glFlushMappedBufferRange")) :
                T.bufferSubData(a, d.offset, A.subarray(d.Cj + b, d.Cj + b + c)) : (X(1282), k("buffer was not mapped with GL_MAP_FLUSH_EXPLICIT_BIT in glFlushMappedBufferRange")) : (X(1282), k("buffer was never mapped in glFlushMappedBufferRange"))
        } else X(1280), k("GL_INVALID_ENUM in glFlushMappedBufferRange")
    },
    Uf: function (a, b, c, d) {
        T.framebufferRenderbuffer(a, b, c, re[d])
    },
    Tf: function (a, b, c, d, e) {
        T.framebufferTexture2D(a, b, c, se[d], e)
    },
    zd: function (a, b, c, d, e) {
        T.framebufferTextureLayer(a, b, se[c], d, e)
    },
    Sf: function (a) {
        T.frontFace(a)
    },
    Rf: function (a, b) {
        Gf(a, b, "createBuffer", oe)
    },
    Pf: function (a, b) {
        Gf(a, b, "createFramebuffer", qe)
    },
    Rd: function (a, b) {
        Gf(a, b, "createQuery", ue)
    },
    eh: function (a, b) {
        for (var c = 0; c < a; c++) {
            var d = T.Wi.createQueryEXT();
            if (!d) {
                for (X(1282); c < a;) G[b + 4 * c++ >> 2] = 0;
                break
            }
            var e = De(ue);
            d.name = e;
            ue[e] = d;
            G[b + 4 * c >> 2] = e
        }
    },
    Of: function (a, b) {
        Gf(a, b, "createRenderbuffer", re)
    },
    yc: function (a, b) {
        Gf(a, b, "createSampler", ve)
    },
    Nf: function (a, b) {
        Gf(a, b, "createTexture", se)
    },
    lc: function (a, b) {
        Gf(a, b, "createTransformFeedback", we)
    },
    ud: function (a,
        b) {
        Gf(a, b, "createVertexArray", te)
    },
    Tg: function (a, b) {
        Gf(a, b, "createVertexArray", te)
    },
    Qf: function (a) {
        T.generateMipmap(a)
    },
    Lf: function (a, b, c, d, e, f, g) {
        Hf("getActiveAttrib", a, b, c, d, e, f, g)
    },
    Kf: function (a, b, c, d, e, f, g) {
        Hf("getActiveUniform", a, b, c, d, e, f, g)
    },
    Lc: function (a, b, c, d, e) {
        a = V[a];
        if (a = T.getActiveUniformBlockName(a, b)) e && 0 < c ? (c = u(a, e, c), d && (G[d >> 2] = c)) : d && (G[d >> 2] = 0)
    },
    Mc: function (a, b, c, d) {
        if (d)
            if (a = V[a], 35393 == c) c = T.getActiveUniformBlockName(a, b), G[d >> 2] = c.length + 1;
            else {
                if (a = T.getActiveUniformBlockParameter(a,
                        b, c), null !== a)
                    if (35395 == c)
                        for (c = 0; c < a.length; c++) G[d + 4 * c >> 2] = a[c];
                    else G[d >> 2] = a
            }
        else X(1281)
    },
    Oc: function (a, b, c, d, e) {
        if (e)
            if (0 < b && 0 == c) X(1281);
            else {
                a = V[a];
                for (var f = [], g = 0; g < b; g++) f.push(G[c + 4 * g >> 2]);
                if (a = T.getActiveUniforms(a, f, d))
                    for (b = a.length, g = 0; g < b; g++) G[e + 4 * g >> 2] = a[g]
            }
        else X(1281)
    },
    Jf: function (a, b, c, d) {
        a = T.getAttachedShaders(V[a]);
        var e = a.length;
        e > b && (e = b);
        G[c >> 2] = e;
        for (b = 0; b < e; ++b) G[d + 4 * b >> 2] = W.indexOf(a[b])
    },
    If: function (a, b) {
        return T.getAttribLocation(V[a], x(b))
    },
    Hf: function (a, b) {
        Jf(a, b,
            4)
    },
    zc: function (a, b, c) {
        c ? If(c, T.getBufferParameter(a, b)) : X(1281)
    },
    Gf: function (a, b, c) {
        c ? G[c >> 2] = T.getBufferParameter(a, b) : X(1281)
    },
    Jd: function (a, b, c) {
        if (35005 == b) {
            b = 0;
            if (a = pe[Ef(a)]) b = a.Cj;
            G[c >> 2] = b
        } else X(1280), k("GL_INVALID_ENUM in glGetBufferPointerv")
    },
    Ff: function () {
        var a = T.getError() || Ce;
        Ce = 0;
        return a
    },
    Ef: function (a, b) {
        Jf(a, b, 2)
    },
    cd: function (a, b) {
        return T.getFragDataLocation(V[a], x(b))
    },
    Df: function (a, b, c, d) {
        a = T.getFramebufferAttachmentParameter(a, b, c);
        if (a instanceof WebGLRenderbuffer || a instanceof WebGLTexture) a = a.name | 0;
        G[d >> 2] = a
    },
    Ac: function (a, b, c) {
        Kf(a, b, c, 1)
    },
    Cc: function (a, b) {
        Jf(a, b, 1)
    },
    sd: function (a, b, c) {
        Kf(a, b, c, 0)
    },
    Cf: function (a, b) {
        Jf(a, b, 0)
    },
    ac: function (a, b, c, d, e) {
        if (0 > d) X(1281);
        else if (e) {
            if (a = T.getInternalformatParameter(a, b, c), null !== a)
                for (b = 0; b < a.length && b < d; ++b) G[e + 4 * b >> 2] = a[b]
        } else X(1281)
    },
    hc: function () {
        X(1282)
    },
    Af: function (a, b, c, d) {
        a = T.getProgramInfoLog(V[a]);
        null === a && (a = "(unknown error)");
        b = 0 < b && d ? u(a, d, b) : 0;
        c && (G[c >> 2] = b)
    },
    Bf: function (a, b, c) {
        if (c)
            if (a >= ne) X(1281);
            else if (a =
            V[a], 35716 == b) a = T.getProgramInfoLog(a), null === a && (a = "(unknown error)"), G[c >> 2] = a.length + 1;
        else if (35719 == b) {
            if (!a.nj)
                for (b = 0; b < T.getProgramParameter(a, 35718); ++b) a.nj = Math.max(a.nj, T.getActiveUniform(a, b).name.length + 1);
            G[c >> 2] = a.nj
        } else if (35722 == b) {
            if (!a.lj)
                for (b = 0; b < T.getProgramParameter(a, 35721); ++b) a.lj = Math.max(a.lj, T.getActiveAttrib(a, b).name.length + 1);
            G[c >> 2] = a.lj
        } else if (35381 == b) {
            if (!a.mj)
                for (b = 0; b < T.getProgramParameter(a, 35382); ++b) a.mj = Math.max(a.mj, T.getActiveUniformBlockName(a, b).length +
                    1);
            G[c >> 2] = a.mj
        } else G[c >> 2] = T.getProgramParameter(a, b);
        else X(1281)
    },
    Xg: function (a, b, c) {
        if (c) {
            a = ue[a];
            b = 2 > S.version ? T.Wi.getQueryObjectEXT(a, b) : T.getQueryParameter(a, b);
            var d;
            "boolean" == typeof b ? d = b ? 1 : 0 : d = b;
            If(c, d)
        } else X(1281)
    },
    Zg: function (a, b, c) {
        if (c) {
            a = T.Wi.getQueryObjectEXT(ue[a], b);
            var d;
            "boolean" == typeof a ? d = a ? 1 : 0 : d = a;
            G[c >> 2] = d
        } else X(1281)
    },
    Wg: function (a, b, c) {
        if (c) {
            a = ue[a];
            b = 2 > S.version ? T.Wi.getQueryObjectEXT(a, b) : T.getQueryParameter(a, b);
            var d;
            "boolean" == typeof b ? d = b ? 1 : 0 : d = b;
            If(c, d)
        } else X(1281)
    },
    Ld: function (a, b, c) {
        if (c) {
            a = T.getQueryParameter(ue[a], b);
            var d;
            "boolean" == typeof a ? d = a ? 1 : 0 : d = a;
            G[c >> 2] = d
        } else X(1281)
    },
    Yg: function (a, b, c) {
        if (c) {
            a = T.Wi.getQueryObjectEXT(ue[a], b);
            var d;
            "boolean" == typeof a ? d = a ? 1 : 0 : d = a;
            G[c >> 2] = d
        } else X(1281)
    },
    Md: function (a, b, c) {
        c ? G[c >> 2] = T.getQuery(a, b) : X(1281)
    },
    _g: function (a, b, c) {
        c ? G[c >> 2] = T.Wi.getQueryEXT(a, b) : X(1281)
    },
    zf: function (a, b, c) {
        c ? G[c >> 2] = T.getRenderbufferParameter(a, b) : X(1281)
    },
    pc: function (a, b, c) {
        c ? I[c >> 2] = T.getSamplerParameter(ve[a], b) : X(1281)
    },
    qc: function (a,
        b, c) {
        c ? G[c >> 2] = T.getSamplerParameter(ve[a], b) : X(1281)
    },
    xf: function (a, b, c, d) {
        a = T.getShaderInfoLog(W[a]);
        null === a && (a = "(unknown error)");
        b = 0 < b && d ? u(a, d, b) : 0;
        c && (G[c >> 2] = b)
    },
    wf: function (a, b, c, d) {
        a = T.getShaderPrecisionFormat(a, b);
        G[c >> 2] = a.rangeMin;
        G[c + 4 >> 2] = a.rangeMax;
        G[d >> 2] = a.precision
    },
    vf: function (a, b, c, d) {
        if (a = T.getShaderSource(W[a])) b = 0 < b && d ? u(a, d, b) : 0, c && (G[c >> 2] = b)
    },
    yf: function (a, b, c) {
        c ? 35716 == b ? (a = T.getShaderInfoLog(W[a]), null === a && (a = "(unknown error)"), G[c >> 2] = a ? a.length + 1 : 0) : 35720 == b ? (a = T.getShaderSource(W[a]),
            G[c >> 2] = a ? a.length + 1 : 0) : G[c >> 2] = T.getShaderParameter(W[a], b) : X(1281)
    },
    uf: function (a) {
        var b = ze[a];
        if (!b) {
            switch (a) {
                case 7939:
                    b = T.getSupportedExtensions() || [];
                    b = b.concat(b.map(function (d) {
                        return "GL_" + d
                    }));
                    b = Lf(b.join(" "));
                    break;
                case 7936:
                case 7937:
                case 37445:
                case 37446:
                    (b = T.getParameter(a)) || X(1280);
                    b = b && Lf(b);
                    break;
                case 7938:
                    b = T.getParameter(7938);
                    b = 2 <= S.version ? "OpenGL ES 3.0 (" + b + ")" : "OpenGL ES 2.0 (" + b + ")";
                    b = Lf(b);
                    break;
                case 35724:
                    b = T.getParameter(35724);
                    var c = b.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
                    null !== c && (3 == c[1].length && (c[1] += "0"), b = "OpenGL ES GLSL ES " + c[1] + " (" + b + ")");
                    b = Lf(b);
                    break;
                default:
                    X(1280)
            }
            ze[a] = b
        }
        return b
    },
    Rc: function (a, b) {
        if (2 > S.version) return X(1282), 0;
        var c = Ae[a];
        if (c) return 0 > b || b >= c.length ? (X(1281), 0) : c[b];
        switch (a) {
            case 7939:
                return c = T.getSupportedExtensions() || [], c = c.concat(c.map(function (d) {
                    return "GL_" + d
                })), c = c.map(function (d) {
                    return Lf(d)
                }), c = Ae[a] = c, 0 > b || b >= c.length ? (X(1281), 0) : c[b];
            default:
                return X(1280), 0
        }
    },
    Bc: function (a, b, c, d, e) {
        0 > c ? X(1281) : e ? (a = T.getSyncParameter(xe[a],
            b), null !== a && (G[e >> 2] = a, d && (G[d >> 2] = 1))) : X(1281)
    },
    tf: function (a, b, c) {
        c ? I[c >> 2] = T.getTexParameter(a, b) : X(1281)
    },
    sf: function (a, b, c) {
        c ? G[c >> 2] = T.getTexParameter(a, b) : X(1281)
    },
    ld: function (a, b, c, d, e, f, g) {
        a = V[a];
        if (a = T.getTransformFeedbackVarying(a, b)) g && 0 < c ? (c = u(a.name, g, c), d && (G[d >> 2] = c)) : d && (G[d >> 2] = 0), e && (G[e >> 2] = a.size), f && (G[f >> 2] = a.type)
    },
    Nc: function (a, b) {
        return T.getUniformBlockIndex(V[a], x(b))
    },
    Pc: function (a, b, c, d) {
        if (d)
            if (0 < b && (0 == c || 0 == d)) X(1281);
            else {
                a = V[a];
                for (var e = [], f = 0; f < b; f++) e.push(x(G[c +
                    4 * f >> 2]));
                if (a = T.getUniformIndices(a, e))
                    for (b = a.length, f = 0; f < b; f++) G[d + 4 * f >> 2] = a[f]
            }
        else X(1281)
    },
    of: function (a, b) {
        b = x(b);
        if (a = V[a]) {
            Nf(a);
            var c = a.Fj,
                d = 0,
                e = b,
                f = Mf(b);
            0 < f && (d = parseInt(b.slice(f + 1)) >>> 0, e = b.slice(0, f));
            if ((e = a.ek[e]) && d < e[0] && (d += e[1], c[d] = c[d] || T.getUniformLocation(a, b))) return d
        } else X(1281);
        return -1
    },
    qf: function (a, b, c) {
        Of(a, b, c, 2)
    },
    pf: function (a, b, c) {
        Of(a, b, c, 0)
    },
    dd: function (a, b, c) {
        Of(a, b, c, 0)
    },
    jd: function (a, b, c) {
        Pf(a, b, c, 0)
    },
    id: function (a, b, c) {
        Pf(a, b, c, 0)
    },
    lf: function (a, b, c) {
        c ?
            (S.bj[a].enabled && k("glGetVertexAttribPointer on client-side array: not supported, bad data returned"), G[c >> 2] = T.getVertexAttribOffset(a, b)) : X(1281)
    },
    nf: function (a, b, c) {
        Pf(a, b, c, 2)
    },
    mf: function (a, b, c) {
        Pf(a, b, c, 5)
    },
    kf: function (a, b) {
        T.hint(a, b)
    },
    ec: function (a, b, c) {
        for (var d = Df[b], e = 0; e < b; e++) d[e] = G[c + 4 * e >> 2];
        T.invalidateFramebuffer(a, d)
    },
    dc: function (a, b, c, d, e, f, g) {
        for (var l = Df[b], n = 0; n < b; n++) l[n] = G[c + 4 * n >> 2];
        T.invalidateSubFramebuffer(a, l, d, e, f, g)
    },
    jf: function (a) {
        return (a = oe[a]) ? T.isBuffer(a) : 0
    },
    hf: function (a) {
        return T.isEnabled(a)
    },
    gf: function (a) {
        return (a = qe[a]) ? T.isFramebuffer(a) : 0
    },
    ff: function (a) {
        return (a = V[a]) ? T.isProgram(a) : 0
    },
    Pd: function (a) {
        return (a = ue[a]) ? T.isQuery(a) : 0
    },
    ch: function (a) {
        return (a = ue[a]) ? T.Wi.isQueryEXT(a) : 0
    },
    ef: function (a) {
        return (a = re[a]) ? T.isRenderbuffer(a) : 0
    },
    wc: function (a) {
        return (a = ve[a]) ? T.isSampler(a) : 0
    },
    df: function (a) {
        return (a = W[a]) ? T.isShader(a) : 0
    },
    Gc: function (a) {
        return T.isSync(xe[a])
    },
    cf: function (a) {
        return (a = se[a]) ? T.isTexture(a) : 0
    },
    kc: function (a) {
        return T.isTransformFeedback(we[a])
    },
    td: function (a) {
        return (a =
            te[a]) ? T.isVertexArray(a) : 0
    },
    Sg: function (a) {
        return (a = te[a]) ? T.isVertexArray(a) : 0
    },
    bf: function (a) {
        T.lineWidth(a)
    },
    af: function (a) {
        a = V[a];
        T.linkProgram(a);
        a.Fj = 0;
        a.ek = {}
    },
    yd: function (a, b, c, d) {
        if (26 != d && 10 != d) return k("glMapBufferRange is only supported when access is MAP_WRITE|INVALIDATE_BUFFER"), 0;
        if (!Ff(a)) return X(1280), k("GL_INVALID_ENUM in glMapBufferRange"), 0;
        var e = m(c);
        if (!e) return 0;
        pe[Ef(a)] = {
            offset: b,
            length: c,
            Cj: e,
            Fk: d
        };
        return e
    },
    jc: function () {
        T.pauseTransformFeedback()
    },
    $e: function (a, b) {
        3317 ==
            a && (Be = b);
        T.pixelStorei(a, b)
    },
    _e: function (a, b) {
        T.polygonOffset(a, b)
    },
    gc: function () {
        X(1280)
    },
    fc: function () {
        X(1280)
    },
    $g: function (a, b) {
        T.Wi.queryCounterEXT(ue[a], b)
    },
    Yd: function (a) {
        T.readBuffer(a)
    },
    Ze: function (a, b, c, d, e, f, g) {
        if (2 <= S.version)
            if (T.xj) T.readPixels(a, b, c, d, e, f, g);
            else {
                var l = Qf(f);
                T.readPixels(a, b, c, d, e, f, l, g >> Rf(l))
            }
        else(g = Sf(f, e, c, d, g)) ? T.readPixels(a, b, c, d, e, f, g) : X(1280)
    },
    Ye: function () {},
    Xe: function (a, b, c, d) {
        T.renderbufferStorage(a, b, c, d)
    },
    Ad: function (a, b, c, d, e) {
        T.renderbufferStorageMultisample(a,
            b, c, d, e)
    },
    ic: function () {
        T.resumeTransformFeedback()
    },
    We: function (a, b) {
        T.sampleCoverage(a, !!b)
    },
    sc: function (a, b, c) {
        T.samplerParameterf(ve[a], b, c)
    },
    rc: function (a, b, c) {
        T.samplerParameterf(ve[a], b, I[c >> 2])
    },
    uc: function (a, b, c) {
        T.samplerParameteri(ve[a], b, c)
    },
    tc: function (a, b, c) {
        T.samplerParameteri(ve[a], b, G[c >> 2])
    },
    Ve: function (a, b, c, d) {
        T.scissor(a, b, c, d)
    },
    Ue: function () {
        X(1280)
    },
    Te: function (a, b, c, d) {
        b = Fe(b, c, d);
        T.shaderSource(W[a], b)
    },
    Se: function (a, b, c) {
        T.stencilFunc(a, b, c)
    },
    Re: function (a, b, c, d) {
        T.stencilFuncSeparate(a,
            b, c, d)
    },
    Qe: function (a) {
        T.stencilMask(a)
    },
    Pe: function (a, b) {
        T.stencilMaskSeparate(a, b)
    },
    Oe: function (a, b, c) {
        T.stencilOp(a, b, c)
    },
    Ne: function (a, b, c, d) {
        T.stencilOpSeparate(a, b, c, d)
    },
    Me: function (a, b, c, d, e, f, g, l, n) {
        if (2 <= S.version)
            if (T.Ti) T.texImage2D(a, b, c, d, e, f, g, l, n);
            else if (n) {
            var q = Qf(l);
            T.texImage2D(a, b, c, d, e, f, g, l, q, n >> Rf(q))
        } else T.texImage2D(a, b, c, d, e, f, g, l, null);
        else T.texImage2D(a, b, c, d, e, f, g, l, n ? Sf(l, g, d, e, n) : null)
    },
    Wd: function (a, b, c, d, e, f, g, l, n, q) {
        if (T.Ti) T.texImage3D(a, b, c, d, e, f, g, l, n, q);
        else if (q) {
            var p =
                Qf(n);
            T.texImage3D(a, b, c, d, e, f, g, l, n, p, q >> Rf(p))
        } else T.texImage3D(a, b, c, d, e, f, g, l, n, null)
    },
    Le: function (a, b, c) {
        T.texParameterf(a, b, c)
    },
    Ke: function (a, b, c) {
        T.texParameterf(a, b, I[c >> 2])
    },
    Je: function (a, b, c) {
        T.texParameteri(a, b, c)
    },
    Ie: function (a, b, c) {
        T.texParameteri(a, b, G[c >> 2])
    },
    cc: function (a, b, c, d, e) {
        T.texStorage2D(a, b, c, d, e)
    },
    bc: function (a, b, c, d, e, f) {
        T.texStorage3D(a, b, c, d, e, f)
    },
    He: function (a, b, c, d, e, f, g, l, n) {
        if (2 <= S.version)
            if (T.Ti) T.texSubImage2D(a, b, c, d, e, f, g, l, n);
            else if (n) {
            var q = Qf(l);
            T.texSubImage2D(a,
                b, c, d, e, f, g, l, q, n >> Rf(q))
        } else T.texSubImage2D(a, b, c, d, e, f, g, l, null);
        else q = null, n && (q = Sf(l, g, e, f, n)), T.texSubImage2D(a, b, c, d, e, f, g, l, q)
    },
    Vd: function (a, b, c, d, e, f, g, l, n, q, p) {
        if (T.Ti) T.texSubImage3D(a, b, c, d, e, f, g, l, n, q, p);
        else if (p) {
            var t = Qf(q);
            T.texSubImage3D(a, b, c, d, e, f, g, l, n, q, t, p >> Rf(t))
        } else T.texSubImage3D(a, b, c, d, e, f, g, l, n, q, null)
    },
    nd: function (a, b, c, d) {
        a = V[a];
        for (var e = [], f = 0; f < b; f++) e.push(x(G[c + 4 * f >> 2]));
        T.transformFeedbackVaryings(a, e, d)
    },
    Ge: function (a, b) {
        T.uniform1f(Y(a), b)
    },
    Fe: function (a,
        b, c) {
        if (2 <= S.version) T.uniform1fv(Y(a), I, c >> 2, b);
        else {
            if (288 >= b)
                for (var d = Tf[b - 1], e = 0; e < b; ++e) d[e] = I[c + 4 * e >> 2];
            else d = I.subarray(c >> 2, c + 4 * b >> 2);
            T.uniform1fv(Y(a), d)
        }
    },
    Ee: function (a, b) {
        T.uniform1i(Y(a), b)
    },
    De: function (a, b, c) {
        if (2 <= S.version) T.uniform1iv(Y(a), G, c >> 2, b);
        else {
            if (288 >= b)
                for (var d = Uf[b - 1], e = 0; e < b; ++e) d[e] = G[c + 4 * e >> 2];
            else d = G.subarray(c >> 2, c + 4 * b >> 2);
            T.uniform1iv(Y(a), d)
        }
    },
    bd: function (a, b) {
        T.uniform1ui(Y(a), b)
    },
    Zc: function (a, b, c) {
        T.uniform1uiv(Y(a), N, c >> 2, b)
    },
    Ce: function (a, b, c) {
        T.uniform2f(Y(a),
            b, c)
    },
    Be: function (a, b, c) {
        if (2 <= S.version) T.uniform2fv(Y(a), I, c >> 2, 2 * b);
        else {
            if (144 >= b)
                for (var d = Tf[2 * b - 1], e = 0; e < 2 * b; e += 2) d[e] = I[c + 4 * e >> 2], d[e + 1] = I[c + (4 * e + 4) >> 2];
            else d = I.subarray(c >> 2, c + 8 * b >> 2);
            T.uniform2fv(Y(a), d)
        }
    },
    Ae: function (a, b, c) {
        T.uniform2i(Y(a), b, c)
    },
    ze: function (a, b, c) {
        if (2 <= S.version) T.uniform2iv(Y(a), G, c >> 2, 2 * b);
        else {
            if (144 >= b)
                for (var d = Uf[2 * b - 1], e = 0; e < 2 * b; e += 2) d[e] = G[c + 4 * e >> 2], d[e + 1] = G[c + (4 * e + 4) >> 2];
            else d = G.subarray(c >> 2, c + 8 * b >> 2);
            T.uniform2iv(Y(a), d)
        }
    },
    ad: function (a, b, c) {
        T.uniform2ui(Y(a),
            b, c)
    },
    Yc: function (a, b, c) {
        T.uniform2uiv(Y(a), N, c >> 2, 2 * b)
    },
    ye: function (a, b, c, d) {
        T.uniform3f(Y(a), b, c, d)
    },
    xe: function (a, b, c) {
        if (2 <= S.version) T.uniform3fv(Y(a), I, c >> 2, 3 * b);
        else {
            if (96 >= b)
                for (var d = Tf[3 * b - 1], e = 0; e < 3 * b; e += 3) d[e] = I[c + 4 * e >> 2], d[e + 1] = I[c + (4 * e + 4) >> 2], d[e + 2] = I[c + (4 * e + 8) >> 2];
            else d = I.subarray(c >> 2, c + 12 * b >> 2);
            T.uniform3fv(Y(a), d)
        }
    },
    we: function (a, b, c, d) {
        T.uniform3i(Y(a), b, c, d)
    },
    ve: function (a, b, c) {
        if (2 <= S.version) T.uniform3iv(Y(a), G, c >> 2, 3 * b);
        else {
            if (96 >= b)
                for (var d = Uf[3 * b - 1], e = 0; e < 3 * b; e += 3) d[e] =
                    G[c + 4 * e >> 2], d[e + 1] = G[c + (4 * e + 4) >> 2], d[e + 2] = G[c + (4 * e + 8) >> 2];
            else d = G.subarray(c >> 2, c + 12 * b >> 2);
            T.uniform3iv(Y(a), d)
        }
    },
    $c: function (a, b, c, d) {
        T.uniform3ui(Y(a), b, c, d)
    },
    Xc: function (a, b, c) {
        T.uniform3uiv(Y(a), N, c >> 2, 3 * b)
    },
    ue: function (a, b, c, d, e) {
        T.uniform4f(Y(a), b, c, d, e)
    },
    se: function (a, b, c) {
        if (2 <= S.version) T.uniform4fv(Y(a), I, c >> 2, 4 * b);
        else {
            if (72 >= b) {
                var d = Tf[4 * b - 1],
                    e = I;
                c >>= 2;
                for (var f = 0; f < 4 * b; f += 4) {
                    var g = c + f;
                    d[f] = e[g];
                    d[f + 1] = e[g + 1];
                    d[f + 2] = e[g + 2];
                    d[f + 3] = e[g + 3]
                }
            } else d = I.subarray(c >> 2, c + 16 * b >> 2);
            T.uniform4fv(Y(a),
                d)
        }
    },
    re: function (a, b, c, d, e) {
        T.uniform4i(Y(a), b, c, d, e)
    },
    qe: function (a, b, c) {
        if (2 <= S.version) T.uniform4iv(Y(a), G, c >> 2, 4 * b);
        else {
            if (72 >= b)
                for (var d = Uf[4 * b - 1], e = 0; e < 4 * b; e += 4) d[e] = G[c + 4 * e >> 2], d[e + 1] = G[c + (4 * e + 4) >> 2], d[e + 2] = G[c + (4 * e + 8) >> 2], d[e + 3] = G[c + (4 * e + 12) >> 2];
            else d = G.subarray(c >> 2, c + 16 * b >> 2);
            T.uniform4iv(Y(a), d)
        }
    },
    _c: function (a, b, c, d, e) {
        T.uniform4ui(Y(a), b, c, d, e)
    },
    Wc: function (a, b, c) {
        T.uniform4uiv(Y(a), N, c >> 2, 4 * b)
    },
    Kc: function (a, b, c) {
        a = V[a];
        T.uniformBlockBinding(a, b, c)
    },
    pe: function (a, b, c, d) {
        if (2 <= S.version) T.uniformMatrix2fv(Y(a),
            !!c, I, d >> 2, 4 * b);
        else {
            if (72 >= b)
                for (var e = Tf[4 * b - 1], f = 0; f < 4 * b; f += 4) e[f] = I[d + 4 * f >> 2], e[f + 1] = I[d + (4 * f + 4) >> 2], e[f + 2] = I[d + (4 * f + 8) >> 2], e[f + 3] = I[d + (4 * f + 12) >> 2];
            else e = I.subarray(d >> 2, d + 16 * b >> 2);
            T.uniformMatrix2fv(Y(a), !!c, e)
        }
    },
    Hd: function (a, b, c, d) {
        T.uniformMatrix2x3fv(Y(a), !!c, I, d >> 2, 6 * b)
    },
    Fd: function (a, b, c, d) {
        T.uniformMatrix2x4fv(Y(a), !!c, I, d >> 2, 8 * b)
    },
    oe: function (a, b, c, d) {
        if (2 <= S.version) T.uniformMatrix3fv(Y(a), !!c, I, d >> 2, 9 * b);
        else {
            if (32 >= b)
                for (var e = Tf[9 * b - 1], f = 0; f < 9 * b; f += 9) e[f] = I[d + 4 * f >> 2], e[f + 1] = I[d +
                    (4 * f + 4) >> 2], e[f + 2] = I[d + (4 * f + 8) >> 2], e[f + 3] = I[d + (4 * f + 12) >> 2], e[f + 4] = I[d + (4 * f + 16) >> 2], e[f + 5] = I[d + (4 * f + 20) >> 2], e[f + 6] = I[d + (4 * f + 24) >> 2], e[f + 7] = I[d + (4 * f + 28) >> 2], e[f + 8] = I[d + (4 * f + 32) >> 2];
            else e = I.subarray(d >> 2, d + 36 * b >> 2);
            T.uniformMatrix3fv(Y(a), !!c, e)
        }
    },
    Gd: function (a, b, c, d) {
        T.uniformMatrix3x2fv(Y(a), !!c, I, d >> 2, 6 * b)
    },
    Dd: function (a, b, c, d) {
        T.uniformMatrix3x4fv(Y(a), !!c, I, d >> 2, 12 * b)
    },
    ne: function (a, b, c, d) {
        if (2 <= S.version) T.uniformMatrix4fv(Y(a), !!c, I, d >> 2, 16 * b);
        else {
            if (18 >= b) {
                var e = Tf[16 * b - 1],
                    f = I;
                d >>= 2;
                for (var g =
                        0; g < 16 * b; g += 16) {
                    var l = d + g;
                    e[g] = f[l];
                    e[g + 1] = f[l + 1];
                    e[g + 2] = f[l + 2];
                    e[g + 3] = f[l + 3];
                    e[g + 4] = f[l + 4];
                    e[g + 5] = f[l + 5];
                    e[g + 6] = f[l + 6];
                    e[g + 7] = f[l + 7];
                    e[g + 8] = f[l + 8];
                    e[g + 9] = f[l + 9];
                    e[g + 10] = f[l + 10];
                    e[g + 11] = f[l + 11];
                    e[g + 12] = f[l + 12];
                    e[g + 13] = f[l + 13];
                    e[g + 14] = f[l + 14];
                    e[g + 15] = f[l + 15]
                }
            } else e = I.subarray(d >> 2, d + 64 * b >> 2);
            T.uniformMatrix4fv(Y(a), !!c, e)
        }
    },
    Ed: function (a, b, c, d) {
        T.uniformMatrix4x2fv(Y(a), !!c, I, d >> 2, 8 * b)
    },
    Cd: function (a, b, c, d) {
        T.uniformMatrix4x3fv(Y(a), !!c, I, d >> 2, 12 * b)
    },
    Kd: function (a) {
        if (!Ff(a)) return X(1280), k("GL_INVALID_ENUM in glUnmapBuffer"),
            0;
        var b = Ef(a),
            c = pe[b];
        if (!c) return X(1282), k("buffer was never mapped in glUnmapBuffer"), 0;
        pe[b] = null;
        c.Fk & 16 || (2 <= S.version ? T.bufferSubData(a, c.offset, A, c.Cj, c.length) : T.bufferSubData(a, c.offset, A.subarray(c.Cj, c.Cj + c.length)));
        ca(c.Cj);
        return 1
    },
    me: function (a) {
        a = V[a];
        T.useProgram(a);
        T.Nk = a
    },
    le: function (a) {
        T.validateProgram(V[a])
    },
    ke: function (a, b) {
        T.vertexAttrib1f(a, b)
    },
    je: function (a, b) {
        T.vertexAttrib1f(a, I[b >> 2])
    },
    ie: function (a, b, c) {
        T.vertexAttrib2f(a, b, c)
    },
    he: function (a, b) {
        T.vertexAttrib2f(a, I[b >>
            2], I[b + 4 >> 2])
    },
    ge: function (a, b, c, d) {
        T.vertexAttrib3f(a, b, c, d)
    },
    fe: function (a, b) {
        T.vertexAttrib3f(a, I[b >> 2], I[b + 4 >> 2], I[b + 8 >> 2])
    },
    ee: function (a, b, c, d, e) {
        T.vertexAttrib4f(a, b, c, d, e)
    },
    de: function (a, b) {
        T.vertexAttrib4f(a, I[b >> 2], I[b + 4 >> 2], I[b + 8 >> 2], I[b + 12 >> 2])
    },
    oc: function (a, b) {
        T.vertexAttribDivisor(a, b)
    },
    Og: function (a, b) {
        T.vertexAttribDivisor(a, b)
    },
    _b: function (a, b) {
        T.vertexAttribDivisor(a, b)
    },
    ae: function (a, b) {
        T.vertexAttribDivisor(a, b)
    },
    $b: function (a, b) {
        T.vertexAttribDivisor(a, b)
    },
    hd: function (a, b, c,
        d, e) {
        T.vertexAttribI4i(a, b, c, d, e)
    },
    fd: function (a, b) {
        T.vertexAttribI4i(a, G[b >> 2], G[b + 4 >> 2], G[b + 8 >> 2], G[b + 12 >> 2])
    },
    gd: function (a, b, c, d, e) {
        T.vertexAttribI4ui(a, b, c, d, e)
    },
    ed: function (a, b) {
        T.vertexAttribI4ui(a, N[b >> 2], N[b + 4 >> 2], N[b + 8 >> 2], N[b + 12 >> 2])
    },
    kd: function (a, b, c, d, e) {
        var f = S.bj[a];
        T.kj ? (f.wj = !1, T.vertexAttribIPointer(a, b, c, d, e)) : (f.size = b, f.type = c, f.Xj = !1, f.Oj = d, f.Jj = e, f.wj = !0, f.fk = function (g, l, n, q, p, t) {
            this.vertexAttribIPointer(g, l, n, p, t)
        })
    },
    ce: function (a, b, c, d, e, f) {
        var g = S.bj[a];
        T.kj ? (g.wj = !1,
            T.vertexAttribPointer(a, b, c, !!d, e, f)) : (g.size = b, g.type = c, g.Xj = d, g.Oj = e, g.Jj = f, g.wj = !0, g.fk = function (l, n, q, p, t, v) {
            this.vertexAttribPointer(l, n, q, p, t, v)
        })
    },
    be: function (a, b, c, d) {
        T.viewport(a, b, c, d)
    },
    Dc: function (a, b, c, d) {
        T.waitSync(xe[a], b, (c >>> 0) + 4294967296 * d)
    },
    sa: function () {
        return !1
    },
    jh: function () {
        return !Na
    },
    Sb: function (a, b, c) {
        A.copyWithin(a, b, b + c)
    },
    Hh: function (a, b) {
        function c(d) {
            P(a)(d, b) && requestAnimationFrame(c)
        }
        return requestAnimationFrame(c)
    },
    lh: function (a, b, c) {
        return Vf(a, {
            yk: G[c >> 2],
            ik: G[c + 4 >>
                2],
            ul: G[c + 8 >> 2],
            pl: b,
            Sj: G[c + 12 >> 2],
            Kk: G[c + 16 >> 2]
        })
    },
    Xa: function (a, b) {
        a = sf(a);
        return a ? a.requestPointerLock || a.Wj ? Qe && Ye.vj ? Bf(a) : b ? (Ve(Bf, 2, [a]), 1) : -2 : -1 : -4
    },
    Ab: function (a) {
        var b = A.length;
        a >>>= 0;
        if (2147483648 < a) return !1;
        for (var c = 1; 4 >= c; c *= 2) {
            var d = b * (1 + .2 / c);
            d = Math.min(d, a + 100663296);
            var e = Math;
            d = Math.max(a, d);
            e = e.min.call(e, 2147483648, d + (65536 - d % 65536) % 65536);
            a: {
                try {
                    ib.grow(e - tb.byteLength + 65535 >>> 16);
                    ub();
                    var f = 1;
                    break a
                } catch (g) {}
                f = void 0
            }
            if (f) return !0
        }
        return !1
    },
    bb: function () {
        return (df = navigator.getGamepads ?
            navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : null) ? 0 : -1
    },
    Qa: function (a, b, c) {
        if ("undefined" == typeof onbeforeunload) return -1;
        if (1 !== c) return -5;
        Wf(a, b);
        return 0
    },
    Ua: function (a, b, c, d) {
        Xf(a, b, c, d, 12, "blur");
        return 0
    },
    v: vf,
    oa: function (a, b, c) {
        a = sf(a);
        if (!a) return -4;
        a.style.width = b + "px";
        a.style.height = c + "px";
        return 0
    },
    S: function (a, b, c, d) {
        Xf(a, b, c, d, 13, "focus");
        return 0
    },
    ra: function (a, b, c, d) {
        if (!bf()) return -1;
        a = sf(a);
        if (!a) return -4;
        Yf(a, b, c, d, "fullscreenchange");
        Yf(a, b,
            c, d, "webkitfullscreenchange");
        return 0
    },
    $a: function (a, b, c) {
        if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
        Zf(a, b, c, 26, "gamepadconnected");
        return 0
    },
    _a: function (a, b, c) {
        if (!navigator.getGamepads && !navigator.webkitGetGamepads) return -1;
        Zf(a, b, c, 27, "gamepaddisconnected");
        return 0
    },
    Gh: function (a, b, c) {
        return setInterval(function () {
            Fd(function () {
                P(a)(c)
            })
        }, b)
    },
    Y: function (a, b, c, d) {
        $f(a, b, c, d, 2, "keydown");
        return 0
    },
    qa: function (a, b, c, d) {
        $f(a, b, c, d, 1, "keypress");
        return 0
    },
    X: function (a, b, c, d) {
        $f(a,
            b, c, d, 3, "keyup");
        return 0
    },
    W: function (a, b, c, d) {
        bg(a, b, c, d, 5, "mousedown");
        return 0
    },
    Wa: function (a, b, c, d) {
        bg(a, b, c, d, 33, "mouseenter");
        return 0
    },
    Va: function (a, b, c, d) {
        bg(a, b, c, d, 34, "mouseleave");
        return 0
    },
    U: function (a, b, c, d) {
        bg(a, b, c, d, 8, "mousemove");
        return 0
    },
    Jh: function (a, b, c, d) {
        bg(a, b, c, d, 35, "mouseover");
        return 0
    },
    V: function (a, b, c, d) {
        bg(a, b, c, d, 6, "mouseup");
        return 0
    },
    Ta: function (a, b, c, d) {
        if (!document || !document.body || !(document.body.requestPointerLock || document.body.hk || document.body.Xl || document.body.Wj)) return -1;
        a = sf(a);
        if (!a) return -4;
        cg(a, b, c, d, "pointerlockchange");
        cg(a, b, c, d, "mozpointerlockchange");
        cg(a, b, c, d, "webkitpointerlockchange");
        cg(a, b, c, d, "mspointerlockchange");
        return 0
    },
    Sa: function (a, b, c, d) {
        dg(a, b, c, d);
        return 0
    },
    O: function (a, b, c, d) {
        eg(a, b, c, d, 25, "touchcancel");
        return 0
    },
    Q: function (a, b, c, d) {
        eg(a, b, c, d, 23, "touchend");
        return 0
    },
    P: function (a, b, c, d) {
        eg(a, b, c, d, 24, "touchmove");
        return 0
    },
    R: function (a, b, c, d) {
        eg(a, b, c, d, 22, "touchstart");
        return 0
    },
    Ra: function (a, b, c) {
        if (!rf[1]) return -4;
        fg(a, b, c);
        return 0
    },
    Nh: function (a, b, c, d) {
        gg(a, b, c, d, 31, "webglcontextlost");
        return 0
    },
    Mh: function (a, b, c, d) {
        gg(a, b, c, d, 32, "webglcontextrestored");
        return 0
    },
    T: function (a, b, c, d) {
        a = sf(a);
        return "undefined" != typeof a.onwheel ? (hg(a, b, c, d), 0) : -1
    },
    mh: function (a) {
        Ta(x(a))
    },
    q: function () {
        throw "Please compile your program with async support in order to use asynchronous operations like emscripten_sleep";
    },
    ih: function (a, b, c, d, e) {
        var f = a + 112,
            g = x(f),
            l = N[f + 36 >> 2],
            n = N[f + 40 >> 2],
            q = N[f + 44 >> 2],
            p = N[f + 48 >> 2],
            t = N[f + 52 >> 2],
            v = !!(t & 4),
            r = !!(t & 32),
            C = !!(t & 16),
            y = !!(t & 64),
            F = R => {
                Fd(() => {
                    l ? P(l)(R) : b && b(R)
                }, y)
            },
            J = R => {
                Fd(() => {
                    q ? P(q)(R) : d && d(R)
                }, y)
            },
            M = R => {
                Fd(() => {
                    n ? P(n)(R) : c && c(R)
                }, y)
            },
            z = R => {
                Fd(() => {
                    p ? P(p)(R) : e && e(R)
                }, y)
            };
        t = R => {
            lg(R, F, M, J, z)
        };
        var L = (R, yb) => {
                mg(R, yb.response, ab => {
                    Fd(() => {
                        l ? P(l)(ab) : b && b(ab)
                    }, y)
                }, ab => {
                    Fd(() => {
                        l ? P(l)(ab) : b && b(ab)
                    }, y)
                })
            },
            fa = R => {
                lg(R, L, M, J, z)
            };
        if ("EM_IDB_STORE" === g) g = N[f + 84 >> 2], mg(a, A.slice(g, g + N[f + 88 >> 2]), F, M);
        else if ("EM_IDB_DELETE" === g) og(a, F, M);
        else if (C) {
            if (r) return 0;
            lg(a, v ? L : F, M, J, z)
        } else ng(a, F, r ? M : v ? fa : t);
        return a
    },
    Qh: function (a, b) {
        b >>= 2;
        b = {
            alpha: !!G[b],
            depth: !!G[b + 1],
            stencil: !!G[b + 2],
            antialias: !!G[b + 3],
            premultipliedAlpha: !!G[b + 4],
            preserveDrawingBuffer: !!G[b + 5],
            powerPreference: pg[G[b + 6]],
            failIfMajorPerformanceCaveat: !!G[b + 7],
            Tj: G[b + 8],
            Gl: G[b + 9],
            kk: G[b + 10],
            tl: G[b + 11],
            lm: G[b + 12],
            mm: G[b + 13]
        };
        a = sf(a);
        return !a || b.tl ? 0 : Sd(a, b)
    },
    Kh: function (a, b) {
        if (!b) return -5;
        a = Td[a];
        if (!a) return -3;
        var c = a.dj;
        if (!c) return -3;
        c = c.getContextAttributes();
        G[b >> 2] = c.alpha;
        G[b + 4 >> 2] = c.depth;
        G[b + 8 >> 2] = c.stencil;
        G[b + 12 >> 2] = c.antialias;
        G[b +
            16 >> 2] = c.premultipliedAlpha;
        G[b + 20 >> 2] = c.preserveDrawingBuffer;
        G[b + 24 >> 2] = c.powerPreference && pg.indexOf(c.powerPreference);
        G[b + 28 >> 2] = c.failIfMajorPerformanceCaveat;
        G[b + 32 >> 2] = a.version;
        G[b + 36 >> 2] = 0;
        G[b + 40 >> 2] = a.attributes.kk;
        return 0
    },
    Lh: function () {
        return S ? S.zl : 0
    },
    Ph: function (a) {
        return Ud(a) ? 0 : -5
    },
    ma: function (a) {
        var b = qg[a];
        if (!b) return -3;
        b.onopen = b.onerror = b.onclose = b.onmessage = null;
        delete qg[a];
        return 0
    },
    Mf: function () {
        return "undefined" != typeof WebSocket
    },
    Pa: function (a) {
        if ("undefined" == typeof WebSocket) return -1;
        if (!a) return -5;
        var b = a >> 2;
        a = x(G[b]);
        a = (b = G[b + 1]) ? new WebSocket(a, x(b).split(",")) : new WebSocket(a);
        a.binaryType = "arraybuffer";
        b = qg.length;
        qg[b] = a;
        return b
    },
    Ka: function (a, b, c) {
        a = qg[a];
        if (!a) return -3;
        a.send(A.subarray(b, b + c));
        return 0
    },
    fg: function (a, b) {
        a = qg[a];
        if (!a) return -3;
        b = x(b);
        a.send(b);
        return 0
    },
    La: function (a, b, c) {
        Z || (Z = m(1024));
        var d = qg[a];
        if (!d) return -3;
        d.onclose = function (e) {
            N[Z >> 2] = a;
            N[Z + 4 >> 2] = e.wasClean;
            N[Z + 8 >> 2] = e.code;
            u(e.reason, Z + 10, 512);
            P(c)(0, Z, b)
        };
        return 0
    },
    Ma: function (a, b, c) {
        Z || (Z =
            m(1024));
        var d = qg[a];
        if (!d) return -3;
        d.onerror = function () {
            N[Z >> 2] = a;
            P(c)(0, Z, b)
        };
        return 0
    },
    Na: function (a, b, c) {
        Z || (Z = m(1024));
        var d = qg[a];
        if (!d) return -3;
        d.onmessage = function (e) {
            N[Z >> 2] = a;
            if ("string" == typeof e.data) {
                var f = aa(e.data) + 1,
                    g = m(f);
                u(e.data, g, f);
                N[Z + 12 >> 2] = 1
            } else f = e.data.byteLength, g = m(f), E.set(new Uint8Array(e.data), g), N[Z + 12 >> 2] = 0;
            N[Z + 4 >> 2] = g;
            N[Z + 8 >> 2] = f;
            P(c)(0, Z, b);
            ca(g)
        };
        return 0
    },
    Oa: function (a, b, c) {
        Z || (Z = m(1024));
        var d = qg[a];
        if (!d) return -3;
        d.onopen = function () {
            N[Z >> 2] = a;
            P(c)(0, Z, b)
        };
        return 0
    },
    Hb: function (a, b) {
        var c = 0;
        sg().forEach(function (d, e) {
            var f = b + c;
            e = G[a + 4 * e >> 2] = f;
            for (f = 0; f < d.length; ++f) E[e++ >> 0] = d.charCodeAt(f);
            E[e >> 0] = 0;
            c += d.length + 1
        });
        return 0
    },
    Ib: function (a, b) {
        var c = sg();
        G[a >> 2] = c.length;
        var d = 0;
        c.forEach(function (e) {
            d += e.length + 1
        });
        G[b >> 2] = d;
        return 0
    },
    d: function (a) {
        Jg(a)
    },
    K: function (a) {
        try {
            var b = ld(a);
            Sc(b);
            return 0
        } catch (c) {
            if ("undefined" == typeof fd || !(c instanceof Q)) throw c;
            return c.Pi
        }
    },
    Fa: function (a, b, c, d) {
        try {
            a: {
                var e = ld(a);a = b;
                for (var f = b = 0; f < c; f++) {
                    var g = G[a >> 2],
                        l = G[a +
                            4 >> 2];
                    a += 8;
                    var n = e,
                        q = g,
                        p = l,
                        t = void 0,
                        v = E;
                    if (0 > p || 0 > t) throw new Q(28);
                    if (null === n.fd) throw new Q(8);
                    if (1 === (n.flags & 2097155)) throw new Q(8);
                    if (16384 === (n.node.mode & 61440)) throw new Q(31);
                    if (!n.Ni.read) throw new Q(28);
                    var r = "undefined" != typeof t;
                    if (!r) t = n.position;
                    else if (!n.seekable) throw new Q(70);
                    var C = n.Ni.read(n, v, q, p, t);
                    r || (n.position += C);
                    var y = C;
                    if (0 > y) {
                        var F = -1;
                        break a
                    }
                    b += y;
                    if (y < l) break
                }
                F = b
            }
            G[d >> 2] = F;
            return 0
        }
        catch (J) {
            if ("undefined" == typeof fd || !(J instanceof Q)) throw J;
            return J.Pi
        }
    },
    xb: function (a,
        b, c, d, e) {
        try {
            var f = ld(a);
            a = 4294967296 * c + (b >>> 0);
            if (-9007199254740992 >= a || 9007199254740992 <= a) return -61;
            Tc(f, a, d);
            fb = [f.position >>> 0, (H = f.position, 1 <= +Math.abs(H) ? 0 < H ? (Math.min(+Math.floor(H / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((H - +(~~H >>> 0)) / 4294967296) >>> 0 : 0)];
            G[e >> 2] = fb[0];
            G[e + 4 >> 2] = fb[1];
            f.Aj && 0 === a && 0 === d && (f.Aj = null);
            return 0
        } catch (g) {
            if ("undefined" == typeof fd || !(g instanceof Q)) throw g;
            return g.Pi
        }
    },
    Ea: function (a, b, c, d) {
        try {
            a: {
                var e = ld(a);a = b;
                for (var f = b = 0; f < c; f++) {
                    var g = G[a >> 2],
                        l = G[a +
                            4 >> 2];
                    a += 8;
                    var n = Uc(e, E, g, l);
                    if (0 > n) {
                        var q = -1;
                        break a
                    }
                    b += n
                }
                q = b
            }
            G[d >> 2] = q;
            return 0
        }
        catch (p) {
            if ("undefined" == typeof fd || !(p instanceof Q)) throw p;
            return p.Pi
        }
    },
    a: function () {
        return $a
    },
    rf: function (a, b, c, d) {
        function e(t, v, r, C, y, F) {
            var J = 10 === t ? 28 : 16;
            if (10 === t) a: {
                var M = "";
                var z, L = 0,
                    fa = 0,
                    R = 0,
                    yb = 0;y = [y[0] & 65535, y[0] >> 16, y[1] & 65535, y[1] >> 16, y[2] & 65535, y[2] >> 16, y[3] & 65535, y[3] >> 16];
                var ab = !0;
                for (z = 0; 5 > z; z++)
                    if (0 !== y[z]) {
                        ab = !1;
                        break
                    } if (ab) {
                    z = Ag(y[6] | y[7] << 16);
                    if (-1 === y[5]) {
                        M = "::ffff:" + z;
                        break a
                    }
                    if (0 === y[5]) {
                        "0.0.0.0" ===
                        z && (z = "");
                        "0.0.0.1" === z && (z = "1");
                        M = "::" + z;
                        break a
                    }
                }
                for (z = 0; 8 > z; z++) 0 === y[z] && (1 < z - fa && (yb = 0), fa = z, yb++),
                yb > L && (L = yb, R = z - L + 1);
                for (z = 0; 8 > z; z++) 1 < L && 0 === y[z] && z >= R && z < R + L ? z === R && (M += ":", 0 === R && (M += ":")) : (M += Number(Kg(y[z] & 65535)).toString(16), M += 7 > z ? ":" : "")
            }
            else M = Ag(y);
            y = M;
            J = m(J);
            a: {
                M = y;
                switch (t) {
                    case 2:
                        M = ug(M);
                        A.fill(0, J, J + 16);
                        eb[J >> 1] = t;
                        G[J + 4 >> 2] = M;
                        eb[J + 2 >> 1] = wg(F);
                        break;
                    case 10:
                        M = vg(M);
                        A.fill(0, J, J + 28);
                        G[J >> 2] = t;
                        G[J + 8 >> 2] = M[0];
                        G[J + 12 >> 2] = M[1];
                        G[J + 16 >> 2] = M[2];
                        G[J + 20 >> 2] = M[3];
                        eb[J + 2 >> 1] = wg(F);
                        break;
                    default:
                        F = 5;
                        break a
                }
                F = 0
            }!F || cb();
            F = m(32);
            G[F + 4 >> 2] = t;
            G[F + 8 >> 2] = v;
            G[F + 12 >> 2] = r;
            G[F + 24 >> 2] = C;
            G[F + 20 >> 2] = J;
            G[F + 16 >> 2] = 10 === t ? 28 : 16;
            G[F + 28 >> 2] = 0;
            return F
        }
        var f = 0,
            g = 0,
            l = 0,
            n = 0,
            q = 0,
            p = 0;
        c && (l = G[c >> 2], n = G[c + 4 >> 2], q = G[c + 8 >> 2], p = G[c + 12 >> 2]);
        q && !p && (p = 2 === q ? 17 : 6);
        !q && p && (q = 17 === p ? 2 : 1);
        0 === p && (p = 6);
        0 === q && (q = 1);
        if (!a && !b) return -2;
        if (l & -1088 || 0 !== c && G[c >> 2] & 2 && !a) return -1;
        if (l & 32) return -2;
        if (0 !== q && 1 !== q && 2 !== q) return -7;
        if (0 !== n && 2 !== n && 10 !== n) return -6;
        if (b && (b = x(b), g = parseInt(b, 10), isNaN(g))) return l & 1024 ? -2 :
            -8;
        if (!a) return 0 === n && (n = 2), 0 === (l & 1) && (2 === n ? f = Lg(2130706433) : f = [0, 0, 0, 1]), a = e(n, q, p, null, f, g), G[d >> 2] = a, 0;
        a = x(a);
        f = ug(a);
        if (null !== f)
            if (0 === n || 2 === n) n = 2;
            else if (10 === n && l & 8) f = [0, 0, Lg(65535), f], n = 10;
        else return -2;
        else if (f = vg(a), null !== f)
            if (0 === n || 10 === n) n = 10;
            else return -2;
        if (null != f) return a = e(n, q, p, a, f, g), G[d >> 2] = a, 0;
        if (l & 4) return -2;
        a = zg(a);
        f = ug(a);
        0 === n ? n = 2 : 10 === n && (f = [0, 0, Lg(65535), f]);
        a = e(n, q, p, null, f, g);
        G[d >> 2] = a;
        return 0
    },
    ja: function (a) {
        T.activeTexture(a)
    },
    ta: function (a, b) {
        T.attachShader(V[a],
            W[b])
    },
    H: function (a, b) {
        34962 == a ? T.kj = b : 34963 == a && (T.cj = b);
        35051 == a ? T.xj = b : 35052 == a && (T.Ti = b);
        T.bindBuffer(a, oe[b])
    },
    nb: function (a, b) {
        T.bindFramebuffer(a, qe[b])
    },
    C: function (a, b) {
        T.bindRenderbuffer(a, re[b])
    },
    h: function (a, b) {
        T.bindTexture(a, se[b])
    },
    ya: function (a, b) {
        T.blendFunc(a, b)
    },
    I: function (a, b, c, d) {
        T.blendFuncSeparate(a, b, c, d)
    },
    qb: function (a, b, c, d) {
        2 <= S.version ? c ? T.bufferData(a, A, d, c, b) : T.bufferData(a, b, d) : T.bufferData(a, c ? A.subarray(c, c + b) : b, d)
    },
    da: function (a) {
        T.clear(a)
    },
    Ba: function (a, b, c, d) {
        T.clearColor(a,
            b, c, d)
    },
    Aa: function (a) {
        T.clearDepth(a)
    },
    wb: function (a) {
        T.clearStencil(a)
    },
    ub: function (a, b, c, d) {
        T.colorMask(!!a, !!b, !!c, !!d)
    },
    kb: function (a) {
        T.compileShader(W[a])
    },
    hb: function () {
        var a = De(V),
            b = T.createProgram();
        b.name = a;
        b.nj = b.lj = b.mj = 0;
        b.dk = 1;
        V[a] = b;
        return a
    },
    mb: function (a) {
        var b = De(W);
        W[b] = T.createShader(a);
        return b
    },
    sb: function (a, b) {
        for (var c = 0; c < a; c++) {
            var d = G[b + 4 * c >> 2],
                e = oe[d];
            e && (T.deleteBuffer(e), e.name = 0, oe[d] = null, d == T.kj && (T.kj = 0), d == T.cj && (T.cj = 0), d == T.xj && (T.xj = 0), d == T.Ti && (T.Ti = 0))
        }
    },
    fa: function (a,
        b) {
        for (var c = 0; c < a; ++c) {
            var d = G[b + 4 * c >> 2],
                e = qe[d];
            e && (T.deleteFramebuffer(e), e.name = 0, qe[d] = null)
        }
    },
    va: function (a) {
        if (a) {
            var b = V[a];
            b ? (T.deleteProgram(b), b.name = 0, V[a] = null) : X(1281)
        }
    },
    F: function (a, b) {
        for (var c = 0; c < a; c++) {
            var d = G[b + 4 * c >> 2],
                e = re[d];
            e && (T.deleteRenderbuffer(e), e.name = 0, re[d] = null)
        }
    },
    A: function (a) {
        if (a) {
            var b = W[a];
            b ? (T.deleteShader(b), W[a] = null) : X(1281)
        }
    },
    ka: function (a, b) {
        for (var c = 0; c < a; c++) {
            var d = G[b + 4 * c >> 2],
                e = se[d];
            e && (T.deleteTexture(e), e.name = 0, se[d] = null)
        }
    },
    Ia: function (a) {
        T.depthFunc(a)
    },
    za: function (a) {
        T.depthMask(!!a)
    },
    md: function (a, b) {
        T.depthRange(a, b)
    },
    n: function (a) {
        T.disable(a)
    },
    pb: function (a) {
        S.bj[a].enabled = !1;
        T.disableVertexAttribArray(a)
    },
    ob: function (a, b, c) {
        Ge(b + c);
        T.drawArrays(a, b, c);
        Ie()
    },
    t: function (a) {
        T.enable(a)
    },
    u: function (a) {
        S.bj[a].enabled = !0;
        T.enableVertexAttribArray(a)
    },
    J: function () {
        T.flush()
    },
    B: function (a, b, c, d) {
        T.framebufferRenderbuffer(a, b, c, re[d])
    },
    D: function (a, b, c, d, e) {
        T.framebufferTexture2D(a, b, c, se[d], e)
    },
    vb: function (a) {
        T.frontFace(a)
    },
    rb: function (a, b) {
        Gf(a,
            b, "createBuffer", oe)
    },
    Ca: function (a, b) {
        Gf(a, b, "createFramebuffer", qe)
    },
    wa: function (a, b) {
        Gf(a, b, "createRenderbuffer", re)
    },
    p: function (a, b) {
        Gf(a, b, "createTexture", se)
    },
    Z: function (a, b, c, d, e, f, g) {
        Hf("getActiveUniform", a, b, c, d, e, f, g)
    },
    y: function (a, b) {
        return T.getAttribLocation(V[a], x(b))
    },
    Ja: function () {
        var a = T.getError() || Ce;
        Ce = 0;
        return a
    },
    te: function (a, b) {
        Jf(a, b, 2)
    },
    la: function (a, b) {
        Jf(a, b, 0)
    },
    fb: function (a, b, c, d) {
        a = T.getProgramInfoLog(V[a]);
        null === a && (a = "(unknown error)");
        b = 0 < b && d ? u(a, d, b) : 0;
        c && (G[c >>
            2] = b)
    },
    _: function (a, b, c) {
        if (c)
            if (a >= ne) X(1281);
            else if (a = V[a], 35716 == b) a = T.getProgramInfoLog(a), null === a && (a = "(unknown error)"), G[c >> 2] = a.length + 1;
        else if (35719 == b) {
            if (!a.nj)
                for (b = 0; b < T.getProgramParameter(a, 35718); ++b) a.nj = Math.max(a.nj, T.getActiveUniform(a, b).name.length + 1);
            G[c >> 2] = a.nj
        } else if (35722 == b) {
            if (!a.lj)
                for (b = 0; b < T.getProgramParameter(a, 35721); ++b) a.lj = Math.max(a.lj, T.getActiveAttrib(a, b).name.length + 1);
            G[c >> 2] = a.lj
        } else if (35381 == b) {
            if (!a.mj)
                for (b = 0; b < T.getProgramParameter(a, 35382); ++b) a.mj =
                    Math.max(a.mj, T.getActiveUniformBlockName(a, b).length + 1);
            G[c >> 2] = a.mj
        } else G[c >> 2] = T.getProgramParameter(a, b);
        else X(1281)
    },
    jb: function (a, b, c, d) {
        a = T.getShaderInfoLog(W[a]);
        null === a && (a = "(unknown error)");
        b = 0 < b && d ? u(a, d, b) : 0;
        c && (G[c >> 2] = b)
    },
    ua: function (a, b, c) {
        c ? 35716 == b ? (a = T.getShaderInfoLog(W[a]), null === a && (a = "(unknown error)"), G[c >> 2] = a ? a.length + 1 : 0) : 35720 == b ? (a = T.getShaderSource(W[a]), G[c >> 2] = a ? a.length + 1 : 0) : G[c >> 2] = T.getShaderParameter(W[a], b) : X(1281)
    },
    o: function (a) {
        var b = ze[a];
        if (!b) {
            switch (a) {
                case 7939:
                    b =
                        T.getSupportedExtensions() || [];
                    b = b.concat(b.map(function (d) {
                        return "GL_" + d
                    }));
                    b = Lf(b.join(" "));
                    break;
                case 7936:
                case 7937:
                case 37445:
                case 37446:
                    (b = T.getParameter(a)) || X(1280);
                    b = b && Lf(b);
                    break;
                case 7938:
                    b = T.getParameter(7938);
                    b = 2 <= S.version ? "OpenGL ES 3.0 (" + b + ")" : "OpenGL ES 2.0 (" + b + ")";
                    b = Lf(b);
                    break;
                case 35724:
                    b = T.getParameter(35724);
                    var c = b.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
                    null !== c && (3 == c[1].length && (c[1] += "0"), b = "OpenGL ES GLSL ES " + c[1] + " (" + b + ")");
                    b = Lf(b);
                    break;
                default:
                    X(1280)
            }
            ze[a] =
                b
        }
        return b
    },
    g: function (a, b) {
        b = x(b);
        if (a = V[a]) {
            Nf(a);
            var c = a.Fj,
                d = 0,
                e = b,
                f = Mf(b);
            0 < f && (d = parseInt(b.slice(f + 1)) >>> 0, e = b.slice(0, f));
            if ((e = a.ek[e]) && d < e[0] && (d += e[1], c[d] = c[d] || T.getUniformLocation(a, b))) return d
        } else X(1281);
        return -1
    },
    gb: function (a) {
        a = V[a];
        T.linkProgram(a);
        a.Fj = 0;
        a.ek = {}
    },
    Ha: function (a, b) {
        3317 == a && (Be = b);
        T.pixelStorei(a, b)
    },
    ia: function (a, b, c, d, e, f, g) {
        if (2 <= S.version)
            if (T.xj) T.readPixels(a, b, c, d, e, f, g);
            else {
                var l = Qf(f);
                T.readPixels(a, b, c, d, e, f, l, g >> Rf(l))
            }
        else(g = Sf(f, e, c, d, g)) ? T.readPixels(a,
            b, c, d, e, f, g) : X(1280)
    },
    $: function (a, b, c, d) {
        T.renderbufferStorage(a, b, c, d)
    },
    L: function (a, b, c, d) {
        T.scissor(a, b, c, d)
    },
    lb: function (a, b, c, d) {
        b = Fe(b, c, d);
        T.shaderSource(W[a], b)
    },
    ba: function (a, b, c) {
        T.stencilFunc(a, b, c)
    },
    tb: function (a) {
        T.stencilMask(a)
    },
    ca: function (a, b, c) {
        T.stencilOp(a, b, c)
    },
    l: function (a, b, c, d, e, f, g, l, n) {
        if (2 <= S.version)
            if (T.Ti) T.texImage2D(a, b, c, d, e, f, g, l, n);
            else if (n) {
            var q = Qf(l);
            T.texImage2D(a, b, c, d, e, f, g, l, q, n >> Rf(q))
        } else T.texImage2D(a, b, c, d, e, f, g, l, null);
        else T.texImage2D(a, b, c, d, e,
            f, g, l, n ? Sf(l, g, d, e, n) : null)
    },
    i: function (a, b, c) {
        T.texParameterf(a, b, c)
    },
    ea: function (a, b, c, d, e, f, g, l, n) {
        if (2 <= S.version)
            if (T.Ti) T.texSubImage2D(a, b, c, d, e, f, g, l, n);
            else if (n) {
            var q = Qf(l);
            T.texSubImage2D(a, b, c, d, e, f, g, l, q, n >> Rf(q))
        } else T.texSubImage2D(a, b, c, d, e, f, g, l, null);
        else q = null, n && (q = Sf(l, g, e, f, n)), T.texSubImage2D(a, b, c, d, e, f, g, l, q)
    },
    aa: function (a, b) {
        T.uniform1f(Y(a), b)
    },
    eb: function (a, b, c) {
        if (2 <= S.version) T.uniform1fv(Y(a), I, c >> 2, b);
        else {
            if (288 >= b)
                for (var d = Tf[b - 1], e = 0; e < b; ++e) d[e] = I[c + 4 * e >> 2];
            else d = I.subarray(c >> 2, c + 4 * b >> 2);
            T.uniform1fv(Y(a), d)
        }
    },
    G: function (a, b) {
        T.uniform1i(Y(a), b)
    },
    Yh: function (a, b, c) {
        if (2 <= S.version) T.uniform1iv(Y(a), G, c >> 2, b);
        else {
            if (288 >= b)
                for (var d = Uf[b - 1], e = 0; e < b; ++e) d[e] = G[c + 4 * e >> 2];
            else d = G.subarray(c >> 2, c + 4 * b >> 2);
            T.uniform1iv(Y(a), d)
        }
    },
    _h: function (a, b, c) {
        if (2 <= S.version) T.uniform2fv(Y(a), I, c >> 2, 2 * b);
        else {
            if (144 >= b)
                for (var d = Tf[2 * b - 1], e = 0; e < 2 * b; e += 2) d[e] = I[c + 4 * e >> 2], d[e + 1] = I[c + (4 * e + 4) >> 2];
            else d = I.subarray(c >> 2, c + 8 * b >> 2);
            T.uniform2fv(Y(a), d)
        }
    },
    Xh: function (a, b,
        c) {
        if (2 <= S.version) T.uniform2iv(Y(a), G, c >> 2, 2 * b);
        else {
            if (144 >= b)
                for (var d = Uf[2 * b - 1], e = 0; e < 2 * b; e += 2) d[e] = G[c + 4 * e >> 2], d[e + 1] = G[c + (4 * e + 4) >> 2];
            else d = G.subarray(c >> 2, c + 8 * b >> 2);
            T.uniform2iv(Y(a), d)
        }
    },
    Zh: function (a, b, c) {
        if (2 <= S.version) T.uniform3fv(Y(a), I, c >> 2, 3 * b);
        else {
            if (96 >= b)
                for (var d = Tf[3 * b - 1], e = 0; e < 3 * b; e += 3) d[e] = I[c + 4 * e >> 2], d[e + 1] = I[c + (4 * e + 4) >> 2], d[e + 2] = I[c + (4 * e + 8) >> 2];
            else d = I.subarray(c >> 2, c + 12 * b >> 2);
            T.uniform3fv(Y(a), d)
        }
    },
    Wh: function (a, b, c) {
        if (2 <= S.version) T.uniform3iv(Y(a), G, c >> 2, 3 * b);
        else {
            if (96 >=
                b)
                for (var d = Uf[3 * b - 1], e = 0; e < 3 * b; e += 3) d[e] = G[c + 4 * e >> 2], d[e + 1] = G[c + (4 * e + 4) >> 2], d[e + 2] = G[c + (4 * e + 8) >> 2];
            else d = G.subarray(c >> 2, c + 12 * b >> 2);
            T.uniform3iv(Y(a), d)
        }
    },
    s: function (a, b, c) {
        if (2 <= S.version) T.uniform4fv(Y(a), I, c >> 2, 4 * b);
        else {
            if (72 >= b) {
                var d = Tf[4 * b - 1],
                    e = I;
                c >>= 2;
                for (var f = 0; f < 4 * b; f += 4) {
                    var g = c + f;
                    d[f] = e[g];
                    d[f + 1] = e[g + 1];
                    d[f + 2] = e[g + 2];
                    d[f + 3] = e[g + 3]
                }
            } else d = I.subarray(c >> 2, c + 16 * b >> 2);
            T.uniform4fv(Y(a), d)
        }
    },
    Vh: function (a, b, c) {
        if (2 <= S.version) T.uniform4iv(Y(a), G, c >> 2, 4 * b);
        else {
            if (72 >= b)
                for (var d = Uf[4 * b -
                        1], e = 0; e < 4 * b; e += 4) d[e] = G[c + 4 * e >> 2], d[e + 1] = G[c + (4 * e + 4) >> 2], d[e + 2] = G[c + (4 * e + 8) >> 2], d[e + 3] = G[c + (4 * e + 12) >> 2];
            else d = G.subarray(c >> 2, c + 16 * b >> 2);
            T.uniform4iv(Y(a), d)
        }
    },
    Uh: function (a, b, c, d) {
        if (2 <= S.version) T.uniformMatrix2fv(Y(a), !!c, I, d >> 2, 4 * b);
        else {
            if (72 >= b)
                for (var e = Tf[4 * b - 1], f = 0; f < 4 * b; f += 4) e[f] = I[d + 4 * f >> 2], e[f + 1] = I[d + (4 * f + 4) >> 2], e[f + 2] = I[d + (4 * f + 8) >> 2], e[f + 3] = I[d + (4 * f + 12) >> 2];
            else e = I.subarray(d >> 2, d + 16 * b >> 2);
            T.uniformMatrix2fv(Y(a), !!c, e)
        }
    },
    Th: function (a, b, c, d) {
        if (2 <= S.version) T.uniformMatrix3fv(Y(a),
            !!c, I, d >> 2, 9 * b);
        else {
            if (32 >= b)
                for (var e = Tf[9 * b - 1], f = 0; f < 9 * b; f += 9) e[f] = I[d + 4 * f >> 2], e[f + 1] = I[d + (4 * f + 4) >> 2], e[f + 2] = I[d + (4 * f + 8) >> 2], e[f + 3] = I[d + (4 * f + 12) >> 2], e[f + 4] = I[d + (4 * f + 16) >> 2], e[f + 5] = I[d + (4 * f + 20) >> 2], e[f + 6] = I[d + (4 * f + 24) >> 2], e[f + 7] = I[d + (4 * f + 28) >> 2], e[f + 8] = I[d + (4 * f + 32) >> 2];
            else e = I.subarray(d >> 2, d + 36 * b >> 2);
            T.uniformMatrix3fv(Y(a), !!c, e)
        }
    },
    xa: function (a, b, c, d) {
        if (2 <= S.version) T.uniformMatrix4fv(Y(a), !!c, I, d >> 2, 16 * b);
        else {
            if (18 >= b) {
                var e = Tf[16 * b - 1],
                    f = I;
                d >>= 2;
                for (var g = 0; g < 16 * b; g += 16) {
                    var l = d + g;
                    e[g] = f[l];
                    e[g + 1] = f[l + 1];
                    e[g + 2] = f[l + 2];
                    e[g + 3] = f[l + 3];
                    e[g + 4] = f[l + 4];
                    e[g + 5] = f[l + 5];
                    e[g + 6] = f[l + 6];
                    e[g + 7] = f[l + 7];
                    e[g + 8] = f[l + 8];
                    e[g + 9] = f[l + 9];
                    e[g + 10] = f[l + 10];
                    e[g + 11] = f[l + 11];
                    e[g + 12] = f[l + 12];
                    e[g + 13] = f[l + 13];
                    e[g + 14] = f[l + 14];
                    e[g + 15] = f[l + 15]
                }
            } else e = I.subarray(d >> 2, d + 64 * b >> 2);
            T.uniformMatrix4fv(Y(a), !!c, e)
        }
    },
    ib: function (a) {
        a = V[a];
        T.useProgram(a);
        T.Nk = a
    },
    j: function (a, b, c, d, e, f) {
        var g = S.bj[a];
        T.kj ? (g.wj = !1, T.vertexAttribPointer(a, b, c, !!d, e, f)) : (g.size = b, g.type = c, g.Xj = d, g.Oj = e, g.Jj = f, g.wj = !0, g.fk = function (l, n, q, p, t, v) {
            this.vertexAttribPointer(l,
                n, q, p, t, v)
        })
    },
    M: function (a, b, c, d) {
        T.viewport(a, b, c, d)
    },
    k: Mg,
    N: Ng,
    z: Og,
    m: Pg,
    pa: Qg,
    Za: Rg,
    db: Sg,
    f: Tg,
    e: Ug,
    cb: Vg,
    Rh: Wg,
    b: function (a) {
        $a = a
    },
    na: Eg,
    yb: function (a, b, c, d) {
        return Eg(a, b, c, d)
    }
};
(function () {
    function a(e) {
        h.asm = e.exports;
        ib = h.asm.$h;
        ub();
        vb = h.asm.di;
        xb.unshift(h.asm.ai);
        Hb("wasm-instantiate")
    }

    function b(e) {
        a(e.instance)
    }

    function c(e) {
        return Mb().then(function (f) {
            return WebAssembly.instantiate(f, d)
        }).then(function (f) {
            return f
        }).then(e, function (f) {
            k("failed to asynchronously prepare wasm: " + f);
            cb(f)
        })
    }
    var d = {
        a: Xg
    };
    Gb("wasm-instantiate");
    if (h.instantiateWasm) try {
        return h.instantiateWasm(d, a)
    } catch (e) {
        return k("Module.instantiateWasm callback failed with error: " + e), !1
    }(function () {
        return bb ||
            "function" != typeof WebAssembly.instantiateStreaming || Ib() || Jb.startsWith("file://") || "function" != typeof fetch ? c(b) : fetch(Jb, {
                credentials: "same-origin"
            }).then(function (e) {
                return WebAssembly.instantiateStreaming(e, d).then(b, function (f) {
                    k("wasm streaming compile failed: " + f);
                    k("falling back to ArrayBuffer instantiation");
                    return c(b)
                })
            })
    })();
    return {}
})();
h.___wasm_call_ctors = function () {
    return (h.___wasm_call_ctors = h.asm.ai).apply(null, arguments)
};
var m = h._malloc = function () {
        return (m = h._malloc = h.asm.bi).apply(null, arguments)
    },
    ca = h._free = function () {
        return (ca = h._free = h.asm.ci).apply(null, arguments)
    },
    ba = h._memcpy = function () {
        return (ba = h._memcpy = h.asm.ei).apply(null, arguments)
    },
    wg = h._htons = function () {
        return (wg = h._htons = h.asm.fi).apply(null, arguments)
    },
    Lg = h._htonl = function () {
        return (Lg = h._htonl = h.asm.gi).apply(null, arguments)
    },
    Kg = h._ntohs = function () {
        return (Kg = h._ntohs = h.asm.hi).apply(null, arguments)
    },
    Ig = h.___errno_location = function () {
        return (Ig = h.___errno_location =
            h.asm.ii).apply(null, arguments)
    };
h._chat_callback = function () {
    return (h._chat_callback = h.asm.ji).apply(null, arguments)
};
h._join_game_callback = function () {
    return (h._join_game_callback = h.asm.ki).apply(null, arguments)
};
h._api_error_callback = function () {
    return (h._api_error_callback = h.asm.li).apply(null, arguments)
};
h._create_game_callback = function () {
    return (h._create_game_callback = h.asm.mi).apply(null, arguments)
};
h._player_info_callback = function () {
    return (h._player_info_callback = h.asm.ni).apply(null, arguments)
};
h._log_next_game_state = function () {
    return (h._log_next_game_state = h.asm.oi).apply(null, arguments)
};
h._start_game = function () {
    return (h._start_game = h.asm.pi).apply(null, arguments)
};
h._video_playback_started = function () {
    return (h._video_playback_started = h.asm.qi).apply(null, arguments)
};
h._video_playback_ended = function () {
    return (h._video_playback_ended = h.asm.ri).apply(null, arguments)
};
h._post_video_upload_callback = function () {
    return (h._post_video_upload_callback = h.asm.si).apply(null, arguments)
};
h._YYSum = function () {
    return (h._YYSum = h.asm.ti).apply(null, arguments)
};
h._main = function () {
    return (h._main = h.asm.ui).apply(null, arguments)
};
h._FSSyncCompleted = function () {
    return (h._FSSyncCompleted = h.asm.vi).apply(null, arguments)
};
var Yg = h._setThrew = function () {
        return (Yg = h._setThrew = h.asm.wi).apply(null, arguments)
    },
    mb = h.stackSave = function () {
        return (mb = h.stackSave = h.asm.xi).apply(null, arguments)
    },
    nb = h.stackRestore = function () {
        return (nb = h.stackRestore = h.asm.yi).apply(null, arguments)
    },
    lb = h.stackAlloc = function () {
        return (lb = h.stackAlloc = h.asm.zi).apply(null, arguments)
    };
h.dynCall_viij = function () {
    return (h.dynCall_viij = h.asm.Ai).apply(null, arguments)
};
h.dynCall_vij = function () {
    return (h.dynCall_vij = h.asm.Bi).apply(null, arguments)
};
h.dynCall_iiiiiij = function () {
    return (h.dynCall_iiiiiij = h.asm.Ci).apply(null, arguments)
};
h.dynCall_iiji = function () {
    return (h.dynCall_iiji = h.asm.Di).apply(null, arguments)
};
h.dynCall_jiji = function () {
    return (h.dynCall_jiji = h.asm.Ei).apply(null, arguments)
};
h.dynCall_ji = function () {
    return (h.dynCall_ji = h.asm.Fi).apply(null, arguments)
};
h.dynCall_viijii = function () {
    return (h.dynCall_viijii = h.asm.Gi).apply(null, arguments)
};
h.dynCall_iiiiij = function () {
    return (h.dynCall_iiiiij = h.asm.Hi).apply(null, arguments)
};
h.dynCall_iiiiijj = function () {
    return (h.dynCall_iiiiijj = h.asm.Ii).apply(null, arguments)
};
h.dynCall_iiiiiijj = function () {
    return (h.dynCall_iiiiiijj = h.asm.Ji).apply(null, arguments)
};

function Ng(a, b, c) {
    var d = mb();
    try {
        return P(a)(b, c)
    } catch (e) {
        nb(d);
        if (e !== e + 0) throw e;
        Yg(1, 0)
    }
}

function Ug(a, b, c, d) {
    var e = mb();
    try {
        P(a)(b, c, d)
    } catch (f) {
        nb(e);
        if (f !== f + 0) throw f;
        Yg(1, 0)
    }
}

function Pg(a, b, c, d, e) {
    var f = mb();
    try {
        return P(a)(b, c, d, e)
    } catch (g) {
        nb(f);
        if (g !== g + 0) throw g;
        Yg(1, 0)
    }
}

function Mg(a, b) {
    var c = mb();
    try {
        return P(a)(b)
    } catch (d) {
        nb(c);
        if (d !== d + 0) throw d;
        Yg(1, 0)
    }
}

function Og(a, b, c, d) {
    var e = mb();
    try {
        return P(a)(b, c, d)
    } catch (f) {
        nb(e);
        if (f !== f + 0) throw f;
        Yg(1, 0)
    }
}

function Tg(a, b, c) {
    var d = mb();
    try {
        P(a)(b, c)
    } catch (e) {
        nb(d);
        if (e !== e + 0) throw e;
        Yg(1, 0)
    }
}

function Wg(a, b, c, d, e, f, g, l, n, q) {
    var p = mb();
    try {
        P(a)(b, c, d, e, f, g, l, n, q)
    } catch (t) {
        nb(p);
        if (t !== t + 0) throw t;
        Yg(1, 0)
    }
}

function Sg(a, b) {
    var c = mb();
    try {
        P(a)(b)
    } catch (d) {
        nb(c);
        if (d !== d + 0) throw d;
        Yg(1, 0)
    }
}

function Vg(a, b, c, d, e) {
    var f = mb();
    try {
        P(a)(b, c, d, e)
    } catch (g) {
        nb(f);
        if (g !== g + 0) throw g;
        Yg(1, 0)
    }
}

function Rg(a) {
    var b = mb();
    try {
        P(a)()
    } catch (c) {
        nb(b);
        if (c !== c + 0) throw c;
        Yg(1, 0)
    }
}

function Qg(a, b, c, d, e, f, g, l, n, q) {
    var p = mb();
    try {
        return P(a)(b, c, d, e, f, g, l, n, q)
    } catch (t) {
        nb(p);
        if (t !== t + 0) throw t;
        Yg(1, 0)
    }
}
h.cwrap = function (a, b, c, d) {
    c = c || [];
    var e = c.every(function (f) {
        return "number" === f
    });
    return "string" !== b && e && !d ? h["_" + a] : function () {
        return kb(a, b, c, arguments)
    }
};
h.addRunDependency = Gb;
h.removeRunDependency = Hb;
h.FS_createPath = Yc;
h.FS_createDataFile = $c;
h.FS_createPreloadedFile = ed;
h.FS_createLazyFile = cd;
h.FS_createDevice = ad;
h.FS_unlink = Ha;
h.dynCall = Rb;
h.dynCall = Rb;
var Zg;

function Wa(a) {
    this.name = "ExitStatus";
    this.message = "Program terminated with exit(" + a + ")";
    this.status = a
}
Fb = function $g() {
    Zg || ah();
    Zg || (Fb = $g)
};

function ah(a) {
    function b() {
        if (!Zg && (Zg = !0, h.calledRun = !0, !jb)) {
            h.noFSInit || Wc || (Wc = !0, Vc(), h.stdin = h.stdin, h.stdout = h.stdout, h.stderr = h.stderr, h.stdin ? ad("/dev", "stdin", h.stdin) : Oc("/dev/tty", "/dev/stdin"), h.stdout ? ad("/dev", "stdout", null, h.stdout) : Oc("/dev/tty", "/dev/stdout"), h.stderr ? ad("/dev", "stderr", null, h.stderr) : Oc("/dev/tty1", "/dev/stderr"), Rc("/dev/stdin", 0), Rc("/dev/stdout", 1), Rc("/dev/stderr", 1));
            vc = !1;
            Ub(xb);
            Ub(zb);
            if (h.onRuntimeInitialized) h.onRuntimeInitialized();
            if (bh) {
                var c = a,
                    d = h._main;
                c = c || [];
                var e = c.length + 1,
                    f = lb(4 * (e + 1));
                G[f >> 2] = sb(Ka);
                for (var g = 1; g < e; g++) G[(f >> 2) + g] = sb(c[g - 1]);
                G[(f >> 2) + e] = 0;
                try {
                    var l = d(e, f);
                    Jg(l)
                } catch (n) {
                    Xb(n)
                } finally {}
            }
            if (h.postRun)
                for ("function" == typeof h.postRun && (h.postRun = [h.postRun]); h.postRun.length;) c = h.postRun.shift(), Bb.unshift(c);
            Ub(Bb)
        }
    }
    a = a || Ja;
    if (!(0 < Db)) {
        if (h.preRun)
            for ("function" == typeof h.preRun && (h.preRun = [h.preRun]); h.preRun.length;) Cb();
        Ub(wb);
        0 < Db || (h.setStatus ? (h.setStatus("Running..."), setTimeout(function () {
            setTimeout(function () {
                    h.setStatus("")
                },
                1);
            b()
        }, 1)) : b())
    }
}
h.run = ah;

function Jg(a) {
    if (!noExitRuntime) {
        if (h.onExit) h.onExit(a);
        jb = !0
    }
    La(a, new Wa(a))
}
if (h.preInit)
    for ("function" == typeof h.preInit && (h.preInit = [h.preInit]); 0 < h.preInit.length;) h.preInit.pop()();
var bh = !0;
h.noInitialRun && (bh = !1);
ah();
(function () {
    if ("undefined" != typeof window && !window.Ki) {
        webtransport_async_read = async d => {
            try {
                let g = d.jj.datagrams.readable.getReader();
                for (var e = !1; !e;) {
                    var f;
                    ({
                        value: f,
                        done: e
                    } = await g.read());
                    d.Yj.push(f)
                }
                console.log("Closing WebTransport connection")
            } catch (g) {
                console.error("Could not open channel to read datagrams, " + g)
            }
        };
        webtransport_async_connect = async (d, e) => {
            try {
                await d.jj.ready;
                console.log("Connected successfully to relay.");
                try {
                    d.yj = d.jj.datagrams.writable.getWriter()
                } catch (f) {
                    console.error("Could not open channel to send datagrams, " +
                        f)
                }
            } catch (f) {
                console.error("Connection failed to " + e + ", " + f)
            }
            d.jj.closed.then(() => {
                d.yj = null;
                console.log("Connection to " + e + " closed gracefully")
            }).catch(() => {
                d.yj = null;
                console.error("Connection to " + e + " closed abruptly")
            });
            webtransport_async_read(d)
        };
        class c {
            constructor() {
                this.yj = this.jj = null;
                this.Yj = [];
                this.url = ""
            }
            destroy() {
                null != this.jj && this.jj && (this.jj.close(), this.jj = null);
                this.yj = null
            }
            async connect(d, e) {
                try {
                    d.jj = new WebTransport(e)
                } catch (f) {
                    console.error("Failed to initialise WebTransport, " +
                        f)
                }
                await webtransport_async_connect(d, e)
            }
            async send(d, e) {
                null == this.jj && await this.connect(this, this.url);
                for (var f = 10; !this.yj && f;) await new Promise(n => setTimeout(n, 100)), f--;
                if (this.yj) {
                    d = h.HEAPU8.subarray(d, d + e);
                    f = new ArrayBuffer(e);
                    for (var g = new Uint8Array(f), l = 0; l < e; l++) g[l] = d[l];
                    this.yj.write(f)
                } else console.log("DatagramWriter is not initialized. Couldn't send message.")
            }
            Jl(d, e) {
                if (0 == this.Yj.length) return -1;
                var f = this.Yj[0];
                this.Yj.shift();
                var g = f.length;
                if (g > e) return -1;
                d = h.HEAPU8.subarray(d,
                    d + g);
                for (e = 0; e < g; e++) d[e] = f[e];
                return g
            }
        }
        var a = [],
            b = 0;
        webtransport_set_relay = (d, e) => {
            const f = b++;
            a[f] = new c;
            a[f].url = d + ":" + e;
            return f
        };
        webtransport_send = (d, e, f) => {
            a[d].send(e, f)
        };
        webtransport_receive = (d, e, f) => a[d].Jl(e, f);
        webtransport_destroy = d => {
            a[d].destroy();
            a[d] = null
        }
    }
})();
"undefined" != typeof window && (api_error_callback = h.cwrap("api_error_callback", null, ["number", "string"]), create_game_callback = h.cwrap("create_game_callback", null, ["string", "string", "string"]), join_game_callback = h.cwrap("join_game_callback", null, ["string"]), chat_callback = h.cwrap("chat_callback", null, ["string", "number"]), player_info_callback = h.cwrap("player_info_callback", null, "number string string string bool string".split(" ")), log_next_game_state = h.cwrap("log_next_game_state", null, []), start_game = h.cwrap("start_game",
        null, []), init_request_parameters = a => {
        var b = {
            method: "POST",
            credentials: "include",
            headers: {}
        };
        b.headers["Content-Type"] = "application/json;charset=UTF-8";
        b.headers["Access-Control-Allow-Credentials"] = "true";
        b.body = JSON.stringify(a);
        return b
    }, gxc_room_size = 4, gxc_local_player = 0, gxc_player_info = [], gxc_set_room_info = (a, b) => {
        gxc_room_size = a;
        gxc_local_player = b
    }, set_local_share_url = a => {
        window.shareUrl = a;
        if (a = document.getElementById("share-button")) a.style.visibility = "visible"
    }, post_share_url = a => {
        if (window.parent) {
            var b = {
                type: "share_url"
            };
            b.shareUrl = a;
            window.parent.postMessage(b, "*")
        }
    }, gxc_request_room = (a, b, c, d, e, f) => {
        var g = location.host.startsWith("localhost") || location.host.startsWith("test.vectorwars.gmx.dev");
        g && (e = "debug");
        console.log("Requesting " + c + "-player game with game-id " + e);
        var l = {};
        l.region = b;
        l.roomSize = c;
        l.lateJoin = !!d;
        b = init_request_parameters(l);
        fetch("https://" + a + "/gg/games/" + e + "/rooms" + (f.length ? "?trackId=" + f : ""), b).then(n => {
            n.ok ? n.json().then(q => {
                var p = q.data.shareUrl,
                    t = q.data.roomUrl;
                q = q.data.joinRoomUrl;
                g ? (p = location.protocol + "//" + location.host + location.pathname + "?game=debug&roomUrl=" + t, set_local_share_url(p)) : post_share_url(p);
                create_game_callback(q, p, t)
            }) : n.json().then(q => {
                if (window.parent) {
                    var p = {
                        type: "api_error"
                    };
                    p.error = q.errors[0].code;
                    window.parent.postMessage(p, "*")
                }
                api_error_callback(n.status, q.errors[0].code)
            })
        })
    }, gxc_join_room = (a, b, c, d) => {
        console.log("Joining game '" + b + "' with track-id '" + c + "' on environment '" + a + "' using url " + d);
        var e = {};
        "debug" != b && (e.gameId = b, e.trackId = c);
        e.roomUrl =
            d;
        b = init_request_parameters(e);
        fetch("https://" + a + "/gg/rooms", b).then(f => {
            f.ok ? f.json().then(g => {
                join_game_callback(g.data.roomUrl)
            }) : f.json().then(g => {
                if (window.parent) {
                    var l = {
                        type: "api_error"
                    };
                    l.error = g.errors[0].code;
                    window.parent.postMessage(l, "*")
                }
                api_error_callback(f.status, g.errors[0].code)
            })
        });
        location.host.startsWith("localhost") || location.host.startsWith("test.vectorwars.gmx.dev") ? set_local_share_url(window.location.href) : post_share_url(window.location.href)
    }, gxc_get_player_info = (a, b, c) => {
        console.log("Requesting player info.");
        var d = {
            method: "GET",
            credentials: "include",
            headers: {}
        };
        d.headers["Content-Type"] = "application/json;charset=UTF-8";
        d.headers["Access-Control-Allow-Credentials"] = "true";
        let e = "https://" + b + "/images/AvatarPlaceholder.png";
        fetch("https://" + a + "/gg/v2/rooms?roomUrl=" + c, d).then(f => {
            f.ok ? f.json().then(g => {
                gxc_player_info = g.data.players;
                gxc_player_info.forEach(l => {
                    null !== l.playerId && (null === l.user.userId ? (l.user.userId = "", l.user.guest = !0) : l.user.guest = !1, null === l.user.username &&
                        (l.user.username = "unknown"), null === l.user.avatarUrl && (l.user.avatarUrl = e))
                });
                window.parent && (g = {
                    type: "players"
                }, g.roomSize = gxc_room_size, g.local = gxc_local_player, g.players = gxc_player_info, window.parent.postMessage(g, "*"));
                gxc_player_info.forEach(l => {
                    null !== l.playerId && player_info_callback(l.playerId, l.user.username, l.user.avatarUrl, l.status, l.user.guest, l.user.userId)
                })
            }) : (404 == f.status && [0, 1, 2, 3].forEach(g => player_info_callback(g, "unknown", e, "JOINED", !0, "")), f.json().then(g => console.log(g)))
        })
    },
    gxc_set_player_status = (a, b) => {
        gxc_player_info.forEach(d => {
            d.playerId === a && (d.status = b)
        });
        if (window.parent) {
            var c = {
                type: "players"
            };
            c.roomSize = gxc_room_size;
            c.local = gxc_local_player;
            c.players = gxc_player_info;
            window.parent.postMessage(c, "*")
        }
    }, window.addEventListener("message", a => {
        if (a && a.data && "parent_send_chat_message" == a.data.type) {
            var b = a.data.ql;
            if (null === b || void 0 === b) b = -1;
            chat_callback(a.data.content || "", b)
        }
    }), gxc_receive_chat_message = (a, b, c) => {
        window.parent.postMessage({
            type: "receive_chat_message",
            content: a,
            src: b,
            ql: c
        }, "*")
    }, gxc_report_status = a => {
        window.parent.postMessage({
            type: "report_status",
            status: a
        }, "*")
    });
