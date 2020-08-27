am4core.ready(function() {
  
    am4core.useTheme(am4themes_animated);
  

    var chart = am4core.create("chartdiv", am4maps.MapChart);
    chart.geodata = am4geodata_worldLow;
    chart.projection = new am4maps.projections.Miller();
    chart.homeZoomLevel = 2.5;
    chart.homeGeoPoint = {
        latitude: 36.031332,
        longitude: 52.307617
    };
    

    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.mapPolygons.template.fill = am4core.color("#00000000");
    polygonSeries.mapPolygons.template.nonScalingStroke = true;
    polygonSeries.exclude = ["AQ"];
   
    var cities = chart.series.push(new am4maps.MapImageSeries());
    cities.mapImages.template.nonScaling = true;
    
    var city = cities.mapImages.template.createChild(am4core.Circle);
    city.radius = 6;
    city.fill = chart.colors.getIndex(0).brighten(-0.2);
    city.strokeWidth = 2;
    city.stroke = am4core.color("#fff");
    
    function addCity(coords, title) {
        var city = cities.mapImages.create();
        city.latitude = coords.latitude;
        city.longitude = coords.longitude;
        city.tooltipText = title;
        return city;
    }
    
    var France = addCity({ "latitude": 46.2276, "longitude": 2.2137 }, "France");
    var Ambala = addCity({ "latitude": 30.378180, "longitude": 76.776695 }, "Ambala");
    var lineSeries = chart.series.push(new am4maps.MapArcSeries());
    lineSeries.mapLines.template.line.strokeWidth = 2;
    lineSeries.mapLines.template.line.strokeOpacity = 0.5;
    lineSeries.mapLines.template.line.stroke = city.fill;
    lineSeries.mapLines.template.line.nonScalingStroke = true;
    lineSeries.mapLines.template.line.strokeDasharray = "1,1";
    lineSeries.zIndex = 10;
    
    var shadowLineSeries = chart.series.push(new am4maps.MapLineSeries());
    shadowLineSeries.mapLines.template.line.strokeOpacity = 0;
    shadowLineSeries.mapLines.template.line.nonScalingStroke = true;
    shadowLineSeries.mapLines.template.shortestDistance = false;
    shadowLineSeries.zIndex = 5;
    
    function addLine(from, to) {
        var line = lineSeries.mapLines.create();
        line.imagesToConnect = [from, to];
        line.line.controlPointDistance = -0.3;
    
        var shadowLine = shadowLineSeries.mapLines.create();
        shadowLine.imagesToConnect = [from, to];
    
        return line;
    }
    
    addLine(France, Ambala);

    
    var plane = lineSeries.mapLines.getIndex(0).lineObjects.create();
    plane.position = 0;
    plane.width = 48;
    plane.height = 48;
    
    plane.adapter.add("scale", function(scale, target) {
        return 0.5 * (1 - (Math.abs(0.5 - target.position)));
    })
    
    var planeImage = plane.createChild(am4core.Sprite);
    planeImage.scale = 0.08;
    planeImage.horizontalCenter = "middle";
    planeImage.verticalCenter = "middle";
    planeImage.path = "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47";
    planeImage.fill = am4core.color("#000000");
    planeImage.strokeOpacity = 0;
    
    var shadowPlane = shadowLineSeries.mapLines.getIndex(0).lineObjects.create();
    shadowPlane.position = 0;
    shadowPlane.width = 48;
    shadowPlane.height = 48;
    
    var shadowPlaneImage = shadowPlane.createChild(am4core.Sprite);
    shadowPlaneImage.scale = 0.05;
    shadowPlaneImage.horizontalCenter = "middle";
    shadowPlaneImage.verticalCenter = "middle";
    shadowPlaneImage.path = "m2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47";
    shadowPlaneImage.fill = am4core.color("#000");
    shadowPlaneImage.strokeOpacity = 0;
    
    shadowPlane.adapter.add("scale", function(scale, target) {
        target.opacity = (0.6 - (Math.abs(0.5 - target.position)));
        return 0.5 - 0.3 * (1 - (Math.abs(0.5 - target.position)));
    })
    

    var currentLine = 0;
    var direction = 1;
    function flyPlane() {
    

        plane.mapLine = lineSeries.mapLines.getIndex(currentLine);
        plane.parent = lineSeries;
        shadowPlane.mapLine = shadowLineSeries.mapLines.getIndex(currentLine);
        shadowPlane.parent = shadowLineSeries;
        shadowPlaneImage.rotation = planeImage.rotation;

        var from, to;
        var numLines = lineSeries.mapLines.length;

      
        if (direction == 1) {
            from = 0
            to = 1;
            if (planeImage.rotation != 0) {
                planeImage.animate({ to: 0, property: "rotation" }, 1000).events.on("animationended", flyPlane);
                return;
            }
        } 
  
        var animation = plane.animate({
            from: from,
            to: to,
            property: "position"
        }, 5000, am4core.ease.sinInOut);
       
    
        shadowPlane.animate({
            from: from,
            to: to,
            property: "position"
        }, 5000, am4core.ease.sinInOut);
    
        
    }
    $.wait = function( callback, seconds){
        return window.setTimeout( callback, seconds);
     }
    $(".rfcount").hide();
    var count =0;
    $("#rftest").click(function(){
        count++;
        flyPlane();
        $.wait( function(){ 
            $(".rfcount").text(count + " Rafale(s) Delivered to India");
            $(".rfcount").show();
        }, 4999);
        
       
      
        if(count==5){
        $.wait( function(){ 
            alert("Rafale successfully delivered to India!");
            location.reload();
        }, 5002);
        }
    
        

       
    });  
    
    });