
import { useForm, UseFormProps, FieldValues, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema, z } from "zod";
import { useApiErrorHandler } from "@/utils/apiUtils";

interface UseValidatedFormOptions<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
  onError?: (error: unknown) => void;
}

/**
 * A custom hook that combines React Hook Form with Zod validation
 */
export function useValidatedForm<T extends FieldValues, S extends ZodSchema>(
  schema: S,
  options: UseValidatedFormOptions<T> = {}
): UseFormReturn<z.infer<S>> {
  const { onError, ...formOptions } = options;
  const { handleError } = useApiErrorHandler();
  
  const form = useForm<z.infer<S>>({
    ...formOptions,
    resolver: zodResolver(schema),
  });
  
  // Override the handleSubmit method to include error handling
  const originalHandleSubmit = form.handleSubmit;
  form.handleSubmit = (onValid, onInvalid) => {
    return originalHandleSubmit((data) => {
      try {
        return onValid(data);
      } catch (error) {
        if (onError) {
          onError(error);
        } else {
          handleError(error, {
            defaultMessage: "Formular konnte nicht verarbeitet werden"
          });
        }
        return;
      }
    }, onInvalid);
  };
  
  return form as UseFormReturn<z.infer<S>>;
}
