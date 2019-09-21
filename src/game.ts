/// --- Set up a system ---
import utils from "../node_modules/decentraland-ecs-utils/index";

/// --- Spawner function ---

function spawnCube(x: number, y: number, z: number) {
  // create the entity
  const cube = new Entity()

  // add a transform to the entity
  cube.addComponent(new Transform({ position: new Vector3(x, y, z) }))
  cube.getComponent(Transform).scale.set(0.1, 0.1, 0.01)

  // add a shape to the entity
  cube.addComponent(new BoxShape())

  // add the entity to the engine
  engine.addEntity(cube)

  return cube
}

export class SlotElement {
  private _startPos: Vector3;
  private _endPosition: Vector3;

  private _cube = new Entity();

  constructor(startPos: Vector3, endPosition: Vector3) {
    this._startPos = startPos;
    this._endPosition = endPosition;

    // add a transform to the entity
    this._cube.addComponent(new Transform({ position: new Vector3(this._startPos.x, this._startPos.y, this._startPos.z) }))
    this._cube.getComponent(Transform).scale.set(0.1, 0.1, 0.01)
    const that = this;


    const move = new utils.MoveTransformComponent(this._startPos, this._endPosition, 0.2, function() {
      that._cube.addComponent(new utils.ExpireIn(10))
      // let testElement = new SlotElement(new Vector3(2, 1, 2), new Vector3(2, 3, 2));
      // testElement.Spawn()
    }, utils.InterpolationType.EASEQUAD);
    // add a shape to the entity
    this._cube.addComponent(new BoxShape())

    this._cube.addComponent(new utils.ToggleComponent(utils.ToggleState.Off, value =>{
      if (value == utils.ToggleState.On){
        //set color to green

        this._cube.addComponent(move)

      }
      else{
        //set color to red
      }
    }))


  }




  Move() {
    this._cube.getComponent(utils.ToggleComponent).toggle()
  }


  Spawn() {
    // add the entity to the engine
    engine.addEntity(this._cube)
  }

}

const button = new Entity();
button.addComponent(new Transform({ position: new Vector3(2, 1.2, 2) }))
button.getComponent(Transform).scale.set(0.5, 0.5, 0.2)
button.addComponent(new BoxShape())
button.addComponent(
    new OnClick(() => {
      testElement.Move();
      testElement2.Move();
      testElement3.Move();
      testElement4.Move();
    })
)

//
// engine.addEntity(button);
const input = Input.instance
input.subscribe("BUTTON_DOWN", ActionButton.POINTER, false, e => {
  // testElement.Move();
  // testElement2.Move();
  // testElement3.Move();
  // testElement4.Move();
  startRound = true;

})

let testElement = new SlotElement(new Vector3(2, 2, 2), new Vector3(2, 1, 2));
let testElement2 = new SlotElement(new Vector3(2, 2.1, 2), new Vector3(2, 0.9, 2));
let testElement3 = new SlotElement(new Vector3(2, 2.2, 2), new Vector3(2, 0.8, 2));
let testElement4 = new SlotElement(new Vector3(2, 2.3, 2), new Vector3(2, 0.7, 2));

testElement.Spawn();
testElement2.Spawn();
testElement3.Spawn();


let startRound = false;

@Component("SlotMachineScreen")
export class SlotMachineScreen {}

let slotMachineScreen = new Entity();
slotMachineScreen.addComponent(new Transform({position: new Vector3(1, 1.3, 1)}))

let topBlock = new Entity();
topBlock.addComponent(new BoxShape());
topBlock.addComponent(new Transform({position: new Vector3(0, 0.54, 0)})).scale.set(1, 0.15, 0.06);

let rightBlock = new Entity();
rightBlock.addComponent(new BoxShape());
rightBlock.addComponent(new Transform({position: new Vector3(-0.45, 0.27, 0)})).scale.set(0.10, 0.4, 0.06);

let bottomBlock = new Entity();
bottomBlock.addComponent(new BoxShape());
bottomBlock.addComponent(new Transform({position: new Vector3(0, 0, 0)})).scale.set(1, 0.15, 0.06);

let leftBlock = new Entity();
leftBlock.addComponent(new BoxShape());
leftBlock.addComponent(new Transform({position: new Vector3(0.45, 0.27, 0)})).scale.set(0.10, 0.4, 0.06);

topBlock.setParent(slotMachineScreen);
rightBlock.setParent(slotMachineScreen);
bottomBlock.setParent(slotMachineScreen);
leftBlock.setParent(slotMachineScreen);


export class SpinBlock {

}

@Component("lerpData")
export class LerpData implements ISystem {
    origin: Vector3 = Vector3.Zero()
    target: Vector3 = Vector3.Zero()
    fraction: number = 0
}

export class LerpMove implements ISystem {

    private _cube: Entity // the type is a custom component
    private _transform;

