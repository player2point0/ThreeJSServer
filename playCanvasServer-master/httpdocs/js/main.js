var scene;
var renderer;
var camera; //player camera
const host = window.location.hostname; //"http://169.254.100.33:8080/";//"http://localhost:8080/";
const port = window.location.port; //server port
var currentPage = window.location.pathname; //current server page
const loopDelay = 100; //how often to call loop - takes about 15 for server response
var entities = []; //all of the server entities
var clock = new THREE.Clock();

boilerPlate();
getInitialServerData();
animate();

async function getServerData(endpoint) {
	var url = "http://" + host + ":" + port + currentPage + "/" + endpoint;
	let response = await fetch(url); //synchronous server request
	let data = await response.json(); //convert java string to json object

	return data;
}

function animate() {
	requestAnimationFrame(animate);

	loop(); //check if this locks up the loop/thread

	for (var i = 0; i < entities.length; i++) {
		var entity = entities[i];

		if (entity.helper) {
			entity.helper.update(clock.getDelta());
		}
	}

	renderer.render(scene, camera);
}

async function boilerPlate() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xbfe3dd);

	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	camera.position.z = 5;
}

async function getInitialServerData() {
	var startData = await getServerData("Start"); //get the initial page data from the server
	var serverEntities = startData.entities; //the json data from the server

	for (var i = 0; i < serverEntities.length; i++) {
		var entity = serverEntities[i];
		var newEntity = new JavaEntity(entity, scene);

		entities.push(newEntity);
	}
}

async function loop() {
	//json data that will update the realtime entities
	var loopData = await getServerData("Update");
	var loopEntities = loopData.entities;

	//match names
	//time and decide if optimising this would make a difference
	for (var i = 0; i < loopEntities.length; i++) {
		for (var j = 0; j < entities.length; j++) {
			if (loopEntities[i].name == entities[j].name) {
				entities[j].updateEntity(loopEntities[i]);
				break;
			}
		}
	}
}
