main();

//
// start here
//
function main() {
  const canvas = document.querySelector("#glcanvas");
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it.",
    );
    return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
}
/* here is where I'll be making my window for the 3D model displays, and making a separate CSS for this, possibly a pop-out
so far research says to go with three.js.... but the more I look into Babylon, the more promising it seems*/
/* with it's AR capabilities, I'd say I'm going with Babylon*/