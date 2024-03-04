'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

/** By adding the 'use server',
 * you mark all the exported functions within the file as server functions.
 * These server functions can then be imported into Client and Server components,
 * making them extremely versatile. */

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['paid', 'pending']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const invoicesTablePath = `/dashboard/invoices`;

function redirectAfterRevalidate() {
  revalidatePath(invoicesTablePath);
  redirect(invoicesTablePath);
}

export async function createInvoice(formData: FormData) {
  // const rawFormData = Object.fromEntries(formData.entries());
  // try {
  const { amount, customerId, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  console.log('createInvoice', {
    amount,
    customerId,
    status,
    amountInCents,
    date,
  });

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date) 
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  redirectAfterRevalidate();
  // } catch (error) {
  //   console.log('createInvoice : error', error);
  // }
}

export async function updateInvoice(id: string, formData: FormData) {
  const { amount, customerId, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id=${customerId}, amount=${amountInCents}, status=${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  redirectAfterRevalidate();
}

export async function deleteInvoice(id: string) {
  try {
    await sql`
      DELETE FROM invoices WHERE id = ${id}
    `;

    revalidatePath(invoicesTablePath);
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}
