import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { formatCurrency } from "@/app/utils/formatCurrency";

export async function GET(request: Request,{params}: {params: Promise<{ invoiceId: string }> }) {
    const{invoiceId} = await params;

    const data = await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
        },
        select:{
            invoiceName: true,
            invoiceNumber: true,
            currency: true,
            fromName: true,
            fromEmail: true,
            fromAddress: true,
            clientName: true,
            clientEmail: true,
            clientAddress: true,
            date: true,
            dueDate: true,
            invoiceItemDescription: true,
            invoiceItemQuantity: true,
            invoiceItemRate: true,
            total: true,
            note: true,
        },
    });

    if(!data){
        return NextResponse.json({error: "Invoice not found"}, {status: 404});
    }

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    pdf.setFont("helvetica") //set font

    //set header
    pdf.setFontSize(24);
    pdf.text(data.invoiceName, 20, 20);

    //From section
    pdf.setFontSize(12);
    pdf.text("From", 20, 40);
    pdf.setFontSize(10);
    pdf.text([data.fromName, data.fromEmail, data.fromAddress], 20, 45);

    //Client Section
    pdf.setFontSize(12);
    pdf.text("Bill to", 20, 65);
    pdf.setFontSize(10);
    pdf.text([data.clientName, data.clientEmail, data.clientAddress], 20, 70);

    //Invoice Detail
    pdf.setFontSize(10);
    pdf.text(`Invoice Number: #${data.invoiceNumber}`, 120, 40);
    pdf.text(
        `Date: ${new Intl.DateTimeFormat("en-US", {
            dateStyle: "long",
        }).format(data.date)}`, 120, 45
    );
    pdf.text([data.clientName, data.clientEmail, data.clientAddress], 20, 70);
    pdf.text(`Due Date: Net ${data.dueDate}`, 120, 50)

    //Item table header
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("Desciption", 20, 100);
    pdf.text("Quantity", 100, 100);
    pdf.text("Rate", 130, 100);
    pdf.text("Total", 160, 100);

    //Draw header line
    pdf.line(20, 102, 190, 102);

    //Item detail
    pdf.setFont("helvatica", "normal");
    pdf.text(data.invoiceItemDescription, 20, 110);
    pdf.text(data.invoiceItemQuantity.toString(), 100, 110);
    pdf.text(formatCurrency({
        amount: data.invoiceItemRate,
        currency: data.currency as any
    }), 130, 110);
    pdf.text(formatCurrency({
        amount: data.total,
        currency: data.currency as any
    }), 160, 110);

    //Total section
    pdf.line(20, 115, 190, 115);
    pdf.setFont("helvatica", "bold");
    pdf.text(`Total (${data.currency})`, 130, 130);
    pdf.text(formatCurrency({
        amount: data.total,
        currency: data.currency as any
    }), 160, 130);

    //Additional Note
    if(data.note){
        pdf.setFont("helvatica", "normal");
        pdf.setFontSize(10);
        pdf.text("Note: ", 20, 150);
        pdf.text(data.note, 20, 155);
    }

    const pdfBuffer = Buffer.from(pdf.output("arraybuffer")); //generate pdf as buffer

    //return pdf as download
    return new NextResponse(pdfBuffer, {
        headers:{
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline",
        },
    });

}