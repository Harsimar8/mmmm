import { Injectable } from '@angular/core';

import { AssetLibraryService } from './AssetLibraryService';
import { AssetParser } from '../parser/AssetParser';

@Injectable({
  providedIn: 'root'
})
export class AssetImportService {

  constructor(
    private assetLibrary: AssetLibraryService
  ) {}

  async import(file: File): Promise<void> {

  const text = await file.text();

  const json = JSON.parse(text);
  console.log("JSON:", json);

  const assets = AssetParser.parse(json);
  console.log("Parsed assets:", assets);

  this.assetLibrary.loadAssets(assets);

  // Save for next refresh
  localStorage.setItem(
    "asset-library",
    JSON.stringify(assets)
  );

}

}