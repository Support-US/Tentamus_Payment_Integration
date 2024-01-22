/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type PaymentDetailsCreateFormInputValues = {
    FirstName?: string;
    LastName?: string;
    CompanyName?: string;
    Email?: string;
    AddressLine1?: string;
    AddressLine2?: string;
    Country?: string;
    State?: string;
    City?: string;
    PostalCode?: string;
    PhoneNumber?: string;
    Amount?: string;
    Currency?: string;
    Status?: string;
    InvoiceNumbers?: string;
    TransactionID?: string;
    MerchantID?: string;
    PaymentId?: string;
    createdAt?: string;
    updatedAt?: string;
    HMacPassword?: string;
    EncryptionPassword?: string;
};
export declare type PaymentDetailsCreateFormValidationValues = {
    FirstName?: ValidationFunction<string>;
    LastName?: ValidationFunction<string>;
    CompanyName?: ValidationFunction<string>;
    Email?: ValidationFunction<string>;
    AddressLine1?: ValidationFunction<string>;
    AddressLine2?: ValidationFunction<string>;
    Country?: ValidationFunction<string>;
    State?: ValidationFunction<string>;
    City?: ValidationFunction<string>;
    PostalCode?: ValidationFunction<string>;
    PhoneNumber?: ValidationFunction<string>;
    Amount?: ValidationFunction<string>;
    Currency?: ValidationFunction<string>;
    Status?: ValidationFunction<string>;
    InvoiceNumbers?: ValidationFunction<string>;
    TransactionID?: ValidationFunction<string>;
    MerchantID?: ValidationFunction<string>;
    PaymentId?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
    HMacPassword?: ValidationFunction<string>;
    EncryptionPassword?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PaymentDetailsCreateFormOverridesProps = {
    PaymentDetailsCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    FirstName?: PrimitiveOverrideProps<TextFieldProps>;
    LastName?: PrimitiveOverrideProps<TextFieldProps>;
    CompanyName?: PrimitiveOverrideProps<TextFieldProps>;
    Email?: PrimitiveOverrideProps<TextFieldProps>;
    AddressLine1?: PrimitiveOverrideProps<TextFieldProps>;
    AddressLine2?: PrimitiveOverrideProps<TextFieldProps>;
    Country?: PrimitiveOverrideProps<TextFieldProps>;
    State?: PrimitiveOverrideProps<TextFieldProps>;
    City?: PrimitiveOverrideProps<TextFieldProps>;
    PostalCode?: PrimitiveOverrideProps<TextFieldProps>;
    PhoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    Amount?: PrimitiveOverrideProps<TextFieldProps>;
    Currency?: PrimitiveOverrideProps<TextFieldProps>;
    Status?: PrimitiveOverrideProps<TextFieldProps>;
    InvoiceNumbers?: PrimitiveOverrideProps<TextAreaFieldProps>;
    TransactionID?: PrimitiveOverrideProps<TextFieldProps>;
    MerchantID?: PrimitiveOverrideProps<TextFieldProps>;
    PaymentId?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
    HMacPassword?: PrimitiveOverrideProps<TextFieldProps>;
    EncryptionPassword?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PaymentDetailsCreateFormProps = React.PropsWithChildren<{
    overrides?: PaymentDetailsCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: PaymentDetailsCreateFormInputValues) => PaymentDetailsCreateFormInputValues;
    onSuccess?: (fields: PaymentDetailsCreateFormInputValues) => void;
    onError?: (fields: PaymentDetailsCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PaymentDetailsCreateFormInputValues) => PaymentDetailsCreateFormInputValues;
    onValidate?: PaymentDetailsCreateFormValidationValues;
} & React.CSSProperties>;
export default function PaymentDetailsCreateForm(props: PaymentDetailsCreateFormProps): React.ReactElement;
