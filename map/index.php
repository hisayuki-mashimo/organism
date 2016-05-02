<!DOCTYPE html>
<html>
    <head>
        <link type="text/css" rel="stylesheet" href="style/style.css" />
    </head>
    <body>
        <div id="map">
            <table id = "map_matrix"></table>
            <div id="map_gauze">　</div>
        </div>

        <script type="text/javascript">
            var maps_data = new Array();

            var map_object      = document.getElementById('map_matrix');
            var map_object_body = document.createElement('tbody');
            map_object.appendChild(map_object_body);

            for (var ver = 0; ver < 50; ver ++) {
                var map_object_tr = document.createElement('tr');
                map_object_body.appendChild(map_object_tr);

                maps_data[ver] = new Array();

                for (var nex = 0; nex < 50; nex ++) {
                    var map_object_td = document.createElement('td');
                    map_object_td.innerHTML = '　';
                    map_object_tr.appendChild(map_object_td);

                    maps_data[ver][nex] = {
                        condition:   0,
                        coefficient: 0,
                        object:      map_object_td
                    };
                }
            }

            var lands = new Array();
            for (var i = 0; i < 3; i ++) {
                lands[i] = {
                    ver:   Math.floor(Math.random() * 50),
                    nex:   Math.floor(Math.random() * 50),
                    scale: Math.floor(Math.random() * 5) + 2
                };
            }

            var map_gauze = document.getElementById('map_gauze');
            map_gauze.onmousedown = function(event){
                //$(this.maze).find('.navigated').removeClass('navigated');

                //var id_ver = Math.floor((event.clientY - this.absolute_top) / 15);
                //var id_nex = Math.floor((event.clientX - this.absolute_lft) / 15);
                var ver = Math.floor((event.pageY - 10) / 10);
                var nex = Math.floor((event.pageX - 10) / 10);
                maps_data[ver][nex].object.className = 'decided';
                
            };

            function caluclateType(ver, nex)
            {
                for (var i = 0; i < 3; i ++) {
                    var land = lands[i];
                    var distance_ver = Math.pow(Math.abs(land.ver - ver), 2);
                    var distance_nex = Math.pow(Math.abs(land.nex - nex), 2);
                    var distance     = Math.pow((distance_ver + distance_nex), 1 / 2);
                }

                var suburbs = [
                    {ver: ver - 1, nex: nex},
                    {ver: ver, nex: nex + 1},
                    {ver: ver + 1, nex: nex},
                    {ver: ver, nex: nex - 1}
                ];
                for (var i = 0; i < 4; i ++) {
                    var suburb = suburbs[i];
                    if (maps_data[suburb[ver]][suburb[nex]] !== undefined) {
                        
                    }
                }
            }
        </script>
    </body>
</html>
