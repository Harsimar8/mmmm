export interface AssetDefinition {

  id: string;

  name: string;

  category: string;

  entityType: string;

  role: string;

  
  properties: Record<string, unknown>;

}