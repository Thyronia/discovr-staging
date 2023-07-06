import '@matterport/webcomponent';
import 'css/styles.css';

const main = async () => {
	const sdk = await document.querySelector('matterport-viewer').playingPromise;
	var [ sceneObject ] = await sdk.Scene.createObjects(1);

	// lights
	const lights = sceneObject.addNode();
	lights.addComponent('mp.lights');
	lights.start();
	
	var addedObjects = [];
	
	var currentlySelectedObject = null;
	
	function setSelectedObject(object){
		currentlySelectedObject = object;
		document.getElementById("selectedID").innerHTML = object.id;
		document.getElementById("selectedFunctions").style.display = 'flex';
		object.inputs.materialUrl = "materials/yellow.jpg";
	}
	
	function populateInputs(object){
		var pos = object.inputs.localPosition;

		document.getElementById("scaleStep").value = object.inputs.localScale.x.toString();
		document.getElementById("xStep").value = object.inputs.localPosition.x.toString();
		document.getElementById("yStep").value = object.inputs.localPosition.y.toString();
		document.getElementById("zStep").value = object.inputs.localPosition.z.toString();
		document.getElementById("xStepRot").value = object.inputs.localRotation.x.toString();
		document.getElementById("yStepRot").value = object.inputs.localRotation.y.toString();
		document.getElementById("zStepRot").value = object.inputs.localRotation.z.toString();
		
		document.getElementById("selectedFunctions").style.display = 'flex';
	}
	
	function addObject(position, scale, modelUrl){
		var newCube = {
			url: modelUrl,
			visible: true,
			localPosition: {
				x: position.x, y: position.y, z: position.z
			},
			localScale: {
				x: scale.x, y: scale.y, z: scale.z
			},
			name:'chair'
		}
		
		var tempNode = sceneObject.addNode();
		var tempObj = tempNode.addComponent('mp.fbxLoader', newCube);
		console.log('tempObj', tempObj);
		tempObj.onEvent = function (eventType) {
			console.log('event', eventType);
			if (eventType === 'INTERACTION.CLICK') {
				setSelectedObject(this);
				populateInputs(this);
			}
		};
		
		document.getElementById("xStep").addEventListener("input", function(event){moveObjectAbsolute(currentlySelectedObject,'x',event.target.value)});
		document.getElementById("yStep").addEventListener("input", function(event){moveObjectAbsolute(currentlySelectedObject,'y',event.target.value)});
		document.getElementById("zStep").addEventListener("input", function(event){moveObjectAbsolute(currentlySelectedObject,'z',event.target.value)});
		document.getElementById("xStepRot").addEventListener("input", function(event){rotateObjectAbsolute(currentlySelectedObject,'x',event.target.value)});
		document.getElementById("yStepRot").addEventListener("input", function(event){rotateObjectAbsolute(currentlySelectedObject,'y',event.target.value)});
		document.getElementById("zStepRot").addEventListener("input", function(event){rotateObjectAbsolute(currentlySelectedObject,'z',event.target.value)});
		document.getElementById("scaleStep").addEventListener("input", function(event){scaleObjectAbsolute(currentlySelectedObject,event.target.value)});
		
		setSelectedObject(tempObj);
		populateInputs(tempObj);
		
		tempNode.start();
		addedObjects.push(tempObj);
		generateObjectsList(addedObjects);
	}
	
	function generateObjectsList(objectsArray){
		var listContainer = document.getElementById("objectsList");
		listContainer.innerHTML = '';
		for(var i=0;i<objectsArray.length;i++){
			var objectNode = document.createElement("div");
			objectNode.className = "objectNode";
			objectNode.dataset.objId = i;
			objectNode.innerHTML = objectsArray[i].id;
			listContainer.append(objectNode);
			console.log(objectsArray[i]);
		}
	}
	
	function moveObject(object, axis, step){
		eval("object.inputs.localPosition."+axis+"+="+step);
	}
	function moveObjectAbsolute(object, axis, value){
		eval("object.inputs.localPosition."+axis+"="+value);
	}
	function rotateObject(object, axis, step){
		eval("object.inputs.localRotation."+axis+"+="+step);
	}
	function rotateObjectAbsolute(object, axis, value){
		eval("object.inputs.localRotation."+axis+"="+value);
	}
	function scaleObject(object, step){
		object.inputs.localScale.x += step;
		object.inputs.localScale.y += step;
		object.inputs.localScale.z += step;
	}
	function scaleObjectAbsolute(object, value){
		object.inputs.localScale.x = value;
		object.inputs.localScale.y = value;
		object.inputs.localScale.z = value;
	}
	
	document.querySelectorAll(".functionButtons").forEach(function(item){
		item.addEventListener('click', function(click){
			switch (click.target.id){
				case "minusScale":
					scaleObject(currentlySelectedObject, -0.01);
					break;
				case "plusScale":
					scaleObject(currentlySelectedObject, 0.01);
					break;				
				case "minusX":
					moveObject(currentlySelectedObject, 'x', -1);
					break;
				case "plusX":
					moveObject(currentlySelectedObject, 'x', 1);
					break;
				case "minusY":	
					moveObject(currentlySelectedObject, 'y', -1);
					break;
				case "plusY":
					moveObject(currentlySelectedObject, 'y', 1);
					break;
				case "minusZ":
					moveObject(currentlySelectedObject, 'z', -1);
					break;
				case "plusZ":
					moveObject(currentlySelectedObject, 'z', 1);
					break;				
				case "minusXRot":
					rotateObject(currentlySelectedObject, 'x', -1);
					break;
				case "plusXRot":
					rotateObject(currentlySelectedObject, 'x', 1);
					break;
				case "minusYRot":	
					rotateObject(currentlySelectedObject, 'y', -1);
					break;
				case "plusYRot":
					rotateObject(currentlySelectedObject, 'y', 1);
					break;
				case "minusZRot":
					rotateObject(currentlySelectedObject, 'z', -1);
					break;
				case "plusZRot":
					rotateObject(currentlySelectedObject, 'z', 1);
					break;
				case "reset":
					currentlySelectedObject.inputs.localPosition.x = 0;
					currentlySelectedObject.inputs.localPosition.y = 0;
					currentlySelectedObject.inputs.localPosition.z = 0;
					currentlySelectedObject.inputs.localRotation.x = 0;
					currentlySelectedObject.inputs.localRotation.y = 0;
					currentlySelectedObject.inputs.localRotation.z = 0;
					currentlySelectedObject.inputs.localScale.x = 0.05;
					currentlySelectedObject.inputs.localScale.y = 0.05;
					currentlySelectedObject.inputs.localScale.z = 0.05;
					break;
				case "addObject":
					var tmpData = click.target.dataset;
					addObject({x: 0, y: 0, z: 0},{x: tmpData.scale, y: tmpData.scale, z: tmpData.scale}, tmpData.url);					
					break;
				case "cam":
					const cameraPose = sdk.Camera.getPose();
					console.log(cameraPose);
					break;
			}
			populateInputs(currentlySelectedObject);
		});
	});
	
	/*var node = sceneObject.addNode();
	var inputComponent = node.addComponent('mp.input', {
		eventsEnabled: true,
		userNavigationEnabled: false,
	});
	node.start();
	// Define a click event spy
	var ClickSpy = (function () {
		function ClickSpy() {
			this.eventType = 'INTERACTION.CLICK';
		}
		ClickSpy.prototype.onEvent = function (payload) {
			inputComponent.inputs.userNavigationEnabled = false;
			console.log('received', payload);
			var pos = payload.position;
			addObject({x: pos.x*10, y: 0, z: pos.y*10},{x: 0.05, y: 0.05, z: 0.05}, 'http://localhost:8080/models/chair.fbx');
		};
		return ClickSpy;
	}());
	// Spy on the click event
	inputComponent.spyOnEvent(new ClickSpy());
	// You can enable navigation after starting the node.
	inputComponent.inputs.userNavigationEnabled = true;*/

}
main();



