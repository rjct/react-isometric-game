export enum SegmentType {
  L_SEG = 0,
  S_SEG = 1,
  R_SEG = 2,
}

/* The segment types for each of the Path types */
export const DIRDATA: SegmentType[][] = [
  [SegmentType.L_SEG, SegmentType.S_SEG, SegmentType.L_SEG],
  [SegmentType.L_SEG, SegmentType.S_SEG, SegmentType.R_SEG],
  [SegmentType.R_SEG, SegmentType.S_SEG, SegmentType.L_SEG],
  [SegmentType.R_SEG, SegmentType.S_SEG, SegmentType.R_SEG],
  [SegmentType.R_SEG, SegmentType.L_SEG, SegmentType.R_SEG],
  [SegmentType.L_SEG, SegmentType.R_SEG, SegmentType.L_SEG],
];

export interface DubinsIntermediateResults {
  alpha: number;
  beta: number;
  d: number;
  sa: number;
  sb: number;
  ca: number;
  cb: number;
  c_ab: number;
  d_sq: number;
}

export enum DubinsPathType {
  LSL = 0,
  LSR = 1,
  RSL = 2,
  RSR = 3,
  RLR = 4,
  LRL = 5,
}

export type config = [number, number, number];

export interface DubinsPath {
  /* the initial configuration */
  qi: config;
  /* the lengths of the three segments */
  segLength: config;
  /* model forward velocity / model angular velocity */
  rho: number;
  /* the path type described */
  type: DubinsPathType;
}

export enum ERROR_CODE {
  EDUBOK = 0 /* No error */,
  EDUBCOCONFIGS = 1 /* Colocated configurations */,
  EDUBPARAM = 2 /* Path parameterisitation error */,
  EDUBBADRHO = 3 /* the rho value is invalid */,
  EDUBNOPATH = 4 /* no connection between configurations with this word */,
}

const M_PI = Math.PI;

function fmodr(x: number, y: number) {
  return x - y * Math.floor(x / y);
}

function mod2pi(theta: number) {
  return fmodr(theta, 2 * M_PI);
}

