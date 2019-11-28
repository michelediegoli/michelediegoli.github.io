const objects = [];
let eyeZ;
var f3dChain = [];
var sphereScale = 50;
var singleClick = false;

function setup() {
  mCreateCanvas(710, 400, WEBGL);

  eyeZ = height / 2 / tan((30 * PI) / 180); // The default distance the camera is away from the origin.

  //objects.push(new IntersectPlane(1, 0, 0, -100, 0, 0)); // Left wall
  //objects.push(new IntersectPlane(1, 0, 0, 100, 0, 0)); // Right wall
  //objects.push(new IntersectPlane(0, 1, 0, 0, -100, 0)); // Bottom wall
  //objects.push(new IntersectPlane(0, 1, 0, 0, 100, 0)); // Top wall
  objects.push(new IntersectPlane(0, 0, 1, 0, 0, 0)); // Back wall

  noStroke();
  ambientMaterial(250);
}

function draw() {
  mBackground(0);

  // Lights
  pointLight(255, 255, 255, 0, 0, 400);
  ambientLight(244, 122, 158);
/*
  // Left wall
  push();
  translate(-100, 0, 200);
  rotateY((90 * PI) / 180);
  plane(400, 200);
  pop();
  // Right wall
  push();
  translate(100, 0, 200);
  rotateY((90 * PI) / 180);
  plane(400, 200);
  pop();
  // Bottom wall
  push();
  translate(0, 100, 200);
  rotateX((90 * PI) / 180);
  plane(200, 400);
  pop();
  // Top wall
  push();
  translate(0, -100, 200);
  rotateX((90 * PI) / 180);
  plane(200, 400);
  pop();
  plane(200, 200); // Back wall
*/
  //https://github.com/physicsdavid/mPicker/blob/master/example/sketch.js
  const x = mouseX - width / 2;
  const y = mouseY - height / 2;

  const Q = createVector(0, 0, eyeZ); // A point on the ray and the default position of the camera.
  const v = createVector(x, y, -eyeZ); // The direction vector of the ray.

  let intersect; // The point of intersection between the ray and a plane.
  let closestLambda = eyeZ * 10; // The draw distance.

  for (let x = 0; x < objects.length; x += 1) {
    let object = objects[x];
    let lambda = object.getLambda(Q, v); // The value of lambda where the ray intersects the object

    if (lambda < closestLambda && lambda > 0) {
      // Find the position of the intersection of the ray and the object.
      intersect = p5.Vector.add(Q, p5.Vector.mult(v, lambda));
      closestLambda = lambda;
    }
  }

  // Cursor
  mPush();
  mTranslate(intersect);
  fill(237, 34, 93);
  mSphere(sphereScale);
  mPop();
  
  if (mouseIsPressed) {
    if (mouseButton === LEFT) {
      if(!singleClick){
        f3dChain.push(intersect)
        singleClick = true;
      }
    }
  }
  
  for(let i = 0,l=f3dChain.length;i<l;i++){
    mPush();
    mTranslate(f3dChain[i]);
    fill(237, 237, 237);
    mSphere(sphereScale);
    mPop();
    if(i>0){
      let d = int(dist(f3dChain[i-1].x, f3dChain[i-1].y, f3dChain[i].x, f3dChain[i].y));
      //calcolo numero parti
      let parts;
      if(d>(sphereScale/2)){
        //sposto ogni sfera alla distanza di mezzo raggio uno dall'altra
        parts = Math.floor(d/(sphereScale/2));
        var dx = f3dChain[i-1].x - f3dChain[i].x;
        var dy = f3dChain[i-1].y - f3dChain[i].y;
        var pdx = Math.floor(dx / parts);
        var pdy = Math.floor(dy / parts);
        var xbkp = f3dChain[i].x;
        var ybkp = f3dChain[i].y;
        for(let s = 0;s<parts;s++){
          xbkp += pdx;
          ybkp += pdy;
          mPush();
          mTranslate(createVector(xbkp,ybkp));
          fill(37, 37, 37);
          mSphere(sphereScale);
          mPop();
        }
      }
      //calcolo parte da aggiungere o sotrarre alle coordinare di partenza
      //renderizzo sfere fitt
      
    }
    
  }
}

// Class for a plane that extends to infinity.
class IntersectPlane {
  constructor(n1, n2, n3, p1, p2, p3) {
    this.normal = createVector(n1, n2, n3); // The normal vector of the plane
    this.point = createVector(p1, p2, p3); // A point on the plane
    this.d = this.point.dot(this.normal);
  }

  getLambda(Q, v) {
    return (-this.d - this.normal.dot(Q)) / this.normal.dot(v);
  }
}

function mouseReleased() {
    singleClick = false;
}
