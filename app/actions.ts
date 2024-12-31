"use server";

import { requireUser } from "./utils/hooks";
import { parseWithZod } from '@conform-to/zod';
import { invoiceSchema, onboardingSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { redirect } from "next/navigation";
import { emailClient } from "./utils/mailtrap";
import { formatCurrency } from "./utils/formatCurrency";

export async function onboardUser(prevState:any, formData: FormData){
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: onboardingSchema,
    });

    if(submission.status !== "success"){
        return submission.reply();
    }

    
    const data = await prisma.user.update({
        where: {
            id: session.user?.id,
        },
        
        data: {
            firstName: submission.value.firstName,
            lastName: submission.value.lastName,
            address: submission.value.address,
        },
    });

    return redirect("/dashboard");
}


export async function createInvoice(prevState:any, formData: FormData){
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: invoiceSchema,
    });

    if(submission.status !== "success"){
        return submission.reply();
    }

    const data = await prisma.invoice.create({
        data: {
            clientName: submission.value.clientName,
            clientEmail: submission.value.clientEmail,
            clientAddress: submission.value.clientAddress,
            currency: submission.value.currency,
            date: submission.value.date, //string
            dueDate: submission.value.dueDate, 
            fromName: submission.value.fromName, 
            fromEmail: submission.value.fromEmail, 
            fromAddress: submission.value.fromAddress, 
            invoiceItemDescription: submission.value.invoiceItemDescription, 
            invoiceItemQuantity: submission.value.invoiceItemQuantity, 
            invoiceItemRate: submission.value.invoiceItemRate, 
            invoiceName: submission.value.invoiceName, 
            invoiceNumber: submission.value.invoiceNumber, 
            status: submission.value.status, 
            total: submission.value.total, 
            note: submission.value.note, 
            userId: session.user?.id,
        }
    });

    const sender = {
        email: "hello@demomailtrap.com",
        name: "Khoa Mailtrap",
      };

    emailClient.send({
        from: sender,
        to: [{email: "khoanguyen23051996@gmail.com"}],
        template_uuid: "4a64fcb8-c227-47bf-ab60-911844a7803a",
        template_variables: {
        clientName: submission.value.clientName,
        invoiceNumber: submission.value.invoiceNumber,
        invoiceDueDate: new Intl.DateTimeFormat('en-US', {
            dateStyle: 'long',
        }).format(new Date(submission.value.date)),
        invoiceAmount: formatCurrency({
            amount: submission.value.total,
            currency: submission.value.currency as any, 
        }),
        invoiceLink: `http://localhost:3000/api/invoice/${data.id}`,
        }
    })

    if (!submission.value || !submission.value.date || !submission.value.currency) {
        throw new Error("Invalid submission data");
    }

    return redirect("/dashboard/invoices");
}

export async function editInvoice(prevState:any, formData: FormData){
    const session = await requireUser();

    const submission = parseWithZod(formData,{
        schema: invoiceSchema,
    });

    if(submission.status !== 'success'){
        return submission.reply();
    }

    const data = await prisma.invoice.update({
        where: {
            id: formData.get("id") as string,
            userId: session.user?.id,
        },
        data: {
            clientName: submission.value.clientName,
            clientEmail: submission.value.clientEmail,
            clientAddress: submission.value.clientAddress,
            currency: submission.value.currency,
            date: submission.value.date, //string
            dueDate: submission.value.dueDate, 
            fromName: submission.value.fromName, 
            fromEmail: submission.value.fromEmail, 
            fromAddress: submission.value.fromAddress, 
            invoiceItemDescription: submission.value.invoiceItemDescription, 
            invoiceItemQuantity: submission.value.invoiceItemQuantity, 
            invoiceItemRate: submission.value.invoiceItemRate, 
            invoiceName: submission.value.invoiceName, 
            invoiceNumber: submission.value.invoiceNumber, 
            status: submission.value.status, 
            total: submission.value.total, 
            note: submission.value.note, 
            userId: session.user?.id,
        },
    });

    const sender = {
        email: "hello@demomailtrap.com",
        name: "Khoa Mailtrap",
      };

    emailClient.send({
        from: sender,
        to: [{email: "khoanguyen23051996@gmail.com"}],
        template_uuid: "aa3d55b1-9136-4570-ac41-25a37a7d732b",
        template_variables: {
        clientName: submission.value.clientName,
        invoiceNumber: submission.value.invoiceNumber,
        invoiceDueDate: new Intl.DateTimeFormat('en-US', {
            dateStyle: 'long',
        }).format(new Date(submission.value.date)),
        invoiceAmount: formatCurrency({
            amount: submission.value.total,
            currency: submission.value.currency as any, 
        }),
        invoiceLink: `http://localhost:3000/api/invoice/${data.id}`,
        }
    })

    return redirect("/dashboard/invoices")
}

export async function DeleteInvoice(invoiceId: string){
    const session = await requireUser();

    const data = await prisma.invoice.delete({
        where: {
            userId: session.user?.id,
            id: invoiceId,
        },
    });

    return redirect("/dashboard/invoices");
}

export async function MarkAsPaidAction(invoiceId: string){
    const session = await requireUser();

    const data = await prisma.invoice.update({
        where: {
            userId: session.user?.id,
            id: invoiceId,
        },

        data: {
            status: "PAID",
        },
    });

    return redirect("/dashboard/invoices");
}
