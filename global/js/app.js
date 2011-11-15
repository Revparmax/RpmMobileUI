/*
#################################
#								#
# GLOBAL VARIABLES				#
#								#
#################################
*/

$(function() {
	$.isMobile= function(){
		return window.location.href.search(/^http/) == -1;
	},

	$.saveValue= function(key, value){
		if ( $.isMobile )
			window.localStorage.setItem(key, value);
		else
			$.cookie(key, value);
	},

	$.readValue= function(key){
		if ( $.isMobile )
			return window.localStorage.getItem(key);
		else
			return $.cookie(key);
	},


	$.urls = {
		baseurl:	'http://m.dev.revparmax.com',

		setupUrls: function(){
			if ( $.isMobile() ){
  				var workurl = $.readValue("workurl");
				$.workurl = workurl ? workurl : $.urls.baseurl;
			} else 
				$.workurl = "";

			$.url = {
				auth: 					$.workurl + '/auth-user',
				companies: 				$.workurl + '/dash/companies',
				date: 					$.workurl + '/dash/date',
				revenue: 				$.workurl + '/dash/revenue/',
				rooms: 					$.workurl + '/dash/stats/', 
				payments: 				$.workurl + '/dash/payment/',
				competition: 			$.workurl + '/dash/competition/',
				logout:  				$.workurl + '/logout'
			};

		}
	};
	$.urls.setupUrls();
  
});



/*
#################################
#								#
# APP EVENTS					#
#								#
#################################
*/

