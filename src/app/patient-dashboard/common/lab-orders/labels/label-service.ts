import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
// import * as blobStream from 'blob-stream';
import * as bardcode from 'bardcode';
import { RectangleToPath } from './rectangle-to-path';
import { DymoTurbo } from './dymo-turbo';

@Injectable()
export class LabelService {
  constructor() {}
  public directPrint(label, copies) {
    const t = new DymoTurbo();
    t.printLabel(label, copies);
  }
  public generateBarcodes(labels) {
    let doc = new PDFDocument({
      size: [162, 92]
    });
    labels.forEach((label, i) => {
      if (i > 0) {
        doc.addPage();
      }
      const barcodeString = bardcode.drawBarcode('svg', label.orderNumber, {
        height: 20,
        maxWidth: 160
      });
      const svgPath = new RectangleToPath().convertToPath(barcodeString);

      doc = this.drawText(doc, 'Date Ordered : ' + label.orderDate, {
        x: 2,
        y: 2
      });
      doc = this.drawText(doc, 'Test : ' + label.testName, {
        x: 2,
        y: 15
      });
      doc = this.drawText(doc, 'Patient ID : ' + label.identifier, {
        x: 2,
        y: 30
      });
      doc = this.drawText(doc, 'Order Number : ' + label.orderNumber, {
        x: 2,
        y: 45
      });
      doc.save();
      doc.translate(0, 60).path(svgPath.path).fill('#000000').restore();
    });
    doc.end();
    const stream = doc.pipe(blobStream());
    const subject = new Subject<any>();
    stream.on('finish', () => {
      // var blob = stream.toBlob('application/pdf');
      const url = stream.toBlobURL('application/pdf');
      // window.open(url);
      // iframe.src = stream.toBlobURL('application/pdf');
      subject.next(url);
    });
    return subject;
  }

  private measureHeight(text, fontSize, min, width) {
    const temp = new PDFDocument();
    temp.fontSize(fontSize);
    temp.x = 0;
    temp.y = 0;
    temp.text(text, {
      width: width
    });

    return temp.y;
  }

  private fittedSize(text, fontSize, min, step, bounds) {
    if (fontSize <= min) {
      return min;
    }

    const height = this.measureHeight(text, fontSize, min, bounds.width);

    if (height <= bounds.height) {
      return fontSize;
    }

    return this.fittedSize(text, fontSize - step, min, step, bounds);
  }

  private drawText(doc, text, options) {
    const bounds = {
      width: 158,
      height: 12
    };
    const bestSize = this.fittedSize(text, 14, 8, 0.25, bounds);
    doc.fontSize(bestSize);

    doc.text(text, options.x, options.y, {
      width: bounds.width,
      height: bounds.height,
      ellipsis: false
    });
    return doc;
  }
}
