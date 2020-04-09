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