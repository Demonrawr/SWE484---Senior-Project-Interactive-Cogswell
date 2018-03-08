function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	
	if ( controlsEnabled ) {
		raycaster.ray.origin.copy( controls.getObject().position );
		raycaster.ray.origin.y -= 10;
		var intersections = raycaster.intersectObjects( objects );
		var isOnObject = intersections.length > 0;
		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;
		
		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;
		
		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
		
		if ( moveForward ) velocity.z -= 350.0 * delta;
		if ( moveBackward ) velocity.z += 350.0 * delta;
		if ( moveLeft ) velocity.x -= 350.0 * delta;
		if ( moveRight ) velocity.x += 350.0 * delta;
		if ( rotate ) car.rotation.y += camera.position.x * .005;
		if ( carForward ) car.position.z -= .75;
		if ( carBackward ) car.position.z += .75;
		if ( carLeft ) car.position.x -= .75;
		if ( carRight ) car.position.x += .75;
		if ( isOnObject === true ) {
			velocity.y = Math.max( 0, velocity.y );
			canJump = true;
		}

		
		controls.getObject().translateX( velocity.x * delta );
		controls.getObject().translateY( velocity.y * delta );
		controls.getObject().translateZ( velocity.z * delta );
		if ( controls.getObject().position.y < 10 ) {
			velocity.y = 0;
			controls.getObject().position.y = 10;
			canJump = true;
		}
		//animates 
		//ship.position.z -= time*.000005; 
	
		renderer.clear();
		renderer.render( scene, camera );
		
		prevTime = time;
	}
	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}