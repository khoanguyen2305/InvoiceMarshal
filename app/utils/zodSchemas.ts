import { z } from 'zod';

export const onboardingSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    address: z.string().min(1, "Address is required"),
});

export const invoiceSchema = z.object({
    invoiceName: z.string().min(1, "Invoice Name is required"),
    total: z.number().min(1, "1$ is minimim"),
    status: z.enum(["PAID", "PENDING"]).default("PENDING"),
    date: z.string().min(1, "Date is required"),
    dueDate: z.number().min(0, "Due Date is required"),
    fromName: z.string().min(1, "Your Name is required"),
    fromEmail: z.string().email("Invalid Email address"),
    fromAddress: z.string().min(1, "Your Address is required"),
    clientName: z.string().min(1, "Client Name is required"),
    clientEmail: z.string().email("Invalid Email address"),
    clientAddress: z.string().min(1, "Client Address is required"),
    currency: z.string().min(1, "Currency is required"),
    invoiceNumber: z.number().min(1, "Minimim invoice number of 1"),
    note: z.string().optional(),
    invoiceItemDescription: z.string().min(1, "Description is required"),
    invoiceItemQuantity: z.number().min(1, "Quantity min 1"),
    invoiceItemRate: z.number().min(1, "Rate min 1"),
})