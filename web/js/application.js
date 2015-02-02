/**
 * Elimina le strutture di rendering extra create dalle librerie javascript aggiuntive
 * può capitare che alcuni plugin jQuery aggiungano strutture dom alla pagna per creare particolri
 * effetti (un esempio sono i plugin per la realizzazione dell'effetto lightbox) spesso questo codice tende a
 * proliferare ad ogni invocazie del plugin.
 * Se il plugin è utilizzato dalle CARD presenti nella pagina può provocare notevoli disastri.
 * Normalmente l'html aggiuntivo viene messo oltre l'ultimo tag presente nel body la funzione non fa altro che eliminare tutto l'html 
 * al di fuori del div con id="frame".
 */
function garbageExtraFrame(){
	$('body').children().each(function(){
		if($(this).attr('id')!='frame'){
			$(this).children().each(function(){
				$(this).remove();
			});
			$(this).remove();
		}
	});
};


/**
 * Copia i valori della form2 nella form1 generando gli input
 * @param form1 form di destinazione
 * @param form2 form da clonare
 */
function copyForm(form1,form2){
	//Form1 filling
	form2.find("input").each(function(){
		addHiddenToForm(form1,$(this).attr("name"),$(this).val());
	});
	form2.find("textarea").each(function(){
		addToForm(form1,$(this));
	});
	form2.find("select").each(function(){
		addHiddenToForm(form1,$(this).attr("name"),$(this).val());
	});
};


/**
 * Cancella il contenuto di una form 
 * @param form1 form da pulire
 */
function clearForm(form1){
	//Form1 clear
	form1.children().each(function(){
		$(this).remove();
	});
};

/**
 * Vuota gli input di una form
 * @param id
 */
function resetForm(id) { 
	   $(':text, :password, :file', '#'+id).val('');
	   $(':input,select option', '#'+id).removeAttr('checked').removeAttr('selected');
	   $('select option:first', '#'+id).attr('selected',true);
	}

/**
 * Copia un elemento in una form
 * @param form1 form destinazione
 * @param element elemento da aggiungere
 */
function addToForm(form1,element){
	var clone=element.clone();
	clone.val(element.val());
	clone.appendTo(form1);
};

/**
 * Aggiunge un parametro hidden ad una form
 * @param form1 la form a cui aggiungere il parametro
 * @param name il nome del campo nascosto
 * @param value il valore del campo
 */
function addHiddenToForm(form1,name,value){
	form1.append(
	        $('<input/>')
	            .attr('type', 'hidden')
	            .attr('name', name)
	            .val(value)
	    );
};

/**
 * Setta il valore in un input di una form
 * @param id l'id della form
 * @param input_name il nome del campo di input
 * @param value il valore da settare
 */
function setFormInput(id,input_name,value){
	$('#'+id+' [name="'+input_name+'"]').val(''+value);
}


/**
 * Formatta un numero in un currency value
 * @param number il numero da convertire
 * @param dp numero di cifre decimali
 * @param ts separatore migliaia
 * @param ds separatore decimali
 * @returns
 */
function formatCurrency( number,ts, ds,dp,force) {
	  //console.log(number);
	  var num = parseFloat( number ); 
	  var pw; //for IE
	  dp = parseInt( dp, 10 ); 
	  ts = ts || '.'; //Seperatore delle migliaia di default
	  ds = ds || ','; //Separatore decimali di default
	  force = force || false;
	  if(num != number && number!='-' && number!='+') {
		 return '';
	  } else{
		if(!isNaN( dp )){	
		 	toReplace=( 0.9 ).toFixed( 0 ) == '1' ? num.toFixed( dp ) : ( Math.round( num * ( pw = Math.pow( 10, dp ) || 1 ) ) / pw ).toFixed( dp );
		}else{
			toReplace=String(number);
		}
		if(toReplace.charAt( toReplace.length-1 ) == ".") {
			toReplace= toReplace.slice(0, -1);
			}
		value=toReplace.replace( /^(-?\d{1,3})((\d{3})*)(\.\d+)?$/, function( all, first, subsequence, dmp, dec ) {
						intPart=( first || '' ) + subsequence.replace( /(\d{3})/g, ts + '$1' );
						decPart="";
						if(dec!=undefined){
							if(dec!='.0' || force){
								decPart=dec.replace('.',ds);
							}
						}
			      		return  intPart+decPart;
			    } );
			return value;	
		}
	  };
	  

/**
 * Forza un testo a rispettare l'espressione regolare
 * @param text
 * @param regexp
 */	  
function forceToRegExp(text,regexp){
	
}


/**
 * Converte una stringa formattata come currency in un float
 * @param number il currency in formato stringa
 * @param ts il simbolo usato come separatore delle migliaia
 * @param ds il simbolo usato come separatore decimali
 * @returns la stringa convertita in float
 */
function currencyToNumber( number, ts, ds) {
	  ts = ts || ','; //thousands separator
	  ds = ds || '.';

	  number=number || '';

	  if(String(number).length==0){
			return '0';
	  }

	  regexp=new RegExp("[^\\d" + ds + "-]", "g");
	  number=number.replace(regexp,'');

	  if(ds != '.'){

		number=number.replace(ds,'.');
	  }

	  return parseFloat(number);
	};


