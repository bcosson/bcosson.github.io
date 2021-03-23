var renderer, scene, camera,minicam;
var cameraControls, effectControls;


var Showing=false;

var square_side=0.75;
var Tiles=[[],[],[],[],[],[],[],[]];


var Pieces_B=[];
var Pieces_W=[];

var To_Move=[];
var Green_Tiles=[];


var pawn_move=[];

var material_bar;
var spot ;





init();

loadBoard();

loadPieces();

setupGUI();

render();



//scene.add(new THREE.AxesHelper(3));
//position.set(x=red,y=green,z=blue);







function init()
{
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( new THREE.Color(0x0000FF) );
    renderer.shadowMap.enabled = true;
    renderer.autoClear = false;
    document.getElementById('container').appendChild( renderer.domElement );

    scene = new THREE.Scene();

    var aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 75, aspectRatio , 0.1, 100 );
    camera.position.set( -6, 5, 3 );

    scene.add(camera);


	minicam = new THREE.OrthographicCamera(-1.5,6.5, 7, -1, -10, 100);
	minicam.position.set(0,1,0);
    minicam.up.set(1,0,0);
    minicam.lookAt(0,-1,0);

	scene.add(minicam);
	minicam.visible = false;

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(2.625, 0.1, 2.625);


    window.addEventListener('resize', updateAspectRatio );



  ///////////////////////////////////// LIGHTS ////////////////////////////////
    
    var Ambient_Light = new THREE.AmbientLight(0x222222);

	spot= new THREE.SpotLight( 0xFFFFFF, 1 );
	spot.position.set(-3,10,6 );
	spot.target.position.set( 3,0,3 );
    scene.add( spot.target )

	spot.angle = Math.PI/7;	
	spot.castShadow = true;
    // spot.add(new THREE.AxesHelper(3));

    var Hemisphere_Light = new THREE.HemisphereLight(0xFFFFFF,0xFFFFFF, 0.6);

	scene.add(Ambient_Light, spot, Hemisphere_Light);


    window.addEventListener( 'resize', updateAspectRatio );
    renderer.domElement.addEventListener('dblclick',move);


    //////////////////////// entorno //////////////////////////////
    var path = "images/";
    var entorno = [ path+"posx.jpg" , path + "negx.jpg",
    path+"posy.jpg" , path + "negy.jpg",
    path+"posz.jpg" , path + "negz.jpg"];

    var texEsfera = new THREE.CubeTextureLoader().load( entorno );

    var shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = texEsfera;

    var matParedes = new THREE.ShaderMaterial( {
                        vertexShader: shader.vertexShader,
                        fragmentShader: shader.fragmentShader,
                        uniforms: shader.uniforms,
                        depthWrite: false,
                        side: THREE.BackSide
    } );

    var habitacion = new THREE.Mesh( new THREE.CubeGeometry(100,100,100), matParedes );
    habitacion.name = '';
    scene.add(habitacion)
}







