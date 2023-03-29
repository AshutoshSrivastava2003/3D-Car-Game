import { AssignmentSharp, Home, UpdateTwoTone } from '@mui/icons-material';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const playercam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const clock = new THREE.Clock()

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const fuel_max1=100;


const renderer2 = new THREE.WebGLRenderer({ antialias: true });
renderer2.setSize(window.innerWidth / 4, window.innerHeight / 4);
renderer2.setClearColor(0x000000)
renderer2.domElement.style.position = "absolute"
renderer2.domElement.style.top = 20 + "px"
renderer2.domElement.style.right = 20 + "px"
document.body.appendChild(renderer2.domElement);

camera.position.x = -10;
camera.position.y = 8;
camera.position.z = -27;
camera.rotation.y = Math.PI / 2;
camera2.position.x = 0;
camera2.position.y = 15;
camera2.position.z = -27;
camera2.rotation.y = Math.PI / 2;

const gltfloader = new GLTFLoader();
gltfloader.load('../src/track2/scene.gltf', (gltfScene) => {
	console.log(gltfScene);
	const root = gltfScene.scene;
	scene.add(root);
});

let innerx = [];
let innerz = [];
let anglexz = []
let radius = (293 - 31) / 2
for (let i = 0; i < 1000; i++) {
	innerx[i] = -148 + ((i * 296) / 1000);
	innerz[i] = -31;
	anglexz[i] = 0;
}
for (let i = 1000; i < 2000; i++) {
	innerx[i] = 148 + radius * Math.sin((Math.PI * (i - 1000)) / 1000);
	innerz[i] = -162 + radius * Math.cos((Math.PI * (i - 1000)) / 1000);
	anglexz[i] = (Math.PI * (i - 1000)) / 1000;
}
for (let i = 2000; i < 3000; i++) {
	innerx[i] = 148 - (((i - 2000) * 296) / 1000);
	innerz[i] = -293;
	anglexz[i] = Math.PI;
}
for (let i = 3000; i < 4000; i++) {
	innerx[i] = -(148 + radius * Math.sin((Math.PI * (i - 3000)) / 1000));
	innerz[i] = -162 - radius * Math.cos((Math.PI * (i - 3000)) / 1000);
	anglexz[i] = ((Math.PI * (i - 3000)) / 1000) + Math.PI;
}

var car = '';
// var car_laps=0;
var car1 = '';
var car2 = '';
var car3 = '';
var crowd = '';

var can1 = '';
var can2 = '';
var can3 = '';
var can4 = '';
// var lapped = '';
var keyboard = [];

var carSpeed = 0.005;
var theta = Math.PI / 2;
var rotate = 0;
var collision = 0;
var health = 5;
var fuel_max = 100;
const fuel_can = 50;
const mileage = 25;

var dist = 0;
var car1_dist = 0;
var car2_dist = 0;
var car3_dist = 0;
var GAME_STATE = 0;
var player_view = 0;
var fuel;
var fuel_p

gltfloader.load('../src/people/scene.gltf', (gltfScene) => {
	crowd = gltfScene.scene;
	crowd.scale.set(0.8, 1, 0.8);
	crowd.position.x = 0;
	crowd.position.z = -40;
	crowd.position.y = 4;
	// crowd.rotation.y = Math.PI / 2;
	scene.add(crowd);
});
gltfloader.load('../src/car/scene.gltf', (gltfScene) => {
	car = gltfScene.scene;
	car.scale.set(0.8, 1, 0.8);
	car.position.x = 0;
	car.position.z = -27;
	car.rotation.y = Math.PI / 2;
	scene.add(car);
});
gltfloader.load('../src/car1/scene.gltf', (gltfScene) => {
	car1 = gltfScene.scene;
	car1.scale.set(0.02, 0.02, 0.02);
	car1.position.x = -5;
	car1.position.z = -27;
	car1.rotation.y = Math.PI / 2;
	scene.add(car1);
});
gltfloader.load('../src/car2/scene.gltf', (gltfScene) => {
	car2 = gltfScene.scene;
	car2.scale.set(2.5, 3, 3);
	car2.position.x = -5;
	car2.position.z = -27;
	car2.position.y = 2;
	car2.rotation.y = 0;
	scene.add(car2);
});

