import {LightningElement, api, wire, track } from 'lwc';
import { loadScript, loadstyle } from "lightning/platformResourceLoader";
import pdflib from "@salesforce/resourceUrl/pdflib";
import jsPDF from "@salesforce/resourceUrl/jspdf";
import HtmlData from '@salesforce/apex/PrintExtension.getEmailMessageData';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';




export default class CreatePDF extends LightningElement {
@api emailMessageData;
@api emailMessageId;
@api emailMessageIdtracking;
@api emailpart1;
@api emailpart2;
@track datatodisplay;
@track subjectData;
@track subjectDataToDisplay;


showToast() {
  const event = new ShowToastEvent({
      title: 'success..!',
      message: 'Email Message Details has been dowmloded in Download section of your browser.',
      variant: 'success',
      mode: 'sticky'
  });
  this.dispatchEvent(event);
}

handleCase() {
  //this.dispatchEvent(new CloseActionScreenEvent());
  const closeQA = new CustomEvent('close');
  // Dispatches the event.
  this.dispatchEvent(closeQA);
}
async createPdf() {
    const pdfDoc = await PDFLib.PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(
      PDFLib.StandardFonts.TimesRoman
    ); 
    const page1 = pdfDoc.addPage();
    //alert(page1);
    //alert(page1.getSize());
    const { width, height } = page1.getSize();
    //alert(width);
    //alert(height);
    const fontSize = 10;
    page1.drawText(this.emailpart1, {
      x: 20,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: PDFLib.rgb(0, 0, 0)
    });
    const page2= pdfDoc.addPage();
    page2.drawText(this.emailpart2, {
      x: 20,
      y: height - 4 * fontSize,
      size: fontSize,
      font: timesRomanFont,
      color: PDFLib.rgb(0, 0, 0)
    });

    const pdfBytes = await pdfDoc.save();
    this.saveByteArray(this.subjectData , pdfBytes);
  }

  saveByteArray(pdfName, byte) {
    
    var blob = new Blob([byte], { type: "application/pdf" });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    var fileName = pdfName;
    link.download = fileName;
    link.click();
    this.showToast();
    this.handleCase();
  }

  
renderedCallback(){
    loadScript(this, jsPDF);
    loadScript(this, pdflib).then(() => {
        HtmlData({recordId: this.emailMessageId})
                    .then((result) => {
                                //console.log(JSON.parse(result.data));
                                this.emailMessageIdtracking = result[0];
                                
                                var strLength = this.emailMessageIdtracking.TextBody.length;
                                console.log('strLength:', strLength);

                                this.emailpart1 = 'Subject : ' + this.emailMessageIdtracking.Subject + '\n';
                                this.emailpart1 += this.emailMessageIdtracking.TextBody.substring(0 , (strLength / 2));
                                this.emailpart2 = this.emailMessageIdtracking.TextBody.substring((strLength / 2));
                                this.subjectDataToDisplay = 'Subject : ' + this.emailMessageIdtracking.Subject + '\n'; 
                                this.datatodisplay = this.emailMessageIdtracking.HtmlBody;
                                this.subjectData = this.emailMessageIdtracking.RelatedTo.Name;
                                //alert(result[0].HtmlBody);
                    })
                    .catch((error) => {
                                console.log('In connected call back error....');
                    });
    });
}

convertHTMLToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(this.emailMessageIdtracking.emailpart1, 10, 10 , {}, {});
  doc.addPage();
  doc.text(this.emailMessageIdtracking.emailpart2, 10, 10, {}, {});
  doc.save("demo.pdf");
}


}