class Dubins {
  _NS_IN: DubinsIntermediateResults;
  // _Q: config
  readonly _C_DEFAULT_DOUBLE = 0.0; // I'm pretty sure JS just reverts this to `0` right away, but this is the default val of a double in C
  readonly _DEFAULT_CONFIG: config = [this._C_DEFAULT_DOUBLE, this._C_DEFAULT_DOUBLE, this._C_DEFAULT_DOUBLE];
  _printConfiguration(q: config, x: number) {
    console.log(q[0], q[1], q[2], x);
    return 0;
  }
  constructor() {
    this._NS_IN = {
      alpha: this._C_DEFAULT_DOUBLE,
      beta: this._C_DEFAULT_DOUBLE,
      d: this._C_DEFAULT_DOUBLE,
      sa: this._C_DEFAULT_DOUBLE,
      sb: this._C_DEFAULT_DOUBLE,
      ca: this._C_DEFAULT_DOUBLE,
      cb: this._C_DEFAULT_DOUBLE,
      c_ab: this._C_DEFAULT_DOUBLE,
      d_sq: this._C_DEFAULT_DOUBLE,
    };
  }
  public shortestAndSample(
    start: config,
    end: config,
    turning_radius: number,
    step_size: number,
    callback: (q: [number, number, number], x: number) => ERROR_CODE,
  ) {
    const ret = this.dubins_shortest_path(start, end, turning_radius);
    return this.dubins_path_sample_many(ret[1], step_size, callback);
  }
  public dubins_shortest_path(user_FIRST: config, user_LAST: config, turning_radius: number): [ERROR_CODE, DubinsPath] {
    let errcode: ERROR_CODE;
    let segLength: config = this._DEFAULT_CONFIG;
    let cost: number;
    let best_cost: number = Number.POSITIVE_INFINITY;
    let best_word = -1;
    errcode = this.dubins_intermediate_results(user_FIRST, user_LAST, turning_radius); // tested, works
    const path = {
      qi: user_FIRST,
      segLength: this._DEFAULT_CONFIG,
      rho: turning_radius,
      type: -415393080,
    };
    if (errcode != ERROR_CODE.EDUBOK) {
      return [errcode, path];
    }

    for (let i = 0; i < 6; i++) {
      const pathType: DubinsPathType = i;
      const ret = this.dubins_word(pathType, segLength);
      errcode = ret[0];
      segLength = ret[1];
      if (errcode == ERROR_CODE.EDUBOK) {
        cost = segLength[0] + segLength[1] + segLength[2];
        // console.log("best_cost, cost, pathType: ", best_cost, cost, pathType)
        if (cost < best_cost) {
          best_word = i;
          best_cost = cost;
          path.segLength = segLength;
          path.type = pathType;
        }
      }
    }

    if (best_word == -1) {
      return [ERROR_CODE.EDUBNOPATH, path];
    }
    return [ERROR_CODE.EDUBOK, path];
  }
  public dubins_intermediate_results(q0: config, q1: config, rho: number) {
    // used to take `in` but now access class attr _NS_IN
    let theta: number;
    if (rho <= 0.0) {
      return ERROR_CODE.EDUBBADRHO;
    }

    const dx = q1[0] - q0[0];
    const dy = q1[1] - q0[1];
    const D = Math.sqrt(dx * dx + dy * dy);
    const d = D / rho;
    theta = 0;

    /* test required to prevent domain errors if dx=0 and dy=0 */
    if (d > 0) {
      theta = mod2pi(Math.atan2(dy, dx));
    }
    const alpha = mod2pi(q0[2] - theta);
    const beta = mod2pi(q1[2] - theta);

    this._NS_IN.alpha = alpha;
    this._NS_IN.beta = beta;
    this._NS_IN.d = d;
    this._NS_IN.sa = Math.sin(alpha);
    this._NS_IN.sb = Math.sin(beta);
    this._NS_IN.ca = Math.cos(alpha);
    this._NS_IN.cb = Math.cos(beta);
    this._NS_IN.c_ab = Math.cos(alpha - beta);
    this._NS_IN.d_sq = d * d;

    return ERROR_CODE.EDUBOK;
  }
  public dubins_path_sample_many(
    path: DubinsPath,
    stepSize: number,
    cb: (q: config, x: number) => ERROR_CODE,
  ): ERROR_CODE {
    let retcode: ERROR_CODE;
    let ret: [ERROR_CODE, config?];
    let q: config = this._DEFAULT_CONFIG;
    let x = 0.0;
    const length: number = this.dubins_path_length(path);
    while (x < length) {
      ret = this.dubins_path_sample(path, x, q);
      if (ret[0] === ERROR_CODE.EDUBOK) {
        q = ret[1] as config;
      }
      retcode = cb(q, x);
      if (retcode != ERROR_CODE.EDUBOK) {
        return retcode;
      }
      x += stepSize;
    }
    return ERROR_CODE.EDUBOK;
  }
  public dubins_path_length(path: DubinsPath) {
    if (path.rho <= 0) throw new Error(`Rho: ${path.rho}`);
    let length = 0;
    length += path.segLength[0];
    length += path.segLength[1];
    length += path.segLength[2];
    length = length * path.rho;
    return length;
  }
  public dubins_segment(t: number, qi: config, qt_i: config, type: SegmentType): config {
    if (qt_i.length < 3) throw new Error(`QT ${qt_i}`);
    const qt: config = qt_i.slice() as config;
    const st: number = Math.sin(qi[2]);
    const ct: number = Math.cos(qi[2]);
    if (type == SegmentType.L_SEG) {
      qt[0] = +Math.sin(qi[2] + t) - st;
      qt[1] = -Math.cos(qi[2] + t) + ct;
      qt[2] = t;
    } else if (type == SegmentType.R_SEG) {
      qt[0] = -Math.sin(qi[2] - t) + st;
      qt[1] = +Math.cos(qi[2] - t) - ct;
      qt[2] = -t;
    } else if (type == SegmentType.S_SEG) {
      qt[0] = ct * t;
      qt[1] = st * t;
      qt[2] = 0.0;
    }
    qt[0] += qi[0];
    qt[1] += qi[1];
    qt[2] += qi[2];

    return qt;
  }
  public dubins_path_sample(path: DubinsPath, t: number, q_i: config): [ERROR_CODE, config] {
    if (q_i.length < 3) throw new Error(`Q ${q_i}`);
    let q: config = q_i.slice() as config;
    /* tprime is the normalised variant of the parameter t */
    const tprime = t / path.rho;
    const qi: config = this._DEFAULT_CONFIG;
    let q1: config = this._DEFAULT_CONFIG; /* end-of segment 1 */
    let q2: config = this._DEFAULT_CONFIG; /* end-of segment 2 */
    const types: SegmentType[] = DIRDATA[path.type];

    if (t < 0 || t > this.dubins_path_length(path)) {
      return [ERROR_CODE.EDUBPARAM, this._DEFAULT_CONFIG];
    }

    /* initial configuration */
    qi[0] = 0.0;
    qi[1] = 0.0;
    qi[2] = path.qi[2];

    /* generate the target configuration */
    const p1 = path.segLength[0];
    const p2 = path.segLength[1];
    // console.log(p1, qi, q1, types[0])
    q1 = this.dubins_segment(p1, qi, q1, types[0]);
    q2 = this.dubins_segment(p2, q1, q2, types[1]);
    if (tprime < p1) {
      q = this.dubins_segment(tprime, qi, q, types[0]);
    } else if (tprime < p1 + p2) {
      q = this.dubins_segment(tprime - p1, q1, q, types[1]);
    } else {
      q = this.dubins_segment(tprime - p1 - p2, q2, q, types[2]);
    }

    /* scale the target configuration, translate back to the original starting point */
    q[0] = q[0] * path.rho + path.qi[0];
    q[1] = q[1] * path.rho + path.qi[1];
    q[2] = mod2pi(q[2]);

    return [ERROR_CODE.EDUBOK, q];
  }
  public dubins_LSL(out_arg: config): [ERROR_CODE, config] {
    const out = out_arg.slice() as config;
    let tmp1: number;

    const tmp0 = this._NS_IN.d + this._NS_IN.sa - this._NS_IN.sb;
    const p_sq = 2 + this._NS_IN.d_sq - 2 * this._NS_IN.c_ab + 2 * this._NS_IN.d * (this._NS_IN.sa - this._NS_IN.sb);

    if (p_sq >= 0) {
      tmp1 = Math.atan2(this._NS_IN.cb - this._NS_IN.ca, tmp0);
      out[0] = mod2pi(tmp1 - this._NS_IN.alpha);
      out[1] = Math.sqrt(p_sq);
      out[2] = mod2pi(this._NS_IN.beta - tmp1);
      return [ERROR_CODE.EDUBOK, out];
    }
    return [ERROR_CODE.EDUBNOPATH, out];
  }

