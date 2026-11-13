import { ApiError } from '@/lib/api-error';
import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

export function applyApiError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  schema: { shape: object },
) {
  const isFormField = (key: string): key is Path<T> =>
    Object.hasOwn(schema.shape, key);

  if (!(error instanceof ApiError)) {
      console.error(error);
      setError("root", { message: "Something went wrong" });
      return;
    }
  
    let hasFieldError = false;
  
    for (const [field, message] of Object.entries(error.fieldErrors)) {
      if (!isFormField(field)) continue;
  
      setError(field, { message: message[0] });
      hasFieldError = true;
    }
  
    if (hasFieldError) return;
  
    setError("root", { message: error.formErrors[0] ?? error.message });
}