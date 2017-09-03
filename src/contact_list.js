class Contact_List {

	static init(){
		this.PLUGIN_ID = "pd_contact_list";
		this.PLUGIN_KEY = "pd_contact_list";

		this.route = pb.data("route");
		this._textarea = document.createElement("textarea");

		this.setup();

		$(this.ready.bind(this));
	}

	static ready(){
		if(pb.data("user").is_logged_in){
			if(this.route.name == "user"){
				this.create_contact_button();
			}

			this.write_out_contact_list();
		}
	}

	static setup(){
		let plugin = pb.plugin.get(this.PLUGIN_ID);

		if(plugin && plugin.settings){
			let plugin_settings = plugin.settings;

		}
	}

	static html_encode(str = "", decode_first = false){
		str = (decode_first)? this.html_decode(str) : str;

		return $("<div />").text(str).html();
	}

	static html_decode(str = ""){
		this._textarea.innerHTML = str;

		let val = this._textarea.value;

		this._textarea.innerHTML = "";

		return val;
	}

	static create_contact_button(){
		let member = pb.data("page").member;

		if(member && member.id){
			if(pb.data("user").id == member.id){
				return;
			}

			let id = parseInt(member.id, 10) || 0;

			if(id){
				let text = (this.is_contact(id))? "Remove" : "Add";
				let $button = $("#contact-add-remove-button");

				if(!$button.length){
					$button = $("<a class='button contact_button' id='contact-add-remove-button' href='#' role='button'></a>");

					$button.insertBefore($(".controls").children().last());
				}

				$button.html(text + " Contact");
				$button.on("click", this.add_remove_contact.bind(this, id, $button));
			}
		}
	}

	static is_contact(id = 0){
		let data = pb.plugin.key(this.PLUGIN_KEY).get() || {};

		if(data[id]){
			return true;
		}

		return false;
	}

	static get_local_data(){
		let data = localStorage.getItem(this.PLUGIN_KEY) || "{}";

		return JSON.parse(data);
	}

	static add_remove_contact(id, $button){
		let data = pb.plugin.key(this.PLUGIN_KEY).get() || {};
		let local_data = this.get_local_data();

		let add = false;

		if(data[id]){
			delete data[id];
			this.remove_from_contact_list(id);

			if(local_data[id]){
				delete local_data[id];
			}
		} else {
			data[id] = {

				n: pb.data("page").member.name

			};

			add = true;
		}

		if($button && $button.length){
			$button.html(((add)? "Remove" : "Add") + " Contact");
		}

		pb.plugin.key(this.PLUGIN_KEY).set({

			value: data

		});

		localStorage.setItem(this.PLUGIN_KEY, JSON.stringify(local_data));

		return false;
	}

	static remove_from_contact_list(id){

	}

	static add_to_contact_list(id){

	}

	static write_out_contact_list(){
		let data = pb.plugin.key(this.PLUGIN_KEY).get() || {};

		if(data){

			// The selector below is where the plugin scrapes for info.  This is the online list
			// that shows up on a lot of pages.

			let $online = $("#thecreed-online-list");
			let local_data = this.get_local_data();
			let $html = $("<div id='the-contact-list'></div>");
			let contacts = [];

			for(let key in data){
				if(data.hasOwnProperty(key)){
					let name = (local_data && local_data[key])? local_data[key].n : data[key].n;

					contacts.push({

						name: name,
						id: key,
						online: this.online_status(key, name, $online)

					});
				}
			}

			contacts.sort((a, b) => {
				if(a.name < b.name){
					return -1;
				} else if(b.name < a.name){
					return 1
				} else {
					return 0;
				}
			});

			for(let c = 0; c < contacts.length; ++ c){
				let klass = (contacts[c].online)? "contact-online" : "contact-offline";

				$html.append("<span class='contact-list-item " + klass + "'><a href='/user/" + contacts[c].id + "'>" + this.html_encode(contacts[c].name, true) + "</a> (" + ((contacts[c].online)? "Online" : "Offline") + ")");
			}

			if(!contacts.length){
				$html.append("<span><em>No Contacts</em></span>");
			}

			// Selector below is where the list is wrote too.

			$("#yourcontacts-disp").append($html);
		}
	}

	static online_status(id = 0, name = "", $look_in = null){
		if(id){
			switch(this.route.name){

				case "user" :
					let member = pb.data("page").member;

					if(member && member.id && member.id == id && $(".controls div:last").html().match("Member is Online")){
						if(name != pb.data("page").member.name){
							this.update_name(id, pb.data("page").member.name);
						} else {
							this.clean_up_local(id);
						}

						return true;
					}

					break;

				default :
					if($look_in && $look_in.find(".user-link.user-" + id).length == 1){
						let the_name = $look_in.find(".user-link.user-" + id).html();

						if(name != the_name){
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

	static update_name(id, name){
		name = this.html_encode(name, true);

		let local_data = this.get_local_data();

		if(!local_data[id]){
			local_data[id] = {

				n: name

			};
		} else {
			local_data[id].name = name;
		}

		localStorage.setItem(this.PLUGIN_KEY, JSON.stringify(local_data));
	}

	static clean_up_local(id){
		let local_data = this.get_local_data();

		if(local_data[id]){
			delete local_data[id];
		}

		localStorage.setItem(this.PLUGIN_KEY, JSON.stringify(local_data));
	}

}