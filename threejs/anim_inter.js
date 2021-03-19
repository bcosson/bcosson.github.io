/*
** Seminario #2: Grafo de escena 
*/

// Variables globales estandar
var renderer, scene, camera, cameraControls;

// Objetos
var esfera, cubo, conjunto;


// Variables dependientes del tiempo
var angulo=0;
var antes=Date.now();


// Acciones
init();
loadScene();
render();



function init() {
	// Funcion de inicializacion de motor, escena y camara

	// Motor de render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	//renderer.setClearColor(new THREE.Color(0x000000));
	renderer.setClearColor("#e5e5e5");

	document.getElementById('container').appendChild(renderer.domElement);



	// Escena
	scene = new THREE.Scene();



	// Camara
	var aspectRatio = window.innerWidth/window.innerHeight;

	camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

	camera.position.set(1,2,8);
	//camera.position.z = 5;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	//camera.rotation.x = -Math.PI/6;

	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0, 0, 0);

	window.addEventListener('resize', updateAspectRatio );
}

function loadScene() {
	// Construir el grafo de escena(DAG)
	// - Objetos (geometria, material)
	// - Transformaciones 
	// - Organizar el grafo

	// Contenedor de un cubo y una esfera
	conjunto = new THREE.Object3D();
	conjunto.position.y = 1;

	// Cubo
	var geoCubo = new THREE.BoxGeometry(2,2,2);
	var matCubo = new THREE.MeshBasicMaterial({color:'green',wireframe:true});
	var cubo = new THREE.Mesh(geoCubo, matCubo);
	cubo.position.x = 2;

	// Esfera
	var geoEsfera1 = new THREE.SphereGeometry(2, 50, 50);
	
	var textura = new THREE.ImageUtils.loadTexture( 'images/Earth.jpg' );
	
	var material1 = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors, map: textura, side: THREE.DoubleSide});
	var material2 = new THREE.MeshBasicMaterial({color:'white', wireframe: false});
	
	esfera = new THREE.Mesh(geoEsfera1, material2);
	esfera.position.x=1;
	esfera.position.y=1;
	esfera.position.z=-5;


	
	// Suelo
	var geoSuelo = new THREE.PlaneGeometry(10,10,12,12);
	var matSuelo = new THREE.MeshBasicMaterial({color:'red', wireframe: true});
	var suelo = new THREE.Mesh(geoSuelo, matSuelo);
	suelo.rotation.x = -Math.PI/2;
	suelo.position.y = -1;

	// Objeto importado 
	
	var loader = new THREE.ObjectLoader();
	loader.load( 'models/soldado/soldado.json', 
		         function (objeto){
					my_scale=0.8;
					//objeto.scale.set(0.8,0.8,0.8);
					objeto.scale.set(my_scale,my_scale,my_scale);
                    objeto.position.y = -1;
					objeto.rotation.y = 0;
					//objeto.material = new THREE.MeshLambertMaterial({color: 0x555555});
					//objeto.rotation.z = 2*Math.PI;
		         	cubo.add(objeto);
		         }); 




	 //var Pawn1 = new THREE.ObjectLoader();


	/*Pawn1.load( 'models/Chess/chess.json', 
		         function (obj){

			//my_scale=0.15;
          	//obj.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
          	//obj.material.color.setHex(0x342900);
			//objeto.scale.set(0.8,0.8,0.8);
			obj.scale.set(my_scale,my_scale,my_scale);
          	//var tx_pawn = new THREE.TextureLoader().load('models/Chess/wood512.jpg');


          	//var txsoldado = new THREE.TextureLoader().load('models/soldado/soldado.png');
			//obj.material.setValues({map:txsoldado});
          	//obj.position.set(0,0.1,0.5);          
          	scene.add(obj);
		         });*/



				 
	// Texto
	var my_str ='TIERRA';

	var fontLoader = new THREE.FontLoader();


	fontLoader.load( 'fonts/helvetiker_bold.typeface.json',
		             function(font){
						var geoTexto = new THREE.TextGeometry(my_str,	
						{
							size: 0.4,
							height: 0.1,
							curveSegments: 3,
							style: "normal",
							font: font,
							//bevelThickness: 0.05,
							//bevelSize: 0.04,
							bevelEnabled: false
						});
						 
		             	var matTexto = new THREE.MeshBasicMaterial({color:'blue'});
		             	var texto = new THREE.Mesh(geoTexto, matTexto);
		             	scene.add(texto);
						 texto.position.x = -1;
						 texto.position.y = 3;
						 texto.rotation.y=1;
						 //texto.position.z = 0;
		             });


	// Grafo


	conjunto.add(cubo);
	//cubo.add(esfera);

	scene.add(conjunto);

	scene.add(esfera);

	scene.add(new THREE.AxesHelper(3));
	scene.add(suelo);
	

}

function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}


function update()
{
	// Cambiar propiedades entre frames

	angulo += Math.PI/1000;
	//esfera.rotation.y = angulo;
	conjunto.rotation.y = angulo;

	cameraControls.update();
}

function render() {
	// Blucle de refresco
	requestAnimationFrame(render);
	update();
	renderer.render(scene, camera);
}
