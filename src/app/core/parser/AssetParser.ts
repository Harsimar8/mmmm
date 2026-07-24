import { AssetDefinition } from '../models/AssetDefinition';

export class AssetParser {

    static parse(json: any): AssetDefinition[] {

        const assets: AssetDefinition[] = [];

        if (!json.categories) {
            throw new Error('Invalid Asset Library');
        }

        for (const category of json.categories) {

            for (const asset of category.assets) {

                assets.push({

                    id: asset.id,

                    name: asset.name,

                    category: category.name,

                    entityType: asset.entityType,

                    role: asset.role,


                    properties: asset.properties ?? {}

                });

            }

        }

        return assets;

    }

}