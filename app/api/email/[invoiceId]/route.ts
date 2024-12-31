import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";


export async function POST(request: Request, {params,}: {params: Promise<{invoiceId: string}>}){
    try {
        const session = await requireUser();
        const {invoiceId} = await params;
        const invoiceData = await prisma.invoice.findUnique({
            where: {
                id: invoiceId,
                userId: session.user?.id,
            },
        });

        if(!invoiceData){
            return NextResponse.json({error: "Invoice not found"}, {status: 404});
        }

        const sender = {
            email: "hello@demomailtrap.com",
            name: "Khoa Mailtrap",
            };
        
        emailClient.send({
            from: sender,
            to: [{email: "khoanguyen23051996@gmail.com"}],
            template_uuid: "9f76c003-6d04-4a8e-816b-b39081d6da0c",
            template_variables: {
                "company_info_name": "InvoiceMashal",
                "first_name": invoiceData.clientName,
                "company_info_address": "Quan 6",
                "company_info_city": "TP.HCM",
                "company_info_zip_code": "232323",
                "company_info_country": "Viet Nam"
            } ,      
        });

        return NextResponse.json({success: true});

    } catch(error) {
        return NextResponse.json({error: 'Failed to send Email reminder'}, {status: 500});
    }
}