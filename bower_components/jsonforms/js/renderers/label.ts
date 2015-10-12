/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../services.ts"/>

class Label implements JSONForms.IRenderer {

    priority = 1;

    render(element:JSONForms.UISchemaElement, schema: SchemaElement, schemaPath: string, dataProvider: JSONForms.IDataProvider): JSONForms.IRenderDescription {
        var text = element['text'];
        var size = 99;

        return {
            "type": "Widget",
            "size": size,
            "template": ` <div class="jsf-label">{{text}}</div>`
        };
    }

    isApplicable(element:JSONForms.UISchemaElement):boolean {
        return element.type == "Label";
    }

}

var app = angular.module('jsonforms.label', ['jsonforms.services']);

app.run(['RenderService', function(RenderService) {
    RenderService.register(new Label());
}]);