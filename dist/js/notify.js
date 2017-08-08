notify = {
	showNotification: function(message, type){
    	$.notify({
        	icon: "pe-7s-bell",
        	message: message
        	
        },{
            type: type,
            timer: 4000,
            placement: {
                from: 'bottom',
                align: 'right'
            }
        });
	}
}

