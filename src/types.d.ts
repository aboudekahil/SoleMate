type UserCreateBody = {
  name: string;
  password: string;
  email_address: string;
  family_name: string;
  payment_option: users_payment_option;
  payment_values: {
    OMT?: string;
    Whish?: string;
  };
  phone_number: string;
  city: string;
  building: string;
  apartment: string;
  street: string;
};

type ErrorBundle = {
  title: string;
  message: string;
};

type cookies = {
  session_id: string;
};

type ShoeSize = {
  size: number;
  price: number;
  quantity: number;
};

type ShoeCreateBody = {
  name: string;
  condition: shoes_condition;
  color: string;
  sizes: string;
};
