
//console.log(`This is ==> ${aaa} `);

var renderer, scene, camera;
var cameraControls;




var square_side=0.75;
var Tiles=[[],[],[],[],[],[],[],[]];
var Pieces={"whites":[],"blacks":[]};
var objs=[];


var pawn_move=[];

init();

loadBoard();

loadPieces();
render();

//scene.add(new THREE.AxesHelper(3));
  

//position.set(x=red,y=green,z=blue);







function init()
{
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( new THREE.Color(0x0000FF) );
    document.getElementById('container').appendChild( renderer.domElement );

    scene = new THREE.Scene();

    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 50, aspectRatio , 0.1, 100 );
    camera.position.set( -6, 5, 3 );

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(square_side*4, 0, square_side*4);

    window.addEventListener('resize', updateAspectRatio );

    renderer.domElement.addEventListener('dblclick',move);
}







function loadBoard()
{
    
    var Board =new THREE.Object3D();
    Board.name="board";
    var geometryTile = new THREE.BoxGeometry( square_side, 0.1, square_side );

    var materialTileBlack = new THREE.MeshBasicMaterial( {color: 0x38240F} );
    var materialTileWhite = new THREE.MeshBasicMaterial( {color: 0xB0A89E} );

    var x_i=0,y_i=0,z_i=0,n=0,i=0,j=0,c=1;
    var Tile_i;
    var json_tile_i;
    var ranges=['A','B',"c","d","e","f","g","h"];
    

    //////////////////////   LOADING ALL THE TILES + (letras y numeros)   ///////////////////////

    for (i=0;i<8;i++)
    {      
        for (j=0;j < 8;j++)
        {
            json_tile_i = {"number": n , "is_on" : ""}

            if (c==1) Tile_i = new THREE.Mesh(geometryTile, materialTileBlack);
            else Tile_i = new THREE.Mesh(geometryTile, materialTileWhite);

            if (j!=7) c=-c;

            json_tile_i["Tile"]=Tile_i;
            json_tile_i["column"]=j+1;
            json_tile_i["row"]=i+1;
            

            Tile_i.position.set(x_i,y_i,z_i);

            z_i= z_i + square_side;

            Tiles[i].push(json_tile_i);

        
            Board.add(Tile_i)
            n++;
        } // end for_j(8)

        x_i = x_i + square_side;
        z_i=0;

        
    } // end for_i(8) (total of 64)
    scene.add(Board)

    var fontLoader = new THREE.FontLoader();

    var matTexto = new THREE.MeshBasicMaterial({color:'red'});
    var k=0;
    x_i=-0.20;
        fontLoader.load( 'fonts/helvetiker_bold.typeface.json', function(font){
        var geoTexto1 = new THREE.TextGeometry("A B C D E F G H",
        {
            size: 0.55,
            height: 0.1,
            curveSegments: 3,
            style: "normal",
            font: font,
            //bevelThickness: 0.05,
            //bevelSize: 0.04,
            bevelEnabled: false
        });
        var letras = new THREE.Mesh(geoTexto1, matTexto);
        
        letras.rotation.x=(-Math.PI/2);
        letras.rotation.z=(-Math.PI/2);
        letras.rotation.y=(-0.3 *Math.PI/2);  
        
        letras.position.set(6.2,0.2,-0.2);
     
        scene.add(letras);

        });

        fontLoader.load( 'fonts/helvetiker_bold.typeface.json', function(font){
        var geoTexto2 = new THREE.TextGeometry("8\n7\n6\n5\n4\n3\n2\n1",
        {
            size: 0.48,
            height: 0.1,
            curveSegments: 3,
            style: "normal",
            font: font,
            bevelEnabled: false
        });

        var numeros = new THREE.Mesh(geoTexto2,matTexto);

        numeros.rotation.z=(3*Math.PI/2); 
        numeros.rotation.x=(-0.8*Math.PI/2);  


        numeros.position.set(5.1,0.1,-square_side*1.3);
        
        scene.add(numeros);
        });


    /*
    var geometryTile = new THREE.BoxGeometry( 0.5, 0.1, 0.5 );
    materialTile1 = new THREE.MeshBasicMaterial( {color: 0x000000} );
    var Tile1 = new THREE.Mesh( geometryTile, materialTile1 );
    Tile1.position.set(0,0,0);
    scene.add(Tile1);
    materialTile2 = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    var Tile2 = new THREE.Mesh( geometryTile, materialTile2 );

    Tile2.position.set(0.5,0,0);
    scene.add(Tile2);*/

} // end loadBoard()