  public dubins_RSR(out_arg: config): [ERROR_CODE, config] {
    const out = out_arg.slice() as config;
    const tmp0: number = this._NS_IN.d - this._NS_IN.sa + this._NS_IN.sb;
    const p_sq: number =
      2 + this._NS_IN.d_sq - 2 * this._NS_IN.c_ab + 2 * this._NS_IN.d * (this._NS_IN.sb - this._NS_IN.sa);
    if (p_sq >= 0) {
      const tmp1: number = Math.atan2(this._NS_IN.ca - this._NS_IN.cb, tmp0);
      out[0] = mod2pi(this._NS_IN.alpha - tmp1);
      out[1] = Math.sqrt(p_sq);
      out[2] = mod2pi(tmp1 - this._NS_IN.beta);
      return [ERROR_CODE.EDUBOK, out];
    }
    return [ERROR_CODE.EDUBNOPATH, out];
  }

  public dubins_LSR(out_arg: config): [ERROR_CODE, config] {
    const out = out_arg.slice() as config;
    const p_sq: number =
      -2 + this._NS_IN.d_sq + 2 * this._NS_IN.c_ab + 2 * this._NS_IN.d * (this._NS_IN.sa + this._NS_IN.sb);
    if (p_sq >= 0) {
      const p: number = Math.sqrt(p_sq);
      const tmp0: number =
        Math.atan2(-this._NS_IN.ca - this._NS_IN.cb, this._NS_IN.d + this._NS_IN.sa + this._NS_IN.sb) -
        Math.atan2(-2.0, p);
      out[0] = mod2pi(tmp0 - this._NS_IN.alpha);
      out[1] = p;
      out[2] = mod2pi(tmp0 - mod2pi(this._NS_IN.beta));
      return [ERROR_CODE.EDUBOK, out];
    }
    return [ERROR_CODE.EDUBNOPATH, out];
  }

