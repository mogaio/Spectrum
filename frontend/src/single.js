import {
	sites
} from "./sites.js"

const root1 = "https://specbot.info/treehacks"
const root2 = "https://grandmaskittens.com"

export function tag(e) {
	var link = $(e).attr('href');
	if (link) {
		var val = checkValid(link);
		if (val != 0) {
			$(e).attr("news", true);
			$(e).attr("site", val)
		} else {
			$(e).attr("news", false)
		}
	}
}

export function createTip(e) {
	if ($(e).attr('news') == "true") {
		$(e).attr("hasTip", "true");
		console.log($(e).text());
		$.ajax({
			// url: root,
			// method: "POST",
			// data: {title: $(e).text()},
			// contentType: "application/json; charset=utf-8"
			url: root + "/spectrum?url="+ encodeURIComponent($(e).attr('href')),
			method: "GET"
		}).then(function (data) {
			console.log("SUCCESSS")
			data = JSON.parse(data);
			let bias = Math.round(data.weighted_average*1.1) ;
			let political;
			let politicHex;
			switch (bias) {
				case -2:
					political = "Liberal";
					politicHex = "#3751ff";
					break;
				case -1:
					political = "Moderate Liberal";
					politicHex = "#6fa0ff";
					break;
				case 0:
					political = "Neutral";
					politicHex = "#b265ff";
					break;
				case 1:
					political = "Moderate Conservative";
					politicHex = "#ff7070";
					break;
				case 2:
					political = "Conservative";
					politicHex = "#fe4d4d";
					break;
			}
			let val = data.summary;
			let source = data.brand;
			let title = data.title;
			let html = `
				<div class="box">
					<div class="political" style="background-color: ${politicHex};">
						<div class="title bigFont">
							${title}
						</div>
						<div class="source">
							${source} - ${political}
						</div>
					</div>
		      		<div class="summary">
		       		 	<p class="ourText"> ${val} </p>
		    	  	</div>
					<div class="related">
						<div class="title"> Related Articles </div>
						<p class="ourText"> Test </p>
					</div>
				</div>
				`
			Tipped.create($(e), html, {
				position: "right"
				// hideOn: false
			});
		}).catch(function(err){
			console.log("FAILED")
			console.log(err);
		})
	}
}

const links = sites();

function checkValid(url) {
	url = url.toLowerCase();
	if (url[0] == "/") {
		var path = window.location.hostname
		for (var i = 0; i < links.length; i++) {
			if (path.search(links[i]) != -1)
				return links[i];
		}
	}
	for (var i = 0; i < links.length; i++) {
		if (url.search(links[i]) != -1)
			return links[i];
	}
	return 0;
}
