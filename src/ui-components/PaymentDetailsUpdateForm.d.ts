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
export declare type PaymentDetailsUpdateFormInputValues = {
    FirstName?: string;
    LastName?: string;
    Email?: string;
    AddressLine1?: string;
    AddressLine2?: string;
    Country?: string;
    State?: string;
    City?: string;
    PostalCode?: string;
    PhoneNumber?: string;
    Amount?: string;
    Status?: string;
    Currency?: string;
    InvoiceNumbers?: string;
    TransactionID?: string;
    MerchantID?: string;
    PaymentId?: string;
    SAPBankPaymentAdviceId?: string;
    createdAt?: string;
    updatedAt?: string;
    SecretKey?: string;
    SecretValue?: string;
    OdataUsername?: string;
    OdataPassword?: string;
};
export declare type PaymentDetailsUpdateFormValidationValues = {
    FirstName?: ValidationFunction<string>;
    LastName?: ValidationFunction<string>;
    Email?: ValidationFunction<string>;
    AddressLine1?: ValidationFunction<string>;
    AddressLine2?: ValidationFunction<string>;
    Country?: ValidationFunction<string>;
    State?: ValidationFunction<string>;
    City?: ValidationFunction<string>;
    PostalCode?: ValidationFunction<string>;
    PhoneNumber?: ValidationFunction<string>;
    Amount?: ValidationFunction<string>;
    Status?: ValidationFunction<string>;
    Currency?: ValidationFunction<string>;
    InvoiceNumbers?: ValidationFunction<string>;
    TransactionID?: ValidationFunction<string>;
    MerchantID?: ValidationFunction<string>;
    PaymentId?: ValidationFunction<string>;
    SAPBankPaymentAdviceId?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
    SecretKey?: ValidationFunction<string>;
    SecretValue?: ValidationFunction<string>;
    OdataUsername?: ValidationFunction<string>;
    OdataPassword?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PaymentDetailsUpdateFormOverridesProps = {
    PaymentDetailsUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    FirstName?: PrimitiveOverrideProps<TextFieldProps>;
    LastName?: PrimitiveOverrideProps<TextFieldProps>;
    Email?: PrimitiveOverrideProps<TextFieldProps>;
    AddressLine1?: PrimitiveOverrideProps<TextFieldProps>;
    AddressLine2?: PrimitiveOverrideProps<TextFieldProps>;
    Country?: PrimitiveOverrideProps<TextFieldProps>;
    State?: PrimitiveOverrideProps<TextFieldProps>;
    City?: PrimitiveOverrideProps<TextFieldProps>;
    PostalCode?: PrimitiveOverrideProps<TextFieldProps>;
    PhoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    Amount?: PrimitiveOverrideProps<TextFieldProps>;
    Status?: PrimitiveOverrideProps<TextFieldProps>;
    Currency?: PrimitiveOverrideProps<TextFieldProps>;
    InvoiceNumbers?: PrimitiveOverrideProps<TextAreaFieldProps>;
    TransactionID?: PrimitiveOverrideProps<TextFieldProps>;
    MerchantID?: PrimitiveOverrideProps<TextFieldProps>;
    PaymentId?: PrimitiveOverrideProps<TextFieldProps>;
    SAPBankPaymentAdviceId?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
    SecretKey?: PrimitiveOverrideProps<TextFieldProps>;
    SecretValue?: PrimitiveOverrideProps<TextFieldProps>;
    OdataUsername?: PrimitiveOverrideProps<TextFieldProps>;
    OdataPassword?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PaymentDetailsUpdateFormProps = React.PropsWithChildren<{
    overrides?: PaymentDetailsUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    paymentDetails?: any;
    onSubmit?: (fields: PaymentDetailsUpdateFormInputValues) => PaymentDetailsUpdateFormInputValues;
    onSuccess?: (fields: PaymentDetailsUpdateFormInputValues) => void;
    onError?: (fields: PaymentDetailsUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PaymentDetailsUpdateFormInputValues) => PaymentDetailsUpdateFormInputValues;
    onValidate?: PaymentDetailsUpdateFormValidationValues;
} & React.CSSProperties>;
export default function PaymentDetailsUpdateForm(props: PaymentDetailsUpdateFormProps): React.ReactElement;
