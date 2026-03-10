/**
 * [INPUT]: 依赖 react/react-jsx-runtime、@phosphor-icons/react、./cn.js；来源 commit `72433e38914eee652c65506c6165582450f0a1d7`
 * [OUTPUT]: 对外提供 vendored DatePicker 核心运行时，实际承载 `rangeSelectionBehavior` 与 `onRangeComplete`
 * [POS]: components/ui/vendor/kumo-date-picker 的运行时快照主体，禁止手写重做内部 restart 状态机
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 * 删除条件: 当 npm `@cloudflare/kumo` 正式版本包含 `rangeSelectionBehavior` 与 `onRangeComplete` 后删除整个目录
 */
"use client";
import { jsx as $e } from "react/jsx-runtime";
import { CaretLeftIcon as Tn, CaretRightIcon as xn } from "@phosphor-icons/react";
import h, { createContext as Pn, useContext as En, useCallback as G, useRef as We, useLayoutEffect as _n, useState as Ce, useEffect as Ot, useMemo as Se } from "react";
import { c as it } from "./cn.js";
function Fn(e, t, r = "long") {
  return new Intl.DateTimeFormat("en-US", {
    // Enforces engine to render the time. Without the option JavaScriptCore omits it.
    hour: "numeric",
    timeZone: e,
    timeZoneName: r
  }).format(t).split(/\s/g).slice(2).join(" ");
}
const Bn = {}, ye = {};
function ae(e, t) {
  try {
    const n = (Bn[e] ||= new Intl.DateTimeFormat("en-US", {
      timeZone: e,
      timeZoneName: "longOffset"
    }).format)(t).split("GMT")[1];
    return n in ye ? ye[n] : ct(n, n.split(":"));
  } catch {
    if (e in ye) return ye[e];
    const r = e?.match(In);
    return r ? ct(e, r.slice(1)) : NaN;
  }
}
const In = /([+-]\d\d):?(\d\d)?/;
function ct(e, t) {
  const r = +(t[0] || 0), n = +(t[1] || 0), o = +(t[2] || 0) / 60;
  return ye[e] = r * 60 + n > 0 ? r * 60 + n + o : r * 60 - n - o;
}
class K extends Date {
  //#region static
  constructor(...t) {
    super(), t.length > 1 && typeof t[t.length - 1] == "string" && (this.timeZone = t.pop()), this.internal = /* @__PURE__ */ new Date(), isNaN(ae(this.timeZone, this)) ? this.setTime(NaN) : t.length ? typeof t[0] == "number" && (t.length === 1 || t.length === 2 && typeof t[1] != "number") ? this.setTime(t[0]) : typeof t[0] == "string" ? this.setTime(+new Date(t[0])) : t[0] instanceof Date ? this.setTime(+t[0]) : (this.setTime(+new Date(...t)), vt(this), ze(this)) : this.setTime(Date.now());
  }
  static tz(t, ...r) {
    return r.length ? new K(...r, t) : new K(Date.now(), t);
  }
  //#endregion
  //#region time zone
  withTimeZone(t) {
    return new K(+this, t);
  }
  getTimezoneOffset() {
    const t = -ae(this.timeZone, this);
    return t > 0 ? Math.floor(t) : Math.ceil(t);
  }
  //#endregion
  //#region time
  setTime(t) {
    return Date.prototype.setTime.apply(this, arguments), ze(this), +this;
  }
  //#endregion
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](t) {
    return new K(+new Date(t), this.timeZone);
  }
  //#endregion
}
const ut = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((e) => {
  if (!ut.test(e)) return;
  const t = e.replace(ut, "$1UTC");
  K.prototype[t] && (e.startsWith("get") ? K.prototype[e] = function() {
    return this.internal[t]();
  } : (K.prototype[e] = function() {
    return Date.prototype[t].apply(this.internal, arguments), Hn(this), +this;
  }, K.prototype[t] = function() {
    return Date.prototype[t].apply(this, arguments), ze(this), +this;
  }));
});
function ze(e) {
  e.internal.setTime(+e), e.internal.setUTCSeconds(e.internal.getUTCSeconds() - Math.round(-ae(e.timeZone, e) * 60));
}
function Hn(e) {
  Date.prototype.setFullYear.call(e, e.internal.getUTCFullYear(), e.internal.getUTCMonth(), e.internal.getUTCDate()), Date.prototype.setHours.call(e, e.internal.getUTCHours(), e.internal.getUTCMinutes(), e.internal.getUTCSeconds(), e.internal.getUTCMilliseconds()), vt(e);
}
function vt(e) {
  const t = ae(e.timeZone, e), r = t > 0 ? Math.floor(t) : Math.ceil(t), n = /* @__PURE__ */ new Date(+e);
  n.setUTCHours(n.getUTCHours() - 1);
  const o = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset(), i = -(/* @__PURE__ */ new Date(+n)).getTimezoneOffset(), a = o - i, s = Date.prototype.getHours.apply(e) !== e.internal.getUTCHours();
  a && s && e.internal.setUTCMinutes(e.internal.getUTCMinutes() + a);
  const c = o - r;
  c && Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + c);
  const u = /* @__PURE__ */ new Date(+e);
  u.setUTCSeconds(0);
  const l = o > 0 ? u.getSeconds() : (u.getSeconds() - 60) % 60, f = Math.round(-(ae(e.timeZone, e) * 60)) % 60;
  (f || l) && (e.internal.setUTCSeconds(e.internal.getUTCSeconds() + f), Date.prototype.setUTCSeconds.call(e, Date.prototype.getUTCSeconds.call(e) + f + l));
  const d = ae(e.timeZone, e), g = d > 0 ? Math.floor(d) : Math.ceil(d), C = -(/* @__PURE__ */ new Date(+e)).getTimezoneOffset() - g, p = g !== r, v = C - c;
  if (p && v) {
    Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + v);
    const T = ae(e.timeZone, e), D = T > 0 ? Math.floor(T) : Math.ceil(T), O = g - D;
    O && (e.internal.setUTCMinutes(e.internal.getUTCMinutes() + O), Date.prototype.setUTCMinutes.call(e, Date.prototype.getUTCMinutes.call(e) + O));
  }
}
class H extends K {
  //#region static
  static tz(t, ...r) {
    return r.length ? new H(...r, t) : new H(Date.now(), t);
  }
  //#endregion
  //#region representation
  toISOString() {
    const [t, r, n] = this.tzComponents(), o = `${t}${r}:${n}`;
    return this.internal.toISOString().slice(0, -1) + o;
  }
  toString() {
    return `${this.toDateString()} ${this.toTimeString()}`;
  }
  toDateString() {
    const [t, r, n, o] = this.internal.toUTCString().split(" ");
    return `${t?.slice(0, -1)} ${n} ${r} ${o}`;
  }
  toTimeString() {
    const t = this.internal.toUTCString().split(" ")[4], [r, n, o] = this.tzComponents();
    return `${t} GMT${r}${n}${o} (${Fn(this.timeZone, this)})`;
  }
  toLocaleString(t, r) {
    return Date.prototype.toLocaleString.call(this, t, {
      ...r,
      timeZone: r?.timeZone || this.timeZone
    });
  }
  toLocaleDateString(t, r) {
    return Date.prototype.toLocaleDateString.call(this, t, {
      ...r,
      timeZone: r?.timeZone || this.timeZone
    });
  }
  toLocaleTimeString(t, r) {
    return Date.prototype.toLocaleTimeString.call(this, t, {
      ...r,
      timeZone: r?.timeZone || this.timeZone
    });
  }
  //#endregion
  //#region private
  tzComponents() {
    const t = this.getTimezoneOffset(), r = t > 0 ? "-" : "+", n = String(Math.floor(Math.abs(t) / 60)).padStart(2, "0"), o = String(Math.abs(t) % 60).padStart(2, "0");
    return [r, n, o];
  }
  //#endregion
  withTimeZone(t) {
    return new H(+this, t);
  }
  //#region date-fns integration
  [Symbol.for("constructDateFrom")](t) {
    return new H(+new Date(t), this.timeZone);
  }
  //#endregion
}
const Wt = 6048e5, An = 864e5, ft = Symbol.for("constructDateFrom");
function B(e, t) {
  return typeof e == "function" ? e(t) : e && typeof e == "object" && ft in e ? e[ft](t) : e instanceof Date ? new e.constructor(t) : new Date(t);
}
function P(e, t) {
  return B(t || e, e);
}
function St(e, t, r) {
  const n = P(e, r?.in);
  return isNaN(t) ? B(e, NaN) : (t && n.setDate(n.getDate() + t), n);
}
function Ct(e, t, r) {
  const n = P(e, r?.in);
  if (isNaN(t)) return B(e, NaN);
  if (!t)
    return n;
  const o = n.getDate(), i = B(e, n.getTime());
  i.setMonth(n.getMonth() + t + 1, 0);
  const a = i.getDate();
  return o >= a ? i : (n.setFullYear(
    i.getFullYear(),
    i.getMonth(),
    o
  ), n);
}
let qn = {};
function Me() {
  return qn;
}
function le(e, t) {
  const r = Me(), n = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0, o = P(e, t?.in), i = o.getDay(), a = (i < n ? 7 : 0) + i - n;
  return o.setDate(o.getDate() - a), o.setHours(0, 0, 0, 0), o;
}
function be(e, t) {
  return le(e, { ...t, weekStartsOn: 1 });
}
function Nt(e, t) {
  const r = P(e, t?.in), n = r.getFullYear(), o = B(r, 0);
  o.setFullYear(n + 1, 0, 4), o.setHours(0, 0, 0, 0);
  const i = be(o), a = B(r, 0);
  a.setFullYear(n, 0, 4), a.setHours(0, 0, 0, 0);
  const s = be(a);
  return r.getTime() >= i.getTime() ? n + 1 : r.getTime() >= s.getTime() ? n : n - 1;
}
function lt(e) {
  const t = P(e), r = new Date(
    Date.UTC(
      t.getFullYear(),
      t.getMonth(),
      t.getDate(),
      t.getHours(),
      t.getMinutes(),
      t.getSeconds(),
      t.getMilliseconds()
    )
  );
  return r.setUTCFullYear(t.getFullYear()), +e - +r;
}
function de(e, ...t) {
  const r = B.bind(
    null,
    t.find((n) => typeof n == "object")
  );
  return t.map(r);
}
function we(e, t) {
  const r = P(e, t?.in);
  return r.setHours(0, 0, 0, 0), r;
}
function Ue(e, t, r) {
  const [n, o] = de(
    r?.in,
    e,
    t
  ), i = we(n), a = we(o), s = +i - lt(i), c = +a - lt(a);
  return Math.round((s - c) / An);
}
function jn(e, t) {
  const r = Nt(e, t), n = B(e, 0);
  return n.setFullYear(r, 0, 4), n.setHours(0, 0, 0, 0), be(n);
}
function Rn(e, t, r) {
  return St(e, t * 7, r);
}
function Gn(e, t, r) {
  return Ct(e, t * 12, r);
}
function $n(e, t) {
  let r, n = t?.in;
  return e.forEach((o) => {
    !n && typeof o == "object" && (n = B.bind(null, o));
    const i = P(o, n);
    (!r || r < i || isNaN(+i)) && (r = i);
  }), B(n, r || NaN);
}
function zn(e, t) {
  let r, n = t?.in;
  return e.forEach((o) => {
    !n && typeof o == "object" && (n = B.bind(null, o));
    const i = P(o, n);
    (!r || r > i || isNaN(+i)) && (r = i);
  }), B(n, r || NaN);
}
function Qn(e, t, r) {
  const [n, o] = de(
    r?.in,
    e,
    t
  );
  return +we(n) == +we(o);
}
function Yt(e) {
  return e instanceof Date || typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]";
}
function Un(e) {
  return !(!Yt(e) && typeof e != "number" || isNaN(+P(e)));
}
function Tt(e, t, r) {
  const [n, o] = de(
    r?.in,
    e,
    t
  ), i = n.getFullYear() - o.getFullYear(), a = n.getMonth() - o.getMonth();
  return i * 12 + a;
}
function Xn(e, t) {
  const r = P(e, t?.in), n = r.getMonth();
  return r.setFullYear(r.getFullYear(), n + 1, 0), r.setHours(23, 59, 59, 999), r;
}
function xt(e, t) {
  const [r, n] = de(e, t.start, t.end);
  return { start: r, end: n };
}
function Vn(e, t) {
  const { start: r, end: n } = xt(t?.in, e);
  let o = +r > +n;
  const i = o ? +r : +n, a = o ? n : r;
  a.setHours(0, 0, 0, 0), a.setDate(1);
  let s = 1;
  const c = [];
  for (; +a <= i; )
    c.push(B(r, a)), a.setMonth(a.getMonth() + s);
  return o ? c.reverse() : c;
}
function Zn(e, t) {
  const r = P(e, t?.in);
  return r.setDate(1), r.setHours(0, 0, 0, 0), r;
}
function Kn(e, t) {
  const r = P(e, t?.in), n = r.getFullYear();
  return r.setFullYear(n + 1, 0, 0), r.setHours(23, 59, 59, 999), r;
}
function Pt(e, t) {
  const r = P(e, t?.in);
  return r.setFullYear(r.getFullYear(), 0, 1), r.setHours(0, 0, 0, 0), r;
}
function Jn(e, t) {
  const { start: r, end: n } = xt(t?.in, e);
  let o = +r > +n;
  const i = o ? +r : +n, a = o ? n : r;
  a.setHours(0, 0, 0, 0), a.setMonth(0, 1);
  let s = 1;
  const c = [];
  for (; +a <= i; )
    c.push(B(r, a)), a.setFullYear(a.getFullYear() + s);
  return o ? c.reverse() : c;
}
function Et(e, t) {
  const r = Me(), n = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? r.weekStartsOn ?? r.locale?.options?.weekStartsOn ?? 0, o = P(e, t?.in), i = o.getDay(), a = (i < n ? -7 : 0) + 6 - (i - n);
  return o.setDate(o.getDate() + a), o.setHours(23, 59, 59, 999), o;
}
function Ln(e, t) {
  return Et(e, { ...t, weekStartsOn: 1 });
}
const er = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
}, tr = (e, t, r) => {
  let n;
  const o = er[e];
  return typeof o == "string" ? n = o : t === 1 ? n = o.one : n = o.other.replace("{{count}}", t.toString()), r?.addSuffix ? r.comparison && r.comparison > 0 ? "in " + n : n + " ago" : n;
};
function Ae(e) {
  return (t = {}) => {
    const r = t.width ? String(t.width) : e.defaultWidth;
    return e.formats[r] || e.formats[e.defaultWidth];
  };
}
const nr = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, rr = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, or = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, sr = {
  date: Ae({
    formats: nr,
    defaultWidth: "full"
  }),
  time: Ae({
    formats: rr,
    defaultWidth: "full"
  }),
  dateTime: Ae({
    formats: or,
    defaultWidth: "full"
  })
}, ar = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, ir = (e, t, r, n) => ar[e];
function he(e) {
  return (t, r) => {
    const n = r?.context ? String(r.context) : "standalone";
    let o;
    if (n === "formatting" && e.formattingValues) {
      const a = e.defaultFormattingWidth || e.defaultWidth, s = r?.width ? String(r.width) : a;
      o = e.formattingValues[s] || e.formattingValues[a];
    } else {
      const a = e.defaultWidth, s = r?.width ? String(r.width) : e.defaultWidth;
      o = e.values[s] || e.values[a];
    }
    const i = e.argumentCallback ? e.argumentCallback(t) : t;
    return o[i];
  };
}
const cr = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, ur = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, fr = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
}, lr = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
}, dr = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
}, hr = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
}, mr = (e, t) => {
  const r = Number(e), n = r % 100;
  if (n > 20 || n < 10)
    switch (n % 10) {
      case 1:
        return r + "st";
      case 2:
        return r + "nd";
      case 3:
        return r + "rd";
    }
  return r + "th";
}, yr = {
  ordinalNumber: mr,
  era: he({
    values: cr,
    defaultWidth: "wide"
  }),
  quarter: he({
    values: ur,
    defaultWidth: "wide",
    argumentCallback: (e) => e - 1
  }),
  month: he({
    values: fr,
    defaultWidth: "wide"
  }),
  day: he({
    values: lr,
    defaultWidth: "wide"
  }),
  dayPeriod: he({
    values: dr,
    defaultWidth: "wide",
    formattingValues: hr,
    defaultFormattingWidth: "wide"
  })
};
function me(e) {
  return (t, r = {}) => {
    const n = r.width, o = n && e.matchPatterns[n] || e.matchPatterns[e.defaultMatchWidth], i = t.match(o);
    if (!i)
      return null;
    const a = i[0], s = n && e.parsePatterns[n] || e.parsePatterns[e.defaultParseWidth], c = Array.isArray(s) ? br(s, (f) => f.test(a)) : (
      // [TODO] -- I challenge you to fix the type
      gr(s, (f) => f.test(a))
    );
    let u;
    u = e.valueCallback ? e.valueCallback(c) : c, u = r.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      r.valueCallback(u)
    ) : u;
    const l = t.slice(a.length);
    return { value: u, rest: l };
  };
}
function gr(e, t) {
  for (const r in e)
    if (Object.prototype.hasOwnProperty.call(e, r) && t(e[r]))
      return r;
}
function br(e, t) {
  for (let r = 0; r < e.length; r++)
    if (t(e[r]))
      return r;
}
function wr(e) {
  return (t, r = {}) => {
    const n = t.match(e.matchPattern);
    if (!n) return null;
    const o = n[0], i = t.match(e.parsePattern);
    if (!i) return null;
    let a = e.valueCallback ? e.valueCallback(i[0]) : i[0];
    a = r.valueCallback ? r.valueCallback(a) : a;
    const s = t.slice(o.length);
    return { value: a, rest: s };
  };
}
const Mr = /^(\d+)(th|st|nd|rd)?/i, Dr = /\d+/i, kr = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, pr = {
  any: [/^b/i, /^(a|c)/i]
}, Or = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, vr = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, Wr = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, Sr = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
}, Cr = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, Nr = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, Yr = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, Tr = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
}, xr = {
  ordinalNumber: wr({
    matchPattern: Mr,
    parsePattern: Dr,
    valueCallback: (e) => parseInt(e, 10)
  }),
  era: me({
    matchPatterns: kr,
    defaultMatchWidth: "wide",
    parsePatterns: pr,
    defaultParseWidth: "any"
  }),
  quarter: me({
    matchPatterns: Or,
    defaultMatchWidth: "wide",
    parsePatterns: vr,
    defaultParseWidth: "any",
    valueCallback: (e) => e + 1
  }),
  month: me({
    matchPatterns: Wr,
    defaultMatchWidth: "wide",
    parsePatterns: Sr,
    defaultParseWidth: "any"
  }),
  day: me({
    matchPatterns: Cr,
    defaultMatchWidth: "wide",
    parsePatterns: Nr,
    defaultParseWidth: "any"
  }),
  dayPeriod: me({
    matchPatterns: Yr,
    defaultMatchWidth: "any",
    parsePatterns: Tr,
    defaultParseWidth: "any"
  })
}, fe = {
  code: "en-US",
  formatDistance: tr,
  formatLong: sr,
  formatRelative: ir,
  localize: yr,
  match: xr,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function Pr(e, t) {
  const r = P(e, t?.in);
  return Ue(r, Pt(r)) + 1;
}
function Xe(e, t) {
  const r = P(e, t?.in), n = +be(r) - +jn(r);
  return Math.round(n / Wt) + 1;
}
function _t(e, t) {
  const r = P(e, t?.in), n = r.getFullYear(), o = Me(), i = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? o.firstWeekContainsDate ?? o.locale?.options?.firstWeekContainsDate ?? 1, a = B(t?.in || e, 0);
  a.setFullYear(n + 1, 0, i), a.setHours(0, 0, 0, 0);
  const s = le(a, t), c = B(t?.in || e, 0);
  c.setFullYear(n, 0, i), c.setHours(0, 0, 0, 0);
  const u = le(c, t);
  return +r >= +s ? n + 1 : +r >= +u ? n : n - 1;
}
function Er(e, t) {
  const r = Me(), n = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? r.firstWeekContainsDate ?? r.locale?.options?.firstWeekContainsDate ?? 1, o = _t(e, t), i = B(t?.in || e, 0);
  return i.setFullYear(o, 0, n), i.setHours(0, 0, 0, 0), le(i, t);
}
function Ve(e, t) {
  const r = P(e, t?.in), n = +le(r, t) - +Er(r, t);
  return Math.round(n / Wt) + 1;
}
function x(e, t) {
  const r = e < 0 ? "-" : "", n = Math.abs(e).toString().padStart(t, "0");
  return r + n;
}
const oe = {
  // Year
  y(e, t) {
    const r = e.getFullYear(), n = r > 0 ? r : 1 - r;
    return x(t === "yy" ? n % 100 : n, t.length);
  },
  // Month
  M(e, t) {
    const r = e.getMonth();
    return t === "M" ? String(r + 1) : x(r + 1, 2);
  },
  // Day of the month
  d(e, t) {
    return x(e.getDate(), t.length);
  },
  // AM or PM
  a(e, t) {
    const r = e.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return r.toUpperCase();
      case "aaa":
        return r;
      case "aaaaa":
        return r[0];
      case "aaaa":
      default:
        return r === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(e, t) {
    return x(e.getHours() % 12 || 12, t.length);
  },
  // Hour [0-23]
  H(e, t) {
    return x(e.getHours(), t.length);
  },
  // Minute
  m(e, t) {
    return x(e.getMinutes(), t.length);
  },
  // Second
  s(e, t) {
    return x(e.getSeconds(), t.length);
  },
  // Fraction of second
  S(e, t) {
    const r = t.length, n = e.getMilliseconds(), o = Math.trunc(
      n * Math.pow(10, r - 3)
    );
    return x(o, t.length);
  }
}, ce = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, dt = {
  // Era
  G: function(e, t, r) {
    const n = e.getFullYear() > 0 ? 1 : 0;
    switch (t) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return r.era(n, { width: "abbreviated" });
      // A, B
      case "GGGGG":
        return r.era(n, { width: "narrow" });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return r.era(n, { width: "wide" });
    }
  },
  // Year
  y: function(e, t, r) {
    if (t === "yo") {
      const n = e.getFullYear(), o = n > 0 ? n : 1 - n;
      return r.ordinalNumber(o, { unit: "year" });
    }
    return oe.y(e, t);
  },
  // Local week-numbering year
  Y: function(e, t, r, n) {
    const o = _t(e, n), i = o > 0 ? o : 1 - o;
    if (t === "YY") {
      const a = i % 100;
      return x(a, 2);
    }
    return t === "Yo" ? r.ordinalNumber(i, { unit: "year" }) : x(i, t.length);
  },
  // ISO week-numbering year
  R: function(e, t) {
    const r = Nt(e);
    return x(r, t.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(e, t) {
    const r = e.getFullYear();
    return x(r, t.length);
  },
  // Quarter
  Q: function(e, t, r) {
    const n = Math.ceil((e.getMonth() + 1) / 3);
    switch (t) {
      // 1, 2, 3, 4
      case "Q":
        return String(n);
      // 01, 02, 03, 04
      case "QQ":
        return x(n, 2);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return r.ordinalNumber(n, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return r.quarter(n, {
          width: "abbreviated",
          context: "formatting"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return r.quarter(n, {
          width: "narrow",
          context: "formatting"
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return r.quarter(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(e, t, r) {
    const n = Math.ceil((e.getMonth() + 1) / 3);
    switch (t) {
      // 1, 2, 3, 4
      case "q":
        return String(n);
      // 01, 02, 03, 04
      case "qq":
        return x(n, 2);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return r.ordinalNumber(n, { unit: "quarter" });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return r.quarter(n, {
          width: "abbreviated",
          context: "standalone"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return r.quarter(n, {
          width: "narrow",
          context: "standalone"
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return r.quarter(n, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(e, t, r) {
    const n = e.getMonth();
    switch (t) {
      case "M":
      case "MM":
        return oe.M(e, t);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return r.ordinalNumber(n + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "MMM":
        return r.month(n, {
          width: "abbreviated",
          context: "formatting"
        });
      // J, F, ..., D
      case "MMMMM":
        return r.month(n, {
          width: "narrow",
          context: "formatting"
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return r.month(n, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(e, t, r) {
    const n = e.getMonth();
    switch (t) {
      // 1, 2, ..., 12
      case "L":
        return String(n + 1);
      // 01, 02, ..., 12
      case "LL":
        return x(n + 1, 2);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return r.ordinalNumber(n + 1, { unit: "month" });
      // Jan, Feb, ..., Dec
      case "LLL":
        return r.month(n, {
          width: "abbreviated",
          context: "standalone"
        });
      // J, F, ..., D
      case "LLLLL":
        return r.month(n, {
          width: "narrow",
          context: "standalone"
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return r.month(n, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(e, t, r, n) {
    const o = Ve(e, n);
    return t === "wo" ? r.ordinalNumber(o, { unit: "week" }) : x(o, t.length);
  },
  // ISO week of year
  I: function(e, t, r) {
    const n = Xe(e);
    return t === "Io" ? r.ordinalNumber(n, { unit: "week" }) : x(n, t.length);
  },
  // Day of the month
  d: function(e, t, r) {
    return t === "do" ? r.ordinalNumber(e.getDate(), { unit: "date" }) : oe.d(e, t);
  },
  // Day of year
  D: function(e, t, r) {
    const n = Pr(e);
    return t === "Do" ? r.ordinalNumber(n, { unit: "dayOfYear" }) : x(n, t.length);
  },
  // Day of week
  E: function(e, t, r) {
    const n = e.getDay();
    switch (t) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return r.day(n, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "EEEEE":
        return r.day(n, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "EEEEEE":
        return r.day(n, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "EEEE":
      default:
        return r.day(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(e, t, r, n) {
    const o = e.getDay(), i = (o - n.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case "e":
        return String(i);
      // Padded numerical value
      case "ee":
        return x(i, 2);
      // 1st, 2nd, ..., 7th
      case "eo":
        return r.ordinalNumber(i, { unit: "day" });
      case "eee":
        return r.day(o, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "eeeee":
        return r.day(o, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "eeeeee":
        return r.day(o, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "eeee":
      default:
        return r.day(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(e, t, r, n) {
    const o = e.getDay(), i = (o - n.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      // Numerical value (same as in `e`)
      case "c":
        return String(i);
      // Padded numerical value
      case "cc":
        return x(i, t.length);
      // 1st, 2nd, ..., 7th
      case "co":
        return r.ordinalNumber(i, { unit: "day" });
      case "ccc":
        return r.day(o, {
          width: "abbreviated",
          context: "standalone"
        });
      // T
      case "ccccc":
        return r.day(o, {
          width: "narrow",
          context: "standalone"
        });
      // Tu
      case "cccccc":
        return r.day(o, {
          width: "short",
          context: "standalone"
        });
      // Tuesday
      case "cccc":
      default:
        return r.day(o, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(e, t, r) {
    const n = e.getDay(), o = n === 0 ? 7 : n;
    switch (t) {
      // 2
      case "i":
        return String(o);
      // 02
      case "ii":
        return x(o, t.length);
      // 2nd
      case "io":
        return r.ordinalNumber(o, { unit: "day" });
      // Tue
      case "iii":
        return r.day(n, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "iiiii":
        return r.day(n, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "iiiiii":
        return r.day(n, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "iiii":
      default:
        return r.day(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(e, t, r) {
    const o = e.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return r.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return r.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return r.dayPeriod(o, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return r.dayPeriod(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(e, t, r) {
    const n = e.getHours();
    let o;
    switch (n === 12 ? o = ce.noon : n === 0 ? o = ce.midnight : o = n / 12 >= 1 ? "pm" : "am", t) {
      case "b":
      case "bb":
        return r.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return r.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return r.dayPeriod(o, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return r.dayPeriod(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(e, t, r) {
    const n = e.getHours();
    let o;
    switch (n >= 17 ? o = ce.evening : n >= 12 ? o = ce.afternoon : n >= 4 ? o = ce.morning : o = ce.night, t) {
      case "B":
      case "BB":
      case "BBB":
        return r.dayPeriod(o, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return r.dayPeriod(o, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return r.dayPeriod(o, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(e, t, r) {
    if (t === "ho") {
      let n = e.getHours() % 12;
      return n === 0 && (n = 12), r.ordinalNumber(n, { unit: "hour" });
    }
    return oe.h(e, t);
  },
  // Hour [0-23]
  H: function(e, t, r) {
    return t === "Ho" ? r.ordinalNumber(e.getHours(), { unit: "hour" }) : oe.H(e, t);
  },
  // Hour [0-11]
  K: function(e, t, r) {
    const n = e.getHours() % 12;
    return t === "Ko" ? r.ordinalNumber(n, { unit: "hour" }) : x(n, t.length);
  },
  // Hour [1-24]
  k: function(e, t, r) {
    let n = e.getHours();
    return n === 0 && (n = 24), t === "ko" ? r.ordinalNumber(n, { unit: "hour" }) : x(n, t.length);
  },
  // Minute
  m: function(e, t, r) {
    return t === "mo" ? r.ordinalNumber(e.getMinutes(), { unit: "minute" }) : oe.m(e, t);
  },
  // Second
  s: function(e, t, r) {
    return t === "so" ? r.ordinalNumber(e.getSeconds(), { unit: "second" }) : oe.s(e, t);
  },
  // Fraction of second
  S: function(e, t) {
    return oe.S(e, t);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(e, t, r) {
    const n = e.getTimezoneOffset();
    if (n === 0)
      return "Z";
    switch (t) {
      // Hours and optional minutes
      case "X":
        return mt(n);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX":
        return se(n);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case "XXXXX":
      case "XXX":
      // Hours and minutes with `:` delimiter
      default:
        return se(n, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(e, t, r) {
    const n = e.getTimezoneOffset();
    switch (t) {
      // Hours and optional minutes
      case "x":
        return mt(n);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx":
        return se(n);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case "xxxxx":
      case "xxx":
      // Hours and minutes with `:` delimiter
      default:
        return se(n, ":");
    }
  },
  // Timezone (GMT)
  O: function(e, t, r) {
    const n = e.getTimezoneOffset();
    switch (t) {
      // Short
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + ht(n, ":");
      // Long
      case "OOOO":
      default:
        return "GMT" + se(n, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(e, t, r) {
    const n = e.getTimezoneOffset();
    switch (t) {
      // Short
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + ht(n, ":");
      // Long
      case "zzzz":
      default:
        return "GMT" + se(n, ":");
    }
  },
  // Seconds timestamp
  t: function(e, t, r) {
    const n = Math.trunc(+e / 1e3);
    return x(n, t.length);
  },
  // Milliseconds timestamp
  T: function(e, t, r) {
    return x(+e, t.length);
  }
};
function ht(e, t = "") {
  const r = e > 0 ? "-" : "+", n = Math.abs(e), o = Math.trunc(n / 60), i = n % 60;
  return i === 0 ? r + String(o) : r + String(o) + t + x(i, 2);
}
function mt(e, t) {
  return e % 60 === 0 ? (e > 0 ? "-" : "+") + x(Math.abs(e) / 60, 2) : se(e, t);
}
function se(e, t = "") {
  const r = e > 0 ? "-" : "+", n = Math.abs(e), o = x(Math.trunc(n / 60), 2), i = x(n % 60, 2);
  return r + o + t + i;
}
const yt = (e, t) => {
  switch (e) {
    case "P":
      return t.date({ width: "short" });
    case "PP":
      return t.date({ width: "medium" });
    case "PPP":
      return t.date({ width: "long" });
    case "PPPP":
    default:
      return t.date({ width: "full" });
  }
}, Ft = (e, t) => {
  switch (e) {
    case "p":
      return t.time({ width: "short" });
    case "pp":
      return t.time({ width: "medium" });
    case "ppp":
      return t.time({ width: "long" });
    case "pppp":
    default:
      return t.time({ width: "full" });
  }
}, _r = (e, t) => {
  const r = e.match(/(P+)(p+)?/) || [], n = r[1], o = r[2];
  if (!o)
    return yt(e, t);
  let i;
  switch (n) {
    case "P":
      i = t.dateTime({ width: "short" });
      break;
    case "PP":
      i = t.dateTime({ width: "medium" });
      break;
    case "PPP":
      i = t.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      i = t.dateTime({ width: "full" });
      break;
  }
  return i.replace("{{date}}", yt(n, t)).replace("{{time}}", Ft(o, t));
}, Fr = {
  p: Ft,
  P: _r
}, Br = /^D+$/, Ir = /^Y+$/, Hr = ["D", "DD", "YY", "YYYY"];
function Ar(e) {
  return Br.test(e);
}
function qr(e) {
  return Ir.test(e);
}
function jr(e, t, r) {
  const n = Rr(e, t, r);
  if (console.warn(n), Hr.includes(e)) throw new RangeError(n);
}
function Rr(e, t, r) {
  const n = e[0] === "Y" ? "years" : "days of the month";
  return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${n} to the input \`${r}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const Gr = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, $r = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, zr = /^'([^]*?)'?$/, Qr = /''/g, Ur = /[a-zA-Z]/;
function ge(e, t, r) {
  const n = Me(), o = r?.locale ?? n.locale ?? fe, i = r?.firstWeekContainsDate ?? r?.locale?.options?.firstWeekContainsDate ?? n.firstWeekContainsDate ?? n.locale?.options?.firstWeekContainsDate ?? 1, a = r?.weekStartsOn ?? r?.locale?.options?.weekStartsOn ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0, s = P(e, r?.in);
  if (!Un(s))
    throw new RangeError("Invalid time value");
  let c = t.match($r).map((l) => {
    const f = l[0];
    if (f === "p" || f === "P") {
      const d = Fr[f];
      return d(l, o.formatLong);
    }
    return l;
  }).join("").match(Gr).map((l) => {
    if (l === "''")
      return { isToken: !1, value: "'" };
    const f = l[0];
    if (f === "'")
      return { isToken: !1, value: Xr(l) };
    if (dt[f])
      return { isToken: !0, value: l };
    if (f.match(Ur))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + f + "`"
      );
    return { isToken: !1, value: l };
  });
  o.localize.preprocessor && (c = o.localize.preprocessor(s, c));
  const u = {
    firstWeekContainsDate: i,
    weekStartsOn: a,
    locale: o
  };
  return c.map((l) => {
    if (!l.isToken) return l.value;
    const f = l.value;
    (!r?.useAdditionalWeekYearTokens && qr(f) || !r?.useAdditionalDayOfYearTokens && Ar(f)) && jr(f, t, String(e));
    const d = dt[f[0]];
    return d(s, f, o.localize, u);
  }).join("");
}
function Xr(e) {
  const t = e.match(zr);
  return t ? t[1].replace(Qr, "'") : e;
}
function Vr(e, t) {
  const r = P(e, t?.in), n = r.getFullYear(), o = r.getMonth(), i = B(r, 0);
  return i.setFullYear(n, o + 1, 0), i.setHours(0, 0, 0, 0), i.getDate();
}
function Zr(e, t) {
  return P(e, t?.in).getMonth();
}
function Kr(e, t) {
  return P(e, t?.in).getFullYear();
}
function Jr(e, t) {
  return +P(e) > +P(t);
}
function Lr(e, t) {
  return +P(e) < +P(t);
}
function eo(e, t, r) {
  const [n, o] = de(
    r?.in,
    e,
    t
  );
  return n.getFullYear() === o.getFullYear() && n.getMonth() === o.getMonth();
}
function to(e, t, r) {
  const [n, o] = de(
    r?.in,
    e,
    t
  );
  return n.getFullYear() === o.getFullYear();
}
function no(e, t, r) {
  const n = P(e, r?.in), o = n.getFullYear(), i = n.getDate(), a = B(e, 0);
  a.setFullYear(o, t, 15), a.setHours(0, 0, 0, 0);
  const s = Vr(a);
  return n.setMonth(t, Math.min(i, s)), n;
}
function ro(e, t, r) {
  const n = P(e, r?.in);
  return isNaN(+n) ? B(e, NaN) : (n.setFullYear(t), n);
}
const gt = 5, oo = 4;
function so(e, t) {
  const r = t.startOfMonth(e), n = r.getDay() > 0 ? r.getDay() : 7, o = t.addDays(e, -n + 1), i = t.addDays(o, gt * 7 - 1);
  return t.getMonth(e) === t.getMonth(i) ? gt : oo;
}
function Bt(e, t) {
  const r = t.startOfMonth(e), n = r.getDay();
  return n === 1 ? r : n === 0 ? t.addDays(r, -6) : t.addDays(r, -1 * (n - 1));
}
function ao(e, t) {
  const r = Bt(e, t), n = so(e, t);
  return t.addDays(r, n * 7 - 1);
}
const It = {
  ...fe,
  labels: {
    labelDayButton: (e, t, r, n) => {
      let o;
      n && typeof n.format == "function" ? o = n.format.bind(n) : o = (a, s) => ge(a, s, { locale: fe, ...r });
      let i = o(e, "PPPP");
      return t.today && (i = `Today, ${i}`), t.selected && (i = `${i}, selected`), i;
    },
    labelMonthDropdown: "Choose the Month",
    labelNext: "Go to the Next Month",
    labelPrevious: "Go to the Previous Month",
    labelWeekNumber: (e) => `Week ${e}`,
    labelYearDropdown: "Choose the Year",
    labelGrid: (e, t, r) => {
      let n;
      return r && typeof r.format == "function" ? n = r.format.bind(r) : n = (o, i) => ge(o, i, { locale: fe, ...t }), n(e, "LLLL yyyy");
    },
    labelGridcell: (e, t, r, n) => {
      let o;
      n && typeof n.format == "function" ? o = n.format.bind(n) : o = (a, s) => ge(a, s, { locale: fe, ...r });
      let i = o(e, "PPPP");
      return t?.today && (i = `Today, ${i}`), i;
    },
    labelNav: "Navigation bar",
    labelWeekNumberHeader: "Week Number",
    labelWeekday: (e, t, r) => {
      let n;
      return r && typeof r.format == "function" ? n = r.format.bind(r) : n = (o, i) => ge(o, i, { locale: fe, ...t }), n(e, "cccc");
    }
  }
};
class j {
  /**
   * Creates an instance of `DateLib`.
   *
   * @param options Configuration options for the date library.
   * @param overrides Custom overrides for the date library functions.
   */
  constructor(t, r) {
    this.Date = Date, this.today = () => this.overrides?.today ? this.overrides.today() : this.options.timeZone ? H.tz(this.options.timeZone) : new this.Date(), this.newDate = (n, o, i) => this.overrides?.newDate ? this.overrides.newDate(n, o, i) : this.options.timeZone ? new H(n, o, i, this.options.timeZone) : new Date(n, o, i), this.addDays = (n, o) => this.overrides?.addDays ? this.overrides.addDays(n, o) : St(n, o), this.addMonths = (n, o) => this.overrides?.addMonths ? this.overrides.addMonths(n, o) : Ct(n, o), this.addWeeks = (n, o) => this.overrides?.addWeeks ? this.overrides.addWeeks(n, o) : Rn(n, o), this.addYears = (n, o) => this.overrides?.addYears ? this.overrides.addYears(n, o) : Gn(n, o), this.differenceInCalendarDays = (n, o) => this.overrides?.differenceInCalendarDays ? this.overrides.differenceInCalendarDays(n, o) : Ue(n, o), this.differenceInCalendarMonths = (n, o) => this.overrides?.differenceInCalendarMonths ? this.overrides.differenceInCalendarMonths(n, o) : Tt(n, o), this.eachMonthOfInterval = (n) => this.overrides?.eachMonthOfInterval ? this.overrides.eachMonthOfInterval(n) : Vn(n), this.eachYearOfInterval = (n) => {
      const o = this.overrides?.eachYearOfInterval ? this.overrides.eachYearOfInterval(n) : Jn(n), i = new Set(o.map((s) => this.getYear(s)));
      if (i.size === o.length)
        return o;
      const a = [];
      return i.forEach((s) => {
        a.push(new Date(s, 0, 1));
      }), a;
    }, this.endOfBroadcastWeek = (n) => this.overrides?.endOfBroadcastWeek ? this.overrides.endOfBroadcastWeek(n) : ao(n, this), this.endOfISOWeek = (n) => this.overrides?.endOfISOWeek ? this.overrides.endOfISOWeek(n) : Ln(n), this.endOfMonth = (n) => this.overrides?.endOfMonth ? this.overrides.endOfMonth(n) : Xn(n), this.endOfWeek = (n, o) => this.overrides?.endOfWeek ? this.overrides.endOfWeek(n, o) : Et(n, this.options), this.endOfYear = (n) => this.overrides?.endOfYear ? this.overrides.endOfYear(n) : Kn(n), this.format = (n, o, i) => {
      const a = this.overrides?.format ? this.overrides.format(n, o, this.options) : ge(n, o, this.options);
      return this.options.numerals && this.options.numerals !== "latn" ? this.replaceDigits(a) : a;
    }, this.getISOWeek = (n) => this.overrides?.getISOWeek ? this.overrides.getISOWeek(n) : Xe(n), this.getMonth = (n, o) => this.overrides?.getMonth ? this.overrides.getMonth(n, this.options) : Zr(n, this.options), this.getYear = (n, o) => this.overrides?.getYear ? this.overrides.getYear(n, this.options) : Kr(n, this.options), this.getWeek = (n, o) => this.overrides?.getWeek ? this.overrides.getWeek(n, this.options) : Ve(n, this.options), this.isAfter = (n, o) => this.overrides?.isAfter ? this.overrides.isAfter(n, o) : Jr(n, o), this.isBefore = (n, o) => this.overrides?.isBefore ? this.overrides.isBefore(n, o) : Lr(n, o), this.isDate = (n) => this.overrides?.isDate ? this.overrides.isDate(n) : Yt(n), this.isSameDay = (n, o) => this.overrides?.isSameDay ? this.overrides.isSameDay(n, o) : Qn(n, o), this.isSameMonth = (n, o) => this.overrides?.isSameMonth ? this.overrides.isSameMonth(n, o) : eo(n, o), this.isSameYear = (n, o) => this.overrides?.isSameYear ? this.overrides.isSameYear(n, o) : to(n, o), this.max = (n) => this.overrides?.max ? this.overrides.max(n) : $n(n), this.min = (n) => this.overrides?.min ? this.overrides.min(n) : zn(n), this.setMonth = (n, o) => this.overrides?.setMonth ? this.overrides.setMonth(n, o) : no(n, o), this.setYear = (n, o) => this.overrides?.setYear ? this.overrides.setYear(n, o) : ro(n, o), this.startOfBroadcastWeek = (n, o) => this.overrides?.startOfBroadcastWeek ? this.overrides.startOfBroadcastWeek(n, this) : Bt(n, this), this.startOfDay = (n) => this.overrides?.startOfDay ? this.overrides.startOfDay(n) : we(n), this.startOfISOWeek = (n) => this.overrides?.startOfISOWeek ? this.overrides.startOfISOWeek(n) : be(n), this.startOfMonth = (n) => this.overrides?.startOfMonth ? this.overrides.startOfMonth(n) : Zn(n), this.startOfWeek = (n, o) => this.overrides?.startOfWeek ? this.overrides.startOfWeek(n, this.options) : le(n, this.options), this.startOfYear = (n) => this.overrides?.startOfYear ? this.overrides.startOfYear(n) : Pt(n), this.options = { locale: It, ...t }, this.overrides = r;
  }
  /**
   * Generates a mapping of Arabic digits (0-9) to the target numbering system
   * digits.
   *
   * @since 9.5.0
   * @returns A record mapping Arabic digits to the target numerals.
   */
  getDigitMap() {
    const { numerals: t = "latn" } = this.options, r = new Intl.NumberFormat("en-US", {
      numberingSystem: t
    }), n = {};
    for (let o = 0; o < 10; o++)
      n[o.toString()] = r.format(o);
    return n;
  }
  /**
   * Replaces Arabic digits in a string with the target numbering system digits.
   *
   * @since 9.5.0
   * @param input The string containing Arabic digits.
   * @returns The string with digits replaced.
   */
  replaceDigits(t) {
    const r = this.getDigitMap();
    return t.replace(/\d/g, (n) => r[n] || n);
  }
  /**
   * Formats a number using the configured numbering system.
   *
   * @since 9.5.0
   * @param value The number to format.
   * @returns The formatted number as a string.
   */
  formatNumber(t) {
    return this.replaceDigits(t.toString());
  }
  /**
   * Returns the preferred ordering for month and year labels for the current
   * locale.
   */
  getMonthYearOrder() {
    const t = this.options.locale?.code;
    return t && j.yearFirstLocales.has(t) ? "year-first" : "month-first";
  }
  /**
   * Formats the month/year pair respecting locale conventions.
   *
   * @since 9.11.0
   */
  formatMonthYear(t) {
    const { locale: r, timeZone: n, numerals: o } = this.options, i = r?.code;
    if (i && j.yearFirstLocales.has(i))
      try {
        return new Intl.DateTimeFormat(i, {
          month: "long",
          year: "numeric",
          timeZone: n,
          numberingSystem: o
        }).format(t);
      } catch {
      }
    const a = this.getMonthYearOrder() === "year-first" ? "y LLLL" : "LLLL y";
    return this.format(t, a);
  }
}
j.yearFirstLocales = /* @__PURE__ */ new Set([
  "eu",
  "hu",
  "ja",
  "ja-Hira",
  "ja-JP",
  "ko",
  "ko-KR",
  "lt",
  "lt-LT",
  "lv",
  "lv-LV",
  "mn",
  "mn-MN",
  "zh",
  "zh-CN",
  "zh-HK",
  "zh-TW"
]);
const J = new j();
class Ht {
  constructor(t, r, n = J) {
    this.date = t, this.displayMonth = r, this.outside = !!(r && !n.isSameMonth(t, r)), this.dateLib = n, this.isoDate = n.format(t, "yyyy-MM-dd"), this.displayMonthId = n.format(r, "yyyy-MM"), this.dateMonthId = n.format(t, "yyyy-MM");
  }
  /**
   * Checks if this day is equal to another `CalendarDay`, considering both the
   * date and the displayed month.
   *
   * @param day The `CalendarDay` to compare with.
   * @returns `true` if the days are equal, otherwise `false`.
   */
  isEqualTo(t) {
    return this.dateLib.isSameDay(t.date, this.date) && this.dateLib.isSameMonth(t.displayMonth, this.displayMonth);
  }
}
class io {
  constructor(t, r) {
    this.date = t, this.weeks = r;
  }
}
class co {
  constructor(t, r) {
    this.days = r, this.weekNumber = t;
  }
}
function uo(e) {
  return h.createElement("button", { ...e });
}
function fo(e) {
  return h.createElement("span", { ...e });
}
function lo(e) {
  const { size: t = 24, orientation: r = "left", className: n } = e;
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: handled by the parent component
    h.createElement(
      "svg",
      { className: n, width: t, height: t, viewBox: "0 0 24 24" },
      r === "up" && h.createElement("polygon", { points: "6.77 17 12.5 11.43 18.24 17 20 15.28 12.5 8 5 15.28" }),
      r === "down" && h.createElement("polygon", { points: "6.77 8 12.5 13.57 18.24 8 20 9.72 12.5 17 5 9.72" }),
      r === "left" && h.createElement("polygon", { points: "16 18.112 9.81111111 12 16 5.87733333 14.0888889 4 6 12 14.0888889 20" }),
      r === "right" && h.createElement("polygon", { points: "8 18.112 14.18888889 12 8 5.87733333 9.91111111 4 18 12 9.91111111 20" })
    )
  );
}
function ho(e) {
  const { day: t, modifiers: r, ...n } = e;
  return h.createElement("td", { ...n });
}
function mo(e) {
  const { day: t, modifiers: r, ...n } = e, o = h.useRef(null);
  return h.useEffect(() => {
    r.focused && o.current?.focus();
  }, [r.focused]), h.createElement("button", { ref: o, ...n });
}
var y;
(function(e) {
  e.Root = "root", e.Chevron = "chevron", e.Day = "day", e.DayButton = "day_button", e.CaptionLabel = "caption_label", e.Dropdowns = "dropdowns", e.Dropdown = "dropdown", e.DropdownRoot = "dropdown_root", e.Footer = "footer", e.MonthGrid = "month_grid", e.MonthCaption = "month_caption", e.MonthsDropdown = "months_dropdown", e.Month = "month", e.Months = "months", e.Nav = "nav", e.NextMonthButton = "button_next", e.PreviousMonthButton = "button_previous", e.Week = "week", e.Weeks = "weeks", e.Weekday = "weekday", e.Weekdays = "weekdays", e.WeekNumber = "week_number", e.WeekNumberHeader = "week_number_header", e.YearsDropdown = "years_dropdown";
})(y || (y = {}));
var _;
(function(e) {
  e.disabled = "disabled", e.hidden = "hidden", e.outside = "outside", e.focused = "focused", e.today = "today";
})(_ || (_ = {}));
var X;
(function(e) {
  e.range_end = "range_end", e.range_middle = "range_middle", e.range_start = "range_start", e.selected = "selected";
})(X || (X = {}));
var q;
(function(e) {
  e.weeks_before_enter = "weeks_before_enter", e.weeks_before_exit = "weeks_before_exit", e.weeks_after_enter = "weeks_after_enter", e.weeks_after_exit = "weeks_after_exit", e.caption_after_enter = "caption_after_enter", e.caption_after_exit = "caption_after_exit", e.caption_before_enter = "caption_before_enter", e.caption_before_exit = "caption_before_exit";
})(q || (q = {}));
function yo(e) {
  const { options: t, className: r, components: n, classNames: o, ...i } = e, a = [o[y.Dropdown], r].join(" "), s = t?.find(({ value: c }) => c === i.value);
  return h.createElement(
    "span",
    { "data-disabled": i.disabled, className: o[y.DropdownRoot] },
    h.createElement(n.Select, { className: a, ...i }, t?.map(({ value: c, label: u, disabled: l }) => h.createElement(n.Option, { key: c, value: c, disabled: l }, u))),
    h.createElement(
      "span",
      { className: o[y.CaptionLabel], "aria-hidden": !0 },
      s?.label,
      h.createElement(n.Chevron, { orientation: "down", size: 18, className: o[y.Chevron] })
    )
  );
}
function go(e) {
  return h.createElement("div", { ...e });
}
function bo(e) {
  return h.createElement("div", { ...e });
}
function wo(e) {
  const { calendarMonth: t, displayIndex: r, ...n } = e;
  return h.createElement("div", { ...n }, e.children);
}
function Mo(e) {
  const { calendarMonth: t, displayIndex: r, ...n } = e;
  return h.createElement("div", { ...n });
}
function Do(e) {
  return h.createElement("table", { ...e });
}
function ko(e) {
  return h.createElement("div", { ...e });
}
const At = Pn(void 0);
function De() {
  const e = En(At);
  if (e === void 0)
    throw new Error("useDayPicker() must be used within a custom component.");
  return e;
}
function po(e) {
  const { components: t } = De();
  return h.createElement(t.Dropdown, { ...e });
}
function Oo(e) {
  const { onPreviousClick: t, onNextClick: r, previousMonth: n, nextMonth: o, ...i } = e, { components: a, classNames: s, labels: { labelPrevious: c, labelNext: u } } = De(), l = G((d) => {
    o && r?.(d);
  }, [o, r]), f = G((d) => {
    n && t?.(d);
  }, [n, t]);
  return h.createElement(
    "nav",
    { ...i },
    h.createElement(
      a.PreviousMonthButton,
      { type: "button", className: s[y.PreviousMonthButton], tabIndex: n ? void 0 : -1, "aria-disabled": n ? void 0 : !0, "aria-label": c(n), onClick: f },
      h.createElement(a.Chevron, { disabled: n ? void 0 : !0, className: s[y.Chevron], orientation: "left" })
    ),
    h.createElement(
      a.NextMonthButton,
      { type: "button", className: s[y.NextMonthButton], tabIndex: o ? void 0 : -1, "aria-disabled": o ? void 0 : !0, "aria-label": u(o), onClick: l },
      h.createElement(a.Chevron, { disabled: o ? void 0 : !0, orientation: "right", className: s[y.Chevron] })
    )
  );
}
function vo(e) {
  const { components: t } = De();
  return h.createElement(t.Button, { ...e });
}
function Wo(e) {
  return h.createElement("option", { ...e });
}
function So(e) {
  const { components: t } = De();
  return h.createElement(t.Button, { ...e });
}
function Co(e) {
  const { rootRef: t, ...r } = e;
  return h.createElement("div", { ...r, ref: t });
}
function No(e) {
  return h.createElement("select", { ...e });
}
function Yo(e) {
  const { week: t, ...r } = e;
  return h.createElement("tr", { ...r });
}
function To(e) {
  return h.createElement("th", { ...e });
}
function xo(e) {
  return h.createElement(
    "thead",
    { "aria-hidden": !0 },
    h.createElement("tr", { ...e })
  );
}
function Po(e) {
  const { week: t, ...r } = e;
  return h.createElement("th", { ...r });
}
function Eo(e) {
  return h.createElement("th", { ...e });
}
function _o(e) {
  return h.createElement("tbody", { ...e });
}
function Fo(e) {
  const { components: t } = De();
  return h.createElement(t.Dropdown, { ...e });
}
const Bo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Button: uo,
  CaptionLabel: fo,
  Chevron: lo,
  Day: ho,
  DayButton: mo,
  Dropdown: yo,
  DropdownNav: go,
  Footer: bo,
  Month: wo,
  MonthCaption: Mo,
  MonthGrid: Do,
  Months: ko,
  MonthsDropdown: po,
  Nav: Oo,
  NextMonthButton: vo,
  Option: Wo,
  PreviousMonthButton: So,
  Root: Co,
  Select: No,
  Week: Yo,
  WeekNumber: Po,
  WeekNumberHeader: Eo,
  Weekday: To,
  Weekdays: xo,
  Weeks: _o,
  YearsDropdown: Fo
}, Symbol.toStringTag, { value: "Module" }));
function te(e, t, r = !1, n = J) {
  let { from: o, to: i } = e;
  const { differenceInCalendarDays: a, isSameDay: s } = n;
  return o && i ? (a(i, o) < 0 && ([o, i] = [i, o]), a(t, o) >= (r ? 1 : 0) && a(i, t) >= (r ? 1 : 0)) : !r && i ? s(i, t) : !r && o ? s(o, t) : !1;
}
function Ze(e) {
  return !!(e && typeof e == "object" && "before" in e && "after" in e);
}
function Ne(e) {
  return !!(e && typeof e == "object" && "from" in e);
}
function Ke(e) {
  return !!(e && typeof e == "object" && "after" in e);
}
function Je(e) {
  return !!(e && typeof e == "object" && "before" in e);
}
function qt(e) {
  return !!(e && typeof e == "object" && "dayOfWeek" in e);
}
function jt(e, t) {
  return Array.isArray(e) && e.every(t.isDate);
}
function ne(e, t, r = J) {
  const n = Array.isArray(t) ? t : [t], { isSameDay: o, differenceInCalendarDays: i, isAfter: a } = r;
  return n.some((s) => {
    if (typeof s == "boolean")
      return s;
    if (r.isDate(s))
      return o(e, s);
    if (jt(s, r))
      return s.some((c) => o(e, c));
    if (Ne(s))
      return te(s, e, !1, r);
    if (qt(s))
      return Array.isArray(s.dayOfWeek) ? s.dayOfWeek.includes(e.getDay()) : s.dayOfWeek === e.getDay();
    if (Ze(s)) {
      const c = i(s.before, e), u = i(s.after, e), l = c > 0, f = u < 0;
      return a(s.before, s.after) ? f && l : l || f;
    }
    return Ke(s) ? i(e, s.after) > 0 : Je(s) ? i(s.before, e) > 0 : typeof s == "function" ? s(e) : !1;
  });
}
function Io(e, t, r, n, o) {
  const { disabled: i, hidden: a, modifiers: s, showOutsideDays: c, broadcastCalendar: u, today: l = o.today() } = t, { isSameDay: f, isSameMonth: d, startOfMonth: g, isBefore: M, endOfMonth: C, isAfter: p } = o, v = r && g(r), T = n && C(n), D = {
    [_.focused]: [],
    [_.outside]: [],
    [_.disabled]: [],
    [_.hidden]: [],
    [_.today]: []
  }, O = {};
  for (const w of e) {
    const { date: m, displayMonth: W } = w, E = !!(W && !d(m, W)), I = !!(v && M(m, v)), F = !!(T && p(m, T)), V = !!(i && ne(m, i, o)), re = !!(a && ne(m, a, o)) || I || F || // Broadcast calendar will show outside days as default
    !u && !c && E || u && c === !1 && E, L = f(m, l);
    E && D.outside.push(w), V && D.disabled.push(w), re && D.hidden.push(w), L && D.today.push(w), s && Object.keys(s).forEach((R) => {
      const ie = s?.[R];
      ie && ne(m, ie, o) && (O[R] ? O[R].push(w) : O[R] = [w]);
    });
  }
  return (w) => {
    const m = {
      [_.focused]: !1,
      [_.disabled]: !1,
      [_.hidden]: !1,
      [_.outside]: !1,
      [_.today]: !1
    }, W = {};
    for (const E in D) {
      const I = D[E];
      m[E] = I.some((F) => F === w);
    }
    for (const E in O)
      W[E] = O[E].some((I) => I === w);
    return {
      ...m,
      // custom modifiers should override all the previous ones
      ...W
    };
  };
}
function Ho(e, t, r = {}) {
  return Object.entries(e).filter(([, o]) => o === !0).reduce((o, [i]) => (r[i] ? o.push(r[i]) : t[_[i]] ? o.push(t[_[i]]) : t[X[i]] && o.push(t[X[i]]), o), [t[y.Day]]);
}
function Ao(e) {
  return {
    ...Bo,
    ...e
  };
}
function qo(e) {
  const t = {
    "data-mode": e.mode ?? void 0,
    "data-required": "required" in e ? e.required : void 0,
    "data-multiple-months": e.numberOfMonths && e.numberOfMonths > 1 || void 0,
    "data-week-numbers": e.showWeekNumber || void 0,
    "data-broadcast-calendar": e.broadcastCalendar || void 0,
    "data-nav-layout": e.navLayout || void 0
  };
  return Object.entries(e).forEach(([r, n]) => {
    r.startsWith("data-") && (t[r] = n);
  }), t;
}
function jo() {
  const e = {};
  for (const t in y)
    e[y[t]] = `rdp-${y[t]}`;
  for (const t in _)
    e[_[t]] = `rdp-${_[t]}`;
  for (const t in X)
    e[X[t]] = `rdp-${X[t]}`;
  for (const t in q)
    e[q[t]] = `rdp-${q[t]}`;
  return e;
}
function Rt(e, t, r) {
  return (r ?? new j(t)).formatMonthYear(e);
}
const Ro = Rt;
function Go(e, t, r) {
  return (r ?? new j(t)).format(e, "d");
}
function $o(e, t = J) {
  return t.format(e, "LLLL");
}
function zo(e, t, r) {
  return (r ?? new j(t)).format(e, "cccccc");
}
function Qo(e, t = J) {
  return e < 10 ? t.formatNumber(`0${e.toLocaleString()}`) : t.formatNumber(`${e.toLocaleString()}`);
}
function Uo() {
  return "";
}
function Gt(e, t = J) {
  return t.format(e, "yyyy");
}
const Xo = Gt, Vo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  formatCaption: Rt,
  formatDay: Go,
  formatMonthCaption: Ro,
  formatMonthDropdown: $o,
  formatWeekNumber: Qo,
  formatWeekNumberHeader: Uo,
  formatWeekdayName: zo,
  formatYearCaption: Xo,
  formatYearDropdown: Gt
}, Symbol.toStringTag, { value: "Module" }));
function Zo(e) {
  return e?.formatMonthCaption && !e.formatCaption && (e.formatCaption = e.formatMonthCaption), e?.formatYearCaption && !e.formatYearDropdown && (e.formatYearDropdown = e.formatYearCaption), {
    ...Vo,
    ...e
  };
}
function Le(e, t, r, n) {
  let o = (n ?? new j(r)).format(e, "PPPP");
  return t.today && (o = `Today, ${o}`), t.selected && (o = `${o}, selected`), o;
}
const Ko = Le;
function et(e, t, r) {
  return (r ?? new j(t)).formatMonthYear(e);
}
const Jo = et;
function $t(e, t, r, n) {
  let o = (n ?? new j(r)).format(e, "PPPP");
  return t?.today && (o = `Today, ${o}`), o;
}
function zt(e) {
  return "Choose the Month";
}
function Qt() {
  return "";
}
const Lo = "Go to the Next Month";
function Ut(e, t) {
  return Lo;
}
function Xt(e) {
  return "Go to the Previous Month";
}
function Vt(e, t, r) {
  return (r ?? new j(t)).format(e, "cccc");
}
function Zt(e, t) {
  return `Week ${e}`;
}
function Kt(e) {
  return "Week Number";
}
function Jt(e) {
  return "Choose the Year";
}
const es = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  labelCaption: Jo,
  labelDay: Ko,
  labelDayButton: Le,
  labelGrid: et,
  labelGridcell: $t,
  labelMonthDropdown: zt,
  labelNav: Qt,
  labelNext: Ut,
  labelPrevious: Xt,
  labelWeekNumber: Zt,
  labelWeekNumberHeader: Kt,
  labelWeekday: Vt,
  labelYearDropdown: Jt
}, Symbol.toStringTag, { value: "Module" })), U = (e, t, r) => t || (r ? typeof r == "function" ? r : (...n) => r : e);
function ts(e, t) {
  const r = t.locale?.labels ?? {};
  return {
    ...es,
    ...e ?? {},
    labelDayButton: U(Le, e?.labelDayButton, r.labelDayButton),
    labelMonthDropdown: U(zt, e?.labelMonthDropdown, r.labelMonthDropdown),
    labelNext: U(Ut, e?.labelNext, r.labelNext),
    labelPrevious: U(Xt, e?.labelPrevious, r.labelPrevious),
    labelWeekNumber: U(Zt, e?.labelWeekNumber, r.labelWeekNumber),
    labelYearDropdown: U(Jt, e?.labelYearDropdown, r.labelYearDropdown),
    labelGrid: U(et, e?.labelGrid, r.labelGrid),
    labelGridcell: U($t, e?.labelGridcell, r.labelGridcell),
    labelNav: U(Qt, e?.labelNav, r.labelNav),
    labelWeekNumberHeader: U(Kt, e?.labelWeekNumberHeader, r.labelWeekNumberHeader),
    labelWeekday: U(Vt, e?.labelWeekday, r.labelWeekday)
  };
}
function ns(e, t, r, n, o) {
  const { startOfMonth: i, startOfYear: a, endOfYear: s, eachMonthOfInterval: c, getMonth: u } = o;
  return c({
    start: a(e),
    end: s(e)
  }).map((d) => {
    const g = n.formatMonthDropdown(d, o), M = u(d), C = t && d < i(t) || r && d > i(r) || !1;
    return { value: M, label: g, disabled: C };
  });
}
function rs(e, t = {}, r = {}) {
  let n = { ...t?.[y.Day] };
  return Object.entries(e).filter(([, o]) => o === !0).forEach(([o]) => {
    n = {
      ...n,
      ...r?.[o]
    };
  }), n;
}
function os(e, t, r, n) {
  const o = n ?? e.today(), i = r ? e.startOfBroadcastWeek(o, e) : t ? e.startOfISOWeek(o) : e.startOfWeek(o), a = [];
  for (let s = 0; s < 7; s++) {
    const c = e.addDays(i, s);
    a.push(c);
  }
  return a;
}
function ss(e, t, r, n, o = !1) {
  if (!e || !t)
    return;
  const { startOfYear: i, endOfYear: a, eachYearOfInterval: s, getYear: c } = n, u = i(e), l = a(t), f = s({ start: u, end: l });
  return o && f.reverse(), f.map((d) => {
    const g = r.formatYearDropdown(d, n);
    return {
      value: c(d),
      label: g,
      disabled: !1
    };
  });
}
function as(e, t = {}) {
  const { weekStartsOn: r, locale: n } = t, o = r ?? n?.options?.weekStartsOn ?? 0, i = (s) => {
    const c = typeof s == "number" || typeof s == "string" ? new Date(s) : s;
    return new H(c.getFullYear(), c.getMonth(), c.getDate(), 12, 0, 0, e);
  }, a = (s) => {
    const c = i(s);
    return new Date(c.getFullYear(), c.getMonth(), c.getDate(), 0, 0, 0, 0);
  };
  return {
    today: () => i(H.tz(e)),
    newDate: (s, c, u) => new H(s, c, u, 12, 0, 0, e),
    startOfDay: (s) => i(s),
    startOfWeek: (s, c) => {
      const u = i(s), l = c?.weekStartsOn ?? o, f = (u.getDay() - l + 7) % 7;
      return u.setDate(u.getDate() - f), u;
    },
    startOfISOWeek: (s) => {
      const c = i(s), u = (c.getDay() - 1 + 7) % 7;
      return c.setDate(c.getDate() - u), c;
    },
    startOfMonth: (s) => {
      const c = i(s);
      return c.setDate(1), c;
    },
    startOfYear: (s) => {
      const c = i(s);
      return c.setMonth(0, 1), c;
    },
    endOfWeek: (s, c) => {
      const u = i(s), d = (((c?.weekStartsOn ?? o) + 6) % 7 - u.getDay() + 7) % 7;
      return u.setDate(u.getDate() + d), u;
    },
    endOfISOWeek: (s) => {
      const c = i(s), u = (7 - c.getDay()) % 7;
      return c.setDate(c.getDate() + u), c;
    },
    endOfMonth: (s) => {
      const c = i(s);
      return c.setMonth(c.getMonth() + 1, 0), c;
    },
    endOfYear: (s) => {
      const c = i(s);
      return c.setMonth(11, 31), c;
    },
    eachMonthOfInterval: (s) => {
      const c = i(s.start), u = i(s.end), l = [], f = new H(c.getFullYear(), c.getMonth(), 1, 12, 0, 0, e), d = u.getFullYear() * 12 + u.getMonth();
      for (; f.getFullYear() * 12 + f.getMonth() <= d; )
        l.push(new H(f, e)), f.setMonth(f.getMonth() + 1, 1);
      return l;
    },
    // Normalize to noon once before arithmetic (avoid DST/midnight edge cases),
    // mutate the same TZDate, and return it.
    addDays: (s, c) => {
      const u = i(s);
      return u.setDate(u.getDate() + c), u;
    },
    addWeeks: (s, c) => {
      const u = i(s);
      return u.setDate(u.getDate() + c * 7), u;
    },
    addMonths: (s, c) => {
      const u = i(s);
      return u.setMonth(u.getMonth() + c), u;
    },
    addYears: (s, c) => {
      const u = i(s);
      return u.setFullYear(u.getFullYear() + c), u;
    },
    eachYearOfInterval: (s) => {
      const c = i(s.start), u = i(s.end), l = [], f = new H(c.getFullYear(), 0, 1, 12, 0, 0, e);
      for (; f.getFullYear() <= u.getFullYear(); )
        l.push(new H(f, e)), f.setFullYear(f.getFullYear() + 1, 0, 1);
      return l;
    },
    getWeek: (s, c) => {
      const u = a(s);
      return Ve(u, {
        weekStartsOn: c?.weekStartsOn ?? o,
        firstWeekContainsDate: c?.firstWeekContainsDate ?? n?.options?.firstWeekContainsDate ?? 1
      });
    },
    getISOWeek: (s) => {
      const c = a(s);
      return Xe(c);
    },
    differenceInCalendarDays: (s, c) => {
      const u = a(s), l = a(c);
      return Ue(u, l);
    },
    differenceInCalendarMonths: (s, c) => {
      const u = a(s), l = a(c);
      return Tt(u, l);
    }
  };
}
const ke = (e) => e instanceof HTMLElement ? e : null, qe = (e) => [
  ...e.querySelectorAll("[data-animated-month]") ?? []
], is = (e) => ke(e.querySelector("[data-animated-month]")), je = (e) => ke(e.querySelector("[data-animated-caption]")), Re = (e) => ke(e.querySelector("[data-animated-weeks]")), cs = (e) => ke(e.querySelector("[data-animated-nav]")), us = (e) => ke(e.querySelector("[data-animated-weekdays]"));
function fs(e, t, { classNames: r, months: n, focused: o, dateLib: i }) {
  const a = We(null), s = We(n), c = We(!1);
  _n(() => {
    const u = s.current;
    if (s.current = n, !t || !e.current || // safety check because the ref can be set to anything by consumers
    !(e.current instanceof HTMLElement) || // validation required for the animation to work as expected
    n.length === 0 || u.length === 0 || n.length !== u.length)
      return;
    const l = i.isSameMonth(n[0].date, u[0].date), f = i.isAfter(n[0].date, u[0].date), d = f ? r[q.caption_after_enter] : r[q.caption_before_enter], g = f ? r[q.weeks_after_enter] : r[q.weeks_before_enter], M = a.current, C = e.current.cloneNode(!0);
    if (C instanceof HTMLElement ? (qe(C).forEach((D) => {
      if (!(D instanceof HTMLElement))
        return;
      const O = is(D);
      O && D.contains(O) && D.removeChild(O);
      const w = je(D);
      w && w.classList.remove(d);
      const m = Re(D);
      m && m.classList.remove(g);
    }), a.current = C) : a.current = null, c.current || l || // skip animation if a day is focused because it can cause issues to the animation and is better for a11y
    o)
      return;
    const p = M instanceof HTMLElement ? qe(M) : [], v = qe(e.current);
    if (v?.every((T) => T instanceof HTMLElement) && p && p.every((T) => T instanceof HTMLElement)) {
      c.current = !0, e.current.style.isolation = "isolate";
      const T = cs(e.current);
      T && (T.style.zIndex = "1"), v.forEach((D, O) => {
        const w = p[O];
        if (!w)
          return;
        D.style.position = "relative", D.style.overflow = "hidden";
        const m = je(D);
        m && m.classList.add(d);
        const W = Re(D);
        W && W.classList.add(g);
        const E = () => {
          c.current = !1, e.current && (e.current.style.isolation = ""), T && (T.style.zIndex = ""), m && m.classList.remove(d), W && W.classList.remove(g), D.style.position = "", D.style.overflow = "", D.contains(w) && D.removeChild(w);
        };
        w.style.pointerEvents = "none", w.style.position = "absolute", w.style.overflow = "hidden", w.setAttribute("aria-hidden", "true");
        const I = us(w);
        I && (I.style.opacity = "0");
        const F = je(w);
        F && (F.classList.add(f ? r[q.caption_before_exit] : r[q.caption_after_exit]), F.addEventListener("animationend", E));
        const V = Re(w);
        V && V.classList.add(f ? r[q.weeks_before_exit] : r[q.weeks_after_exit]), D.insertBefore(w, D.firstChild);
      });
    }
  });
}
function ls(e, t, r, n) {
  const o = e[0], i = e[e.length - 1], { ISOWeek: a, fixedWeeks: s, broadcastCalendar: c } = r ?? {}, { addDays: u, differenceInCalendarDays: l, differenceInCalendarMonths: f, endOfBroadcastWeek: d, endOfISOWeek: g, endOfMonth: M, endOfWeek: C, isAfter: p, startOfBroadcastWeek: v, startOfISOWeek: T, startOfWeek: D } = n, O = c ? v(o, n) : a ? T(o) : D(o), w = c ? d(i) : a ? g(M(i)) : C(M(i)), m = t && (c ? d(t) : a ? g(t) : C(t)), W = m && p(w, m) ? m : w, E = l(W, O), I = f(i, o) + 1, F = [];
  for (let L = 0; L <= E; L++) {
    const R = u(O, L);
    F.push(R);
  }
  const re = (c ? 35 : 42) * I;
  if (s && F.length < re) {
    const L = re - F.length;
    for (let R = 0; R < L; R++) {
      const ie = u(F[F.length - 1], 1);
      F.push(ie);
    }
  }
  return F;
}
function ds(e) {
  const t = [];
  return e.reduce((r, n) => {
    const o = n.weeks.reduce((i, a) => i.concat(a.days.slice()), t.slice());
    return r.concat(o.slice());
  }, t.slice());
}
function hs(e, t, r, n) {
  const { numberOfMonths: o = 1 } = r, i = [];
  for (let a = 0; a < o; a++) {
    const s = n.addMonths(e, a);
    if (t && s > t)
      break;
    i.push(s);
  }
  return i;
}
function bt(e, t, r, n) {
  const { month: o, defaultMonth: i, today: a = n.today(), numberOfMonths: s = 1 } = e;
  let c = o || i || a;
  const { differenceInCalendarMonths: u, addMonths: l, startOfMonth: f } = n;
  if (r && u(r, c) < s - 1) {
    const d = -1 * (s - 1);
    c = l(r, d);
  }
  return t && u(c, t) < 0 && (c = t), f(c);
}
function ms(e, t, r, n) {
  const { addDays: o, endOfBroadcastWeek: i, endOfISOWeek: a, endOfMonth: s, endOfWeek: c, getISOWeek: u, getWeek: l, startOfBroadcastWeek: f, startOfISOWeek: d, startOfWeek: g } = n, M = e.reduce((C, p) => {
    const v = r.broadcastCalendar ? f(p, n) : r.ISOWeek ? d(p) : g(p), T = r.broadcastCalendar ? i(p) : r.ISOWeek ? a(s(p)) : c(s(p)), D = t.filter((W) => W >= v && W <= T), O = r.broadcastCalendar ? 35 : 42;
    if (r.fixedWeeks && D.length < O) {
      const W = t.filter((E) => {
        const I = O - D.length;
        return E > T && E <= o(T, I);
      });
      D.push(...W);
    }
    const w = D.reduce((W, E) => {
      const I = r.ISOWeek ? u(E) : l(E), F = W.find((re) => re.weekNumber === I), V = new Ht(E, p, n);
      return F ? F.days.push(V) : W.push(new co(I, [V])), W;
    }, []), m = new io(p, w);
    return C.push(m), C;
  }, []);
  return r.reverseMonths ? M.reverse() : M;
}
function ys(e, t) {
  let { startMonth: r, endMonth: n } = e;
  const { startOfYear: o, startOfDay: i, startOfMonth: a, endOfMonth: s, addYears: c, endOfYear: u, newDate: l, today: f } = t, { fromYear: d, toYear: g, fromMonth: M, toMonth: C } = e;
  !r && M && (r = M), !r && d && (r = t.newDate(d, 0, 1)), !n && C && (n = C), !n && g && (n = l(g, 11, 31));
  const p = e.captionLayout === "dropdown" || e.captionLayout === "dropdown-years";
  return r ? r = a(r) : d ? r = l(d, 0, 1) : !r && p && (r = o(c(e.today ?? f(), -100))), n ? n = s(n) : g ? n = l(g, 11, 31) : !n && p && (n = u(e.today ?? f())), [
    r && i(r),
    n && i(n)
  ];
}
function gs(e, t, r, n) {
  if (r.disableNavigation)
    return;
  const { pagedNavigation: o, numberOfMonths: i = 1 } = r, { startOfMonth: a, addMonths: s, differenceInCalendarMonths: c } = n, u = o ? i : 1, l = a(e);
  if (!t)
    return s(l, u);
  if (!(c(t, e) < i))
    return s(l, u);
}
function bs(e, t, r, n) {
  if (r.disableNavigation)
    return;
  const { pagedNavigation: o, numberOfMonths: i } = r, { startOfMonth: a, addMonths: s, differenceInCalendarMonths: c } = n, u = o ? i ?? 1 : 1, l = a(e);
  if (!t)
    return s(l, -u);
  if (!(c(l, t) <= 0))
    return s(l, -u);
}
function ws(e) {
  const t = [];
  return e.reduce((r, n) => r.concat(n.weeks.slice()), t.slice());
}
function Ye(e, t) {
  const [r, n] = Ce(e);
  return [t === void 0 ? r : t, n];
}
function Ms(e, t) {
  const [r, n] = ys(e, t), { startOfMonth: o, endOfMonth: i } = t, a = bt(e, r, n, t), [s, c] = Ye(
    a,
    // initialMonth is always computed from props.month if provided
    e.month ? a : void 0
  );
  Ot(() => {
    const O = bt(e, r, n, t);
    c(O);
  }, [e.timeZone]);
  const { months: u, weeks: l, days: f, previousMonth: d, nextMonth: g } = Se(() => {
    const O = hs(s, n, { numberOfMonths: e.numberOfMonths }, t), w = ls(O, e.endMonth ? i(e.endMonth) : void 0, {
      ISOWeek: e.ISOWeek,
      fixedWeeks: e.fixedWeeks,
      broadcastCalendar: e.broadcastCalendar
    }, t), m = ms(O, w, {
      broadcastCalendar: e.broadcastCalendar,
      fixedWeeks: e.fixedWeeks,
      ISOWeek: e.ISOWeek,
      reverseMonths: e.reverseMonths
    }, t), W = ws(m), E = ds(m), I = bs(s, r, e, t), F = gs(s, n, e, t);
    return {
      months: m,
      weeks: W,
      days: E,
      previousMonth: I,
      nextMonth: F
    };
  }, [
    t,
    s.getTime(),
    n?.getTime(),
    r?.getTime(),
    e.disableNavigation,
    e.broadcastCalendar,
    e.endMonth?.getTime(),
    e.fixedWeeks,
    e.ISOWeek,
    e.numberOfMonths,
    e.pagedNavigation,
    e.reverseMonths
  ]), { disableNavigation: M, onMonthChange: C } = e, p = (O) => l.some((w) => w.days.some((m) => m.isEqualTo(O))), v = (O) => {
    if (M)
      return;
    let w = o(O);
    r && w < o(r) && (w = o(r)), n && w > o(n) && (w = o(n)), c(w), C?.(w);
  };
  return {
    months: u,
    weeks: l,
    days: f,
    navStart: r,
    navEnd: n,
    previousMonth: d,
    nextMonth: g,
    goToMonth: v,
    goToDay: (O) => {
      p(O) || v(O.date);
    }
  };
}
var Z;
(function(e) {
  e[e.Today = 0] = "Today", e[e.Selected = 1] = "Selected", e[e.LastFocused = 2] = "LastFocused", e[e.FocusedModifier = 3] = "FocusedModifier";
})(Z || (Z = {}));
function wt(e) {
  return !e[_.disabled] && !e[_.hidden] && !e[_.outside];
}
function Ds(e, t, r, n) {
  let o, i = -1;
  for (const a of e) {
    const s = t(a);
    wt(s) && (s[_.focused] && i < Z.FocusedModifier ? (o = a, i = Z.FocusedModifier) : n?.isEqualTo(a) && i < Z.LastFocused ? (o = a, i = Z.LastFocused) : r(a.date) && i < Z.Selected ? (o = a, i = Z.Selected) : s[_.today] && i < Z.Today && (o = a, i = Z.Today));
  }
  return o || (o = e.find((a) => wt(t(a)))), o;
}
function ks(e, t, r, n, o, i, a) {
  const { ISOWeek: s, broadcastCalendar: c } = i, { addDays: u, addMonths: l, addWeeks: f, addYears: d, endOfBroadcastWeek: g, endOfISOWeek: M, endOfWeek: C, max: p, min: v, startOfBroadcastWeek: T, startOfISOWeek: D, startOfWeek: O } = a;
  let m = {
    day: u,
    week: f,
    month: l,
    year: d,
    startOfWeek: (W) => c ? T(W, a) : s ? D(W) : O(W),
    endOfWeek: (W) => c ? g(W) : s ? M(W) : C(W)
  }[e](r, t === "after" ? 1 : -1);
  return t === "before" && n ? m = p([n, m]) : t === "after" && o && (m = v([o, m])), m;
}
function Lt(e, t, r, n, o, i, a, s = 0) {
  if (s > 365)
    return;
  const c = ks(e, t, r.date, n, o, i, a), u = !!(i.disabled && ne(c, i.disabled, a)), l = !!(i.hidden && ne(c, i.hidden, a)), f = c, d = new Ht(c, f, a);
  return !u && !l ? d : Lt(e, t, d, n, o, i, a, s + 1);
}
function ps(e, t, r, n, o) {
  const { autoFocus: i } = e, [a, s] = Ce(), c = Ds(t.days, r, n || (() => !1), a), [u, l] = Ce(i ? c : void 0);
  return {
    isFocusTarget: (C) => !!c?.isEqualTo(C),
    setFocused: l,
    focused: u,
    blur: () => {
      s(u), l(void 0);
    },
    moveFocus: (C, p) => {
      if (!u)
        return;
      const v = Lt(C, p, u, t.navStart, t.navEnd, e, o);
      v && (e.disableNavigation && !t.days.some((D) => D.isEqualTo(v)) || (t.goToDay(v), l(v)));
    }
  };
}
function Os(e, t) {
  const { selected: r, required: n, onSelect: o } = e, [i, a] = Ye(r, o ? r : void 0), s = o ? r : i, { isSameDay: c } = t, u = (g) => s?.some((M) => c(M, g)) ?? !1, { min: l, max: f } = e;
  return {
    selected: s,
    select: (g, M, C) => {
      let p = [...s ?? []];
      if (u(g)) {
        if (s?.length === l || n && s?.length === 1)
          return;
        p = s?.filter((v) => !c(v, g));
      } else
        s?.length === f ? p = [g] : p = [...p, g];
      return o || a(p), o?.(p, g, M, C), p;
    },
    isSelected: u
  };
}
function en(e, t, r = 0, n = 0, o = !1, i = J) {
  const { from: a, to: s } = t || {}, { isSameDay: c, isAfter: u, isBefore: l } = i;
  let f;
  if (!a && !s)
    f = { from: e, to: r > 0 ? void 0 : e };
  else if (a && !s)
    c(a, e) ? r === 0 ? f = { from: a, to: e } : o ? f = { from: a, to: void 0 } : f = void 0 : l(e, a) ? f = { from: e, to: a } : f = { from: a, to: e };
  else if (a && s)
    if (c(a, e) && c(s, e))
      o ? f = { from: a, to: s } : f = void 0;
    else if (c(a, e))
      f = { from: a, to: r > 0 ? void 0 : e };
    else if (c(s, e))
      f = { from: e, to: r > 0 ? void 0 : e };
    else if (l(e, a))
      f = { from: e, to: s };
    else if (u(e, a))
      f = { from: a, to: e };
    else if (u(e, s))
      f = { from: a, to: e };
    else
      throw new Error("Invalid range");
  if (f?.from && f?.to) {
    const d = i.differenceInCalendarDays(f.to, f.from);
    n > 0 && d > n ? f = { from: e, to: void 0 } : r > 1 && d < r && (f = { from: e, to: void 0 });
  }
  return f;
}
function vs(e, t, r = J) {
  const n = Array.isArray(t) ? t : [t];
  let o = e.from;
  const i = r.differenceInCalendarDays(e.to, e.from), a = Math.min(i, 6);
  for (let s = 0; s <= a; s++) {
    if (n.includes(o.getDay()))
      return !0;
    o = r.addDays(o, 1);
  }
  return !1;
}
function Mt(e, t, r = J) {
  return te(e, t.from, !1, r) || te(e, t.to, !1, r) || te(t, e.from, !1, r) || te(t, e.to, !1, r);
}
function tn(e, t, r = J) {
  const n = Array.isArray(t) ? t : [t];
  if (n.filter((s) => typeof s != "function").some((s) => typeof s == "boolean" ? s : r.isDate(s) ? te(e, s, !1, r) : jt(s, r) ? s.some((c) => te(e, c, !1, r)) : Ne(s) ? s.from && s.to ? Mt(e, { from: s.from, to: s.to }, r) : !1 : qt(s) ? vs(e, s.dayOfWeek, r) : Ze(s) ? r.isAfter(s.before, s.after) ? Mt(e, {
    from: r.addDays(s.after, 1),
    to: r.addDays(s.before, -1)
  }, r) : ne(e.from, s, r) || ne(e.to, s, r) : Ke(s) || Je(s) ? ne(e.from, s, r) || ne(e.to, s, r) : !1))
    return !0;
  const a = n.filter((s) => typeof s == "function");
  if (a.length) {
    let s = e.from;
    const c = r.differenceInCalendarDays(e.to, e.from);
    for (let u = 0; u <= c; u++) {
      if (a.some((l) => l(s)))
        return !0;
      s = r.addDays(s, 1);
    }
  }
  return !1;
}
function Ws(e, t) {
  const { disabled: r, excludeDisabled: n, selected: o, required: i, onSelect: a } = e, [s, c] = Ye(o, a ? o : void 0), u = a ? o : s;
  return {
    selected: u,
    select: (d, g, M) => {
      const { min: C, max: p } = e, v = d ? en(d, u, C, p, i, t) : void 0;
      return n && r && v?.from && v.to && tn({ from: v.from, to: v.to }, r, t) && (v.from = d, v.to = void 0), a || c(v), a?.(v, d, g, M), v;
    },
    isSelected: (d) => u && te(u, d, !1, t)
  };
}
function Ss(e, t) {
  const { selected: r, required: n, onSelect: o } = e, [i, a] = Ye(r, o ? r : void 0), s = o ? r : i, { isSameDay: c } = t;
  return {
    selected: s,
    select: (f, d, g) => {
      let M = f;
      return !n && s && s && c(f, s) && (M = void 0), o || a(M), o?.(M, f, d, g), M;
    },
    isSelected: (f) => s ? c(s, f) : !1
  };
}
function Cs(e, t) {
  const r = Ss(e, t), n = Os(e, t), o = Ws(e, t);
  switch (e.mode) {
    case "single":
      return r;
    case "multiple":
      return n;
    case "range":
      return o;
    default:
      return;
  }
}
function $(e, t) {
  return e instanceof H && e.timeZone === t ? e : new H(e, t);
}
function ue(e, t, r) {
  return $(e, t);
}
function Dt(e, t, r) {
  return typeof e == "boolean" || typeof e == "function" ? e : e instanceof Date ? ue(e, t) : Array.isArray(e) ? e.map((n) => n instanceof Date ? ue(n, t) : n) : Ne(e) ? {
    ...e,
    from: e.from ? $(e.from, t) : e.from,
    to: e.to ? $(e.to, t) : e.to
  } : Ze(e) ? {
    before: ue(e.before, t),
    after: ue(e.after, t)
  } : Ke(e) ? {
    after: ue(e.after, t)
  } : Je(e) ? {
    before: ue(e.before, t)
  } : e;
}
function Ge(e, t, r) {
  return e && (Array.isArray(e) ? e.map((n) => Dt(n, t)) : Dt(e, t));
}
function kt(e) {
  let t = e;
  const r = t.timeZone;
  if (r && (t = {
    ...e,
    timeZone: r
  }, t.today && (t.today = $(t.today, r)), t.month && (t.month = $(t.month, r)), t.defaultMonth && (t.defaultMonth = $(t.defaultMonth, r)), t.startMonth && (t.startMonth = $(t.startMonth, r)), t.endMonth && (t.endMonth = $(t.endMonth, r)), t.mode === "single" && t.selected ? t.selected = $(t.selected, r) : t.mode === "multiple" && t.selected ? t.selected = t.selected?.map((k) => $(k, r)) : t.mode === "range" && t.selected && (t.selected = {
    from: t.selected.from ? $(t.selected.from, r) : t.selected.from,
    to: t.selected.to ? $(t.selected.to, r) : t.selected.to
  }), t.disabled !== void 0 && (t.disabled = Ge(t.disabled, r)), t.hidden !== void 0 && (t.hidden = Ge(t.hidden, r)), t.modifiers)) {
    const k = {};
    Object.keys(t.modifiers).forEach((Y) => {
      k[Y] = Ge(t.modifiers?.[Y], r);
    }), t.modifiers = k;
  }
  const { components: n, formatters: o, labels: i, dateLib: a, locale: s, classNames: c } = Se(() => {
    const k = { ...It, ...t.locale }, Y = t.broadcastCalendar ? 1 : t.weekStartsOn, b = t.noonSafe && t.timeZone ? as(t.timeZone, {
      weekStartsOn: Y,
      locale: k
    }) : void 0, N = t.dateLib && b ? { ...b, ...t.dateLib } : t.dateLib ?? b, A = new j({
      locale: k,
      weekStartsOn: Y,
      firstWeekContainsDate: t.firstWeekContainsDate,
      useAdditionalWeekYearTokens: t.useAdditionalWeekYearTokens,
      useAdditionalDayOfYearTokens: t.useAdditionalDayOfYearTokens,
      timeZone: t.timeZone,
      numerals: t.numerals
    }, N);
    return {
      dateLib: A,
      components: Ao(t.components),
      formatters: Zo(t.formatters),
      labels: ts(t.labels, A.options),
      locale: k,
      classNames: { ...jo(), ...t.classNames }
    };
  }, [
    t.locale,
    t.broadcastCalendar,
    t.weekStartsOn,
    t.firstWeekContainsDate,
    t.useAdditionalWeekYearTokens,
    t.useAdditionalDayOfYearTokens,
    t.timeZone,
    t.numerals,
    t.dateLib,
    t.noonSafe,
    t.components,
    t.formatters,
    t.labels,
    t.classNames
  ]);
  t.today || (t = { ...t, today: a.today() });
  const { captionLayout: u, mode: l, navLayout: f, numberOfMonths: d = 1, onDayBlur: g, onDayClick: M, onDayFocus: C, onDayKeyDown: p, onDayMouseEnter: v, onDayMouseLeave: T, onNextClick: D, onPrevClick: O, showWeekNumber: w, styles: m } = t, { formatCaption: W, formatDay: E, formatMonthDropdown: I, formatWeekNumber: F, formatWeekNumberHeader: V, formatWeekdayName: re, formatYearDropdown: L } = o, R = Ms(t, a), { days: ie, months: pe, navStart: Te, navEnd: xe, previousMonth: z, nextMonth: Q, goToMonth: ee } = R, Pe = Io(ie, t, Te, xe, a), { isSelected: Ee, select: _e, selected: Oe } = Cs(t, a) ?? {}, { blur: tt, focused: nt, isFocusTarget: nn, moveFocus: rt, setFocused: ve } = ps(t, R, Pe, Ee ?? (() => !1), a), { labelDayButton: rn, labelGridcell: on, labelGrid: sn, labelMonthDropdown: an, labelNav: ot, labelPrevious: cn, labelNext: un, labelWeekday: fn, labelWeekNumber: ln, labelWeekNumberHeader: dn, labelYearDropdown: hn } = i, mn = Se(() => os(a, t.ISOWeek, t.broadcastCalendar, t.today), [a, t.ISOWeek, t.broadcastCalendar, t.today]), st = l !== void 0 || M !== void 0, Fe = G(() => {
    z && (ee(z), O?.(z));
  }, [z, ee, O]), Be = G(() => {
    Q && (ee(Q), D?.(Q));
  }, [ee, Q, D]), yn = G((k, Y) => (b) => {
    b.preventDefault(), b.stopPropagation(), ve(k), !Y.disabled && (_e?.(k.date, Y, b), M?.(k.date, Y, b));
  }, [_e, M, ve]), gn = G((k, Y) => (b) => {
    ve(k), C?.(k.date, Y, b);
  }, [C, ve]), bn = G((k, Y) => (b) => {
    tt(), g?.(k.date, Y, b);
  }, [tt, g]), wn = G((k, Y) => (b) => {
    const N = {
      ArrowLeft: [
        b.shiftKey ? "month" : "day",
        t.dir === "rtl" ? "after" : "before"
      ],
      ArrowRight: [
        b.shiftKey ? "month" : "day",
        t.dir === "rtl" ? "before" : "after"
      ],
      ArrowDown: [b.shiftKey ? "year" : "week", "after"],
      ArrowUp: [b.shiftKey ? "year" : "week", "before"],
      PageUp: [b.shiftKey ? "year" : "month", "before"],
      PageDown: [b.shiftKey ? "year" : "month", "after"],
      Home: ["startOfWeek", "before"],
      End: ["endOfWeek", "after"]
    };
    if (N[b.key]) {
      b.preventDefault(), b.stopPropagation();
      const [A, S] = N[b.key];
      rt(A, S);
    }
    p?.(k.date, Y, b);
  }, [rt, p, t.dir]), Mn = G((k, Y) => (b) => {
    v?.(k.date, Y, b);
  }, [v]), Dn = G((k, Y) => (b) => {
    T?.(k.date, Y, b);
  }, [T]), kn = G((k) => (Y) => {
    const b = Number(Y.target.value), N = a.setMonth(a.startOfMonth(k), b);
    ee(N);
  }, [a, ee]), pn = G((k) => (Y) => {
    const b = Number(Y.target.value), N = a.setYear(a.startOfMonth(k), b);
    ee(N);
  }, [a, ee]), { className: On, style: vn } = Se(() => ({
    className: [c[y.Root], t.className].filter(Boolean).join(" "),
    style: { ...m?.[y.Root], ...t.style }
  }), [c, t.className, t.style, m]), Wn = qo(t), at = We(null);
  fs(at, !!t.animate, {
    classNames: c,
    months: pe,
    focused: nt,
    dateLib: a
  });
  const Sn = {
    dayPickerProps: t,
    selected: Oe,
    select: _e,
    isSelected: Ee,
    months: pe,
    nextMonth: Q,
    previousMonth: z,
    goToMonth: ee,
    getModifiers: Pe,
    components: n,
    classNames: c,
    styles: m,
    labels: i,
    formatters: o
  };
  return h.createElement(
    At.Provider,
    { value: Sn },
    h.createElement(
      n.Root,
      { rootRef: t.animate ? at : void 0, className: On, style: vn, dir: t.dir, id: t.id, lang: t.lang, nonce: t.nonce, title: t.title, role: t.role, "aria-label": t["aria-label"], "aria-labelledby": t["aria-labelledby"], ...Wn },
      h.createElement(
        n.Months,
        { className: c[y.Months], style: m?.[y.Months] },
        !t.hideNavigation && !f && h.createElement(n.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: c[y.Nav], style: m?.[y.Nav], "aria-label": ot(), onPreviousClick: Fe, onNextClick: Be, previousMonth: z, nextMonth: Q }),
        pe.map((k, Y) => h.createElement(
          n.Month,
          {
            "data-animated-month": t.animate ? "true" : void 0,
            className: c[y.Month],
            style: m?.[y.Month],
            // biome-ignore lint/suspicious/noArrayIndexKey: breaks animation
            key: Y,
            displayIndex: Y,
            calendarMonth: k
          },
          f === "around" && !t.hideNavigation && Y === 0 && h.createElement(
            n.PreviousMonthButton,
            { type: "button", className: c[y.PreviousMonthButton], tabIndex: z ? void 0 : -1, "aria-disabled": z ? void 0 : !0, "aria-label": cn(z), onClick: Fe, "data-animated-button": t.animate ? "true" : void 0 },
            h.createElement(n.Chevron, { disabled: z ? void 0 : !0, className: c[y.Chevron], orientation: t.dir === "rtl" ? "right" : "left" })
          ),
          h.createElement(n.MonthCaption, { "data-animated-caption": t.animate ? "true" : void 0, className: c[y.MonthCaption], style: m?.[y.MonthCaption], calendarMonth: k, displayIndex: Y }, u?.startsWith("dropdown") ? h.createElement(
            n.DropdownNav,
            { className: c[y.Dropdowns], style: m?.[y.Dropdowns] },
            (() => {
              const b = u === "dropdown" || u === "dropdown-months" ? h.createElement(n.MonthsDropdown, { key: "month", className: c[y.MonthsDropdown], "aria-label": an(), classNames: c, components: n, disabled: !!t.disableNavigation, onChange: kn(k.date), options: ns(k.date, Te, xe, o, a), style: m?.[y.Dropdown], value: a.getMonth(k.date) }) : h.createElement("span", { key: "month" }, I(k.date, a)), N = u === "dropdown" || u === "dropdown-years" ? h.createElement(n.YearsDropdown, { key: "year", className: c[y.YearsDropdown], "aria-label": hn(a.options), classNames: c, components: n, disabled: !!t.disableNavigation, onChange: pn(k.date), options: ss(Te, xe, o, a, !!t.reverseYears), style: m?.[y.Dropdown], value: a.getYear(k.date) }) : h.createElement("span", { key: "year" }, L(k.date, a));
              return a.getMonthYearOrder() === "year-first" ? [N, b] : [b, N];
            })(),
            h.createElement("span", { role: "status", "aria-live": "polite", style: {
              border: 0,
              clip: "rect(0 0 0 0)",
              height: "1px",
              margin: "-1px",
              overflow: "hidden",
              padding: 0,
              position: "absolute",
              width: "1px",
              whiteSpace: "nowrap",
              wordWrap: "normal"
            } }, W(k.date, a.options, a))
          ) : h.createElement(n.CaptionLabel, { className: c[y.CaptionLabel], role: "status", "aria-live": "polite" }, W(k.date, a.options, a))),
          f === "around" && !t.hideNavigation && Y === d - 1 && h.createElement(
            n.NextMonthButton,
            { type: "button", className: c[y.NextMonthButton], tabIndex: Q ? void 0 : -1, "aria-disabled": Q ? void 0 : !0, "aria-label": un(Q), onClick: Be, "data-animated-button": t.animate ? "true" : void 0 },
            h.createElement(n.Chevron, { disabled: Q ? void 0 : !0, className: c[y.Chevron], orientation: t.dir === "rtl" ? "left" : "right" })
          ),
          Y === d - 1 && f === "after" && !t.hideNavigation && h.createElement(n.Nav, { "data-animated-nav": t.animate ? "true" : void 0, className: c[y.Nav], style: m?.[y.Nav], "aria-label": ot(), onPreviousClick: Fe, onNextClick: Be, previousMonth: z, nextMonth: Q }),
          h.createElement(
            n.MonthGrid,
            { role: "grid", "aria-multiselectable": l === "multiple" || l === "range", "aria-label": sn(k.date, a.options, a) || void 0, className: c[y.MonthGrid], style: m?.[y.MonthGrid] },
            !t.hideWeekdays && h.createElement(
              n.Weekdays,
              { "data-animated-weekdays": t.animate ? "true" : void 0, className: c[y.Weekdays], style: m?.[y.Weekdays] },
              w && h.createElement(n.WeekNumberHeader, { "aria-label": dn(a.options), className: c[y.WeekNumberHeader], style: m?.[y.WeekNumberHeader], scope: "col" }, V()),
              mn.map((b) => h.createElement(n.Weekday, { "aria-label": fn(b, a.options, a), className: c[y.Weekday], key: String(b), style: m?.[y.Weekday], scope: "col" }, re(b, a.options, a)))
            ),
            h.createElement(n.Weeks, { "data-animated-weeks": t.animate ? "true" : void 0, className: c[y.Weeks], style: m?.[y.Weeks] }, k.weeks.map((b) => h.createElement(
              n.Week,
              { className: c[y.Week], key: b.weekNumber, style: m?.[y.Week], week: b },
              w && h.createElement(n.WeekNumber, { week: b, style: m?.[y.WeekNumber], "aria-label": ln(b.weekNumber, {
                locale: s
              }), className: c[y.WeekNumber], scope: "row", role: "rowheader" }, F(b.weekNumber, a)),
              b.days.map((N) => {
                const { date: A } = N, S = Pe(N);
                if (S[_.focused] = !S.hidden && !!nt?.isEqualTo(N), S[X.selected] = Ee?.(A) || S.selected, Ne(Oe)) {
                  const { from: Ie, to: He } = Oe;
                  S[X.range_start] = !!(Ie && He && a.isSameDay(A, Ie)), S[X.range_end] = !!(Ie && He && a.isSameDay(A, He)), S[X.range_middle] = te(Oe, A, !0, a);
                }
                const Cn = rs(S, m, t.modifiersStyles), Nn = Ho(S, c, t.modifiersClassNames), Yn = !st && !S.hidden ? on(A, S, a.options, a) : void 0;
                return h.createElement(n.Day, { key: `${N.isoDate}_${N.displayMonthId}`, day: N, modifiers: S, className: Nn.join(" "), style: Cn, role: "gridcell", "aria-selected": S.selected || void 0, "aria-label": Yn, "data-day": N.isoDate, "data-month": N.outside ? N.dateMonthId : void 0, "data-selected": S.selected || void 0, "data-disabled": S.disabled || void 0, "data-hidden": S.hidden || void 0, "data-outside": N.outside || void 0, "data-focused": S.focused || void 0, "data-today": S.today || void 0 }, !S.hidden && st ? h.createElement(n.DayButton, { className: c[y.DayButton], style: m?.[y.DayButton], type: "button", day: N, modifiers: S, disabled: !S.focused && S.disabled || void 0, "aria-disabled": S.focused && S.disabled || void 0, tabIndex: nn(N) ? 0 : -1, "aria-label": rn(A, S, a.options, a), onClick: yn(N, S), onBlur: bn(N, S), onFocus: gn(N, S), onKeyDown: wn(N, S), onMouseEnter: Mn(N, S), onMouseLeave: Dn(N, S) }, E(A, a.options, a)) : !S.hidden && E(N.date, a.options, a));
              })
            )))
          )
        ))
      ),
      t.footer && h.createElement(n.Footer, { className: c[y.Footer], style: m?.[y.Footer], role: "status", "aria-live": "polite" }, t.footer)
    )
  );
}
const pt = ({ orientation: e, ...t }) => /* @__PURE__ */ $e(e === "left" ? Tn : xn, { size: 16, ...t });
function Qe(e) {
  return e.mode === "range";
}
function Ns(e) {
  return Qe(e) && e.rangeSelectionBehavior === "restart";
}
function Ys(e, t, r) {
  let n;
  return !t?.from && !t?.to ? n = { from: e, to: void 0 } : t?.from && t.to ? n = { from: e, to: void 0 } : n = en(
    e,
    t,
    r.min,
    r.max,
    !!r.required
  ), r.excludeDisabled && r.disabled && n?.from && n.to && tn(
    { from: n.from, to: n.to },
    r.disabled
  ) && (n = { from: e, to: void 0 }), n;
}
function Ts({
  className: e,
  classNames: t,
  onChange: r,
  ...n
}) {
  const o = Qe(n) ? n.selected : void 0, i = Qe(n) && !r, [a, s] = Ce(
    o
  );
  if (Ot(() => {
    i && s(o);
  }, [o, i]), Ns(n)) {
    const c = r ? o : a, u = r;
    return /* @__PURE__ */ $e(
      kt,
      {
        showOutsideDays: !0,
        animate: !0,
        ...n,
        selected: c,
        onSelect: (l, f, d, g) => {
          const M = Ys(
            f,
            c,
            n
          );
          r || s(M), u?.(M, f, d, g), M?.from && M.to && n.onRangeComplete?.(M);
        },
        classNames: {
          ...t,
          root: it(
            "rdp-root select-none rounded-xl bg-kumo-base",
            t?.root,
            e
          )
        },
        components: {
          Chevron: pt,
          ...n.components
        }
      }
    );
  }
  return /* @__PURE__ */ $e(
    kt,
    {
      showOutsideDays: !0,
      animate: !0,
      ...n,
      onSelect: r,
      classNames: {
        ...t,
        root: it(
          "rdp-root select-none rounded-xl bg-kumo-base",
          t?.root,
          e
        )
      },
      components: {
        Chevron: pt,
        ...n.components
      }
    }
  );
}
Ts.displayName = "DatePicker";
export {
  Ts as D
};
