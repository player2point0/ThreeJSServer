import { MMDLoader } from './jsm/loaders/MMDLoader.js';
import { MMDAnimationHelper } from './jsm/animation/MMDAnimationHelper.js';

//https://github.com/hanakla/three-mmd-loader

class JavaEntity
{
    //port to three.js
    constructor(entityData, sceneEntity) 
    {    
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.xRotate = 0;
        this.yRotate = 0;
        this.zRotate = 0;
        this.xScale = 1;
        this.yScale = 1;
        this.zScale = 1;
        this.gameObject;
        this.name = entityData.name;
        
        //the texture that is displayed on the material
        //supports loading images from file
        //supports base64 string
        //supports transparent textures
        if(entityData.texture)
        {   
            this.texture = new THREE.TextureLoader().load(entityData.texture);
        }        
        
        if(entityData.mmd){
            console.log("mmd");

            function onProgress( xhr ) {

                if ( xhr.lengthComputable ) {

                    var percentComplete = xhr.loaded / xhr.total * 100;
                    console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

                }

            }


            var modelFile = 'models/mmd/miku/miku_v2.pmd';
            var vmdFiles = [ 'models/mmd/vmds/wavefile_v2.vmd' ];

            helper = new MMDAnimationHelper( {
                afterglow: 2.0
            } );

            var loader = new MMDLoader();

            loader.loadWithAnimation( modelFile, vmdFiles, function ( mmd ) {

                mesh = mmd.mesh;
                mesh.position.y = - 10;
                scene.add( mesh );

                helper.add( mesh, {
                    animation: mmd.animation,
                    physics: true
                } );

                ikHelper = helper.objects.get( mesh ).ikSolver.createHelper();
                ikHelper.visible = false;
                scene.add( ikHelper );

                physicsHelper = helper.objects.get( mesh ).physics.createHelper();
                physicsHelper.visible = false;
                scene.add( physicsHelper );

                initGui();

            }, onProgress, null );
        }

        else{

            this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00, map: this.texture} );

            this.geometry = new THREE.BufferGeometry();
            
            //the vertex, uvs, and indices for custom meshes
            if(entityData.vertexData)
            {
                this.geometry.setIndex(entityData.vertexData.indices);
                this.geometry.setAttribute( 'uv', new THREE.BufferAttribute(new Float32Array(entityData.vertexData.uvs), 2 ) );
                this.geometry.setAttribute( 'position', new THREE.BufferAttribute(new Float32Array(entityData.vertexData.position), 3 ) );
            }
            
            this.gameObject = new THREE.Mesh( this.geometry, this.material );    
        }

        //position of the entity
        if(entityData.x) this.gameObject.position.x = entityData.x;
        if(entityData.y) this.gameObject.position.y = entityData.y;
        if(entityData.z) this.gameObject.position.z = entityData.z;
        
        //rotation of the entity
        if(entityData.xRotate) this.geometry.rotateX(entityData.xRotate);
        if(entityData.yRotate) this.geometry.rotateY(entityData.yRotate);
        if(entityData.zRotate) this.geometry.rotateZ(entityData.zRotate);
        //scale/size of the entity
        if(entityData.xScale) this.xScale = entityData.xScale;
        if(entityData.yScale) this.yScale = entityData.yScale;
        if(entityData.zScale) this.zScale = entityData.zScale;
        this.geometry.scale(this.xScale, this.yScale, this.zScale);

        //add to current scene entity
        sceneEntity.add(this.gameObject);
    }
    updateEntity(entityData)
    {
        //todo optimise this

        if(entityData.vertexData)
        {
            this.changeMesh(entityData.vertexData);
        }

        //position of the entity
        if(entityData.x) this.gameObject.position.x = entityData.x;
        if(entityData.y) this.gameObject.position.y = entityData.y;
        if(entityData.z) this.gameObject.position.z = entityData.z;
        
        //rotation of the entity
        if(entityData.xRotate) this.geometry.rotateX(entityData.xRotate);
        if(entityData.yRotate) this.geometry.rotateY(entityData.yRotate);
        if(entityData.zRotate) this.geometry.rotateZ(entityData.zRotate);
        //scale/size of the entity
        if(entityData.xScale) this.xScale = entityData.xScale;
        if(entityData.yScale) this.yScale = entityData.yScale;
        if(entityData.zScale) this.zScale = entityData.zScale;
        this.geometry.scale(this.xScale, this.yScale, this.zScale);

        if(entityData.texture)
        {
            this.changeTexture(entityData.texture);   
        }
    }
    changeMesh(vertexData)
    {
        this.geometry.setIndex(vertexData.indices);
        this.geometry.setAttribute( 'uv', new THREE.BufferAttribute(new Float32Array(vertexData.uvs), 2 ) );
        this.geometry.setAttribute( 'position', new THREE.BufferAttribute(new Float32Array(vertexData.position), 3 ) );
        
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.uv.needsUpdate = true;
    }
    changeTexture(texture)
    {
        //if(texture == this.material.map.image.src) return;
        this.texture = new THREE.TextureLoader().load(texture);
        this.material.map = this.texture;
        this.material.map.needsUpdate = true;
    }
}