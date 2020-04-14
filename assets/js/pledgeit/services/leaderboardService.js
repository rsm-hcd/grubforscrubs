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
