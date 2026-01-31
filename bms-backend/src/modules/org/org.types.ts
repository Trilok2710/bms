export interface CreateOrgInput {
  name: string;
  description?: string;
}

export interface UpdateOrgInput {
  name?: string;
  description?: string;
}

export interface OrgResponse {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
}
