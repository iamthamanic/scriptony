
import React from 'react';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { PasswordInput } from './PasswordInput';
import { useValidatedForm } from '@/hooks/useValidatedForm';
import { registerSchema, type RegisterFormValues } from '@/validation/authSchemas';

interface RegisterFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  loading, 
  setLoading,
  onSuccess
}) => {
  const { t } = useTranslation();
  
  const form = useValidatedForm<RegisterFormValues>(registerSchema, {
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const handleRegister = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name
          }
        }
      });
      
      if (error) throw error;
      
      toast.success(t('auth.success.registration') || "Registrierung erfolgreich! Bitte überprüfe deinen Posteingang.");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || t('auth.error.registration') || "Registrierung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.name')}</FormLabel>
              <FormControl>
                <Input placeholder="Max Mustermann" {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.password')}</FormLabel>
              <FormControl>
                <PasswordInput field={field} disabled={loading} />
              </FormControl>
              <FormDescription>
                {t('auth.passwordRequirements') || "Mindestens 6 Zeichen"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('common.loading') : t('common.register')}
        </Button>
      </form>
    </Form>
  );
};
