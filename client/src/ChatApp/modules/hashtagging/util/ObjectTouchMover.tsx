import { action, observable } from "mobx";

export interface ITouchMoveControlee {
  getInitialCoords(): { x: number; y: number };
  setCoords(coords: { x: number; y: number; dx: number; dy: number }): void;
}

export interface IObjectTouchMover {
  handlePointerDown(event: any): void;
}

export class ObjectTouchMover implements IObjectTouchMover {
  constructor(public controlee: ITouchMoveControlee) {}

  @observable isMoving = false;
  screenX0 = 0;
  screenY0 = 0;
  coordsX0 = 0;
  coordsY0 = 0;

  @action.bound
  handlePointerDown(event: any) {
    event.preventDefault();
    event.target.setCapture?.();
    const screenX = event.screenX;
    const screenY = event.screenY;
    const initCoords = this.controlee.getInitialCoords();
    this.coordsX0 = initCoords.x;
    this.coordsY0 = initCoords.y;
    this.screenX0 = screenX;
    this.screenY0 = screenY;
    this.isMoving = true;
    window.addEventListener("mousemove", this.handlePointerMove);
    window.addEventListener("mouseup", this.handlePointerUp, true);
  }

  @action.bound
  handlePointerMove(event: any) {
    event.preventDefault();
    const screenX = event.screenX;
    const screenY = event.screenY;
    const dx = screenX - this.screenX0;
    const dy = screenY - this.screenY0;
    const x = this.coordsX0 + dx;
    const y = this.coordsY0 + dy;
    this.controlee.setCoords({ x, y, dx, dy });
  }

  @action.bound
  handlePointerUp(event: any) {
    this.isMoving = false;
    window.removeEventListener("mousemove", this.handlePointerMove);
    window.removeEventListener("mouseup", this.handlePointerUp);
  }
}
