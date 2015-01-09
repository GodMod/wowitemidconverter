function buildBonusIdFields(){
    	var count = $("#numBonusIDs").val();
    	$("#bonusid_container").html("");
    	for(var i = 0; i < count; i++){
    		$("#bonusid_container").append('<div class="form-group"><label for="instanceDifficultyID" class="col-sm-2 control-label">BonusID</label><div class="col-sm-10"><input type="number" class="form-control bonusID rebuildtrigger" placeholder="BonusID" value="0"></div></div>');
    	}
    }
    
    function buildWoWItemID(){
    	//Create WoW ID
		var wowID = 
		$('#itemID').val() + ':' +
		$('#enchant').val()  + ':' +
		$('#gem1').val() + ':' +
		$('#gem2').val() + ':' +
		$('#gem3').val() + ':' +
		$('#gem4').val() + ':' +
		$('#suffixID').val() + ':' +
		$('#uniqueID').val() + ':' +
		$('#level').val() + ':' +
		$('#upgradeID').val() + ':' +
		$('#instanceDifficultyID').val() + ':' +
		$('#numBonusIDs').val();
		if($('#numBonusIDs').val()){
			var bonus = new Array();
			$('.bonusID').each(function(index){
				var val = $(this).val();
				if (val == ""){val = 0;}
				bonus[index] = val;
			})
			wowID = wowID + ':' + bonus.join(':');
		}

		//Create WoW Link
		var wowbaseurl = "http://eu.battle.net/wow/en/item/"+$('#itemID').val()+'/';
		if($('#numBonusIDs').val() == 0){
			wowbaseurl = wowbaseurl + 'raid-normal';
		} else {
			$('.bonusID').each(function(index){
	    		var val = $(this).val();
	    		if(val == 451){
	    			wowbaseurl = wowbaseurl + 'raid-finder';
	    			return false;
	    		}
	    		if(val == 449 || val == 566){
	    			wowbaseurl = wowbaseurl + 'raid-heroic';
	    			return false;
	    		}
	    		if(val == 450 || val == 567){
	    			wowbaseurl = wowbaseurl + 'raid-mythic';
	    			return false;
	    		}
			})
		}
		console.log(wowbaseurl);
		
		//Bring results to field:
		$('.result').html('<div class="form-group"><label for="instanceDifficultyID" class="col-sm-2 control-label">WoW Item-ID</label><div class="col-sm-10"><input type="text" class="form-control" value="'+wowID+'" readonly></div></div><div class="form-group"><label for="instanceDifficultyID" class="col-sm-2 control-label">WoW Armory URL</label><div class="col-sm-10"><a href="'+wowbaseurl+'">'+wowbaseurl+'</a></div></div>');
    }
    
    function buildWowheadItem(){
    	var mainid = $('#itemID').val();
    	var wowheadlink = "http://wod.wowhead.com/item="+mainid;
    	
    	var count = $('#numBonusIDs').val();
    	var bonusstring = "";
    	if(count > 0){
    		wowheadlink = wowheadlink + "&bonus=";
    		var bonusArray = new Array();
			$('.bonusID').each(function(index){
				var val = $(this).val();
				if (val == ""){val = 0;}
				bonusArray[index] = val;
			})
			var bonus = bonusArray.join(':');
			wowheadlink = wowheadlink + bonus;
			bonusstring = "bonus="+bonusArray.join(':');
    	}
    	//Bring results to field:
		$('.result').html('<div class="form-group"><label for="instanceDifficultyID" class="col-sm-2 control-label">Wowhead URL</label><div class="col-sm-10"><a href="'+wowheadlink+'" rel="'+bonusstring+'">'+wowheadlink+'</a></div></div>');
    
    }
    
    var action = "wowhead";
    
    $(document).ready(function(){
    	$("#numBonusIDs").on('change', function(){
    		buildBonusIdFields();
    	})
    	
    	$('.container').on('change', '.rebuildtrigger', function(){
    		if(action === 'wowhead'){
    			buildWoWItemID();
    		}
    		if(action === 'wow'){
    			buildWowheadItem();
    		}
    	});
    	
    	$('.btn-convert').on('click', function(){
    		var input = $('#input').val();
    		//var input = "113604:0:0:0:0:0:0:0:100:0:6:3:565:41:567";
    		if(input != ""){
    			if (input.indexOf("wowhead.com") >= 0){
    				action = "wowhead";
    				
    				//its an wowhead.com link
    				var parser = document.createElement('a');
    				parser.href = input;
    				 // Convert query string to object
    				searchObject = {},
					a = input.split('m/');
    				
    			    queries = a[1].split('&');
    			    for( i = 0; i < queries.length; i++ ) {
    			        split = queries[i].split('=');
    			        searchObject[split[0]] = split[1];
    			    }

    				var mainid = searchObject.item;
    				var bonusArray = searchObject.bonus.split(':');
    				var numBonusIDs = bonusArray.length;
    				
    				//Fill fields
    				$('#itemID').val(mainid);
    				$('#enchant').val(0);
    				$('#gem1').val(0);
    				$('#gem2').val(0);
    				$('#gem3').val(0);
    				$('#gem4').val(0);
    				$('#suffixID').val(0);
    				$('#uniqueID').val(0);
    				$('#level').val(0);
    				$('#upgradeID').val(0);
    				$('#instanceDifficultyID').val(0);
    				$('#numBonusIDs').val(numBonusIDs);
    				$('#numBonusIDs').trigger('change');
    				//fill bonus fields
    				$('.bonusID').each(function(index){
    		    		$(this).val(bonusArray[index]);
    				})
    				
    				//Bring them to template
    				buildWoWItemID();
    					
    			} else {
    				action = "wow";
    				
    				//its some kind of item id
    				var ids = input.split(':');
    				var mainid = ids[0];
    				
    				var wowheadlink = "http://wod.wowhead.com/item="+mainid;
    				var ench = ids[1]
    				var gem1 = ids[2];
    				var gem2 = ids[3];
    				var gem3 = ids[4];
    				var gem4 = ids[5];
    				var suffixID = ids[6];
    				var uniqueID = ids[7];
    				var level = ids[8];
    				var upgradeID = ids[9];
    				var instanceDifficultyID = ids[10];
    				var numBonusIDs = ids[11];
    				var bonusArray = new Array();
    				if(numBonusIDs > 0){
    					for(var i=0; i<numBonusIDs; i++){
    						var index = 12 + i;
    						bonusArray[i] = ids[index];
    					}
    				}

    				//Fill fields
    				$('#itemID').val(mainid);
    				$('#enchant').val(ench);
    				$('#gem1').val(gem1);
    				$('#gem2').val(gem2);
    				$('#gem3').val(gem3);
    				$('#gem4').val(gem4);
    				$('#suffixID').val(suffixID);
    				$('#uniqueID').val(uniqueID);
    				$('#level').val(level);
    				$('#upgradeID').val(upgradeID);
    				$('#instanceDifficultyID').val(instanceDifficultyID);
    				$('#numBonusIDs').val(numBonusIDs);
    				$('#numBonusIDs').trigger('change');
    				//fill bonus fields
    				$('.bonusID').each(function(index){
    		    		$(this).val(bonusArray[index]);
    				})
					
    				buildWowheadItem();
    			}
    			
    			
    		}
    	});

    })