function loadBoard()
{
    
    var Board =new THREE.Object3D();
    Board.name="board";

    
    geometry_bar=new THREE.BoxGeometry(square_side*9.195,0.1,0.45);
    material_bar = new THREE.MeshPhongMaterial( {color: 0x000000} );

    bar_1 = new THREE.Mesh(geometry_bar, material_bar);
    bar_2 = new THREE.Mesh(geometry_bar, material_bar);
    bar_3 = new THREE.Mesh(geometry_bar, material_bar);
    bar_4 = new THREE.Mesh(geometry_bar, material_bar);

    bar_2.rotation.y = Math.PI/2;
    bar_3.rotation.y = Math.PI/2;

    bar_1.position.set (2.63,0,-0.6);
    bar_2.position.set (5.85,0,2.63);
    bar_3.position.set (-0.6,0,2.63);
    bar_4.position.set (2.62,0,5.85);


    Board.add(bar_1,bar_2,bar_3,bar_4);


    geometryTile = new THREE.BoxGeometry( square_side, 0.1, square_side );
    materialTileBlack = new THREE.MeshLambertMaterial( {color: 0x38240F} );
    materialTileWhite = new THREE.MeshLambertMaterial( {color: 0xB0A89E} );

    
    
    
    var letras=['A','B',"C","D","E","F","G","H"];


    var Tile_i;
    var json_tile_i;



    var fontLoader = new THREE.FontLoader();


    var matTexto = new THREE.MeshPhongMaterial({color:'yellow',
                                                specular: 'gray',
                                                shininess: 40 });

    




//################################################################################



//################################################################################
    var x_i=0,y_i=0,z_i=0;
    var n=0,i=0,j=0,last_tile=1;
    var x_i2 =-2.85;
    var k=1,l=0;
    ////////////////////////////////////   LOADING ALL THE TILES + (letras y numeros)   ///////////////////////////////////
    
    for (i=0;i<8;i++)
    {      
        for (j=0;j < 8;j++)
        {
            json_tile_i = {"number": n , "is_on" : ""}

            if (last_tile==1) Tile_i = new THREE.Mesh(geometryTile, materialTileBlack);
            else Tile_i = new THREE.Mesh(geometryTile, materialTileWhite);

            if (j!=7) last_tile = -last_tile;


            Tile_i.position.set(x_i,y_i,z_i);
            Tile_i.receiveShadow= true;

            json_tile_i["Tile"]=Tile_i;
            json_tile_i["column"]=letras[j];
            json_tile_i["row"]=i+1;

            z_i= z_i + square_side;

            Tiles[i].push(json_tile_i);

        
            Board.add(Tile_i)
            
            n++;
        } // end for_j(8)

        x_i = x_i + square_side;
        z_i=0;

        /// Loading letra_i on bar_1 and numero_i on bar_2 ///
        fontLoader.load( 'fonts/helvetiker_bold.typeface.json', function(font)
        {
            
            
            geoTexto1 = new THREE.TextGeometry(String(k),
            {
                size: 0.4,
                height: 0.1,
                curveSegments: 3,
                style: "normal",
                font: font,
                bevelThickness: 0.05,
                bevelSize: 0.04,
                bevelEnabled: false,
            });
            letra_i = new THREE.Mesh(geoTexto1, matTexto);
            
            letra_i.rotation.x=(-Math.PI/2);
            letra_i.rotation.z=(-Math.PI/2);
        
            letra_i.position.set(x_i2,0,-0.2);
            
            bar_1.add(letra_i);
        
        });

        fontLoader.load( 'fonts/helvetiker_bold.typeface.json', function(font)
        {
            
            
            geoTexto1 = new THREE.TextGeometry(String(letras[k-1]),
            {
                size: 0.3,
                height: 0.1,
                curveSegments: 3,
                style: "normal",
                font: font,
                bevelThickness: 0.05,
                bevelSize: 0.04,
                bevelEnabled: false,
            });
            numero_i = new THREE.Mesh(geoTexto1, matTexto);
            
            numero_i.rotation.x=(Math.PI/2);
            numero_i.rotation.y=(Math.PI);
        

            numero_i.position.set(-x_i2-0.1,0.01,-0.2);
            x_i2 = x_i2 + square_side;
            k++;
            
         
            bar_2.add(numero_i);
        
        });


        
    } // end for_i(8) (total of 64) --> now all tiles, letters and numbers are added to Board

        scene.add(Board)

} // end loadBoard()





