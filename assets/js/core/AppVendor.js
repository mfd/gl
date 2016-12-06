(function(namespace, $) {
	"use strict";

	var AppVendor = function() {
		// Create reference to this instance
		var o = this;
		// Initialize app when document is ready
		$(document).ready(function() {
			o.initialize();
		});

	};
	var p = AppVendor.prototype;

	// =========================================================================
	// INIT
	// =========================================================================

	p.initialize = function() {
		this._initAjaxModals();
		this._initScroller();
		this._initTabs();
		this._initTooltips();
		this._initPopover();
		this._initSortables();
	};

	// =========================================================================
	// MODAL
	// =========================================================================

	p._initAjaxModals = function () {
    var ll = '<div class="loading-spinner"><div class="ps_loader"><span class="p">+</span><span>ps</span></div></div>';
    $.fn.modal.defaults.spinner = $.fn.modalmanager.defaults.spinner = ll;


		$('.ajmodal').click(function (e) {
	   	var url = $(this).attr('href');
	   	var wth = $(this).attr('data-wth');
	   	$.fn.modal.defaults.width = wth;
	   	//console.log($.fn.modal.defaults.width);

			$(this).data('bs.modal', null);
			$('body').modalmanager('loading');
			
			setTimeout(function(){
				$.get(url, function (data) {
					var $modal = 
						$('<div id="ajm_' + Math.floor(Math.random()*100000) + 
							'" class="modal fade ' + ( wth ? '' : 'container' ) + '" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog">' + data + '</div>');
							//'" class="modal fade ' + (wth?'':'container') + '" tabindex="-1" role="dialog">' + data + '</div>');

					//var modal = $('<div id="ajm" class="modal fade container" tabindex="-1" role="dialog">' + data + '</div>');
					$modal.modal();
					console.log('open', url);

			      ModalAnim('zoomIn');

						materialadmin.DemoTableDynamic._zaya_offers('#offers_list2');
						materialadmin.DemoTableDynamic._zaya_offers_inwork('#offers_list2_inwork');
				  	materialadmin.AppOffcanvas.initialize();
						materialadmin.FormComponents.initialize();
						materialadmin.AppVendor._initScroller();
						materialadmin.AppVendor._initTabs();
						//materialadmin.AppVendor._initAjaxModals();

					function ModalAnim(x) {
					    var th = $('.modal .modal-dialog');
					    th.attr('class', th.attr('class') + ' ' + x + ' animated');
					};


					$modal.on("hidden.bs.modal", function () {
						console.log('close',$(this));
						ModalAnim('zoomOut');
						$(this).removeData('bs.modal');
						materialadmin.AppOffcanvas.initialize();
					});

					$modal.on('click', '.update', function(){
					  //$modal.modal('loading');
					  setTimeout(function(){
					    $modal
					      //.modal('loading')
					      .find('.modal-body')
					        .prepend('<div class="alert alert-info fade in">' +
					          'Updated!<button type="button" class="close" data-dismiss="alert">&times;</button>' +
					        '</div>');
					  }, 10000);
					});

    $('button[data-target="myModalZ"]').click(function(){
        $('#myModalZ').modal('show');
    });


	 				}); //get

			}, 1000);
			return false;
			//e.preventDefault();

	 });

	};

	p._initAjaxModals__ = function () {
			var $modal = $('#ajax-modal');

		    var ll = 
		      '<div class="loading-spinner" style="width: 200px; margin-left: -100px;">' +
		        '<div class="progress progress-striped active">' +
		          '<div class="progress-bar" style="width: 100%;"></div>' +
		        '</div>' +
		      '</div>';

		    var ll = '<div class="loading-spinner" style=""><div class="ps_loader"><span class="p">+</span><span>ps</span></div></div>';
		    $.fn.modal.defaults.spinner = $.fn.modalmanager.defaults.spinner = ll;

		    $.fn.modalmanager.defaults.resize = true;
					 
					$('body').on('click', '.ajax .btn, .ajmodal', function(){
					  // create the backdrop and wait for next modal to be triggered
					  $('body').modalmanager('loading');
					 	var page = $(this).data('page');
					  setTimeout(function(){
					     $modal.load(page, '', function(){
					     		$modal.modal();

								  	materialadmin.AppOffcanvas.initialize();
							  		materialadmin.AppVendor.initialize();
							  		materialadmin.FormComponents.initialize();
							  		materialadmin.DemoTableDynamic._zaya_offers('#offers_list2');
									var tables = $.fn.dataTable();

									tables.fnClearTable();
									tables.fnDraw();
									tables.fnDestroy();

						  		console.log($.fn.dataTable.fnTables(true));


									$modal.on('show.bs.modal', function (e) {


									});
									$modal.on('hidden.bs.modal', function (e) {
										//$('.modal-scrollable').remove();
										//console.log('modal close');

										//materialadmin.AppOffcanvas.initialize();
										//materialadmin.AppVendor.initialize();
										$(this).removeData('bs.modal');
										console.log(this);

										// var tables = $.fn.dataTable.fnTables(true);

										// $(tables).each(function () {
										//     $(this).dataTable().fnDestroy(true);
										// });


									  });

					    });
					 	 }, 1000);
					});
					 
					$modal.on('click', '.update', function(){
					  $modal.modal('loading');
						setTimeout(function(){
							console.log('prepend');
							console.log($modal.length);

							$modal
							.modal('loading')
							.find('.modal-body')
							.prepend('<div class="alert alert-info fade in">' +
								'UPD!<button type="button" class="close" data-dismiss="alert">&times;</button>' +
								'</div>');
						}, 1000);
					});


					// $('.ajmodal').on('click', function(){
					// 	var modal =$(this).data('target');
					// 	var hr = $(this).attr("href");
					// 	//var $modal = $('#ajax-modal');

					//   // create the backdrop and wait for next modal to be triggered
					//   $('body').modalmanager('loading');

					//   $(modal).on('shown.bs.modal', function (e) {
					//   	console.log('Модальное окно успешно показано!');
					//   });

					//   setTimeout(function(){
					//   	$(modal).load(hr, '', function(){
					//   		$(modal).modal();
					//   		materialadmin.AppOffcanvas.initialize();
					//   		materialadmin.AppVendor.initialize();
					//   		materialadmin.FormComponents.initialize();
					// 		      //console.log(materialadmin.FormComponents.initialize);
					// 					//materialadmin.AppVendor._initTabs();
					// 				});
					//   }, 100);
					// });
	};
	// =========================================================================
	// SCROLLER
	// =========================================================================

	p._initScroller = function () {
		if (!$.isFunction($.fn.nanoScroller)) {
			return;
		}

		$.each($('.scroll'), function (e) {
			var holder = $(this);
			materialadmin.AppVendor.addScroller(holder);
		});

		materialadmin.App.callOnResize(function () {
			$.each($('.scroll-xs'), function (e) {
				var holder = $(this);
				if(!holder.is(":visible")) return;
				
				if (materialadmin.App.minBreakpoint('xs')) {
					materialadmin.AppVendor.removeScroller(holder);
				}
				else {
					materialadmin.AppVendor.addScroller(holder);
				}
			});

			$.each($('.scroll-sm'), function (e) {
				var holder = $(this);
				if(!holder.is(":visible")) return;
				
				if (materialadmin.App.minBreakpoint('sm')) {
					materialadmin.AppVendor.removeScroller(holder);
				}
				else {
					materialadmin.AppVendor.addScroller(holder);
				}
			});

			$.each($('.scroll-md'), function (e) {
				var holder = $(this);
				if(!holder.is(":visible")) return;
				
				if (materialadmin.App.minBreakpoint('md')) {
					materialadmin.AppVendor.removeScroller(holder);
				}
				else {
					materialadmin.AppVendor.addScroller(holder);
				}
			});

			$.each($('.scroll-lg'), function (e) {
				var holder = $(this);
				if(!holder.is(":visible")) return;
				
				if (materialadmin.App.minBreakpoint('lg')) {
					materialadmin.AppVendor.removeScroller(holder);
				}
				else {
					materialadmin.AppVendor.addScroller(holder);
				}
			});
		});
};

p.addScroller = function (holder) {
	holder.wrap('<div class="nano"><div class="nano-content"></div></div>');

	var scroller = holder.closest('.nano');
	scroller.css({height: holder.outerHeight()});
	// Add the nanoscroller
	scroller.nanoScroller({preventPageScrolling: true});
	console.log(holder.outerHeight());

	holder.css({height: 'auto'});
};

p.removeScroller = function (holder) {
	if (holder.parent().parent().hasClass('nano') === false) {
		return;
	}

	holder.parent().parent().nanoScroller({destroy: true});

	holder.parent('.nano-content').replaceWith(holder);
	holder.parent('.nano').replaceWith(holder);
	holder.attr('style', '');
};

	// =========================================================================
	// SORTABLE
	// =========================================================================

	p._initSortables = function () {
		if (!$.isFunction($.fn.sortable)) {
			return;
		}

		$('[data-sortable="true"]').sortable({
			placeholder: "ui-state-highlight",
			delay: 100,
			start: function (e, ui) {
				ui.placeholder.height(ui.item.outerHeight() - 1);
			}
		});

	};
	
	// =========================================================================
	// TABS
	// =========================================================================

	p._initTabs = function () {
		if (!$.isFunction($.fn.tab)) {
			return;
		}
		$('[data-toggle="tabs"] a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
		});

		$('.showtab').click(function(e){
			e.preventDefault();
			$('a[href="' + $(this).attr("href") + '"]').tab('show');
        //$('a[href="#login"]').tab('show');
    })

			// Открытие таба из урл-хеша
			// var hash = document.location.hash;
			// var prefix = "tab_";
			// if (hash) {
			//     $('.nav-tabs a[href='+hash.replace(prefix,"")+']').tab('show');
			// } 

			// // Change hash for page-reload
			// $('.nav-tabs a').on('shown.bs.tab', function (e) {
			//     window.location.hash = e.target.hash.replace("#", "#" + prefix);
			// });


	};
	
	// =========================================================================
	// TOOLTIPS
	// =========================================================================

	p._initTooltips = function () {
		if (!$.isFunction($.fn.tooltip)) {
			return;
		}
		$('[data-toggle="tooltip"]').tooltip({container: 'body'});
	};

	// =========================================================================
	// POPOVER
	// =========================================================================

	p._initPopover = function () {
		if (!$.isFunction($.fn.popover)) {
			return;
		}
		$('[data-toggle="popover"]').popover({container: 'body'});
	};
	
	// =========================================================================
	// DEFINE NAMESPACE
	// =========================================================================

	window.materialadmin.AppVendor = new AppVendor;
}(this.materialadmin, jQuery)); // pass in (namespace, jQuery):