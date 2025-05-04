
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
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
  FormMessage
} from "@/components/ui/form";
import { PasswordInput } from './PasswordInput';

interface LoginFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ loading, setLoading }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const loginSchema = z.object({
    email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
    password: z.string().min(6, "Das Passwort muss mindestens 6 Zeichen lang sein.")
  });
  
  type LoginFormValues = z.infer<typeof loginSchema>;
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleLogin = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (error) throw error;
      
      toast.success(t('auth.success.login'));
      navigate('/');
    } catch (error: any) {
      toast.error(t('auth.error.login'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
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
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('common.loading') : t('common.login')}
        </Button>
      </form>
    </Form>
  );
};
