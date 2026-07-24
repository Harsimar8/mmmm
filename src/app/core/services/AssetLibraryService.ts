import { Injectable, signal, computed,inject } from '@angular/core';
import { AssetDefinition } from '../models/AssetDefinition';
import { AssetTreeNode } from '../models/AssetTreeNode';


@Injectable({
  providedIn: 'root'
})
export class AssetLibraryService {

  constructor() {

  const savedAssets = localStorage.getItem("asset-library");

  if (savedAssets) {

    const assets = JSON.parse(savedAssets) as AssetDefinition[];

    this.assets.set(assets);

    console.log("Assets restored from localStorage:", assets);

  }

}

  private readonly assets = signal<AssetDefinition[]>([]);
  readonly entityTypes = computed(() => {

  return [...new Set(

    this.assets().map(asset => asset.entityType)

  )];

});

  // Tree automatically updates whenever assets change
  readonly tree = computed(() => {

    const root: AssetTreeNode[] = [];

    for (const asset of this.assets()) {

      // -------------------------
      // Category
      // -------------------------
      let categoryNode = root.find(
        node => node.name === asset.category
      );

      if (!categoryNode) {

        categoryNode = {
          name: asset.category,
          children: []
        };

        root.push(categoryNode);
      }

      // -------------------------
      // Entity Type
      // -------------------------
      let entityTypeNode = categoryNode.children!.find(
        node => node.name === asset.entityType
      );

      if (!entityTypeNode) {

        entityTypeNode = {
          name: asset.entityType,
          children: []
        };

        categoryNode.children!.push(entityTypeNode);
      }

      // -------------------------
      // Role
      // -------------------------
      let roleNode = entityTypeNode.children!.find(
        node => node.name === asset.role
      );

      if (!roleNode) {

        roleNode = {
          name: asset.role,
          children: []
        };

        entityTypeNode.children!.push(roleNode);
      }

      // -------------------------
      // Asset
      // -------------------------
      roleNode.children!.push({
        name: asset.name,
        assetId: asset.id
      });
    }

    return root;
  });

  loadAssets(assets: AssetDefinition[]): void {

    console.log("loadAssets called");
    console.log("Assets received:", assets);

    this.assets.set(assets);
  }

  getAssets(): AssetDefinition[] {

    console.log("Assets in library:", this.assets());

    return this.assets();
  }

  clear(): void {
    this.assets.set([]);
  }

  getCategories(): string[] {

    return [...new Set(
      this.assets().map(asset => asset.category)
    )];

  }

  getEntityTypes(category: string): string[] {

    return [...new Set(
      this.assets()
        .filter(asset => asset.category === category)
        .map(asset => asset.entityType)
    )];

  }

  getRoles(category: string, entityType: string): string[] {

    return [...new Set(
      this.assets()
        .filter(asset =>
          asset.category === category &&
          asset.entityType === entityType
        )
        .map(asset => asset.role)
    )];

  }

  getAssetsByFilter(
    category: string,
    entityType: string,
    role: string
  ): AssetDefinition[] {

    return this.assets().filter(asset =>
      asset.category === category &&
      asset.entityType === entityType &&
      asset.role === role
    );

  }

  getAssetById(id: string): AssetDefinition | undefined {

    return this.assets().find(asset => asset.id === id);

  }

}