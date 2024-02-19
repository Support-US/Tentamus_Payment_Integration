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
    InvoiceNumbers?: string;
    PaymentId?: string;
    createdAt?: string;
    updatedAt?: string;
    PaymentStatus?: string;
    CurrencyDecimalDigit?: string;
    BeforePaymentSAPstatus?: string;
    AfterPaymentSAPstatus?: string;
    SAPErrorMessage?: string;
    SAPObjectID?: string;
    Description?: string;
};
export declare type PaymentDetailsUpdateFormValidationValues = {
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
    InvoiceNumbers?: ValidationFunction<string>;
    PaymentId?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
    PaymentStatus?: ValidationFunction<string>;
    CurrencyDecimalDigit?: ValidationFunction<string>;
    BeforePaymentSAPstatus?: ValidationFunction<string>;
    AfterPaymentSAPstatus?: ValidationFunction<string>;
    SAPErrorMessage?: ValidationFunction<string>;
    SAPObjectID?: ValidationFunction<string>;
    Description?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PaymentDetailsUpdateFormOverridesProps = {
    PaymentDetailsUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
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
    InvoiceNumbers?: PrimitiveOverrideProps<TextAreaFieldProps>;
    PaymentId?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
    PaymentStatus?: PrimitiveOverrideProps<TextFieldProps>;
    CurrencyDecimalDigit?: PrimitiveOverrideProps<TextFieldProps>;
    BeforePaymentSAPstatus?: PrimitiveOverrideProps<TextFieldProps>;
    AfterPaymentSAPstatus?: PrimitiveOverrideProps<TextFieldProps>;
    SAPErrorMessage?: PrimitiveOverrideProps<TextFieldProps>;
    SAPObjectID?: PrimitiveOverrideProps<TextFieldProps>;
    Description?: PrimitiveOverrideProps<TextFieldProps>;
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
