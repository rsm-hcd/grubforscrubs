var services = pledgeit.services;
var views = grubforscrubs.views;

grubforscrubs.views.MainView = (function () {
    function MainView() {
        this._initialize();
        this._attachEvents();
    }

    MainView.prototype = {
        _$stats: null,
        _$tabpanels: null,
        _leaderboardService: null,

        // --------------------------------------------
        // Initialization
        // --------------------------------------------

        _initialize: function () {
            this._$stats = $('[gs-total]');
            this._$tabpanels = $('[role="tabpanel"]');

            this._leaderboardService = new services.LeaderboardService();

            this._sortRestaurants();

            // Retrieve all leaderboards via the API
            this._getStats();
            this._getRestaurants();

            // Set up selectize
            if (window.Selectize) {
                $('select[selectize]').each($.proxy(function (index, select) {
                    $(select).selectize({
                        onChange: $.proxy(this._handleSortChange, this, select)
                    });
                }, this));
            }

        },

        _attachEvents: function () {
            $('[role="tablist"]').on('click', 'a', $.proxy(this._handleTabClick, this));
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

        _getSort: function (sort, $list) {
            var items = $list.find("[gs-name]").map(function (index, restaurant) {
                return {
                    amount: parseFloat($(restaurant).find('[gs-amount]').text().replace(/[,\$]/g, '')),
                    name: restaurant.getAttribute("gs-name")
                }
            });

            items.sort(function (a, b) {
                var x = a.name.toLowerCase();
                var y = b.name.toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            });

            switch (sort) {
                case "high":
                    items.sort(function (a, b) {
                        return b.amount - a.amount;
                    });
                    break;
                case "low":
                    items.sort(function (a, b) {
                        return a.amount - b.amount;
                    });
                    break;
            }

            return items.map(function (i, r) {
                return r.name;
            });
        },

        _sortRestaurants: function () {
            $("[gs-restaurants]").each($.proxy(function (index, list) {
                $list = $(list);
                $list.reOrder(this._getSort('alpha', $list));
                $list
                    .removeClass("-preload");
            }, this));
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
        },

        _handleSortChange: function (target, sort) {
            $list = $(target).closest("section").find("[gs-restaurants]");
            $list.reOrder(this._getSort(sort, $list));
        },

        _handleTabClick: function (event) {
            event.preventDefault()
            $target = $(event.currentTarget)
            $target
                .attr('aria-selected', true)
                .addClass('-selected');
            $siblings = $target.siblings()
            $siblings
                .attr('aria-selected', false)
                .removeClass('-selected');
            this._$tabpanels.filter(function (index, panel) {
                return $(panel).hasClass('-selected')
            }).removeClass('-selected');
            this._$tabpanels.filter(function (index, panel) {
                return ('#' + panel.id) === $target.attr('href')
            }).addClass('-selected');
        }
    };

    return MainView;
})();

$(function () {
    new grubforscrubs.views.MainView();
});