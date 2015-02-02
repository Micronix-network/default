/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'rotor\'">' + entity + '</span>' + html;
	}
	var icons = {
			'rotor-spinner' : '&#xe000;',
			'rotor-spinner-2' : '&#xe001;',
			'rotor-spinner-3' : '&#xe002;',
			'rotor-spinner-4' : '&#xe003;',
			'rotor-spinner-5' : '&#xe004;',
			'rotor-spinner-6' : '&#xe005;',
			'rotor-cog' : '&#xe006;',
			'rotor-spin' : '&#xe007;',
			'rotor-spin-alt' : '&#xe008;',
			'rotor-movie' : '&#xe009;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/rotor-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};