gltfloader.load('../src/car3/scene.gltf', (gltfScene) => {
	car3 = gltfScene.scene;
	car3.scale.set(0.015, 0.015, 0.015);
	car3.position.x = -8;
	car3.position.z = -31;
	car3.rotation.y = Math.PI / 2;
	scene.add(car3);
});
gltfloader.load('../src/gas_can/scene.gltf', (gltfScene) => {
	can1 = gltfScene.scene;
	can1.scale.set(0.005, 0.005, 0.005);
	can1.position.x = 147.68;
	can1.position.z = -31;
	can1.position.y = 1;
	can1.rotation.y = Math.PI / 2;
	scene.add(can1);
});
gltfloader.load('../src/gas_can/scene.gltf', (gltfScene) => {
	can2 = gltfScene.scene;
	can2.scale.set(0.005, 0.005, 0.005);
	can2.position.x = 52;
	can2.position.z = -293;
	can2.position.y = 1;
	can2.rotation.y = Math.PI / 2;
	scene.add(can2);
});
gltfloader.load('../src/gas_can/scene.gltf', (gltfScene) => {
	can3 = gltfScene.scene;
	can3.scale.set(0.005, 0.005, 0.005);
	can3.position.x = -135;
	can3.position.z = -293;
	can3.position.y = 1;
	can3.rotation.y = Math.PI / 2;
	scene.add(can3);
});
gltfloader.load('../src/gas_can/scene.gltf', (gltfScene) => {
	can4 = gltfScene.scene;
	can4.scale.set(0.005, 0.005, 0.005);
	can4.position.x = -147.68;
	can4.position.z = -31;
	can4.position.y = 1;
	can4.rotation.y = Math.PI / 2;
	scene.add(can4);
});

const light1 = new THREE.DirectionalLight(0xffffff);
light1.position.set(0, 0, 100);
const light2 = new THREE.DirectionalLight(0xffffff);
light2.position.set(0, 100, 0);
const light3 = new THREE.DirectionalLight(0xffffff);
light3.position.set(100, 0, 0);
scene.add(light1);
scene.add(light2);
scene.add(light3);