// =============================================================================================================================
// =================================================  LOADING ALL THE PIECES   =================================================
// =============================================================================================================================
function loadPieces()
{
    var loader = new THREE.ObjectLoader();


///////////////////////////////////////// LOADING Rooks, Knights, Bishops (two items for each color)  /////////////////////////////////////////
    var total1=0,total2=0,total3=1,total4=1,total5=2,total6=2;
    // those variables are used to place the pieces on the correct tile

    for (var k=0;k<2;k++)
    {
        loader.load( 'models/Chess/rookW.json', 
        function (obj){
                        obj.name="rookW";
                        
                        my_scale=0.2;
                        obj.scale.set(my_scale,my_scale,my_scale);

                        obj.position.set(0,0,-0.4);
                        
                        obj.castShadow=true;
                        obj.recieveShadow=true;

                        Tiles[0][total1]["Tile"].add(obj);
                        Tiles[0][total1]["is_on"] = "rookW";
                        Tiles[0][total1]["obj"] = obj;
                        

                        

                        Pieces_W.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":0,"j":total1,"alive":true});
                        total1=7;                    
                    });

                    
        loader.load( 'models/Chess/rookB.json', 
        function (obj){
                        obj.name="rookB";

                        my_scale=0.2;
                        obj.scale.set(my_scale,my_scale,my_scale);

                        obj.position.set(0,0,-0.4);
                        
                        obj.castShadow=true;
                        obj.recieveShadow=true;


                        Tiles[7][total2]["Tile"].add(obj);
                        Tiles[7][total2]["is_on"] = "rookB";
                        Tiles[7][total2]["obj"] = obj;
                        


                        Pieces_B.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":7,"j":total2,"alive":true});
                        total2=7;
                    });


        loader.load( 'models/Chess/knightB.json', 
        function (obj){ 
                    obj.name="knightB";
                    
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.rotation.y=Math.PI/2;
                    obj.position.set(-0.4,0,-0.38);
                    
                    obj.castShadow=true;
                    obj.recieveShadow=true;
                    
                    Tiles[7][total3]["Tile"].add(obj);
                    Tiles[7][total3]["is_on"] = "knightB";
                    Tiles[7][total3]["obj"] = obj;
                    
                    
                    
                    Pieces_B.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":7,"j":total3,"alive":true});
                    total3=6;
                });


        loader.load( 'models/Chess/knightW.json', 
        function (obj){
                    obj.name="knightW";
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.rotation.y=-Math.PI/2;
                    obj.position.set(0.4,0,0.38);
                    
                    obj.castShadow=true;
                    obj.recieveShadow=true;
                    
                    Tiles[0][total4]["Tile"].add(obj);
                    Tiles[0][total4]["is_on"] = "knightW";
                    Tiles[0][total4]["obj"] = obj;
                    

                    Pieces_W.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":0,"j":total4,"alive":true});

                    total4=6;
                });


        loader.load( 'models/Chess/bishopB.json', 
        function (obj){
                    obj.name="bishopB";
                    
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(0.8,0,-0.4);
                    
                    obj.castShadow=true;
                    obj.recieveShadow=true;
                    

                    Tiles[7][total5]["Tile"].add(obj);
                    Tiles[7][total5]["is_on"] = "bishopB";
                    Tiles[7][total5]["obj"] = obj;
                    

                    Pieces_B.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":7,"j":total5,"alive":true});
                    total5=5;
                });
                
        loader.load( 'models/Chess/bishopW.json', 
        function (obj){

                   obj.name="bishopW";
                    
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(0.8,0,-0.4);
                    
                    obj.castShadow=true;
                    obj.recieveShadow=true;
                    
                    Tiles[0][total6]["Tile"].add(obj);
                    Tiles[0][total6]["is_on"] = "bishopW";
                    Tiles[0][total6]["obj"] = obj;
                    

                    Pieces_W.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":0,"j":total6,"alive":true});
                    total6=5;
                });

    }//end for(2)



    /////////////////////////////////////     LOADING Queens, Kings      /////////////////////////////////////
    loader.load( 'models/Chess/queenB.json', 
    function (obj){

                    obj.name="queenB";

                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(1.2,0,-0.4);
                    
                    obj.castShadow=true;
                    obj.recieveShadow=true;
                    
                    Tiles[7][3]["Tile"].add(obj);
                    Tiles[7][3]["is_on"] = "queenB";
                    Tiles[7][3]["obj"] = obj;

                    Pieces_B.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":7,"j":3,"alive":true});
                    
                });

    loader.load( 'models/Chess/queenW.json', 
    function (obj){
                    obj.name="queenW";
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(1.2,0,-0.4);
                    
                    obj.castShadow=true;
                    obj.recieveShadow=true;
                    
                    Tiles[0][3]["Tile"].add(obj);
                    Tiles[0][3]["is_on"] = "queenW";
                    Tiles[0][3]["obj"] = obj;
                    
                    Pieces_W.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":0,"j":3,"alive":true});
                    
                });

    loader.load( 'models/Chess/kingB.json', 
    function (obj){
                    obj.name="kingB";
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(1.6,0,-0.4);
                    
                    obj.castShadow=true;
                    obj.recieveShadow=true;
                
                    Tiles[7][4]["Tile"].add(obj);
                    Tiles[7][4]["is_on"] = "kingB";
                    Tiles[7][4]["obj"] = obj;

                    Pieces_B.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":7,"j":4,"alive":true});
                    
                });

    loader.load( 'models/Chess/kingW.json', 
    function (obj){
                    obj.name="kingW";
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(1.6,0,-0.4);
                    
                    obj.castShadow=true;
                    obj.recieveShadow=true;
                    
                    Tiles[0][4]["Tile"].add(obj);
                    Tiles[0][4]["is_on"] = "kingW";
                    Tiles[0][4]["obj"] = obj;

                    Pieces_W.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":0,"j":4,"alive":true});
                    
                });

                    
                    
                    
                    
////////////////////////////////////////////////    LOADING ALL PAWNS    //////////////////////////////////////////////////
                    
    var zz1=0,zz2=0;

    for (var p=0;p<8;p++)
    {
        loader.load( 'models/Chess/pawnW.json', 
            function (obj){
                            obj.name="pawnW";
                            
                            my_scale=0.2;
                            obj.scale.set(my_scale,my_scale,my_scale);

                            obj.position.set(0,0,0);   
                            
                            obj.castShadow=true;
                            obj.recieveShadow=true;

                            Tiles[1][zz1]["Tile"].add(obj);
                            Tiles[1][zz1]["is_on"] = "pawnW";
                            Tiles[1][zz1]["obj"] = obj;
                            

                            Pieces_W.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":1,"j":zz1,"alive":true});
                            
                   

                            zz1++;
                        });


        loader.load( 'models/Chess/pawnB.json', 
            function (obj){
                            obj.name="pawnB";
                            
                            my_scale=0.2;
                            obj.scale.set(my_scale,my_scale,my_scale);

                            obj.position.set(0,0,0);          

                            obj.castShadow=true;
                            obj.recieveShadow=true;

                            Tiles[6][zz2]["Tile"].add(obj);
                            Tiles[6][zz2]["is_on"] = "pawnB";
                            Tiles[6][zz2]["obj"] = obj;
                            

                            Pieces_B.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":6,"j":zz2,"alive":true});

                            zz2++;
                        });

    }//end for(8)


}//end loadPieces() --> All pieces are the correct Tile







