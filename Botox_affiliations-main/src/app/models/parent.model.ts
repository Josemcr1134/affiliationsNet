export interface Parent {
    user: {
        first_name: string;
        last_name: string;
        document_type: string;
        document: string;
        email: string;
        phone_number: string;
        gender: string;
        password1: string;
        password2: string;
    };
    affiliate: {
        marital_status: string;
        birthdate: string;
        privacy_policy: boolean;
        terms_and_conditions: boolean;
        relationship: string;
    };
    plan_affiliation: {
        plan: string;
    };
    address: {
        name: string;
        address_detail: string;
        neighborhood: string;
    };
}