//////////////////////  LOADING ALL THE PIECES   ///////////////////

function loadPieces()
{
    var loader = new THREE.ObjectLoader();

                    ////   LIGHT    /////
    loader.load( 'models/Chess/pawnL.json', 
        function (obj){
                        my_scale=0.2;
                        obj.scale.set(my_scale,my_scale,my_scale);

                        obj.position.set(-1,10,-1);          

                        scene.add(obj);
                    }); 


                    //// LOADING Rooks, Knights, Bishops   ////
    var total1=0,total2=0,total3=1,total4=1,total5=2,total6=2;
    for (var k=0;k<2;k++){
        loader.load( 'models/Chess/rookW.json', 
        function (obj){
                        
                        my_scale=0.2;
                        obj.scale.set(my_scale,my_scale,my_scale);

                        obj.position.set(0,0,-0.4);          

                        Tiles[0][total1]["Tile"].add(obj);
                        Tiles[0][total1]["is_on"] = "rookW";
                        total1=7;

                        obj.name="rookw1";

                        Pieces["whites"].push({"name":obj.name,"id" : obj.id,"alive":true});
                    });
        loader.load( 'models/Chess/rookB.json', 
        function (obj){
                        

                        my_scale=0.2;
                        obj.scale.set(my_scale,my_scale,my_scale);

                        obj.position.set(0,0,-0.4);          


                        Tiles[7][total2]["Tile"].add(obj);
                        Tiles[7][total2]["is_on"] = "rookB";
                        total2=7;

                        Pieces["blacks"].push({"name":obj.name,"id" : obj.id,"alive":true});
                    });

    loader.load( 'models/Chess/knightB.json', 
    function (obj){
                    
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.rotation.y=Math.PI/2;
                    obj.position.set(-0.4,0,-0.38);        
                    
                    Tiles[7][total3]["Tile"].add(obj);
                    Tiles[7][total3]["is_on"] = "knightB";
                    total3=6;

                    Pieces["blacks"].push({"name":obj.name,"id" : obj.id,"alive":true});
                });
    loader.load( 'models/Chess/knightW.json', 
    function (obj){
                    
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.rotation.y=-Math.PI/2;
                    obj.position.set(0.4,0,0.38);        
                    
                    Tiles[0][total4]["Tile"].add(obj);
                    Tiles[0][total4]["is_on"] = "knightW";
                    total4=6;

                    Pieces["whites"].push({"name":obj.name,"id" : obj.id,"alive":true});
                });

    loader.load( 'models/Chess/bishopB.json', 
    function (obj){
                    
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(0.8,0,-0.4);        
                    

                    Tiles[7][total5]["Tile"].add(obj);
                    Tiles[7][total5]["is_on"] = "bishopB";
                    total5=5;

                    Pieces["blacks"].push({"name":obj.name,"id" : obj.id,"alive":true});
                });
                
    loader.load( 'models/Chess/bishopW.json', 
    function (obj){
                    
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(0.8,0,-0.4);        
                    
                    Tiles[0][total6]["Tile"].add(obj);
                    Tiles[0][total6]["is_on"] = "bishopW";
                    total6=5;

                    Pieces["whites"].push({"name":obj.name,"id" : obj.id,"alive":true});
                });

    }//end for(2)



                        ////  LOADING Queens, Kings      /////
    loader.load( 'models/Chess/queenB.json', 
    function (obj){
                    
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(1.2,0,-0.4);        
                    
                    Tiles[7][3]["Tile"].add(obj);
                    Tiles[7][3]["is_on"] = "queenB";

                    Pieces["blacks"].push({"name":obj.name,"id" : obj.id,"alive":true});
                    
                });

    loader.load( 'models/Chess/queenW.json', 
    function (obj){
                    
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(1.2,0,-0.4);        
                    
                    Tiles[0][3]["Tile"].add(obj);
                    Tiles[0][3]["is_on"] = "queenW";
                    
                    Pieces["whites"].push({"name":obj.name,"id" : obj.id,"alive":true});
                    
                });

    loader.load( 'models/Chess/kingB.json', 
    function (obj){
                    
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(1.6,0,-0.4);        
                
                    Tiles[7][4]["Tile"].add(obj);
                    Tiles[7][4]["is_on"] = "kingB";

                    Pieces["blacks"].push({"name":obj.name,"id" : obj.id,"alive":true});
                    
                });

    loader.load( 'models/Chess/kingW.json', 
    function (obj){
                    
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(1.6,0,-0.4);        
                    
                    Tiles[0][4]["Tile"].add(obj);
                    Tiles[0][4]["is_on"] = "kingW";

                    Pieces["whites"].push({"name":obj.name,"id" : obj.id,"alive":true});
                    
                });

                    
                    
                    
                    
        ///////////////           LOADING ALL PAWNS          /////////////
                    
    var zz1=0;
    var zz2=0;

    for (var p=0;p<8;p++)
    {
        console.log(`p = ${p} `);
        loader.load( 'models/Chess/pawnW.json', 
            function (obj){
                            
                            my_scale=0.2;
                            obj.scale.set(my_scale,my_scale,my_scale);

                            obj.position.set(0,0,0);          

                            Tiles[1][zz1]["Tile"].add(obj);
                            Tiles[1][zz1]["is_on"] = "pawnW";
                            zz1++;

                            objs.push(obj);
                            Pieces["whites"].push({"name":obj.name,"id" : obj.id,"alive":true});
                            

                                pawn_move.push(new TWEEN.Tween(obj.position).
                                    to( {x: [0,obj.position.x + square_side/2,obj.position.x + square_side],
                                        y: [0,1,0],
                                        z: [0,0,0]}, 1000));
                                        //pawn_move.easing( TWEEN.Easing.Bounce.Out );
                                        //pawn_move[p].interpolation( TWEEN.Interpolation.Bezier );
                                        //pawn_move[p].start();
                   

                        console.log(`This is id = ${obj.id} `);
                        });

        loader.load( 'models/Chess/pawnB.json', 
            function (obj){
                            
                            my_scale=0.2;

                            obj.scale.set(my_scale,my_scale,my_scale);

                            obj.position.set(0,0,0);          

                            Tiles[6][zz2]["Tile"].add(obj);
                            Tiles[6][zz2]["is_on"] = "pawnB";
                            zz2++;

                            objs.push(obj);
                            Pieces["blacks"].push({"name":obj.name,"id" : obj.id,"alive":true});
                            console.log(`This is id = ${obj.id} `);
                        });

    }//end for(8)


}//end loadPieces()



