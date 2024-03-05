'use server';

import { signIn } from '@/auth';
import { sql } from '@vercel/postgres';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

/** By adding the 'use server',
 * you mark all the exported functions within the file as server functions.
 * These server functions can then be imported into Client and Server components,
 * making them extremely versatile. */

export async function authenticate(_: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid email or password.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['paid', 'pending'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const invoicesTablePath = `/dashboard/invoices`;

function redirectAfterRevalidate() {
  revalidatePath(invoicesTablePath);
  redirect(invoicesTablePath);
}

export async function createInvoice(
  _: State,
  formData: FormData,
): Promise<State> {
  // console.log('prevState', prevState);

  // const rawFormData = Object.fromEntries(formData.entries());
  // try {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { amount, customerId, status } = validatedFields.data;
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

    return {
      message: null,
    };
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    } as State;
  }

  redirectAfterRevalidate();
  // } catch (error) {
  //   console.log('createInvoice : error', error);
  // }
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { amount, customerId, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id=${customerId}, amount=${amountInCents}, status=${status}
      WHERE id = ${id}
    `;

    return { message: null };
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
