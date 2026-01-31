export interface CreateBuildingInput {
  name: string;
  description?: string;
  location?: string;
}

export interface UpdateBuildingInput {
  name?: string;
  description?: string;
  location?: string;
}
