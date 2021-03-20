
//console.log(`This is ==> ${aaa} `);


//a faire:
//lights
//minimap
//manger
//fond d ecran
//bordure plateau
//changer couleur pions noirs et dales
//minimap

var renderer, scene, camera;
var cameraControls;


var Showing=false;

var square_side=0.75;
var Tiles=[[],[],[],[],[],[],[],[]];

//var Pieces_B={"pawns" : [],"rooks" : [],"knights" : [],"bishops" : [],"queen":[],"king":[] };
//var Pieces_W={"pawns" : [],"rooks" : [],"knights" : [],"bishops" : [],"queen":[],"king":[] };
var Pieces_B=[];
var Pieces_W=[];

var To_Move=[];
var C_cubes=[];


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
    //renderer.domElement.addEventListener('dblclick',confirm);
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
                        obj.name="rookW";
                        
                        my_scale=0.2;
                        obj.scale.set(my_scale,my_scale,my_scale);

                        obj.position.set(0,0,-0.4);          

                        Tiles[0][total1]["Tile"].add(obj);
                        Tiles[0][total1]["is_on"] = obj.name;
                        

                        

                        Pieces_W.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":0,"j":total1,"alive":true});
                        total1=7;                    
                    });
        loader.load( 'models/Chess/rookB.json', 
        function (obj){
                        obj.name="rookB";

                        my_scale=0.2;
                        obj.scale.set(my_scale,my_scale,my_scale);

                        obj.position.set(0,0,-0.4);          


                        Tiles[7][total2]["Tile"].add(obj);
                        Tiles[7][total2]["is_on"] = "rookB";
                        


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
                    
                    Tiles[7][total3]["Tile"].add(obj);
                    Tiles[7][total3]["is_on"] = "knightB";
                    
                    
                    
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
                    
                    Tiles[0][total4]["Tile"].add(obj);
                    Tiles[0][total4]["is_on"] = "knightW";
                    

                    Pieces_W.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":0,"j":total4,"alive":true});

                    total4=6;
                });

    loader.load( 'models/Chess/bishopB.json', 
    function (obj){
                    obj.name="bishopB";
                    
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(0.8,0,-0.4);        
                    

                    Tiles[7][total5]["Tile"].add(obj);
                    Tiles[7][total5]["is_on"] = "bishopB";
                    

                    Pieces_B.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":7,"j":total5,"alive":true});
                    total5=5;
                });
                
    loader.load( 'models/Chess/bishopW.json', 
    function (obj){

                   obj.name="bishopW";
                    
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(0.8,0,-0.4);        
                    
                    Tiles[0][total6]["Tile"].add(obj);
                    Tiles[0][total6]["is_on"] = "bishopW";
                    

                    Pieces_W.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":0,"j":total6,"alive":true});
                    total6=5;
                });

    }//end for(2)



                        ////  LOADING Queens, Kings      /////
    loader.load( 'models/Chess/queenB.json', 
    function (obj){

                    obj.name="queenB";

                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(1.2,0,-0.4);        
                    
                    Tiles[7][3]["Tile"].add(obj);
                    Tiles[7][3]["is_on"] = "queenB";

                    Pieces_B.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":7,"j":3,"alive":true});
                    
                });

    loader.load( 'models/Chess/queenW.json', 
    function (obj){
                    obj.name="queenW";
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(1.2,0,-0.4);        
                    
                    Tiles[0][3]["Tile"].add(obj);
                    Tiles[0][3]["is_on"] = "queenW";
                    
                    Pieces_W.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":0,"j":3,"alive":true});
                    
                });

    loader.load( 'models/Chess/kingB.json', 
    function (obj){
                    obj.name="kingB";
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(1.6,0,-0.4);        
                
                    Tiles[7][4]["Tile"].add(obj);
                    Tiles[7][4]["is_on"] = "kingB";

                    Pieces_B.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":7,"j":4,"alive":true});
                    
                });

    loader.load( 'models/Chess/kingW.json', 
    function (obj){
                    obj.name="kingW";
                    my_scale=0.2;
                    obj.scale.set(my_scale,my_scale,my_scale);
                    
                    obj.position.set(1.6,0,-0.4);        
                    
                    Tiles[0][4]["Tile"].add(obj);
                    Tiles[0][4]["is_on"] = "kingW";

                    Pieces_W.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":0,"j":4,"alive":true});
                    
                });

                    
                    
                    
                    
        ///////////////           LOADING ALL PAWNS          /////////////
                    
    var zz1=0;
    var zz2=0;

    for (var p=0;p<8;p++)
    {
        loader.load( 'models/Chess/pawnW.json', 
            function (obj){
                            obj.name="pawnW";
                            
                            my_scale=0.2;
                            obj.scale.set(my_scale,my_scale,my_scale);

                            obj.position.set(0,0,0);          

                            Tiles[1][zz1]["Tile"].add(obj);
                            Tiles[1][zz1]["is_on"] = "pawnW";
                            


                            Pieces_W.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":1,"j":zz1,"alive":true});
                            
                   

                            zz1++;
                        });

        loader.load( 'models/Chess/pawnB.json', 
            function (obj){
                           obj.name="pawnB";
                            my_scale=0.2;

                            obj.scale.set(my_scale,my_scale,my_scale);

                            obj.position.set(0,0,0);          

                            Tiles[6][zz2]["Tile"].add(obj);
                            Tiles[6][zz2]["is_on"] = "pawnB";
                            

                            Pieces_B.push({"obj":obj,"name":obj.name,"id" : obj.id+1,"i":6,"j":zz2,"alive":true});
                            zz2++;
                        });

    }//end for(8)


}//end loadPieces()






