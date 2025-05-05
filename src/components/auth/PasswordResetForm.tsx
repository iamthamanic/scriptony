
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";

import { customSupabase } from "@/integrations/supabase/customClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { passwordResetSchema, type PasswordResetFormValues } from '@/validation/authSchemas';

interface PasswordResetFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onSuccess: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ loading, setLoading, onSuccess }) => {
  const { t } = useTranslation();

  const form = useValidatedForm<PasswordResetFormValues, typeof passwordResetSchema>(passwordResetSchema, {
    defaultValues: {
      email: ""
    }
  });

  const handlePasswordReset = async (data: PasswordResetFormValues) => {
    try {
      setLoading(true);
      const { error } = await customSupabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth?mode=update-password`
      });
      
      if (error) {
        toast.error(error.message || t('auth.error.passwordReset'));
      } else {
        toast.success(t('auth.success.passwordResetEmail'));
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || t('auth.error.passwordReset'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handlePasswordReset)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.email')}</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" type="email" {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('common.loading') : t('auth.resetPassword')}
        </Button>
      </form>
    </Form>
  );
};

export default PasswordResetForm;