var appEvents = {
	
	inputOnFocus : function(){
		
		// On Focus, set value to nothing - On Exit, set value to default Value
		$('#login-form input[type="text"]').focus(function(){
			if( this.value == this.defaultValue ){
					this.value = "";
					if(this.name == 'authpassword')
						this.setAttribute('type','password');
				}
			}).blur(function() {
				if( !this.value.length ){
					this.value = this.defaultValue;
					if(this.name == 'authpassword')
						this.setAttribute('type','text');
				}

		});
		
	},
	
	bgResize: function(){
		
		// Get window height and width
		var height = $(window).height(),
	    	width = $(window).width(),
			imgWidth = width / 2,
			imgHeight = imgWidth / 455 * 585,
			cssObj = {
				
				'background-size' : imgWidth + 'px ' + imgHeight + 'px',
				'width' :  imgWidth,
				'height' : imgHeight
				
			}
			
		// Change dimensions of background image	
		$('#logo-div').css(cssObj);
		
	},

	demo: function(){
		// Demo button click
		$("#demo-button").live("click", function(e){
			if ( ! $.isMobile() ){
 				window.location.href = "http://m.demo.revparmax.com/assets/index.html?demo=1";
				return false;
			}

 			$.saveValue("workurl", "http://m.demo.revparmax.com");
			$.urls.setupUrls();
			appEvents.loginDemoAcc();
		});

		if ( window.location.href.search(/\?demo=1/) != -1 ){
			appEvents.loginDemoAcc();
		}
	},

	loginDemoAcc: function(){
		$("#login-form [name=authemail]").val('jsmith@abchotel.com');
		$("#login-form [name=authpassword]").val('abcd1234');
		$("#loginButton").click();
	},

	
	authUser: function(){
		window.localStorage.setItem("workurl", $.urls.baseurl);
		$.urls.setupUrls();

		// Bind login action to submit button
		$('#loginButton').live('click',function(e){
		
			e.preventDefault();
			
			// Serialize login credentials
			data = $('#login-form').serialize();
			
			$.ajax({
			
				url: $.url.auth,
				type: 'POST',
				dataType: 'json',
				data: data,
				timeout: 2000,
				success: function(data){
					
					if(data.error != undefined)
						alert('Failed to Log User In. Please Try Again');
					else
						window.location.href = "companies.html";
				}
				
			});
			
		});
		
	},
	
	closeButton: function(){
		$('.closeButton').live('click', function(e){
				window.localStorage.setItem("workurl", $.urls.baseurl);
				$.urls.setupUrls();
				return true;
		});
	},

	selectCompany: function(){

		
		$('#list a').live('click',function(e){
		
			// Find company id
			var company_id = $(this).data('companyid');
			
			// Store cookie
			$.saveValue('company_id', company_id );
		
			// Proceed with redirect
			return true;
			
		});
		
	},

	selectDate: function(){
		
		$('#datePick').live('click',function(e){
		
			e.preventDefault();
			
			// Find company id
			var date = $('#mydate').val();
			
			// Store cookie
			$.saveValue('date', date);
		
			// Redirect to revenue.html
			window.location.href = 'revenue.html';
			
		});
		
	},

	selectRevenue: function(){
		
		$( '#navbar a').live('click',function(e){
			e.preventDefault();
		
			period = $(this).data('period');
				
			// Request Data from Mobile App
			$.ajax({

				url: $.url.revenue + period,
				type: 'POST',
				dataType: 'json',
				data: {date: $.readValue('date'), company_id: $.readValue('company_id') },
				timeout: 2000,
				success: function(data){

					if(data.error != undefined){

						alert(data.error);

					}else{

						appContent.showCompanyName(data.companies);

						appContent.showTitle(period,'Revenue');

						appContent.showRevenue(data.categories);

					}

				}

			});
			
		});
		
	},

	selectRooms: function(){
		
		$( '#navbar a').live('click',function(e){
			e.preventDefault();
		
			var period = $(this).data('period');
				
			// Request Data from Mobile App
			$.ajax({

				url: $.url.rooms + period,
				type: 'POST',
				dataType: 'json',
				data: {date: $.readValue('date'), company_id: $.readValue('company_id') },
				timeout: 2000,
				success: function(data){

					if(data.error != undefined){

						alert(data.error);

					}else{

						appContent.showCompanyName(data.companies);

						appContent.showTitle(period,'Room Stats');

						appContent.showRooms(data.categories);

					}

				}

			});
			
		});
		
	},

	selectPayments: function(){
		
		$( '#navbar a').live('click',function(e){
			e.preventDefault();
		
			var period = $(this).data('period');
				
			// Request Data from Mobile App
			$.ajax({

				url: $.url.payments + period,
				type: 'POST',
				dataType: 'json',
				data: {date: $.readValue('date'), company_id: $.readValue('company_id') },
				timeout: 2000,
				success: function(data){

					if(data.error != undefined){

						alert(data.error);

					}else{

						appContent.showCompanyName(data.companies);

						appContent.showTitle(period,'Payments');

						appContent.showPayments(data.payments);

					}

				}

			});
			
		});
		
	},

	selectCompetition: function(){
		
		$( '#navbar a').live('click',function(e){
			e.preventDefault();
		
			var period = $(this).data('period');
				
			// Request Data from Mobile App
			$.ajax({

				url: $.url.competition + period,
				type: 'POST',
				dataType: 'json',
				data: {date: $.readValue('date'), company_id: $.readValue('company_id') },
				timeout: 2000,
				success: function(data){

					if(data.error != undefined){

						alert(data.error);

					}else{

						appContent.showCompanyName(data.companies);

						appContent.showTitle(period,'Competition');

						appContent.showCompetition(period,data.competitors);

					}

				}

			});
			
		});
		
	},
	
	logout: function(){
		
		// Bind login action to submit button
		$('#logoutButton').live('click',function(e){

			e.preventDefault();

			$.ajax({
				url: $.url.logout,
				type: 'GET',
				dataType: 'json',
				timeout: 2000,
				success: function(data){

					if(data.error != undefined)
						alert('Failed to Log User In. Please Try Again');
					else {
						window.localStorage.setItem("workurl", $.urls.baseurl);
						$.urls.setupUrls();
						window.location.href = "index.html";
					}
				}

			});

		});
		
	}

}

/*
#################################
#								#
# APP INITIAL PAGE LOADS		#
#								#
#################################
*/