function onDocumentKeyDown(event) {
	var keyCodes = event.keyCode;
	keyboard[keyCodes] = true;
}
function onDocumentKeyUp(event) {
	var keyCodes = event.keyCode;
	keyboard[keyCodes] = false;
}
document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp, false);
var time;
var point = 80;
// var distance;
// var lap_change=0;
function animate() {
	requestAnimationFrame(animate);
	// console.log(car1_dist)
	if (car && car1 && GAME_STATE==1) {
			
		// console.log(car.position.z);
		car1.position.x = innerx[point];
		car1.position.z = innerz[point];

		car2.position.x = innerx[(point-40)% 4000];
		car2.position.z = innerz[(point-40)% 4000];

		car3.position.x = innerx[(point-80)% 4000];
		car3.position.z = innerz[(point-80)% 4000];
		
		car1.rotation.y = anglexz[point] + Math.PI / 2;
		car2.rotation.y = anglexz[point] ;
		car3.rotation.y = anglexz[point] + Math.PI / 2;
		point += 2;
		point = point % 4000;
	}
	// console.log(player_view);
	if (GAME_STATE == 0) {
		document.getElementById("GameStart").innerHTML = "Press Enter to Start Game      W : Acceleration A: Left S: Brake D: Right 1:First Person 2:Third Person"
		document.getElementById("time").innerHTML = 0;
	}
	else if (GAME_STATE == -1) {
		console.log('game over');
		document.getElementById("GameStart").innerHTML = 'GAME OVER';
		document.getElementById("cars").innerHTML = dist
		document.getElementById("car1s").innerHTML = "NA"
		document.getElementById("car2s").innerHTML = "NA"
		document.getElementById("car3s").innerHTML = "NA"
		document.getElementById("time").innerHTML = Math.round(time);
	}
	else if (GAME_STATE == 1) {
		document.getElementById("GameStart").innerHTML = ""
		document.getElementById("cars").innerHTML = ""
		document.getElementById("car1s").innerHTML = ""
		document.getElementById("car2s").innerHTML = ""
		document.getElementById("car3s").innerHTML = ""
		time = clock.getElapsedTime();
		document.getElementById("time").innerHTML = Math.round(time);
	}
	else if (GAME_STATE == 2) {
		// console.log("won")
		document.getElementById("cars").innerHTML = dist
		document.getElementById("car1s").innerHTML = 4000
		document.getElementById("car2s").innerHTML = 4000
		document.getElementById("car3s").innerHTML = 4000
		if (dist > 4000) {
			document.getElementById("GameStart").innerHTML = "GAME WON !!!"
		}
		else {
			document.getElementById("GameStart").innerHTML = "GAME LOST !!!"
		}
	}

	if (health == 0) {
		GAME_STATE = -1;
	}
	if (time >= 120) {
		// if()
		GAME_STATE = 2;
	}
	else if (car && car1 && car2 && car3 && can1 && can2 && can3 && can4 && camera) {

		var a = new THREE.Vector3(car.position.x, car.position.y, car.position.z);
		camera.lookAt(a);
		camera2.lookAt(a);

		playercam.position.x = car.position.x;
		playercam.position.z = car.position.z;
		playercam.position.y = 4;
		playercam.rotation.y = theta - Math.PI;
		camera2.rotation.z = theta - Math.PI;
		// console.log('position');
		// console.log(car.position.x);
		// console.log(car.position.z);
		if (keyboard[13] == true) {
			if (GAME_STATE == 0) GAME_STATE = 1;
		}


		if (GAME_STATE == 1) {
			// var keyCode = event.which;
			//key S 
			// console.log("hello")
			if (keyboard[83] == true) {
				if (carSpeed > 0) carSpeed -= 0.0015;
			}
			//key W
			else if (keyboard[87] == true) {
				carSpeed += 0.002;

			}
			//key D
			else if (keyboard[68] == true) {
				theta -= Math.PI / 180;
				// console.log(theta);
				rotate = 1;
			}
			//key A
			else if (keyboard[65] == true) {
				theta += Math.PI / 180;
				// console.log(theta);
				rotate = 1;
			}
			//key SPACE
			else if (keyboard[32] == true) {
				car.position.set(0, 0, -31);
				carSpeed = 0;
				camera.position.set(-10, 8, -31);
				theta = Math.PI / 2;
			}
			//key TAB
			if (keyboard[49] == true) {
				if (player_view == 0) { player_view = 1; }
			}
			if (keyboard[50] == true) {
				if (player_view == 1) { player_view = 0; }
			}
			car.rotation.y = theta;
		};
		if (car && can1 && can2 && can3 && can4) {
			if ((car.position.x - can1.position.x) * (car.position.x - can1.position.x) + (car.position.z - can1.position.z) * (car.position.z - can1.position.z) < 3.5) {
				// fuel += fuel_can;
				fuel_max += fuel_can;
				// console.log(fuel);
				can1.position.x = 300;
			}
			if ((car.position.x - can2.position.x) * (car.position.x - can2.position.x) + (car.position.z - can2.position.z) * (car.position.z - can2.position.z) < 3.5) {
				// fuel += fuel_can;
				fuel_max += fuel_can;
				// console.log(fuel);
				can2.position.x = 300;
			}
			if ((car.position.x - can3.position.x) * (car.position.x - can3.position.x) + (car.position.z - can3.position.z) * (car.position.z - can3.position.z) < 3.5) {
				// fuel += fuel_can;
				fuel_max += (fuel_can);
				// console.log(fuel);
				can3.position.x = 300;
			}
			if ((car.position.x - can4.position.x) * (car.position.x - can4.position.x) + (car.position.z - can4.position.z) * (car.position.z - can4.position.z) < 3.5) {
				// fuel += fuel_can;/
				fuel_max += (fuel_can);
				// console.log(fuel);
				can4.position.x = 300;
			}
		}
		// if(lapped && car){
		// 	if (car.position.x=-10) {
		// 		lap_change=1;
		// 		// console.log(car_laps);
		// 	}
		// }
		// if(lap_change==1){
		// 	car_laps+=1;
		// 	lap_change=0;
		// }
		if (car && car1 && car2 && car3) {
			if ((car.position.x - car1.position.x) * (car.position.x - car1.position.x) + (car.position.z - car1.position.z) * (car.position.z - car1.position.z) < 10) {
				console.log('collision');
				health -= 1;
				car.position.x = car1.position.x + 2.5;
				car.position.z = car1.position.z + 2.5;
				collision = 1;
			}
			if ((car.position.x - car2.position.x) * (car.position.x - car2.position.x) + (car.position.z - car2.position.z) * (car.position.z - car2.position.z) < 10) {
				console.log('collision');
				health -= 1;
				car.position.x = car2.position.x + 2.5;
				car.position.z = car2.position.z + 2.5;
				collision = 1;
			}
			if ((car.position.x - car3.position.x) * (car.position.x - car3.position.x) + (car.position.z - car3.position.z) * (car.position.z - car3.position.z) < 10) {
				console.log('collision');
				health -= 1;
				car.position.x = car3.position.x + 2.5;
				car.position.z = car3.position.z + 2.5;
				collision = 1;
			}
		}
		if (rotate === 1 || collision === 1) {
			camera.position.x = car.position.x;
			camera.position.z = car.position.z;
			camera.position.x = car.position.x + 10 * Math.sin(-theta);
			camera.position.z = car.position.z - 10 * Math.cos(-theta);
			playercam.position.x = car.position.x
			playercam.position.z = car.position.z
			camera2.position.x = car.position.x;
			camera2.position.z = car.position.z;
			rotate = 0;
			collision = 0;
		}
		if (carSpeed > 0) { carSpeed -= 0.00025; }

		fuel=(fuel_max - (dist / mileage));
		if(fuel>fuel_max1){
			fuel_p=100
		}
		else{
			fuel_p=fuel
		}
		if (fuel > 0) {
			car.position.z += carSpeed * (Math.cos(theta));
			car.position.x += carSpeed * (Math.sin(theta));
			camera.position.z += carSpeed * (Math.cos(theta));
			camera.position.x += carSpeed * (Math.sin(theta));
			camera2.position.x = car.position.x;
			camera2.position.z = car.position.z;
			dist += carSpeed;
		}
		else if(fuel<=0) {
			GAME_STATE=-1;
		}
		
		// if(fuel_p>100){
		// 	fuel_max=
		// 	fuel=(fuel_max - (dist / mileage))-((fuel_max - (dist / mileage))%100);
		// }
		// else{
		// 	fuel = (fuel_max - (dist / mileage));
		// }
		// fuel= fuel-()
		// if(fuel>100){
		// 	fuel=100;
		// }
		// fuel=fuel(fuel_max1+1)
		// if(fuel>fuel_max1){fuel-=fuel%(fuel_max1+1)+1+0.01;console.log("fuel excess")}
		document.getElementById("fuel").innerHTML = Math.round(fuel_p);
		document.getElementById("score").innerHTML = Math.round(dist);
		document.getElementById("health").innerHTML = health;
		// document.getElementById("laps").innerHTML=car_laps+1;
	}

	if (player_view == 0) renderer.render(scene, camera);
	else { renderer.render(scene, playercam); }
	renderer2.render(scene, camera2)

};


animate();

