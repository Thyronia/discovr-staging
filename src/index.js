import '@matterport/webcomponent';
import '../static/css/styles.css';

const main = async () => {
	console.clear();
	const sdk = await document.querySelector('matterport-viewer').playingPromise;
	var [ sceneObject ] = await sdk.Scene.createObjects(1);
	
	// lights
	const lights = sceneObject.addNode();
	lights.addComponent('mp.lights');
	lights.start();
	
	console.log('lights');
	console.log(lights);
	
	// Object
	var node = sceneObject.addNode();
	var initial = {
		url: "https://discovr360.com/files/redCube.fbx",
		visible: true,
		localScale: {
			x: 1, y: 1, z: 1
		},
		localPosition: {
			x: 2.439028024673462, y: 1.5612691640853882, z: 2.5058746337890625
		},
	};

	var testObject = node.addComponent('mp.fbxLoader', initial);
	node.start();
	
	document.querySelectorAll(".functionButtons").forEach(function(item){
		item.addEventListener('click', function(click){
			console.log(sdk.Camera.pose);
			var inputs = testObject.inputs;
			switch (click.target.id){
				case "minusScale":
					inputs.localScale.x -= 0.001;
					inputs.localScale.y -= 0.001;
					inputs.localScale.z -= 0.001;
					break;
				case "plusScale":
					inputs.localScale.x += 0.001;
					inputs.localScale.y += 0.001;
					inputs.localScale.z += 0.001;
					break;				
				case "minusX":
					inputs.localPosition.x -= 0.1;
					break;
				case "plusX":
					inputs.localPosition.x += 0.1;
					break;
				case "minusY":	
					inputs.localPosition.y -= 0.1;
					break;
				case "plusY":
					inputs.localPosition.y += 0.1;
					break;
				case "minusZ":
					inputs.localPosition.z -= 0.1;
					break;
				case "plusZ":	
					inputs.localPosition.z += 0.1;
					break;
				case "reset":
					inputs.localPosition.x = 1;
					inputs.localPosition.y = 1;
					inputs.localPosition.z = 1;
					inputs.localScale.x = 1;
					inputs.localScale.y = 1;
					inputs.localScale.z = 1;
					break;
			}
			console.log(inputs);
		});
	});	
}
main();



