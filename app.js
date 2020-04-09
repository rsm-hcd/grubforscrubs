(function () {
    window.pledgeit = window.pledgeit || {};

    window.pledgeit.services = window.pledgeit.services || {};

    window.grubforscrubs = window.grubforscrubs || {};

    window.grubforscrubs.views = window.grubforscrubs.views || {};

    window.grubforscrubs.templates = window.grubforscrubs.templates || {};
}).call(this);

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
        _restaurantData: null,

        // --------------------------------------------
        // Initialization
        // --------------------------------------------

        _initialize: function () {
            this._$stats = $('[gs-total]');
            this._$restaurants = $('[gs-restaurants]');
            this._restaurantData = [];

            this._leaderboardService = new services.LeaderboardService();

            // Retrieve all leaderboards via the API
            this._getStats();
        },

        // --------------------------------------------
        // Private Methods
        // --------------------------------------------

        _getStats: function () {
            this._leaderboardService.getStats({
                onSuccess: $.proxy(this._handleStatsSuccess, this)
            });
        },

        _getLeaderboard: function (level, searchText, isIndividual, $target) {
            pageSize = undefined;
            limit = undefined;
            skip = undefined;
            size = undefined;
            if ($target != null) {
                currentPage = $target.data('leaderboard-page');
                pageSize = $target.data('leaderboard-page-size');
                size = $target.data('leaderboard-size');

                if ($target.data('leaderboard-load') !== 'full') {
                    limit = pageSize;
                }

                if (pageSize != null) {
                    skip = (currentPage - 1) * pageSize;
                }
            }

            this._leaderboardService.getLeaderboard({
                name: searchText,
                level: level,
                onSuccess: $.proxy(this._handleLeaderboardSuccess.bind(this, level, skip, pageSize, isIndividual, size, $target), this),
                rankBy: this._sort
            }, isIndividual);
        },

        _renderLeaderboard: function (level, skip, limit, textSearch, isIndividual, size, $target) {
            items = this._leaderboardData[(isIndividual ? 'individual' : 'team')][level];
            if (textSearch != null) {
                items = items.filter(function (item) {
                    return item.name.toLowerCase().includes(searchText);
                });
            }
            template = null;

            if (isIndividual) {
                if (size === 'small') {
                    template = templates.individualLeaderboardSmall({
                        items: items.slice(skip, (skip + limit)),
                        level: level
                    });
                } else {
                    template = templates.individualLeaderboard({
                        items: items.slice(skip, (skip + limit)),
                        level: level
                    });
                }
            } else {
                if (size === 'small') {
                    template = templates.leaderboardSmall({
                        items: items.slice(skip, (skip + limit)),
                        level: level
                    });
                } else {
                    template = templates.leaderboard({
                        items: items.slice(skip, (skip + limit)),
                        level: level
                    });
                }
            }

            $target.append(template);
            $target.siblings('.c-leaderboard__more').find('[data-leaderboard-more]').toggle(items.length > skip + limit);

            if (!isIndividual) {
                this._attachItemExpand();
            }
        },

        // --------------------------------------------
        // Event Handlers
        // --------------------------------------------

        _handleLeaderboardSuccess: function (level, skip, pageSize, isIndividual, size, $target, response) {
            if (skip == null) {
                skip = 0;
            }

            items = response;

            if (isIndividual) {
                items.forEach(function (r, i) {
                    fundsRaised = r.estimated_amount_raised;
                    r.rank = i + 1 + skip;
                    r.totalRaised = parseFloat((fundsRaised / 100).toFixed(0)).toLocaleString('en-US', { style: 'currency', maximumFractionDigits: 2, currency: 'USD' });
                    r.totalRaised = r.totalRaised.substring(0, (r.totalRaised.indexOf('.')));
                    r.name = r.first_name + " " + r.last_name;
                    r.url = "https://pledgeit.org/" + r.campaign_slug + "/@" + r.username;

                    if (level === 'college') {
                        r.state_prov = undefined;
                    }
                });
            } else {
                items.forEach(function (r, i) {
                    fundsRaised = r.stats.overall.estimated_amount_raised;
                    r.rank = i + 1 + skip;
                    r.totalRaised = parseFloat((fundsRaised / 100).toFixed(0)).toLocaleString('en-US', { style: 'currency', maximumFractionDigits: 2, currency: 'USD' });
                    r.totalRaised = r.totalRaised.substring(0, (r.totalRaised.indexOf('.')));
                    r.name = r.school_name;
                });
            }

            if (this._leaderboardData[(isIndividual ? 'individual' : 'team')][level] == null) {
                this._leaderboardData[(isIndividual ? 'individual' : 'team')][level] = [];
            }
            this._leaderboardData[(isIndividual ? 'individual' : 'team')][level] = this._leaderboardData[(isIndividual ? 'individual' : 'team')][level].concat(items);

            if ($target != null) {
                this._renderLeaderboard(level, skip, pageSize, null, isIndividual, size, $target);
            }
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