function show_green_cubes(coords,old_x,old_y)
{
    for (var k=0;k<coords.length;k++)
    {
        //pawn["obj"].visible=false;
        geometryC = new THREE.BoxGeometry(0.5, 0.05, 0.5 );
        materialC = new THREE.MeshBasicMaterial( { color: 0x07892F } );
        cube = new THREE.Mesh( geometryC, materialC );
        //cube.rotation.x=(-Math.PI/2);
        cube.position.y=0.1;
        cube.name="confirmation_cube";
        C_cubes.push({"id":cube.id,"i":coords[k][0],"j":coords[k][1],"old_i":old_x,"old_j":old_y,"cube":cube});
            

        Tiles[coords[k][0]][coords[k][1]]["Tile"].add( cube );
    }
    Showing=true;

}


function show_possible_moves(objeto)
{
    console.log(`In show_possible_moves \n ====== NAME <${objeto["obj"].name}> ======`);

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
    console.log(`IN pawnB_possible_moves ID <${pawn["obj"].id}> AND NAME <${pawn["obj"].name}>`);

    
    console.log(` Tiles[x-1][y]["is_on"]<${Tiles[x-1][y]["is_on"]}>`);
    if (x-1 >=0 && Tiles[x-1][y]["is_on"]=="") pos.push([x-1,y]);
    //if (Tiles[x+2][y]["is_on"]=="") pos.push([x+2,y]);


    if (pos.length>0){ show_green_cubes(pos,x,y); pos=[];}
    else Clear_green_cubes();

    console.log(` pawn["i"]<${pawn["i"]}>  pawn["j"]<${pawn["j"]}>`);

}

function pawnW_possible_moves(pawn)
{

    if (Showing==true ) { if (To_Move[0].id + 1 != pawn["id"]) Clear_green_cubes();}
    var x=pawn["i"],y=pawn["j"];

    var pos=[];
    To_Move.push(pawn["obj"]);
    console.log(`IN pawnW_possible_moves ID <${pawn["obj"].id}> AND NAME <${pawn["obj"].name}>`);

    

    if (x+1<=7 && Tiles[x+1][y]["is_on"]=="") pos.push([x+1,y]);
    //if (Tiles[x+2][y]["is_on"]=="") pos.push([x+2,y]);


    if (pos.length>0){ show_green_cubes(pos,x,y); pos=[];}
    else Clear_green_cubes();

    console.log(` pawn["i"]<${pawn["i"]}>  pawn["j"]<${pawn["j"]}>`);

}

