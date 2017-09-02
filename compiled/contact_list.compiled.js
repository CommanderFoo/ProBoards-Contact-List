"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Contact_List = function () {
	function Contact_List() {
		_classCallCheck(this, Contact_List);
	}

	_createClass(Contact_List, null, [{
		key: "init",
		value: function init() {
			this.PLUGIN_ID = "pd_contact_list";
			this.PLUGIN_KEY = "pd_contact_list";

			this.route = pb.data("route");
			this._textarea = document.createElement("textarea");

			this.setup();

			$(this.ready.bind(this));
		}
	}, {
		key: "ready",
		value: function ready() {
			if (pb.data("user").is_logged_in) {
				if (this.route.name == "user") {
					this.create_contact_button();
				}

				this.write_out_contact_list();
			}
		}
	}, {
		key: "setup",
		value: function setup() {
			var plugin = pb.plugin.get(this.PLUGIN_ID);

			if (plugin && plugin.settings) {
				var plugin_settings = plugin.settings;
			}
		}
	}, {
		key: "html_encode",
		value: function html_encode() {
			var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
			var decode_first = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			str = decode_first ? this.html_decode(str) : str;

			return $("<div />").text(str).html();
		}
	}, {
		key: "html_decode",
		value: function html_decode() {
			var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

			this._textarea.innerHTML = str;

			var val = this._textarea.value;

			this._textarea.innerHTML = "";

			return val;
		}
	}, {
		key: "create_contact_button",
		value: function create_contact_button() {
			var member = pb.data("page").member;

			if (member && member.id) {
				if (pb.data("user").id == member.id) {
					return;
				}

				var id = parseInt(member.id, 10) || 0;

				if (id) {
					var text = this.is_contact(id) ? "Remove" : "Add";
					var $button = $("#contact-add-remove-button");

					if (!$button.length) {
						$button = $("<a class='button contact_button' id='contact-add-remove-button' href='#' role='button'></a>");

						$button.insertBefore($(".controls").children().last());
					}

					$button.html(text + " Contact");
					$button.on("click", this.add_remove_contact.bind(this, id, $button));
				}
			}
		}
	}, {
		key: "is_contact",
		value: function is_contact() {
			var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			var data = pb.plugin.key(this.PLUGIN_KEY).get() || {};

			if (data[id]) {
				return true;
			}

			return false;
		}
	}, {
		key: "get_local_data",
		value: function get_local_data() {
			var data = localStorage.getItem(this.PLUGIN_KEY) || "{}";

			return JSON.parse(data);
		}
	}, {
		key: "add_remove_contact",
		value: function add_remove_contact(id, $button) {
			var data = pb.plugin.key(this.PLUGIN_KEY).get() || {};
			var local_data = this.get_local_data();

			var add = false;

			if (data[id]) {
				delete data[id];
				this.remove_from_contact_list(id);

				if (local_data[id]) {
					delete local_data[id];
				}
			} else {
				data[id] = {

					n: pb.data("page").member.name

				};

				add = true;
			}

			if ($button && $button.length) {
				$button.html((add ? "Remove" : "Add") + " Contact");
			}

			pb.plugin.key(this.PLUGIN_KEY).set({

				value: data

			});

			localStorage.setItem(this.PLUGIN_KEY, JSON.stringify(local_data));

			return false;
		}
	}, {
		key: "remove_from_contact_list",
		value: function remove_from_contact_list(id) {}
	}, {
		key: "add_to_contact_list",
		value: function add_to_contact_list(id) {}
	}, {
		key: "write_out_contact_list",
		value: function write_out_contact_list() {
			var data = pb.plugin.key(this.PLUGIN_KEY).get() || {};

			if (data) {
				var $online = $("#thecreed-online-list");
				var local_data = this.get_local_data();
				var $html = $("<div id='the-contact-list'></div>");
				var contacts = [];

				for (var key in data) {
					if (data.hasOwnProperty(key)) {
						var name = local_data && local_data[key] ? local_data[key].n : data[key].n;

						contacts.push({

							name: name,
							id: key,
							online: this.online_status(key, name, $online)

						});
					}
				}

				contacts.sort(function (a, b) {
					if (a.name < b.name) {
						return -1;
					} else if (b.name < a.name) {
						return 1;
					} else {
						return 0;
					}
				});

				for (var c = 0; c < contacts.length; ++c) {
					var klass = contacts[c].online ? "contact-online" : "contact-offline";

					$html.append("<span class='contact-list-item " + klass + "'><a href='/user/" + contacts[c].id + "'>" + this.html_encode(contacts[c].name, true) + "</a> (" + (contacts[c].online ? "Online" : "Offline") + ")");
				}

				if (!contacts.length) {
					$html.append("<span><em>No Contacts</em></span>");
				}

				$("#yourcontacts-disp").append($html);
			}
		}
	}, {
		key: "online_status",
		value: function online_status() {
			var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
			var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
			var $look_in = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			if (id) {
				switch (this.route.name) {

					case "user":
						var member = pb.data("page").member;

						if (member && member.id && member.id == id && $(".controls div:last").html().match("Member is Online")) {
							if (name != pb.data("page").member.name) {
								this.update_name(id, pb.data("page").member.name);
							} else {
								this.clean_up_local(id);
							}

							return true;
						}

						break;

					default:
						if ($look_in && $look_in.find(".user-link.user-" + id).length == 1) {
							var the_name = $look_in.find(".user-link.user-" + id).html();

							if (name != the_name) {
								this.update_name(id, the_name);
							} else {
								this.clean_up_local(id);
							}

							return true;
						}
				}
			}

			return false;
		}
	}, {
		key: "update_name",
		value: function update_name(id, name) {
			name = this.html_encode(name, true);

			var local_data = this.get_local_data();

			if (!local_data[id]) {
				local_data[id] = {

					n: name

				};
			} else {
				local_data[id].name = name;
			}

			localStorage.setItem(this.PLUGIN_KEY, JSON.stringify(local_data));
		}
	}, {
		key: "clean_up_local",
		value: function clean_up_local(id) {
			var local_data = this.get_local_data();

			if (local_data[id]) {
				delete local_data[id];
			}

			localStorage.setItem(this.PLUGIN_KEY, JSON.stringify(local_data));
		}
	}]);

	return Contact_List;
}();


Contact_List.init();