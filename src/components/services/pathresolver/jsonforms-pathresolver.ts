
import {PathUtil} from "../pathutil";

export interface IPathResolver {
    toInstancePath(schemaPath:string): string

    resolveUi(instance:any, uiPath:string): any

    resolveInstance(instance:any, path:string): any

    resolveSchema(schema: SchemaElement, schemaPath: string): SchemaElement

    lastFragment(path:string):string

    resolveToLastModel(instance:any, path:string):any;
}

export class PathResolver implements IPathResolver {

    private pathMapping:{ [id: string]: string; } = {};
    constructor() { }

    toInstancePath = (path:string):string => {
        return PathUtil.normalize(path);
    };

    resolveUi = (instance:any, uiPath:string):any => {
        var p = uiPath + "/scope/$ref";
        if (this.pathMapping !== undefined && this.pathMapping.hasOwnProperty(p)) {
            p = this.pathMapping[p];
        }
        return this.resolveInstance(instance, p);
    };


    resolveInstance = (instance:any, schemaPath:string):any => {
        return this.innerResolveInstance(instance, schemaPath, false);
    };
    private innerResolveInstance = (instance:any, schemaPath:string, createMissing:boolean ):any => {
        var fragments = PathUtil.toPropertyFragments(this.toInstancePath(schemaPath));
        return fragments.reduce(function (currObj, fragment,curIndex) {
            if(currObj==undefined){
                return undefined;
            }
            if (currObj instanceof Array) {
                return currObj.map(function (item) {
                    return item[fragment];
                });
            }
            if(!currObj.hasOwnProperty(fragment)&&createMissing){
                currObj[fragment]={};
            }
            return currObj[fragment];
        }, instance);
    };
    /**
     *
     * @param schema the schema to resolve the path against
     * @param path a schema path
     * @returns {T|*|*}
     */
    resolveSchema = (schema: any, path: string): any => {
        try {
            var fragments = PathUtil.toPropertyFragments(path);
            return fragments.reduce(function (subSchema, fragment) {
                if (fragment == "#") {
                    return subSchema
                } else if (subSchema instanceof Array) {
                    return subSchema.map(function (item) {
                        return item[fragment];
                    });
                }
                return subSchema[fragment];
            }, schema);
        } catch(err) {
            return undefined;
        }
    };

    lastFragment=(path:string):string =>{
        let fragments:Array<string> = PathUtil.filterNonKeywords(PathUtil.toPropertyFragments(path));
        return fragments[fragments.length-1];
    }

    resolveToLastModel=(instance:any, path:string):any =>{
        let fragments:Array<string> = PathUtil.filterNonKeywords(PathUtil.toPropertyFragments(path));
        var fragmentsToObject:Array<string> =fragments.slice(0,fragments.length-1);
        return this.innerResolveInstance(instance, fragmentsToObject.join("/"), true);
    }
}