function show_green_cubes(coords,old_x,old_y)
{
    for (var k=0;k<coords.length;k++)
    {

        geometryC = new THREE.BoxGeometry(0.6, 0.01, 0.6 );
        materialC = new THREE.MeshBasicMaterial( { color: 0x03B600 } );
        cube = new THREE.Mesh( geometryC, materialC );

        cube.position.y=0.07;
        cube.name="confirmation_cube";

        var json_data={"id":cube.id,
                        "i":coords[k][0] , "j":coords[k][1],
                        "old_i":old_x , "old_j":old_y,
                        "cube":cube};

        

        Green_Tiles.push(json_data);
            

        Tiles[coords[k][0]][coords[k][1]]["Tile"].add( cube );
    }
    Showing=true;

}


function show_possible_moves(objeto)
{

    Clear_green_cubes();

    if (objeto["name"]=="pawnW" ){pawnW_possible_moves(objeto);}

    else if (objeto["name"]=="pawnB") {if (Showing==false) pawnB_possible_moves(objeto);}

    else if (objeto["name"].includes("knight")) {if (Showing==false) knightW_possible_moves(objeto);}

    else if (objeto["name"].includes("king")) {if (Showing==false) kingW_possible_moves(objeto);}

    else if (objeto["name"].includes("rook")) {if (Showing==false) rookW_possible_moves(objeto);}

    else if (objeto["name"].includes("bishop")) {if (Showing==false) bishopW_possible_moves(objeto);}

    else if (objeto["name"].includes("queen")) {if (Showing==false) queenW_possible_moves(objeto);}


    else {Clear_green_cubes(); }


}



function pawnB_possible_moves(pawn)
{

    if (Showing==true ) { if (To_Move[0].id + 1 != pawn["id"]) Clear_green_cubes();}
    var x=pawn["i"],y=pawn["j"];

    var pos=[];
    To_Move.push(pawn["obj"]);

    

    if (x-1 >=0 && Tiles[x-1][y]["is_on"]=="" ) pos.push([x-1,y]);

    // if (x-1 >=0 && y-1 >=0 && Tiles[x-1][y-1]["is_on"].includes("W")) pos.push([x-1,y-1]);
    // if (x-1 >=0 && y+1 <=7 && Tiles[x-1][y+1]["is_on"].includes("W")) pos.push([x-1,y+1]);
    //if (Tiles[x+2][y]["is_on"]=="") pos.push([x+2,y]);


    if (pos.length>0){ show_green_cubes(pos,x,y); pos=[];}
    else Clear_green_cubes();


}