function knightW_possible_moves(knight)
{
    if (Showing==true) { if (To_Move[0].id + 1 != knight["id"]) Clear_green_cubes();}
    var x=knight["i"],y=knight["j"];
    var pos=[];

    To_Move.push(knight["obj"]);
    console.log(`IN knightW_possible_moves ID <${knight["obj"].id} AND NAME <${knight["obj"].name}>`);



    if (0<= x+2 && x+2 <=7 && 0<= y-1 && y-1 <=7) { if ( Tiles[x+2][y-1]["is_on"]=="") pos.push([x+2,y-1]);}
    if (0<= x+1 && x+1 <=7 && 0<= y-2 && y-2 <=7) {if ( Tiles[x+1][y-2]["is_on"]=="") pos.push([x+1,y-2]);}
    if (0<= x+2 && x+2 <=7 && 0<= y+1 && y+1 <=7) {if ( Tiles[x+2][y+1]["is_on"]=="") pos.push([x+2,y+1]);}
    if (0<= x+1 && x+1 <=7 && 0<= y+2 && y+2 <=7) {if ( Tiles[x+1][y+2]["is_on"]=="") pos.push([x+1,y+2]);}
    if (0<= x-1 && x-1 <=7 && 0<= y+2 && y+2 <=7) {if ( Tiles[x-1][y+2]["is_on"]=="") pos.push([x-1,y+2]);}
    if (0<= x-2 && x-2 <=7 && 0<= y+1 && y+1 <=7) {if ( Tiles[x-2][y+1]["is_on"]=="") pos.push([x-2,y+1]);}
    if (0<= x-2 && x-2 <=7 && 0<= y-1 && y-1 <=7) {if ( Tiles[x-2][y-1]["is_on"]=="") pos.push([x-2,y-1]);}
    if (0<= x-1 && x-1 <=7 && 0<= y-2 && y-2 <=7) {if ( Tiles[x-1][y-2]["is_on"]=="") pos.push([x-1,y-2]);}

    
    if (pos.length>0){ show_green_cubes(pos,x,y); pos=[];}
    else Clear_green_cubes();

}

function kingW_possible_moves(king)
{
    if (Showing==true) { if (To_Move[0].id + 1 != king["id"]) Clear_green_cubes();}
    var x=king["i"],y=king["j"];
    var pos=[];

    To_Move.push(king["obj"]);
    console.log(`IN kingW_possible_moves  ID <${king["obj"].id}> AND NAME <${king["obj"].name}>`);



    if (0<= x+1 && x+1 <=7 && 0<= y-1 && y-1 <=7) { if ( Tiles[x+1][y-1]["is_on"]=="") pos.push([x+1,y-1]);}
    if (0<= x+1 && x+1 <=7 && 0<= y && y <=7) {if ( Tiles[x+1][y]["is_on"]=="") pos.push([x+1,y]);}
    if (0<= x+1 && x+1 <=7 && 0<= y+1 && y+1 <=7) {if ( Tiles[x+1][y+1]["is_on"]=="") pos.push([x+1,y+1]);}
    if (0<= x && x <=7 && 0<= y+1 && y+1 <=7) {if ( Tiles[x][y+1]["is_on"]=="") pos.push([x,y+1]);}
    if (0<= x-1 && x-1 <=7 && 0<= y+1 && y+1 <=7) {if ( Tiles[x-1][y+1]["is_on"]=="") pos.push([x-1,y+1]);}
    if (0<= x-1 && x-1 <=7 && 0<= y && y <=7) {if ( Tiles[x-1][y]["is_on"]=="") pos.push([x-1,y]);}
    if (0<= x-1 && x-1 <=7 && 0<= y-1 && y-1 <=7) {if ( Tiles[x-1][y-1]["is_on"]=="") pos.push([x-1,y-1]);}
    if (0<= x && x <=7 && 0<= y-1 && y-1 <=7) {if ( Tiles[x][y-1]["is_on"]=="") pos.push([x,y-1]);}


    
    if (pos.length>0){ show_green_cubes(pos,x,y); pos=[];}
    else Clear_green_cubes();

}




