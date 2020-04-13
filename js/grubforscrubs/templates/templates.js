this["grubforscrubs"] = this["grubforscrubs"] || {};
this["grubforscrubs"]["templates"] = this["grubforscrubs"]["templates"] || {};

this["grubforscrubs"]["templates"]["leaderboard"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"items") : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":2,"column":0},"end":{"line":11,"column":9}}})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<li class=\"restaurant\">\r\n    <div class=\"restaurant-logo\">\r\n        <img src=\""
    + alias2(alias1(((stack1 = ((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"avatar") : stack1)) != null ? lookupProperty(stack1,"secure_url") : stack1), depth0))
    + "\" class=\"c-leaderboard__column__logo\" alt=\""
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"school_name") : stack1), depth0))
    + " Logo\">\r\n    </div>\r\n    <h3 class=\"restaurant-name\">"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"school_name") : stack1), depth0))
    + "</h3>\r\n    <label class=\"restaurant-raised\">"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"totalRaised") : stack1), depth0))
    + "</label>\r\n    <a class=\"button\" href=\""
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"url") : stack1), depth0))
    + "/fundraise\" target=\"_blank\">Donate</a>\r\n</li>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"items") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":1,"column":0},"end":{"line":12,"column":7}}})) != null ? stack1 : "");
},"useData":true,"useBlockParams":true});