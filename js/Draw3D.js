var scene,
    camera, 
    renderer,
    element,
    container,
    effect,
    video,
    canvas,
    context,
    themes = [],//['blackandwhite', 'sepia', 'arcade', 'inverse'],
    currentTheme = 0,
    lookingAtGround = false;


var init = function() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 700);
  camera.position.set(0, 15, 0);
  scene.add(camera);

  renderer = new THREE.WebGLRenderer();
  element = renderer.domElement;
  container = document.getElementById('webglviewer');
  container.appendChild(element);

  effect = new THREE.StereoEffect(renderer);

  element.addEventListener('click', fullscreen, false);

  video = document.querySelector('video');

  canvas = document.createElement('canvas');
  canvas.width = video.clientWidth;
  canvas.height = video.clientHeight;
  canvas.width = nextPowerOf2(canvas.width);
  canvas.height = nextPowerOf2(canvas.height);


  context = canvas.getContext('2d');
  texture = new THREE.Texture(canvas);
  texture.context = context;
  
  // If you do not use powersOf2, or you want to adjust things more, you could use these:
  //texture.minFilter = THREE.LinearMipMapLinearFilter;
  //texture.magFilter = THREE.NearestFilter;

  var cameraPlane = new THREE.PlaneGeometry(1920, 1280);

  cameraMesh = new THREE.Mesh(cameraPlane, new THREE.MeshBasicMaterial({
    color: 0xffffff, opacity: 1, map: texture
  }));
  cameraMesh.position.z = -600;

  scene.add(cameraMesh);
}

var nextPowerOf2 = function(x) { 
    return Math.pow(2, Math.ceil(Math.log(x) / Math.log(2))); 
}

var animate = function() {
  if (context) {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      texture.needsUpdate = true;
    }
  }

  requestAnimationFrame(animate);

  update();
  render();
}

var resize = function() {
  var width = container.offsetWidth;
  var height = container.offsetHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  effect.setSize(width, height);
}

var update = function(dt) {
  resize();

  camera.updateProjectionMatrix();
}

var render = function(dt) {
  effect.render(scene, camera);
}

var fullscreen = function() {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  } else if (container.mozRequestFullScreen) {
    container.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}