function rookW_possible_moves(rook)
{
    if (Showing==true) { if (To_Move[0].id + 1 != rook["id"]) Clear_green_cubes();}
    var x=rook["i"],y=rook["j"];
    var pos=[];

    To_Move.push(rook["obj"]);
    console.log(`IN rookW_possible_moves  ID <${rook["obj"].id}> AND NAME <${rook["obj"].name}>`);


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
    console.log(`IN bishopW_possible_moves  ID <${bishop["obj"].id}> AND NAME <${bishop["obj"].name}>`);


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
    console.log(`IN queenW_possible_moves  ID <${queen["obj"].id}> AND NAME <${queen["obj"].name}>`);


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
    // Movimiento propio del cubo
	//cubo.rotateOnAxis( new THREE.Vector3(0,1,0), angulo );
}



/*
function confirm(event) // ++++++++++++++++++++++++++++++++++++++++
{
    if (Showing==true)
    {
        var x = event.clientX;
        var y = event.clientY;

        x = x * 2/window.innerWidth - 1;
        y = -y * 2/window.innerHeight + 1;

        var rayo = new THREE.Raycaster();
        rayo.setFromCamera( new THREE.Vector2(x,y), camera);

        var interseccion = rayo.intersectObjects(scene.children, true);
        if( interseccion.length > 0)
        {
            

            
            
        }
    }
}*/





function move(event) // ++++++++++++++++++++++++++++++++++++++++
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
        console.log(`In move object NAME <${interseccion[0].object.name}>`);



        console.log(`SHOWING BEFORE CONFIRM <${Showing}>`);
        if(Showing==true && interseccion[0].object.name == "confirmation_cube")
        {
            console.log(`IN CONFIRMATION AND NAME <${interseccion[0].object.name}>`);
            for (var s=0;s<C_cubes.length;s++)
            {
                if (interseccion[0].object.id == C_cubes[s]["id"])
                {
                    var x =C_cubes[s]["i"];
                    var y = C_cubes[s]["j"];
                    Tiles[x][y]["Tile"].add(To_Move[0]);
                    Tiles[x][y]["is_on"]=To_Move[0].name;

                    Tiles[C_cubes[s]["old_i"]][C_cubes[s]["old_j"]]["is_on"]="";

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
            //var aaa=interseccion[0].object.name;
            var bbb=interseccion[0].object.id;
            //var idas1,idas2;

            for (var l=0;l<Pieces_W.length;l++)
            {
                if (Pieces_W[l]["id"]==bbb)
                {
                    //idas1=Pieces_W[l]["name"];
                    //idas2=Pieces_W[l]["id"];
                    obj3D=Pieces_W[l];
                    //console.log(`\nThis is ==> ${aaa} et ${bbb} et \n   NAME_W : ${idas1} et ${idas2}\n______________________ `);
                }
                else if (Pieces_B[l]["id"]==bbb)
                {
                    //idas1=Pieces_B[l]["name"];
                    //idas2=Pieces_B[l]["id"];
                    obj3D=Pieces_B[l];
                    //console.log(`\nThis is ==> ${aaa} et ${bbb} et \n   NAME_B : ${idas1} et ${idas2}\n______________________ `);
                }
            } 

            show_possible_moves(obj3D);
        }

    }// end --> if interseccion.length > 0
console.log(`\n++++++++++++++++\n\n`);
}

function Clear_green_cubes()
{
    console.log(`In  Clear_green_cubes() SHOWING <${Showing}>`);
    for (var s=0;s<C_cubes.length;s++) 
    {
    Tiles[C_cubes[s]['i']][C_cubes[s]['j']]["Tile"].remove(C_cubes[s]['cube']);
    }


    for (var s=0;s<=C_cubes.length;s++) C_cubes.pop();
    for (var s=0;s<=To_Move.length;s++) To_Move.pop();


    //C_cubes=[];
    while (To_Move.length!=0 ) To_Move.pop();
    while (C_cubes.length!=0 ) C_cubes.pop();

    //console.log(` To_Move.length ${To_Move.length} C_cubes.length ${C_cubes.length}`);

    Showing=false;

}












function render()
{
	requestAnimationFrame(render);
	update();

    renderer.clear();

	renderer.render(scene, camera);
}