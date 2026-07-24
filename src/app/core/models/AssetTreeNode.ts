export interface AssetTreeNode {


    name: string;

    children?: AssetTreeNode[];

    assetId?: string;

    expanded?: boolean;

}