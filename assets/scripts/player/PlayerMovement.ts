import { _decorator, Component, Node, animation, TERRAIN_HEIGHT_BASE, director, RigidBody, RenderingSubMesh, Vec3, Quat, CapsuleCollider, physics, PhysicsSystem, geometry, Mask, Layers, CCFloat } from 'cc';
import { CombatKeys, Direction } from './InputManager';
import { PlayerState, UnitStates } from '../UnitStates';
import { GameManager, PlayerDirection } from '../GameManager';
const { ccclass, property,requireComponent} = _decorator;

@ccclass('PlayerMovement')
@requireComponent(animation.AnimationController)
@requireComponent(RigidBody)
@requireComponent(CapsuleCollider)
export class PlayerMovement extends Component {

    @property(CCFloat)
    walkSpeed: number = 2;

    @property(CCFloat)
    zSpeed: number = 2;

    private animController: animation.AnimationController = null;
    private rb: RigidBody = null;
    private capCollider: CapsuleCollider = null;
    private unitState: UnitStates = null;

    private updateVelocity = false;
    private lineVelocity: Vec3 = new Vec3(0);
    

    __preload() {
        CCFloat
    }

    onLoad() {
        this.animController = this.node.getComponent(animation.AnimationController);
        this.rb = this.node.getComponent(RigidBody);
        this.capCollider = this.node.getComponent(CapsuleCollider);
        this.unitState = this.node.getComponent(UnitStates);

        console.log('animationController is ',this.animController);
        
    }

    onEnable() {
        director.on('keypress',this.moveAction,this);
        director.on('keyup',this.keyUp,this);
    }

    onDisable() {
        director.off('keypress',this.moveAction,this);
        director.off('keyup',this.keyUp,this);
    }

    

    keyUp(action: Direction | CombatKeys) {
        let moveArr = [Direction.LEFT_KEY,Direction.RIGHT_KEY,Direction.UP_KEY,Direction.DOWN_KEY];

        
    }

    moveAction(action: Direction) {
        console.log('action is ',Direction[action]);
        this.animController.setValue('walk',true);
        this.unitState.curState = PlayerState.WALK;
        switch(action) {
            case Direction.LEFT_KEY:
                this.turnToDir(action);
                this.setVelocity(new Vec3(this.node.forward.multiplyScalar(-this.walkSpeed).x,0,0));
                break;
            case Direction.RIGHT_KEY:
                this.turnToDir(action);
                this.setVelocity(new Vec3(this.node.forward.multiplyScalar(-this.walkSpeed).x,0,0));
                break;
            case Direction.UP_KEY:
                this.setVelocity(new Vec3(0,0,-this.zSpeed));
                break;
            case Direction.DOWN_KEY:
                this.setVelocity(new Vec3(0,0,this.zSpeed));
            break;
        }
    }

    setVelocity(velocity: Vec3) {
        this.lineVelocity = velocity;
        this.rb.setLinearVelocity(velocity);
        this.updateVelocity = true;
    }

    turnToDir(dir: Direction) {
        const lerpQuat = (angle: number) => {
            let q: Quat = new Quat();
            let q2: Quat = new Quat();
            Quat.fromEuler(q,0,angle,0);
            Quat.slerp(q2,this.node.rotation,q,0.9);
            this.node.setRotation(q2);
        }
        if(dir == Direction.LEFT_KEY) {
            lerpQuat(-90);
            GameManager.I.playerDir = PlayerDirection.LEFT;
        }
        if(dir == Direction.RIGHT_KEY) {
            lerpQuat(90);
            GameManager.I.playerDir = PlayerDirection.RIGHT;
            
        }
    }

    

    start() {

    }

    // /** ???????????????????????? */
    // checkIsGround() {
    //     // this.capCollider.worldBounds.
    //     console.log("?????????????????????",this.capCollider.worldBounds.center);
    //     let origin = this.capCollider.worldBounds.center;
    //     console.log("origin is ",origin);
    //     let dir = new Vec3(0,-1,0);
    //     let ray: geometry.Ray = geometry.Ray.create(origin.x,origin.y,origin.z,dir.x,dir.y,dir.z);
    //     // geometry.
    //     const groundLayerNum = Layers.nameToLayer("ground");
    //     console.log("layer is ",groundLayerNum);
        
    //     let isTouchGround = PhysicsSystem.instance.raycast(ray,1 << groundLayerNum,origin.y + 0.2);
    //     console.log(PhysicsSystem.instance.raycastResults);
    //     console.log("isTouchGround is ",isTouchGround);
    //     // geometry.Ray.
    //     // physics.PhysicsRayResult = physics.PhysicsSystem
    //     // Pl
    //     // this.capCollider.
    // }

    update(deltaTime: number) {
        
        if(this.unitState.curState === PlayerState.WALK) {
            let velocity = new Vec3(0);
            this.rb.getLinearVelocity(velocity);
    
            if(this.updateVelocity && velocity.length() <= 0.5) {
                this.animController.setValue("walk",false);
                this.updateVelocity = false;
                this.unitState.curState = PlayerState.IDLE;
            }
        }
    }

    
}