/**
 * Sformatta un numero
 * @param number il currency in formato stringa
 * @param ts il simbolo usato come separatore delle migliaia
 * @param ds il simbolo usato come separatore decimali
 * @returns la stringa convertita in float
 */
function unformatNumber( number, ts, ds) {
	  ts = ts || ','; 
	  ds = ds || '.';
	  
	  result=number || '';

	  if(String(number).length==0){
			return '';
	  }

	  regexp=new RegExp("[^\\d" + ds + "-]", "g");
	  result=result.replace(regexp,'');

	  if(ds != '.'){
		  result=result.replace(ds,'.');
	  }

	  return result;
	};
	
/**
 * Chiama un evento registrato sulla pagina
 * @param ename nome evento
 */	
function callEvent(ename){
	jQuery.page.trigger(ename);
}


/**
 * Aggiunge un hidden ad una form
 * 
 */
function addHidden(formId,name,value){
	jQuery('#'+formId+' [name='+name+']').remove();
	jQuery('<input type="hidden" name="'+name+'" value="' + value + '" />').appendTo('#'+formId+'');
}


/**
 * Controlla la presenza di un evento già registrato in JQuery.page
 * @param name
 * @param fname
 * @returns {Boolean}
 */
function checkEvent(name,fname){
	var result=true;
	var binded = $.data( jQuery.page.get(0), 'events' );
	if(binded!=undefined){
		$.each( binded, function(i,o) {
			if(i==name){
				$.each( o, function(i,func){
					if(func.handler.name==fname){
						result=false;
					};
				});
			};
		});
	}
	return result;
}

/**
 * Data una stringa di valori separati da virgole es. 'uno,due,tre,ciccio' li splitta e controlla che siano
 * tutti presenti nell'array di stringhe passato come secondo argomento.
 * @param stringList
 * @param arrayvalue
 * @returns {Boolean}
 */
function isInArray( stringList, arrayvalue) {
	 var tocheck=stringList.split(",");
	 var res=false;
	 for (var check in tocheck) {  
		res=false;
		for(var index in arrayvalue){
			if(arrayvalue[index]==tocheck[check]){
				res=true;
			}
		}
	 if(!res) break;
	 };
	return res;
};


/**
 * Attivazione interazione modale
 */
function modalActivation(active){
	if(active){
    //Get the screen height and width
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
 
    //Set height and width to mask to fill up the whole screen
    $('#mask').css({'width':maskWidth,'height':maskHeight});
     
    //transition effect     
    //$('#mask').fadeIn(1000,0.8);    
    $('#mask').fadeTo("slow",0.2);  
	}else{
		$('#mask').hide();
	}
}

/**
 * Disegna i tag per il rotore di attesa predefinito
 * @param $ele il selettore jQuery a cui inserire i tag del rotore
 */
function drawRotor($ele){
	$ele.html('<div class="rotor"><div class="inner_rotor"><span>L</span><span>o</span><span>a</span><span>d</span><span>i</span><span>n</span><span>g</span></div></div>');
}


/**
 * cerca di filtrare l'inserimento via text field
 * @param input
 * @param e
 */
function inputTypeFormat(input,e) {
	var e = window.event || e;
	var keyUnicode = e.charCode || e.keyCode;
	if (e !== undefined) {
		switch (keyUnicode) {
			case 16: break; // Shift
			case 17: break; // Ctrl
			case 18: break; // Alt
			case 27: input.val(''); break; // Esc: clear entry
			case 35: break; // End
			case 36: break; // Home
			case 37: {// cursor left
				break;
			} 
			case 8: {// cursor left
				break;
			}
			case 38: {// cursor up
				break;
			} 
			case 39:{// cursor right
				break;
			} 
			case 40: {// cursor down
				break;
			} 
			case 78: break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
			case 110: break; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
			//case 190: {}; //.
			case 188: break; // , il separatore decimale
			default: {
				//Trasformazione in numero del contenuto dell'input
				numValue=unformatNumber( input.val(),'.', ',');
				value=formatCurrency(numValue,'.', ',',null,true);
				input.val(value);
			}
				
		}
	}
}


/**
 * Funzione per l'apertura del dialog di help
 */
function showHelp(type,page){
	  clearForm($("#help_page_form"));
	  addHiddenToForm($("#help_page_form"),"helpPage",page);
	  addHiddenToForm($("#help_page_form"),"cardType",type);
	  $('#visual_help_dialog').dialog('open');
}


/**
 * Funzione per il cambio di stati di un bottone JQuery UI
 */

function changeButtonStatus(button, active){
	if(active && button){
		button.removeAttr('disabled', 'disabled' ).removeClass( 'ui-state-disabled' );
	}else{
		button.attr('disabled', 'disabled' ).addClass( 'ui-state-disabled' );
	}
}



/**
 * Ritorna la lista degli id delle CARD presenti in una zona di inserimento
 * @param $zone selezione jquery
 * @returns {Array}
 */
function getCardsIdArray($zone){
 	var items = $zone.find(".card");
 	var ret = [];
 	items.each(function() { ret.push($(this).attr('id') || ''); });
 	return ret;
}








