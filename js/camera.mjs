/* eslint-disable require-jsdoc */
import {isNullOrUndefined} from './utils/misc.mjs';

class Camera {
  constructor(followedEntity, width, height) {
    let _width = width;
    let _height = height;
    let _entity = followedEntity;
    let _posX = 0;
    let _posY = 0;

    this.getWidth = () => _width;
    this.getHeight = () => _height;
    this.getEntity = () => _entity;
    this.getPosition = () => {
      return {x: _posX, y: _posY};
    };

    this.onUpdate = (dt) => {
      const physics = _entity.getComponentByType('Physics');
      if (isNullOrUndefined(physics)) {
        console.error('No physics on entity!');
        return;
      }

      const position = physics.Position;
      if (isNullOrUndefined(position)) {
        console.error('No position for entity');
        return;
      }

      const size = physics.Size;
      if (isNullOrUndefined(size)) {
        console.error('No size for entity');
        return;
      }

      _posX = Math.floor(position.x + size.x - _width/2);
      _posY = Math.floor(position.y + size.y - _height/2);
    };
  }
};

export default Camera;
