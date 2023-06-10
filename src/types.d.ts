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
  fit: shoe_fit;
};

enum Order {
  ASC = "asc",
  DESC = "desc",
}

type OrderType = Order | undefined;

enum SortBy {
  PRICE = "price",
  SIZE = "size",
  NAME = "name",
  COLOR = "color",
}

type SortByType = SortBy | undefined;

enum ERROR_REASON {
  NOT_LOGGED_IN = "User not logged in",
  UNVERIFIED_ACCOUNT = "Please verify your account",
  NOT_ADMIN = "You are not an admin",
}
