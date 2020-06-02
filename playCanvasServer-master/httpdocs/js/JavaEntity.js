//import MMDAnimationHelper from './mmd-animation-helper-bundle.js';
//import MMDLoader from './mmd-bundle.js';

//https://github.com/hanakla/three-mmd-loader

class JavaEntity {
	//port to three.js
	constructor(entityData, sceneEntity) {
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
		this.loadedMmd = false;

		//the texture that is displayed on the material
		//supports loading images from file
		//supports base64 string
		//supports transparent textures
		if (entityData.texture) {
			this.texture = new THREE.TextureLoader().load(entityData.texture);
		}

		if (entityData.mmdName && entityData.vmdName) {
			function onProgress(xhr) {
				if (xhr.lengthComputable) {
					var percentComplete = (xhr.loaded / xhr.total) * 100;
					console.log(Math.round(percentComplete, 2) + "% downloaded");
				}
			}

			this.currentMmdName = entityData.mmdName;
			this.currentVmdName = entityData.vmdName;

			var modelFile = "./js/mmd/" + entityData.mmdName + "/model.pmd";
			var vmdFiles = [
				"./js/mmd/vmds/" + entityData.vmdName + ".vmd",
				"./js/mmd/vmds/5.vmd",
				"./js/mmd/vmds/6.vmd",
			];

			this.helper = new THREE.MMDAnimationHelper({
				afterglow: 2.0,
			});

			var loader = new THREE.MMDLoader();
			let scope = this;

			//todo change to use a custom animation system to allow multiple animations
			// don't use the animation builder in mmd-bundle

			loader.loadWithAnimation(
				modelFile,
				vmdFiles,
				function(mmd) {
					Ammo().then(function() {
						scope.gameObject = mmd.mesh;

						scope.helper.add(scope.gameObject, {
							animation: mmd.animation,
							physics: true,
						});

						scope.ikHelper = scope.helper.objects
							.get(scope.gameObject)
							.ikSolver.createHelper();
						scope.ikHelper.visible = false;
						sceneEntity.add(scope.ikHelper);

						scope.physicsHelper = scope.helper.objects
							.get(scope.gameObject)
							.physics.createHelper();
						scope.physicsHelper.visible = false;
						sceneEntity.add(scope.physicsHelper);

						scope.positionAndAddToScene(entityData, sceneEntity);
						scope.loadedMmd = true;
					});
				},
				onProgress,
				function(err) {
					console.log("err");
					console.error(err);
				}
			);
		} else {
			this.material = new THREE.MeshBasicMaterial({
				color: 0x00ff00,
				map: this.texture,
			});

			this.geometry = new THREE.BufferGeometry();

			//the vertex, uvs, and indices for custom meshes
			if (entityData.vertexData) {
				this.geometry.setIndex(entityData.vertexData.indices);
				this.geometry.setAttribute(
					"uv",
					new THREE.BufferAttribute(
						new Float32Array(entityData.vertexData.uvs),
						2
					)
				);
				this.geometry.setAttribute(
					"position",
					new THREE.BufferAttribute(
						new Float32Array(entityData.vertexData.position),
						3
					)
				);
			}

			this.gameObject = new THREE.Mesh(this.geometry, this.material);
			this.positionAndAddToScene(entityData, sceneEntity);
		}
	}

	positionAndAddToScene(entityData, sceneEntity) {
		//position of the entity
		if (entityData.x) this.gameObject.position.x = entityData.x;
		if (entityData.y) this.gameObject.position.y = entityData.y;
		if (entityData.z) this.gameObject.position.z = entityData.z;

		//rotation of the entity
		if (entityData.xRotate) this.geometry.rotateX(entityData.xRotate);
		if (entityData.yRotate) this.geometry.rotateY(entityData.yRotate);
		if (entityData.zRotate) this.geometry.rotateZ(entityData.zRotate);
		//scale/size of the entity
		if (entityData.xScale) this.xScale = entityData.xScale;
		if (entityData.yScale) this.yScale = entityData.yScale;
		if (entityData.zScale) this.zScale = entityData.zScale;
		if (this.geometry)
			this.geometry.scale(this.xScale, this.yScale, this.zScale);

		//add to current scene entity
		sceneEntity.add(this.gameObject);
	}

	updateEntity(entityData) {
		//todo optimise this

		if (entityData.vertexData) {
			this.changeMesh(entityData.vertexData);
		}

		//position of the entity
		if (entityData.x) this.gameObject.position.x = entityData.x;
		if (entityData.y) this.gameObject.position.y = entityData.y;
		if (entityData.z) this.gameObject.position.z = entityData.z;

		//rotation of the entity
		if (entityData.xRotate) this.geometry.rotateX(entityData.xRotate);
		if (entityData.yRotate) this.geometry.rotateY(entityData.yRotate);
		if (entityData.zRotate) this.geometry.rotateZ(entityData.zRotate);
		//scale/size of the entity
		if (entityData.xScale) this.xScale = entityData.xScale;
		if (entityData.yScale) this.yScale = entityData.yScale;
		if (entityData.zScale) this.zScale = entityData.zScale;
		if (this.geometry)
			this.geometry.scale(this.xScale, this.yScale, this.zScale);

		if (entityData.texture) {
			this.changeTexture(entityData.texture);
		}
		/*
		if (
			entityData.mmdName &&
			entityData.mmdName != this.currentMmdName &&
			this.loadedMmd
		) {
			this.changeMmd(entityData.mmdName);
		}
*/
		if (entityData.vmdName && entityData.vmdName != this.currentVmdName) {
			this.changeVmd(entityData.vmdName);
		}
	}
	changeMmd(mmdName) {
		this.currentMmdName = mmdName;
		this.loadedMmd = false;

		var modelFile = "./js/mmd/" + mmdName + "/model.pmd";

		//replace the mmd model

		var loader = new THREE.MMDLoader();
		let scope = this;

		this.gameObject.geometry.dispose();

		loader.load(
			// path to PMD/PMX file
			modelFile,
			// called when the resource is loaded
			function(mesh) {
				console.log(mesh);
				//scope.gameObject.geometry.updateFromObject(mesh);

				scope.loadedMmd = true;
				scope.gameObject = mesh;
			},
			// called when loading is in progresses
			function(xhr) {
				console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
			},
			// called when loading has errors
			function(error) {
				console.log("An error happened");
			}
		);
	}
	changeVmd(vmdName) {}
	changeMesh(vertexData) {
		//test this
		this.geometry.dispose();

		this.geometry.setIndex(vertexData.indices);
		this.geometry.setAttribute(
			"uv",
			new THREE.BufferAttribute(new Float32Array(vertexData.uvs), 2)
		);
		this.geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(new Float32Array(vertexData.position), 3)
		);

		this.geometry.attributes.position.needsUpdate = true;
		this.geometry.attributes.uv.needsUpdate = true;
	}
	changeTexture(texture) {
		//if(texture == this.material.map.image.src) return;
		this.texture = new THREE.TextureLoader().load(texture);
		this.material.map = this.texture;
		this.material.map.needsUpdate = true;
	}
}