    constructor(cubeComponent: Entity){
        this._cube = cubeComponent
        this._cube.getComponent(Transform).position.set(this._startPosition.x, this._startPosition.y, this._startPosition.z);
        this._transform = this._cube.getComponent(Transform)
    }

    private _speed = 1;
    private _counter = 0;
    private _rounds = 1;
    private _startPosition = new Vector3(0, 0.415,0);
    // private _startPosition2 = new Vector3(0.5, 0.415,0);
    private _endPosition = new Vector3(0, 0.015,0);

    update(dt: number) {
        if (startRound) {


            // let lerp = this._cube.getComponent(LerpData)
            // if (lerp.fraction < 1) {

            if (this._transform.position.y > this._endPosition.y && this._counter < this._rounds) {

                // if (lerp.fraction > 0.01 && this._counter == 1) {
                    // this._speed = 40;
                //}
                // if (lerp.fraction > 0.1 && this._counter == 1) {
                    // this._speed = 40;
                //}

                if ( this._counter == 2) {
                    // this._speed = 60;
                }

                // transform.position = Vector3.Lerp(
                //     lerp.origin,
                //     lerp.target,
                //     lerp.fraction
                // )
                // lerp.fraction += (0.03 / 50) * this._speed;
                this._transform.position = this._transform.position.add(new Vector3(0, -dt * this._speed, 0));
            } else if (this._startPosition.y - this._transform.position.y  < 0.01 && this._rounds == this._counter) {
                if  (this._transform.position.y - this._startPosition.y < dt* this._speed) {
                    this._transform.position.set(this._startPosition.x, this._startPosition.y, this._startPosition.z)
                    this._counter = 0;
                    startRound = false;
                } else {

                    this._transform.position = this._transform.position.add(new Vector3(0, -dt * this._speed, 0));
                }
            } else {

                this._transform.position = this._transform.position.set(0, 0.515, 0);

                // this._cube.getComponent(LerpData).origin.set(0, 0.42, 0);
                if (this._rounds == this._counter) {

                    // this._speed = 10;
                    //this._counter = 0;
                    //this._transform.position = this._startPosition;
                    //startRound = false;
                }
                this._counter++;


                // lerp.fraction = 0;
            }
        }
     }
}

const myMaterialA = new Material()
myMaterialA.albedoColor = Color3.Blue()
myMaterialA.metallic = 0.9
myMaterialA.roughness = 0.1

const myMaterialB = new Material()
myMaterialB.albedoColor = Color3.Yellow()
myMaterialB.metallic = 0.9
myMaterialB.roughness = 0.1

const myMaterialC = new Material()
myMaterialC.albedoColor = Color3.White()
myMaterialC.metallic = 0.9
myMaterialC.roughness = 0.1

const myMaterialD = new Material()
myMaterialD.albedoColor = Color3.Red()
myMaterialD.metallic = 0.9
myMaterialD.roughness = 0.1

const myMaterialE = new Material()
myMaterialD.albedoColor = Color3.Green()
myMaterialD.metallic = 0.9
myMaterialD.roughness = 0.1

const myMaterialF = new Material()
myMaterialD.albedoColor = Color3.Purple()
myMaterialD.metallic = 0.9
myMaterialD.roughness = 0.1

var cube = new Entity();
cube.addComponent(new Transform({ position: new Vector3(0, 0.515, 0) }))
cube.getComponent(Transform).scale.set(0.1, 0.1, 0.01)
cube.addComponent(new BoxShape());
cube.addComponent(new LerpData())
cube.addComponent(myMaterialA)
cube.getComponent(LerpData).origin = new Vector3(0, 0.52, 0)
cube.getComponent(LerpData).target = new Vector3(0, 0, 0)

// cube.setParent(slotMachineScreen)

var cube1 = new Entity();
cube1.addComponent(new Transform({ position: new Vector3(0, 0.415, 0) }))
cube1.getComponent(Transform).scale.set(0.1, 0.1, 0.01)
cube1.addComponent(new BoxShape());
cube1.addComponent(new LerpData())
cube1.addComponent(myMaterialB)
cube1.getComponent(LerpData).origin = new Vector3(0, 0.415, 0)
cube1.getComponent(LerpData).target = new Vector3(0, 0, 0)

cube1.setParent(slotMachineScreen)

var cube2 = new Entity();
cube2.addComponent(new Transform({ position: new Vector3(0, 0.315, 0) }))
cube2.getComponent(Transform).scale.set(0.1, 0.1, 0.01)
cube2.addComponent(new BoxShape());
cube2.addComponent(new LerpData())
cube2.addComponent(myMaterialC)
cube2.getComponent(LerpData).origin = new Vector3(0, 0.315, 0)
cube2.getComponent(LerpData).target = new Vector3(0, 0, 0)

// cube2.setParent(slotMachineScreen)

