import SVGPathCollider from "./svg-collider";
let svgElm;
let polygon1;
let polygon2;
window.onload = () => {
    svgElm = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const svgElmSize = 480;
    svgElm.setAttribute("width", `${svgElmSize}`);
    svgElm.setAttribute("height", `${svgElmSize}`);
    document.body.appendChild(svgElm);
    // create two polygons
    polygon1 = new Polygon(5, 70, 5, 160, 240, 0.5);
    polygon2 = new Polygon(7, 100, 7, 320, 240, 0.3);
    updatePolygons();
};
function updatePolygons() {
    requestAnimationFrame(updatePolygons);
    polygon1.update();
    polygon2.update();
    let fillColor = "#8e8";
    // test if two polygons are colliding
    if (polygon1.spc.test(polygon2.spc)) {
        fillColor = "#ec8";
    }
    polygon1.svg.setAttribute("fill", fillColor);
    polygon2.svg.setAttribute("fill", fillColor);
}
class Polygon {
    constructor(n, r, separationNum, x, y, angleVel) {
        this.angleVel = angleVel;
        this.angle = 0;
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
        let pathStr = `M0,${r} `;
        for (let i = 0; i < n; i++) {
            var d = i * 6.28 / n;
            pathStr += ` ${Math.sin(d) * r},${Math.cos(d) * r},`;
        }
        pathStr += "z";
        this.svg.setAttribute("d", pathStr);
        svgElm.appendChild(this.svg);
        // instantiate SVGPathCollider with params:
        //  (SVGPathElement testing a collision,
        //   number of points on the path used for
        //    creating polygons to detect a collision (SAT.Polygon)
        //    (default = 16),
        //   true when the path forms a concave shape
        //    (a concave shape is separated into triangles from
        //     a point at a center of the shape)
        //    (default = false))
        this.spc = new SVGPathCollider(this.svg, separationNum);
        this.pos = { x: x, y: y };
    }
    update() {
        this.angle += this.angleVel;
        this.svg.setAttribute("transform", `translate(${this.pos.x},${this.pos.y}) rotate(${this.angle})`);
        // update a collision area when a path is transformed
        this.spc.update();
    }
}
