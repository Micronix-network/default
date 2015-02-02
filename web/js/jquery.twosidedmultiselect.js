(function($) {

	// This script was written by Steve Fenton
	// http://www.stevefenton.co.uk/Content/Jquery-Two-Sided-Multi-Selector/
	// Feel free to use this jQuery Plugin
	// Version: 3.0.8
    // Contributions by: 
    //     Mat Schaffer (http://matschaffer.com/)
    //     Eric Van Bocxlaer

	var selectIds = new Array();
	var nameModifier = "multi_sel";
	var orderTimer;

	function AddDoubleClickEvents(targetName) {
        // Event handlers
	
		$("#" + targetName).live("dblclick", function() {
			$(this).children(":selected").remove().appendTo("#" + targetName + nameModifier);
			$("#" + targetName + nameModifier + " options").removeAttr("selected");
			OrderMyList();
			return false;
		});

		$("#" + targetName + nameModifier).live("dblclick", function() {
			$(this).children(":selected").remove().appendTo("#" + targetName);
			$("#" + targetName + nameModifier + " options").removeAttr("selected");
			OrderMyList();
			return false;
		});
	};
	
	function OrderMyList() {
		window.clearTimeout(orderTimer);
		orderTimer = window.setTimeout(OrderAllLists, 500);
	}
	
	function OrderAllLists() {
		for (var i = 0; i < selectIds.length; i++) {
			
			$("#" + selectIds[i] + nameModifier + " option").twosidedmultiselectsort( function (a, b) {
			    return parseInt($(a).attr("rel"), 10) > parseInt($(b).attr("rel"), 10) ? 1 : -1;
			});
			
			$("#" + selectIds[i] + " option").twosidedmultiselectsort( function (a, b){
			    return parseInt($(a).attr("rel"), 10) > parseInt($(b).attr("rel"), 10) ? 1 : -1;
			});
		}

		$("." + nameModifier + "select").each( function () {
			// IE6 Fix... http://support.microsoft.com/kb/276228
			var html = $(this).html();
			$(this).html(html);
		});
	}

	$.fn.twosidedmultiselect = function() {

		return this.each(function() {
		
			$This = $(this);

			var originalId = "";
			var originalName = "";
			var originalClass = "";
			var arrayName = "";
			var modifiedName = "";
	
			// Rename the old element and steal its name so the postback uses our element instead
			originalId = $This.attr("id");
			originalName = $This.attr("name");
			if (originalName.indexOf("[]") > -1) {
				arrayName = "[]";
				originalName = originalName.replace("[]", "");
			}
			
			// Allows existing classes to be maintained, useful for MVC validation classes
			originalClass = $This.attr("class");
			if (originalClass.length > 0) {
				originalClass = originalClass + " ";
			}
			
			// Fixes situations where the original name contains a colon - 
			var newName = originalName.replace(/:/g, '-').replace(/\./g, '-');
			
			var newId=originalId+nameModifier;
			
			modifiedName = newName + nameModifier;
			
			var size = $This.attr("size");
	
			selectIds[selectIds.length] = newName;
			
			var values = $This.children("option");
			for (var i = 0; i < values.length; i++) {
				$(values[i]).attr("rel", i);
				$(values[i]).attr("title", values[i].text.replace(/"/g, '').replace(/\'/g, ''));
			}
	
			$This.attr("id", newId).attr("name", modifiedName);
			
			// Create our element to hold the selections and the buttons for moving elements
			var htmlBlock = "<div class=\"" + nameModifier + "options\">" +
			"<p class=\"AddOne\" rel=\"" + originalId + "\" title=\"Add Selected\">&rsaquo;</p>" +
			"<p class=\"AddAll\" rel=\"" + originalId + "\" title=\"Add All\">&raquo;</p>" +
			"<p class=\"RemoveOne\" rel=\"" + originalId + "\" title=\"Remove Selected\">&lsaquo;</p>" +
			"<p class=\"RemoveAll\" rel=\"" + originalId + "\" title=\"Remove All\">&laquo;</p>" +
			"</div>" +
			"<div class=\"" + nameModifier + "select\">" +
			"<select name=\"" + originalName + "\" id=\"" + originalId + "\" size=\"" + size + "\"multiple=\"multiple\" size=\"8\" class=\"" + originalClass + "TakeOver\"></select>" +
			"</div>";
	
			$This.after(htmlBlock);
			$This.wrap("<div class=\"" + nameModifier + "select\" />");
			
			// Move existing selection to our elements
			$("#" + newId + " option:selected").remove().appendTo("#" + originalId);
			
			// Events
			
			AddDoubleClickEvents(originalId);
	
			$("." + nameModifier + "options .AddOne").click(function() {
				var targetName = $(this).attr("rel");
				$("#" + targetName + nameModifier + " option:selected").remove().appendTo("#" + targetName);
				OrderMyList();
				return false;
			});
			
			$("." + nameModifier + "options .AddAll").click(function() {
				var targetName = $(this).attr("rel");
				$("#" + targetName + nameModifier + " option").remove().appendTo("#" + targetName);
				OrderMyList();
				return false;
			});
			
			$("." + nameModifier + "options .RemoveOne").click(function() {
				var targetName = $(this).attr("rel");
				$("#" + targetName + " option:selected").remove().appendTo("#" + targetName + nameModifier);
				OrderMyList();
				return false;
			});
			
			$("." + nameModifier + "options .RemoveAll").click(function() {
				var targetName = $(this).attr("rel");
				$("#" + targetName + " option").remove().appendTo("#" + targetName + nameModifier);
				OrderMyList();
				return false;
			});
		});
	};
	
	$.fn.twosidedmultiselectsort = (function(){
	    var sort = [].sort;
	    return function(comparator, getSortable) {
	        getSortable = getSortable || function(){return this;};
	        var placements = this.map(function(){
	            var sortElement = getSortable.call(this), parentNode = sortElement.parentNode, nextSibling = parentNode.insertBefore(
	                    document.createTextNode(''),
	                    sortElement.nextSibling
	                );
	            
	            return function() {
	                if (parentNode === this) {
	                    // Fail!
	                } else {
		                // Insert before flag:
		                parentNode.insertBefore(this, nextSibling);
		                // Remove flag:
		                parentNode.removeChild(nextSibling);
						 }
	            };
	        });
	        return sort.call(this, comparator).each(function(i){
	            placements[i].call(getSortable.call(this));
	        });
	    };
	})();
	
})(jQuery);