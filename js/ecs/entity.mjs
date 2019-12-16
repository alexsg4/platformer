/* eslint-disable require-jsdoc */
import Vector2D from '../utils/math/vector2d.mjs';
import {isNullOrUndefined} from '../utils/misc.mjs';
import Component from './component.mjs';
import Unique from './unique.mjs';
import Sprite from '../sprite.mjs';

const ANIM_SPEED = 0.2;

class Entity extends Unique {
  constructor(pos, size, imgId) {
    super();
    this.position = pos instanceof Vector2D ? pos : new Vector2D();
    this.size = size instanceof Vector2D ? size : new Vector2D(1, 1);
    this.imgId = imgId;

    const position = this.position;
    const width = this.size.x;
    const height = this.size.y;

    this.collisionBox = {
      tLeft: {
        x: position.x - width/2,
        y: position.y - height/2,
      },
      tRight: {
        x: position.x + width/2,
        y: position.y - height/2,
      },
      bRight: {
        x: position.x + width/2,
        y: position.y + height/2,
      },
      bLeft: {
        x: position.x - width/2,
        y: position.y + height/2,
      },
    };

    this.sprite = new Sprite(
        this.imgId,
        this.position,
        this.size,
        ANIM_SPEED, true);
    this.components = new Map();

    return this;
  }

  attachComponents(...args) {
    const components = Array.from(args);

    for (const comp of components) {
      if (comp instanceof Component && !isNullOrUndefined(comp)) {
        this.components.set(comp.id, comp);
        comp.onAttach(this);
      }
    }
  }

  onUpdate(dt) {
    this.sprite.onUpdate(dt);

    for (const comp of this.components.values()) {
      comp.onUpdate(dt);
    }
  }

  onRender(ctx) {
    if (isNullOrUndefined(ctx)) {
      console.error('Entity onRender: Canvas context undefined!');
      return;
    }

    this.sprite.onRender(ctx);

    for (const comp of this.components.values()) {
      comp.onRender(ctx);
    }
  }
};

export default Entity;