function pawnW_possible_moves(pawn)
{

    if (Showing==true ) { if (To_Move[0].id + 1 != pawn["id"]) Clear_green_cubes();}
    var x=pawn["i"],y=pawn["j"];

    var pos=[];
    To_Move.push(pawn["obj"]);

    

    if (x+1<=7 && Tiles[x+1][y]["is_on"]=="") pos.push([x+1,y]);

    
    // if (x+1 >=0 && y-1 >=0 && Tiles[x+1][y-1]["is_on"].includes("B")) pos.push([x+1,y-1]);
    // if (x+1 >=0 && y+1 <=7 && Tiles[x+1][y+1]["is_on"].includes("B")) pos.push([x+1,y+1]);
    //if (Tiles[x+2][y]["is_on"]=="") pos.push([x+2,y]);


    if (pos.length>0){ show_green_cubes(pos,x,y); pos=[];}

    else Clear_green_cubes();
}

function knightW_possible_moves(knight)
{
    if (Showing==true) { if (To_Move[0].id + 1 != knight["id"]) Clear_green_cubes();}
    var x=knight["i"],y=knight["j"];
    var pos=[];

    To_Move.push(knight["obj"]);



    if (0<= x+2 && x+2 <=7 && 0<= y-1 && y-1 <=7) {if ( Tiles[x+2][y-1]["is_on"]=="") pos.push([x+2,y-1]);}
    if (0<= x+1 && x+1 <=7 && 0<= y-2 && y-2 <=7) {if ( Tiles[x+1][y-2]["is_on"]=="" ) pos.push([x+1,y-2]);}
    if (0<= x+2 && x+2 <=7 && 0<= y+1 && y+1 <=7) {if ( Tiles[x+2][y+1]["is_on"]=="" ) pos.push([x+2,y+1]);}
    if (0<= x+1 && x+1 <=7 && 0<= y+2 && y+2 <=7) {if ( Tiles[x+1][y+2]["is_on"]=="" ) pos.push([x+1,y+2]);}
    if (0<= x-1 && x-1 <=7 && 0<= y+2 && y+2 <=7) {if ( Tiles[x-1][y+2]["is_on"]=="" ) pos.push([x-1,y+2]);}
    if (0<= x-2 && x-2 <=7 && 0<= y+1 && y+1 <=7) {if ( Tiles[x-2][y+1]["is_on"]=="" ) pos.push([x-2,y+1]);}
    if (0<= x-2 && x-2 <=7 && 0<= y-1 && y-1 <=7) {if ( Tiles[x-2][y-1]["is_on"]=="" ) pos.push([x-2,y-1]);}
    if (0<= x-1 && x-1 <=7 && 0<= y-2 && y-2 <=7) {if ( Tiles[x-1][y-2]["is_on"]=="" ) pos.push([x-1,y-2]);}

    
    if (pos.length>0){ show_green_cubes(pos,x,y); pos=[];}
    else Clear_green_cubes();

}

function kingW_possible_moves(king)
{
    if (Showing==true) { if (To_Move[0].id + 1 != king["id"]) Clear_green_cubes();}
    var x=king["i"],y=king["j"];
    var pos=[];

    To_Move.push(king["obj"]);



    if (0<= x+1 && x+1 <=7 && 0<= y-1 && y-1 <=7) { if ( Tiles[x+1][y-1]["is_on"]=="" ) pos.push([x+1,y-1]);}
    if (0<= x+1 && x+1 <=7 && 0<= y && y <=7) {if ( Tiles[x+1][y]["is_on"]=="" ) pos.push([x+1,y]);}
    if (0<= x+1 && x+1 <=7 && 0<= y+1 && y+1 <=7) {if ( Tiles[x+1][y+1]["is_on"]=="" ) pos.push([x+1,y+1]);}
    if (0<= x && x <=7 && 0<= y+1 && y+1 <=7) {if ( Tiles[x][y+1]["is_on"]=="" ) pos.push([x,y+1]);}
    if (0<= x-1 && x-1 <=7 && 0<= y+1 && y+1 <=7) {if ( Tiles[x-1][y+1]["is_on"]=="" ) pos.push([x-1,y+1]);}
    if (0<= x-1 && x-1 <=7 && 0<= y && y <=7) {if ( Tiles[x-1][y]["is_on"]=="" ) pos.push([x-1,y]);}
    if (0<= x-1 && x-1 <=7 && 0<= y-1 && y-1 <=7) {if ( Tiles[x-1][y-1]["is_on"]=="" ) pos.push([x-1,y-1]);}
    if (0<= x && x <=7 && 0<= y-1 && y-1 <=7) {if ( Tiles[x][y-1]["is_on"]=="" ) pos.push([x,y-1]);}


    
    if (pos.length>0){ show_green_cubes(pos,x,y); pos=[];}
    else Clear_green_cubes();

}




