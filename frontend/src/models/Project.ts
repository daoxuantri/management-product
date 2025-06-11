// /src/models/Project.ts
export interface Project {
  _id?: string;
  name: string;
  code: string;
  startDate?: string; // Thay time bằng startDate
  endDate?: string;   // Thay time bằng endDate
  supervisor: string;
  list_product: {
    product: string; // Reference to Product._id
    quantity: number;
    total_product: number;
  }[];
  total: number;
  status: string; // Thay progress bằng status
  note: string;
  createdAt?: Date;
  updatedAt?: Date;
}