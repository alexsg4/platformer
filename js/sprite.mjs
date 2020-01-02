import {isNullOrUndefined} from './utils/misc.mjs';
import ResourceLoader from './utils/resource.mjs';

/* eslint-disable require-jsdoc */
class Sprite {
  constructor(pos, size, speed, imgId, loop = false) {
    this.pos = pos;
    this.size = size;
    this.speed = speed || 1;
    this.imgId = imgId;
    this.loop = loop;
    this.index = 0;

    return this;
  }

  onUpdate(dt) {
    this.index += this.speed * dt;

    const img = ResourceLoader.getImage(this.imgId);
    if (img !== undefined) {
      this.numFrames = {
        x: img.width / this.size.x,
        y: img.height / this.size.y};
    }
  }

  onRender(ctx) {
    if (isNullOrUndefined(ctx)) {
      console.error('Sprite onRender: render context does not exist!');
      return;
    }

    const totalFrames = this.numFrames.x * this.numFrames.y;
    let frame = 0;
    if (this.speed > 0) {
      frame = Math.floor(this.index % totalFrames);
      if (!this.loop && frame >= totalFrames) {
        this.done = true;
        return;
      }
    }

    // only traverse sprite matrix line by line
    if (this.imgId.includes('-flip')) {
      frame = totalFrames - frame - 1;
    }
    const x = frame % this.numFrames.x * this.size.x;
    let y = 0;
    if (frame >= this.numFrames.x) {
      y = Math.floor(frame / this.numFrames.y) * this.size.y;
    }

    const image = ResourceLoader.getImage(this.imgId);
    ctx.drawImage(
        image,
        x, y,
        this.size.x, this.size.y,
        Math.floor(this.pos.x), Math.floor(this.pos.y),
        this.size.x, this.size.y);
  }
}

export default Sprite;