function rookW_possible_moves(rook)
{
    if (Showing==true) { if (To_Move[0].id + 1 != rook["id"]) Clear_green_cubes();}
    var x=rook["i"],y=rook["j"];
    var pos=[];

    To_Move.push(rook["obj"]);


    var k1=x+1 ;
    while(k1<=7 && Tiles[k1][y]["is_on"]=="") { pos.push([k1,y]); k1++;}

    var k2=x-1 ;
    while(k2>=0 && Tiles[k2][y]["is_on"]=="") {pos.push([k2,y]); k2--;}

    var k3=y+1;
    while(k3<=7 && Tiles[x][k3]["is_on"]=="") {pos.push([x,k3]); k3++;}

    var k4=y-1 ;
    while(k4>=0 && Tiles[x][k4]["is_on"]=="") {pos.push([x,k4]); k4--;}


    if (pos.length>0){ show_green_cubes(pos,x,y); pos=[];}
    else Clear_green_cubes();

}


function bishopW_possible_moves(bishop)
{
    if (Showing==true) { if (To_Move[0].id + 1 != bishop["id"]) Clear_green_cubes();}
    var x=bishop["i"],y=bishop["j"];
    var pos=[];

    To_Move.push(bishop["obj"]);


    var k1=x+1,k2=y+1;
    while(k1<=7 && k2<=7 && Tiles[k1][k2]["is_on"]=="") { pos.push([k1,k2]); k1++;k2++;}

    var k3=x-1,k4=y+1;
    while(k3>=0 && k4<=7 && Tiles[k3][k4]["is_on"]=="") { pos.push([k3,k4]); k3--;k4++;}

    var k5=x-1,k6=y-1;
    while(k5>=0 && k6>=0 && Tiles[k5][k6]["is_on"]=="") { pos.push([k5,k6]); k5--;k6--;}

    var k7=x+1,k8=y-1;
    while(k7<=7 && k8>=0 && Tiles[k7][k8]["is_on"]=="") { pos.push([k7,k8]); k7++;k8--;}
    



    if (pos.length>0){ show_green_cubes(pos,x,y); pos=[];}
    else Clear_green_cubes();

}

function queenW_possible_moves(queen)
{
    if (Showing==true) { if (To_Move[0].id + 1 != queen["id"]) Clear_green_cubes();}
    var x=queen["i"],y=queen["j"];
    var pos=[];

    To_Move.push(queen["obj"]);


    var k1=x+1,k2=y+1;
    while(k1<=7 && k2<=7 && Tiles[k1][k2]["is_on"]=="") { pos.push([k1,k2]); k1++;k2++;}

    var k3=x-1,k4=y+1;
    while(k3>=0 && k4<=7 && Tiles[k3][k4]["is_on"]=="") { pos.push([k3,k4]); k3--;k4++;}

    var k5=x-1,k6=y-1;
    while(k5>=0 && k6>=0 && Tiles[k5][k6]["is_on"]=="") { pos.push([k5,k6]); k5--;k6--;}

    var k7=x+1,k8=y-1;
    while(k7<=7 && k8>=0 && Tiles[k7][k8]["is_on"]=="") { pos.push([k7,k8]); k7++;k8--;}


    

    var k9=x+1 ;
    while(k9<=7 && Tiles[k9][y]["is_on"]=="") { pos.push([k9,y]); k9++;}

    var k10=x-1 ;
    while(k10>=0 && Tiles[k10][y]["is_on"]=="") {pos.push([k10,y]); k10--;}

    var k11=y+1;
    while(k11<=7 && Tiles[x][k11]["is_on"]=="") {pos.push([x,k11]); k11++;}

    var k12=y-1 ;
    while(k12>=0 && Tiles[x][k12]["is_on"]=="") {pos.push([x,k12]); k12--;}



    if (pos.length>0){ show_green_cubes(pos,x,y); pos=[];}
    else Clear_green_cubes();

}