var appLoad = {
	
	companies: function(){
		
		// Request Data from Mobile App
		$.ajax({
		
			url: $.url.companies,
			type: 'GET',
			dataType: 'json',
			timeout: 2000,
			success: function(data){
				
				if(data.error != undefined){
				
					alert('Failed to Retrieve Data');
					
				}else{
					
					var companies = data.companies,
						htmlstr = '';
					
					$.each( companies, function(key,item){
					
						htmlstr += '<li data-icon="right-arrow">'; 
						htmlstr += '<a href="date.html" data-ajax="false" data-companyid="' + item.company_id + '">';
						htmlstr += '<img src="global/images/hotel-icon.png" class="ui-li-icon">';
						htmlstr += item.company_name + '</a></li>';
						
					});
					
					$(htmlstr).insertAfter('#lime-green');
					
					// Refresh list
					$('ul').listview('refresh');
					
				}
				
			}
			
		});
		
	},
	
	date: function(){
		
		// Request Data from Mobile App
		$.ajax({
		
			url: $.url.date,
			type: 'GET',
			dataType: 'json',
			timeout: 2000,
			success: function(data){
				
				if(data.error != undefined){
				
					alert('Failed to Retrieve Data');
					
				}else{
					
					var companies = data.companies;
						
					// Get company name	
					$.each( companies, function(key,item){
					
						if( $.readValue('company_id') == item.company_id ){
							
							$('h1 span').html(item.company_name);
							
						}
						
					});
					
					// Get date if it is set
					if ( $.readValue('date') != undefined)
						$('#mydate').val( $.readValue('date') );
					
				}
				
			}
			
		});
		
	},

	revenue: function(){
		
		period = 'today';

		// Request Data from Mobile App
		$.ajax({

			url: $.url.revenue + period,
			type: 'POST',
			dataType: 'json',
			data: {date: $.readValue('date'), company_id: $.readValue('company_id') },
			timeout: 2000,
			success: function(data){

				if(data.error != undefined){

					alert(data.error);

				}else{
					
					appContent.showCompanyName(data.companies);
					
					appContent.showTitle(period,'Revenue');
					
					appContent.showRevenue(data.categories);

				}

			}

		});
		
	},

	rooms: function(){
		
		var period = 'today';

		// Request Data from Mobile App
		$.ajax({

			url: $.url.rooms + period,
			type: 'POST',
			dataType: 'json',
			data: {date: $.readValue('date'), company_id: $.readValue('company_id') },
			timeout: 2000,
			success: function(data){

				if(data.error != undefined){

					alert(data.error);

				}else{
					
					appContent.showCompanyName(data.companies);
					
					appContent.showTitle(period,'Room Stats');
						
					appContent.showRooms(data.categories);

				}

			}

		});
		
		
	},

	payments: function(){
		
		var period = 'today';

		// Request Data from Mobile App
		$.ajax({

			url: $.url.payments + period,
			type: 'POST',
			dataType: 'json',
			data: {date: $.readValue('date'), company_id: $.readValue('company_id') },
			timeout: 2000,
			success: function(data){

				if(data.error != undefined){

					alert(data.error);

				}else{
					
					appContent.showCompanyName(data.companies);
					
					appContent.showTitle(period,'Payments');
						
					appContent.showPayments(data.payments);

				}

			}

		});
		
		
	},

	competition: function(){
		
		var period = 'today';

		// Request Data from Mobile App
		$.ajax({

			url: $.url.competition + period,
			type: 'POST',
			dataType: 'json',
			data: {date: $.readValue('date'), company_id: $.readValue('company_id') },
			timeout: 2000,
			success: function(data){

				if(data.error != undefined){

					alert(data.error);

				}else{
					
					appContent.showCompanyName(data.companies);
					
					appContent.showTitle(period,'Competition');
						
					appContent.showCompetition(period,data.competitors);

				}

			}

		});
		
	}
	
}

/*
#################################
#								#
# APP CONTENT LOADS				#
#								#
#################################
*/

