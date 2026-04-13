export type Profile = {
  id: string;
  username: string;
  trust_score: number;
  location: {
    latitude: number;
    longitude: number;
  };
  created_at: string;
};

export type ItemStatus = "available" | "borrowed";

export type ItemCategory =
  | "tools"
  | "electronics"
  | "kitchen"
  | "sports"
  | "books"
  | "other";

export type Item = {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  category: ItemCategory;
  image_url: string | null;
  status: ItemStatus;
  latitude: number;
  longitude: number;
  created_at: string;
};

export type BorrowStatus = "pending" | "active" | "returned" | "overdue";

export type Borrow = {
  id: string;
  item_id: string;
  borrower_id: string;
  status: BorrowStatus;
  due_date: string;
  created_at: string;
};
