export interface PointBlankParams {
   userId: string;
}
export interface PointBlankResponse {
   status: number;
   message: string;
   data?: {
      username?: string;
      isValid?: boolean;
      country?: string;
   };
}
export interface PointBlankConfirm {
   is_publisher_validate_error: boolean;
   errorCode: string
   user?: {
      userId: string;
   };
   confirmationFields?: {
      country: string;
   };
}
