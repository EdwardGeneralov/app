jsWC=window.jsWC || {}; jsWC["./extensions/wikia/ApiDocs/js/MainView.js"]=1376;

// Generated by CoffeeScript 1.6.1
(function() {
	var MainView,
		__hasProp = {}.hasOwnProperty,
		__extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	MainView = (function(_super) {

		__extends(MainView, _super);

		function MainView() {
			return MainView.__super__.constructor.apply(this, arguments);
		}

		MainView.prototype.initialize = function() {};

		MainView.prototype.render = function() {
			var resource, _i, _len, _ref;
			$(this.el).html(Handlebars.templates.main(this.model));
			_ref = this.model.apisArray;
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				resource = _ref[_i];
				this.addResource(resource);
			}
			return this;
		};

		MainView.prototype.addResource = function(resource) {
			var resourceView;
			resourceView = new ResourceView({
				model: resource,
				tagName: 'li',
				id: 'resource_' + resource.name,
				className: 'resource'
			});
			return $('#resources').append(resourceView.render().el);
		};

		MainView.prototype.clear = function() {
			return $(this.el).html('');
		};

		return MainView;

	})(Backbone.View);

	window.MainView = MainView; // make it public
}).call(this);
