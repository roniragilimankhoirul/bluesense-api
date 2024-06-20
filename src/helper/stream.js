import { Readable } from "stream";

export class BufferStream extends Readable {
  constructor(opts) {
    super(opts);
    this.buf = opts.buf;
    this.pos = 0;
  }

  _read(size) {
    if (this.pos >= this.buf.length) {
      this.push(null); // Signal end of stream
      return;
    }

    const chunk = this.buf.slice(this.pos, this.pos + size);
    this.push(chunk);
    this.pos += chunk.length;
  }
}
