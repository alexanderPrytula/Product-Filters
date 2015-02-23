/* Filters.js */

	// initialize variables
	
	var selQuan = document.querySelector('.filters-select-quantity'),
		selAct = document.querySelector('.filters-select-actions'),
		parentElem = document.querySelector('.filters-parent-elem'),
		childrenElems = parentElem.children,
		childNames = document.querySelectorAll('.filters-item-name'),
		childPrices = document.querySelectorAll('.filters-item-price');
		
	var isMatch = document.documentElement.webkitMatchesSelector;
	
	// catch errors
	
	try {
		if( !isMatch.call(selQuan, 'select') ) {
			throw new Error('!!!"filters-select-quantity" class\'s element is not a select!!!');
		}
	} catch(e) {
		console.log( e.message );
	}
	
	try {
		if( !isMatch.call(selAct, 'select') ) {
			throw new Error('!!!"filters-select-actions" class\'s element is not a select!!!');
		}
	} catch(e) {
		console.log( e.message );
	}
	
	// attach events
	
	selQuan.addEventListener('change', function() {
		var val = +selQuan.value;
		applyFilters.quantityFilter( val );
	});
			
	selAct.addEventListener('change', function() {
		var val = selAct.value;
		
		switch( val ) {
			case 'min2max':
				applyFilters.min2max();
				break;
			case 'max2min':
				applyFilters.max2min();
				break;
			default:
				break;
		}
	});
	
	// applying filters
	
	var applyFilters = {
		selected: topQuanValue,
		
		set: [],
		
		getSet: function() {
			this.set = [];
			
			for(var i=0; i<childrenElems.length; i++) {
				if( i < this.selected ) {
					this.set.push( childrenElems[i] );
				}
			}
		},
		
		getPrices: function( set ) {
			var arr = set.map(function(item, i) {
				return +item.querySelector('.filters-item-price').innerHTML;
			});
			return arr;
		},
		
		quantityFilter: function( v ) {
			for(var i=0; i<childrenElems.length; i++) {
				childrenElems[i].removeAttribute('style');
				if ( i >= v ) {
					childrenElems[i].style.display = 'none';
				}
				this.selected = v;
			}
		},
		
		min2max: function() {
			this.getSet();
			var prices = this.getPrices( this.set );
			prices.sort(function(a, b) {
				return a - b;
			});
			
			var filtered = new Array( this.selected );
			
			outer:
			for(var i=0; i<this.set.length; i++) {
				var itemPrice = +this.set[i].querySelector('.filters-item-price').innerHTML;
				for(var j=0; j<prices.length; j++) {
					if( itemPrice == prices[j] ) {
						
						prices.splice(j, 1, '');
						filtered[j] = this.set[i];
						continue outer;
						
					}
				}
			}
			
			this.fill( filtered );
			
		},
		
		max2min: function() {
			this.getSet();
			var prices = this.getPrices( this.set );
			prices.sort(function(a, b) {
				return b - a;
			});
			
			var filtered = new Array( this.selected );
			
			outer:
			for(var i=0; i<this.set.length; i++) {
				var itemPrice = +this.set[i].querySelector('.filters-item-price').innerHTML;
				for(var j=0; j<prices.length; j++) {
					if( itemPrice == prices[j] ) {
						
						prices.splice(j, 1, '');
						filtered[j] = this.set[i];
						continue outer;
						
					}
				}
			}
			
			this.fill( filtered );
			
		},
		
		fill: function( f ) {
			var lastSelectValue = +selQuan.lastElementChild.value;                  // last elem - no hidden elem in parent
			
			if( this.selected == lastSelectValue ) {
				parentElem.innerHTML = '';
				
				for(var i=0; i<f.length; i++) {
					parentElem.appendChild( f[i] );
				}
			} else {
				for(var i=0; i<childrenElems.length; i++) {
					if( !childrenElems[i].hasAttribute('style') ) {
						parentElem.removeChild( childrenElems[i] );
					}
				}
				
				for(var i=0; i<f.length; i++) {
					parentElem.insertBefore( f[i], parentElem.querySelector('[style="display: none;"]') );
				}
			}
		}
		
	};
	
	// default quantity
	
	var topQuanValue = +selQuan.firstElementChild.innerHTML;
	applyFilters.quantityFilter( topQuanValue );
	
/* Filters.js End */