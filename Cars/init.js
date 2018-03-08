function init() {
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
	//Starting position X/Y Coordinates
	camera.position.x= 10; 
	camera.position.z= 15;
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xffffff, 0, 1000 );
	var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
	light.position.set( 0.5, 1, 0.75 );
	scene.add( light );
	var light1 = new THREE.DirectionalLight( 0xffffff, .3 );
	light1.position.set( -1, 1.75, 1 );
	scene.add( light1 );
	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );
	
	//Switch statement for user's input
	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 81:
				rotate = true;
				break;
			case 87: // w
				moveForward = true;
				break;
			case 65: // a
				moveLeft = true; 
				break;
			case 83: // s
				moveBackward = true;
				break;
			case 68: // d
				moveRight = true;
				break;
			
			case 38: // up
				carForward = true;
				break;
			case 37: // left
				carLeft = true; break;
			case 40: // down
				carBackward = true;
				break;
			case 39: // right
				carRight = true;
				break;
			case 32: // space
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;
		}
	};
	
	var onKeyUp = function ( event ) {
		switch ( event.keyCode ) {
			case 81:
				rotate = false;
				break;
			case 87: // w
				moveForward = false;
				break;
			case 65: // a
				moveLeft = false; 
				break;
			case 83: // s
				moveBackward = false;
				break;
			case 68: // d
				moveRight = false;
				break;
			case 38: // up
				carForward = false;
				break;
			case 37: // left
				carLeft = false; 
				break;
			case 40: // down
				carBackward = false;
				break;
			case 39: // right
				carRight = false;
				break;
			case 32: // space
				if ( canJump === false ) velocity.y += 350;
				canJump = false;
				break;
		}
	};
	
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
	
	// floor
	geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
	geometry.rotateX( - Math.PI / 2 );
	for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
		var vertex = geometry.vertices[ i ];
		vertex.x += Math.random() * 20 - 10;
		vertex.y += Math.random() * 2;
		vertex.z += Math.random() * 20 - 10;
	}
	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
	}
	material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
	
	// objects
	
	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};
	var texture = new THREE.Texture();
	
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) {
	};
	
	// Lexus texture
	var loader = new THREE.ImageLoader( manager );
	loader.load( 'Lexus/Lexus/Lexus jpg.jpg', function ( image ) {
		texture.image = image;
		texture.needsUpdate = true;
	} );
	
	
	// Car models //
	
	// Lexus
	var loader = new THREE.OBJLoader( manager );
	loader.load( 'Lexus/Lexus/lexus_hs.obj', function ( object1 ) {
		object1.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material.map = texture;
			}
		} );
		object1.position.x = 10;
		object1.position.y=1.3;
		object1.rotation.y=(-115*Math.PI/180);
		scene.add( object1 );
		car = object1;
	}, onProgress, onError );
	
	// Ship
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setBaseUrl( 'Kameri/' );
	mtlLoader.setPath( 'Kameri/' );
	mtlLoader.load( 'Kameri_explorer_flying.mtl', function( materials ) {
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials( materials );
		objLoader.setPath( 'Kameri/' );
		objLoader.load( 'Kameri explorer flying.obj', function ( object3 ) {
			object3.position.y=10;
			object3.position.x=1.3;
			object3.position.z=150;
			scene.add( object3 );
			ship = object3;
		}, onProgress, onError );
	});
	
	// City models //
	
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setBaseUrl( 'City/' );
	mtlLoader.setPath( 'City/' );
	mtlLoader.load( 'The_City.mtl', function( materials ) {
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials( materials );
		objLoader.setPath( 'City/' );
		objLoader.load( 'City.obj', function ( object ) {
			object.position.y = -39;
			scene.add( object );
		}, onProgress, onError );
		
	});
	

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	
	window.addEventListener( 'resize', onWindowResize, false );
	animate();
}