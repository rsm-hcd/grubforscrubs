(function () {
    window.pledgeit = window.pledgeit || {};

    window.pledgeit.services = window.pledgeit.services || {};

    window.grubforscrubs = window.grubforscrubs || {};

    window.grubforscrubs.views = window.grubforscrubs.views || {};
}).call(this);

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

        _campaignEndpoint: "https://pledgeit.org/api-public/widgets/campaigns",
        _templateEndpoint: "https://pledgeit.org/api-public/widgets/templates",


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
		 * Get the campaign using the PledgeIt widget API
		 * @param {string}   slug - The campaign slug
		 * @param {function} requestParams - Request parameters object
		 * @param {string}	 requestParams.onSuccess - Callback for when the API call finishes successfully
		 */
        getCampaign: function (slug, requestParams) {
            this._makeRequest(this._campaignEndpoint + "/" + slug, requestParams);
        },

        /**
		 * Get the template using the PledgeIt widget API
		 * @param {string}   slug - The campaign slug
		 * @param {function} requestParams - Request parameters object
		 * @param {string}	 requestParams.onSuccess - Callback for when the API call finishes successfully
		 */
        getTemplate: function (slug, requestParams) {
            this._makeRequest(this._templateEndpoint + "/" + slug, requestParams);
        },

        // --------------------------------------------
        // Private Methods
        // --------------------------------------------

		/**
		 * Get the weekly leaderboard based on the week specified
		 * @param {string} 	 endpoint 					- Endpoint URL for the AJAX request
         * @param {function} requestParams 				- Request parameters object
		 * @param {function} requestParams.onSuccess	- Callback for when the API call finishes successfully
		 */
        _makeRequest: function (endpoint, requestParams) {
            $.ajax({
                crossDomain: true,
                dataType: "json",
                method: "GET",
                contentType: "text/plain",
                url: endpoint,
                success: function (response) {
                    var items = response;

                    if (requestParams.onSuccess) {
                        requestParams.onSuccess(items);
                    }
                }
            });
        }
    };

    return LeaderboardService;
})();

var services = pledgeit.services;
var views = grubforscrubs.views;

grubforscrubs.views.MainView = (function () {
    function MainView() {
        this._initialize();
    }

    MainView.prototype = {
        _$stats: null,
        _leaderboardService: null,

        // --------------------------------------------
        // Initialization
        // --------------------------------------------

        _initialize: function () {
            this._$stats = $('[gs-total]');

            this._leaderboardService = new services.LeaderboardService();

            // Retrieve all leaderboards via the API
            this._getStats();
            this._getRestaurants()
        },

        // --------------------------------------------
        // Private Methods
        // --------------------------------------------

        _getStats: function () {
            this._leaderboardService.getTemplate("grub-for-scrubs-hbg", {
                onSuccess: $.proxy(function (response) {
                    this._$stats
                        .text("$" + response.amountRaised.substring(0, (response.amountRaised.indexOf('.'))))
                        .removeClass("-preload");
                }, this)
            })
        },

        _getRestaurants: function () {

            $("[gs-slug]").each($.proxy(function (index, restaurant) {
                this._leaderboardService.getCampaign(restaurant.getAttribute("gs-slug"), {
                    onSuccess: function (response) {
                        $target = $(restaurant);
                        $target.find("[gs-amount]")
                            .text("$" + response.amountRaised.substring(0, (response.amountRaised.indexOf('.'))))
                            .removeClass("-preload");

                        $target.find("[gs-donate]")
                            .attr("href", response.url + "/donate")
                            .removeClass("-preload");
                    }
                });
            }, this))
        },

        // --------------------------------------------
        // Event Handlers
        // --------------------------------------------

        _handleRestaurantSuccess: function (response, $target) {
            $target.find("[gs-amount]")
                .text("$" + response.amountRaised)
                .removeClass("-preload");
        },

        _handleStatSuccess: function (response, $target) {
            $target
                .text("$" + response.amountRaised)
                .removeClass("-preload");
        }
    };

    return MainView;
})();

$(function () {
    new grubforscrubs.views.MainView();
});