function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function update()
{
    // Cambios para actualizar la camara segun mvto del raton
    cameraControls.update();
    TWEEN.update();
    // Movimiento propio del cubo
	//cubo.rotateOnAxis( new THREE.Vector3(0,1,0), angulo );
}

function move(event) // ++++++++++++++++++++++++++++++++++++++++
{
    // Callback de atencion al doble click

    // Localizar la posicion del doble click en coordenadas de ventana
    var x = event.clientX;
    var y = event.clientY;

    
    
    // Normalizar al espacio de 2x2 centrado
    x = x * 2/window.innerWidth - 1;
    y = -y * 2/window.innerHeight + 1;


    // Construir el rayo que pasa por el punto de vista y el punto x,y
    var rayo = new THREE.Raycaster();
    rayo.setFromCamera( new THREE.Vector2(x,y), camera);

    // Calcular interseccion con objetos de la escena
    var interseccion = rayo.intersectObjects(scene.children, true);
    if( interseccion.length > 0)
    {
        // Ver si es el soldado
        var aaa=interseccion[0].object.name;
        var bbb=interseccion[0].object.id;
        var idas1=[],idas2=[];
        for (var l=0;l<16;l++){idas1.push(Pieces["whites"][l]["id"]  );idas2.push(Pieces["blacks"][l]["id"]  );}
        
        console.log(`This is ==> ${aaa} et ${bbb} \n`);

        console.log(`et \nWHITES : ${idas1} \n BLACKS : ${idas2}`); 
        for (var l=0;l<15;l++){console.log(`${objs[l].id} \n`) ;}

        //console.log(`This is ==> ${aaa} et ${bbb} et \nWHITES : ${idas1} \n BLACKS : ${idas2} `);
        if(interseccion[0].object.name == "pawnW")
        {
            //salto.chain(volver);
            //pawn_move[7].start();
            Tiles[4][4]["Tile"].add(objs[2]);
        }
    }

}

function render()
{
	requestAnimationFrame(render);
	update();

    renderer.clear();

	renderer.render(scene, camera);
}