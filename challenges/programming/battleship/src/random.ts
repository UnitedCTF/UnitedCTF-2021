export class Random {
  private _s1: number;
  private _s2: number;
  private _s3: number;

  constructor(s1?: number, s2?: number, s3?: number) {
    this._s1 = s1 || Date.now();
    this._s2 = s2 || Date.now();
    this._s3 = s3 || Date.now();
  }

  public next(): number {
    this._s1 = (171 * this._s1) % 30269;
    this._s2 = (172 * this._s2) % 30307;
    this._s3 = (170 * this._s3) % 30323;

    return (this._s1 / 30269 + this._s2 / 30307 + this._s3 / 30323) % 1;
  }

  public peek(): number {
    return (
      (((171 * this._s1) % 30269) / 30269 +
        ((172 * this._s2) % 30307) / 30307 +
        ((170 * this._s3) % 30323) / 30323) %
      1
    );
  }

  public nextRange(min: number, max: number) {
    return this.next() * (max - min) + min;
  }

  public roll(chance: number) {
    return this.next() < chance;
  }

  public pick<T>(items: T[]): T {
    return items[~~(this.next() * items.length)];
  }

  public get s1() {
    return this._s1;
  }

  public get s2() {
    return this._s2;
  }

  public get s3() {
    return this._s3;
  }
}