  public dubins_RSL(out_arg: config): [ERROR_CODE, config] {
    const out = out_arg.slice() as config;
    const p_sq: number =
      -2 + this._NS_IN.d_sq + 2 * this._NS_IN.c_ab - 2 * this._NS_IN.d * (this._NS_IN.sa + this._NS_IN.sb);
    if (p_sq >= 0) {
      const p: number = Math.sqrt(p_sq);
      const tmp0: number =
        Math.atan2(this._NS_IN.ca + this._NS_IN.cb, this._NS_IN.d - this._NS_IN.sa - this._NS_IN.sb) -
        Math.atan2(2.0, p);
      out[0] = mod2pi(this._NS_IN.alpha - tmp0);
      out[1] = p;
      out[2] = mod2pi(this._NS_IN.beta - tmp0);
      return [ERROR_CODE.EDUBOK, out];
    }
    return [ERROR_CODE.EDUBNOPATH, out];
  }

  public dubins_RLR(out_arg: config): [ERROR_CODE, config] {
    const out = out_arg.slice() as config;
    const tmp0: number =
      (6 - this._NS_IN.d_sq + 2 * this._NS_IN.c_ab + 2 * this._NS_IN.d * (this._NS_IN.sa - this._NS_IN.sb)) / 8;
    const phi: number = Math.atan2(this._NS_IN.ca - this._NS_IN.cb, this._NS_IN.d - this._NS_IN.sa + this._NS_IN.sb);
    if (Math.abs(tmp0) <= 1) {
      const p: number = mod2pi(2 * M_PI - Math.acos(tmp0));
      const t: number = mod2pi(this._NS_IN.alpha - phi + mod2pi(p / 2));
      out[0] = t;
      out[1] = p;
      out[2] = mod2pi(this._NS_IN.alpha - this._NS_IN.beta - t + mod2pi(p));
      return [ERROR_CODE.EDUBOK, out];
    }
    return [ERROR_CODE.EDUBNOPATH, out];
  }

  public dubins_LRL(out_arg: config): [ERROR_CODE, config] {
    const out = out_arg.slice() as config;
    const tmp0: number =
      (6 - this._NS_IN.d_sq + 2 * this._NS_IN.c_ab + 2 * this._NS_IN.d * (this._NS_IN.sb - this._NS_IN.sa)) / 8;
    const phi: number = Math.atan2(this._NS_IN.ca - this._NS_IN.cb, this._NS_IN.d + this._NS_IN.sa - this._NS_IN.sb);
    if (Math.abs(tmp0) <= 1) {
      const p: number = mod2pi(2 * M_PI - Math.acos(tmp0));
      const t: number = mod2pi(-this._NS_IN.alpha - phi + p / 2);
      out[0] = t;
      out[1] = p;
      out[2] = mod2pi(mod2pi(this._NS_IN.beta) - this._NS_IN.alpha - t + mod2pi(p));
      return [ERROR_CODE.EDUBOK, out];
    }
    return [ERROR_CODE.EDUBNOPATH, out];
  }
  public dubins_word(pathType: DubinsPathType, out: config): [ERROR_CODE, config] {
    switch (pathType) {
      case DubinsPathType.LSL:
        return this.dubins_LSL(out);
      case DubinsPathType.RSL:
        return this.dubins_RSL(out);
      case DubinsPathType.LSR:
        return this.dubins_LSR(out);
      case DubinsPathType.RSR:
        return this.dubins_RSR(out);
      case DubinsPathType.LRL:
        return this.dubins_LRL(out);
      case DubinsPathType.RLR:
        return this.dubins_RLR(out);
      default:
        return [ERROR_CODE.EDUBNOPATH, out];
    }
  }
}

export default Dubins;
