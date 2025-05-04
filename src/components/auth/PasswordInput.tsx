
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";

interface PasswordInputProps {
  field: any;
  disabled?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ field, disabled = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="relative">
      <Input 
        placeholder="••••••••" 
        type={showPassword ? "text" : "password"}
        {...field} 
        disabled={disabled}
      />
      <Button 
        type="button"
        variant="ghost" 
        size="sm"
        className="absolute right-0 top-0 h-full px-3" 
        onClick={togglePasswordVisibility}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </Button>
    </div>
  );
};
