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

type cookies = {
  session_id: string;
};

enum Order {
  ASC = "asc",
  DESC = "desc",
}

enum SortBy {
  PRICE = "price",
  SIZE = "size",
  NAME = "name",
  COLOR = "color",
}

enum ERROR_REASON {
  NOT_LOGGED_IN = "User not logged in",
  UNVERIFIED_ACCOUNT = "Please verify your account",
  NOT_ADMIN = "You are not an admin",
}
