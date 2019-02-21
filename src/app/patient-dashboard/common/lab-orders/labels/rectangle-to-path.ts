export class RectangleToPath {
    private svgn = 'http://www.w3.org/2000/svg';
    constructor() {

    }
    public convertToPath(svgString) {
        let doc, svg, rects, circles, ellipses, polygons, xml;
        doc = new DOMParser().parseFromString(svgString, 'text/xml');
        svg = doc.getElementsByTagName('svg')[0];

        rects = svg.getElementsByTagName('rect');
        circles = svg.getElementsByTagName('circle');
        ellipses = svg.getElementsByTagName('ellipse');
        polygons = svg.getElementsByTagName('polygon');

        this.convertRect(rects, doc);
        this.mergePath(svg);

        xml = new XMLSerializer().serializeToString(doc);
        return {
            svg: xml,
            path: doc.getElementsByTagName('path')[0].attributes['0'].nodeValue
        };
    }
    private getProxy(x, y, w, h, deg) {
        // tslint:disable-next-line:prefer-const
        let c = {
            x: x + w / 2,
            y: y + h / 2
        },
            // tslint:disable-next-line:prefer-const
            points = [],
            r;
        r = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) / 2;
        deg = deg * Math.PI / 180;
        const deg1 = (Math.PI - Math.acos((w / 2) / r)) - parseFloat(deg),
            deg2 = Math.acos((w / 2) / r) - parseFloat(deg),
            deg3 = -Math.acos((w / 2) / r) - parseFloat(deg),
            deg4 = Math.PI + Math.acos((w / 2) / r) - parseFloat(deg);
        points.push({
            x: c.x + r * Math.cos(deg1),
            y: c.y - r * Math.sin(deg1)
        });
        points.push({
            x: c.x + r * Math.cos(deg2),
            y: c.y - r * Math.sin(deg2)
        });
        points.push({
            x: c.x + r * Math.cos(deg3),
            y: c.y - r * Math.sin(deg3)
        });
        points.push({
            x: c.x + r * Math.cos(deg4),
            y: c.y - r * Math.sin(deg4)
        });
        return points;
    }

    private convertRect(rects, context) {
        // tslint:disable-next-line:prefer-const
        let len = rects.length,
            x, y, w, h, deg = 0,
            proxy = [],
            tran, tranParam = [],
            pathObj, node;
        if (len < 1) {
            return;
        }

        for (let n = 0; n < len; n++) {
            node = rects.item(n);
            x = +node.getAttribute('x');
            y = +node.getAttribute('y');
            w = +node.getAttribute('width');
            h = +node.getAttribute('height');
            tran = node.getAttribute('transform');

            if (tran && tran.indexOf('matrix') !== -1) {
                tranParam = tran.replace(/^matrix\s*\(([\d.\s-]+)\)/g, '$1').split(/\s|,/);
            }

            if (tranParam.length > 0) {
                deg = Math.acos(tranParam[0]) * 180 / Math.PI;
                if (tranParam[tranParam.length - 1] > 0) {
                    deg *= -1;
                }
            }
            proxy = this.getProxy(x, y, w, h, deg);
            pathObj = context.createElementNS(this.svgn, 'path');
            pathObj.setAttribute('d', 'M' + proxy[0].x.toFixed(3) + ' ' + proxy[0].y.toFixed(3) +
                ' L' + proxy[1].x.toFixed(3) + ' ' + proxy[1].y.toFixed(3) +
                ' L' + proxy[2].x.toFixed(3) +
                ' ' + proxy[2].y.toFixed(3) + ' L' + proxy[3].x.toFixed(3) +
                ' ' + proxy[3].y.toFixed(3) + ' Z');
            pathObj.setAttribute('fill', '#000');
            node.parentNode.insertBefore(pathObj, node);
        }
        while (rects.length > 0) {
            rects.item(0).parentNode.removeChild(rects.item(0));
        }
    }

    private mergePath(parent) {
        // tslint:disable-next-line:prefer-const
        let paths = parent.getElementsByTagName('path'),
            // tslint:disable-next-line:prefer-const
            len = paths.length,
            d = '';
        if (len < 1) {
            return;
        }

        d = paths.item(0).getAttribute('d');

        for (let n = 1; n < len; n++) {
            d += ' ' + paths.item(n).getAttribute('d');
        }
        while (paths.length > 1) {
            paths.item(1).parentNode.removeChild(paths.item(1));
        }
        paths.item(0).setAttribute('d', d);
    }

}
