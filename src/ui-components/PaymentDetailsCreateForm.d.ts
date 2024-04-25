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
    InvoiceNumbers?: string;
    PaymentId?: string;
    createdAt?: string;
    PaymentStatus?: string;
    CurrencyDecimalDigit?: string;
    BeforePaymentSAPstatus?: string;
    AfterPaymentSAPstatus?: string;
    SAPErrorMessage?: string;
    SAPObjectID?: string;
    Description?: string;
    PaymentMailStatus?: string;
    SAPMailStatus?: string;
    ClientName?: string;
    ClientCompanyID?: string;
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
    InvoiceNumbers?: ValidationFunction<string>;
    PaymentId?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    PaymentStatus?: ValidationFunction<string>;
    CurrencyDecimalDigit?: ValidationFunction<string>;
    BeforePaymentSAPstatus?: ValidationFunction<string>;
    AfterPaymentSAPstatus?: ValidationFunction<string>;
    SAPErrorMessage?: ValidationFunction<string>;
    SAPObjectID?: ValidationFunction<string>;
    Description?: ValidationFunction<string>;
    PaymentMailStatus?: ValidationFunction<string>;
    SAPMailStatus?: ValidationFunction<string>;
    ClientName?: ValidationFunction<string>;
    ClientCompanyID?: ValidationFunction<string>;
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
    InvoiceNumbers?: PrimitiveOverrideProps<TextAreaFieldProps>;
    PaymentId?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    PaymentStatus?: PrimitiveOverrideProps<TextFieldProps>;
    CurrencyDecimalDigit?: PrimitiveOverrideProps<TextFieldProps>;
    BeforePaymentSAPstatus?: PrimitiveOverrideProps<TextFieldProps>;
    AfterPaymentSAPstatus?: PrimitiveOverrideProps<TextFieldProps>;
    SAPErrorMessage?: PrimitiveOverrideProps<TextFieldProps>;
    SAPObjectID?: PrimitiveOverrideProps<TextFieldProps>;
    Description?: PrimitiveOverrideProps<TextFieldProps>;
    PaymentMailStatus?: PrimitiveOverrideProps<TextFieldProps>;
    SAPMailStatus?: PrimitiveOverrideProps<TextFieldProps>;
    ClientName?: PrimitiveOverrideProps<TextFieldProps>;
    ClientCompanyID?: PrimitiveOverrideProps<TextFieldProps>;
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
