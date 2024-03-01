'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';


const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: '고객을 선택해주세요.'
    }),
    amount: z.coerce
        .number()
        .gt(0, {message: '0 보다큰 금액을 입력해주세요.'}),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: '상태를 선택해주세요.'
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({id: true, date: true});
const UpdateInvoice = FormSchema.omit({id: true, date: true});

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    })

    console.log(validatedFields);
    if(!validatedFields.success){
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: '잘못입력된 항목이 있습니다.'
        }
    }
    
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    try {
        // const rawFormData = Object.fromEntries(formData.entries());
        const date = new Date().toISOString().split('T')[0];
        const amountInCents = amount * 100;
        
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `
        
    } catch (error) {
        return {
            message : 'DB error. fail to create invoice'
        }
    }

    revalidatePath('/dashboard/invoices'); // 해당 경로가 revalidated 된다..?
    redirect('/dashboard/invoices');    // 화면 리다이렉트
    
}


export async function updateInvoice(id: string, formData: FormData) {
    try {
        const { customerId, amount, status } = UpdateInvoice.parse({
            customerId: formData.get('customerId'),
            amount: formData.get('amount'),
            status: formData.get('status'),
          });
    
          const amountInCents = amount * 100;
    
          await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
          `;
    } catch (error) {
        return {
            message : 'DB error. fail to update invoice.'
        }
    }
    

      revalidatePath('/dashboard/invoices');
      redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    throw new Error('Failed to Delete Invoice');
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
    } catch (error) {
        return 'DB error. fail to detele invoice.';
    }
    
    revalidatePath('/dashboard/invoices');
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }