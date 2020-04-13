(function () {
    window.pledgeit = window.pledgeit || {};

    window.pledgeit.services = window.pledgeit.services || {};

    window.grubforscrubs = window.grubforscrubs || {};

    window.grubforscrubs.views = window.grubforscrubs.views || {};

    window.grubforscrubs.templates = window.grubforscrubs.templates || {};
}).call(this);

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
var services = pledgeit.services;
var templates = grubforscrubs.templates;
var views = grubforscrubs.views;

grubforscrubs.views.MainView = (function () {
    function MainView() {
        this._initialize();
    }

    MainView.prototype = {
        _$stats: null,
        _$restaurants: null,
        _leaderboardService: null,

        // --------------------------------------------
        // Initialization
        // --------------------------------------------

        _initialize: function () {
            this._$stats = $('[gs-total]');
            this._$restaurants = $('[gs-restaurants]');

            this._leaderboardService = new services.LeaderboardService();

            // Retrieve all leaderboards via the API
            this._getStats();
            this._getRestaurants()
        },

        // --------------------------------------------
        // Private Methods
        // --------------------------------------------

        _getStats: function () {
            this._leaderboardService.getStats({
                onSuccess: $.proxy(this._handleStatsSuccess, this)
            });
        },

        _getRestaurants: function () {
            pageSize = undefined;
            limit = undefined;
            skip = undefined;
            size = undefined;

            this._leaderboardService.getLeaderboard({
                name: '',
                level: 'college',
                onSuccess: $.proxy(this._handleRestaurantSuccess.bind(this), this),
                rankBy: this._sort
            });
        },

        // --------------------------------------------
        // Event Handlers
        // --------------------------------------------

        _handleRestaurantSuccess: function (response) {
            response.forEach(function (r, i) {
                fundsRaised = r.stats.overall.estimated_amount_raised;
                r.rank = i + 1 + skip;
                r.totalRaised = parseFloat((fundsRaised / 100).toFixed(0)).toLocaleString('en-US', { style: 'currency', maximumFractionDigits: 2, currency: 'USD' });
                r.totalRaised = r.totalRaised.substring(0, (r.totalRaised.indexOf('.')));
                r.name = r.school_name;
            });

            this._$restaurants.html(templates.leaderboard({
                items: response
            }));
        },

        _handleStatsSuccess: function (response) {
            if (response.performance_metrics) {
                var totalRaised = response.overall.estimated_amount_raised;

                var fundsRaised = parseFloat((totalRaised / 100).toFixed(0)).toLocaleString('en-US', { style: 'currency', maximumFractionDigits: 2, currency: 'USD' });

                var stats = {
                    totalRaised: fundsRaised.substring(0, (fundsRaised.indexOf('.')))
                };

                this._$stats
                    .text(stats.totalRaised)
                    .removeClass('-preload');
            }
        }
    };

    return MainView;
})();

$(function () {
    new grubforscrubs.views.MainView();
});
pledgeit.services.LeaderboardService = (function () {

    // --------------------------------------------
    // Constructor
    // --------------------------------------------

	/**
 	* Constructor for the leaderboard services class
	* @constructor
	*/
    function LeaderboardService() {
        this._initialize();
    }


    LeaderboardService.prototype = {

        // --------------------------------------------
        // Properties
        // --------------------------------------------

        _campaignEndpoint: "https://pledgeit.org/api-public/campaigns/stats?tags=program:cvc20",
        _leaderboardEndpoint: "https://pledgeit.org/api-public/partners/acs/cvc20/leaderboard?",


        // --------------------------------------------
        // Initialization
        // --------------------------------------------

        _initialize: function () {
            if (!String.prototype.endsWith) {
                String.prototype.endsWith = function (searchString, position) {
                    var subjectString = this.toString();
                    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
                        position = subjectString.length;
                    }
                    position -= searchString.length;
                    var lastIndex = subjectString.indexOf(searchString, position);
                    return lastIndex !== -1 && lastIndex === position;
                };
            }
        },


        // --------------------------------------------
        // Public Methods
        // --------------------------------------------

		/**
		 * Get the full leaderboard using the PledgeIt leaderboard API
		 * @param {function} requestParams - Request parameters object
		 * @param {string}   requestParams.limit - The number of results that should be returned
		 * @param {string}   requestParams.level - The level of used for filtering
		 * @param {string}   requestParams.name - The name of used for filtering
		 * @param {string}	 requestParams.onSuccess - Callback for when the API call finishes successfully
		 * @param {string}   requestParams.rankBy - Sort by "rank", "name", "state", "results"
		 * @param {string}   requestParams.skip - Number of records to skip for paging
		 */
        getLeaderboard: function (requestParams) {
            this._makeRequest(this._leaderboardEndpoint, requestParams, true);
        },

		/**
		 * Get the statistics for the home page
		 * @param {function} requestParams 				- Request parameters object
		 * @param {string}   requestParams.limit		- The number of results that should be returned
		 * @param {string}   requestParams.name			- The name of used for filtering
		 * @param {string}	 requestParams.onSuccess	- Callback for when the API call finishes successfully
		 * @param {string}   requestParams.type 		- The Type of data
		 */
        getStats: function (requestParams) {
            var endpoint = this._campaignEndpoint;
            this._makeRequest(endpoint, requestParams, true);
        },


        // --------------------------------------------
        // Private Methods
        // --------------------------------------------

		/**
		 * Get the weekly leaderboard based on the week specified
		 * @param {string} 	 endpoint 					- Endpoint URL for the AJAX request
		 * @param {function} requestParams 				- Request parameters object
		 * @param {number}   requestParams.limit		- The number of results that should be returned
		 * @param {string}   requestParams.level		- The level of used for filtering
		 * @param {function} requestParams.onSuccess	- Callback for when the API call finishes successfully
		 * @param {string}   requestParams.rankBy		- Sort by "rank", "name", "state", "results"
		 * @param {string}   requestParams.skip         - Number of records to skip for paging
		 * @param {string}   requestParams.tags			- Type of campaign
		 */
        _makeRequest: function (endpoint, requestParams, includeParams) {
            endpoint += "";
            includeParams = includeParams == undefined ? false : includeParams;

            if (includeParams) {
                if (requestParams.type) {
                    endpoint += requestParams.type + "?";
                }

                if (requestParams.limit) {
                    endpoint += "limit=" + requestParams.limit.toString() + "&";
                }

                if (requestParams.name) {
                    endpoint += "school_name=" + requestParams.name.toString() + "&";
                }

                if (requestParams.level) {
                    endpoint += "level=" + requestParams.level + "&";
                }

                if (requestParams.rankBy) {
                    endpoint += "rankBy=" + requestParams.rankBy + "&";
                }

                if (requestParams.skip) {
                    endpoint += "skip=" + requestParams.skip + "&";
                }

                if (requestParams.tags) {
                    endpoint += "tags=" + requestParams.tags.toString();
                }
            }

            if (endpoint.endsWith("?")) {
                endpoint = endpoint.slice(0, -1);
            }

            $.ajax({
                crossDomain: true,
                dataType: "json",
                method: "GET",
                contentType: "text/plain",
                url: endpoint,
                success: function (response) {
                    var items = response;

                    if (!includeParams && items.length) {
                        items = items.slice(0, requestParams.limit);
                    }

                    if (requestParams.onSuccess) {
                        requestParams.onSuccess(items);
                    }
                }
            });
        }
    };

    return LeaderboardService;
})();
