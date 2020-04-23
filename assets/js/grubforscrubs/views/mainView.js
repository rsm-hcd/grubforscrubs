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

            this._sortRestaurants();

            // Retrieve all leaderboards via the API
            this._getStats();
            this._getRestaurants();
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

        _sortRestaurants: function () {
            $("[gs-restaurants]").each($.proxy(function (index, list) {
                $list = $(list);
                var restaurantNames = $list.find("[gs-name]").map(function (index, restaurant) {
                    return restaurant.getAttribute("gs-name");
                });
                $list.reOrder(restaurantNames.sort());
                $list
                    .removeClass("-preload");
            }))
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