function move(event) 
{
    var x = event.clientX;
    var y = event.clientY;

    x = x * 2/window.innerWidth - 1;
    y = -y * 2/window.innerHeight + 1;

    var rayo = new THREE.Raycaster();
    rayo.setFromCamera( new THREE.Vector2(x,y), camera);

    var interseccion = rayo.intersectObjects(scene.children, true);



    if( interseccion.length > 0 )
    {


        if(Showing==true && interseccion[0].object.name == "confirmation_cube")
        {
            for (var s=0;s<Green_Tiles.length;s++)
            {
                if (interseccion[0].object.id == Green_Tiles[s]["id"])
                {
                    var x =Green_Tiles[s]["i"];
                    var y = Green_Tiles[s]["j"];


                    Tiles[x][y]["Tile"].add(To_Move[0]);
                    Tiles[x][y]["is_on"]=To_Move[0].name;

                    Tiles[Green_Tiles[s]["old_i"]][Green_Tiles[s]["old_j"]]["is_on"]="";

                    for(var k=0;k<Pieces_W.length;k++) 
                    {
                        if (Pieces_W[k]["id"] == To_Move[0].id+1) {Pieces_W[k]["i"]=x;Pieces_W[k]["j"]=y;}
                        else if (Pieces_B[k]["id"] == To_Move[0].id+1) {Pieces_B[k]["i"]=x;Pieces_B[k]["j"]=y;}    
                    }
                    

                }
            }

            Clear_green_cubes();

        }
        
        else if (interseccion[0].object.name != "")
        {
            //var object_name=interseccion[0].object.name;
            //var idas1,idas2;

            var object_id=interseccion[0].object.id;

            for (var l=0;l<Pieces_W.length;l++)
            {
                if (Pieces_W[l]["id"]==object_id)
                {
                    //idas1=Pieces_W[l]["name"];
                    //idas2=Pieces_W[l]["id"];
                    obj3D=Pieces_W[l];
                    //console.log(`\nThis is ==> ${object_name} et ${object_id} et \n   NAME_W : ${idas1} et ${idas2}\n______________________ `);
                }
                else if (Pieces_B[l]["id"]==object_id)
                {
                    //idas1=Pieces_B[l]["name"];
                    //idas2=Pieces_B[l]["id"];
                    obj3D=Pieces_B[l];
                    //console.log(`\nThis is ==> ${object_name} et ${object_id} et \n   NAME_B : ${idas1} et ${idas2}\n______________________ `);
                }
            } 

            show_possible_moves(obj3D);
        }

    }// end --> if interseccion.length > 0


}

function Clear_green_cubes()
{

    for (var s=0;s<Green_Tiles.length;s++) 
    {
    Tiles[Green_Tiles[s]['i']][Green_Tiles[s]['j']]["Tile"].remove(Green_Tiles[s]['cube']);
    }


    for (var s=0;s<=Green_Tiles.length;s++) Green_Tiles.pop();
    for (var s=0;s<=To_Move.length;s++) To_Move.pop();


    
    while (Green_Tiles.length!=0 ) Green_Tiles.pop();
    while (To_Move.length!=0 ) To_Move.pop();


    Showing=false;

}






function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}



function setupGUI()
{

	effectControls = {
		message: "Dble click on an Item",
		Light_intensity: 0.6,
		color: "rgb(0,0,0)"
	};

	// Interfaz
	var gui = new dat.GUI();
	var folder = gui.addFolder("Interface Chess Game");
	folder.add( effectControls, "message" ).name("To play :");
	folder.add( effectControls, "Light_intensity", 0, 1, 0.05 ).name("SpotLight Intensity");
	folder.addColor( effectControls, "color" ).name("Edges Color");
}


function update()
{
    // Cambios para actualizar la camara segun mvto del raton
    cameraControls.update();
    spot.intensity = effectControls.Light_intensity;
    material_bar.setValues( {color:effectControls.color} );

    // Movimiento propio del cubo
	//cubo.rotateOnAxis( new THREE.Vector3(0,1,0), angulo );
}






function render()
{
	requestAnimationFrame(render);
	update();

    renderer.clear();

	//renderer.render(scene, camera);
    renderer.setViewport(0,0,window.innerWidth,window.innerHeight);
	renderer.render( scene, camera );

    renderer.setViewport( 10,10,200,200 );
    renderer.render( scene, minicam );
}