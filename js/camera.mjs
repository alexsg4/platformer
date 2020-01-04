/* eslint-disable require-jsdoc */
import {isNullOrUndefined, clamp} from './utils/misc.mjs';

class Camera {
  constructor(followedEntity, width, height, zoom, worldInfo) {
    const _width = width;
    const _height = height;
    const _entity = followedEntity;
    const _worldInfo = worldInfo;
    const _scale = zoom;
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

      _posX = Math.floor(position.x + size.x/2 - _width/(2*_scale));
      _posY = Math.floor(position.y + size.y/2 - _height/(2*_scale));

      const mapWidth = _worldInfo.tileSize * _worldInfo.mapSize.col;
      const mapHeight = _worldInfo.tileSize * _worldInfo.mapSize.row;

      // temp hack
      if (_width < mapWidth || _height < mapHeight) {
        _posX = clamp(_posX, 0, Math.min(mapWidth - _width / 2, _width / 2));
        _posY = clamp(_posY, 0, Math.max(mapHeight - _height, _height / 2));
      }
    };
  }
};

export default Camera;