var cube3 = new Entity();
cube3.addComponent(new Transform({ position: new Vector3(0, 0.215, 0) }))
cube3.getComponent(Transform).scale.set(0.1, 0.1, 0.01)
cube3.addComponent(new BoxShape());
cube3.addComponent(new LerpData())
cube3.addComponent(myMaterialD)
cube3.getComponent(LerpData).origin = new Vector3(0, 0.215, 0)
cube3.getComponent(LerpData).target = new Vector3(0, 0, 0)

// cube3.setParent(slotMachineScreen)

var cube4 = new Entity();
cube4.addComponent(new Transform({ position: new Vector3(0, 0.115, 0) }))
cube4.getComponent(Transform).scale.set(0.1, 0.1, 0.01)
cube4.addComponent(new BoxShape());
cube4.addComponent(new LerpData())
cube4.addComponent(myMaterialE)
cube4.getComponent(LerpData).origin = new Vector3(0, 0.115, 0)
cube4.getComponent(LerpData).target = new Vector3(0, 0, 0)

// cube4.setParent(slotMachineScreen)

var cube5 = new Entity();
cube5.addComponent(new Transform({ position: new Vector3(0, 0.015, 0) }))
cube5.getComponent(Transform).scale.set(0.1, 0.1, 0.01)
cube5.addComponent(new BoxShape());
cube5.addComponent(new LerpData())
cube5.addComponent(myMaterialF)
cube5.getComponent(LerpData).origin = new Vector3(0, 0.015, 0)
cube5.getComponent(LerpData).target = new Vector3(0, 0, 0)

// cube5.setParent(slotMachineScreen)
//
// engine.addEntity(cube)
// engine.addEntity(cube1)
// engine.addEntity(cube2)
// engine.addEntity(cube3)
// engine.addEntity(cube4)


 engine.addEntity(slotMachineScreen);

// engine.addSystem(new LerpMove(cube))
engine.addSystem(new LerpMove(cube1))
 engine.addSystem(new LerpMove(cube2))
// engine.addSystem(new LerpMove(cube3))
// engine.addSystem(new LerpMove(cube4))
// engine.addSystem(new LerpMove(cube5))




// export class SlotMachine extends Entity {
//
//   private _topBlock: Entity = new Entity();
//   private _rightBlock: Entity = new Entity();
//   private _bottomBlock: Entity = new Entity();
//   private _leftBlock: Entity = new Entity();
//
//   private _size: Vector3;
//
//   constructor() {
//     super("SlotMachine");
//
//     this._topBlock.addComponent(new BoxShape());
//     this._topBlock.addComponent(new SlotMachineScreen());
//     this._topBlock.addComponent(new Transform({position: new Vector3(0, 0, 0)})).scale.set(0.88, 0.1, 0.01);
//
//     this._rightBlock.addComponent(new BoxShape());
//     this._rightBlock.addComponent(new SlotMachineScreen());
//     this._rightBlock.addComponent(new Transform({position: new Vector3(0, 0, 0)})).scale.set(0.1, 0.5, 0.01);
//
//     this._bottomBlock.addComponent(new BoxShape());
//     this._bottomBlock.addComponent(new SlotMachineScreen());
//     this._bottomBlock.addComponent(new Transform({position: new Vector3(0, 0, 0)})).scale.set(0.1, 0.5, 0.01);
//
//     this._leftBlock.addComponent(new BoxShape());
//     this._leftBlock.addComponent(new SlotMachineScreen());
//     this._leftBlock.addComponent(new Transform({position: new Vector3(0, 0, 0)})).scale.set(0.88, 0.1, 0.01);
//   }
//
//   addComponent<T extends object>(component: T): any {
//     if (component instanceof Transform) {
//       this._topBlock.getComponent(Transform).position = component.position;
//       this._topBlock.getComponent(Transform).position.add(new Vector3(0, 0, 0));
//
//       this._rightBlock.getComponent(Transform).position = component.position;
//       this._rightBlock.getComponent(Transform).position.add(new Vector3(2.88, 0.1, 0));
//
//       this._bottomBlock.getComponent(Transform).position = component.position;
//       this._bottomBlock.getComponent(Transform).position.add(new Vector3(0.5, 0.1, 1));
//
//       this._leftBlock.getComponent(Transform).position = component.position;
//       this._leftBlock.getComponent(Transform).position.add(new Vector3(0, 0.1, 0));
//
//       engine.addEntity(this._topBlock)
//       engine.addEntity(this._rightBlock)
//       engine.addEntity(this._bottomBlock)
//       engine.addEntity(this._leftBlock)
//     }
//
//
//
//      //engine.addEntity(this._rightBlock)
//     // engine.addEntity(this._bottomBlock)
//     // engine.addEntity(this._leftBlock)
//   }
// }

// let test = new SlotMachine();
// test.addComponent(new Transform({ position: new Vector3(2,1,3) }));
// engine.addEntity(test);





/// --- Spawn a cube ---