var appContent = {
	
	showCompanyName: function(companies){
		
		// Get company name	
		$.each( companies, function(key,item){

			if( $.readValue('company_id') == item.company_id ){

				$('h1 span').html(item.company_name);

			}

		});
		
	},
	
	showTitle: function(period, type){
		
		// Load in Title
		$('#meetings').find('#lime-green').html( 
			
			period.toUpperCase() + ' '+ type +' for ' + $.readValue('date')
			
		);
		
	},
	
	showRevenue: function(parents){
		
		htmlstr = '';
		
		$("#meetings li:not(:first-child)").remove();
		
		$.each( parents, function(key,par){
			
			// Print parent category
			htmlstr += '<li data-role="list-divider">'+ par.category_name +'</li>';
			
			// Print sub categories
			subs = par.subs;
			$.each( subs, function(index,sub){
			
				htmlstr += '<li>' + sub.category_name + '<p class="ui-li-aside">';
				htmlstr += $.formatNumber(sub.amount/100,{format:"#,###.00", locale:"us"}) + '</p></li>';
				
			});

		});
		
		// Insert into DOM
		$(htmlstr).insertAfter('#lime-green');

		// Refresh list
		$('#meetings > ul').listview();
		$('#meetings > ul').listview('refresh');
		
	},

	showRooms: function(categories){
		
		htmlstr = '';
		var revenue = categories.revenue,
			rooms = categories.room;
		
		$("#meetings li:not(:first-child)").remove();
		
		// Print Revenue Statistics
		htmlstr += '<li data-role="list-divider">Revenue Statistics</li>';
		
		$.each( revenue , function(key,item){
			
			htmlstr += '<li>' + item.category_name + '<p class="ui-li-aside">';
			
			if( key != 3)
				htmlstr += $.formatNumber(item.amount/100,{format:"#,###.00", locale:"us"}) + '</p></li>';
			else
				htmlstr += $.formatNumber(item.amount/100,{format:"##.#%", locale:"us"}) + '</p></li>';
		
		});
		
		// Print Room Statistics
		htmlstr += '<li data-role="list-divider">Room Statistics</li>';
		
		$.each( rooms , function(key,item){
			
			if( item.amount != undefined ){
				htmlstr += '<li>' + item.category_name + '<p class="ui-li-aside">';
				htmlstr += $.formatNumber(item.amount/100,{format:"#,###", locale:"us"}) + '</p></li>';
			}
		
		});
		
		// Insert into DOM
		$(htmlstr).insertAfter('#lime-green');

		// Refresh list
		$('#meetings > ul').listview();
		$('#meetings > ul').listview('refresh');
		
	},
	
	showPayments: function(payments){
		
		htmlstr = '';
		
		$("#meetings li:not(:first-child)").remove();
		
		// Print Payment Statistics
		htmlstr += '<li data-role="list-divider">Payment Types</li>';
		
		$.each( payments , function(key,item){
			
			if(item.amount != undefined){
				htmlstr += '<li>' + item.payment_name + '<p class="ui-li-aside">';
				htmlstr += $.formatNumber(item.amount/100,{format:"#,###.00", locale:"us"}) + '</p></li>';
			}
		
		});
	
		
		// Insert into DOM
		$(htmlstr).insertAfter('#lime-green');

		// Refresh list
		$('#meetings > ul').listview();
		$('#meetings > ul').listview('refresh');
		
	},
	
	showCompetition: function(period,competitors){
		htmlstr = '';
		
		$("#meetings li:not(:first-child)").remove();
		
		// Print Competitor Statistics
		
		if( period == 'today'){
			
			$.each( competitors , function(key,item){
				
				var occupancy, revpar, rate;
			
				// Print Company Name
				htmlstr += '<li data-role="list-divider">'+ item.company_name +'</li>';
				
				if( item.occupancy != undefined && item.occupancy != 0)
					occupancy = $.formatNumber(item.occupancy/100,{format:"##.#%", locale:"us"});
				else
					occupancy = '-';
					
				if( item.revpar != undefined && item.revpar != 0)
					revpar = $.formatNumber(item.revpar/100,{format:"#,###.00", locale:"us"});
				else
					revpar = '-';
					
				if( item.rate != undefined && item.rate != 0)
					rate = $.formatNumber(item.rate/100,{format:"#,###.00", locale:"us"});
				else
					rate = '-';
			
				htmlstr += '<li>Rate<p class="ui-li-aside">' + rate + '</p></li>';
				htmlstr += '<li>Occupancy<p class="ui-li-aside">' + occupancy + '</p></li>';
				htmlstr += '<li>Revpar<p class="ui-li-aside">' + revpar + '</p></li>';
		
			});	
			
		}else{
			
			// Print Company Name
			htmlstr += '<li data-role="list-divider">Occupancy</li>';
			
			$.each( competitors , function(key,item){
			
				if ( item.occupancy != undefined ){
				
					var occupancy = $.formatNumber(item.occupancy/100,{format:"##.#%", locale:"us"});
					htmlstr += '<li>'+ item.company_name +'<p class="ui-li-aside">' + occupancy + '</p></li>';
				
				}
		
			});
			
		}
	
		
		// Insert into DOM
		$(htmlstr).insertAfter('#lime-green');

		// Refresh list
		$('#meetings > ul').listview();
		$('#meetings > ul').listview('refresh');
		
	}

}

/*
#################################
#								#
# APP							#
#								#
#################################
*/

var app = {

	
	login: function(){
		
		appEvents.bgResize();
		appEvents.inputOnFocus();
		appEvents.authUser();
		appEvents.demo();
		
	},
	
	companies: function(){
		
		appLoad.companies();
		appEvents.closeButton();
		appEvents.selectCompany();
		
	},
	
	date: function(){

		appLoad.date();
		appEvents.selectDate();
		
	},

	revenue: function(){
		
		appLoad.revenue();
		appEvents.selectRevenue();
		
	},

	rooms: function(){
		
		appLoad.rooms();
		appEvents.selectRooms();
		
	},

	payments: function(){
		
		appLoad.payments();
		appEvents.selectPayments();
		
	},
	
	competition: function(){
		
		appLoad.competition();
		appEvents.selectCompetition();
		
	},

	settings: function(){
		
		appEvents.logout();
		
	}

}
