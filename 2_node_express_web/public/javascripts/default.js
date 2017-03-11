
//LNB드롭다운 슬라이드메뉴
	$(document).ready(function(){
        $(".subtitle").click(function(){   
                 $('.lnb-sub1').slideUp();
                 $(this).next().slideDown();
         });
	});
//LNB 미디어쿼리적용시 슬라이드 숨김
	$(document).ready(function(){
 
 	$('#menu_open').click(function(){
 	$('#side_menu').animate({left:'0'}, 500);
 	});
 	$('#menu_close').click(function(){
  	$('#side_menu').animate({left:'-230px'}, 500);
 	});
	});

// TOOLTIP
  $(function() {
    $( document ).tooltip({
      position: {
        my: "center bottom-20",
        at: "center top",
        using: function( position, feedback ) {
          $( this ).css( position );
          $( "<div>" )
            .addClass( "arrow" )
            .addClass( feedback.vertical )
            .addClass( feedback.horizontal )
            .appendTo( this );
        }
      }
    });
  });

  //MAIN TAB
  $(function() {
    $( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $( "#tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
  });

  //MAIN TAB2
  $(function() {
    $( "#tabs2" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $( "#tabs2 li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
  });
  //POPUP TAB

  $(function() {
    $( "#tabs-pop" ).tabs({
      event: "mouseover"
    });
  });

  //DATEPICKER 
  $(function() {
    $( "#datepicker" ).datepicker({
      showOtherMonths: true,
      selectOtherMonths: true
    });
  });


  //DATEPICKER 2
  $(function() {
    $( "#datepicker2" ).datepicker({
      showOtherMonths: true,
      selectOtherMonths: true
    });
  });
  
//SLIDER
  $(function() {
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );
  });
  $(function() {
    $( "#slider-range-max" ).slider({
      range: "max",
      min: 1,
      max: 10,
      value: 2,
      slide: function( event, ui ) {
        $( "#amount1" ).val( ui.value );
      }
    });
    $( "#amount1" ).val( $( "#slider-range-max" ).slider( "value" ) );
  });
  $(function() {
    $( "#slider-range-max2" ).slider({
      range: "max",
      min: 1,
      max: 10,
      value: 2,
      slide: function( event, ui ) {
        $( "#amount2" ).val( ui.value );
      }
    });
    $( "#amount2" ).val( $( "#slider-range-max2" ).slider( "value" ) );
  });
  $(function() {
    $( "#slider-range2" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amount3" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount3" ).val( "$" + $( "#slider-range2" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range2" ).slider( "values", 1 ) );
  });

//MODAL OPEN CLOSE*/
function doLayerPopup() {
var layerPopup = document.getElementById("bw-modal");

if (layerPopup.style.display == "block") {
layerPopup.style.display = "none";
}else{
layerPopup.style.display = "block";
}
}

//MODAL OPEN CLOSE*/
function doLayerPopup2() {
var layerPopup = document.getElementById("bw-modal2");

if (layerPopup.style.display == "block") {
layerPopup.style.display = "none";
}else{
layerPopup.style.display = "block";
}
}

//MODAL OPEN CLOSE*/
function doLayerPopup3() {
var layerPopup = document.getElementById("bw-modal3");

if (layerPopup.style.display == "block") {
layerPopup.style.display = "none";
}else{
layerPopup.style.display = "block";
}
}