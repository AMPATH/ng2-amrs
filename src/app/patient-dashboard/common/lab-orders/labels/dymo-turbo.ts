/* tslint:disable no-bitwise */
import * as JsBarcode from 'jsbarcode';
export class DymoTurbo {

    public printLabel(label: any, copies: number) {
        let selectedDevice;
        let device;
        return navigator.usb.requestDevice({
            filters: [{
                vendorId: 0x0922
            }]
        })
            .then((selected) => {
                device = selected;
                console.log('Device', device);
                return device.open(); // Begin a session.
            })
            .then(() => {
                // Select configuration #1 for the device.
                if (device.configuration === null) {
                    return device.selectConfiguration(0);
                }
            })
            .then(() => device.claimInterface(0)) // Request exclusive control over interface #2.
            .then(() => {
                let labelData = this.createData(label);
                let dataCopies = Array(2).fill(labelData);

                return dataCopies.reduce((cur, next) => {
                    return cur.then(() => {
                        return device.transferOut(2, next);
                    });
                }, Promise.resolve());
                // return device.transferOut(2, data);
            });
    }

    public createData(label: any) {
        let vendorId = 0x0922;
        let productId = 0x0021;

        let ESC = 0x1B;
        let GS = 0x1D;
        let SYN = 0x16;

        let pageWidth = 560; // pixels (must be multiple of 8)
        let pageHeight = 600; // pixels
        let resetSequence = // 156 times ESC
            [ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC,
                ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC,
                ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC,
                ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC,
                ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC,
                ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC,
                ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC,
                ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC,
                ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC,
                ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC,
                ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC,
                ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC,
                ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC, ESC
            ];

        // should set the resolution to 204x204ppi, but the resolution I get is more
        // like 290x580, not sure what's up with that.
        let setResolution = [ESC, 0x76];
        // some more seemingly required setup stuff
        let tabData = [ESC, 0x51, 0, 0, ESC, 42, 0];
        let qualityData = [ESC, 0x69]; // images
        let densityData = [ESC, 0x65]; // normal
        let orienation = [GS, 0x56, 0x01];
        let lengthData = [ESC, 0x4C, 0x40, 0x00]; // not sure what this is about...

        let startDoc = resetSequence.concat(setResolution, orienation, tabData, qualityData,
            densityData, lengthData);
        let endDoc = [ESC, 0x45]; // Form feed
        let canvas = this.createContext(pageWidth, pageHeight);
        let ctx = canvas.getContext('2d');
        // var ctx = document.getElementById('ditheredCanvas').getContext('2d');
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        JsBarcode(svg, 'ORD-3464', {
            format: 'CODE39',
            lineColor: '#000',
            width: 3,
            height: 40,
            displayValue: false
        });
        let s = new XMLSerializer().serializeToString(svg);
        let mySrc = 'data:image/svg+xml;base64,' + window.btoa(s);
        // Load up our image.
        let source = new Image();
        source.src = mySrc;
        ctx.font = '48pt Arial';
        ctx.save();
        ctx.translate(100, 300);
        ctx.rotate(-0.5 * Math.PI);

        ctx.fillText('Date Ordered : ' + label.orderDate, -300, -50, 600);
        ctx.fillText('Test : ' + label.testName, -300, 45, 600);
        ctx.fillText('Patient ID : ' + label.identifier, -300, 150, 600);
        ctx.fillText('Order Number : ' + label.orderNumber, -300, 250, 600);
        ctx.drawSvg(svg.outerHTML, -300, 280, 600, 210);
        ctx.restore();

        // window.open(canvas.toDataURL());
        let img = ctx.getImageData(0, 0, pageWidth, pageHeight);

        let dataBytesPerLine = pageWidth / 8;

        // every row of the image results in 2 rows of pixels to be printed, both
        // with one extra byte in front of it
        let bytesPerRow = (dataBytesPerLine + 1) * 2;

        let bytesForImage = bytesPerRow * pageHeight;
        // Total size is the size of all the data + the prefix and suffix
        // and 3 bytes to set the line size
        let totalDataSize = bytesForImage + startDoc.length + endDoc.length + 3;

        let data = new ArrayBuffer(totalDataSize);
        let dataView = new Uint8Array(data, 0, totalDataSize);
        // Set beginning data
        dataView.set(startDoc, 0);
        let offset = startDoc.length;
        // Set Bytes Per Line
        dataView.set([ESC, 0x44, 75], offset);
        offset += 3;

        for (let x = 0; x < img.width; x++) {
            let off1 = offset;
            let off2 = offset + dataBytesPerLine + 1;
            dataView[off1++] = SYN;
            dataView[off2++] = SYN;
            for (let y = 0; y < img.height; y += 8) {
                let cur1 = 0;
                let cur2 = 0;
                for (let bit = 0; bit < 8; bit++) {
                    cur1 = cur1 << 1;
                    cur2 = cur2 << 1;
                    let i = ((img.height - (y + bit) - 1) * img.width + x) * 4;
                    // convert color to greyscale
                    let color = (0.2126 * img.data[i] + 0.7152 * img.data[i + 1] + 0.0722 *
                        img.data[i + 2]);
                    // we want higher numbers to be darker colors
                    color = 255 - color;
                    // multiple color by alpha channel
                    color = color * img.data[i + 3] / 255;
                    // set 0 1 or both bits depending on color
                    if (color > 170) {
                        cur1 |= 1;
                        cur2 |= 1;
                    } else if (color > 85) {
                        // for grey, alternate which of the two bits we set
                        if (bit & 1) {
                            cur1 |= 1;
                        } else {
                            cur2 |= 1;
                        }
                    }
                }
                dataView[off1++] = cur1;
                dataView[off2++] = cur2;
            }
            offset = off2;
        }
        dataView.set(endDoc, offset);
        return data;
    }
    public createContext(width, height) {
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }
}
