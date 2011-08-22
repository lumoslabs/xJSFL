﻿// ------------------------------------------------------------------------------------------------------------------------
//
//                                                                                   ██   ██     ██   ██   
//  ██  ██                       ██████       ██              ██                    ██  ██████ ██████  ██  
//  ██  ██                       ██           ██              ██                   ██   ██     ██       ██ 
//  ██ █████ █████ ████████      ██     █████ ██ █████ █████ █████ █████ ████      ██   ██     ██       ██ 
//  ██  ██   ██ ██ ██ ██ ██      ██████ ██ ██ ██ ██ ██ ██     ██   ██ ██ ██        ██   ██████ ██████   ██ 
//  ██  ██   █████ ██ ██ ██          ██ █████ ██ █████ ██     ██   ██ ██ ██        ██       ██     ██   ██ 
//  ██  ██   ██    ██ ██ ██          ██ ██    ██ ██    ██     ██   ██ ██ ██        ██       ██     ██   ██ 
//  ██  ████ █████ ██ ██ ██      ██████ █████ ██ █████ █████  ████ █████ ██         ██  ██████ ██████  ██  
//                                                                                   ██   ██     ██   ██   
//
// ------------------------------------------------------------------------------------------------------------------------
// Item Selector ($$) - CSS-style selection of items in the Libray panel

	/**
	 * Item selector function
	 * 
	 * @param	expression	{String}	A String expression
	 * @param	context		{String}	A path to a library Item
	 * @param	context		{Item}		A library Item
	 * @param	context		{Context}	A Context object with a valid item property
	 * @returns				{Array}		An array of library Items
	 */
	$$ = function(expression, context)
	{
		// --------------------------------------------------------------------------------
		// recursively handle multiple rules
		
			var expressions	= xjsfl.utils.trim(expression).split(/,/g);
			var items		= [];
			if(expressions.length > 1)
			{
				// callback
					for(var i = 0; i < expressions.length; i++)
					{
						items = items.concat($$(expressions[i], context).elements);
					}
				
				// ensure items are unique
					items = xjsfl.utils.toUniqueArray(items);
					
				// return
					return new ItemCollection(items);
			}
				
		// --------------------------------------------------------------------------------
		// setup
		
			// reference to library
				var dom	= xjsfl.get.dom()
				if( ! dom)
				{
					return null;
				}
				var library		= dom.library;
				
		// --------------------------------------------------------------------------------
		// resolve context
		
			// check context is a library item or valid path
				if(context)
				{
					if(typeof context === 'string')
					{
						var index	= library.findItemIndex(String(context));
						context		= index != '' ? library.items[index] : null;
					}
					else if(context instanceof LibraryItem)
					{
						context = context;
					}
					else if(context instanceof Context)
					{
						if(context.item)
						{
							context = context.item;
						}
						else
						{
							throw new Error('Library Selector Error: item not set on supplied Context object');
						}
					}
					else
					{
						throw new Error('Library Selector Error: invalid context supplied');
					}
				}
				
		// --------------------------------------------------------------------------------
		// calculate selection and return
		
			// grab items
				items		= context ? Selectors.tests.items.find.decendents(library.items, context) : library.items;
	
			// filter items
				items		= Selectors.select(expression, items, library);
				
			// return
				return new ItemCollection(items);
	}
	
	$$.toString = function()
	{
		return '[function $$]';
	}

	xjsfl.classes.register('$$', $$);