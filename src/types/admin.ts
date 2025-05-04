
export interface UnlockCode {
  id: string;
  code: string;
  tier_level: string;
  is_admin: boolean;
  created_at: Date;
  used_by: string[] | null;
  expiry_at: Date | null;
  is_single_use: boolean;
}

export interface UnlockCodeFormData {
  code: string;
}
